import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DayKind, Settings } from '@/types'

export const DEFAULT_WEEKDAY_PLAN: Record<number, DayKind> = {
  6: 'upperA', 0: 'lowerA', 1: 'recovery', 2: 'upperB', 3: 'lowerB', 4: 'rest', 5: 'rest',
}

export const DEFAULT_SETTINGS: Settings = {
  language: 'ar',
  weekdayPlan: DEFAULT_WEEKDAY_PLAN,
  slotOrder: {},
  rampWeekOverride: null,
  programStartDate: null,
  permanentSwaps: {},
  favorites: [],
  sound: true,
  vibration: true,
  defaultRestSec: 90,
  stepGoal: 7000,
  lastBackupAt: null,
  onboarded: false,
}

interface SettingsStore extends Settings {
  set: (patch: Partial<Settings>) => void
  toggleFavorite: (id: string) => boolean
  setWeekday: (weekday: number, kind: DayKind) => void
  setSlotOrder: (kind: DayKind, order: string[]) => void
  setPermanentSwap: (slotId: string, exerciseId: string | null) => void
  reset: () => void
}

export const useSettings = create<SettingsStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_SETTINGS,
      set: (patch) => set(patch),
      toggleFavorite: (id) => {
        const favs = get().favorites
        const has = favs.includes(id)
        set({ favorites: has ? favs.filter((f) => f !== id) : [...favs, id] })
        return !has
      },
      setWeekday: (weekday, kind) => set({ weekdayPlan: { ...get().weekdayPlan, [weekday]: kind } }),
      setSlotOrder: (kind, order) => set({ slotOrder: { ...get().slotOrder, [kind]: order } }),
      setPermanentSwap: (slotId, exerciseId) => {
        const next = { ...get().permanentSwaps }
        if (exerciseId) next[slotId] = exerciseId
        else delete next[slotId]
        set({ permanentSwaps: next })
      },
      reset: () => set({ ...DEFAULT_SETTINGS }),
    }),
    { name: 'gym.settings', version: 1 },
  ),
)
