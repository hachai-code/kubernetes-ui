import { NamespaceView } from './NamespaceView'

type MainPanelProps = { namespace?: string }

export function MainPanel({ namespace }: MainPanelProps) {
  if (!namespace) {
    return (
      <main className="flex-1 p-8">
        <p className="text-[13px] text-slate-400">Select a namespace</p>
      </main>
    )
  }

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <h2 className="mb-5 flex items-baseline gap-2 text-[15px] text-slate-500">
        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
          Namespace
        </span>
        <span className="font-mono font-medium text-slate-800">{namespace}</span>
      </h2>
      <NamespaceView key={namespace} namespace={namespace} />
    </main>
  )
}
