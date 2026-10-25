import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, RotateCcw } from 'lucide-react'
import { useT } from '@/i18n'
import { useSettings } from '@/stores/settingsStore'
import { useActive } from '@/stores/activeWorkoutStore'
import { Button, Card, N, PageHeader, Pill } from '@/components/ui'
import { PROGRAM, TRAINING_DAYS } from '@/data/program'
import { EXERCISES } from '@/data/exercises'
import { buildWorkout, resumeFromSession, orderedSlots } from '@/engine/workoutBuilder'
import { todayKind } from '@/engine/schedule'
import { programWeek, rirForWeek, setsForWeek } from '@/engine/week'
import { sessionsRepo } from '@/db/repo/sessions'
import type { DayKind, WorkoutSession } from '@/types'
import { unlockAudio } from '@/timers/cues'
import { fmtDate } from '@/utils/date'
import { exName, exTerm } from '@/utils/names'
import LiveWorkout from './LiveWorkout'

export default function WorkoutPage({ live }: { live?: boolean }) {
  const nav = useNavigate()
  const { t, l, lang } = useT()
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
  const ordered = [today, ...TRAINING_DAYS.filter((k) => k !== today)].filter((k) => TRAINING_DAYS.includes(k))

  return (
    <main className="page">
      <PageHeader title={t('nav.workout')} sub={t('workout.pickDaySub')} />
      {unfinished.map((s) => (
        <Card key={s.id} className="mb-3 card-outline flex items-center gap-3">
          <div className="flex-1 min-w-0"><div className="font-semibold">{t('history.unfinished')} · {l(PROGRAM[s.dayKind].name)}</div><div className="t-cap">{fmtDate(s.dateKey, lang)} · <N>{s.setCount}</N> {t('common.sets')}</div></div>
          <Button variant="soft" size="sm" onClick={() => resume(s)}><RotateCcw size={16} />{t('common.resume')}</Button>
        </Card>
      ))}
      {ordered.map((kind) => {
        const day = PROGRAM[kind]
        const isToday = kind === today
        const slots = orderedSlots(kind, settings)
        return (
          <section key={kind} className={`card p-4 mb-3 ${isToday ? 'card-outline' : ''}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><h2 className="t-h2">{l(day.name)}</h2>{isToday && <Pill tone="accent">{t('dashboard.today')}</Pill>}</div>
                <div className="t-cap mt-0.5">{t('workout.exercisesN', { n: slots.length })} · <N>{setsForWeek(week, false, true)} {t('common.sets')} · RIR {rirForWeek(week)}</N></div>
              </div>
              <Button variant={isToday ? 'primary' : 'secondary'} size="md" onClick={() => begin(kind)} disabled={busy}><Play size={18} />{t('common.start')}</Button>
            </div>
            <ol className="divide-y divide-border">
              {slots.map((s, i) => {
                const ex = EXERCISES[settings.permanentSwaps[s.slotId] ?? s.exerciseId]
                return (
                  <li key={s.slotId} className="grid grid-cols-[1.25rem_1fr_auto] items-center gap-3 min-h-11 py-1.5">
                    <span className="t-cap num text-center">{i + 1}</span>
                    <span className="min-w-0"><span className="t-small leading-snug block truncate">{exName(ex, lang)}</span>{exTerm(ex, lang) && <span className="t-cap block truncate num">{exTerm(ex, lang)}</span>}</span>
                    <N className="t-cap">{s.repRange[0]}–{s.repRange[1]}</N>
                  </li>
                )
              })}
            </ol>
          </section>
        )
      })}
    </main>
  )
}
