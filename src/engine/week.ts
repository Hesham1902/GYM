import { dateKey, daysBetween } from '@/utils/date'

/** Program week (1-based). Override wins; otherwise weeks since start date; 1 when no start date. */
export function programWeek(startDate: string | null, override: number | null, today = dateKey()): number {
  if (override && override > 0) return override
  if (!startDate) return 1
  const d = daysBetween(startDate, today)
  if (d < 0) return 1
  return Math.floor(d / 7) + 1
}

export function setsForWeek(week: number, firstCompound: boolean, isCompound: boolean): number {
  if (week <= 1) return firstCompound ? 2 : 1
  if (week === 2) return 2
  return isCompound ? 3 : 2
}

export function rirForWeek(week: number): number {
  if (week <= 1) return 4
  if (week === 2) return 3
  return 2
}
