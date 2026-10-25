import type { DayKind, ProgramDay } from '@/types'

export const PROGRAM: Record<DayKind, ProgramDay> = {
  upperA: {
    kind: 'upperA',
    name: { en: 'Upper A', ar: 'Upper A' },
    postureRoutineIds: ['gymPre', 'gymPost'],
    slots: [
      { slotId: 'ua-1', exerciseId: 'chest-press-machine', repRange: [8, 12], firstCompound: true },
      { slotId: 'ua-2', exerciseId: 'lat-pulldown', repRange: [8, 12], firstCompound: false },
      { slotId: 'ua-3', exerciseId: 'chest-supported-row', repRange: [8, 12], firstCompound: false },
      { slotId: 'ua-4', exerciseId: 'incline-chest-press', repRange: [10, 12], firstCompound: false },
      { slotId: 'ua-5', exerciseId: 'lateral-raise', repRange: [12, 15], firstCompound: false },
      { slotId: 'ua-6', exerciseId: 'biceps-curl', repRange: [10, 15], firstCompound: false },
      { slotId: 'ua-7', exerciseId: 'rope-triceps-pushdown', repRange: [10, 15], firstCompound: false },
    ],
  },
  lowerA: {
    kind: 'lowerA',
    name: { en: 'Lower A', ar: 'Lower A' },
    postureRoutineIds: ['gymPre', 'gymPost'],
    slots: [
      { slotId: 'la-1', exerciseId: 'leg-press', repRange: [8, 12], firstCompound: true },
      { slotId: 'la-2', exerciseId: 'seated-leg-curl', repRange: [10, 15], firstCompound: false },
      { slotId: 'la-3', exerciseId: 'leg-extension', repRange: [10, 15], firstCompound: false },
      { slotId: 'la-4', exerciseId: 'db-rdl', repRange: [8, 10], firstCompound: false },
      { slotId: 'la-5', exerciseId: 'calf-raise', repRange: [12, 15], firstCompound: false },
      { slotId: 'la-6', exerciseId: 'dead-bug', repRange: [8, 10], firstCompound: false },
    ],
  },
  recovery: {
    kind: 'recovery',
    name: { en: 'Active Recovery + Posture', ar: 'راحة نشطة + تمارين الظهر' },
    postureRoutineIds: ['daily'],
    slots: [],
  },
  upperB: {
    kind: 'upperB',
    name: { en: 'Upper B', ar: 'Upper B' },
    postureRoutineIds: ['gymPre', 'gymPost'],
    slots: [
      { slotId: 'ub-1', exerciseId: 'shoulder-press-machine', repRange: [8, 12], firstCompound: true },
      { slotId: 'ub-2', exerciseId: 'seated-cable-row', repRange: [8, 12], firstCompound: false },
      { slotId: 'ub-3', exerciseId: 'incline-chest-press', repRange: [8, 12], firstCompound: false },
      { slotId: 'ub-4', exerciseId: 'lat-pulldown', repRange: [10, 12], firstCompound: false },
      { slotId: 'ub-5', exerciseId: 'rear-delt-fly-machine', repRange: [12, 15], firstCompound: false },
      { slotId: 'ub-6', exerciseId: 'biceps-curl', repRange: [10, 15], firstCompound: false },
      { slotId: 'ub-7', exerciseId: 'overhead-triceps-extension', repRange: [10, 15], firstCompound: false },
    ],
  },
  lowerB: {
    kind: 'lowerB',
    name: { en: 'Lower B', ar: 'Lower B' },
    postureRoutineIds: ['gymPre', 'gymPost'],
    slots: [
      { slotId: 'lb-1', exerciseId: 'leg-press', repRange: [10, 12], firstCompound: true },
      { slotId: 'lb-2', exerciseId: 'lying-leg-curl', repRange: [10, 15], firstCompound: false },
      { slotId: 'lb-3', exerciseId: 'leg-extension', repRange: [10, 15], firstCompound: false },
      { slotId: 'lb-4', exerciseId: 'barbell-rdl', repRange: [8, 10], firstCompound: false },
      { slotId: 'lb-5', exerciseId: 'calf-raise', repRange: [12, 15], firstCompound: false },
      { slotId: 'lb-6', exerciseId: 'plank', repRange: [20, 40], firstCompound: false },
    ],
  },
  rest: {
    kind: 'rest',
    name: { en: 'Rest + Posture', ar: 'راحة + تمارين الظهر' },
    postureRoutineIds: ['daily'],
    slots: [],
  },
}

export const TRAINING_DAYS: DayKind[] = ['upperA', 'lowerA', 'upperB', 'lowerB']
export const DAY_ORDER: DayKind[] = ['upperA', 'lowerA', 'recovery', 'upperB', 'lowerB', 'rest']
export const isTrainingDay = (k: DayKind) => PROGRAM[k].slots.length > 0
