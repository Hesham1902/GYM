import { useEffect, useRef, useState } from 'react'
import { POSES, type FrontParams, type Pose, type Prop, type SideParams } from '@/data/poses'

const L = { torso: 44, neck: 9, head: 10, ua: 26, fa: 24, thigh: 34, shin: 32, foot: 13, shoulderW: 14, hipW: 9 }
const rad = (d: number) => (d * Math.PI) / 180
type Pt = [number, number]

function rot(p: Pt, c: Pt, deg: number): Pt {
  if (!deg) return p
  const a = rad(deg), dx = p[0] - c[0], dy = p[1] - c[1]
  return [c[0] + dx * Math.cos(a) - dy * Math.sin(a), c[1] + dx * Math.sin(a) + dy * Math.cos(a)]
}
// limb from point, absolute angle from "down" toward +x
const limb = (from: Pt, ang: number, len: number): Pt => [from[0] + len * Math.sin(rad(ang)), from[1] + len * Math.cos(rad(ang))]

interface SideJoints { head: Pt; neck: Pt; shoulder: Pt; hip: Pt; knee: Pt; ankle: Pt; toe: Pt; elbow: Pt; wrist: Pt; elbow2?: Pt; wrist2?: Pt; knee2?: Pt; ankle2?: Pt; toe2?: Pt }

function sideJoints(p: SideParams): SideJoints {
  const hip = p.hip
  const shoulder = limb(hip, 180 + p.torso, L.torso)
  const neck = limb(shoulder, 180 + p.torso + (p.neck ?? 0), L.neck)
  const head = limb(neck, 180 + p.torso + (p.neck ?? 0), L.head)
  const elbow = limb(shoulder, p.ua, L.ua), wrist = limb(elbow, p.fa, L.fa)
  const knee = limb(hip, p.thigh, L.thigh), ankle = limb(knee, p.shin, L.shin)
  const toe = limb(ankle, 90 + (p.foot ?? 0), L.foot)
  const j: SideJoints = { head, neck, shoulder, hip, knee, ankle, toe, elbow, wrist }
  if (p.ua2 !== undefined) { j.elbow2 = limb(shoulder, p.ua2, L.ua); j.wrist2 = limb(j.elbow2, p.fa2 ?? p.ua2, L.fa) }
  if (p.thigh2 !== undefined) { j.knee2 = limb(hip, p.thigh2, L.thigh); j.ankle2 = limb(j.knee2, p.shin2 ?? p.thigh2, L.shin); j.toe2 = limb(j.ankle2, 90, L.foot) }
  const r = p.rot ?? 0
  if (r) for (const k of Object.keys(j) as (keyof SideJoints)[]) { const v = j[k]; if (v) (j as unknown as Record<string, Pt>)[k] = rot(v, hip, r) }
  return j
}

function lerpSide(a: SideParams, b: SideParams, t: number): SideParams {
  const n = (x?: number, y?: number) => (x === undefined || y === undefined ? x ?? y : x + (y - x) * t)
  return {
    hip: [a.hip[0] + (b.hip[0] - a.hip[0]) * t, a.hip[1] + (b.hip[1] - a.hip[1]) * t],
    rot: n(a.rot, b.rot), torso: n(a.torso, b.torso)!, neck: n(a.neck, b.neck),
    ua: n(a.ua, b.ua)!, fa: n(a.fa, b.fa)!, ua2: n(a.ua2, b.ua2), fa2: n(a.fa2, b.fa2),
    thigh: n(a.thigh, b.thigh)!, shin: n(a.shin, b.shin)!, thigh2: n(a.thigh2, b.thigh2), shin2: n(a.shin2, b.shin2), foot: n(a.foot, b.foot),
  }
}
function lerpFront(a: FrontParams, b: FrontParams, t: number): FrontParams {
  return { front: true, hip: [a.hip[0] + (b.hip[0] - a.hip[0]) * t, a.hip[1] + (b.hip[1] - a.hip[1]) * t], abd: a.abd + (b.abd - a.abd) * t, elbow: a.elbow + (b.elbow - a.elbow) * t, knee: (a.knee ?? 0) + ((b.knee ?? 0) - (a.knee ?? 0)) * t, lean: (a.lean ?? 0) + ((b.lean ?? 0) - (a.lean ?? 0)) * t }
}

function PropShape({ p, wrist, wrist2 }: { p: Prop; wrist: Pt; wrist2?: Pt }) {
  const stroke = 'var(--color-muted)'
  switch (p.t) {
    case 'floor': return <line x1={4} y1={p.y} x2={196} y2={p.y} stroke={stroke} strokeWidth={2} />
    case 'wall': return <line x1={p.x} y1={10} x2={p.x} y2={190} stroke={stroke} strokeWidth={3} />
    case 'door': return <g stroke={stroke} strokeWidth={3}><line x1={p.x} y1={20} x2={p.x} y2={175} /><line x1={p.x} y1={20} x2={p.x + 30} y2={20} /></g>
    case 'bench': return <rect x={p.x} y={p.y - (p.h ?? 8)} width={p.w} height={p.h ?? 8} rx={2} fill={stroke} opacity={0.6} transform={p.angle ? `rotate(${p.angle} ${p.x} ${p.y})` : undefined} />
    case 'box': return <rect x={p.x} y={p.y} width={p.w} height={p.h} rx={3} fill={stroke} opacity={0.35} />
    case 'seat': return (
      <g fill={stroke} opacity={0.6}>
        <rect x={p.x} y={p.y} width={p.w ?? 40} height={7} rx={2} />
        {p.back && <rect x={p.x - 7} y={p.y - p.back} width={7} height={p.back + 7} rx={2} transform={`rotate(${-(p.backAngle ?? 0)} ${p.x} ${p.y + 7})`} />}
        <rect x={p.x + 8} y={p.y + 7} width={6} height={170 - p.y - 7} opacity={0.5} />
      </g>
    )
    case 'bar': return <g><circle cx={wrist[0]} cy={wrist[1]} r={7} fill="none" stroke="var(--color-accent)" strokeWidth={3} />{wrist2 && <circle cx={wrist2[0]} cy={wrist2[1]} r={7} fill="none" stroke="var(--color-accent)" strokeWidth={3} />}</g>
    case 'db': return <g>{[wrist, wrist2].filter(Boolean).map((w, i) => <rect key={i} x={w![0] - 8} y={w![1] - 3.5} width={16} height={7} rx={2} fill="var(--color-accent)" />)}</g>
    case 'cable': return <line x1={wrist[0]} y1={wrist[1]} x2={p.to[0]} y2={p.to[1]} stroke="var(--color-accent)" strokeWidth={2} strokeDasharray="3 3" />
    case 'band': return wrist2 ? <line x1={wrist[0]} y1={wrist[1]} x2={wrist2[0]} y2={wrist2[1]} stroke="var(--color-accent)" strokeWidth={3} /> : null
    case 'roller': return <circle cx={p.x} cy={p.y} r={10} fill="none" stroke="var(--color-accent)" strokeWidth={3} />
    case 'barOverhead': return <line x1={p.x1} y1={p.y} x2={p.x2} y2={p.y} stroke={stroke} strokeWidth={4} strokeLinecap="round" />
  }
}

function SideFigure({ j, props }: { j: SideJoints; props: Prop[] }) {
  const main = 'var(--color-text)', back = 'var(--color-muted)'
  const seg = (a: Pt, b: Pt, c = main, w = 5) => <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={c} strokeWidth={w} strokeLinecap="round" />
  return (
    <>
      {props.filter((p) => p.t !== 'db' && p.t !== 'bar' && p.t !== 'cable' && p.t !== 'band').map((p, i) => <PropShape key={i} p={p} wrist={j.wrist} wrist2={j.wrist2} />)}
      {j.knee2 && j.ankle2 && j.toe2 && <>{seg(j.hip, j.knee2, back)}{seg(j.knee2, j.ankle2, back)}{seg(j.ankle2, j.toe2, back, 4)}</>}
      {j.elbow2 && j.wrist2 && <>{seg(j.shoulder, j.elbow2, back)}{seg(j.elbow2, j.wrist2, back)}</>}
      {seg(j.hip, j.knee)}{seg(j.knee, j.ankle)}{seg(j.ankle, j.toe, main, 4)}
      {seg(j.hip, j.shoulder, main, 6)}{seg(j.shoulder, j.neck)}
      <circle cx={j.head[0]} cy={j.head[1]} r={L.head} fill={main} />
      {seg(j.shoulder, j.elbow)}{seg(j.elbow, j.wrist)}
      {props.filter((p) => p.t === 'db' || p.t === 'bar' || p.t === 'cable' || p.t === 'band').map((p, i) => <PropShape key={'w' + i} p={p} wrist={j.wrist} wrist2={j.wrist2} />)}
    </>
  )
}

function FrontFigure({ p, props }: { p: FrontParams; props: Prop[] }) {
  const main = 'var(--color-text)'
  const hip = p.hip
  const lean = p.lean ?? 0
  const neckPt: Pt = [hip[0] + lean, hip[1] - L.torso]
  const sL: Pt = [neckPt[0] - L.shoulderW, neckPt[1] + 4], sR: Pt = [neckPt[0] + L.shoulderW, neckPt[1] + 4]
  const head: Pt = [neckPt[0], neckPt[1] - L.neck - L.head + 2]
  // arms: abduction outward from down; elbow bend brings the forearm toward midline/up
  const eL = limb(sL, -p.abd, L.ua), eR = limb(sR, p.abd, L.ua)
  const wL = limb(eL, -p.abd + p.elbow, L.fa), wR = limb(eR, p.abd - p.elbow, L.fa)
  const hL: Pt = [hip[0] - L.hipW, hip[1]], hR: Pt = [hip[0] + L.hipW, hip[1]]
  const kL = limb(hL, -(p.knee ?? 0) * 0.3, L.thigh), kR = limb(hR, (p.knee ?? 0) * 0.3, L.thigh)
  const aL = limb(kL, 0, L.shin), aR = limb(kR, 0, L.shin)
  const seg = (a: Pt, b: Pt, w = 5) => <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={main} strokeWidth={w} strokeLinecap="round" />
  return (
    <>
      {props.filter((q) => q.t !== 'db' && q.t !== 'band' && q.t !== 'cable').map((q, i) => <PropShape key={i} p={q} wrist={wR} wrist2={wL} />)}
      {seg(hL, kL)}{seg(kL, aL)}{seg(hR, kR)}{seg(kR, aR)}
      {seg(hL, hR, 6)}{seg([hip[0], hip[1]], neckPt, 6)}{seg(sL, sR, 6)}
      <circle cx={head[0]} cy={head[1]} r={L.head} fill={main} />
      {seg(sL, eL)}{seg(eL, wL)}{seg(sR, eR)}{seg(eR, wR)}
      {props.filter((q) => q.t === 'db' || q.t === 'band' || q.t === 'cable').map((q, i) => <PropShape key={'w' + i} p={q} wrist={wR} wrist2={wL} />)}
    </>
  )
}

const ease = (t: number) => t * t * (3 - 2 * t)

export function ExerciseFigure({ poseId, animate = true, frame, className = '' }: { poseId: string; animate?: boolean; frame?: 'start' | 'end'; className?: string }) {
  const pose: Pose | undefined = POSES[poseId]
  const [t, setT] = useState(0)
  const raf = useRef(0)
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const run = animate && !frame && !reduced
  useEffect(() => {
    if (!run) { setT(frame === 'end' ? 1 : 0); return }
    const period = 2600
    const t0 = performance.now()
    const tick = (now: number) => {
      const ph = ((now - t0) % period) / period
      const x = ph < 0.4 ? ph / 0.4 : ph < 0.5 ? 1 : ph < 0.9 ? 1 - (ph - 0.5) / 0.4 : 0
      setT(ease(x))
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [run, frame, poseId])
  if (!pose) return null
  const props = pose.props ?? []
  const a = pose.start, b = pose.end
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-hidden="true">
      {'front' in a && 'front' in b
        ? <FrontFigure p={lerpFront(a, b, t)} props={props} />
        : <SideFigure j={sideJoints(lerpSide(a as SideParams, b as SideParams, t))} props={props} />}
    </svg>
  )
}
