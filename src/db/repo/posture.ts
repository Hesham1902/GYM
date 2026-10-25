import { db, withRetry } from '../db'
import type { PostureCheckin } from '@/types'
import { addDays, dateKey } from '@/utils/date'

export const postureRepo = {
  all: () => withRetry(() => db.postureCheckins.orderBy('dateKey').toArray()),
  byDate: (k: string) => withRetry(() => db.postureCheckins.where('dateKey').equals(k).first()),
  put: (c: PostureCheckin) => withRetry(() => db.postureCheckins.put(c)),
  delete: (id: string) => withRetry(() => db.postureCheckins.delete(id)),
}

/** Consecutive days (ending today or yesterday) with routineDone. */
export function streak(checkins: PostureCheckin[], today = dateKey()): number {
  const done = new Set(checkins.filter((c) => c.routineDone).map((c) => c.dateKey))
  let d = done.has(today) ? today : addDays(today, -1)
  let n = 0
  while (done.has(d)) { n++; d = addDays(d, -1) }
  return n
}
