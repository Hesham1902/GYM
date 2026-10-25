import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useT } from '@/i18n'
import { Card, Chip, Empty, PageHeader } from '@/components/ui'
import { LineSeries, Bars } from '@/components/charts'
import { db } from '@/db/db'
import { EXERCISES, EXERCISE_LIST } from '@/data/exercises'
import { est1rm } from '@/engine/oneRm'
import { volumeByMuscle, totalVolume } from '@/engine/volume'
import { addDays, dateKey, startOfWeekKey } from '@/utils/date'
import { fmtKg } from '@/utils/num'
import type { MuscleGroup } from '@/types'

export default function AnalyticsPage() {
  const { t, l } = useT()
  const sessions = useLiveQuery(() => db.sessions.where('status').equals('done').sortBy('startedAt'), []) ?? []
  const rows = useLiveQuery(() => db.exerciseSets.orderBy('loggedAt').toArray(), []) ?? []
  const logged = useMemo(() => [...new Set(rows.map((r) => r.exerciseId))].filter((id) => EXERCISES[id]), [rows])
  const [exId, setExId] = useState<string | null>(null)
  const pick = exId && logged.includes(exId) ? exId : logged[0] ?? null

  const trend = useMemo(() => {
    if (!pick) return []
    const by = new Map<string, { top: number; e1: number }>()
    for (const r of rows.filter((x) => x.exerciseId === pick)) {
      const k = dateKey(r.loggedAt); const cur = by.get(k) ?? { top: 0, e1: 0 }
      by.set(k, { top: Math.max(cur.top, r.weight), e1: Math.max(cur.e1, est1rm(r.weight, r.reps)) })
    }
    return [...by.entries()].map(([k, v]) => ({ x: k.slice(5), top: v.top, e1rm: v.e1 }))
  }, [rows, pick])

  const thisWeekStart = startOfWeekKey(dateKey()), lastWeekStart = addDays(thisWeekStart, -7)
  const weekSets = (from: string, to: string) => sessions.filter((s) => s.dateKey >= from && s.dateKey < to).flatMap((s) => s.sets)
  const thisWeek = weekSets(thisWeekStart, addDays(thisWeekStart, 7)), lastWeek = weekSets(lastWeekStart, thisWeekStart)
  const vol = volumeByMuscle(thisWeek, EXERCISES), volPrev = volumeByMuscle(lastWeek, EXERCISES)
  const muscles = [...new Set([...Object.keys(vol), ...Object.keys(volPrev)])] as MuscleGroup[]
  const volData = muscles.map((m) => ({ x: t(`muscles.${m}`), sets: vol[m]?.sets ?? 0, kg: vol[m]?.kg ?? 0 }))
  const wow = [
    { label: t('analytics.sessions'), a: sessions.filter((s) => s.dateKey >= thisWeekStart).length, b: sessions.filter((s) => s.dateKey >= lastWeekStart && s.dateKey < thisWeekStart).length },
    { label: t('analytics.volumeKg'), a: totalVolume(thisWeek), b: totalVolume(lastWeek) },
    { label: t('analytics.setsCount'), a: thisWeek.filter((s) => !s.isWarmup).length, b: lastWeek.filter((s) => !s.isWarmup).length },
  ]
  const prs = useMemo(() => {
    const best = new Map<string, { w: number; r: number; e1: number; date: string }>()
    for (const r of rows) { const e1 = est1rm(r.weight, r.reps); const cur = best.get(r.exerciseId); if (!cur || e1 > cur.e1) best.set(r.exerciseId, { w: r.weight, r: r.reps, e1, date: dateKey(r.loggedAt) }) }
    return [...best.entries()].filter(([id]) => EXERCISES[id]?.loadType === 'weight').sort((a, b) => b[1].e1 - a[1].e1)
  }, [rows])

  if (!sessions.length) return <main className="page"><PageHeader title={t('analytics.title')} back /><Empty text={t('analytics.noData')} /></main>
  return (
    <main className="page">
      <PageHeader title={t('analytics.title')} back />
      <h2 className="section">{t('analytics.wow')}</h2>
      <Card className="mb-4 p-3">
        <div className="grid grid-cols-3 text-center gap-2">
          {wow.map((w) => <div key={w.label}><div className="text-xs text-muted">{w.label}</div><div className="text-xl font-bold tabular-nums">{w.a}</div><div className={`text-xs ${w.a >= w.b ? 'text-accent' : 'text-warn'}`}>{t('analytics.lastWeek')}: {w.b}</div></div>)}
        </div>
      </Card>

      <h2 className="section">{t('analytics.est1rm')} / {t('analytics.topSet')}</h2>
      <Card className="mb-4 p-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-3 px-3 pb-2">{logged.map((id) => <Chip key={id} active={pick === id} onClick={() => setExId(id)}>{EXERCISES[id].termEn}</Chip>)}</div>
        {trend.length ? <LineSeries data={trend} keys={[{ k: 'e1rm', color: 'var(--color-accent)', name: t('analytics.est1rm') }, { k: 'top', color: 'var(--color-info)', dashed: true, name: t('analytics.topSet') }]} /> : <Empty text={t('analytics.noData')} />}
        <p className="text-[11px] text-muted mt-1">{t('analytics.epleyNote')}</p>
      </Card>

      <h2 className="section">{t('analytics.weeklyVolume')}</h2>
      <Card className="mb-4 p-3">{volData.length ? <Bars data={volData} k="sets" name={t('analytics.setsCount')} /> : <Empty text={t('analytics.noData')} />}</Card>

      <h2 className="section">{t('analytics.prs')}</h2>
      <Card className="mb-4 p-0 divide-y divide-border">
        {prs.slice(0, 20).map(([id, p]) => <div key={id} className="flex items-center justify-between px-3 py-2 text-sm"><span>{l(EXERCISES[id].name)}</span><span className="tabular-nums"><b>{fmtKg(p.w)}×{p.r}</b> <span className="text-muted">e1RM {fmtKg(p.e1)} · {p.date.slice(5)}</span></span></div>)}
        {!prs.length && <Empty text={t('analytics.noData')} />}
      </Card>
      <span className="hidden">{EXERCISE_LIST.length}</span>
    </main>
  )
}
