import { Minus, Plus } from 'lucide-react'
import { fmtKg } from '@/utils/num'

export function Stepper({ value, onChange, step, min = 0, max = 999, label, unit, big }: { value: number; onChange: (v: number) => void; step: number; min?: number; max?: number; label: string; unit?: string; big?: boolean }) {
  const set = (v: number) => onChange(Math.min(max, Math.max(min, Math.round(v * 100) / 100)))
  return (
    <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
      <div className="text-xs text-muted uppercase tracking-wide">{label}</div>
      <div className="flex items-center gap-1 w-full" dir="ltr">
        <button type="button" aria-label={`${label} -`} onClick={() => set(value - step)} className="tap h-14 w-14 rounded-2xl bg-surface-2 border border-border active:bg-border shrink-0"><Minus className="mx-auto" /></button>
        <input
          type="number"
          inputMode="decimal"
          value={Number.isFinite(value) ? fmtKg(value) : ''}
          onChange={(e) => set(parseFloat(e.target.value) || 0)}
          onFocus={(e) => e.target.select()}
          className={`w-0 flex-1 min-w-0 h-14 text-center bg-transparent font-bold ${big ? 'text-3xl' : 'text-2xl'} outline-none`}
          aria-label={label}
        />
        <button type="button" aria-label={`${label} +`} onClick={() => set(value + step)} className="tap h-14 w-14 rounded-2xl bg-surface-2 border border-border active:bg-border shrink-0"><Plus className="mx-auto" /></button>
      </div>
      {unit && <div className="text-xs text-muted">{unit}</div>}
    </div>
  )
}
