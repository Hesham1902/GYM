import { useEffect, useRef } from 'react'
import { SkipForward } from 'lucide-react'
import { useT } from '@/i18n'
import { useActive } from '@/stores/activeWorkoutStore'
import { useSettings } from '@/stores/settingsStore'
import { useNow } from '@/hooks/useNow'
import { isOver, progress, remainingMs } from '@/timers/restTimer'
import { beep, resumeAudio } from '@/timers/cues'
import { fmtClock } from '@/utils/date'

export function RestTimerBar() {
  const { t } = useT()
  const timer = useActive((s) => s.workout?.restTimer ?? null)
  const adjust = useActive((s) => s.adjustRest)
  const skip = useActive((s) => s.skipRest)
  const markNotified = useActive((s) => s.markNotified)
  const sound = useSettings((s) => s.sound), vibration = useSettings((s) => s.vibration)
  const now = useNow(250, !!timer)
  const firedFor = useRef<number | null>(null)
  useEffect(() => { const f = () => resumeAudio(); document.addEventListener('visibilitychange', f); return () => document.removeEventListener('visibilitychange', f) }, [])
  useEffect(() => {
    if (!timer) return
    if (isOver(timer, now) && !timer.notified && firedFor.current !== timer.endsAt) {
      firedFor.current = timer.endsAt
      beep('done', sound, vibration); markNotified()
    }
  }, [timer, now, sound, vibration, markNotified])
  // auto-dismiss 20 s after the rest ended
  useEffect(() => { if (timer && timer.notified && now - timer.endsAt > 20000) skip() }, [timer, now, skip])
  if (!timer) return null
  const rem = remainingMs(timer, now), over = isOver(timer, now)
  return (
    <div className={`rounded-[20px] p-3 mb-3 ${over ? 'bg-accent/15' : 'bg-surface'}`} role="timer" aria-live="polite" dir="ltr">
      <div className="flex items-center gap-2">
        <button className="h-11 px-3 rounded-[12px] bg-surface-2 text-sm font-semibold num" onClick={() => adjust(-15)}>{t('workout.minus15')}</button>
        <div className="flex-1 text-center" dir="auto">
          <div className={`text-3xl font-bold tabular-nums ${over ? 'text-accent' : ''}`}>{over ? t('workout.restOver') : fmtClock(rem)}</div>
          {over && <div className="text-xs text-muted">{t('workout.restOverAgo', { sec: Math.round((now - timer.endsAt) / 1000) })}</div>}
        </div>
        <button className="h-11 px-3 rounded-[12px] bg-surface-2 text-sm font-semibold num" onClick={() => adjust(15)}>{t('workout.plus15')}</button>
        <button aria-label={t('workout.skipRest')} className="h-11 w-11 rounded-[12px] bg-surface-2" onClick={skip}><SkipForward size={20} className="mx-auto" /></button>
      </div>
      <div className="h-1.5 rounded-full bg-surface-2 mt-2 overflow-hidden"><div className="h-full bg-accent transition-[width] duration-200" style={{ width: `${progress(timer, now) * 100}%` }} /></div>
    </div>
  )
}
