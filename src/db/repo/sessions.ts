import { db, withRetry } from '../db'
import type { ActiveWorkout, ExerciseSetRow, LoggedSet, WorkoutSession } from '@/types'
import { dateKey } from '@/utils/date'

export const sessionsRepo = {
  lastDone: () => withRetry(() => db.sessions.where("status").equals("done").reverse().sortBy("startedAt").then((x) => x[0] ?? null)),
  all: () => withRetry(() => db.sessions.orderBy('startedAt').reverse().toArray()),
  get: (id: string) => withRetry(() => db.sessions.get(id)),
  byDateRange: (fromKey: string, toKey: string) => withRetry(() => db.sessions.where('dateKey').between(fromKey, toKey, true, true).toArray()),
  unfinished: () => withRetry(() => db.sessions.where('status').equals('unfinished').toArray()),
  put: (s: WorkoutSession) => withRetry(() => db.sessions.put(s)),
  delete: async (id: string) =>
    withRetry(() => db.transaction('rw', db.sessions, db.exerciseSets, async () => {
      await db.sessions.delete(id)
      await db.exerciseSets.where('sessionId').equals(id).delete()
    })),
  /** Write session + denormalised set rows atomically. */
  saveWithSets: async (s: WorkoutSession) =>
    withRetry(() => db.transaction('rw', db.sessions, db.exerciseSets, async () => {
      await db.sessions.put(s)
      await db.exerciseSets.where('sessionId').equals(s.id).delete()
      if (s.status === 'done') await db.exerciseSets.bulkPut(s.sets.filter((x) => !x.isWarmup).map((x) => toRow(s.id, x)))
    })),
  snapshotActive: (w: ActiveWorkout) => {
    const session: WorkoutSession = {
      id: w.id, dateKey: dateKey(w.startedAt), dayKind: w.dayKind, week: w.week, startedAt: w.startedAt, endedAt: null,
      status: 'unfinished', sets: w.sets, swaps: w.swaps, skips: w.skips, volumeKg: 0, setCount: w.sets.filter((s) => !s.isWarmup).length,
      prs: [], postureDone: w.postureDone, notes: w.notes,
    }
    return withRetry(() => db.sessions.put(session))
  },
}

export function toRow(sessionId: string, s: LoggedSet): ExerciseSetRow {
  return { id: s.id, sessionId, exerciseId: s.exerciseId, loggedAt: s.loggedAt, setIndex: s.setIndex, weight: s.weight, reps: s.reps, rir: s.rir, form: s.form, pain: s.pain }
}
