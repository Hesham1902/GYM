import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { useT } from '@/i18n'

export function BottomSheet({ open, onClose, title, children, tall }: { open: boolean; onClose: () => void; title?: ReactNode; children: ReactNode; tall?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const { t } = useT()
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    const el = ref.current
    el?.querySelector<HTMLElement>('button, input, [tabindex]')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && el) {
        const f = Array.from(el.querySelectorAll<HTMLElement>('button, input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter((x) => !x.hasAttribute('disabled'))
        if (!f.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; prev?.focus?.() }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div ref={ref} className={`relative w-full bg-surface rounded-t-3xl border-t border-border flex flex-col ${tall ? 'h-[92dvh]' : 'max-h-[85dvh]'}`} style={{ paddingBottom: 'var(--sab)' }}>
        <div className="flex items-center justify-between px-4 pt-3 pb-2 shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-border absolute top-2 start-1/2 -translate-x-1/2" />
          <h2 className="text-lg font-bold mt-2 flex-1">{title}</h2>
          <button aria-label={t('common.close')} onClick={onClose} className="tap rounded-full text-muted -me-2 mt-2"><X size={24} /></button>
        </div>
        <div className="overflow-y-auto px-4 pb-4 flex-1">{children}</div>
      </div>
    </div>
  )
}
