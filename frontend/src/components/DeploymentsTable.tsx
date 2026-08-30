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

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      {isLoading && <p className={`${cell} text-slate-400`}>Loading deployments…</p>}
      {isError && <p className={`${cell} text-rose-600`}>Failed to load deployments</p>}
      {data && !data.length && (
        <p className={`${cell} text-slate-400`}>No deployments in this namespace</p>
      )}
      {data && data.length > 0 && (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
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
                className={`cursor-pointer border-b border-slate-100 last:border-0 ${
                  selectedName === deployment.name ? 'bg-blue-50' : 'hover:bg-slate-50'
                }`}
              >
                <td className={`${cell} font-medium text-slate-800`}>{deployment.name}</td>
                <td className={`${cell} tabular-nums text-slate-600`}>
                  {deployment.ready}/{deployment.desired}
                </td>
                <td className={`${cell} font-mono text-[12px] text-slate-500`}>{deployment.image}</td>
                <td className={`${cell} tabular-nums text-slate-500`}>
                  {formatAge(deployment.created)}
                </td>
                <td className={cell}>
                  <HealthChip health={deployment.health} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
