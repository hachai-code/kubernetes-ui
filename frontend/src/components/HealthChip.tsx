import type { Health } from '../lib/api'
import { Badge } from './Badge'

const tones: Record<Health, string> = {
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
  return <Badge tone={tones[health]} label={labels[health]} />
}
