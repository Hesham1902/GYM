import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { BarChart3, Scale, Camera, ChevronRight } from 'lucide-react'
import { useT } from '@/i18n'
import { Calendar, DAY_COLORS } from '@/components/Calendar'
import { Card, Chip, Empty, PageHeader } from '@/components/ui'
import { Mixed } from '@/components/Mixed'
import { db } from '@/db/db'
import { PROGRAM } from '@/data/program'
import type { DayKind } from '@/types'
import { fmtDate, fmtDuration } from '@/utils/date'

export default function ProgressPage() {
  const nav = useNavigate()
  const { t, l, lang } = useT()
  const [month, setMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1) })
  const [selected, setSelected] = useState<string | null>(null)
  const [filter, setFilter] = useState<DayKind | null>(null)
  const sessions = useLiveQuery(() => db.sessions.orderBy('startedAt').reverse().toArray(), []) ?? []
  const checkins = useLiveQuery(() => db.postureCheckins.toArray(), []) ?? []
  useEffect(() => { setSelected(null) }, [month])

  const marks = useMemo(() => {
    const m: Record<string, { color: string; unfinished?: boolean }[]> = {}
    for (const s of sessions) (m[s.dateKey] ??= []).push({ color: DAY_COLORS[s.dayKind], unfinished: s.status === 'unfinished' })
    for (const c of checkins) if (c.routineDone) (m[c.dateKey] ??= []).push({ color: DAY_COLORS.posture })
    return m
  }, [sessions, checkins])
  const mk = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`
  const list = sessions.filter((s) => (selected ? s.dateKey === selected : s.dateKey.startsWith(mk)) && (!filter || s.dayKind === filter))
  const monthCount = sessions.filter((s) => s.dateKey.startsWith(mk) && s.status === 'done').length

  return (
    <main className="page">
      <PageHeader title={t('nav.progress')} />
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[{ to: '/analytics', I: BarChart3, label: t('analytics.title') }, { to: '/body', I: Scale, label: t('body.title') }, { to: '/photos', I: Camera, label: t('photos.title') }].map(({ to, I, label }) => (
          <button key={to} onClick={() => nav(to)} className="card p-3 flex flex-col items-center gap-1 text-sm active:bg-surface-2 min-h-20"><I className="text-accent" />{label}</button>
        ))}
      </div>
      <Calendar month={month} onMonth={setMonth} marks={marks} selected={selected} onSelect={setSelected} />
      <div className="text-xs text-muted mt-2 mb-3">{t('history.workoutsThisMonth', { n: monthCount })}</div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-3">
        <Chip active={!filter} onClick={() => setFilter(null)}>{t('common.all')}</Chip>
        {(['upperA', 'lowerA', 'upperB', 'lowerB'] as DayKind[]).map((k) => <Chip key={k} active={filter === k} onClick={() => setFilter(filter === k ? null : k)}>{t(`days.${k}`)}</Chip>)}
      </div>
      {!list.length ? <Empty text={t('history.noSessions')} /> : (
        <div className="flex flex-col gap-2">
          {list.map((s) => (
            <Card key={s.id} className="p-3 flex items-center gap-3" onClick={() => nav(`/history/${s.id}`)}>
              <span className="w-2.5 h-10 rounded-full shrink-0" style={{ background: DAY_COLORS[s.dayKind] }} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{l(PROGRAM[s.dayKind].name)} {s.status === 'unfinished' && <span className="text-xs text-warn">· {t('history.unfinished')}</span>}</div>
                <div className="text-xs text-muted"><Mixed>{`${fmtDate(s.dateKey, lang)} · ${s.setCount} ${t(s.setCount === 1 ? 'common.set' : 'common.sets')} · ${s.volumeKg} ${t('common.kg')}${s.endedAt ? ` · ${fmtDuration(s.endedAt - s.startedAt)}` : ''}${s.prs.length ? ` · ${s.prs.length} PR` : ''}`}</Mixed></div>
              </div>
              <ChevronRight className="text-muted rtl:flip" />
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
