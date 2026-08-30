import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

type Named = { name: string }
type WatchEvent<T> = { type: 'ADDED' | 'MODIFIED' | 'DELETED'; object: T }

export function useWatch<T extends Named>(queryKey: unknown[], path: string) {
  const queryClient = useQueryClient()
  const key = JSON.stringify(queryKey)

  useEffect(() => {
    const cacheKey = JSON.parse(key) as unknown[]
    const source = new EventSource(path)
    source.onmessage = (event) => {
      const { type, object } = JSON.parse(event.data) as WatchEvent<T>
      queryClient.setQueryData<T[]>(cacheKey, (current = []) => {
        if (type === 'DELETED') return current.filter((item) => item.name !== object.name)
        if (current.some((item) => item.name === object.name)) {
          return current.map((item) => (item.name === object.name ? object : item))
        }
        return [...current, object]
      })
    }
    return () => source.close()
  }, [key, path, queryClient])
}
