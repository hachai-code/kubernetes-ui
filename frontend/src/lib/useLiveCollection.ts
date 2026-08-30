import { useQuery } from '@tanstack/react-query'
import { useWatch } from './useWatch'

export function useLiveCollection<T extends { name: string }>(
  queryKey: unknown[],
  queryFn: () => Promise<T[]>,
  watchPath: string,
) {
  const query = useQuery({ queryKey, queryFn })
  useWatch<T>(queryKey, watchPath)
  return query
}
