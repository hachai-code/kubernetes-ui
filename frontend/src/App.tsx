import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { MainPanel } from './components/MainPanel'

export default function App() {
  const [selected, setSelected] = useState<string>()

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <Sidebar selected={selected} onSelect={setSelected} />
      <MainPanel namespace={selected} />
    </div>
  )
}
