import { roundTo } from '@/utils/num'

export interface WarmupRow { pct: number; reps: number; weight: number }

/** Ramp to a working weight. Light loads need almost nothing. */
export function warmupSets(working: number, step = 2.5): WarmupRow[] {
  if (working <= 0) return []
  if (working < 20) return [{ pct: 50, reps: 10, weight: roundTo(working * 0.5, step) }]
  if (working < 50) return [
    { pct: 50, reps: 10, weight: roundTo(working * 0.5, step) },
    { pct: 75, reps: 5, weight: roundTo(working * 0.75, step) },
  ]
  return [
    { pct: 40, reps: 10, weight: roundTo(working * 0.4, step) },
    { pct: 60, reps: 6, weight: roundTo(working * 0.6, step) },
    { pct: 80, reps: 3, weight: roundTo(working * 0.8, step) },
  ]
}
