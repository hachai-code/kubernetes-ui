import { useQuery } from '@tanstack/react-query'
import { getDeployments } from '../lib/api'
import { formatAge } from '../lib/age'
import { HealthChip } from './HealthChip'

const cell = 'px-4 py-2 text-sm'
const headCell = 'px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500'

export function DeploymentsTable({ namespace }: { namespace: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['deployments', namespace],
    queryFn: () => getDeployments(namespace),
  })

  if (isLoading) return <p className="text-sm text-gray-400">Loading deployments…</p>
  if (isError) return <p className="text-sm text-red-500">Failed to load deployments</p>
  if (!data?.length)
    return <p className="text-sm text-gray-400">No deployments in this namespace</p>

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-gray-200">
          <th className={headCell}>Name</th>
          <th className={headCell}>Replicas</th>
          <th className={headCell}>Image</th>
          <th className={headCell}>Age</th>
          <th className={headCell}>Health</th>
        </tr>
      </thead>
      <tbody>
        {data.map((deployment) => (
          <tr key={deployment.name} className="border-b border-gray-100 hover:bg-gray-50">
            <td className={`${cell} font-medium text-gray-900`}>{deployment.name}</td>
            <td className={`${cell} tabular-nums text-gray-700`}>
              {deployment.ready}/{deployment.desired}
            </td>
            <td className={`${cell} font-mono text-xs text-gray-600`}>{deployment.image}</td>
            <td className={`${cell} tabular-nums text-gray-500`}>{formatAge(deployment.created)}</td>
            <td className={cell}>
              <HealthChip health={deployment.health} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
