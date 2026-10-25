import type { Exercise, MuscleGroup } from '@/types'

export function setVolume(s: { weight: number; reps: number; isWarmup?: boolean }): number {
  return s.isWarmup ? 0 : Math.max(0, s.weight) * Math.max(0, s.reps)
}

export function totalVolume(sets: { weight: number; reps: number; isWarmup?: boolean }[]): number {
  return Math.round(sets.reduce((a, s) => a + setVolume(s), 0))
}

/** Volume (kg) and set count per primary muscle. */
export function volumeByMuscle(
  sets: { exerciseId: string; weight: number; reps: number; isWarmup?: boolean }[],
  exercises: Record<string, Exercise>,
): Record<MuscleGroup, { kg: number; sets: number }> {
  const out = {} as Record<MuscleGroup, { kg: number; sets: number }>
  for (const s of sets) {
    if (s.isWarmup) continue
    const ex = exercises[s.exerciseId]; if (!ex) continue
    const m = ex.muscles[0]
    out[m] ??= { kg: 0, sets: 0 }
    out[m].kg += setVolume(s); out[m].sets += 1
  }
  for (const k of Object.keys(out) as MuscleGroup[]) out[k].kg = Math.round(out[k].kg)
  return out
}
