import { useState } from 'react'
import { useT } from '@/i18n'
import { useSettings } from '@/stores/settingsStore'
import { useActive } from '@/stores/activeWorkoutStore'
import { useUi } from '@/stores/uiStore'
import { BottomSheet } from '@/components/BottomSheet'
import { Button, Chip } from '@/components/ui'
import { ExerciseFigure } from '@/components/ExerciseFigure'
import { GuideBody } from '@/features/library/ExercisePage'
import { EXERCISES } from '@/data/exercises'
import { warmupSets } from '@/engine/warmup'
import { buildSlot } from '@/engine/workoutBuilder'
import { PROGRAM } from '@/data/program'
import type { ActiveSlot, SwapReason } from '@/types'
import { fmtKg } from '@/utils/num'

export function FormSheet({ slot, onClose }: { slot: ActiveSlot | null; onClose: () => void }) {
  const { l } = useT()
  const ex = slot ? EXERCISES[slot.exerciseId] : null
  return (
    <BottomSheet open={!!slot} onClose={onClose} title={ex ? l(ex.name) : ''} tall>
      {ex && <>
        <div className="h-44 mx-auto"><ExerciseFigure poseId={ex.poseId} className="h-full w-full" /></div>
        <GuideBody exerciseId={ex.id} />
      </>}
    </BottomSheet>
  )
}

export function WarmupSheet({ slot, weight, onClose }: { slot: ActiveSlot | null; weight: number; onClose: () => void }) {
  const { t } = useT()
  const ex = slot ? EXERCISES[slot.exerciseId] : null
  const rows = ex ? warmupSets(weight, ex.weightStep) : []
  return (
    <BottomSheet open={!!slot} onClose={onClose} title={t('workout.warmupTitle')}>
      <p className="text-sm text-muted mb-3">{t('workout.warmupHint', { w: fmtKg(weight) })}</p>
      {weight < 20 || !rows.length ? <p className="text-[15px]">{t('workout.warmupNone')}</p> : (
        <ol className="space-y-2">{rows.map((r, i) => <li key={i} className="card p-3 flex justify-between text-[15px]"><span>{t('workout.warmupRow', { pct: r.pct, reps: r.reps, w: fmtKg(r.weight) })}</span></li>)}</ol>
      )}
      <Button className="w-full mt-4" onClick={onClose}>{t('common.ok')}</Button>
    </BottomSheet>
  )
}

export function SwapSheet({ slot, onClose }: { slot: ActiveSlot | null; onClose: () => void }) {
  const { t, l } = useT()
  const settings = useSettings()
  const workout = useActive((s) => s.workout)
  const swap = useActive((s) => s.swap)
  const toast = useUi((s) => s.toast)
  const [reason, setReason] = useState<SwapReason>('busy')
  const [permanent, setPermanent] = useState(false)
  const [busy, setBusy] = useState(false)
  const ex = slot ? EXERCISES[slot.exerciseId] : null
  const originalId = workout && slot ? PROGRAM[workout.dayKind].slots.find((s) => s.slotId === slot.slotId)?.exerciseId : undefined
  const options = ex ? [...ex.alternatives, ...(originalId && originalId !== ex.id ? [{ exerciseId: originalId, differs: { en: 'Back to the programmed exercise.', ar: 'رجوع للتمرين الأصلي في البرنامج.' }, chooseWhen: { en: 'Machine is free again.', ar: 'الجهاز فضي تاني.' } }] : [])] : []
  const choose = async (toId: string) => {
    if (!slot || !workout || busy) return
    setBusy(true)
    try {
      const alt = EXERCISES[toId]
      const built = await buildSlot(slot.slotId, toId, alt.repRange, false, workout.week)
      swap({ slotId: slot.slotId, from: slot.exerciseId, to: toId, reason, permanent, at: Date.now() }, alt.repRange, built.prescription)
      if (permanent) settings.setPermanentSwap(slot.slotId, toId === originalId ? null : toId)
      toast(t('workout.swapped', { name: l(alt.name) }), 'success'); onClose()
    } finally { setBusy(false) }
  }
  const reasons: { v: SwapReason; k: 'workout.swapBusy' | 'workout.swapMissing' | 'workout.swapDiscomfort' | 'workout.swapOther' }[] = [{ v: 'busy', k: 'workout.swapBusy' }, { v: 'missing', k: 'workout.swapMissing' }, { v: 'discomfort', k: 'workout.swapDiscomfort' }, { v: 'other', k: 'workout.swapOther' }]
  return (
    <BottomSheet open={!!slot} onClose={onClose} title={t('workout.swap')} tall>
      <div className="text-sm text-muted mb-1">{t('workout.swapReason')}</div>
      <div className="flex flex-wrap gap-2 mb-3">{reasons.map((r) => <Chip key={r.v} active={reason === r.v} onClick={() => setReason(r.v)}>{t(r.k)}</Chip>)}</div>
      <div className="flex gap-2 mb-4"><Chip active={!permanent} onClick={() => setPermanent(false)}>{t('workout.swapThisSession')}</Chip><Chip active={permanent} onClick={() => setPermanent(true)}>{t('workout.swapPermanent')}</Chip></div>
      <div className="flex flex-col gap-2">
        {options.map((a) => { const alt = EXERCISES[a.exerciseId]; if (!alt) return null; return (
          <button key={a.exerciseId} disabled={busy} onClick={() => choose(a.exerciseId)} className="card p-3 text-start active:bg-surface-2">
            <div className="flex items-center gap-3"><div className="w-14 h-14 rounded-xl bg-bg shrink-0"><ExerciseFigure poseId={alt.poseId} animate={false} frame="end" className="w-full h-full" /></div>
              <div className="flex-1"><div className="font-semibold">{l(alt.name)}</div><div className="text-xs text-muted">{t(`equipment.${alt.equipment}`)} · {alt.repRange[0]}–{alt.repRange[1]} reps</div></div></div>
            <div className="mt-2 text-sm"><span className="text-muted">{t('library.differs')}: </span>{l(a.differs)}</div>
            <div className="mt-1 text-sm"><span className="text-muted">{t('library.chooseWhen')}: </span>{l(a.chooseWhen)}</div>
          </button>
        ) })}
      </div>
    </BottomSheet>
  )
}

export function SkipSheet({ slot, onClose, onSkipped }: { slot: ActiveSlot | null; onClose: () => void; onSkipped: () => void }) {
  const { t, l } = useT()
  const skip = useActive((s) => s.skip)
  const [reason, setReason] = useState('')
  const ex = slot ? EXERCISES[slot.exerciseId] : null
  return (
    <BottomSheet open={!!slot} onClose={onClose} title={t('workout.skipExercise')}>
      <p className="mb-3">{t('workout.skipConfirm')} <b>{ex ? l(ex.name) : ''}</b></p>
      <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder={t('workout.skipReason')} className="w-full h-12 rounded-2xl bg-surface-2 border border-border px-3 mb-4 outline-none" />
      <div className="flex gap-2">
        <Button variant="secondary" className="flex-1" onClick={onClose}>{t('common.cancel')}</Button>
        <Button variant="danger" className="flex-1" onClick={() => { if (slot) skip({ slotId: slot.slotId, exerciseId: slot.exerciseId, reason, at: Date.now() }); onSkipped(); onClose() }}>{t('common.skip')}</Button>
      </div>
    </BottomSheet>
  )
}
