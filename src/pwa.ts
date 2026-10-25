import { registerSW } from 'virtual:pwa-register'
import { useUi } from '@/stores/uiStore'

let update: ((reload?: boolean) => Promise<void>) | null = null

export function setupServiceWorker() {
  if (!('serviceWorker' in navigator)) return
  update = registerSW({
    immediate: true,
    onNeedRefresh() { useUi.getState().setSwNeedsRefresh(true) },
  })
}

export async function applyUpdate() {
  if (update) await update(true)
}
