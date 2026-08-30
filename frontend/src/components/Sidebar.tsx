import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getNamespaces } from '../lib/api'

type SidebarProps = {
  selected?: string
  onSelect: (name: string) => void
}

const isSystem = (name: string) => name.startsWith('kube-')

export function Sidebar({ selected, onSelect }: SidebarProps) {
  const [hideSystem, setHideSystem] = useState(true)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['namespaces'],
    queryFn: getNamespaces,
  })

  const namespaces = hideSystem ? data?.filter((ns) => !isSystem(ns.name)) : data

  return (
    <aside className="w-60 shrink-0 overflow-y-auto border-r border-slate-200 bg-white">
      <div className="flex items-center justify-between px-3 py-2.5">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Namespaces
        </h2>
        <button
          onClick={() => setHideSystem((value) => !value)}
          className="text-[11px] text-slate-400 hover:text-slate-600"
        >
          {hideSystem ? 'Show system' : 'Hide system'}
        </button>
      </div>
      {isLoading && <p className="px-3 text-[13px] text-slate-400">Loading…</p>}
      {isError && <p className="px-3 text-[13px] text-rose-600">Failed to load</p>}
      <ul className="pb-2">
        {namespaces?.map((namespace) => {
          const active = selected === namespace.name
          return (
            <li key={namespace.name}>
              <button
                onClick={() => onSelect(namespace.name)}
                className={`w-full border-l-2 px-3 py-1.5 text-left font-mono text-[13px] ${
                  active
                    ? 'border-blue-600 bg-slate-100 font-medium text-slate-900'
                    : 'border-transparent text-slate-600 hover:bg-slate-50'
                }`}
              >
                {namespace.name}
              </button>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
