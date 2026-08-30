import type { Health } from '../lib/api'
import { Badge } from './Badge'

const tones: Record<Health, string> = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  amber: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  red: 'bg-rose-50 text-rose-700 ring-rose-600/20',
}

const labels: Record<Health, string> = {
  green: 'Healthy',
  amber: 'Converging',
  red: 'Failing',
}

export function HealthChip({ health }: { health: Health }) {
  return <Badge tone={tones[health]} label={labels[health]} />
}
