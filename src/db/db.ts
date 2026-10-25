import Dexie, { type Table } from 'dexie'
import type { BodyEntry, ExerciseSetRow, Photo, PostureCheckin, WorkoutSession } from '@/types'

export class GymDB extends Dexie {
  sessions!: Table<WorkoutSession, string>
  exerciseSets!: Table<ExerciseSetRow, string>
  bodyEntries!: Table<BodyEntry, string>
  postureCheckins!: Table<PostureCheckin, string>
  photos!: Table<Photo, string>
  constructor() {
    super('gym')
    this.version(1).stores({
      sessions: 'id, dateKey, dayKind, status, startedAt',
      exerciseSets: 'id, exerciseId, loggedAt, sessionId',
      bodyEntries: 'id, dateKey',
      postureCheckins: 'id, dateKey',
      photos: 'id, dateKey, view, at',
    })
  }
}

export const db = new GymDB()

/** Safari sometimes closes the connection after backgrounding. Retry once. */
export async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  try { return await fn() } catch (e) {
    if (e instanceof Dexie.DatabaseClosedError || (e as Error)?.name === 'DatabaseClosedError') { await db.open(); return await fn() }
    throw e
  }
}
