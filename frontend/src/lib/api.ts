export type Namespace = { name: string; phase: string }

export type Health = 'green' | 'amber' | 'red'

export type Deployment = {
  name: string
  ready: number
  desired: number
  image: string
  created: string
  health: Health
  selector: Record<string, string>
  labels: Record<string, string>
}

export type Pod = {
  name: string
  status: string
  restarts: number
  node?: string
  labels: Record<string, string>
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(path)
  if (!response.ok) throw new Error(`${path} → ${response.status}`)
  return response.json() as Promise<T>
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw new Error(`${path} → ${response.status}`)
  return response.json() as Promise<T>
}

export const getNamespaces = () => getJson<Namespace[]>('/api/namespaces')

export const getDeployments = (namespace: string) =>
  getJson<Deployment[]>(
    `/api/deployments?namespace=${encodeURIComponent(namespace)}`,
  )

const toLabelSelector = (selector: Record<string, string>) =>
  Object.entries(selector)
    .map(([key, value]) => `${key}=${value}`)
    .join(',')

export const getPods = (namespace: string, selector: Record<string, string>) => {
  const params = new URLSearchParams({ namespace, selector: toLabelSelector(selector) })
  return getJson<Pod[]>(`/api/pods?${params}`)
}

export const scaleDeployment = (namespace: string, name: string, replicas: number) =>
  postJson<Deployment>('/api/deployments/scale', { namespace, name, replicas })

export const deploymentsWatchPath = (namespace: string) =>
  `/api/deployments/watch?namespace=${encodeURIComponent(namespace)}`

export const podsWatchPath = (namespace: string, selector: Record<string, string>) => {
  const params = new URLSearchParams({ namespace, selector: toLabelSelector(selector) })
  return `/api/pods/watch?${params}`
}
