import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useT } from '@/i18n'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
export function Button({ variant = 'primary', className = '', children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const base = 'tap inline-flex items-center justify-center gap-2 rounded-2xl px-4 font-semibold text-base active:scale-[0.98] transition disabled:opacity-40'
  const v = {
    primary: 'bg-accent text-black',
    secondary: 'bg-surface-2 text-text border border-border',
    ghost: 'bg-transparent text-text',
    danger: 'bg-danger/15 text-danger border border-danger/40',
  }[variant]
  return (
    <button className={`${base} ${v} ${className}`} {...rest}>
      {children}
    </button>
  )
}

export function IconButton({ className = '', children, label, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button aria-label={label} title={label} className={`tap inline-flex items-center justify-center rounded-full text-muted active:bg-surface-2 ${className}`} {...rest}>
      {children}
    </button>
  )
}

export function PageHeader({ title, back, right, sub }: { title: ReactNode; back?: boolean | string; right?: ReactNode; sub?: ReactNode }) {
  const nav = useNavigate()
  const { t } = useT()
  return (
    <header className="flex items-center gap-2 mb-4 min-h-12">
      {back && (
        <IconButton label={t('common.back')} onClick={() => (typeof back === 'string' ? nav(back) : nav(-1))} className="-ms-2">
          <ChevronLeft size={28} className="rtl:flip" />
        </IconButton>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-bold leading-tight line-clamp-2">{title}</h1>
        {sub && <div className="text-sm text-muted line-clamp-2">{sub}</div>}
      </div>
      {right}
    </header>
  )
}

export function Card({ className = '', children, onClick }: { className?: string; children: ReactNode; onClick?: () => void }) {
  return (
    <div className={`card p-4 ${onClick ? 'active:bg-surface-2 cursor-pointer' : ''} ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}

export function Chip({ active, children, onClick, className = '' }: { active?: boolean; children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-11 px-3.5 rounded-full text-sm font-medium whitespace-nowrap border transition ${active ? 'bg-accent text-black border-accent' : 'bg-surface text-text border-border'} ${className}`}
    >
      {children}
    </button>
  )
}

export function Empty({ text }: { text: string }) {
  return <div className="text-center text-muted py-10">{text}</div>
}

export function Row({ label, value, onClick, children }: { label: ReactNode; value?: ReactNode; onClick?: () => void; children?: ReactNode }) {
  return (
    <div className={`flex items-center justify-between gap-3 min-h-12 py-2 ${onClick ? 'cursor-pointer active:opacity-70' : ''}`} onClick={onClick}>
      <div className="text-base">{label}</div>
      <div className="text-muted text-base flex items-center gap-2">{value}{children}</div>
    </div>
  )
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="tap inline-flex items-center justify-center shrink-0 -my-2"
    >
      <span className={`relative w-14 h-8 rounded-full transition ${checked ? 'bg-accent' : 'bg-surface-2 border border-border'}`}>
        <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${checked ? 'start-7' : 'start-1'}`} />
      </span>
    </button>
  )
}
