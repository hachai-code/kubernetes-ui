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
    <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
      <header className="border-b border-slate-200 bg-slate-50 px-3 py-2">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Pods · <span className="font-mono normal-case tracking-normal text-slate-600">{deployment.name}</span>
        </h3>
      </header>

      {isLoading && <p className={`${cell} text-slate-400`}>Loading pods…</p>}
      {isError && <p className={`${cell} text-rose-600`}>Failed to load pods</p>}
      {data && !data.length && <p className={`${cell} text-slate-400`}>No pods</p>}

      {data && data.length > 0 && (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className={headCell}>Name</th>
              <th className={headCell}>Status</th>
              <th className={headCell}>Restarts</th>
              <th className={headCell}>Node</th>
            </tr>
          </thead>
          <tbody>
            {data.map((pod) => (
              <tr key={pod.name} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className={`${cell} font-mono text-[12px] text-slate-800`}>{pod.name}</td>
                <td className={cell}>
                  <PodStatusBadge status={pod.status} />
                </td>
                <td className={`${cell} tabular-nums ${pod.restarts > 0 ? 'text-amber-600' : 'text-slate-500'}`}>
                  {pod.restarts}
                </td>
                <td className={`${cell} font-mono text-[12px] text-slate-500`}>{pod.node ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
