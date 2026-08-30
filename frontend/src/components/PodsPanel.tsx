import type { Deployment, Pod } from '../lib/api'
import { getPods, podsWatchPath } from '../lib/api'
import { useLiveCollection } from '../lib/useLiveCollection'
import { cell, headCell } from '../lib/ui'
import { PodStatusBadge } from './PodStatusBadge'

export function PodsPanel({ namespace, deployment }: { namespace: string; deployment: Deployment }) {
  const { data, isLoading, isError } = useLiveCollection<Pod>(
    ['pods', namespace, deployment.name],
    () => getPods(namespace, deployment.selector),
    podsWatchPath(namespace, deployment.selector),
  )

  return (
    <section className="mt-6 rounded-lg border border-gray-200 bg-white">
      <header className="border-b border-gray-100 px-4 py-2">
        <h3 className="text-sm font-semibold text-gray-700">
          Pods · <span className="font-mono">{deployment.name}</span>
        </h3>
      </header>

      {isLoading && <p className={`${cell} text-gray-400`}>Loading pods…</p>}
      {isError && <p className={`${cell} text-red-500`}>Failed to load pods</p>}
      {data && !data.length && <p className={`${cell} text-gray-400`}>No pods</p>}

      {data && data.length > 0 && (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className={headCell}>Name</th>
              <th className={headCell}>Status</th>
              <th className={headCell}>Restarts</th>
              <th className={headCell}>Node</th>
            </tr>
          </thead>
          <tbody>
            {data.map((pod) => (
              <tr key={pod.name} className="border-b border-gray-100 last:border-0">
                <td className={`${cell} font-mono text-xs text-gray-900`}>{pod.name}</td>
                <td className={cell}>
                  <PodStatusBadge status={pod.status} />
                </td>
                <td className={`${cell} tabular-nums ${pod.restarts > 0 ? 'text-amber-600' : 'text-gray-500'}`}>
                  {pod.restarts}
                </td>
                <td className={`${cell} text-gray-500`}>{pod.node ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
