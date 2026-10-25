import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Trophy } from 'lucide-react'
import { useT } from '@/i18n'
import { Button, Card, PageHeader, Toggle } from '@/components/ui'
import { sessionsRepo } from '@/db/repo/sessions'
import { EXERCISES } from '@/data/exercises'
import { PROGRAM } from '@/data/program'
import type { WorkoutSession } from '@/types'
import { fmtDuration } from '@/utils/date'
import { fmtKg } from '@/utils/num'
import { useUi } from '@/stores/uiStore'

export default function SummaryPage() {
  const { id = '' } = useParams()
  const nav = useNavigate()
  const { t, l } = useT()
  const toast = useUi((s) => s.toast)
  const [s, setS] = useState<WorkoutSession | null>(null)
  useEffect(() => { sessionsRepo.get(id).then((x) => setS(x ?? null)) }, [id])
  if (!s) return <main className="page" />
  const save = async (patch: Partial<WorkoutSession>) => { const next = { ...s, ...patch }; setS(next); await sessionsRepo.put(next) }
  const Stat = ({ label, value }: { label: string; value: string }) => <div className="card p-3 text-center"><div className="text-xs text-muted">{label}</div><div className="text-xl font-bold tabular-nums">{value}</div></div>
  return (
    <main className="page">
      <PageHeader title={t('workout.summary')} sub={l(PROGRAM[s.dayKind].name)} />
      <div className="grid grid-cols-3 gap-2 mb-3">
        <Stat label={t('workout.duration')} value={fmtDuration((s.endedAt ?? s.startedAt) - s.startedAt)} />
        <Stat label={t('workout.volume')} value={`${s.volumeKg} ${t('common.kg')}`} />
        <Stat label={t('workout.setsDone')} value={String(s.setCount)} />
      </div>
      <Card className="mb-3">
        <div className="font-semibold mb-2 flex items-center gap-2"><Trophy size={18} className="text-warn" />{t('workout.prs')}</div>
        {s.prs.length ? <ul className="space-y-1 text-sm">{s.prs.map((p, i) => <li key={i}>{l(EXERCISES[p.exerciseId]?.name)}: <b>{fmtKg(p.weight)}×{p.reps}</b> <span className="text-muted">({p.kind === 'weight' ? t('analytics.bestWeight') : `e1RM ${fmtKg(p.est1rm)}`})</span></li>)}</ul> : <p className="text-sm text-muted">{t('workout.noPrs')}</p>}
      </Card>
      <Card className="mb-3">
        <div className="flex items-center justify-between"><span>{t('workout.postureCheck')}</span><Toggle checked={s.postureDone} onChange={(v) => save({ postureDone: v })} label={t('workout.postureCheck')} /></div>
      </Card>
      <Card className="mb-4">
        <textarea value={s.notes} onChange={(e) => setS({ ...s, notes: e.target.value })} onBlur={() => save({ notes: s.notes })} placeholder={t('workout.notesPh')} rows={3} className="w-full bg-transparent outline-none resize-none" />
      </Card>
      <Button className="w-full h-14 text-lg" onClick={() => { toast(t('workout.saved'), 'success'); nav('/', { replace: true }) }}>{t('common.done')}</Button>
    </main>
  )
}
