import { useEffect, useRef, useState } from 'react'
import { Play, Image as ImageIcon, PenLine, AlertTriangle } from 'lucide-react'
import { FigureStill, FigureView, type FigureFrame } from '@/figure/FigureView'
import { cycleProgress, TWEEN_MS } from '@/figure/motion'
import { getFigure } from '@/data/figures'
import { hasPhoto } from '@/data/photos'
import { useT } from '@/i18n'

const photoUrl = (id: string, i: 0 | 1) => `${import.meta.env.BASE_URL}photos/${id}-${i}.jpg`

type Mode = 'figure' | 'photo'
const MODE_KEY = 'gym.mediaMode'
const readMode = (): Mode | null => { try { const v = localStorage.getItem(MODE_KEY); return v === 'photo' || v === 'figure' ? v : null } catch { return null } }
const saveMode = (m: Mode) => { try { localStorage.setItem(MODE_KEY, m) } catch { /* private mode */ } }

/** Loads both photos before anything is shown, so a half-loaded or broken image never appears. */
function usePhotos(id: string, enabled: boolean): 'loading' | 'ready' | 'error' {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  useEffect(() => {
    if (!enabled) return
    let live = true
    setState('loading')
    const load = (i: 0 | 1) => new Promise<void>((res, rej) => {
      const img = new Image()
      img.onload = () => (img.decode ? img.decode().catch(() => undefined) : Promise.resolve()).then(() => res())
      img.onerror = () => rej(new Error('photo'))
      img.src = photoUrl(id, i)
    })
    Promise.all([load(0), load(1)]).then(() => live && setState('ready'), () => live && setState('error'))
    return () => { live = false }
  }, [id, enabled])
  return state
}

/** Static thumbnail in a fixed box: drawing end pose, else the end photo (fades in once loaded), else blank. */
export function ExerciseThumb({ id, className = '' }: { id: string; className?: string }) {
  const fig = getFigure(id)
  const [loaded, setLoaded] = useState(false)
  if (fig) return <div className={`bg-bg overflow-hidden ${className}`}><FigureStill figure={fig} className="w-full h-full" /></div>
  if (hasPhoto(id)) {
    return (
      <div className={`overflow-hidden ${loaded ? 'bg-bg' : 'bg-surface-2 animate-pulse'} ${className}`}>
        <img src={photoUrl(id, 1)} alt="" loading="lazy" decoding="async" onLoad={() => setLoaded(true)} onError={(e) => { e.currentTarget.style.display = 'none' }}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`} />
      </div>
    )
  }
  return <div className={`bg-bg ${className}`} />
}

/** One photo letterboxed in the frame, over a blurred copy of itself so odd aspect ratios still fill the box. */
function PhotoFill({ src }: { src: string }) {
  return <>
    <img src={src} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-50" />
    <img src={src} alt="" className="absolute inset-0 w-full h-full object-contain" />
  </>
}

/** The two photos stacked; the end photo's opacity follows the same start↔end loop as the drawing. */
function PhotoLayer({ id, frame, active }: { id: string; frame: FigureFrame; active: boolean }) {
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = endRef.current
    if (!el) return
    if (frame !== null || !active || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      el.style.transition = `opacity ${TWEEN_MS}ms ease-in-out`
      el.style.opacity = frame === 'start' ? '0' : '1'
      return
    }
    el.style.transition = 'none'
    const t0 = performance.now()
    let raf = 0, last = -1
    const step = (now: number) => {
      const t = cycleProgress(now - t0)
      if (t !== last) { last = t; el.style.opacity = String(t) }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [frame, active])
  return <>
    <div className="absolute inset-0"><PhotoFill src={photoUrl(id, 0)} /></div>
    <div ref={endRef} className="absolute inset-0" style={{ opacity: frame === 'end' ? 1 : 0 }}><PhotoFill src={photoUrl(id, 1)} /></div>
  </>
}

const seg = (on: boolean) => `h-11 px-3.5 text-sm font-medium transition-colors ${on ? 'bg-accent text-black' : 'text-text active:bg-surface-2'}`

/**
 * Exercise media in one fixed frame (4:3, or a fixed height when compact). Drawing and photos are
 * stacked and cross-fade, so switching never changes the size of anything. Start / Animate / End drive
 * both; Mistake exists only for the drawing and keeps its slot in photo mode so the row never shifts.
 */
export function ExerciseMedia({ id, compact = false }: { id: string; compact?: boolean }) {
  const { t } = useT()
  const fig = getFigure(id)
  const photo = hasPhoto(id)
  const photos = usePhotos(id, photo)
  const canPhoto = photo && photos !== 'error'
  const [pref, setPref] = useState<Mode>(() => readMode() ?? 'figure')
  const [frame, setFrame] = useState<FigureFrame>(null)
  if (!fig && !canPhoto) return null
  const mode: Mode = !fig ? 'photo' : !canPhoto ? 'figure' : pref
  const shownFrame: FigureFrame = mode === 'photo' && frame === 'mistake' ? null : frame
  const toggle = () => { const m: Mode = mode === 'figure' ? 'photo' : 'figure'; setPref(m); saveMode(m) }

  return (
    <div>
      <div className={`relative w-full overflow-hidden rounded-xl bg-bg ${compact ? 'h-48' : 'aspect-[4/3]'}`}>
        {fig && (
          <div className={`absolute inset-0 transition-opacity duration-300 ${mode === 'figure' ? 'opacity-100' : 'opacity-0'}`} aria-hidden={mode !== 'figure'}>
            <FigureView figure={fig} frame={shownFrame} paused={mode !== 'figure'} fit={4 / 3} className="w-full h-full" />
          </div>
        )}
        {photo && (
          <div className={`absolute inset-0 transition-opacity duration-300 ${mode === 'photo' ? 'opacity-100' : 'opacity-0'}`} aria-hidden={mode !== 'photo'}>
            {photos === 'ready' ? <PhotoLayer id={id} frame={shownFrame} active={mode === 'photo'} /> : <div className="absolute inset-0 bg-surface-2 animate-pulse" />}
          </div>
        )}
        <div className={`absolute top-2 start-2 flex items-center gap-1 rounded-full bg-danger px-2.5 py-1 text-xs font-semibold text-white transition-opacity duration-200 ${shownFrame === 'mistake' ? 'opacity-100' : 'opacity-0'}`} aria-hidden={shownFrame !== 'mistake'}>
          <AlertTriangle size={12} />{t('figure.mistake')}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <div className="flex rounded-full border border-border bg-surface overflow-hidden shrink-0" role="group">
          <button type="button" aria-pressed={shownFrame === 'start'} onClick={() => setFrame('start')} className={seg(shownFrame === 'start')}>{t('figure.start')}</button>
          <button type="button" aria-pressed={shownFrame === null} aria-label={t('library.animate')} title={t('library.animate')} onClick={() => setFrame(null)} className={`${seg(shownFrame === null)} !px-3`}><Play size={16} /></button>
          <button type="button" aria-pressed={shownFrame === 'end'} onClick={() => setFrame('end')} className={seg(shownFrame === 'end')}>{t('figure.end')}</button>
        </div>
        {fig?.mistake && (
          <button type="button" aria-pressed={shownFrame === 'mistake'} onClick={() => setFrame(frame === 'mistake' ? null : 'mistake')} tabIndex={mode === 'photo' ? -1 : 0}
            className={`h-11 px-3 rounded-full border text-sm font-medium inline-flex items-center gap-1.5 whitespace-nowrap transition-colors ${mode === 'photo' ? 'invisible' : ''} ${shownFrame === 'mistake' ? 'bg-danger border-danger text-white' : 'border-danger/50 text-danger'}`}>
            <AlertTriangle size={14} />{t('figure.mistake')}
          </button>
        )}
        {fig && canPhoto && (
          <button type="button" onClick={toggle} aria-label={mode === 'figure' ? t('figure.photo') : t('figure.drawing')} title={mode === 'figure' ? t('figure.photo') : t('figure.drawing')}
            className="ms-auto h-11 w-11 shrink-0 rounded-full border border-border bg-surface text-text inline-flex items-center justify-center active:bg-surface-2">
            {mode === 'figure' ? <ImageIcon size={18} /> : <PenLine size={18} />}
          </button>
        )}
      </div>
    </div>
  )
}
