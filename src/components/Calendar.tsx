import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useT } from '@/i18n'
import { dateKey } from '@/utils/date'

export interface DayMark { color: string; unfinished?: boolean }

export function Calendar({ month, onMonth, marks, selected, onSelect }: { month: Date; onMonth: (d: Date) => void; marks: Record<string, DayMark[]>; selected: string | null; onSelect: (k: string | null) => void }) {
  const { t, lang } = useT()
  const y = month.getFullYear(), m = month.getMonth()
  const first = new Date(y, m, 1)
  const weekStart = 6 // Saturday
  const lead = (first.getDay() - weekStart + 7) % 7
  const days = new Date(y, m + 1, 0).getDate()
  const cells: (string | null)[] = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => dateKey(new Date(y, m, i + 1)))]
  while (cells.length % 7) cells.push(null)
  const today = dateKey()
  const title = month.toLocaleDateString(lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB', { month: 'long', year: 'numeric' })
  return (
    <div className="card p-3">
      <div className="flex items-center justify-between mb-2">
        <button aria-label="prev" className="tap rounded-full" onClick={() => onMonth(new Date(y, m - 1, 1))}><ChevronLeft className="rtl:flip mx-auto" /></button>
        <div className="font-semibold">{title}</div>
        <button aria-label="next" className="tap rounded-full" onClick={() => onMonth(new Date(y, m + 1, 1))}><ChevronRight className="rtl:flip mx-auto" /></button>
      </div>
      <div className="grid grid-cols-7 text-center text-[11px] text-muted mb-1">{[6, 0, 1, 2, 3, 4, 5].map((d) => <div key={d}>{t(`weekdays.${d as 0}`)}</div>)}</div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((k, i) => {
          if (!k) return <div key={i} />
          const mk = marks[k] ?? []
          const sel = selected === k
          return (
            <button key={k} onClick={() => onSelect(sel ? null : k)} className={`h-11 rounded-xl flex flex-col items-center justify-center text-sm ${sel ? 'bg-accent text-black' : k === today ? 'border border-accent' : ''}`}>
              <span>{Number(k.slice(-2))}</span>
              <span className="flex gap-0.5 h-1.5">{mk.slice(0, 3).map((x, j) => <span key={j} className={`w-1.5 h-1.5 rounded-full ${x.unfinished ? 'ring-1 ring-warn' : ''}`} style={{ background: sel ? '#000' : x.color }} />)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export const DAY_COLORS: Record<string, string> = { upperA: '#22c55e', lowerA: '#38bdf8', upperB: '#a78bfa', lowerB: '#f472b6', recovery: '#f59e0b', rest: '#71717a', posture: '#f59e0b' }
