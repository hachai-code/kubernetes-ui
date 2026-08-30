import { Badge } from './Badge'

const failing = new Set([
  'CrashLoopBackOff',
  'Error',
  'ImagePullBackOff',
  'ErrImagePull',
  'OOMKilled',
  'RunContainerError',
  'CreateContainerError',
  'CreateContainerConfigError',
])

function tone(status: string): string {
  if (status === 'Running') return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
  if (failing.has(status)) return 'bg-rose-50 text-rose-700 ring-rose-600/20'
  if (status === 'Completed' || status === 'Succeeded')
    return 'bg-slate-100 text-slate-600 ring-slate-500/20'
  return 'bg-amber-50 text-amber-700 ring-amber-600/20'
}

export function PodStatusBadge({ status }: { status: string }) {
  return <Badge tone={tone(status)} label={status} />
}
