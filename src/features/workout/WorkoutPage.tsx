import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, RotateCcw } from 'lucide-react'
import { useT } from '@/i18n'
import { useSettings } from '@/stores/settingsStore'
import { useActive } from '@/stores/activeWorkoutStore'
import { Button, Card, PageHeader } from '@/components/ui'
import { Mixed } from '@/components/Mixed'
import { PROGRAM, TRAINING_DAYS } from '@/data/program'
import { EXERCISES } from '@/data/exercises'
import { buildWorkout, resumeFromSession } from '@/engine/workoutBuilder'
import { todayKind } from '@/engine/schedule'
import { programWeek, rirForWeek, setsForWeek } from '@/engine/week'
import { sessionsRepo } from '@/db/repo/sessions'
import type { DayKind, WorkoutSession } from '@/types'
import { unlockAudio } from '@/timers/cues'
import { fmtDate } from '@/utils/date'
import LiveWorkout from './LiveWorkout'

export default function WorkoutPage({ live }: { live?: boolean }) {
  const nav = useNavigate()
  const { t, l, n, lang } = useT()
  const settings = useSettings()
  const workout = useActive((s) => s.workout)
  const start = useActive((s) => s.start)
  const [unfinished, setUnfinished] = useState<WorkoutSession[]>([])
  const [busy, setBusy] = useState(false)
  useEffect(() => { sessionsRepo.unfinished().then((u) => setUnfinished(u.filter((x) => x.id !== workout?.id))) }, [workout?.id])
  useEffect(() => { if (workout && !live) nav('/workout/live', { replace: true }); if (!workout && live) nav('/workout', { replace: true }) }, [workout, live, nav])
  if (workout && live) return <LiveWorkout />
  if (workout || live) return null

  const today = todayKind(settings)
  const week = programWeek(settings.programStartDate, settings.rampWeekOverride)
  const begin = async (kind: DayKind) => {
    if (busy) return
    setBusy(true); unlockAudio()
    try {
      const w = await buildWorkout(kind, settings)
      if (!settings.programStartDate) settings.set({ programStartDate: new Date().toISOString().slice(0, 10) })
      start(w); nav('/workout/live')
    } finally { setBusy(false) }
  }
  const resume = async (s: WorkoutSession) => {
    setBusy(true); unlockAudio()
    try { start(await resumeFromSession(s, settings)); nav('/workout/live') } finally { setBusy(false) }
  }
  const DayCard = ({ kind, primary }: { kind: DayKind; primary?: boolean }) => {
    const day = PROGRAM[kind]
    return (
      <Card className={`mb-3 ${primary ? 'border-accent' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <div><div className="text-lg font-bold">{l(day.name)}</div><div className="text-xs text-muted"><Mixed>{`${t('common.week')} ${week} · ${setsForWeek(week, false, true)} ${t(setsForWeek(week, false, true) === 1 ? 'common.set' : 'common.sets')} · RIR ${rirForWeek(week)}`}</Mixed></div></div>
          <Button onClick={() => begin(kind)} disabled={busy} className={primary ? 'h-12 px-5' : 'h-11'} variant={primary ? 'primary' : 'secondary'}><Play size={18} />{t('common.start')}</Button>
        </div>
        <ol className="text-sm text-muted space-y-0.5">
          {day.slots.map((s, i) => { const ex = EXERCISES[settings.permanentSwaps[s.slotId] ?? s.exerciseId]; return <li key={s.slotId} className="flex gap-2"><span className="w-4 shrink-0">{i + 1}</span><span className="flex-1 min-w-0">{n(ex?.name)}</span><bdi dir="ltr" className="opacity-70 shrink-0 tabular-nums">{s.repRange[0]}–{s.repRange[1]}</bdi></li> })}
        </ol>
      </Card>
    )
  }
  return (
    <main className="page">
      <PageHeader title={t('workout.title')} />
      {unfinished.map((s) => (
        <Card key={s.id} className="mb-3 border-warn/60 flex items-center justify-between">
          <div><div className="font-semibold">{t('history.unfinished')}: {l(PROGRAM[s.dayKind].name)}</div><div className="text-xs text-muted"><Mixed>{`${fmtDate(s.dateKey, lang)} · ${s.setCount} ${t(s.setCount === 1 ? 'common.set' : 'common.sets')}`}</Mixed></div></div>
          <Button variant="secondary" className="h-11" onClick={() => resume(s)}><RotateCcw size={16} />{t('common.resume')}</Button>
        </Card>
      ))}
      {TRAINING_DAYS.includes(today) && <><h2 className="section">{t('dashboard.todayWorkout')}</h2><DayCard kind={today} primary /></>}
      <h2 className="section">{t('workout.differentDay')}</h2>
      {TRAINING_DAYS.filter((k) => k !== today).map((k) => <DayCard key={k} kind={k} />)}
    </main>
  )
}
