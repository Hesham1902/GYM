import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, MoreVertical, ChevronRight, Trash2, Flag, Calculator, Repeat, SkipForward, SlidersHorizontal, BookOpen } from 'lucide-react'
import { useT } from '@/i18n'
import { useSettings } from '@/stores/settingsStore'
import { useActive } from '@/stores/activeWorkoutStore'
import { useUi } from '@/stores/uiStore'
import { EXERCISES } from '@/data/exercises'
import { PROGRAM } from '@/data/program'
import { Stepper } from '@/components/Stepper'
import { Segmented } from '@/components/Segmented'
import { BottomSheet } from '@/components/BottomSheet'
import { Button, Chip, IconButton, N, Pill } from '@/components/ui'
import { ExerciseThumb } from '@/components/ExerciseMedia'
import { confirmSheet } from '@/components/Confirm'
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

type Sheet = 'form' | 'warmup' | 'swap' | 'skip' | 'menu' | 'details' | null

export default function LiveWorkout() {
  const nav = useNavigate()
  const { t, l, n } = useT()
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
  const [cueOpen, setCueOpen] = useState(false)
  const [finishing, setFinishing] = useState(false)
  const chipsRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const prev = working[working.length - 1]
    const last = slot.prescription.lastTime?.[Math.min(setIndex, (slot.prescription.lastTime?.length ?? 1) - 1)]
    setWeight(prev?.weight ?? slot.prescription.suggestedWeight ?? last?.weight ?? 0)
    setReps(prev?.reps ?? slot.prescription.suggestedReps ?? last?.reps ?? slot.prescription.repRange[0])
    setRir(slot.prescription.targetRir); setForm('good'); setPain(0); setWarm(false); setCueOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slot.slotId, slot.exerciseId, setIndex])

  useEffect(() => { chipsRef.current?.querySelector('[aria-pressed="true"]')?.scrollIntoView({ inline: 'center', block: 'nearest' }) }, [slot.slotId])

  useEffect(() => {
    const snap = () => { const w = useActive.getState().workout; if (w) sessionsRepo.snapshotActive(w).catch(() => {}) }
    const onVis = () => { if (document.visibilityState === 'hidden') snap() }
    document.addEventListener('visibilitychange', onVis)
    const id = window.setInterval(snap, 60000)
    return () => { document.removeEventListener('visibilitychange', onVis); clearInterval(id) }
  }, [])

  const isOpen = useCallback((s: ActiveSlot) => setsForSlot(workout, s.slotId).filter((x) => !x.isWarmup).length < s.prescription.sets && !workout.skips.some((k) => k.slotId === s.slotId), [workout])
  const goNext = useCallback(() => {
    const i = workout.slots.findIndex((s) => s.slotId === slot.slotId)
    const next = workout.slots.slice(i + 1).find(isOpen) ?? workout.slots.find(isOpen)
    if (next) setCurrent(next.slotId)
  }, [workout, slot.slotId, setCurrent, isOpen])

  const log = () => {
    unlockAudio()
    const s: LoggedSet = { id: uid(), slotId: slot.slotId, exerciseId: slot.exerciseId, setIndex: warm ? -1 : setIndex, weight, reps, rir, form, pain, isWarmup: warm, loggedAt: Date.now() }
    const lastWorking = !warm && setIndex + 1 >= total
    logSet(s, warm ? 45 : settings.defaultRestSec)
    if (lastWorking) {
      const ev = evaluate({ ...ex, repRange: slot.prescription.repRange }, [...working, s], slot.prescription.targetRir)
      toast(l(ev.reason), ev.decision === 'down' ? 'error' : 'success')
    }
  }
  const finish = async () => {
    const open = workout.slots.filter(isOpen)
    if (!(await confirmSheet(t('workout.finish'), { body: open.length ? t('workout.finishEarly') : t('workout.finishConfirm'), okLabel: t('workout.finish') }))) return
    setFinishing(true)
    try { const session = await finishWorkout(workout); nav(`/workout/summary/${session.id}`, { replace: true }); setTimeout(() => clear(), 0) }
    catch { toast(t('toast.error'), 'error'); setFinishing(false) }
  }
  const discard = async () => {
    setSheet(null)
    if (!(await confirmSheet(t('workout.discard'), { body: t('workout.discardConfirm'), okLabel: t('workout.discard'), danger: true }))) return
    await sessionsRepo.delete(workout.id).catch(() => {})
    clear(); nav('/workout', { replace: true })
  }
  const doneCount = useMemo(() => workout.slots.filter((s) => setsForSlot(workout, s.slotId).filter((x) => !x.isWarmup).length >= s.prescription.sets).length, [workout])
  const lastTime = slot.prescription.lastTime
  const formLabel = { good: t('workout.formGood'), ok: t('workout.formOk'), poor: t('workout.formPoor') }[form]
  const painLabel = [t('workout.painNone'), t('workout.painMild'), t('workout.painBad')][pain]
  const detailsDefault = rir === slot.prescription.targetRir && form === 'good' && pain === 0 && !warm

  return (
    <main className="page page-notab flex flex-col min-h-dvh">
      <header className="flex items-center gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className="t-h3 truncate">{l(PROGRAM[workout.dayKind].name)}</div>
          <div className="t-cap"><N>{fmtDuration(now - workout.startedAt)}</N> · <N>{doneCount}/{workout.slots.length}</N></div>
        </div>
        <Button variant="soft" size="sm" onClick={finish} disabled={finishing}><Flag size={16} />{t('workout.finish')}</Button>
        <IconButton label={t('workout.actions')} onClick={() => setSheet('menu')} className="-me-2"><MoreVertical /></IconButton>
      </header>

      <div ref={chipsRef} className="flex gap-1.5 overflow-x-auto no-scrollbar pb-3">
        {workout.slots.map((s, i) => {
          const cnt = setsForSlot(workout, s.slotId).filter((x) => !x.isWarmup).length
          const done = cnt >= s.prescription.sets, skipped = workout.skips.some((k) => k.slotId === s.slotId), cur = s.slotId === slot.slotId
          return (
            <button key={s.slotId} aria-pressed={cur} onClick={() => setCurrent(s.slotId)}
              className={`h-9 min-w-9 px-3 rounded-full text-[13px] font-semibold inline-flex items-center gap-1.5 whitespace-nowrap transition ${cur ? 'bg-accent text-accent-ink' : done ? 'bg-accent/15 text-accent' : skipped ? 'bg-surface-2 text-faint line-through' : 'bg-surface-2 text-muted'}`}>
              <span className="num">{i + 1}</span>{done && !cur ? <Check size={14} /> : cur ? <span className="num">{EXERCISES[s.exerciseId]?.termEn}</span> : null}
            </button>
          )
        })}
      </div>

      <section className="card p-4 mb-3">
        <button className="flex gap-3 w-full text-start" onClick={() => setSheet('form')}>
          <ExerciseThumb id={ex.id} className="w-[76px] h-[76px] rounded-2xl shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="t-h2 leading-tight">{n(ex.name)}</div>
            {n(ex.name) !== ex.termEn && <div className="t-cap num">{ex.termEn}</div>}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <Pill tone="accent">{t('workout.setOf', { x: Math.min(setIndex + 1, total), y: total })}</Pill>
              <Pill><N>{slot.prescription.repRange[0]}–{slot.prescription.repRange[1]} {isTimed ? t('common.sec') : 'reps'}</N></Pill>
            </div>
          </div>
        </button>
        <div className="mt-3 flex items-center justify-between gap-3 t-small">
          <span className="text-muted">{t('workout.lastTime')}</span>
          {lastTime ? <N className="font-medium">{lastTime.map((s) => `${isBw ? '' : fmtKg(s.weight) + '×'}${s.reps}`).join(' · ')}</N> : <span className="text-faint">—</span>}
        </div>
        {ex.guide.kyphosisCue && (
          <button onClick={() => setCueOpen(!cueOpen)} aria-expanded={cueOpen} className="mt-3 w-full min-h-11 text-start t-small rounded-xl bg-info/10 text-info px-3 py-2 leading-snug"><span className={cueOpen ? '' : 'line-clamp-1'}>{l(ex.guide.kyphosisCue)}</span></button>
        )}
        {logged.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {logged.map((s) => (
              <li key={s.id}><button onClick={() => setEditing(s)} className={`h-10 min-w-11 px-3 rounded-xl text-sm font-semibold num ${s.isWarmup ? 'bg-surface-2 text-muted' : 'bg-accent/15 text-accent'}`}>{s.isWarmup ? 'W ' : ''}{isBw ? '' : fmtKg(s.weight) + '×'}{s.reps}{isTimed ? 's' : ''}</button></li>
            ))}
          </ul>
        )}
        <button onClick={() => setSheet('form')} className="mt-3 h-9 inline-flex items-center gap-1.5 text-sm font-medium text-accent active:opacity-70"><BookOpen size={16} />{t('workout.formCheck')}</button>
      </section>

      <div className="flex-1 min-h-2" />
      <RestTimerBar />

      {isSkipped ? (
        <div className="card p-4 mb-2 text-center"><div className="text-muted mb-3">{t('workout.skipped')}</div><div className="flex gap-2"><Button variant="secondary" className="flex-1" onClick={() => unskip(slot.slotId)}>{t('common.undo')}</Button><Button className="flex-1" onClick={goNext}>{t('workout.nextExercise')}<ChevronRight size={18} className="rtl:flip" /></Button></div></div>
      ) : slotDone ? (
        <div className="card p-4 mb-2">
          <div className="text-center font-semibold text-accent mb-3 inline-flex items-center gap-1.5 w-full justify-center"><Check size={18} />{t('workout.allSetsDone')}</div>
          <div className="flex gap-2"><Button variant="secondary" onClick={() => addExtraSet(slot.slotId)}>{t('workout.addSet')}</Button><Button size="lg" className="flex-1" onClick={goNext}>{t('workout.nextExercise')}<ChevronRight size={20} className="rtl:flip" /></Button></div>
        </div>
      ) : (
        <div className="card p-4 mb-2">
          <div className="flex gap-3 mb-3">
            {!isBw && <Stepper label={t('workout.weight')} unit={t('common.kg')} value={weight} onChange={setWeight} step={ex.weightStep} big />}
            <Stepper label={isTimed ? t('workout.seconds') : t('workout.reps')} value={reps} onChange={setReps} step={isTimed ? 5 : 1} max={isTimed ? 600 : 100} big />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setSheet('details')} className={`h-14 px-3.5 rounded-[14px] text-[13px] font-semibold flex items-center gap-1.5 whitespace-nowrap ${detailsDefault ? 'bg-surface-2 text-muted' : 'bg-warn/15 text-warn'}`}>
              <SlidersHorizontal size={16} /><N>RIR {rir}</N>{!detailsDefault && <span>· {warm ? t('workout.warmup') : `${formLabel} · ${painLabel}`}</span>}
            </button>
            <Button size="lg" className="flex-1" onClick={log}><Check size={22} />{warm ? t('workout.warmupSet') : t('workout.logSet')}</Button>
          </div>
        </div>
      )}

      <FormSheet slot={sheet === 'form' ? slot : null} onClose={() => setSheet(null)} />
      <WarmupSheet slot={sheet === 'warmup' ? slot : null} weight={weight} onClose={() => setSheet(null)} />
      <SwapSheet slot={sheet === 'swap' ? slot : null} onClose={() => setSheet(null)} />
      <SkipSheet slot={sheet === 'skip' ? slot : null} onClose={() => setSheet(null)} onSkipped={goNext} />
      <BottomSheet open={sheet === 'details'} onClose={() => setSheet(null)} title={t('workout.details')}>
        <div className="text-xs text-muted mb-1">RIR</div>
        <RirPicker value={rir} onChange={setRir} />
        <div className="text-xs text-muted mb-1">{t('workout.form')}</div>
        <Segmented className="mb-3" value={form} onChange={setForm} options={[{ value: 'good', label: t('workout.formGood') }, { value: 'ok', label: t('workout.formOk'), tone: 'warn' }, { value: 'poor', label: t('workout.formPoor'), tone: 'bad' }]} />
        <div className="text-xs text-muted mb-1">{t('workout.pain')}</div>
        <Segmented className="mb-3" value={String(pain) as '0'} onChange={(v) => setPain(Number(v) as PainLevel)} options={[{ value: '0', label: t('workout.painNone') }, { value: '1', label: t('workout.painMild'), tone: 'warn' }, { value: '2', label: t('workout.painBad'), tone: 'bad' }]} />
        {!isBw && !isTimed && <Chip active={warm} onClick={() => setWarm(!warm)} className="mb-4">{t('workout.warmupSet')}</Chip>}
        <Button className="w-full" onClick={() => setSheet(null)}>{t('common.done')}</Button>
      </BottomSheet>
      <BottomSheet open={sheet === 'menu'} onClose={() => setSheet(null)} title={n(ex.name)}>
        <div className="flex flex-col gap-2">
          <Button variant="secondary" onClick={() => setSheet('warmup')}><Calculator size={18} />{t('workout.warmupCalc')}</Button>
          <Button variant="secondary" onClick={() => setSheet('swap')}><Repeat size={18} />{t('workout.swap')}</Button>
          <Button variant="secondary" onClick={() => setSheet('skip')}><SkipForward size={18} className="rtl:flip" />{t('workout.skipExercise')}</Button>
          <Button variant="danger" onClick={discard}><Trash2 size={18} />{t('workout.discard')}</Button>
        </div>
      </BottomSheet>
      <EditSetSheet set={editing} onClose={() => setEditing(null)} onSave={(p) => { if (editing) updateSet(editing.id, p); setEditing(null) }} onDelete={() => { if (editing) deleteSet(editing.id); setEditing(null) }} isBw={isBw} isTimed={isTimed} step={ex.weightStep} />
    </main>
  )
}

function RirPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1 mb-3" dir="ltr" role="radiogroup" aria-label="RIR">
      {[0, 1, 2, 3, 4, 5].map((v) => <button key={v} type="button" role="radio" aria-checked={value === v} onClick={() => onChange(v)} className={`flex-1 min-h-11 rounded-lg text-sm font-semibold ${value === v ? 'bg-accent text-black' : 'bg-surface-2 text-muted'}`}>{v}</button>)}
    </div>
  )
}

export function EditSetSheet({ set, onClose, onSave, onDelete, isBw, isTimed, step }: { set: LoggedSet | null; onClose: () => void; onSave: (p: Partial<LoggedSet>) => void; onDelete: () => void; isBw: boolean; isTimed: boolean; step: number }) {
  const { t } = useT()
  const [w, setW] = useState(0); const [r, setR] = useState(0); const [rir, setRir] = useState(0)
  useEffect(() => { if (set) { setW(set.weight); setR(set.reps); setRir(set.rir) } }, [set])
  return (
    <BottomSheet open={!!set} onClose={onClose} title={t('workout.editSet')}>
      <div className="flex gap-2 mb-3">
        {!isBw && <Stepper label={t('workout.weight')} unit={t('common.kg')} value={w} onChange={setW} step={step} />}
        <Stepper label={isTimed ? t('workout.seconds') : t('workout.reps')} value={r} onChange={setR} step={isTimed ? 5 : 1} max={isTimed ? 600 : 100} />
      </div>
      <div className="text-xs text-muted mb-1">RIR</div>
      <RirPicker value={rir} onChange={setRir} />
      <div className="flex gap-2">
        <Button variant="danger" onClick={onDelete}><Trash2 size={18} />{t('workout.deleteSet')}</Button>
        <Button className="flex-1" onClick={() => onSave({ weight: w, reps: r, rir })}>{t('common.save')}</Button>
      </div>
    </BottomSheet>
  )
}
