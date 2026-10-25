import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Trash2, RotateCcw } from 'lucide-react'
import { useT } from '@/i18n'
import { confirmSheet } from '@/components/Confirm'
import { useSettings } from '@/stores/settingsStore'
import { useActive } from '@/stores/activeWorkoutStore'
import { useUi } from '@/stores/uiStore'
import { Button, Card, IconButton, PageHeader, Toggle } from '@/components/ui'
import { Mixed } from '@/components/Mixed'
import { sessionsRepo } from '@/db/repo/sessions'
import { EXERCISES } from '@/data/exercises'
import { PROGRAM } from '@/data/program'
import { EditSetSheet } from '@/features/workout/LiveWorkout'
import { resumeFromSession } from '@/engine/workoutBuilder'
import { totalVolume } from '@/engine/volume'
import type { LoggedSet, WorkoutSession } from '@/types'
import { fmtDate, fmtDuration } from '@/utils/date'
import { fmtKg } from '@/utils/num'

export default function SessionPage() {
  const { id = '' } = useParams()
  const nav = useNavigate()
  const { t, l, n, lang } = useT()
  const settings = useSettings()
  const startActive = useActive((s) => s.start)
  const active = useActive((s) => s.workout)
  const toast = useUi((s) => s.toast)
  const [s, setS] = useState<WorkoutSession | null>(null)
  const [editing, setEditing] = useState<LoggedSet | null>(null)
  useEffect(() => { sessionsRepo.get(id).then((x) => setS(x ?? null)) }, [id])
  if (!s) return <main className="page"><PageHeader title={t('history.sessionDetail')} back /></main>
  const save = async (next: WorkoutSession) => {
    const working = next.sets.filter((x) => !x.isWarmup)
    const fixed = { ...next, volumeKg: totalVolume(working), setCount: working.length }
    setS(fixed); await sessionsRepo.saveWithSets(fixed); toast(t('toast.saved'), 'success')
  }
  const del = async () => { if (!(await confirmSheet(t('history.deleteSession'), { body: t('common.confirmDelete'), danger: true, okLabel: t('common.delete') }))) return; await sessionsRepo.delete(s.id); nav(-1) }
  const resume = async () => { if (active && !(await confirmSheet(t('history.resume'), { body: t('workout.discardConfirm'), danger: true }))) return; startActive(await resumeFromSession(s, settings)); nav('/workout/live') }
  const bySlot = new Map<string, LoggedSet[]>()
  for (const x of s.sets) bySlot.set(x.slotId, [...(bySlot.get(x.slotId) ?? []), x])
  const ex = editing ? EXERCISES[editing.exerciseId] : null
  return (
    <main className="page">
      <PageHeader title={l(PROGRAM[s.dayKind].name)} back sub={<Mixed>{`${fmtDate(s.dateKey, lang)} · ${t('common.week')} ${s.week}${s.endedAt ? ` · ${fmtDuration(s.endedAt - s.startedAt)}` : ''}`}</Mixed>}
        right={<IconButton label={t('history.deleteSession')} onClick={del}><Trash2 className="text-danger" /></IconButton>} />
      {s.status === 'unfinished' && <Button className="w-full mb-3" onClick={resume}><RotateCcw size={18} />{t('history.resume')}</Button>}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <Card className="text-center p-3"><div className="text-xs text-muted">{t('history.volume')}</div><div className="text-xl font-bold"><bdi>{s.volumeKg} {t('common.kg')}</bdi></div></Card>
        <Card className="text-center p-3"><div className="text-xs text-muted">{t('history.sets')}</div><div className="text-xl font-bold">{s.setCount}</div></Card>
      </div>
      {[...bySlot.entries()].map(([slotId, sets]) => {
        const e = EXERCISES[sets[0].exerciseId]
        return (
          <Card key={slotId} className="mb-2 p-3">
            <div className="font-semibold mb-1">{n(e?.name)}</div>
            <div className="flex flex-wrap gap-1.5">
              {sets.sort((a, b) => a.loggedAt - b.loggedAt).map((x) => <button key={x.id} onClick={() => setEditing(x)} className={`min-h-11 min-w-11 px-2.5 rounded-lg text-sm tabular-nums ${x.isWarmup ? 'bg-surface-2 text-muted' : 'bg-accent/15 text-accent'}`}><bdi dir="ltr">{x.isWarmup ? 'W ' : ''}{e?.loadType === 'bodyweight' ? '' : fmtKg(x.weight) + '×'}{x.reps}{e?.loadType === 'time' ? 's' : ''} <span className="opacity-60">RIR {x.rir}</span></bdi></button>)}
            </div>
            {s.prs.filter((p) => p.exerciseId === sets[0].exerciseId).length > 0 && <div className="text-xs text-warn mt-1">PR</div>}
          </Card>
        )
      })}
      {s.swaps.length > 0 && <Card className="mb-2 p-3 text-sm"><div className="font-semibold mb-1">{t('history.swaps')}</div>{s.swaps.map((w, i) => <div key={i} className="text-muted">{t('history.swappedFromTo', { from: n(EXERCISES[w.from]?.name), to: n(EXERCISES[w.to]?.name), reason: t(`workout.swap${w.reason[0].toUpperCase() + w.reason.slice(1)}` as 'workout.swapBusy') })}</div>)}</Card>}
      {s.skips.length > 0 && <Card className="mb-2 p-3 text-sm"><div className="font-semibold mb-1">{t('history.skips')}</div>{s.skips.map((k, i) => <div key={i} className="text-muted">{n(EXERCISES[k.exerciseId]?.name)}{k.reason ? ` — ${k.reason}` : ''}</div>)}</Card>}
      <Card className="mb-2 p-3 flex items-center justify-between"><span>{t('workout.postureCheck')}</span><Toggle checked={s.postureDone} onChange={(v) => save({ ...s, postureDone: v })} label={t('workout.postureCheck')} /></Card>
      <Card className="mb-2 p-3"><textarea value={s.notes} onChange={(e) => setS({ ...s, notes: e.target.value })} onBlur={() => save(s)} placeholder={t('history.addNotes')} rows={2} className="w-full bg-transparent outline-none resize-none" /></Card>
      <EditSetSheet set={editing} onClose={() => setEditing(null)} isBw={ex?.loadType === 'bodyweight'} isTimed={ex?.loadType === 'time'} step={ex?.weightStep ?? 2.5}
        onSave={(p) => { if (editing) save({ ...s, sets: s.sets.map((x) => (x.id === editing.id ? { ...x, ...p } : x)) }); setEditing(null) }}
        onDelete={() => { if (editing) save({ ...s, sets: s.sets.filter((x) => x.id !== editing.id) }); setEditing(null) }} />
    </main>
  )
}
