import { test } from "node:test";
import assert from "node:assert/strict";
import { normNamespace, normDeployment, normPod } from "./server.js";

test("normNamespace pulls name and phase", () => {
  assert.deepEqual(
    normNamespace({ metadata: { name: "default" }, status: { phase: "Active" } }),
    { name: "default", phase: "Active" },
  );
});

test("normDeployment defaults missing replica counts to 0", () => {
  assert.deepEqual(
    normDeployment({
      metadata: { name: "web", labels: { app: "web" } },
      spec: {
        replicas: 3,
        template: { spec: { containers: [{ image: "nginx:1.27" }] } },
      },
      status: {},
    }),
    { name: "web", ready: 0, desired: 3, image: "nginx:1.27", labels: { app: "web" } },
  );
});

test("normPod sums restart counts across containers", () => {
  assert.deepEqual(
    normPod({
      metadata: { name: "web-abc", labels: { app: "web" } },
      status: {
        phase: "Running",
        containerStatuses: [{ restartCount: 2 }, { restartCount: 1 }],
      },
    }),
    { name: "web-abc", phase: "Running", restarts: 3, labels: { app: "web" } },
  );
});

test("normPod handles a pod with no containerStatuses", () => {
  const out = normPod({ metadata: { name: "pending" }, status: { phase: "Pending" } });
  assert.equal(out.restarts, 0);
  assert.deepEqual(out.labels, {});
});
