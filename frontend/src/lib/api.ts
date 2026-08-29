export type Namespace = { name: string; phase: string }

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(path)
  if (!response.ok) throw new Error(`${path} → ${response.status}`)
  return response.json() as Promise<T>
}

export const getNamespaces = () => getJson<Namespace[]>('/api/namespaces')
