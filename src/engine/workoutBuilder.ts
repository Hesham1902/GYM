import type { ActiveSlot, ActiveWorkout, DayKind, LoggedSet, PrRecord, Settings, WorkoutSession } from '@/types'
import { PROGRAM } from '@/data/program'
import { EXERCISES } from '@/data/exercises'
import { exerciseSetsRepo } from '@/db/repo/exerciseSets'
import { sessionsRepo } from '@/db/repo/sessions'
import { prescribe } from './progression'
import { programWeek } from './week'
import { detectPrs } from './oneRm'
import { totalVolume } from './volume'
import { uid } from '@/utils/id'
import { dateKey } from '@/utils/date'

export function orderedSlots(kind: DayKind, settings: Pick<Settings, 'slotOrder'>) {
  const day = PROGRAM[kind]
  const order = settings.slotOrder[kind]
  if (!order) return day.slots
  const byId = Object.fromEntries(day.slots.map((s) => [s.slotId, s]))
  const ordered = order.map((id) => byId[id]).filter(Boolean)
  const missing = day.slots.filter((s) => !order.includes(s.slotId))
  return [...ordered, ...missing]
}

export function resolveExerciseId(slotId: string, original: string, settings: Pick<Settings, 'permanentSwaps'>) {
  return settings.permanentSwaps[slotId] ?? original
}

export async function buildSlot(slotId: string, exerciseId: string, repRange: [number, number], firstCompound: boolean, week: number): Promise<ActiveSlot> {
  const ex = EXERCISES[exerciseId]
  const last = await exerciseSetsRepo.lastSession(exerciseId)
  return { slotId, exerciseId, prescription: prescribe(ex, repRange, week, firstCompound, last) }
}

export async function buildWorkout(kind: DayKind, settings: Settings): Promise<ActiveWorkout> {
  const week = programWeek(settings.programStartDate, settings.rampWeekOverride)
  const slots: ActiveSlot[] = []
  for (const s of orderedSlots(kind, settings)) {
    const exId = resolveExerciseId(s.slotId, s.exerciseId, settings)
    const range = exId === s.exerciseId ? s.repRange : EXERCISES[exId]?.repRange ?? s.repRange
    slots.push(await buildSlot(s.slotId, exId, range, s.firstCompound, week))
  }
  return {
    id: uid(), dayKind: kind, week, startedAt: Date.now(), slots, sets: [], swaps: [], skips: [],
    currentSlotId: slots[0]?.slotId ?? '', restTimer: null, postureDone: false, notes: '', updatedAt: Date.now(),
  }
}

/** Rebuild an ActiveWorkout from an unfinished session so it can be resumed. */
export async function resumeFromSession(s: WorkoutSession, settings: Settings): Promise<ActiveWorkout> {
  const base = await buildWorkout(s.dayKind, settings)
  const slots = base.slots.map((sl) => {
    const swap = [...s.swaps].reverse().find((x) => x.slotId === sl.slotId)
    return swap ? { ...sl, exerciseId: swap.to } : sl
  })
  const firstOpen = slots.find((sl) => s.sets.filter((x) => x.slotId === sl.slotId && !x.isWarmup).length < sl.prescription.sets && !s.skips.some((k) => k.slotId === sl.slotId))
  return { ...base, id: s.id, week: s.week, startedAt: s.startedAt, slots, sets: s.sets, swaps: s.swaps, skips: s.skips, currentSlotId: firstOpen?.slotId ?? slots[0]?.slotId ?? '', postureDone: s.postureDone, notes: s.notes }
}

export async function finishWorkout(w: ActiveWorkout): Promise<WorkoutSession> {
  const history = (await exerciseSetsRepo.all()).filter((r) => r.sessionId !== w.id)
  const working = w.sets.filter((s) => !s.isWarmup)
  const prs: PrRecord[] = detectPrs(working, history)
  const session: WorkoutSession = {
    id: w.id, dateKey: dateKey(w.startedAt), dayKind: w.dayKind, week: w.week, startedAt: w.startedAt, endedAt: Date.now(), status: 'done',
    sets: [...w.sets].sort((a, b) => a.loggedAt - b.loggedAt), swaps: w.swaps, skips: w.skips,
    volumeKg: totalVolume(working), setCount: working.length, prs, postureDone: w.postureDone, notes: w.notes,
  }
  await sessionsRepo.saveWithSets(session)
  return session
}

export function setsForSlot(w: ActiveWorkout, slotId: string): LoggedSet[] {
  return w.sets.filter((s) => s.slotId === slotId).sort((a, b) => a.loggedAt - b.loggedAt)
}
