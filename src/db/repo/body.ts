import { db, withRetry } from '../db'
import type { BodyEntry } from '@/types'

export const bodyRepo = {
  all: () => withRetry(() => db.bodyEntries.orderBy('dateKey').toArray()),
  byDate: (k: string) => withRetry(() => db.bodyEntries.where('dateKey').equals(k).first()),
  put: (e: BodyEntry) => withRetry(() => db.bodyEntries.put(e)),
  delete: (id: string) => withRetry(() => db.bodyEntries.delete(id)),
}

/** 7-day trailing moving average of weight, per entry date. */
export function movingAverage(entries: BodyEntry[], days = 7): { dateKey: string; weight: number; avg: number | null }[] {
  const w = entries.filter((e) => typeof e.weightKg === 'number').sort((a, b) => a.dateKey.localeCompare(b.dateKey))
  return w.map((e, i) => {
    const from = new Date(e.dateKey); from.setDate(from.getDate() - (days - 1))
    const fromKey = from.toISOString().slice(0, 10)
    const window = w.slice(0, i + 1).filter((x) => x.dateKey >= fromKey)
    const avg = window.length >= 3 ? window.reduce((s, x) => s + (x.weightKg as number), 0) / window.length : null
    return { dateKey: e.dateKey, weight: e.weightKg as number, avg: avg === null ? null : Math.round(avg * 10) / 10 }
  })
}
