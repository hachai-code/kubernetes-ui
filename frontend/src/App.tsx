import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { MainPanel } from './components/MainPanel'

export default function App() {
  const [selected, setSelected] = useState<string>()

  return (
    <div className="flex h-screen flex-col bg-slate-50 text-slate-800">
      <header className="flex h-11 shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-4">
        <span className="h-3.5 w-3.5 rounded-sm bg-blue-600" />
        <span className="text-[13px] font-semibold tracking-tight text-slate-800">
          Kubernetes UI
        </span>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar selected={selected} onSelect={setSelected} />
        <MainPanel namespace={selected} />
      </div>
    </div>
  )
}
