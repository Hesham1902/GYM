import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Star, Play, ExternalLink, ChevronRight } from 'lucide-react'
import { EXERCISES } from '@/data/exercises'
import { useT } from '@/i18n'
import { useSettings } from '@/stores/settingsStore'
import { useUi } from '@/stores/uiStore'
import { Card, Empty, IconButton, PageHeader, Chip } from '@/components/ui'
import { ExerciseFigure } from '@/components/ExerciseFigure'
import { exerciseSetsRepo } from '@/db/repo/exerciseSets'
import type { ExerciseSetRow, L10n } from '@/types'
import { est1rm } from '@/engine/oneRm'
import { fmtDate } from '@/utils/date'
import { fmtKg } from '@/utils/num'

export function GuideBody({ exerciseId, compact }: { exerciseId: string; compact?: boolean }) {
  const { t, l } = useT()
  const ex = EXERCISES[exerciseId]
  if (!ex) return null
  const g = ex.guide
  const List = ({ items }: { items: L10n[] }) => <ol className="list-decimal ps-5 space-y-1.5 text-[15px] leading-relaxed">{items.map((x, i) => <li key={i}>{l(x)}</li>)}</ol>
  const H = ({ children }: { children: React.ReactNode }) => <h3 className="font-bold text-accent mt-5 mb-2">{children}</h3>
  return (
    <div>
      {g.kyphosisCue && <div className="rounded-2xl bg-info/10 border border-info/30 p-3 text-[15px] mb-2"><div className="text-xs text-info font-semibold mb-1">{t('library.kyphosis')}</div>{l(g.kyphosisCue)}</div>}
      <H>{t('library.setup')}</H><List items={g.setup} />
      <H>{t('library.execution')}</H><List items={g.execution} />
      <H>{t('library.breathing')}</H><p className="text-[15px] leading-relaxed">{l(g.breathing)}</p>
      <H>{t('library.greenFlags')}</H><ul className="ps-5 list-disc space-y-1.5 text-[15px]">{g.greenFlags.map((x, i) => <li key={i}>{l(x)}</li>)}</ul>
      <H>{t('library.mistakes')}</H>
      <div className="space-y-2">{g.mistakes.map((m, i) => (
        <div key={i} className="rounded-xl bg-bg p-3 text-[15px]"><div className="text-danger"><span className="text-xs font-semibold">{t('library.avoid')}: </span>{l(m.avoid)}</div><div className="text-accent mt-1"><span className="text-xs font-semibold">{t('library.fix')}: </span>{l(m.fix)}</div></div>
      ))}</div>
      {!compact && <>
        <H>{t('library.targets')}</H>
        <div className="flex flex-wrap gap-2"><span className="text-xs text-muted self-center">{t('library.primary')}:</span>{g.targetPrimary.map((m) => <Chip key={m} active>{t(`muscles.${m}`)}</Chip>)}</div>
        {g.targetSecondary.length > 0 && <div className="flex flex-wrap gap-2 mt-2"><span className="text-xs text-muted self-center">{t('library.secondary')}:</span>{g.targetSecondary.map((m) => <Chip key={m}>{t(`muscles.${m}`)}</Chip>)}</div>}
        <H>{t('library.safety')}</H><ul className="ps-5 list-disc space-y-1.5 text-[15px]">{g.safety.map((x, i) => <li key={i}>{l(x)}</li>)}</ul>
        <H>{t('library.startingWeight')}</H><p className="text-[15px] leading-relaxed">{l(g.startingWeight)}</p>
      </>}
    </div>
  )
}

export default function ExercisePage() {
  const { exerciseId = '' } = useParams()
  const nav = useNavigate()
  const { t, l, lang } = useT()
  const ex = EXERCISES[exerciseId]
  const favorites = useSettings((s) => s.favorites)
  const toggleFav = useSettings((s) => s.toggleFavorite)
  const toast = useUi((s) => s.toast)
  const online = useUi((s) => s.online)
  const [frame, setFrame] = useState<'start' | 'end' | null>(null)
  const [history, setHistory] = useState<ExerciseSetRow[]>([])
  useEffect(() => { exerciseSetsRepo.forExercise(exerciseId).then(setHistory) }, [exerciseId])
  if (!ex) return <main className="page"><PageHeader title={t('common.unknown')} back /><Empty text={t('library.noResults')} /></main>
  const fav = favorites.includes(ex.id)
  const bySession = new Map<string, ExerciseSetRow[]>()
  for (const r of history) bySession.set(r.sessionId, [...(bySession.get(r.sessionId) ?? []), r])
  const sessions = [...bySession.values()].sort((a, b) => b[0].loggedAt - a[0].loggedAt).slice(0, 8)

  return (
    <main className="page">
      <PageHeader title={l(ex.name)} back sub={`${t(`muscles.${ex.muscles[0]}`)} · ${t(`equipment.${ex.equipment}`)} · ${t(`patterns.${ex.pattern}`)} · ${t(`difficulty.${ex.difficulty}`)}`}
        right={<IconButton label={fav ? t('library.unfavorite') : t('library.favorite')} onClick={() => toast(toggleFav(ex.id) ? t('toast.favAdded') : t('toast.favRemoved'), 'success')}><Star className={fav ? 'text-warn fill-warn' : ''} /></IconButton>} />
      <Card className="p-2 mb-3">
        <div className="aspect-square max-h-72 mx-auto"><ExerciseFigure poseId={ex.poseId} frame={frame ?? undefined} className="w-full h-full" /></div>
        <div className="flex gap-2 justify-center mt-1">
          <Chip active={frame === 'start'} onClick={() => setFrame('start')}>{t('figure.start')}</Chip>
          <Chip active={frame === null} onClick={() => setFrame(null)}><Play size={14} className="inline -mt-0.5 me-1" />{t('library.animate')}</Chip>
          <Chip active={frame === 'end'} onClick={() => setFrame('end')}>{t('figure.end')}</Chip>
        </div>
      </Card>
      <a href={ex.videoUrl} target="_blank" rel="noreferrer" className={`tap card flex items-center justify-between px-4 mb-3 ${online ? '' : 'opacity-60'}`}>
        <span className="font-semibold">{t('library.video')}</span>
        <span className="text-xs text-muted flex items-center gap-1">{online ? '' : t('library.videoOffline')}<ExternalLink size={18} /></span>
      </a>
      <Card className="mb-3"><GuideBody exerciseId={ex.id} /></Card>

      <h2 className="text-lg font-bold mb-2">{t('library.alternatives')}</h2>
      <div className="flex flex-col gap-2 mb-4">
        {ex.alternatives.map((a) => {
          const alt = EXERCISES[a.exerciseId]; if (!alt) return null
          return (
            <button key={a.exerciseId} onClick={() => nav(`/library/${alt.id}`)} className="card p-3 text-start active:bg-surface-2">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-bg shrink-0"><ExerciseFigure poseId={alt.poseId} animate={false} frame="end" className="w-full h-full" /></div>
                <div className="flex-1 min-w-0"><div className="font-semibold">{l(alt.name)}</div><div className="text-xs text-muted">{t(`equipment.${alt.equipment}`)}</div></div>
                <ChevronRight className="text-muted rtl:flip" />
              </div>
              <div className="mt-2 text-sm"><span className="text-muted">{t('library.differs')}: </span>{l(a.differs)}</div>
              <div className="mt-1 text-sm"><span className="text-muted">{t('library.chooseWhen')}: </span>{l(a.chooseWhen)}</div>
            </button>
          )
        })}
      </div>

      <h2 className="text-lg font-bold mb-2">{t('library.history')}</h2>
      {!sessions.length ? <Empty text={t('library.noHistory')} /> : (
        <div className="flex flex-col gap-2">
          {sessions.map((rows) => {
            const best = rows.reduce((b, r) => (est1rm(r.weight, r.reps) > est1rm(b.weight, b.reps) ? r : b))
            return (
              <Card key={rows[0].sessionId} className="p-3 flex items-center justify-between" onClick={() => nav(`/history/${rows[0].sessionId}`)}>
                <div><div className="text-sm text-muted">{fmtDate(new Date(rows[0].loggedAt).toISOString().slice(0, 10), lang)}</div>
                  <div className="text-sm">{rows.sort((a, b) => a.setIndex - b.setIndex).map((r) => `${fmtKg(r.weight)}×${r.reps}`).join('  ·  ')}</div></div>
                <div className="text-end text-xs text-muted">e1RM<div className="text-base text-text font-bold">{fmtKg(est1rm(best.weight, best.reps))}</div></div>
              </Card>
            )
          })}
        </div>
      )}
    </main>
  )
}
