import type { Decision, Exercise, ExerciseSetRow, L10n, LoggedSet, SetPrescription } from '@/types'
import { roundTo } from '@/utils/num'
import { rirForWeek, setsForWeek } from './week'

export interface Evaluation { decision: Decision; reason: L10n; suggestedWeight: number | null; suggestedReps: number | null }

type SetLike = Pick<LoggedSet, 'weight' | 'reps' | 'rir' | 'form' | 'pain'>

/** Double progression on last session's working sets. */
export function evaluate(ex: Exercise, last: SetLike[], targetRir: number): Evaluation {
  const [lo, hi] = ex.repRange
  if (!last.length) {
    return { decision: 'new', reason: { en: 'First session: start light, ~4 reps in reserve', ar: 'أول تمرين: ابدأ خفيف وسيب حوالي 4 عدّات في الخزنة' }, suggestedWeight: null, suggestedReps: lo }
  }
  const top = Math.max(...last.map((s) => s.weight))
  const painBad = last.some((s) => s.pain === 2)
  const poorSets = last.filter((s) => s.form === 'poor').length
  if (painBad || poorSets >= 2) {
    const w = ex.loadType === 'weight' ? Math.max(0, roundTo(top * 0.9, 2.5)) : top
    return { decision: 'down', reason: { en: `Form or joints complained — drop to ${w} kg and own the movement`, ar: `الأداء أو المفصل اشتكى. نزّل لـ ${w} كجم واتقن الحركة` }, suggestedWeight: w, suggestedReps: lo }
  }
  const allTop = last.every((s) => s.reps >= hi)
  const cleanForm = poorSets === 0
  const lowPain = last.every((s) => s.pain === 0)
  const highFatigue = last.some((s) => s.rir < targetRir - 1)
  if (allTop && cleanForm && lowPain && !highFatigue) {
    if (ex.loadType !== 'weight') {
      return { decision: 'up', reason: { en: `Top of the range on every set — add ${ex.loadType === 'time' ? '5–10 s' : '1–2 reps'} or a harder variation`, ar: `وصلت لأعلى الـ range في كل الـ sets. زوّد ${ex.loadType === 'time' ? '5–10 ثواني' : 'عدّة أو اتنين'} أو جرّب نسخة أصعب` }, suggestedWeight: top, suggestedReps: hi }
    }
    const w = top + ex.weightStep
    return { decision: 'up', reason: { en: `All sets hit ${hi} — next time +${ex.weightStep} kg`, ar: `كل الـ sets وصلت ${hi}. المرة الجاية زوّد ${ex.weightStep} كجم` }, suggestedWeight: w, suggestedReps: lo }
  }
  const minReps = Math.min(...last.map((s) => s.reps))
  return { decision: 'hold', reason: { en: `Keep ${top} kg and push reps toward ${hi}`, ar: `خلّيك على ${top} كجم وزوّد الـ reps لحد ${hi}` }, suggestedWeight: top, suggestedReps: Math.min(hi, Math.max(lo, minReps + 1)) }
}

export function prescribe(ex: Exercise, repRange: [number, number], week: number, firstCompound: boolean, lastRows: ExerciseSetRow[]): SetPrescription {
  const exWithRange: Exercise = { ...ex, repRange }
  const targetRir = rirForWeek(week)
  const sets = setsForWeek(week, firstCompound, ex.isCompound)
  const ev = evaluate(exWithRange, lastRows, targetRir)
  const lastTime: LoggedSet[] | null = lastRows.length
    ? lastRows.map((r) => ({ id: r.id, slotId: '', exerciseId: r.exerciseId, setIndex: r.setIndex, weight: r.weight, reps: r.reps, rir: r.rir, form: r.form, pain: r.pain, isWarmup: false, loggedAt: r.loggedAt }))
    : null
  return { sets, repRange, targetRir, suggestedWeight: ev.suggestedWeight, suggestedReps: ev.suggestedReps, decision: ev.decision, reason: ev.reason, lastTime }
}
