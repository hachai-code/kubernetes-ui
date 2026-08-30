import { test } from "node:test";
import assert from "node:assert/strict";
import { normNamespace, normDeployment, normPod, deploymentHealth, podStatus } from "./server.js";

const deploy = ({ desired, ready, available, progressing }) => ({
  spec: { replicas: desired },
  status: {
    readyReplicas: ready,
    availableReplicas: available,
    conditions: progressing ? [{ type: "Progressing", status: progressing }] : [],
  },
});

test("deploymentHealth: green when ready equals desired", () => {
  assert.equal(
    deploymentHealth(deploy({ desired: 3, ready: 3, available: 3, progressing: "True" })),
    "green",
  );
});

test("deploymentHealth: amber while converging", () => {
  assert.equal(
    deploymentHealth(deploy({ desired: 3, ready: 1, available: 1, progressing: "True" })),
    "amber",
  );
});

test("deploymentHealth: red when rollout is stuck (ProgressDeadlineExceeded)", () => {
  assert.equal(
    deploymentHealth(deploy({ desired: 1, ready: 0, available: 0, progressing: "False" })),
    "red",
  );
});

test("deploymentHealth: red when nothing is available", () => {
  assert.equal(
    deploymentHealth(deploy({ desired: 2, ready: 0, available: 0, progressing: "True" })),
    "red",
  );
});

test("deploymentHealth: green when scaled to zero", () => {
  assert.equal(deploymentHealth(deploy({ desired: 0 })), "green");
});

test("normNamespace pulls name and phase", () => {
  assert.deepEqual(
    normNamespace({ metadata: { name: "default" }, status: { phase: "Active" } }),
    { name: "default", phase: "Active" },
  );
});

test("normDeployment defaults missing replica counts to 0", () => {
  assert.deepEqual(
    normDeployment({
      metadata: {
        name: "web",
        labels: { app: "web" },
        creationTimestamp: "2026-08-01T00:00:00Z",
      },
      spec: {
        replicas: 3,
        template: { spec: { containers: [{ image: "nginx:1.27" }] } },
      },
      status: {},
    }),
    {
      name: "web",
      ready: 0,
      desired: 3,
      image: "nginx:1.27",
      created: "2026-08-01T00:00:00Z",
      health: "red",
      selector: {},
      labels: { app: "web" },
    },
  );
});

test("podStatus surfaces a container's waiting reason over Running phase", () => {
  assert.equal(
    podStatus({
      status: {
        phase: "Running",
        containerStatuses: [{ state: { waiting: { reason: "CrashLoopBackOff" } } }],
      },
    }),
    "CrashLoopBackOff",
  );
});

test("podStatus falls back to phase for a healthy pod", () => {
  assert.equal(
    podStatus({ status: { phase: "Running", containerStatuses: [{ state: { running: {} } }] } }),
    "Running",
  );
});

test("podStatus reports Terminating when deletionTimestamp is set", () => {
  assert.equal(
    podStatus({ metadata: { deletionTimestamp: "2026-08-01T00:00:00Z" }, status: { phase: "Running" } }),
    "Terminating",
  );
});

test("normPod sums restart counts across containers", () => {
  assert.deepEqual(
    normPod({
      metadata: { name: "web-abc", labels: { app: "web" } },
      spec: { nodeName: "node-1" },
      status: {
        phase: "Running",
        containerStatuses: [
          { restartCount: 2, state: { running: {} } },
          { restartCount: 1, state: { running: {} } },
        ],
      },
    }),
    { name: "web-abc", status: "Running", restarts: 3, node: "node-1", labels: { app: "web" } },
  );
});

test("normPod handles a pod with no containerStatuses", () => {
  const out = normPod({ metadata: { name: "pending" }, status: { phase: "Pending" } });
  assert.equal(out.status, "Pending");
  assert.equal(out.restarts, 0);
  assert.deepEqual(out.labels, {});
});
