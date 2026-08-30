import { useMutation } from '@tanstack/react-query'
import type { Deployment } from '../lib/api'
import { getDeployments, deploymentsWatchPath, scaleDeployment } from '../lib/api'
import { useLiveCollection } from '../lib/useLiveCollection'
import { formatAge } from '../lib/age'
import { cell, headCell } from '../lib/ui'
import { HealthChip } from './HealthChip'

const stepBtn =
  'flex h-5 w-5 items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent'

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

  const scale = useMutation({
    mutationFn: ({ name, replicas }: { name: string; replicas: number }) =>
      scaleDeployment(namespace, name, replicas),
  })

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
                <td className={cell}>
                  <div className="flex items-center gap-2">
                    <button
                      className={stepBtn}
                      disabled={deployment.desired === 0 || scale.isPending}
                      onClick={(event) => {
                        event.stopPropagation()
                        scale.mutate({ name: deployment.name, replicas: deployment.desired - 1 })
                      }}
                    >
                      −
                    </button>
                    <span className="w-10 text-center tabular-nums text-slate-600">
                      {deployment.ready}/{deployment.desired}
                    </span>
                    <button
                      className={stepBtn}
                      disabled={scale.isPending}
                      onClick={(event) => {
                        event.stopPropagation()
                        scale.mutate({ name: deployment.name, replicas: deployment.desired + 1 })
                      }}
                    >
                      +
                    </button>
                  </div>
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
