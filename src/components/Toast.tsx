import { useUi } from '@/stores/uiStore'

export function Toasts() {
  const toasts = useUi((s) => s.toasts)
  if (!toasts.length) return null
  return (
    <div className="fixed inset-x-0 z-50 flex flex-col items-center gap-2 pointer-events-none" style={{ top: 'calc(var(--sat) + 12px)' }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-2 rounded-full text-sm shadow-lg ${t.kind === 'error' ? 'bg-danger text-white' : t.kind === 'success' ? 'bg-accent text-black' : 'bg-surface-2 text-text'}`}
        >
          {t.text}
        </div>
      ))}
    </div>
  )
}
