import { C, EQUIPMENT, loadSvg } from './equipment.ts'
import { isFront, type Annotation, type Figure, type FrontJoints, type Joints, type Pt, type SideJoints } from './types.ts'

export const VIEW = 240
const W = { torso: 17, neck: 8, ua: 10, fa: 8.5, thigh: 13, shin: 10.5, foot: 6, head: 11.5 }

const seg = (a: Pt, b: Pt, w: number, color: string) =>
  `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${C.outline}" stroke-width="${w + 3}" stroke-linecap="round"/>` +
  `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`
const circle = (p: Pt, r: number, color: string) => `<circle cx="${p[0]}" cy="${p[1]}" r="${r}" fill="${color}" stroke="${C.outline}" stroke-width="2"/>`
const torsoPath = (shoulder: Pt, hip: Pt, ctrl?: Pt) => ctrl ? `M${shoulder[0]} ${shoulder[1]} Q${ctrl[0]} ${ctrl[1]} ${hip[0]} ${hip[1]}` : `M${shoulder[0]} ${shoulder[1]} L${hip[0]} ${hip[1]}`
const strokePath = (d: string, w: number, color: string) =>
  `<path d="${d}" fill="none" stroke="${C.outline}" stroke-width="${w + 3}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`

function head(p: Pt, face: Pt): string {
  // face: unit direction the nose points to
  const nose: Pt = [p[0] + face[0] * (W.head + 3), p[1] + face[1] * (W.head + 3)]
  const n1: Pt = [p[0] + face[0] * W.head * 0.6 - face[1] * 5, p[1] + face[1] * W.head * 0.6 + face[0] * 5]
  const n2: Pt = [p[0] + face[0] * W.head * 0.6 + face[1] * 5, p[1] + face[1] * W.head * 0.6 - face[0] * 5]
  return `${circle(p, W.head, C.body)}<path d="M${n1[0]} ${n1[1]} L${nose[0]} ${nose[1]} L${n2[0]} ${n2[1]} Z" fill="${C.body}" stroke="${C.outline}" stroke-width="1.5" stroke-linejoin="round"/>`
}

function unit(a: Pt, b: Pt): Pt { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l] }

function sideBody(j: SideJoints): string {
  const back = j.elbow2 && j.wrist2 ? seg(j.shoulder, j.elbow2, W.ua, C.bodyBack) + seg(j.elbow2, j.wrist2, W.fa, C.bodyBack) + circle(j.wrist2, 4, C.bodyBack) : ''
  const backLeg = j.knee2 && j.ankle2 ? seg(j.hip, j.knee2, W.thigh, C.bodyBack) + seg(j.knee2, j.ankle2, W.shin, C.bodyBack) + (j.toe2 ? seg(j.ankle2, j.toe2, W.foot, C.bodyBack) : '') : ''
  const up = unit(j.hip, j.neck)
  let face: Pt
  switch (j.face) {
    case 'up': face = [-up[1] * -1, up[0] * -1]; face = [up[0], up[1]]; break
    case 'down': face = [-up[0], -up[1]]; break
    case 'back': face = [up[1], -up[0]]; break
    default: face = [-up[1], up[0]] // perpendicular to spine, toward +x when standing upright
  }
  const spineD = torsoPath(j.shoulder, j.hip, j.spine)
  return back + backLeg +
    seg(j.hip, j.knee, W.thigh, C.body) + seg(j.knee, j.ankle, W.shin, C.body) + seg(j.ankle, j.toe, W.foot, C.body) +
    strokePath(spineD, W.torso, C.body) + seg(j.shoulder, j.neck, W.neck, C.body) +
    head(j.head, face) +
    seg(j.shoulder, j.elbow, W.ua, C.body) + seg(j.elbow, j.wrist, W.fa, C.body) + circle(j.wrist, 4.5, C.body)
}

function frontBody(j: FrontJoints): string {
  const hipL: Pt = [j.hip[0] - 9, j.hip[1]], hipR: Pt = [j.hip[0] + 9, j.hip[1]]
  const torso = `<path d="M${j.shoulderL[0]} ${j.shoulderL[1]} L${j.shoulderR[0]} ${j.shoulderR[1]} L${hipR[0]} ${hipR[1]} L${hipL[0]} ${hipL[1]} Z" fill="${C.body}" stroke="${C.outline}" stroke-width="3" stroke-linejoin="round"/>`
  const spine = j.back ? `<line x1="${j.neck[0]}" y1="${j.neck[1]}" x2="${j.hip[0]}" y2="${j.hip[1]}" stroke="${C.bodyBack}" stroke-width="2" stroke-dasharray="3 3"/>` : ''
  const faceDot = j.back ? '' : `<circle cx="${j.head[0] - 4}" cy="${j.head[1] - 2}" r="1.6" fill="${C.outline}"/><circle cx="${j.head[0] + 4}" cy="${j.head[1] - 2}" r="1.6" fill="${C.outline}"/>`
  return seg(hipL, j.kneeL, W.thigh, C.body) + seg(j.kneeL, j.ankleL, W.shin, C.body) + seg(hipR, j.kneeR, W.thigh, C.body) + seg(j.kneeR, j.ankleR, W.shin, C.body) +
    torso + spine + seg(j.neck, [j.neck[0], j.neck[1] - 4], W.neck, C.body) + circle(j.head, W.head, C.body) + faceDot +
    seg(j.shoulderL, j.elbowL, W.ua, C.body) + seg(j.elbowL, j.wristL, W.fa, C.body) + circle(j.wristL, 4.5, C.body) +
    seg(j.shoulderR, j.elbowR, W.ua, C.body) + seg(j.elbowR, j.wristR, W.fa, C.body) + circle(j.wristR, 4.5, C.body)
}

function pt(j: Joints, ref: string | Pt): Pt | null {
  if (Array.isArray(ref)) return ref
  const v = (j as unknown as Record<string, Pt | undefined>)[ref]
  return v ?? null
}

function annotations(j: Joints, n?: Annotation): string {
  if (!n) return ''
  let out = ''
  for (const m of n.muscle ?? []) { const p = pt(j, m); if (p) out += `<circle cx="${p[0]}" cy="${p[1]}" r="16" fill="${C.accent}" opacity=".18"/><circle cx="${p[0]}" cy="${p[1]}" r="8" fill="${C.accent}" opacity=".35"/>` }
  if (n.spine && !isFront(j)) { const s = j as SideJoints; const u = unit(s.hip, s.neck); const off: Pt = [u[1] * -4, u[0] * 4]; out += `<line x1="${s.neck[0] + off[0]}" y1="${s.neck[1] + off[1]}" x2="${s.hip[0] + off[0]}" y2="${s.hip[1] + off[1]}" stroke="${C.accent}" stroke-width="2" stroke-dasharray="4 3"/>` }
  for (const a of n.arrow ?? []) {
    const p = pt(j, a.from); if (!p) continue
    const len = a.len ?? 30, rad = (a.dir * Math.PI) / 180
    const e: Pt = [p[0] + Math.cos(rad) * len, p[1] + Math.sin(rad) * len]
    const mid: Pt = [(p[0] + e[0]) / 2, (p[1] + e[1]) / 2]
    const c = a.curve ?? 0
    const ctrl: Pt = [mid[0] - Math.sin(rad) * c, mid[1] + Math.cos(rad) * c]
    const tang = c ? unit(ctrl, e) : [Math.cos(rad), Math.sin(rad)] as Pt
    const h1: Pt = [e[0] - tang[0] * 8 + tang[1] * 5, e[1] - tang[1] * 8 - tang[0] * 5], h2: Pt = [e[0] - tang[0] * 8 - tang[1] * 5, e[1] - tang[1] * 8 + tang[0] * 5]
    out += `<path d="M${p[0]} ${p[1]} Q${ctrl[0]} ${ctrl[1]} ${e[0]} ${e[1]}" fill="none" stroke="${C.warn}" stroke-width="3" stroke-linecap="round"/><path d="M${h1[0]} ${h1[1]} L${e[0]} ${e[1]} L${h2[0]} ${h2[1]}" fill="none" stroke="${C.warn}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`
  }
  if (n.mistake) { const p = pt(j, n.mistake.at); if (p) out += `<circle cx="${p[0]}" cy="${p[1]}" r="13" fill="none" stroke="${C.danger}" stroke-width="3"/><path d="M${p[0] - 6} ${p[1] - 6} L${p[0] + 6} ${p[1] + 6} M${p[0] + 6} ${p[1] - 6} L${p[0] - 6} ${p[1] + 6}" stroke="${C.danger}" stroke-width="3" stroke-linecap="round"/>` }
  return out
}

/** Render inner SVG markup (no <svg> wrapper) for the figure at the given joints. */
export function renderInner(fig: Figure, joints: Joints, note?: Annotation): string {
  let eq = ''
  for (const e of fig.equipment ?? []) {
    const sym = EQUIPMENT[e.id]; if (!sym) continue
    const t = `translate(${e.x ?? 0} ${e.y ?? 0}) ${e.s ? `scale(${e.s})` : ''} ${e.flip ? 'scale(-1 1)' : ''} ${e.a ? `rotate(${e.a})` : ''}`
    eq += `<g transform="${t}">${sym.svg}</g>`
  }
  let cable = ''
  if (fig.cable) {
    const targets = fig.cable.to === 'both' ? ['wrist', 'wrist2', 'wristL', 'wristR'] : [fig.cable.to]
    for (const t of targets) { const p = pt(joints, t); if (p) cable += `<line x1="${fig.cable.from[0]}" y1="${fig.cable.from[1]}" x2="${p[0]}" y2="${p[1]}" stroke="${C.load}" stroke-width="2.5" stroke-dasharray="1 0"/>` }
  }
  const body = isFront(joints) ? frontBody(joints) : sideBody(joints)
  let loads = ''
  for (const l of fig.load ?? []) {
    const names = l.at === 'both' ? ['wrist', 'wrist2', 'wristL', 'wristR'] : [l.at]
    const pts = names.map((nm) => pt(joints, nm)).filter(Boolean) as Pt[]
    if (l.id === 'band') { if (pts.length >= 2) loads += loadSvg('band', pts[0], 0, pts[1]); continue }
    for (const p of pts) loads += loadSvg(l.id, p, l.a ?? 0)
  }
  const flip = fig.flip ? `transform="translate(${VIEW} 0) scale(-1 1)"` : ''
  return `<g ${flip}>${eq}${cable}${body}${loads}${annotations(joints, note)}</g>`
}

export function renderSvg(fig: Figure, joints: Joints, note?: Annotation, bg = '#18181b'): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW} ${VIEW}" width="${VIEW}" height="${VIEW}"><rect width="${VIEW}" height="${VIEW}" fill="${bg}"/>${renderInner(fig, joints, note)}</svg>`
}

export function lerpJoints(a: Joints, b: Joints, t: number): Joints {
  const out: Record<string, unknown> = {}
  for (const k of Object.keys(a)) {
    const va = (a as unknown as Record<string, unknown>)[k], vb = (b as unknown as Record<string, unknown>)[k]
    if (Array.isArray(va) && Array.isArray(vb)) out[k] = [va[0] + (vb[0] - va[0]) * t, va[1] + (vb[1] - va[1]) * t]
    else out[k] = t < 0.5 ? va : vb ?? va
  }
  return out as unknown as Joints
}
