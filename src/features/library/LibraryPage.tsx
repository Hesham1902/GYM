import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Star, SlidersHorizontal, Settings as SettingsIcon } from 'lucide-react'
import { EXERCISE_LIST } from '@/data/exercises'
import { useT } from '@/i18n'
import { useSettings } from '@/stores/settingsStore'
import type { Difficulty, Equipment, Exercise, MuscleGroup, Pattern } from '@/types'
import { Chip, Empty, IconButton, PageHeader } from '@/components/ui'
import { ExerciseFigure } from '@/components/ExerciseFigure'
import { BottomSheet } from '@/components/BottomSheet'

const MUSCLES: MuscleGroup[] = ['chest', 'upperBack', 'lats', 'shoulders', 'rearDelts', 'biceps', 'triceps', 'quads', 'hamstrings', 'glutes', 'calves', 'core', 'neck']
const EQUIP: Equipment[] = ['machine', 'cable', 'dumbbell', 'barbell', 'smith', 'band', 'bodyweight', 'foamRoller']
const PATTERNS: Pattern[] = ['horizontalPush', 'verticalPush', 'horizontalPull', 'verticalPull', 'squat', 'hinge', 'isolation', 'core', 'mobility']

export function ExerciseRow({ ex, onClick, fav }: { ex: Exercise; onClick: () => void; fav?: boolean }) {
  const { l, t } = useT()
  return (
    <button onClick={onClick} className="w-full card p-3 flex items-center gap-3 text-start active:bg-surface-2">
      <div className="w-16 h-16 rounded-xl bg-bg shrink-0 overflow-hidden"><ExerciseFigure poseId={ex.poseId} animate={false} frame="end" className="w-full h-full" /></div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold leading-tight line-clamp-2">{l(ex.name)}</div>
        <div className="text-xs text-muted truncate">{t(`muscles.${ex.muscles[0]}`)} · {t(`equipment.${ex.equipment}`)} · {t(`difficulty.${ex.difficulty}`)}</div>
      </div>
      {fav && <Star size={18} className="text-warn fill-warn shrink-0" />}
    </button>
  )
}

export default function LibraryPage() {
  const { t, l } = useT()
  const nav = useNavigate()
  const favorites = useSettings((s) => s.favorites)
  const [q, setQ] = useState('')
  const [muscle, setMuscle] = useState<MuscleGroup | null>(null)
  const [equip, setEquip] = useState<Equipment | null>(null)
  const [pattern, setPattern] = useState<Pattern | null>(null)
  const [diff, setDiff] = useState<Difficulty | null>(null)
  const [posture, setPosture] = useState(false)
  const [favOnly, setFavOnly] = useState(false)
  const [filters, setFilters] = useState(false)

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return EXERCISE_LIST.filter((e) => {
      if (needle && !(e.name.en.toLowerCase().includes(needle) || e.name.ar.includes(needle) || e.termEn.toLowerCase().includes(needle) || e.id.includes(needle))) return false
      if (muscle && !e.muscles.includes(muscle)) return false
      if (equip && e.equipment !== equip) return false
      if (pattern && e.pattern !== pattern) return false
      if (diff && e.difficulty !== diff) return false
      if (posture && !e.postureFocus) return false
      if (favOnly && !favorites.includes(e.id)) return false
      return true
    })
  }, [q, muscle, equip, pattern, diff, posture, favOnly, favorites])
  const activeCount = [muscle, equip, pattern, diff].filter(Boolean).length + (posture ? 1 : 0)

  return (
    <main className="page">
      <PageHeader title={t('library.title')} right={<IconButton label={t('nav.settings')} onClick={() => nav('/settings')}><SettingsIcon /></IconButton>} />
      <div className="relative mb-3">
        <Search size={20} className="absolute top-1/2 -translate-y-1/2 start-3 text-muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('library.search')} className="w-full h-12 rounded-2xl bg-surface border border-border ps-11 pe-3 outline-none focus:border-accent" />
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-3">
        <Chip active={favOnly} onClick={() => setFavOnly(!favOnly)}><Star size={14} className="inline -mt-0.5 me-1" />{t('library.favorites')}</Chip>
        <Chip active={posture} onClick={() => setPosture(!posture)}>{t('library.postureOnly')}</Chip>
        <Chip active={activeCount > 0} onClick={() => setFilters(true)}><SlidersHorizontal size={14} className="inline -mt-0.5 me-1" />{t('library.filters')}{activeCount ? ` (${activeCount})` : ''}</Chip>
      </div>
      <div className="flex flex-col gap-2">
        {list.map((ex) => <ExerciseRow key={ex.id} ex={ex} fav={favorites.includes(ex.id)} onClick={() => nav(`/library/${ex.id}`)} />)}
        {!list.length && <Empty text={t('library.noResults')} />}
      </div>
      <BottomSheet open={filters} onClose={() => setFilters(false)} title={t('library.filters')}>
        <Section label={t('library.muscle')}>{MUSCLES.map((m) => <Chip key={m} active={muscle === m} onClick={() => setMuscle(muscle === m ? null : m)}>{t(`muscles.${m}`)}</Chip>)}</Section>
        <Section label={t('library.equipment')}>{EQUIP.map((m) => <Chip key={m} active={equip === m} onClick={() => setEquip(equip === m ? null : m)}>{t(`equipment.${m}`)}</Chip>)}</Section>
        <Section label={t('library.pattern')}>{PATTERNS.map((m) => <Chip key={m} active={pattern === m} onClick={() => setPattern(pattern === m ? null : m)}>{t(`patterns.${m}`)}</Chip>)}</Section>
        <Section label={t('library.difficulty')}>{([1, 2, 3] as Difficulty[]).map((m) => <Chip key={m} active={diff === m} onClick={() => setDiff(diff === m ? null : m)}>{t(`difficulty.${m}`)}</Chip>)}</Section>
        <div className="flex gap-2 mt-4">
          <button className="tap flex-1 rounded-2xl bg-accent text-black font-semibold" onClick={() => setFilters(false)}>{t('common.done')} ({list.length})</button>
          <button className="tap px-4 rounded-2xl bg-surface-2 border border-border" onClick={() => { setMuscle(null); setEquip(null); setPattern(null); setDiff(null); setPosture(false) }}>{t('common.clear')}</button>
        </div>
        <span className="sr-only">{l({ en: '', ar: '' })}</span>
      </BottomSheet>
    </main>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="text-sm text-muted mb-2">{label}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}
