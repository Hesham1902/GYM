import { Minus, Plus } from 'lucide-react'
import { fmtKg } from '@/utils/num'

export function Stepper({ value, onChange, step, min = 0, max = 999, label, unit, big }: { value: number; onChange: (v: number) => void; step: number; min?: number; max?: number; label: string; unit?: string; big?: boolean }) {
  const set = (v: number) => onChange(Math.min(max, Math.max(min, Math.round(v * 100) / 100)))
  return (
    <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
      <div className="t-cap">{label}{unit ? ` (${unit})` : ''}</div>
      <div className="flex items-center gap-1 w-full" dir="ltr">
        <button type="button" aria-label={`${label} -`} onClick={() => set(value - step)} className="h-14 w-14 rounded-[14px] bg-surface-2 active:bg-surface-3 shrink-0"><Minus className="mx-auto" /></button>
        <input
          type="number"
          inputMode="decimal"
          value={Number.isFinite(value) ? fmtKg(value) : ''}
          onChange={(e) => set(parseFloat(e.target.value) || 0)}
          onFocus={(e) => e.target.select()}
          className={`w-0 flex-1 min-w-0 h-14 text-center bg-transparent font-bold ${big ? 'text-[32px]' : 'text-2xl'} outline-none`}
          aria-label={label}
        />
        <button type="button" aria-label={`${label} +`} onClick={() => set(value + step)} className="h-14 w-14 rounded-[14px] bg-surface-2 active:bg-surface-3 shrink-0"><Plus className="mx-auto" /></button>
      </div>
    </div>
  )
}
