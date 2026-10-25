import { db, withRetry } from '../db'
import type { ExerciseSetRow } from '@/types'

export const exerciseSetsRepo = {
  forExercise: (exerciseId: string) => withRetry(() => db.exerciseSets.where('exerciseId').equals(exerciseId).sortBy('loggedAt')),
  /** Sets from the most recent session in which this exercise was logged. */
  lastSession: async (exerciseId: string): Promise<ExerciseSetRow[]> => {
    const rows = await exerciseSetsRepo.forExercise(exerciseId)
    if (!rows.length) return []
    const lastId = rows[rows.length - 1].sessionId
    return rows.filter((r) => r.sessionId === lastId).sort((a, b) => a.setIndex - b.setIndex)
  },
  all: () => withRetry(() => db.exerciseSets.toArray()),
}
