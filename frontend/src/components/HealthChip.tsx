import type { Health } from '../lib/api'

const styles: Record<Health, string> = {
  green: 'bg-green-100 text-green-700',
  amber: 'bg-amber-100 text-amber-700',
  red: 'bg-red-100 text-red-700',
}

const labels: Record<Health, string> = {
  green: 'Healthy',
  amber: 'Converging',
  red: 'Failing',
}

export function HealthChip({ health }: { health: Health }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${styles[health]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[health]}
    </span>
  )
}
