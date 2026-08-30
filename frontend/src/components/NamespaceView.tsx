import { useState } from 'react'
import type { Deployment } from '../lib/api'
import { DeploymentsTable } from './DeploymentsTable'
import { PodsPanel } from './PodsPanel'

export function NamespaceView({ namespace }: { namespace: string }) {
  const [selected, setSelected] = useState<Deployment>()

  return (
    <>
      <section>
        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Deployments
        </h3>
        <DeploymentsTable
          namespace={namespace}
          selectedName={selected?.name}
          onSelect={(deployment) =>
            setSelected((prev) => (prev?.name === deployment.name ? undefined : deployment))
          }
        />
      </section>
      {selected && <PodsPanel namespace={namespace} deployment={selected} />}
    </>
  )
}
