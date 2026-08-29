import { useQuery } from '@tanstack/react-query'
import { getNamespaces } from '../lib/api'

type SidebarProps = {
  selected?: string
  onSelect: (name: string) => void
}

export function Sidebar({ selected, onSelect }: SidebarProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['namespaces'],
    queryFn: getNamespaces,
  })

  return (
    <aside className="w-64 shrink-0 overflow-y-auto border-r border-gray-200 bg-white">
      <h1 className="px-4 py-3 text-sm font-semibold tracking-wide text-gray-500 uppercase">
        Namespaces
      </h1>
      {isLoading && <p className="px-4 text-sm text-gray-400">Loading…</p>}
      {isError && <p className="px-4 text-sm text-red-500">Failed to load</p>}
      <ul>
        {data?.map((namespace) => (
          <li key={namespace.name}>
            <button
              onClick={() => onSelect(namespace.name)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                selected === namespace.name
                  ? 'bg-blue-50 font-medium text-blue-700'
                  : 'text-gray-700'
              }`}
            >
              {namespace.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
