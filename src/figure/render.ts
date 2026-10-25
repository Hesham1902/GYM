import { C, EQUIPMENT, EQUIPMENT_TOP, LOAD_UNDER_HAND, loadSvg } from './equipment.ts'
import { isFront, type Annotation, type EquipmentUse, type Figure, type FrontJoints, type Joints, type Pt, type SideJoints } from './types.ts'

export const VIEW = 240
const W = { torso: 17, neck: 8, ua: 10, fa: 8.5, thigh: 13, shin: 10.5, foot: 6, head: 11.5 }
/** Every limb is drawn as an outline stroke `w + OL` under a fill stroke `w` (1.5 px dark rim). Shapes use SHAPE_OL. */
const OL = 3
const SHAPE_OL = 2

/** One decimal is enough at 240 units and keeps the per-frame markup short. */
const n = (v: number) => Math.round(v * 10) / 10
const unit = (a: Pt, b: Pt): Pt => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l] }
const add = (a: Pt, b: Pt, k = 1): Pt => [a[0] + b[0] * k, a[1] + b[1] * k]
const line = (a: Pt, b: Pt, w: number, color: string, extra = '') =>
  `<line x1="${n(a[0])}" y1="${n(a[1])}" x2="${n(b[0])}" y2="${n(b[1])}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"${extra}/>`

/** Limb: dark rim, fill, and a soft shade along the lower edge so limbs read as volumes. */
function seg(a: Pt, b: Pt, w: number, color: string): string {
  const d = unit(a, b)
  let p: Pt = [-d[1], d[0]]
  if (p[1] < 0 || (p[1] === 0 && p[0] < 0)) p = [-p[0], -p[1]]
  const o = w * 0.24
  return line(a, b, w + OL, C.outline) + line(a, b, w, color) + line(add(a, p, o), add(b, p, o), w * 0.4, C.shade, ' stroke-opacity=".09"')
}
const circle = (p: Pt, r: number, color: string) => `<circle cx="${n(p[0])}" cy="${n(p[1])}" r="${r}" fill="${color}" stroke="${C.outline}" stroke-width="${SHAPE_OL}"/>`
const torsoPath = (shoulder: Pt, hip: Pt, ctrl?: Pt) => ctrl
  ? `M${n(shoulder[0])} ${n(shoulder[1])} Q${n(ctrl[0])} ${n(ctrl[1])} ${n(hip[0])} ${n(hip[1])}`
  : `M${n(shoulder[0])} ${n(shoulder[1])} L${n(hip[0])} ${n(hip[1])}`
const strokePath = (d: string, w: number, color: string) =>
  `<path d="${d}" fill="none" stroke="${C.outline}" stroke-width="${w + OL}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`

/** Profile head: a small nose nub (mostly hidden under the skull) and an eye. `up` = toward the crown. */
function head(p: Pt, face: Pt, up: Pt, color = C.body): string {
  const r = W.head
  const tip = add(add(p, face, r + 3.5), up, -0.5)
  const b1 = add(add(p, face, r - 3), up, 4), b2 = add(add(p, face, r - 3), up, -3.5)
  const eye = add(add(p, face, 5.5), up, 2.5)
  return `<path d="M${n(b1[0])} ${n(b1[1])} L${n(tip[0])} ${n(tip[1])} L${n(b2[0])} ${n(b2[1])} Z" fill="${color}" stroke="${C.outline}" stroke-width="${SHAPE_OL}" stroke-linejoin="round"/>` +
    circle(p, r, color) + `<circle cx="${n(eye[0])}" cy="${n(eye[1])}" r="1.5" fill="${C.outline}"/>`
}

/** Closed hand: a rounded block slightly wider than the forearm, along the forearm. */
function hand(wrist: Pt, elbow: Pt, color: string): string {
  const d = unit(elbow, wrist), c = add(wrist, d, 2.5)
  const deg = Math.round((Math.atan2(d[1], d[0]) * 180) / Math.PI)
  return `<rect x="-5.5" y="-4.6" width="11" height="9.2" rx="4.2" fill="${color}" stroke="${C.outline}" stroke-width="${SHAPE_OL}" transform="translate(${n(c[0])} ${n(c[1])}) rotate(${deg})"/>`
}

/** Foot from a small heel behind the ankle to the toe. */
function foot(ankle: Pt, toe: Pt, color: string): string {
  const d = unit(ankle, toe)
  return seg(add(ankle, d, -4), toe, W.foot, color)
}

interface BodyParts { behind: string; core: string; arms: string; hands: string }

function sideBody(j: SideJoints): BodyParts {
  const back = j.elbow2 && j.wrist2 ? seg(j.shoulder, j.elbow2, W.ua, C.bodyBack) + seg(j.elbow2, j.wrist2, W.fa, C.bodyBack) + hand(j.wrist2, j.elbow2, C.bodyBack) : ''
  const backLeg = j.knee2 && j.ankle2 ? seg(j.hip, j.knee2, W.thigh, C.bodyBack) + seg(j.knee2, j.ankle2, W.shin, C.bodyBack) + (j.toe2 ? foot(j.ankle2, j.toe2, C.bodyBack) : '') : ''
  const spineUp = unit(j.hip, j.neck)
  let face: Pt
  switch (j.face) {
    case 'up': face = [0, -1]; break      // nose toward the top of the picture (supine)
    case 'down': face = [0, 1]; break     // nose toward the floor (prone)
    case 'back': face = [spineUp[1], -spineUp[0]]; break
    default: face = [-spineUp[1], spineUp[0]] // perpendicular to spine, toward +x when standing upright
  }
  // crown direction: neck→head made perpendicular to the face; falls back to the spine when the neck is foreshortened
  let up = unit(j.neck, j.head)
  const dot = up[0] * face[0] + up[1] * face[1]
  up = Math.abs(dot) > 0.9 ? spineUp : unit([0, 0], [up[0] - dot * face[0], up[1] - dot * face[1]])
  if (j.headTilt) {
    // positive tilt turns the nose toward the crown (chin up), negative toward the chest (tuck)
    const r = (j.headTilt * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r)
    const f2: Pt = [face[0] * c + up[0] * s, face[1] * c + up[1] * s]
    up = [up[0] * c - face[0] * s, up[1] * c - face[1] * s]
    face = f2
  }
  const spineD = torsoPath(j.shoulder, j.hip, j.spine)
  return {
    behind: back + backLeg,
    core: seg(j.hip, j.knee, W.thigh, C.body) + seg(j.knee, j.ankle, W.shin, C.body) + foot(j.ankle, j.toe, C.body) +
      strokePath(spineD, W.torso, C.torso) + seg(j.shoulder, j.neck, W.neck, C.torso) + head(j.head, face, up),
    arms: seg(j.shoulder, j.elbow, W.ua, C.body) + seg(j.elbow, j.wrist, W.fa, C.body),
    hands: hand(j.wrist, j.elbow, C.body),
  }
}

function frontBody(j: FrontJoints): BodyParts {
  // works for any torso angle (side planks, lying): hips and eyes are placed across the neck→hip axis
  const up = unit(j.hip, j.neck), side: Pt = [-up[1], up[0]]
  const hipL = add(j.hip, side, -9), hipR = add(j.hip, side, 9)
  const torso = `<path d="M${n(j.shoulderL[0])} ${n(j.shoulderL[1])} L${n(j.shoulderR[0])} ${n(j.shoulderR[1])} L${n(hipR[0])} ${n(hipR[1])} L${n(hipL[0])} ${n(hipL[1])} Z" fill="${C.torso}" stroke="${C.outline}" stroke-width="${OL}" stroke-linejoin="round"/>`
  const spine = j.back ? line(j.neck, j.hip, 2, C.bodyBack, ' stroke-dasharray="3 3"') : ''
  const e1 = add(add(j.head, up, 2), side, -4), e2 = add(add(j.head, up, 2), side, 4)
  const eyes = j.back || j.head[1] > j.neck[1] ? '' : `<circle cx="${n(e1[0])}" cy="${n(e1[1])}" r="1.6" fill="${C.outline}"/><circle cx="${n(e2[0])}" cy="${n(e2[1])}" r="1.6" fill="${C.outline}"/>`
  return {
    behind: '',
    core: seg(hipL, j.kneeL, W.thigh, C.body) + seg(j.kneeL, j.ankleL, W.shin, C.body) + seg(hipR, j.kneeR, W.thigh, C.body) + seg(j.kneeR, j.ankleR, W.shin, C.body) +
      torso + spine + seg(j.neck, add(j.neck, up, 4), W.neck, C.body) + circle(j.head, W.head, C.body) + eyes,
    arms: seg(j.shoulderL, j.elbowL, W.ua, C.body) + seg(j.elbowL, j.wristL, W.fa, C.body) + seg(j.shoulderR, j.elbowR, W.ua, C.body) + seg(j.elbowR, j.wristR, W.fa, C.body),
    hands: hand(j.wristL, j.elbowL, C.body) + hand(j.wristR, j.elbowR, C.body),
  }
}

function pt(j: Joints, ref: string | Pt): Pt | null {
  if (Array.isArray(ref)) return ref
  const v = (j as unknown as Record<string, Pt | undefined>)[ref]
  return v ?? null
}

function spineGuide(j: Joints): string {
  if (isFront(j)) return ''
  const u = unit(j.hip, j.neck), off: Pt = [u[1] * -4, u[0] * 4]
  return line(add(j.neck, off), add(j.hip, off), 2, C.accent, ' stroke-dasharray="4 3"')
}

/** Arrows, muscle glow and the mistake marker, at the current joint positions. */
function annotations(j: Joints, a: Annotation | undefined): string {
  if (!a) return ''
  let out = ''
  for (const m of a.muscle ?? []) { const p = pt(j, m); if (p) out += `<circle cx="${n(p[0])}" cy="${n(p[1])}" r="16" fill="${C.accent}" opacity=".18"/><circle cx="${n(p[0])}" cy="${n(p[1])}" r="8" fill="${C.accent}" opacity=".35"/>` }
  for (const ar of a.arrow ?? []) {
    const p = pt(j, ar.from); if (!p) continue
    const len = ar.len ?? 30, rad = (ar.dir * Math.PI) / 180
    const e: Pt = [p[0] + Math.cos(rad) * len, p[1] + Math.sin(rad) * len]
    const mid: Pt = [(p[0] + e[0]) / 2, (p[1] + e[1]) / 2]
    const c = ar.curve ?? 0
    const ctrl: Pt = [mid[0] - Math.sin(rad) * c, mid[1] + Math.cos(rad) * c]
    const tang = c ? unit(ctrl, e) : [Math.cos(rad), Math.sin(rad)] as Pt
    const h1: Pt = [e[0] - tang[0] * 8 + tang[1] * 5, e[1] - tang[1] * 8 - tang[0] * 5], h2: Pt = [e[0] - tang[0] * 8 - tang[1] * 5, e[1] - tang[1] * 8 + tang[0] * 5]
    out += `<path d="M${n(p[0])} ${n(p[1])} Q${n(ctrl[0])} ${n(ctrl[1])} ${n(e[0])} ${n(e[1])}" fill="none" stroke="${C.warn}" stroke-width="3" stroke-linecap="round"/><path d="M${n(h1[0])} ${n(h1[1])} L${n(e[0])} ${n(e[1])} L${n(h2[0])} ${n(h2[1])}" fill="none" stroke="${C.warn}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`
  }
  if (a.mistake) { const p = pt(j, a.mistake.at); if (p) out += `<circle cx="${n(p[0])}" cy="${n(p[1])}" r="13" fill="${C.danger}" fill-opacity=".15" stroke="${C.danger}" stroke-width="3"/><path d="M${n(p[0] - 5.5)} ${n(p[1] - 5.5)} L${n(p[0] + 5.5)} ${n(p[1] + 5.5)} M${n(p[0] + 5.5)} ${n(p[1] - 5.5)} L${n(p[0] - 5.5)} ${n(p[1] + 5.5)}" stroke="${C.danger}" stroke-width="3" stroke-linecap="round"/>` }
  return out
}

const eqTransform = (e: EquipmentUse, x = e.x ?? 0, y = e.y ?? 0) =>
  `translate(${n(x)} ${n(y)})${e.s ? ` scale(${e.s})` : ''}${e.flip ? ' scale(-1 1)' : ''}${e.a ? ` rotate(${e.a})` : ''}`

const staticCache = new WeakMap<Figure, string>()
/** Equipment that never moves. Memoised per figure: built once, reused by every animation frame. */
export function renderStatic(fig: Figure): string {
  let out = staticCache.get(fig)
  if (out !== undefined) return out
  out = ''
  for (const e of fig.equipment ?? []) {
    const sym = EQUIPMENT[e.id]; if (!sym || e.attach) continue
    out += `<g transform="${eqTransform(e)}">${sym.svg}</g>`
  }
  staticCache.set(fig, out)
  return out
}

function levers(fig: Figure, j: Joints): string {
  let out = ''
  for (const l of fig.lever ?? []) {
    const p = pt(j, l.to); if (!p) continue
    const e = l.off ? add(p, l.off) : p
    out += line(l.pivot, e, 7, C.outline) + line(l.pivot, e, 4, C.frame) + `<circle cx="${l.pivot[0]}" cy="${l.pivot[1]}" r="4.5" fill="${C.pad}" stroke="${C.frame}" stroke-width="2"/>`
    if (l.end === 'roller') out += `<circle cx="${n(e[0])}" cy="${n(e[1])}" r="7.5" fill="${C.pad}" stroke="${C.padEdge}" stroke-width="2"/>`
    else if (l.end !== 'none') out += line(add(e, [0, -9]), add(e, [0, 9]), 8, C.outline) + line(add(e, [0, -9]), add(e, [0, 9]), 5, C.metal)
  }
  return out
}

/**
 * Everything that moves with the joints: attached equipment, levers, body, loads, cables, annotations.
 * `noteOpacity` fades arrows and muscle glow; the spine guide is drawn whenever `spine` is set.
 */
export function renderDynamic(fig: Figure, joints: Joints, note?: Annotation, noteOpacity = 1, spine = !!note?.spine): string {
  let attached = ''
  for (const e of fig.equipment ?? []) {
    if (!e.attach) continue
    const sym = EQUIPMENT[e.id], p = pt(joints, e.attach); if (!sym || !p) continue
    attached += `<g transform="${eqTransform(e, p[0] + (e.x ?? 0), p[1] + (e.y ?? 0))}">${sym.svg}</g>`
  }
  let cable = ''
  if (fig.cable) {
    const targets = fig.cable.to === 'both' ? ['wrist', 'wrist2', 'wristL', 'wristR'] : [fig.cable.to]
    for (const t of targets) { const p = pt(joints, t); if (p) cable += line(fig.cable.from, p, 2.5, C.load) }
  }
  const cableBehind = fig.cable?.behind ? cable : '', cableFront = fig.cable?.behind ? '' : cable
  const body = isFront(joints) ? frontBody(joints) : sideBody(joints)
  let loadsBehind = '', loadsUnder = '', loadsOver = ''
  for (const l of fig.load ?? []) {
    const names = l.at === 'both' ? ['wrist', 'wrist2', 'wristL', 'wristR'] : [l.at]
    const pts = names.map((nm) => pt(joints, nm)).filter(Boolean) as Pt[]
    let s = ''
    if (l.id === 'band') { if (pts.length >= 2) s = loadSvg('band', pts[0], 0, pts[1]) }
    else for (const p of pts) s += loadSvg(l.id, p, l.a ?? 0)
    // grip: handles and dumbbell bars sit under the closed hand; bands stay on top
    if (l.behind) loadsBehind += s
    else if (LOAD_UNDER_HAND.has(l.id)) loadsUnder += s
    else loadsOver += s
  }
  const guide = spine ? spineGuide(joints) : ''
  const notes = noteOpacity > 0.01 && note ? annotations(joints, note) : ''
  const fadedNotes = notes && noteOpacity < 0.99 ? `<g opacity="${n(noteOpacity * 100) / 100}">${notes}</g>` : notes
  return attached + levers(fig, joints) + cableBehind + body.behind + loadsBehind + body.core + cableFront + body.arms +
    loadsUnder + body.hands + loadsOver + guide + fadedNotes
}

export const flipTransform = (fig: Figure) => (fig.flip ? `translate(${VIEW} 0) scale(-1 1)` : undefined)

/** Render inner SVG markup (no <svg> wrapper) for the figure at the given joints. */
export function renderInner(fig: Figure, joints: Joints, note?: Annotation): string {
  const t = flipTransform(fig)
  return `<g${t ? ` transform="${t}"` : ''}>${renderStatic(fig)}${renderDynamic(fig, joints, note)}</g>`
}

/**
 * Box to show the figure in a frame of the given aspect (w/h). A figure with `zoom` uses it as is. Otherwise, when
 * everything (joints in every frame, arrow tips, tall equipment) sits low enough, the empty sky is cropped so the
 * person fills a 4:3 frame; the floor always stays in. Tall scenes keep the full square (letterboxed).
 */
export function fitBox(fig: Figure, aspect = 4 / 3): [number, number, number, number] {
  if (fig.zoom) return fig.zoom
  const h = VIEW / aspect, floorBottom = 216
  let minY = Infinity
  for (const fr of [fig.start, fig.end, fig.mistake]) {
    if (!fr) continue
    for (const v of Object.values(fr.joints)) if (Array.isArray(v)) minY = Math.min(minY, v[1])
    for (const a of fr.note?.arrow ?? []) {
      const p = pt(fr.joints, a.from)
      if (p) minY = Math.min(minY, p[1] + Math.sin((a.dir * Math.PI) / 180) * (a.len ?? 30))
    }
  }
  minY -= 18 // head radius, outline and a little air
  for (const e of fig.equipment ?? []) { const top = EQUIPMENT_TOP[e.id]; if (top !== undefined && !e.attach) minY = Math.min(minY, top + (e.y ?? 0)) }
  for (const l of fig.lever ?? []) minY = Math.min(minY, l.pivot[1] - 6)
  if (fig.cable) minY = Math.min(minY, fig.cable.from[1] - 6)
  const top = floorBottom - h
  return minY >= top ? [0, top, VIEW, h] : [0, 0, VIEW, VIEW]
}

export function viewBoxOf(fig: Figure): string {
  return fig.zoom ? fig.zoom.join(' ') : `0 0 ${VIEW} ${VIEW}`
}

export function renderSvg(fig: Figure, joints: Joints, note?: Annotation, bg = '#18181b'): string {
  const [x, y, w, h] = fig.zoom ?? [0, 0, VIEW, VIEW]
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${VIEW}" height="${VIEW}" preserveAspectRatio="xMidYMid meet"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${bg}"/>${renderInner(fig, joints, note)}</svg>`
}

const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]

/**
 * Interpolate two poses. Keys missing on one side hold the other side's value, except a missing
 * `spine` control point, which means a straight spine (the shoulder–hip midpoint).
 */
export function lerpJoints(a: Joints, b: Joints, t: number): Joints {
  if (isFront(a) !== isFront(b)) return t < 0.5 ? a : b
  const A = a as unknown as Record<string, unknown>, B = b as unknown as Record<string, unknown>
  const out: Record<string, unknown> = {}
  for (const k of new Set([...Object.keys(A), ...Object.keys(B)])) {
    let va = A[k], vb = B[k]
    if (k === 'headTilt') { va ??= 0; vb ??= 0 }
    if (k === 'spine' && !isFront(a) && !isFront(b)) {
      va ??= mid(a.shoulder, a.hip)
      vb ??= mid(b.shoulder, b.hip)
    }
    va ??= vb; vb ??= va
    if (Array.isArray(va) && Array.isArray(vb)) out[k] = [va[0] + (vb[0] - va[0]) * t, va[1] + (vb[1] - va[1]) * t]
    else if (typeof va === 'number' || typeof vb === 'number') out[k] = ((va as number) ?? 0) + (((vb as number) ?? 0) - ((va as number) ?? 0)) * t
    else out[k] = t < 0.5 ? va : vb
  }
  return out as unknown as Joints
}
