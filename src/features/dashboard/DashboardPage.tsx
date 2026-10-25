import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { Play, Settings as SettingsIcon, PersonStanding, Scale, ChevronRight, Check, RotateCcw } from 'lucide-react'
import { useT } from '@/i18n'
import { useSettings } from '@/stores/settingsStore'
import { useActive } from '@/stores/activeWorkoutStore'
import { Button, Card, IconButton, PageHeader } from '@/components/ui'
import { Ring } from '@/components/Ring'
import { Mixed } from '@/components/Mixed'
import { db } from '@/db/db'
import { movingAverage } from '@/db/repo/body'
import { streak } from '@/db/repo/posture'
import { PROGRAM, isTrainingDay } from '@/data/program'
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
  const day = PROGRAM[kind]
  const training = isTrainingDay(kind)

  return (
    <main className="page">
      <PageHeader title={t('app.name')} sub={<Mixed>{`${fmtDate(today, lang)} · ${t('common.week')} ${week}`}</Mixed>} right={<IconButton label={t('nav.settings')} onClick={() => nav('/settings')}><SettingsIcon /></IconButton>} />

      <Card className="mb-3 border-accent/60">
        <div className="text-xs text-muted mb-1">{active ? t('dashboard.inProgress') : resumable ? t('dashboard.unfinished', { date: fmtDate(resumable.dateKey, lang) }) : t('dashboard.todayWorkout')}</div>
        <div className="text-2xl font-bold mb-1">{active ? l(PROGRAM[active.dayKind].name) : resumable ? l(PROGRAM[resumable.dayKind].name) : l(day.name)}</div>
        {training && !active && !resumable && <div className="text-sm text-muted mb-3"><Mixed>{`${t('dashboard.exercises', { n: day.slots.length })} · ${setsForWeek(week, false, true)} ${t(setsForWeek(week, false, true) === 1 ? 'common.set' : 'common.sets')} · RIR ${rirForWeek(week)}`}</Mixed></div>}
        {!training && !active && !resumable && <div className="text-sm text-muted mb-3"><Mixed>{t('dashboard.walk')}</Mixed></div>}
        {active || resumable ? (
          <Button className="w-full h-14 text-lg" onClick={begin} disabled={busy}><RotateCcw size={20} />{t('dashboard.resumeWorkout')}</Button>
        ) : training ? (
          todayDone ? <div className="flex items-center gap-2 text-accent font-semibold"><Check />{t('workout.completed')}<button className="ms-auto text-sm text-muted underline" onClick={() => nav('/workout')}>{t('dashboard.quickStart')}</button></div>
            : <div className="flex gap-2"><Button className="flex-1 h-14 text-lg" onClick={begin} disabled={busy}><Play size={20} />{t('dashboard.startWorkout')}</Button><Button variant="secondary" className="h-14" onClick={() => nav('/workout')}>{t('dashboard.quickStart')}</Button></div>
        ) : (
          <div className="flex gap-2"><Button className="flex-1 h-14 text-lg" onClick={() => nav('/posture/play/daily')}><PersonStanding size={20} />{t('dashboard.postureFix')}</Button><Button variant="secondary" className="h-14" onClick={() => nav('/workout')}>{t('dashboard.quickStart')}</Button></div>
        )}
      </Card>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <Card className="p-3 flex items-center gap-3" onClick={() => nav('/posture')}>
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${postureToday ? 'bg-accent/20 text-accent' : 'bg-warn/20 text-warn'}`}>{postureToday ? <Check /> : <PersonStanding />}</div>
          <div className="min-w-0"><div className="text-sm font-semibold truncate">{t('dashboard.postureCard')}</div><div className="text-xs text-muted truncate">{postureToday ? t('dashboard.postureDone') : t('dashboard.postureTodo')}{pStreak ? ` · 🔥${pStreak}` : ''}</div></div>
        </Card>
        <Card className="p-3 flex items-center gap-3" onClick={() => nav('/progress')}>
          <Ring value={target ? doneThisWeek / target : 0} size={44} stroke={6}>{doneThisWeek}</Ring>
          <div className="min-w-0"><div className="text-sm font-semibold">{t('dashboard.weekRing')}</div><div className="text-xs text-muted">{t('dashboard.workoutsOf', { done: doneThisWeek, total: target })}</div></div>
        </Card>
        {lastAvg && <Card className="p-3 flex items-center gap-3 col-span-2" onClick={() => nav('/body')}>
          <div className="w-11 h-11 rounded-xl bg-info/20 text-info flex items-center justify-center"><Scale /></div>
          <div className="min-w-0"><div className="text-sm font-semibold">{t('dashboard.weightTrend')}</div>
            <div className="text-xs text-muted"><bdi dir="ltr">{lastAvg.avg} {t('common.kg')}</bdi>{weekAgoAvg && lastAvg.avg !== null && weekAgoAvg.avg !== null && <span className={lastAvg.avg <= weekAgoAvg.avg ? 'text-accent' : 'text-warn'}> (<bdi dir="ltr">{lastAvg.avg - weekAgoAvg.avg > 0 ? '+' : ''}{(lastAvg.avg - weekAgoAvg.avg).toFixed(1)}</bdi>)</span>}</div></div>
        </Card>}
      </div>

      <Card className="mb-3 p-3">
        <div className="text-xs text-muted">{t('dashboard.nextMilestone')}</div>
        <div className="text-sm font-semibold mt-0.5"><Mixed>{week <= 2 ? t('dashboard.milestoneWeek', { week: week + 1, sets: setsForWeek(week + 1, false, true), rir: rirForWeek(week + 1) }) : t('dashboard.milestoneStandard', { week })}</Mixed></div>
      </Card>

      {lastSession && <LastSession s={lastSession} />}

    </main>
  )
}

function LastSession({ s }: { s: WorkoutSession }) {
  const nav = useNavigate()
  const { t, l, lang } = useT()
  return (
    <Card className="p-3 flex items-center gap-3" onClick={() => nav(`/history/${s.id}`)}>
      <div className="flex-1 min-w-0"><div className="text-xs text-muted">{t('dashboard.lastSession')}</div><div className="text-sm font-semibold">{l(PROGRAM[s.dayKind].name)} · {fmtDate(s.dateKey, lang)}</div><div className="text-xs text-muted"><Mixed>{`${s.setCount} ${t(s.setCount === 1 ? 'common.set' : 'common.sets')} · ${s.volumeKg} ${t('common.kg')}${s.prs.length ? ` · ${s.prs.length} PR` : ''}`}</Mixed></div></div>
      <ChevronRight className="text-muted rtl:flip" />
    </Card>
  )
}
