import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Calculator, Repeat, SkipForward, Check, MoreVertical, ChevronRight, Trash2, Flag } from 'lucide-react'
import { useT } from '@/i18n'
import { useSettings } from '@/stores/settingsStore'
import { useActive } from '@/stores/activeWorkoutStore'
import { useUi } from '@/stores/uiStore'
import { EXERCISES } from '@/data/exercises'
import { PROGRAM } from '@/data/program'
import { Stepper } from '@/components/Stepper'
import { Segmented } from '@/components/Segmented'
import { BottomSheet } from '@/components/BottomSheet'
import { Button, Chip } from '@/components/ui'
import { ExerciseFigure } from '@/components/ExerciseFigure'
import { RestTimerBar } from './RestTimerBar'
import { FormSheet, SkipSheet, SwapSheet, WarmupSheet } from './sheets'
import { finishWorkout, setsForSlot } from '@/engine/workoutBuilder'
import { evaluate } from '@/engine/progression'
import { sessionsRepo } from '@/db/repo/sessions'
import type { ActiveSlot, FormRating, LoggedSet, PainLevel } from '@/types'
import { uid } from '@/utils/id'
import { fmtDuration } from '@/utils/date'
import { fmtKg } from '@/utils/num'
import { useNow } from '@/hooks/useNow'
import { unlockAudio } from '@/timers/cues'

type Sheet = 'form' | 'warmup' | 'swap' | 'skip' | 'menu' | null

export default function LiveWorkout() {
  const nav = useNavigate()
  const { t, l } = useT()
  const settings = useSettings()
  const toast = useUi((s) => s.toast)
  const workout = useActive((s) => s.workout)!
  const { logSet, updateSet, deleteSet, setCurrent, addExtraSet, clear, unskip } = useActive()
  const now = useNow(1000)
  const [sheet, setSheet] = useState<Sheet>(null)
  const [editing, setEditing] = useState<LoggedSet | null>(null)
  const [weight, setWeight] = useState(0)
  const [reps, setReps] = useState(0)
  const [rir, setRir] = useState(3)
  const [form, setForm] = useState<FormRating>('good')
  const [pain, setPain] = useState<PainLevel>(0)
  const [warm, setWarm] = useState(false)
  const [finishing, setFinishing] = useState(false)

  const slot: ActiveSlot = workout.slots.find((s) => s.slotId === workout.currentSlotId) ?? workout.slots[0]
  const ex = EXERCISES[slot.exerciseId]
  const logged = setsForSlot(workout, slot.slotId)
  const working = logged.filter((s) => !s.isWarmup)
  const setIndex = working.length
  const total = slot.prescription.sets
  const isSkipped = workout.skips.some((k) => k.slotId === slot.slotId)
  const slotDone = setIndex >= total
  const isTimed = ex.loadType === 'time'
  const isBw = ex.loadType === 'bodyweight'

  // Prefill from previous set in this session, else prescription / last time
  useEffect(() => {
    const prev = working[working.length - 1]
    const last = slot.prescription.lastTime?.[Math.min(setIndex, (slot.prescription.lastTime?.length ?? 1) - 1)]
    setWeight(prev?.weight ?? slot.prescription.suggestedWeight ?? last?.weight ?? 0)
    setReps(prev?.reps ?? slot.prescription.suggestedReps ?? last?.reps ?? slot.prescription.repRange[0])
    setRir(slot.prescription.targetRir)
    setForm('good'); setPain(0); setWarm(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slot.slotId, slot.exerciseId, setIndex])

  // Crash safety net: snapshot to IndexedDB on hide and every 60 s
  useEffect(() => {
    const snap = () => { const w = useActive.getState().workout; if (w) sessionsRepo.snapshotActive(w).catch(() => {}) }
    const onVis = () => { if (document.visibilityState === 'hidden') snap() }
    document.addEventListener('visibilitychange', onVis)
    const id = window.setInterval(snap, 60000)
    return () => { document.removeEventListener('visibilitychange', onVis); clearInterval(id) }
  }, [])

  const goNext = useCallback(() => {
    const i = workout.slots.findIndex((s) => s.slotId === slot.slotId)
    const next = workout.slots.slice(i + 1).find((s) => setsForSlot(workout, s.slotId).filter((x) => !x.isWarmup).length < s.prescription.sets && !workout.skips.some((k) => k.slotId === s.slotId))
      ?? workout.slots.find((s) => setsForSlot(workout, s.slotId).filter((x) => !x.isWarmup).length < s.prescription.sets && !workout.skips.some((k) => k.slotId === s.slotId))
    if (next) setCurrent(next.slotId)
  }, [workout, slot.slotId, setCurrent])

  const log = () => {
    unlockAudio()
    const s: LoggedSet = { id: uid(), slotId: slot.slotId, exerciseId: slot.exerciseId, setIndex: warm ? -1 : setIndex, weight, reps, rir, form, pain, isWarmup: warm, loggedAt: Date.now() }
    const lastWorking = !warm && setIndex + 1 >= total
    logSet(s, warm ? 45 : settings.defaultRestSec)
    if (lastWorking) {
      const ev = evaluate({ ...ex, repRange: slot.prescription.repRange }, [...working, s], slot.prescription.targetRir)
      toast(`${t('workout.suggestion')}: ${l(ev.reason)}`, ev.decision === 'down' ? 'error' : 'success')
    }
  }

  const finish = async () => {
    const open = workout.slots.filter((s) => setsForSlot(workout, s.slotId).filter((x) => !x.isWarmup).length < s.prescription.sets && !workout.skips.some((k) => k.slotId === s.slotId))
    if (!confirm(open.length ? t('workout.finishEarly') : t('workout.finishConfirm'))) return
    setFinishing(true)
    try { const session = await finishWorkout(workout); clear(); nav(`/workout/summary/${session.id}`, { replace: true }) }
    catch { toast(t('toast.error'), 'error'); setFinishing(false) }
  }
  const discard = async () => {
    if (!confirm(t('workout.discardConfirm'))) return
    await sessionsRepo.delete(workout.id).catch(() => {})
    clear(); nav('/workout', { replace: true })
  }
  const doneCount = useMemo(() => workout.slots.filter((s) => setsForSlot(workout, s.slotId).filter((x) => !x.isWarmup).length >= s.prescription.sets).length, [workout])
  const lastTime = slot.prescription.lastTime
  const stepW = ex.weightStep

  return (
    <main className="page page-notab flex flex-col min-h-dvh">
      <header className="flex items-center gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="font-bold truncate">{l(PROGRAM[workout.dayKind].name)} · {t('common.week')} {workout.week}</div>
          <div className="text-xs text-muted tabular-nums">{fmtDuration(now - workout.startedAt)} · {doneCount}/{workout.slots.length}</div>
        </div>
        <Button onClick={finish} disabled={finishing} className="h-11 px-4"><Flag size={16} />{t('workout.finish')}</Button>
        <button aria-label={t('common.more')} className="tap rounded-full text-muted" onClick={() => setSheet('menu')}><MoreVertical /></button>
      </header>

      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2 mb-1">
        {workout.slots.map((s, i) => {
          const n = setsForSlot(workout, s.slotId).filter((x) => !x.isWarmup).length
          const done = n >= s.prescription.sets, skipped = workout.skips.some((k) => k.slotId === s.slotId), cur = s.slotId === slot.slotId
          return <Chip key={s.slotId} active={cur} onClick={() => setCurrent(s.slotId)} className={done ? 'opacity-60 line-through' : skipped ? 'opacity-40' : ''}>{i + 1}. {EXERCISES[s.exerciseId]?.termEn}{done ? ' ✓' : ''}</Chip>
        })}
      </div>

      <section className="card p-3 mb-2">
        <div className="flex gap-3">
          <button className="w-20 h-20 rounded-xl bg-bg shrink-0" onClick={() => setSheet('form')} aria-label={t('workout.formCheck')}><ExerciseFigure poseId={ex.poseId} className="w-full h-full" /></button>
          <div className="flex-1 min-w-0">
            <div className="text-lg font-bold leading-tight">{l(ex.name)}</div>
            <div className="text-sm text-muted">{t('workout.setOf', { x: Math.min(setIndex + 1, total), y: total })} · {isTimed ? `${slot.prescription.repRange[0]}–${slot.prescription.repRange[1]} ${t('common.sec')}` : t('workout.targetReps', { min: slot.prescription.repRange[0], max: slot.prescription.repRange[1] })} · {t('workout.targetRir', { rir: slot.prescription.targetRir })}</div>
            <div className="text-sm mt-1">
              <span className="text-muted">{t('workout.lastTime')}: </span>
              {lastTime ? lastTime.map((s) => `${isBw ? '' : fmtKg(s.weight) + '×'}${s.reps}`).join(' · ') : <span className="text-info">{t('workout.noHistory')}</span>}
            </div>
            {slot.prescription.decision !== 'new' && <div className="text-xs text-accent mt-0.5">{l(slot.prescription.reason)}</div>}
          </div>
        </div>
        {ex.guide.kyphosisCue && <div className="mt-2 text-xs rounded-xl bg-info/10 text-info px-2.5 py-1.5"><b>{t('workout.machineNote')}:</b> {l(ex.guide.kyphosisCue)}</div>}
        {logged.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {logged.map((s) => (
              <li key={s.id}><button onClick={() => setEditing(s)} className={`min-h-9 px-2.5 rounded-lg text-sm tabular-nums ${s.isWarmup ? 'bg-surface-2 text-muted' : 'bg-accent/15 text-accent'}`}>{s.isWarmup ? 'W ' : ''}{isBw ? '' : fmtKg(s.weight) + '×'}{s.reps}{isTimed ? 's' : ''} <span className="opacity-60">@{s.rir}</span></button></li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex gap-1 mb-2">
        {[{ k: 'form', I: BookOpen, label: t('workout.formCheck') }, { k: 'warmup', I: Calculator, label: t('workout.warmupCalc') }, { k: 'swap', I: Repeat, label: t('workout.swap') }, { k: 'skip', I: SkipForward, label: t('workout.skipExercise') }].map(({ k, I, label }) => (
          <button key={k} onClick={() => setSheet(k as Sheet)} className="tap flex-1 flex flex-col items-center justify-center gap-0.5 rounded-2xl bg-surface border border-border text-[11px] text-muted py-1.5"><I size={20} />{label}</button>
        ))}
      </div>

      <div className="flex-1" />
      <RestTimerBar />

      {isSkipped ? (
        <div className="card p-4 mb-2 text-center"><div className="text-muted mb-2">{t('workout.skipped')}</div><div className="flex gap-2"><Button variant="secondary" className="flex-1" onClick={() => unskip(slot.slotId)}>{t('common.undo')}</Button><Button className="flex-1" onClick={goNext}>{t('workout.nextExercise')}<ChevronRight size={18} className="rtl:flip" /></Button></div></div>
      ) : slotDone ? (
        <div className="card p-4 mb-2">
          <div className="text-center font-semibold text-accent mb-3"><Check className="inline -mt-1 me-1" />{t('workout.allSetsDone')}</div>
          <div className="flex gap-2"><Button variant="secondary" onClick={() => addExtraSet(slot.slotId)}>{t('workout.addSet')}</Button><Button className="flex-1 h-14 text-lg" onClick={goNext}>{t('workout.nextExercise')}<ChevronRight size={20} className="rtl:flip" /></Button></div>
        </div>
      ) : (
        <div className="card p-3 mb-2">
          <div className="flex gap-2 mb-2">
            {!isBw && <Stepper label={t('workout.weight')} unit={t('common.kg')} value={weight} onChange={setWeight} step={stepW} big />}
            <Stepper label={isTimed ? t('workout.seconds') : t('workout.reps')} value={reps} onChange={setReps} step={isTimed ? 5 : 1} max={isTimed ? 600 : 100} big />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-muted w-10">RIR</span>
            <div className="flex gap-1 flex-1">{[0, 1, 2, 3, 4, 5].map((n) => <button key={n} onClick={() => setRir(n)} className={`flex-1 min-h-10 rounded-lg text-sm font-semibold ${rir === n ? 'bg-accent text-black' : 'bg-surface-2 text-muted'}`}>{n}</button>)}</div>
          </div>
          <div className="flex gap-2 mb-2">
            <div className="flex-1"><Segmented value={form} onChange={setForm} options={[{ value: 'good', label: t('workout.formGood') }, { value: 'ok', label: t('workout.formOk'), tone: 'warn' }, { value: 'poor', label: t('workout.formPoor'), tone: 'bad' }]} /></div>
            <div className="flex-1"><Segmented value={String(pain) as '0'} onChange={(v) => setPain(Number(v) as PainLevel)} options={[{ value: '0', label: t('workout.painNone') }, { value: '1', label: t('workout.painMild'), tone: 'warn' }, { value: '2', label: t('workout.painBad'), tone: 'bad' }]} /></div>
          </div>
          <div className="flex gap-2">
            {!isBw && !isTimed && <button onClick={() => setWarm(!warm)} className={`tap px-3 rounded-2xl text-sm font-semibold border ${warm ? 'bg-warn text-black border-warn' : 'bg-surface-2 border-border text-muted'}`}>{t('workout.warmup')}</button>}
            <Button className="flex-1 h-14 text-lg" onClick={log}><Check size={22} />{warm ? t('workout.warmupSet') : t('workout.logSet')}</Button>
          </div>
        </div>
      )}

      <FormSheet slot={sheet === 'form' ? slot : null} onClose={() => setSheet(null)} />
      <WarmupSheet slot={sheet === 'warmup' ? slot : null} weight={weight} onClose={() => setSheet(null)} />
      <SwapSheet slot={sheet === 'swap' ? slot : null} onClose={() => setSheet(null)} />
      <SkipSheet slot={sheet === 'skip' ? slot : null} onClose={() => setSheet(null)} onSkipped={goNext} />
      <BottomSheet open={sheet === 'menu'} onClose={() => setSheet(null)} title={t('common.more')}>
        <Button variant="danger" className="w-full" onClick={discard}><Trash2 size={18} />{t('workout.discard')}</Button>
      </BottomSheet>
      <EditSetSheet set={editing} onClose={() => setEditing(null)} onSave={(p) => { if (editing) updateSet(editing.id, p); setEditing(null) }} onDelete={() => { if (editing) deleteSet(editing.id); setEditing(null) }} isBw={isBw} isTimed={isTimed} step={stepW} />
    </main>
  )
}

export function EditSetSheet({ set, onClose, onSave, onDelete, isBw, isTimed, step }: { set: LoggedSet | null; onClose: () => void; onSave: (p: Partial<LoggedSet>) => void; onDelete: () => void; isBw: boolean; isTimed: boolean; step: number }) {
  const { t } = useT()
  const [w, setW] = useState(0); const [r, setR] = useState(0); const [rir, setRir] = useState(0)
  useEffect(() => { if (set) { setW(set.weight); setR(set.reps); setRir(set.rir) } }, [set])
  return (
    <BottomSheet open={!!set} onClose={onClose} title={t('workout.editSet')}>
      <div className="flex gap-2 mb-3">
        {!isBw && <Stepper label={t('workout.weight')} value={w} onChange={setW} step={step} />}
        <Stepper label={isTimed ? t('workout.seconds') : t('workout.reps')} value={r} onChange={setR} step={isTimed ? 5 : 1} />
        <Stepper label="RIR" value={rir} onChange={setRir} step={1} max={10} />
      </div>
      <div className="flex gap-2">
        <Button variant="danger" onClick={onDelete}><Trash2 size={18} />{t('workout.deleteSet')}</Button>
        <Button className="flex-1" onClick={() => onSave({ weight: w, reps: r, rir })}>{t('common.save')}</Button>
      </div>
    </BottomSheet>
  )
}
