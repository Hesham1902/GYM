import type { EquipmentId, LoadId, Pt } from './types.ts'

// Palette (dark UI). Equipment is mid grey, pads darker, frame lines light grey.
export const C = {
  frame: '#9ca3af', pad: '#3f3f46', padEdge: '#71717a', metal: '#52525b', floor: '#52525b',
  body: '#e4e4e7', bodyBack: '#9f9fa9', outline: '#09090b', load: '#22c55e', accent: '#22c55e', warn: '#f59e0b', danger: '#ef4444', info: '#38bdf8',
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
  benchIncline: { doc: 'incline bench: seat top y=150 x 120..160; back pad from (120,150) rising to (70,95) (≈45°); head rests near (75,100); feet on floor x≈180', svg: `${pad(120, 150, 40, 10)}${pad(116, 150, 10, 76, -48)}${post(140, 160)}${post(90, 150)}` },
  seat: { doc: 'upright seat top y=150 x 88..132, back pad x≈86..94 from y=90 to 150 (slight recline); feet on floor x≈130', svg: `${pad(88, 150, 44, 10)}${pad(84, 90, 10, 62, -6)}${post(110, 160)}` },
  chestPress: { doc: 'chest press: seat top y=150 x 88..132; back pad x 84..94 (y 88..150); handle grip at (150,118) start → (190,118) end; weight stack at x 206..224', svg: `${pad(88, 150, 44, 10)}${pad(84, 88, 10, 64)}${post(110, 160)}${bar(150, 70, 150, 118, 4)}${bar(150, 70, 200, 70, 5)}${bar(200, 70, 200, 210, 5)}${stack(206, 130, 80)}${pulley(150, 70)}` },
  inclinePress: { doc: 'incline press machine: seat top y=150 x 100..140; back pad reclined 30° from (96,150) up to (74,92); handle grip start (140,100) → end (172,72) (up-forward); stack at x 206..224', svg: `${pad(100, 150, 40, 10)}${pad(96, 150, 10, 66, -30 + 180)}${post(120, 160)}${bar(165, 60, 165, 100, 4)}${bar(165, 60, 200, 60, 5)}${bar(200, 60, 200, 210, 5)}${stack(206, 130, 80)}` },
  shoulderPress: { doc: 'shoulder press machine: seat top y=150 x 88..132; back pad x 84..94 y 85..150; handles at shoulder height start (122,100) → overhead end (122,52); stack x 206..224', svg: `${pad(88, 150, 44, 10)}${pad(84, 85, 10, 67)}${post(110, 160)}${bar(160, 40, 160, 110, 4)}${bar(160, 40, 200, 40, 5)}${bar(200, 40, 200, 210, 5)}${stack(206, 130, 80)}${bar(122, 48, 160, 48, 4)}` },
  latPulldown: { doc: 'lat pulldown: seat top y=150 x 96..136; knee pad at (140,122) over thighs; high pulley at (150,22); bar hangs at y≈50 start (hands at (150,50)) → pulled to chest y≈100 end; column at x=190', svg: `${pad(96, 150, 40, 10)}${post(116, 160)}${pad(128, 118, 30, 8)}${bar(190, 14, 190, 210, 5)}${bar(150, 14, 190, 14, 5)}${pulley(150, 22)}${bar(150, 27, 150, 46, 2, C.frame)}${bar(120, 46, 180, 46, 4)}${stack(196, 130, 80)}` },
  cableHigh: { doc: 'cable column at x=200 with pulley at (200,40); cable runs from pulley to the hand', svg: `${bar(200, 14, 200, 210, 6)}${pulley(200, 40)}${stack(206, 130, 80)}` },
  cableMid: { doc: 'cable column at x=200 with pulley at chest height (200,105)', svg: `${bar(200, 14, 200, 210, 6)}${pulley(200, 105)}${stack(206, 130, 80)}` },
  cableFace: { doc: 'cable column at x=200 with pulley at face height (200,80)', svg: `${bar(200, 14, 200, 210, 6)}${pulley(200, 80)}${stack(206, 130, 80)}` },
  cableLow: { doc: 'cable column at x=200 with low pulley at (200,195)', svg: `${bar(200, 14, 200, 210, 6)}${pulley(200, 195)}${stack(206, 130, 80)}` },
  rowStation: { doc: 'seated cable row: seat top y=150 x 70..110 (person sits facing +x), foot plate at x=150 (angled), low pulley at (200,130)', svg: `${pad(70, 150, 40, 10)}${post(90, 160)}${pad(150, 130, 8, 50, 20)}${bar(200, 60, 200, 210, 6)}${pulley(200, 130)}${stack(206, 140, 70)}${bar(60, 158, 200, 158, 3)}` },
  chestSupportRow: { doc: 'chest-supported row: incline chest pad from (110,150) rising to (80,96) (person lies chest-down on it facing +x, head near (76,92)); seat/foot step at y=170 x 120..160; handles hang below pad at (118,150) start → (104,118) end', svg: `${pad(106, 150, 10, 66, -36 + 180)}${pad(120, 170, 40, 8)}${post(100, 150)}${post(140, 178)}` },
  rearDeltMachine: { doc: 'rear delt (reverse pec deck): seat top y=150 x 88..132; chest pad x 128..138 y 92..150 (person faces +x, chest on pad); handle arms pivot at (150,70), handles start in front at (160,105) → end out to the side (hidden)', svg: `${pad(88, 150, 44, 10)}${pad(128, 92, 10, 60)}${post(110, 160)}${bar(150, 40, 150, 70, 4)}${bar(150, 40, 200, 40, 5)}${bar(200, 40, 200, 210, 5)}${stack(206, 130, 80)}` },
  legPress: { doc: '45° leg press sled: seat pad from (50,165) rising slightly to the right (hips sit at ≈(72,150)); back pad from (50,165) up-left to ≈(14,112) (person leans back on it, head near (18,100), faces up-right); foot plate perpendicular to the legs from (150,60) down-right to (214,124) (feet flat on it, start: knees bent ≈90°, end: legs nearly straight toward up-right); rails run parallel to the legs behind the plate', svg: `${bar(110, 185, 206, 89, 4, C.metal)}${bar(122, 197, 218, 101, 4, C.metal)}${pad(50, 165, 44, 10, -20)}${pad(50, 165, 10, 72, 130)}${post(70, 168)}${post(100, 160)}${pad(150, 60, 10, 90, -45)}<circle cx="198" cy="76" r="11" fill="${C.pad}" stroke="${C.frame}" stroke-width="3"/>` },
  legExtension: { doc: 'leg extension: seat top y=150 x 86..130 (person sits facing +x), back pad x 82..92 y 95..150; shin pad start hanging below knee at (140,195) → end extended at (184,150)', svg: `${pad(86, 150, 44, 10)}${pad(82, 95, 10, 57, -5)}${post(108, 160)}${post(130, 160)}` },
  legCurlSeated: { doc: 'seated leg curl: seat top y=150 x 86..130, back pad x 82..92 y 95..150; thigh lock pad at (118,124); ankle pad start extended at (184,150) → end curled under at (130,190)', svg: `${pad(86, 150, 44, 10)}${pad(82, 95, 10, 57, -5)}${post(108, 160)}${pad(110, 118, 24, 8)}` },
  legCurlLying: { doc: 'lying leg curl: bench top y=150 x 40..200, person lies face-down with head at left (x≈60), hips x≈130; ankle pad start at (195,150) → end curled up at (150,100)', svg: `${pad(40, 150, 160, 10)}${post(60, 160)}${post(180, 160)}${bar(190, 160, 190, 120, 4)}` },
  hackSquat: { doc: 'hack squat: back pad angled 60° from (130,190) up-left to (80,100) (person leans back on it, faces +x), shoulder pads at top; foot plate from (150,200) to (210,165) (angled 30°); standing start (hips at ≈(118,120)) → squat end (hips lower-left ≈(100,150))', svg: `${pad(126, 190, 10, 104, -60 + 180)}${pad(150, 200, 70, 10, -30)}${post(140, 195)}${bar(60, 80, 60, 210, 5)}` },
  calfStanding: { doc: 'standing calf machine: shoulder pads at y≈75 (x 100..140), step/block top y=200 x 100..150 (balls of feet on its edge at x≈150); frame post at x=70', svg: `${bar(70, 40, 70, 210, 6)}${bar(70, 40, 150, 40, 5)}${pad(100, 70, 44, 10)}${bar(120, 44, 120, 70, 4)}${r(100, 200, 50, 10, `fill="${C.pad}" stroke="${C.padEdge}" stroke-width="2" rx="2"`)}` },
  calfSeated: { doc: 'seated calf raise: seat top y=150 x 70..110; knee pad at (120,122) on thighs; foot block top y=200 x 120..150', svg: `${pad(70, 150, 40, 10)}${post(90, 160)}${pad(110, 116, 30, 8)}${r(120, 200, 32, 10, `fill="${C.pad}" stroke="${C.padEdge}" stroke-width="2" rx="2"`)}` },
  smith: { doc: 'Smith machine: two vertical rails at x=96 and x=144 (bar slides between), bar height set by the pose', svg: `${bar(96, 20, 96, 210, 5)}${bar(144, 20, 144, 210, 5)}${bar(96, 20, 144, 20, 5)}` },
  pullupBar: { doc: 'pull-up bar at y=30 from x 80..160 (hands grip at y=30)', svg: `${bar(80, 30, 160, 30, 6)}${bar(80, 30, 80, 14, 4)}${bar(160, 30, 160, 14, 4)}${bar(70, 14, 170, 14, 4)}` },
  assistedPullup: { doc: 'assisted pull-up: bar at y=30 x 80..160; knee pad at y=150 x 100..140 (person kneels on it); stack at x=206', svg: `${bar(80, 30, 160, 30, 6)}${bar(200, 14, 200, 210, 6)}${bar(160, 14, 200, 14, 5)}${pad(100, 150, 40, 10)}${post(120, 160)}${stack(206, 130, 80)}` },
  backExtension: { doc: '45° back extension: hip pad top at (120,130) angled 45° (hips rest on it, person faces +x, feet lower-left locked at (70,185))', svg: `${pad(100, 150, 40, 12, -45)}${pad(60, 180, 30, 8)}${post(90, 160)}${post(120, 170)}${bar(60, 195, 130, 150, 4, C.metal)}` },
  foamRoller: { doc: 'foam roller on the floor, center (130,196) r=14 (lies under the upper back)', svg: `<circle cx="130" cy="196" r="14" fill="${C.pad}" stroke="${C.padEdge}" stroke-width="2"/><circle cx="130" cy="196" r="4" fill="${C.padEdge}"/>` },
}

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
