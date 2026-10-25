import type { DayKind, Settings } from '@/types'
import { isTrainingDay } from '@/data/program'

export function todayKind(settings: Pick<Settings, 'weekdayPlan'>, d = new Date()): DayKind {
  return settings.weekdayPlan[d.getDay()] ?? 'rest'
}

export function trainingDaysPerWeek(settings: Pick<Settings, 'weekdayPlan'>): number {
  return Object.values(settings.weekdayPlan).filter(isTrainingDay).length
}
