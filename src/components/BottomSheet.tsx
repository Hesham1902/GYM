import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { useT } from '@/i18n'

// Open sheets, innermost last: only the top one reacts to Escape/Tab, and the page stays locked until all are closed.
const stack: HTMLElement[] = []

export function BottomSheet({ open, onClose, title, children, footer, tall }: { open: boolean; onClose: () => void; title?: ReactNode; children: ReactNode; footer?: ReactNode; tall?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  const { t } = useT()
  useEffect(() => {
    if (!open || !ref.current) return
    const el = ref.current
    const prev = document.activeElement as HTMLElement | null
    stack.push(el)
    el.querySelector<HTMLElement>('button, input, [tabindex]')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (stack[stack.length - 1] !== el) return
      if (e.key === 'Escape') closeRef.current()
      if (e.key === 'Tab') {
        const f = Array.from(el.querySelectorAll<HTMLElement>('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])')).filter((x) => !x.hasAttribute('disabled'))
        if (!f.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      stack.splice(stack.indexOf(el), 1)
      if (!stack.length) document.body.style.overflow = ''
      prev?.focus?.()
    }
  }, [open])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div ref={ref} className={`relative w-full bg-surface rounded-t-3xl border-t border-border flex flex-col ${tall ? 'h-[92dvh]' : 'max-h-[85dvh]'}`} style={{ paddingBottom: 'var(--sab)' }}>
        <div className="w-10 h-1.5 rounded-full bg-border absolute top-2 left-1/2 -translate-x-1/2" />
        <div className="flex items-center justify-between px-4 pt-3 pb-2 shrink-0">
          <h2 className="text-lg font-bold mt-2 flex-1 min-w-0">{title}</h2>
          <button aria-label={t('common.close')} onClick={onClose} className="tap rounded-full text-muted -me-2 mt-2 shrink-0"><X size={24} className="mx-auto" /></button>
        </div>
        <div className="overflow-y-auto overscroll-contain px-4 pb-4 flex-1">{children}</div>
        {footer && <div className="shrink-0 px-4 pt-2 pb-4 border-t border-border">{footer}</div>}
      </div>
    </div>
  )
}
