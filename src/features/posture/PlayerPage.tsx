import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Pause, Play, SkipForward, X, Check } from 'lucide-react'
import { useT } from '@/i18n'
import { useSettings } from '@/stores/settingsStore'
import { useUi } from '@/stores/uiStore'
import { Button } from '@/components/ui'
import { FigureView } from '@/figure/FigureView'
import { getFigure } from '@/data/figures'
import { ExerciseThumb } from '@/components/ExerciseMedia'
import { Ring } from '@/components/Ring'
import { Mixed } from '@/components/Mixed'
import { ROUTINES } from '@/data/routines'
import { EXERCISES } from '@/data/exercises'
import { postureRepo } from '@/db/repo/posture'
import { beep, unlockAudio } from '@/timers/cues'
import { useNow } from '@/hooks/useNow'
import { dateKey } from '@/utils/date'
import { uid } from '@/utils/id'

interface Phase { stepIdx: number; round: number; side: 'L' | 'R' | null; seconds: number; kind: 'work' | 'ready' }

function expand(routineId: string): Phase[] {
  const r = ROUTINES[routineId]; if (!r) return []
  const out: Phase[] = []
  r.steps.forEach((s, stepIdx) => {
    for (let round = 1; round <= s.rounds; round++) {
      const sides: ('L' | 'R' | null)[] = s.sides ? ['L', 'R'] : [null]
      for (const side of sides) {
        out.push({ stepIdx, round, side, seconds: 5, kind: 'ready' })
        const secs = s.mode === 'hold' ? (s.seconds ?? 30) : s.mode === 'breaths' ? (s.reps ?? 5) * 6 : (s.reps ?? 10) * 3
        out.push({ stepIdx, round, side, seconds: secs, kind: 'work' })
      }
    }
  })
  return out
}

export default function PlayerPage() {
  const { routineId = '' } = useParams()
  const nav = useNavigate()
  const { t, l, n } = useT()
  const sound = useSettings((s) => s.sound), vibration = useSettings((s) => s.vibration)
  const toast = useUi((s) => s.toast)
  const routine = ROUTINES[routineId]
  const [phases] = useState(() => expand(routineId))
  const [i, setI] = useState(0)
  const [endsAt, setEndsAt] = useState<number | null>(null)
  const [pausedRemain, setPausedRemain] = useState<number | null>(null)
  const [done, setDone] = useState(false)
  const now = useNow(200, endsAt !== null)
  const fired = useRef<number | null>(null)
  const ph = phases[i]
  const step = routine?.steps[ph?.stepIdx ?? 0]
  const ex = step ? EXERCISES[step.exerciseId] : null
  const remain = endsAt !== null ? Math.max(0, endsAt - now) : pausedRemain ?? (ph ? ph.seconds * 1000 : 0)

  const advance = useCallback(() => {
    if (i + 1 >= phases.length) { setEndsAt(null); setDone(true); beep('done', sound, vibration); return }
    const next = phases[i + 1]
    setI(i + 1); setEndsAt(Date.now() + next.seconds * 1000); setPausedRemain(null)
    if (next.kind === 'work') beep(next.side === 'R' ? 'switch' : 'tick', sound, vibration)
  }, [i, phases, sound, vibration])

  useEffect(() => {
    if (endsAt !== null && remain <= 0 && fired.current !== endsAt) { fired.current = endsAt; advance() }
  }, [remain, endsAt, advance])

  const start = () => { unlockAudio(); setEndsAt(Date.now() + (pausedRemain ?? ph.seconds * 1000)); setPausedRemain(null) }
  const pause = () => { setPausedRemain(remain); setEndsAt(null) }
  const finish = async () => {
    const today = await postureRepo.byDate(dateKey())
    await postureRepo.put({ id: today?.id ?? uid(), dateKey: dateKey(), stiffness: today?.stiffness ?? 5, routineDone: true, photoId: today?.photoId, notes: today?.notes, at: Date.now() })
    toast(t('posture.routineDone'), 'success'); nav('/posture', { replace: true })
  }
  if (!routine || !ph || !ex || !step) return <main className="page" />
  const totalSteps = routine.steps.length
  const progressV = ph.kind === 'ready' ? 0 : 1 - remain / (ph.seconds * 1000)

  if (done) return (
    <main className="page page-notab flex flex-col items-center justify-center text-center min-h-dvh">
      <Check size={64} className="text-accent mb-4" />
      <h1 className="text-2xl font-bold mb-2">{t('posture.routineDone')}</h1>
      <p className="text-muted mb-6">{l(routine.name)}</p>
      <Button className="w-full h-14 text-lg" onClick={finish}>{t('posture.markDone')}</Button>
    </main>
  )
  return (
    <main className="page page-notab flex flex-col min-h-dvh">
      <header className="flex items-center justify-between mb-2">
        <div><div className="font-bold">{l(routine.name)}</div><div className="text-xs text-muted">{t('posture.step', { x: ph.stepIdx + 1, y: totalSteps })} · {t('posture.round', { x: ph.round, y: step.rounds })}</div></div>
        <button aria-label={t('common.close')} className="tap rounded-full text-muted" onClick={() => nav('/posture')}><X /></button>
      </header>
      <div className="flex gap-1 mb-3">{routine.steps.map((_, k) => <div key={k} className={`h-1.5 flex-1 rounded-full ${k < ph.stepIdx ? 'bg-accent' : k === ph.stepIdx ? 'bg-accent/50' : 'bg-surface-2'}`} />)}</div>
      <div className="card p-3 flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-full max-w-xs aspect-square rounded-2xl overflow-hidden">{getFigure(ex.id) ? <FigureView figure={getFigure(ex.id)!} className="w-full h-full" /> : <ExerciseThumb id={ex.id} className="w-full h-full" />}</div>
        <h2 className="text-2xl font-bold mt-2">{n(ex.name)}</h2>
        {n(ex.name) !== ex.termEn && <div className="text-sm text-muted"><bdi dir="ltr">{ex.termEn}</bdi></div>}
        {ph.side && <div className={`mt-1 px-3 py-1 rounded-full text-sm font-semibold ${ph.side === 'L' ? 'bg-info/20 text-info' : 'bg-warn/20 text-warn'}`}>{ph.side === 'L' ? t('posture.left') : t('posture.right')}</div>}
        <p className="text-muted mt-2 text-[15px] leading-relaxed">{ph.kind === 'ready' ? t('posture.getReady') : <Mixed>{l(step.cue)}</Mixed>}</p>
        <div className="text-sm text-muted mt-1"><Mixed>{`${step.mode === 'hold' ? `${t('posture.hold')} ${step.seconds} ${t('common.sec')}` : `${step.reps} ${step.mode === 'breaths' ? t('posture.breathe') : t('common.reps')}`}${step.sides ? ` · ${t('workout.perSide')}` : ''}`}</Mixed></div>
      </div>
      <div className="flex items-center justify-center gap-6 my-4">
        <Ring value={progressV} size={120} stroke={10} color={ph.kind === 'ready' ? 'var(--color-warn)' : 'var(--color-accent)'}><span className="text-3xl tabular-nums">{Math.ceil(remain / 1000)}</span></Ring>
      </div>
      <div className="flex gap-2">
        {endsAt === null ? <Button className="flex-1 h-14 text-lg" onClick={start}><Play size={22} />{pausedRemain !== null ? t('posture.resumeP') : t('common.start')}</Button> : <Button variant="secondary" className="flex-1 h-14 text-lg" onClick={pause}><Pause size={22} />{t('posture.pause')}</Button>}
        <Button variant="secondary" className="h-14 px-5" onClick={advance}><SkipForward size={22} className="rtl:flip" />{t('common.next')}</Button>
      </div>
    </main>
  )
}
