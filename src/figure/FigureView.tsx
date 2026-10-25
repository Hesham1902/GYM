import { useEffect, useMemo, useRef, useState } from 'react'
import type { Figure } from './types'
import { lerpJoints, renderInner, VIEW } from './render'

export type FigureFrame = 'start' | 'end' | 'mistake' | null

const ease = (t: number) => t * t * (3 - 2 * t)

/** Animated or static exercise figure. frame=null animates start↔end. */
export function FigureView({ figure, frame = null, className = '' }: { figure: Figure; frame?: FigureFrame; className?: string }) {
  const [t, setT] = useState(0)
  const raf = useRef(0)
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const run = frame === null && !reduced
  useEffect(() => {
    if (!run) return
    const period = 3000, t0 = performance.now()
    const tick = (now: number) => {
      const ph = ((now - t0) % period) / period
      const x = ph < 0.35 ? ph / 0.35 : ph < 0.5 ? 1 : ph < 0.85 ? 1 - (ph - 0.5) / 0.35 : 0
      setT(ease(x)); raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [run, figure])
  const html = useMemo(() => {
    if (frame === 'mistake' && figure.mistake) return renderInner(figure, figure.mistake.joints, figure.mistake.note)
    if (frame === 'start') return renderInner(figure, figure.start.joints, figure.start.note)
    if (frame === 'end') return renderInner(figure, figure.end.joints, figure.end.note)
    const j = lerpJoints(figure.start.joints, figure.end.joints, t)
    return renderInner(figure, j, t > 0.5 ? figure.end.note : figure.start.note)
  }, [figure, frame, t])
  return <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className={className} role="img" aria-hidden="true" dangerouslySetInnerHTML={{ __html: html }} />
}
