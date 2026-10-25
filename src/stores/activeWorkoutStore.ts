import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ActiveWorkout, LoggedSet, SkipRecord, SwapRecord } from '@/types'
import { adjustRest, startRest } from '@/timers/restTimer'

interface ActiveStore {
  workout: ActiveWorkout | null
  start: (w: ActiveWorkout) => void
  clear: () => void
  patch: (fn: (w: ActiveWorkout) => Partial<ActiveWorkout>) => void
  logSet: (set: LoggedSet, restSec: number | null) => void
  updateSet: (id: string, patch: Partial<LoggedSet>) => void
  deleteSet: (id: string) => void
  setCurrent: (slotId: string) => void
  addExtraSet: (slotId: string) => void
  swap: (rec: SwapRecord, newRepRange: [number, number], prescription: ActiveWorkout['slots'][number]['prescription']) => void
  skip: (rec: SkipRecord) => void
  unskip: (slotId: string) => void
  startRest: (slotId: string, sec: number) => void
  adjustRest: (deltaSec: number) => void
  skipRest: () => void
  markNotified: () => void
}

const touch = (w: ActiveWorkout, p: Partial<ActiveWorkout>): ActiveWorkout => ({ ...w, ...p, updatedAt: Date.now() })

export const useActive = create<ActiveStore>()(
  persist(
    (set, get) => {
      const upd = (fn: (w: ActiveWorkout) => Partial<ActiveWorkout>) => {
        const w = get().workout; if (!w) return
        set({ workout: touch(w, fn(w)) })
      }
      return {
        workout: null,
        start: (w) => set({ workout: w }),
        clear: () => set({ workout: null }),
        patch: upd,
        logSet: (s, restSec) => upd((w) => ({
          sets: [...w.sets.filter((x) => x.id !== s.id), s],
          restTimer: restSec ? startRest(s.slotId, restSec) : w.restTimer,
        })),
        updateSet: (id, p) => upd((w) => ({ sets: w.sets.map((x) => (x.id === id ? { ...x, ...p } : x)) })),
        deleteSet: (id) => upd((w) => ({ sets: w.sets.filter((x) => x.id !== id) })),
        setCurrent: (slotId) => upd(() => ({ currentSlotId: slotId })),
        addExtraSet: (slotId) => upd((w) => ({ slots: w.slots.map((s) => (s.slotId === slotId ? { ...s, prescription: { ...s.prescription, sets: s.prescription.sets + 1 } } : s)) })),
        swap: (rec, repRange, prescription) => upd((w) => ({
          swaps: [...w.swaps, rec],
          slots: w.slots.map((s) => (s.slotId === rec.slotId ? { ...s, exerciseId: rec.to, prescription: { ...prescription, repRange } } : s)),
          skips: w.skips.filter((k) => k.slotId !== rec.slotId),
        })),
        skip: (rec) => upd((w) => ({ skips: [...w.skips.filter((k) => k.slotId !== rec.slotId), rec] })),
        unskip: (slotId) => upd((w) => ({ skips: w.skips.filter((k) => k.slotId !== slotId) })),
        startRest: (slotId, sec) => upd(() => ({ restTimer: startRest(slotId, sec) })),
        adjustRest: (d) => upd((w) => ({ restTimer: w.restTimer ? adjustRest(w.restTimer, d) : null })),
        skipRest: () => upd(() => ({ restTimer: null })),
        markNotified: () => upd((w) => ({ restTimer: w.restTimer ? { ...w.restTimer, notified: true } : null })),
      }
    },
    { name: 'gym.active', version: 1 },
  ),
)
