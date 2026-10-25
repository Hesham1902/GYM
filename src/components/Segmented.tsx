export function Segmented<T extends string>({ value, onChange, options, className = '' }: { value: T; onChange: (v: T) => void; options: { value: T; label: string; tone?: 'ok' | 'warn' | 'bad' }[]; className?: string }) {
  return (
    <div className={`flex rounded-2xl bg-surface-2 p-1 gap-1 ${className}`} role="radiogroup">
      {options.map((o) => {
        const active = o.value === value
        const tone = active ? (o.tone === 'bad' ? 'bg-danger text-white' : o.tone === 'warn' ? 'bg-warn text-black' : 'bg-accent text-black') : 'text-muted'
        return (
          <button key={o.value} type="button" role="radio" aria-checked={active} onClick={() => onChange(o.value)} className={`flex-1 min-h-11 rounded-xl text-sm font-semibold transition ${tone}`}>
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
