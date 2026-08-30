import { DeploymentsTable } from './DeploymentsTable'

type MainPanelProps = { namespace?: string }

export function MainPanel({ namespace }: MainPanelProps) {
  if (!namespace) {
    return (
      <main className="flex-1 p-8">
        <p className="text-gray-400">Select a namespace</p>
      </main>
    )
  }

  return (
    <main className="flex-1 overflow-y-auto p-8">
      <h2 className="mb-4 text-xl font-semibold">{namespace}</h2>
      <section>
        <h3 className="mb-2 text-sm font-semibold text-gray-700">Deployments</h3>
        <DeploymentsTable namespace={namespace} />
      </section>
    </main>
  )
}
