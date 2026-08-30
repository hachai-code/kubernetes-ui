# Kubernetes UI

A proof-of-concept **internal developer platform (IDP) UI** for Kubernetes — a read-mostly
console that lets a developer inspect and operate on the workloads in a cluster without
reaching for `kubectl`. It presents namespaces, deployments, and pods as clean, live-updating
views and exposes a first developer action (scaling), with a clear path to more.

It is intentionally a demo: it runs against a local `kubectl proxy` with your own kubeconfig
credentials and has no authentication of its own. It is not production-ready — see
[Next steps](#next-steps).

## Architecture

The browser never talks to Kubernetes directly. A thin **backend-for-frontend (BFF)** owns the
messy Kubernetes API shape and hands the UI only the fields it renders.

```
Browser (React)  ──/api/*──▶  Express BFF (:4000)  ──▶  kubectl proxy (:8001)  ──▶  cluster
```

- The BFF **normalizes** verbose Kubernetes objects down to render-ready fields and **derives**
  health from a deployment's own conditions.
- It bridges the Kubernetes **watch** API to the browser over **Server-Sent Events**, so the UI
  updates live without polling.
- In development the Vite server proxies `/api` to the BFF, so the frontend is same-origin (no CORS).

## What's built

- **Namespace sidebar** — lists every namespace; selecting one drives the main view.
- **Deployments table** — name, `ready/desired` replicas, image, age, and a **health roll-up**
  chip (green = healthy, amber = converging, red = failing) derived from Kubernetes'
  `Available` / `Progressing` conditions.
- **Live updates** — deployments and pods stream over SSE from the Kubernetes watch API; scaling,
  rollouts, and failures appear in real time.
- **Pod drill-down** — click a deployment to see its pods (matched by the deployment's label
  selector), each with a **kubectl-style status** (surfaces `CrashLoopBackOff`,
  `ImagePullBackOff`, etc. instead of a misleading `Running` phase), restart count, and node.
- **Scale action** — inline `− / +` controls patch a deployment's replica count; the change
  streams back and the table re-converges live.
- **Clinical UI** — neutral, information-dense design; monospace for identifiers and values.

## Stack

- **Frontend**: React + TypeScript, Vite, TanStack Query (cache + live-collection hook), Tailwind CSS v4.
- **Backend**: Node 22 (global `fetch`), Express. No HTTP-client dependency.
- **Tests**: `node:test` over the pure normalizers and health logic.

## Running it

Prerequisites: a reachable cluster and `kubectl`.

```bash
# 1. Expose the Kubernetes API locally
kubectl proxy            # serves the cluster API on :8001

# 2. Start the BFF (repo root)
npm install
npm start                # Express proxy on :4000

# 3. Start the frontend
cd frontend
npm install
npm run dev              # Vite on :5173, proxies /api -> :4000
```

Open http://localhost:5173, pick a namespace, click a deployment to see its pods, and use the
`− / +` controls to scale.

Run the backend tests with `npm test` from the repo root.

## Next steps

Toward a usable MVP where developers can operate, not just observe:

- **More developer actions** — restart rollout, delete pod, view logs (streamed over the existing
  SSE mechanism). Each reuses the scale action's write path.
- **Authentication + RBAC** — replace the shared `kubectl proxy` with per-user credentials so the
  UI shows and permits only what the caller is allowed to do. This is the main blocker to real use.
- **Single-process serving** — build the frontend and serve the static bundle from Express, so the
  whole thing is one containerizable process instead of two dev servers.
- **More resources** — services, statefulsets, cronjobs; the backend registers a new resource
  (list + watch) from a single descriptor entry.
- **UX polish** — filter out `kube-*` system namespaces, loading skeletons, and clearer surfacing
  of action errors (e.g. `403 Forbidden`).
- **Instant per-pod health** — today a multi-replica deployment shows amber until Kubernetes trips
  the progress deadline; folding pod status into the roll-up would flag a single failing pod sooner.
