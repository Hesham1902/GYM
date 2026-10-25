import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { Annotation, Figure, Frame, Joints } from './types'
import { fitBox, flipTransform, lerpJoints, renderDynamic, renderStatic, VIEW } from './render'
import { cycleProgress, easeInOut, noteFade, TWEEN_MS } from './motion'

export type FigureFrame = 'start' | 'end' | 'mistake' | null

const reducedMotion = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Per-frame render cost, read in dev tools as `__figureStats` (avg = ms / frames). */
export const figureStats = { frames: 0, ms: 0, max: 0 }
if (import.meta.env?.DEV && typeof window !== 'undefined') (window as unknown as { __figureStats: typeof figureStats }).__figureStats = figureStats

function frameOf(fig: Figure, frame: Exclude<FigureFrame, null>): Frame {
  if (frame === 'mistake' && fig.mistake) return fig.mistake
  return frame === 'end' ? fig.end : fig.start
}

/**
 * Exercise figure. frame=null loops start↔end (hold, ease, hold); a fixed frame tweens to that pose.
 * Equipment markup is built once per figure; each animation frame only rewrites the moving layer,
 * outside React, and the loop sleeps while the figure is off screen or `paused`.
 */
export function FigureView({ figure, frame = null, className = '', paused = false, fit }: {
  figure: Figure; frame?: FigureFrame; className?: string; paused?: boolean
  /** frame aspect (w/h): crops empty space above standing / seated figures so they fill it */
  fit?: number
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const dynRef = useRef<SVGGElement>(null)
  const flashRef = useRef<SVGRectElement>(null)
  const shown = useRef<{ fig: Figure; joints: Joints } | null>(null)
  const [onScreen, setOnScreen] = useState(true)
  const staticMarkup = useMemo(() => renderStatic(figure), [figure])
  const [vx, vy, vw, vh] = useMemo(() => (fit ? fitBox(figure, fit) : figure.zoom ?? [0, 0, VIEW, VIEW]), [figure, fit])

  useEffect(() => {
    const el = svgRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useLayoutEffect(() => {
    const g = dynRef.current
    if (!g) return
    const loopSpine = !!(figure.start.note?.spine || figure.end.note?.spine)
    const spine = frame === 'mistake' ? !!figure.mistake?.note?.spine : loopSpine
    const draw = (j: Joints, note: Annotation | undefined, opacity: number) => {
      const t0 = performance.now()
      g.innerHTML = renderDynamic(figure, j, note, opacity, spine)
      const ms = performance.now() - t0
      figureStats.frames++; figureStats.ms += ms; if (ms > figureStats.max) figureStats.max = ms
      shown.current = { fig: figure, joints: j }
    }
    const from = shown.current?.fig === figure ? shown.current.joints : null
    const still = reducedMotion()
    let raf = 0
    const tween = (target: Frame, done?: () => void) => {
      if (!from || still) { draw(target.joints, target.note, 1); done?.(); return }
      const t0 = performance.now()
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / TWEEN_MS), e = easeInOut(p)
        draw(lerpJoints(from, target.joints, e), target.note, noteFade(e))
        if (p < 1) raf = requestAnimationFrame(step)
        else done?.()
      }
      raf = requestAnimationFrame(step)
    }

    if (frame !== null) {
      tween(frameOf(figure, frame))
      if (frame === 'mistake' && !still) flashRef.current?.animate?.([{ opacity: 0 }, { opacity: 0.32 }, { opacity: 0 }], { duration: 520, easing: 'ease-out' })
      return () => cancelAnimationFrame(raf)
    }
    if (still || paused || !onScreen) {
      // a still or hidden loop shows the finished rep, with its arrow and glow
      if (still || !from) draw(figure.end.joints, figure.end.note, 1)
      return
    }
    const loop = () => {
      const t0 = performance.now()
      let last = -1
      const step = (now: number) => {
        const t = cycleProgress(now - t0)
        if (t !== last) {
          last = t
          const j = lerpJoints(figure.start.joints, figure.end.joints, t)
          if (t < 0.5) draw(j, figure.start.note, noteFade(1 - t))
          else draw(j, figure.end.note, noteFade(t))
        }
        raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }
    if (from) tween(figure.start, loop)
    else loop()
    return () => cancelAnimationFrame(raf)
  }, [figure, frame, paused, onScreen])

  const flip = flipTransform(figure)
  return (
    <svg ref={svgRef} viewBox={`${vx} ${vy} ${vw} ${vh}`} preserveAspectRatio="xMidYMid meet" className={className} role="img" aria-hidden="true">
      <g transform={flip}>
        <g dangerouslySetInnerHTML={{ __html: staticMarkup }} />
        <g ref={dynRef} />
      </g>
      <rect ref={flashRef} x={vx} y={vy} width={vw} height={vh} fill="#ef4444" opacity={0} pointerEvents="none" />
    </svg>
  )
}

/** Static drawing (no loop, no observers) for list thumbnails. Markup is cached per figure. */
const thumbCache = new WeakMap<Figure, string>()
export function FigureStill({ figure, className = '' }: { figure: Figure; className?: string }) {
  let html = thumbCache.get(figure)
  if (html === undefined) {
    const t = flipTransform(figure)
    html = `<g${t ? ` transform="${t}"` : ''}>${renderStatic(figure)}${renderDynamic(figure, figure.end.joints)}</g>`
    thumbCache.set(figure, html)
  }
  const [vx, vy, vw, vh] = figure.zoom ?? [0, 0, VIEW, VIEW]
  return <svg viewBox={`${vx} ${vy} ${vw} ${vh}`} preserveAspectRatio="xMidYMid meet" className={className} aria-hidden="true" dangerouslySetInnerHTML={{ __html: html }} />
}
