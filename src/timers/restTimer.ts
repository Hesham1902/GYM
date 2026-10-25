import type { RestTimerState } from '@/types'

export function startRest(slotId: string, seconds: number, now = Date.now()): RestTimerState {
  return { endsAt: now + seconds * 1000, durationMs: seconds * 1000, slotId, notified: false }
}
export function adjustRest(t: RestTimerState, deltaSec: number, now = Date.now()): RestTimerState {
  const endsAt = Math.max(now, t.endsAt + deltaSec * 1000)
  return { ...t, endsAt, durationMs: Math.max(1000, t.durationMs + deltaSec * 1000) }
}
export function remainingMs(t: RestTimerState | null, now = Date.now()): number {
  return t ? Math.max(0, t.endsAt - now) : 0
}
export function isOver(t: RestTimerState | null, now = Date.now()): boolean {
  return !!t && t.endsAt <= now
}
export function progress(t: RestTimerState | null, now = Date.now()): number {
  if (!t) return 0
  return Math.min(1, Math.max(0, 1 - remainingMs(t, now) / t.durationMs))
}
