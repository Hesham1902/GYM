import type { LoggedSet, PrRecord } from '@/types'

/** Epley estimate. */
export function est1rm(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0
  if (reps === 1) return weight
  return Math.round(weight * (1 + reps / 30) * 10) / 10
}

export function bestSet<T extends { weight: number; reps: number }>(sets: T[]): T | null {
  if (!sets.length) return null
  return sets.reduce((b, s) => (est1rm(s.weight, s.reps) > est1rm(b.weight, b.reps) ? s : b))
}

/** PRs in `sets` relative to `history` (rows from previous sessions only). */
export function detectPrs(sets: LoggedSet[], history: { exerciseId: string; weight: number; reps: number }[]): PrRecord[] {
  const out: PrRecord[] = []
  const byEx = new Map<string, LoggedSet[]>()
  for (const s of sets) if (!s.isWarmup && s.reps > 0 && s.weight > 0) byEx.set(s.exerciseId, [...(byEx.get(s.exerciseId) ?? []), s])
  for (const [exId, list] of byEx) {
    const prev = history.filter((h) => h.exerciseId === exId)
    const prevW = Math.max(0, ...prev.map((p) => p.weight))
    const prev1 = Math.max(0, ...prev.map((p) => est1rm(p.weight, p.reps)))
    const topW = list.reduce((b, s) => (s.weight > b.weight ? s : b))
    const top1 = bestSet(list)!
    if (prev.length && topW.weight > prevW) out.push({ exerciseId: exId, weight: topW.weight, reps: topW.reps, est1rm: est1rm(topW.weight, topW.reps), kind: 'weight' })
    if (prev.length && est1rm(top1.weight, top1.reps) > prev1) out.push({ exerciseId: exId, weight: top1.weight, reps: top1.reps, est1rm: est1rm(top1.weight, top1.reps), kind: 'est1rm' })
  }
  return out
}
