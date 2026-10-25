import { create } from 'zustand'
import { BottomSheet } from './BottomSheet'
import { Button } from './ui'
import { useT } from '@/i18n'

interface Req { title: string; body?: string; okLabel?: string; danger?: boolean; resolve: (v: boolean) => void }
const useConfirmStore = create<{ req: Req | null; set: (r: Req | null) => void }>()((set) => ({ req: null, set: (req) => set({ req }) }))

/** In-app replacement for window.confirm. */
export function confirmSheet(title: string, opts: { body?: string; okLabel?: string; danger?: boolean } = {}): Promise<boolean> {
  return new Promise((resolve) => useConfirmStore.getState().set({ title, ...opts, resolve }))
}

export function ConfirmHost() {
  const { t } = useT()
  const req = useConfirmStore((s) => s.req)
  const set = useConfirmStore((s) => s.set)
  const done = (v: boolean) => { req?.resolve(v); set(null) }
  return (
    <BottomSheet open={!!req} onClose={() => done(false)} title={req?.title}>
      {req?.body && <p className="text-[15px] text-muted mb-4 leading-relaxed">{req.body}</p>}
      <div className="flex gap-2">
        <Button variant="secondary" className="flex-1" onClick={() => done(false)}>{t('common.cancel')}</Button>
        <Button variant={req?.danger ? 'danger' : 'primary'} className="flex-1" onClick={() => done(true)}>{req?.okLabel ?? t('common.confirm')}</Button>
      </div>
    </BottomSheet>
  )
}
