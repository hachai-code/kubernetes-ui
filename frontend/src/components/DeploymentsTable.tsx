import type { Deployment } from '../lib/api'
import { getDeployments, deploymentsWatchPath } from '../lib/api'
import { useLiveCollection } from '../lib/useLiveCollection'
import { formatAge } from '../lib/age'
import { cell, headCell } from '../lib/ui'
import { HealthChip } from './HealthChip'

type DeploymentsTableProps = {
  namespace: string
  selectedName?: string
  onSelect: (deployment: Deployment) => void
}

export function DeploymentsTable({ namespace, selectedName, onSelect }: DeploymentsTableProps) {
  const { data, isLoading, isError } = useLiveCollection<Deployment>(
    ['deployments', namespace],
    () => getDeployments(namespace),
    deploymentsWatchPath(namespace),
  )

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
          <tr
            key={deployment.name}
            onClick={() => onSelect(deployment)}
            className={`cursor-pointer border-b border-gray-100 ${
              selectedName === deployment.name ? 'bg-blue-50' : 'hover:bg-gray-100'
            }`}
          >
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
