type MainPanelProps = { namespace?: string }

export function MainPanel({ namespace }: MainPanelProps) {
  return (
    <main className="flex-1 p-8">
      {namespace ? (
        <h2 className="text-xl font-semibold">{namespace}</h2>
      ) : (
        <p className="text-gray-400">Select a namespace</p>
      )}
    </main>
  )
}
