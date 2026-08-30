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
  if (status === 'Running') return 'bg-green-100 text-green-700'
  if (failing.has(status)) return 'bg-red-100 text-red-700'
  if (status === 'Completed' || status === 'Succeeded') return 'bg-gray-100 text-gray-600'
  return 'bg-amber-100 text-amber-700'
}

export function PodStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${tone(status)}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}
