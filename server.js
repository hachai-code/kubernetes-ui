import express from "express";
import { fileURLToPath } from "node:url";

const K8S_PROXY = process.env.K8S_PROXY ?? "http://localhost:8001";
const PORT = process.env.PORT ?? 4000;

export const normNamespace = (ns) => ({
  name: ns.metadata.name,
  phase: ns.status?.phase,
});

export function deploymentHealth(d) {
  const desired = d.spec?.replicas ?? 0;
  const ready = d.status?.readyReplicas ?? 0;
  const available = d.status?.availableReplicas ?? 0;
  const progressing = (d.status?.conditions ?? []).find(
    (condition) => condition.type === "Progressing",
  );
  const stuck = progressing?.status === "False"; // ProgressDeadlineExceeded

  if (desired === 0) return "green";
  if (stuck || available === 0) return "red";
  if (ready >= desired) return "green";
  return "amber";
}

export const normDeployment = (d) => ({
  name: d.metadata.name,
  ready: d.status?.readyReplicas ?? 0,
  desired: d.spec?.replicas ?? 0,
  image: d.spec?.template?.spec?.containers?.[0]?.image,
  created: d.metadata.creationTimestamp,
  health: deploymentHealth(d),
  labels: d.metadata.labels ?? {},
});

export const normPod = (p) => ({
  name: p.metadata.name,
  phase: p.status?.phase,
  restarts: (p.status?.containerStatuses ?? []).reduce(
    (sum, container) => sum + (container.restartCount ?? 0),
    0,
  ),
  labels: p.metadata.labels ?? {},
});

async function fetchK8s(path) {
  const res = await fetch(K8S_PROXY + path);
  if (!res.ok) throw new Error(`upstream ${res.status}`);
  return res.json();
}

const app = express();

const route = (handler) => async (req, res) => {
  try {
    const result = await handler(req, res);
    if (!res.headersSent) res.json(result);
  } catch (err) {
    res.status(502).json({ error: `kubectl proxy unreachable: ${err.message}` });
  }
};

const requireNamespace = (req, res) => {
  const ns = req.query.namespace;
  if (!ns) res.status(400).json({ error: "namespace is required" });
  return ns;
};

app.get(
  "/api/namespaces",
  route(async () => {
    const { items } = await fetchK8s("/api/v1/namespaces");
    return items.map(normNamespace);
  }),
);

app.get(
  "/api/deployments",
  route(async (req, res) => {
    const ns = requireNamespace(req, res);
    if (!ns) return;
    const { items } = await fetchK8s(
      `/apis/apps/v1/namespaces/${encodeURIComponent(ns)}/deployments`,
    );
    return items.map(normDeployment);
  }),
);

app.get(
  "/api/pods",
  route(async (req, res) => {
    const ns = requireNamespace(req, res);
    if (!ns) return;
    const selector = req.query.selector
      ? `?labelSelector=${encodeURIComponent(req.query.selector)}`
      : "";
    const { items } = await fetchK8s(
      `/api/v1/namespaces/${encodeURIComponent(ns)}/pods${selector}`,
    );
    return items.map(normPod);
  }),
);

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORT, () => console.log(`proxy listening on :${PORT} → ${K8S_PROXY}`));
}
