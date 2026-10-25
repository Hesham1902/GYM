import type { EquipmentId, LoadId, Pt } from './types.ts'

// Palette (dark UI). Equipment is mid grey, pads darker, frame lines light grey.
export const C = {
  frame: '#9ca3af', pad: '#3f3f46', padEdge: '#71717a', metal: '#52525b', floor: '#52525b',
  body: '#f4f4f5', torso: '#cfcfd6', bodyBack: '#8f8f98', outline: '#09090b', shade: '#000000', load: '#22c55e', accent: '#22c55e', warn: '#f59e0b', danger: '#ef4444', info: '#38bdf8',
}

const r = (x: number, y: number, w: number, h: number, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${extra}/>`
const pad = (x: number, y: number, w: number, h: number, rot = 0, rx = 4) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${C.pad}" stroke="${C.padEdge}" stroke-width="2" ${rot ? `transform="rotate(${rot} ${x} ${y})"` : ''}/>`
const bar = (x1: number, y1: number, x2: number, y2: number, w = 4, c = C.frame) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`
const stack = (x: number, y: number, h = 70) => `<g>${r(x, y, 18, h, `fill="${C.metal}" stroke="${C.frame}" stroke-width="1.5" rx="2"`)}${Array.from({ length: Math.floor(h / 8) }, (_, i) => bar(x + 2, y + 6 + i * 8, x + 16, y + 6 + i * 8, 1.2, C.pad)).join('')}</g>`
const pulley = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="5" fill="${C.pad}" stroke="${C.frame}" stroke-width="2"/>`
const post = (x: number, yTop: number, yBottom = 210) => bar(x, yTop, x, yBottom, 5)

/**
 * Equipment symbols in a 240×240 space. Floor is y=210. Key contact points are listed per symbol
 * so poses can be placed against them. All symbols assume the person faces +x (right) unless noted.
 */
export const EQUIPMENT: Record<EquipmentId, { svg: string; doc: string }> = {
  floor: { doc: 'floor line y=210', svg: bar(8, 210, 232, 210, 3, C.floor) },
  wall: { doc: 'vertical wall at x=70 (person stands with back on it, facing +x)', svg: `${bar(70, 20, 70, 210, 5)}${r(60, 20, 10, 190, `fill="${C.pad}" opacity=".6"`)}` },
  doorFrame: { doc: 'door frame post at x=150 (forearm rests on it, elbow y≈100); person stands at x≈110 facing +x', svg: `${bar(150, 30, 150, 210, 6)}${bar(150, 30, 190, 30, 6)}${bar(190, 30, 190, 210, 6)}` },
  chair: { doc: 'chair seat top y=150 x 86..126; back pad top at (82,105)', svg: `${pad(86, 150, 40, 8)}${pad(78, 100, 8, 56)}${post(92, 158)}${post(120, 158)}` },
  box: { doc: 'step/box top y=170 x 120..190', svg: `${r(120, 170, 70, 40, `fill="${C.pad}" stroke="${C.padEdge}" stroke-width="2" rx="3"`)}` },
  benchFlat: { doc: 'flat bench top y=150, x 40..200; person lies with head at left (x≈60), hips x≈130, feet on floor at x≈190', svg: `${pad(40, 150, 160, 10)}${post(60, 160)}${post(180, 160)}` },
  benchIncline: { doc: 'incline bench: seat top y=150 x 120..160; back pad from (120,150) rising to (70,95) (≈45°); head rests near (75,100); feet on floor x≈180', svg: `${pad(120, 150, 40, 10)}${pad(116, 150, 10, 76, -48 + 180)}${post(140, 160)}${post(90, 150)}` },
  seat: { doc: 'upright seat top y=150 x 88..132, back pad x≈86..94 from y=90 to 150 (slight recline); feet on floor x≈130', svg: `${pad(88, 150, 44, 10)}${pad(84, 90, 10, 62, -6)}${post(110, 160)}` },
  chestPress: { doc: 'chest press: seat top y=150 x 88..132; back pad x 84..94 (y 88..150); machine beam at y=52 from the lever pivot (150,56) to the column at x=200; weight stack at x 206..224. Add `lever: [{ pivot: [150, 56], to: \'wrist\' }]` so the handle arm follows the hand', svg: `${pad(88, 150, 44, 10)}${pad(84, 88, 10, 64)}${post(110, 160)}${bar(150, 52, 200, 52, 5)}${bar(200, 52, 200, 210, 5)}${stack(206, 130, 80)}` },
  inclinePress: { doc: 'incline press machine: seat top y=150 x 100..140; back pad reclined 30° from (96,150) up to (74,92); beam at y=50 from the lever pivot (168,54) to the column at x=200; stack at x 206..224. Add `lever: [{ pivot: [168, 54], to: \'wrist\' }]`', svg: `${pad(100, 150, 40, 10)}${pad(96, 150, 10, 66, -30 + 180)}${post(120, 160)}${bar(168, 50, 200, 50, 5)}${bar(200, 50, 200, 210, 5)}${stack(206, 130, 80)}` },
  shoulderPress: { doc: 'shoulder press machine: seat top y=150 x 88..132; back pad x 84..94 y 85..150; support arm from the lever pivot (166,112) to the column at x=200; stack x 206..224. Add `lever: [{ pivot: [166, 112], to: \'wrist\' }]`: the handle arm swings from shoulder height to overhead', svg: `${pad(88, 150, 44, 10)}${pad(84, 85, 10, 67)}${post(110, 160)}${bar(166, 112, 200, 112, 5)}${bar(200, 40, 200, 210, 5)}${stack(206, 130, 80)}` },
  latPulldown: { doc: 'lat pulldown: seat top y=150 x 96..136; knee pad at (140,134) over the thighs; high pulley at (150,22); the bar is drawn at the hands (use load ezBar); start hands up near (140,52) → pulled to the upper chest end; column at x=190', svg: `${pad(96, 150, 40, 10)}${post(116, 160)}${pad(126, 130, 30, 8)}${bar(140, 100, 140, 130, 3)}${bar(190, 14, 190, 210, 5)}${bar(150, 14, 190, 14, 5)}${pulley(150, 22)}${stack(196, 130, 80)}` },
  cableHigh: { doc: 'cable column at x=200 with pulley at (200,40); cable runs from pulley to the hand', svg: `${bar(200, 14, 200, 210, 6)}${pulley(200, 40)}${stack(206, 130, 80)}` },
  cableMid: { doc: 'cable column at x=200 with pulley at chest height (200,105)', svg: `${bar(200, 14, 200, 210, 6)}${pulley(200, 105)}${stack(206, 130, 80)}` },
  cableFace: { doc: 'cable column at x=200 with pulley at face height (200,80)', svg: `${bar(200, 14, 200, 210, 6)}${pulley(200, 80)}${stack(206, 130, 80)}` },
  cableLow: { doc: 'cable column at x=200 with low pulley at (200,195)', svg: `${bar(200, 14, 200, 210, 6)}${pulley(200, 195)}${stack(206, 130, 80)}` },
  rowStation: { doc: 'seated cable row: seat top y=150 x 70..110 (person sits facing +x), foot plate at x=150 (angled), low pulley at (200,130)', svg: `${pad(70, 150, 40, 10)}${post(90, 160)}${pad(150, 130, 8, 50, 20)}${bar(200, 60, 200, 210, 6)}${pulley(200, 130)}${stack(206, 140, 70)}${bar(60, 158, 200, 158, 3)}` },
  chestSupportRow: { doc: 'chest-supported row: incline chest pad from (110,150) rising to (80,96) (person lies chest-down on it facing +x, head near (76,92)); seat/foot step at y=170 x 120..160; handles hang below pad at (118,150) start → (104,118) end', svg: `${pad(106, 150, 10, 66, -36 + 180)}${pad(120, 170, 40, 8)}${post(100, 150)}${post(140, 178)}` },
  rearDeltMachine: { doc: 'rear delt (reverse pec deck): seat top y=150 x 88..132; chest pad x 128..138 y 92..150 (person faces +x, chest on pad); handle arms pivot at (150,70), handles start in front at (160,105) → end out to the side (hidden)', svg: `${pad(88, 150, 44, 10)}${pad(128, 92, 10, 60)}${post(110, 160)}${bar(150, 40, 150, 70, 4)}${bar(150, 40, 200, 40, 5)}${bar(200, 40, 200, 210, 5)}${stack(206, 130, 80)}` },
  legPress: { doc: '45° leg press frame: seat pad from (50,165) rising slightly to the right (hips sit at ≈(74,152)); back pad from (64,160) up-left to ≈(24,100) at 56° (person leans back on it: shoulder ≈(50,116), head ≈(34,96)); two rails along x+y=280 and x+y=296 (45° up-right). Add `{ id: \'legPressSled\', attach: \'ankle\', a: 45 }` so the foot plate rides on the feet', svg: `${bar(100, 180, 215, 65, 4, C.metal)}${bar(112, 184, 222, 74, 4, C.metal)}${bar(100, 180, 100, 210, 5)}${bar(205, 80, 205, 210, 5)}${pad(50, 165, 44, 10, -20)}${pad(64, 160, 10, 72, 146)}${post(70, 168)}${post(94, 160)}` },
  legPressSled: { doc: 'leg press foot plate and sled; attach to the ankle with a=45 (feet flat on the plate, toes pointing up the plate toward the upper left; legs push along the 45° line). The plate surface sits on the sole; the sled reaches back to the legPress rails', svg: `${r(18, -32, 26, 20, `fill="${C.metal}" stroke="${C.frame}" stroke-width="2" rx="3"`)}<circle cx="31" cy="-42" r="9" fill="${C.pad}" stroke="${C.frame}" stroke-width="3"/>${r(-24, -14, 56, 9, `fill="${C.pad}" stroke="${C.padEdge}" stroke-width="2" rx="3"`)}` },
  kneePad: { doc: 'moving knee pad on a rod (assisted pull-up); attach to the knee with y≈6 so the shin rests on the pad top', svg: `${bar(0, 9, 0, 55, 4, C.metal)}${r(-20, 0, 40, 9, `fill="${C.pad}" stroke="${C.padEdge}" stroke-width="2" rx="4"`)}` },
  wallBack: { doc: 'front view: wall panel behind the person, x 56..184, y 18..210 (back, head and arms rest on it)', svg: `${r(56, 18, 128, 192, `fill="${C.pad}" opacity=".45" rx="3"`)}${bar(56, 18, 56, 210, 3, C.padEdge)}${bar(184, 18, 184, 210, 3, C.padEdge)}` },
  benchEnd: { doc: 'front view: flat bench seen from its end, pad top y=150 x 98..142 (hips sit on it)', svg: `${pad(98, 150, 44, 10)}${post(120, 160)}${bar(104, 210, 136, 210, 5)}` },
  rearDeltFront: { doc: 'front view of the reverse pec deck (person faces the viewer, chest pad hidden in front of the chest): seat pad top y=150 x 96..144, column behind the person at x=120 with the arm pivot at (120,34), stack x 206..224. Use `load: handle` at wristL / wristR', svg: `${bar(120, 34, 120, 210, 6)}${bar(120, 30, 215, 30, 5)}${bar(215, 30, 215, 130, 3)}<circle cx="120" cy="34" r="6" fill="${C.pad}" stroke="${C.frame}" stroke-width="2"/>${pad(96, 150, 48, 10)}${bar(96, 210, 144, 210, 5)}${stack(206, 130, 80)}` },
  legExtension: { doc: 'leg extension: seat top y=150 x 86..130 (person sits facing +x), back pad x 82..92 y 95..150; shin pad start hanging below knee at (140,195) → end extended at (184,150)', svg: `${pad(86, 150, 44, 10)}${pad(82, 95, 10, 57, -5)}${post(108, 160)}${post(130, 160)}` },
  legCurlSeated: { doc: 'seated leg curl: seat top y=150 x 86..130, back pad x 82..92 y 95..150; thigh lock pad on top of the thighs at (118,134); ankle pad start extended at (184,150) → end curled under at (130,190)', svg: `${pad(86, 150, 44, 10)}${pad(82, 95, 10, 57, -5)}${post(108, 160)}${pad(110, 130, 24, 8)}${bar(122, 100, 122, 130, 3)}` },
  legCurlLying: { doc: 'lying leg curl: bench top y=150 x 40..200, person lies face-down with head at left (x≈60), hips x≈130; ankle pad start at (195,150) → end curled up at (150,100)', svg: `${pad(40, 150, 160, 10)}${post(60, 160)}${post(180, 160)}${bar(190, 160, 190, 120, 4)}` },
  hackSquat: { doc: 'hack squat: back pad angled 60° from (126,190) up-left to (74,100) (person leans back on it, faces +x; back 9px in front of that line); foot plate from (150,200) up-right to (210,165) (angled 30°, perpendicular to the pad; feet rest 4px above that line); standing start (hips ≈(109,142), feet ≈(162,188)) → squat end (body slides down the pad, hips ≈(124,168))', svg: `${pad(126, 190, 10, 104, -30 + 180)}${pad(150, 200, 70, 10, -30)}${post(140, 195)}${bar(60, 80, 60, 210, 5)}` },
  calfStanding: { doc: 'standing calf machine: shoulder pads at y≈75 (x 100..140), step/block top y=200 x 136..186 (balls of the feet on its left edge at x≈136, toes on the block, heels hang free behind it; body centred under the pads at x≈125); frame post at x=70', svg: `${bar(70, 40, 70, 210, 6)}${bar(70, 40, 150, 40, 5)}${pad(100, 70, 44, 10)}${bar(120, 44, 120, 70, 4)}${r(136, 200, 50, 10, `fill="${C.pad}" stroke="${C.padEdge}" stroke-width="2" rx="2"`)}` },
  calfSeated: { doc: 'seated calf raise: seat top y=174 x 70..110 (hips ≈(90,168)); knee pad y 149..157 x 110..140 on the lower thighs (knees ≈(126,160)); foot block top y=200 x 140..172 (balls of the feet on its left edge x≈140, heels hang free)', svg: `${pad(70, 174, 40, 10)}${post(90, 184)}${pad(110, 149, 30, 8)}${r(140, 200, 32, 10, `fill="${C.pad}" stroke="${C.padEdge}" stroke-width="2" rx="2"`)}` },
  smith: { doc: 'Smith machine: two vertical rails at x=96 and x=144 (bar slides between), bar height set by the pose', svg: `${bar(96, 20, 96, 210, 5)}${bar(144, 20, 144, 210, 5)}${bar(96, 20, 144, 20, 5)}` },
  pullupBar: { doc: 'pull-up bar at y=30 from x 80..160 (hands grip at y=30)', svg: `${bar(80, 30, 160, 30, 6)}${bar(80, 30, 80, 14, 4)}${bar(160, 30, 160, 14, 4)}${bar(70, 14, 170, 14, 4)}` },
  assistedPullup: { doc: 'assisted pull-up: bar at y=30 x 80..160; column and stack at x=200..224. Add `{ id: \'kneePad\', attach: \'knee\', y: 6 }`: the knee pad rises with the knees', svg: `${bar(80, 30, 160, 30, 6)}${bar(200, 14, 200, 210, 6)}${bar(160, 14, 200, 14, 5)}${bar(120, 196, 200, 196, 4, C.metal)}${stack(206, 130, 80)}` },
  backExtension: { doc: '45° back extension (person faces +x, front of the body toward the lower right): hip pad surface on the line x+y=250 from (96,154) to its top end (122,128); body line on x+y=239 with the hips just past the pad end at (124,115) and the front of the thighs on the pad; ankles ≈(73,166) with the soles on the foot plate (line x−y=−100) and the calves under the roller at (70,152). Torso hangs from the hips at the start and lines up with the legs at the top', svg: `${bar(46, 210, 170, 210, 4)}${bar(117, 150, 117, 210, 5)}${bar(72, 182, 72, 210, 5)}${bar(70, 152, 60, 172, 4, C.metal)}${pad(96, 154, 37, 12, -45)}${pad(62, 162, 41, 8, 45)}<circle cx="70" cy="152" r="7" fill="${C.pad}" stroke="${C.padEdge}" stroke-width="2"/>` },
  foamRoller: { doc: 'foam roller on the floor, center (130,196) r=14 (lies under the upper back)', svg: `<circle cx="130" cy="196" r="14" fill="${C.pad}" stroke="${C.padEdge}" stroke-width="2"/><circle cx="130" cy="196" r="4" fill="${C.padEdge}"/>` },
}

/** Highest point (smallest y) of symbols that reach above head height; the 4:3 crop never cuts above these. */
export const EQUIPMENT_TOP: Partial<Record<EquipmentId, number>> = {
  wall: 18, doorFrame: 26, chair: 98, chestPress: 48, inclinePress: 46, shoulderPress: 36, latPulldown: 10, cableHigh: 10, cableMid: 10, cableFace: 10, cableLow: 10,
  rowStation: 56, rearDeltMachine: 36, legPress: 60, hackSquat: 76, calfStanding: 36, smith: 16, pullupBar: 10, assistedPullup: 10, wallBack: 16, rearDeltFront: 26,
}

/** Loads gripped in the fist: drawn under the hand so the fingers close over the handle. */
export const LOAD_UNDER_HAND = new Set<LoadId>(['dumbbell', 'handle', 'ropeHandle', 'kettle', 'barbell', 'ezBar', 'plate'])

/** Hand-held loads drawn at the wrist. `a` = rotation in degrees. */
export function loadSvg(id: LoadId, p: Pt, a = 0, p2?: Pt): string {
  const g = (inner: string) => `<g transform="translate(${p[0]} ${p[1]}) rotate(${a})">${inner}</g>`
  switch (id) {
    case 'dumbbell': return g(`<rect x="-11" y="-3.5" width="22" height="7" rx="2" fill="${C.load}"/><rect x="-14" y="-7" width="6" height="14" rx="2" fill="${C.load}"/><rect x="8" y="-7" width="6" height="14" rx="2" fill="${C.load}"/>`)
    case 'kettle': return g(`<circle cx="0" cy="10" r="9" fill="${C.load}"/><path d="M-6 2 Q0 -8 6 2" stroke="${C.load}" stroke-width="3" fill="none"/>`)
    case 'barbell': return g(`<circle cx="0" cy="0" r="15" fill="${C.pad}" stroke="${C.load}" stroke-width="3"/><circle cx="0" cy="0" r="3" fill="${C.load}"/>`)
    case 'plate': return g(`<circle cx="0" cy="0" r="12" fill="${C.pad}" stroke="${C.load}" stroke-width="3"/>`)
    case 'ezBar': return g(`<circle cx="0" cy="0" r="10" fill="${C.pad}" stroke="${C.load}" stroke-width="3"/><rect x="-16" y="-2" width="32" height="4" rx="2" fill="${C.load}"/>`)
    case 'handle': return g(`<path d="M-7 -6 L-7 6 M7 -6 L7 6 M-7 0 L7 0" stroke="${C.load}" stroke-width="3.5" stroke-linecap="round"/>`)
    case 'ropeHandle': return g(`<path d="M0 0 L-6 10 M0 0 L6 10" stroke="${C.load}" stroke-width="3.5" stroke-linecap="round"/><circle cx="-6" cy="11" r="2.5" fill="${C.load}"/><circle cx="6" cy="11" r="2.5" fill="${C.load}"/>`)
    case 'band': return p2 ? `<line x1="${p[0]}" y1="${p[1]}" x2="${p2[0]}" y2="${p2[1]}" stroke="${C.load}" stroke-width="3.5" stroke-linecap="round"/>` : ''
  }
}
