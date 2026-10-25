import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Star, ExternalLink, ChevronRight } from 'lucide-react'
import { EXERCISES } from '@/data/exercises'
import { useT } from '@/i18n'
import { useSettings } from '@/stores/settingsStore'
import { useUi } from '@/stores/uiStore'
import { Card, Empty, IconButton, PageHeader } from '@/components/ui'
import { ExerciseMedia, ExerciseThumb } from '@/components/ExerciseMedia'
import { Mixed } from '@/components/Mixed'
import { GuideBody } from './GuideBody'
import { exerciseSetsRepo } from '@/db/repo/exerciseSets'
import type { ExerciseSetRow } from '@/types'
import { est1rm } from '@/engine/oneRm'
import { fmtDate } from '@/utils/date'
import { fmtKg } from '@/utils/num'

export default function ExercisePage() {
  const { exerciseId = '' } = useParams()
  const nav = useNavigate()
  const { t, l, lang } = useT()
  const ex = EXERCISES[exerciseId]
  const favorites = useSettings((s) => s.favorites)
  const toggleFav = useSettings((s) => s.toggleFavorite)
  const toast = useUi((s) => s.toast)
  const online = useUi((s) => s.online)
  const [history, setHistory] = useState<ExerciseSetRow[]>([])
  useEffect(() => { exerciseSetsRepo.forExercise(exerciseId).then(setHistory) }, [exerciseId])
  if (!ex) return <main className="page"><PageHeader title={t('common.unknown')} back /><Empty text={t('library.noResults')} /></main>
  const fav = favorites.includes(ex.id)
  const bySession = new Map<string, ExerciseSetRow[]>()
  for (const r of history) bySession.set(r.sessionId, [...(bySession.get(r.sessionId) ?? []), r])
  const sessions = [...bySession.values()].sort((a, b) => b[0].loggedAt - a[0].loggedAt).slice(0, 8)

  return (
    <main className="page">
      <PageHeader title={l(ex.name)} back sub={`${t(`muscles.${ex.muscles[0]}`)} · ${t(`equipment.${ex.equipment}`)}`}
        right={<IconButton label={fav ? t('library.unfavorite') : t('library.favorite')} onClick={() => toast(toggleFav(ex.id) ? t('toast.favAdded') : t('toast.favRemoved'), 'success')}><Star className={fav ? 'text-warn fill-warn' : ''} /></IconButton>} />
      <Card className="p-2 mb-3"><ExerciseMedia id={ex.id} /></Card>
      <Card className="mb-3"><GuideBody exerciseId={ex.id} /></Card>
      <a href={ex.videoUrl} target="_blank" rel="noreferrer" className={`tap card flex items-center justify-between px-4 mb-4 ${online ? '' : 'opacity-60'}`}>
        <span className="font-semibold">{t('library.video')}</span>
        <span className="text-xs text-muted flex items-center gap-1">{online ? '' : t('library.videoOffline')}<ExternalLink size={18} /></span>
      </a>

      <h2 className="section">{t('library.alternatives')}</h2>
      <div className="flex flex-col gap-2 mb-4">
        {ex.alternatives.map((a) => {
          const alt = EXERCISES[a.exerciseId]; if (!alt) return null
          return (
            <button key={a.exerciseId} onClick={() => nav(`/library/${alt.id}`)} className="card p-3 text-start active:bg-surface-2">
              <div className="flex items-center gap-3">
                <ExerciseThumb id={alt.id} className="w-14 h-14 rounded-xl shrink-0" />
                <div className="flex-1 min-w-0"><div className="font-semibold leading-tight">{l(alt.name)}</div><div className="text-xs text-muted">{t(`equipment.${alt.equipment}`)}</div></div>
                <ChevronRight className="text-muted rtl:flip" />
              </div>
              <div className="mt-2 text-sm"><span className="text-muted">{t('library.differs')}: </span>{l(a.differs)}</div>
              <div className="mt-1 text-sm"><span className="text-muted">{t('library.chooseWhen')}: </span>{l(a.chooseWhen)}</div>
            </button>
          )
        })}
      </div>

      <h2 className="section">{t('library.history')}</h2>
      {!sessions.length ? <Empty text={t('library.noHistory')} /> : (
        <div className="flex flex-col gap-2">
          {sessions.map((rows) => {
            const best = rows.reduce((b, r) => (est1rm(r.weight, r.reps) > est1rm(b.weight, b.reps) ? r : b))
            return (
              <Card key={rows[0].sessionId} className="p-3 flex items-center justify-between" onClick={() => nav(`/history/${rows[0].sessionId}`)}>
                <div><div className="text-sm text-muted">{fmtDate(new Date(rows[0].loggedAt).toISOString().slice(0, 10), lang)}</div>
                  <Mixed className="text-sm">{rows.sort((a, b) => a.setIndex - b.setIndex).map((r) => `${fmtKg(r.weight)}×${r.reps}`).join('  ·  ')}</Mixed></div>
                <div className="text-end text-xs text-muted">e1RM<div className="text-base text-text font-bold">{fmtKg(est1rm(best.weight, best.reps))}</div></div>
              </Card>
            )
          })}
        </div>
      )}
    </main>
  )
}
