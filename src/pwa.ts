import { registerSW } from 'virtual:pwa-register'
import { useUi } from '@/stores/uiStore'
import { useActive } from '@/stores/activeWorkoutStore'

let update: ((reload?: boolean) => Promise<void>) | null = null

/**
 * New builds apply themselves as soon as there is no live workout, so the installed app
 * never stays on an old version. During a workout the update waits (Settings shows "Reload").
 */
export function setupServiceWorker() {
  if (!('serviceWorker' in navigator)) return
  update = registerSW({
    immediate: true,
    onNeedRefresh() {
      if (!useActive.getState().workout) { update?.(true); return }
      useUi.getState().setSwNeedsRefresh(true)
      const unsub = useActive.subscribe((s) => { if (!s.workout) { unsub(); update?.(true) } })
    },
  })
}

export async function applyUpdate() {
  if (update) await update(true)
}
