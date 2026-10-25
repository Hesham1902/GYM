import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { Play, Settings as SettingsIcon, PersonStanding, Scale, ChevronRight, Check, RotateCcw } from 'lucide-react'
import { useT } from '@/i18n'
import { useSettings } from '@/stores/settingsStore'
import { useActive } from '@/stores/activeWorkoutStore'
import { Button, Card, IconButton, N, Pill } from '@/components/ui'
import { Ring } from '@/components/Ring'
import { db } from '@/db/db'
import { movingAverage } from '@/db/repo/body'
import { streak } from '@/db/repo/posture'
import { PROGRAM, isTrainingDay } from '@/data/program'
import { ROUTINES } from '@/data/routines'
import { todayKind, trainingDaysPerWeek } from '@/engine/schedule'
import { programWeek, rirForWeek, setsForWeek } from '@/engine/week'
import { buildWorkout, resumeFromSession } from '@/engine/workoutBuilder'
import { unlockAudio } from '@/timers/cues'
import { dateKey, fmtDate, startOfWeekKey, addDays } from '@/utils/date'
import type { WorkoutSession } from '@/types'

export default function DashboardPage() {
  const nav = useNavigate()
  const { t, l, lang } = useT()
  const settings = useSettings()
  const active = useActive((s) => s.workout)
  const start = useActive((s) => s.start)
  const [busy, setBusy] = useState(false)
  const today = dateKey()
  const kind = todayKind(settings)
  const week = programWeek(settings.programStartDate, settings.rampWeekOverride)
  const weekStart = startOfWeekKey(today), weekEnd = addDays(weekStart, 7)
  const sessions = useLiveQuery(() => db.sessions.where('dateKey').between(weekStart, weekEnd, true, false).toArray(), [weekStart]) ?? []
  const lastSession = useLiveQuery(() => db.sessions.where('status').equals('done').reverse().sortBy('startedAt').then((x) => x[0] ?? null), [])
  const unfinished = useLiveQuery(() => db.sessions.where('status').equals('unfinished').toArray(), []) ?? []
  const checkins = useLiveQuery(() => db.postureCheckins.toArray(), []) ?? []
  const body = useLiveQuery(() => db.bodyEntries.orderBy('dateKey').toArray(), []) ?? []

  const doneThisWeek = sessions.filter((s) => s.status === 'done').length
  const target = trainingDaysPerWeek(settings)
  const todayDone = sessions.some((s) => s.status === 'done' && s.dateKey === today && s.dayKind === kind)
  const postureToday = checkins.find((c) => c.dateKey === today)?.routineDone ?? false
  const pStreak = streak(checkins)
  const ma = useMemo(() => movingAverage(body), [body])
  const lastAvg = [...ma].reverse().find((x) => x.avg !== null)
  const weekAgoAvg = [...ma].reverse().find((x) => x.avg !== null && x.dateKey <= addDays(today, -7))
  const resumable = active ? null : unfinished[0] ?? null
  const day = PROGRAM[kind]
  const training = isTrainingDay(kind)
  const routine = ROUTINES[day.postureRoutineIds[0] ?? 'daily']

  const begin = async () => {
    if (busy) return
    setBusy(true); unlockAudio()
    try {
      if (active) { nav('/workout/live'); return }
      if (resumable) { start(await resumeFromSession(resumable, settings)); nav('/workout/live'); return }
      if (!settings.programStartDate) settings.set({ programStartDate: today })
      start(await buildWorkout(kind, settings)); nav('/workout/live')
    } finally { setBusy(false) }
  }

  const heroKind = active ? PROGRAM[active.dayKind] : resumable ? PROGRAM[resumable.dayKind] : day
  const heroLabel = active ? t('dashboard.inProgress') : resumable ? t('dashboard.unfinished', { date: fmtDate(resumable.dateKey, lang) }) : t('dashboard.todayWorkout')
  const heroTitle = training || active || resumable ? l(heroKind.name) : kind === 'recovery' ? t('dashboard.heroRecovery') : t('dashboard.heroRest')

  return (
    <main className="page">
      <header className="flex items-start justify-between pt-2 mb-4">
        <div>
          <div className="t-cap">{fmtDate(today, lang)} · {t('dashboard.weekLine', { week })}</div>
          <h1 className="t-title">{t('app.name')}</h1>
        </div>
        <IconButton label={t('nav.settings')} onClick={() => nav('/settings')} className="-me-2"><SettingsIcon /></IconButton>
      </header>

      <section className="card p-5 mb-3">
        <div className="t-cap mb-1">{heroLabel}</div>
        <h2 className="text-[26px] font-bold leading-tight mb-3">{heroTitle}</h2>
        {training && !active && !resumable ? (
          <div className="flex flex-wrap gap-1.5 mb-4">
            <Pill>{t('workout.exercisesN', { n: day.slots.length })}</Pill>
            <Pill><N>{setsForWeek(week, false, true)} {t('common.sets')}</N></Pill>
            <Pill><N>RIR {rirForWeek(week)}</N></Pill>
          </div>
        ) : !training && !active && !resumable ? (
          <p className="text-muted mb-4">{t('dashboard.walk')}</p>
        ) : null}
        {active || resumable ? (
          <Button size="lg" className="w-full" onClick={begin} disabled={busy}><RotateCcw size={20} />{t('dashboard.resumeWorkout')}</Button>
        ) : training ? (
          todayDone ? (
            <div className="flex items-center gap-2 h-14 px-4 rounded-[14px] bg-accent/12 text-accent font-semibold"><Check size={20} />{t('dashboard.done')}</div>
          ) : (
            <Button size="lg" className="w-full" onClick={begin} disabled={busy}><Play size={20} />{t('dashboard.startWorkout')}</Button>
          )
        ) : (
          <Button size="lg" className="w-full" onClick={() => nav(`/posture/play/${routine.id}`)}><PersonStanding size={20} />{t('dashboard.doPosture', { n: routine.minutes })}</Button>
        )}
        {!active && !resumable && (
          <button onClick={() => nav('/workout')} className="mt-3 h-10 text-sm font-medium text-muted inline-flex items-center gap-1 active:opacity-70">{t('dashboard.otherDay')}<ChevronRight size={16} className="rtl:flip" /></button>
        )}
      </section>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <Card onClick={() => nav('/posture')} className="!p-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${postureToday ? 'bg-accent/15 text-accent' : 'bg-warn/15 text-warn'}`}>{postureToday ? <Check size={20} /> : <PersonStanding size={20} />}</div>
          <div className="font-semibold leading-tight">{t('dashboard.postureCard')}</div>
          <div className="t-cap mt-0.5">{postureToday ? t('dashboard.postureDone') : t('dashboard.postureTodo')}{pStreak > 0 && <> · <N>{pStreak}</N> 🔥</>}</div>
        </Card>
        <Card onClick={() => nav('/progress')} className="!p-4">
          <div className="mb-3"><Ring value={target ? doneThisWeek / target : 0} size={40} stroke={5}><N className="text-[13px]">{doneThisWeek}</N></Ring></div>
          <div className="font-semibold leading-tight">{t('dashboard.weekRing')}</div>
          <div className="t-cap mt-0.5">{t('dashboard.workoutsOf', { done: doneThisWeek, total: target })}</div>
        </Card>
        {lastAvg && (
          <Card onClick={() => nav('/body')} className="!p-4 col-span-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-info/15 text-info flex items-center justify-center shrink-0"><Scale size={20} /></div>
            <div className="flex-1 min-w-0"><div className="font-semibold leading-tight">{t('dashboard.weightTrend')}</div>
              <div className="t-cap"><N>{lastAvg.avg} {t('common.kg')}</N>{weekAgoAvg && lastAvg.avg !== null && weekAgoAvg.avg !== null && <span className={lastAvg.avg <= weekAgoAvg.avg ? 'text-accent' : 'text-warn'}> · <N>{lastAvg.avg - weekAgoAvg.avg > 0 ? '+' : ''}{(lastAvg.avg - weekAgoAvg.avg).toFixed(1)}</N></span>}</div></div>
            <ChevronRight size={18} className="rtl:flip text-faint" />
          </Card>
        )}
      </div>

      <Card className="mb-3 !p-4">
        <div className="t-cap mb-1">{t('dashboard.nextWeekTitle')}</div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-semibold">{t('dashboard.weekLine', { week: week + 1 })}</span>
          <Pill tone="accent">{t('dashboard.setsPer', { n: setsForWeek(week + 1, false, true) })}</Pill>
          <Pill>{t('dashboard.rirAbout', { rir: rirForWeek(week + 1) })}</Pill>
        </div>
      </Card>

      {lastSession && <LastSession s={lastSession} />}
    </main>
  )
}

function LastSession({ s }: { s: WorkoutSession }) {
  const nav = useNavigate()
  const { t, l, lang } = useT()
  return (
    <Card onClick={() => nav(`/history/${s.id}`)} className="!p-4 flex items-center gap-3">
      <div className="flex-1 min-w-0"><div className="t-cap">{t('dashboard.lastSession')}</div><div className="font-semibold leading-tight">{l(PROGRAM[s.dayKind].name)} · {fmtDate(s.dateKey, lang)}</div>
        <div className="t-cap mt-0.5"><N>{s.setCount}</N> {t('common.sets')} · <N>{s.volumeKg} {t('common.kg')}</N>{s.prs.length ? <> · <N>{s.prs.length}</N> PR</> : ''}</div></div>
      <ChevronRight size={18} className="rtl:flip text-faint" />
    </Card>
  )
}
