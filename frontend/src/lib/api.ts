export type Namespace = { name: string; phase: string }

export type Health = 'green' | 'amber' | 'red'

export type Deployment = {
  name: string
  ready: number
  desired: number
  image: string
  created: string
  health: Health
  labels: Record<string, string>
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(path)
  if (!response.ok) throw new Error(`${path} → ${response.status}`)
  return response.json() as Promise<T>
}

export const getNamespaces = () => getJson<Namespace[]>('/api/namespaces')

export const getDeployments = (namespace: string) =>
  getJson<Deployment[]>(
    `/api/deployments?namespace=${encodeURIComponent(namespace)}`,
  )
