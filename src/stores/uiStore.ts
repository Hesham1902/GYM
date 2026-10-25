import { create } from 'zustand'

export interface Toast { id: number; text: string; kind: 'info' | 'success' | 'error' }

interface UiStore {
  toasts: Toast[]
  toast: (text: string, kind?: Toast['kind']) => void
  dismiss: (id: number) => void
  online: boolean
  setOnline: (v: boolean) => void
  swNeedsRefresh: boolean
  setSwNeedsRefresh: (v: boolean) => void
}

let seq = 1
export const useUi = create<UiStore>()((set, get) => ({
  toasts: [],
  toast: (text, kind = 'info') => {
    const id = seq++
    set({ toasts: [...get().toasts, { id, text, kind }] })
    setTimeout(() => get().dismiss(id), 2600)
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
  online: typeof navigator === 'undefined' ? true : navigator.onLine,
  setOnline: (v) => set({ online: v }),
  swNeedsRefresh: false,
  setSwNeedsRefresh: (v) => set({ swNeedsRefresh: v }),
}))
