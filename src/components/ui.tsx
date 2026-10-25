import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useT } from '@/i18n'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'soft'
type Size = 'sm' | 'md' | 'lg'
export function Button({ variant = 'primary', size = 'md', className = '', children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-[14px] font-semibold active:scale-[0.98] transition disabled:opacity-40 whitespace-nowrap'
  const s = { sm: 'h-10 px-3.5 text-sm', md: 'h-12 px-4 text-base', lg: 'h-14 px-5 text-[17px]' }[size]
  const v = {
    primary: 'bg-accent text-accent-ink',
    secondary: 'bg-surface-2 text-text',
    soft: 'bg-accent/12 text-accent',
    ghost: 'bg-transparent text-accent',
    danger: 'bg-danger/12 text-danger',
  }[variant]
  return <button className={`${base} ${s} ${v} ${className}`} {...rest}>{children}</button>
}

export function IconButton({ className = '', children, label, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button aria-label={label} title={label} className={`tap inline-flex items-center justify-center rounded-full text-muted active:bg-surface-2 ${className}`} {...rest}>
      {children}
    </button>
  )
}

/** Large page title with optional back, subtitle and trailing slot. */
export function PageHeader({ title, back, right, sub, brand }: { title: ReactNode; back?: boolean | string; right?: ReactNode; sub?: ReactNode; brand?: boolean }) {
  const nav = useNavigate()
  const { t } = useT()
  return (
    <header className="mb-4">
      {(back || right) && (
        <div className="flex items-center justify-between min-h-12 -mx-2">
          {back ? <IconButton label={t('common.back')} onClick={() => (typeof back === 'string' ? nav(back) : nav(-1))}><ChevronLeft size={28} className="rtl:flip" /></IconButton> : <span />}
          {right}
        </div>
      )}
      <div className={back || right ? '' : 'pt-2'}>
        {sub && <div className="t-cap mb-0.5">{sub}</div>}
        <h1 className={brand ? 't-title tracking-wide' : 't-title'}>{title}</h1>
      </div>
    </header>
  )
}

export function Card({ className = '', children, onClick, outline }: { className?: string; children: ReactNode; onClick?: () => void; outline?: boolean }) {
  const cls = `card ${outline ? 'card-outline' : ''} ${onClick ? 'active:bg-surface-2 cursor-pointer' : ''} ${className}`
  if (onClick) return <button type="button" onClick={onClick} className={`w-full text-start p-4 ${cls}`}>{children}</button>
  return <div className={`p-4 ${cls}`}>{children}</div>
}

export function Chip({ active, children, onClick, className = '' }: { active?: boolean; children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick}
      className={`h-10 px-3.5 rounded-full text-sm font-medium whitespace-nowrap transition ${active ? 'bg-accent text-accent-ink' : 'bg-surface-2 text-text'} ${className}`}>
      {children}
    </button>
  )
}

/** Small read-only meta label. Numbers inside stay LTR. */
export function Pill({ children, tone = 'muted', className = '' }: { children: ReactNode; tone?: 'muted' | 'accent' | 'warn' | 'danger' | 'info'; className?: string }) {
  const c = { muted: 'bg-surface-2 text-muted', accent: 'bg-accent/15 text-accent', warn: 'bg-warn/15 text-warn', danger: 'bg-danger/15 text-danger', info: 'bg-info/15 text-info' }[tone]
  return <span className={`inline-flex items-center h-7 px-2.5 rounded-full text-[13px] font-medium whitespace-nowrap ${c} ${className}`}>{children}</span>
}

/** Numeric / Latin run isolated LTR inside Arabic text. */
export function N({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`num ${className}`}>{children}</span>
}

export function Empty({ text, hint }: { text: string; hint?: string }) {
  return <div className="text-center py-12"><div className="text-muted">{text}</div>{hint && <div className="t-cap mt-1">{hint}</div>}</div>
}

/** Settings-style row: label start, value/control end. */
export function Row({ label, value, onClick, children, sub }: { label: ReactNode; value?: ReactNode; onClick?: () => void; children?: ReactNode; sub?: ReactNode }) {
  const inner = <>
    <div className="min-w-0"><div className="t-body">{label}</div>{sub && <div className="t-cap">{sub}</div>}</div>
    <div className="text-muted t-body flex items-center gap-2 shrink-0">{value}{children}{onClick && <ChevronRight size={18} className="rtl:flip text-faint" />}</div>
  </>
  if (onClick) return <button type="button" onClick={onClick} className="w-full flex items-center justify-between gap-3 min-h-12 py-2 text-start active:opacity-70">{inner}</button>
  return <div className="flex items-center justify-between gap-3 min-h-12 py-2">{inner}</div>
}

/** List row with a leading slot (thumb or number), title, subtitle and trailing content. */
export function ListRow({ lead, title, sub, trailing, onClick, className = '' }: { lead?: ReactNode; title: ReactNode; sub?: ReactNode; trailing?: ReactNode; onClick?: () => void; className?: string }) {
  const inner = <>
    {lead}
    <div className="flex-1 min-w-0">
      <div className="t-body font-medium leading-snug">{title}</div>
      {sub && <div className="t-cap mt-0.5">{sub}</div>}
    </div>
    {trailing}
    {onClick && <ChevronRight size={18} className="rtl:flip text-faint shrink-0" />}
  </>
  const cls = `flex items-center gap-3 min-h-14 ${className}`
  if (onClick) return <button type="button" onClick={onClick} className={`w-full text-start ${cls} active:opacity-70`}>{inner}</button>
  return <div className={cls}>{inner}</div>
}

export function Stat({ value, label, tone }: { value: ReactNode; label: ReactNode; tone?: 'accent' | 'warn' }) {
  return <div className="card p-3 text-center"><div className={`text-[22px] font-bold leading-tight num ${tone === 'accent' ? 'text-accent' : tone === 'warn' ? 'text-warn' : ''}`}>{value}</div><div className="t-cap mt-0.5">{label}</div></div>
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}
      className={`relative w-[52px] h-8 rounded-full transition shrink-0 ${checked ? 'bg-accent' : 'bg-surface-3'}`}>
      <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${checked ? 'start-[22px]' : 'start-1'}`} />
    </button>
  )
}
