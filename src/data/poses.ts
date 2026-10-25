// Stick-figure poses. Side view unless `front: true`.
// Angles in degrees. Side view: torso measured from vertical (positive = leaning toward +x, the "front").
// Limb angles are absolute from "straight down" (0), positive toward +x. 180 = straight up. `rot` rotates the whole body around the hip.
export interface SideParams {
  hip: [number, number]
  rot?: number
  torso: number
  neck?: number
  ua: number; fa: number
  ua2?: number; fa2?: number
  thigh: number; shin: number
  thigh2?: number; shin2?: number
  foot?: number
}
export interface FrontParams {
  hip: [number, number]
  abd: number      // arm abduction from down (0) to up (180)
  elbow: number    // bend 0 = straight; positive bends forearm upward/inward
  knee?: number
  lean?: number
  front: true
}
export type Prop =
  | { t: 'floor'; y: number }
  | { t: 'wall'; x: number }
  | { t: 'bench'; x: number; y: number; w: number; h?: number; angle?: number }
  | { t: 'seat'; x: number; y: number; w?: number; back?: number; backAngle?: number }
  | { t: 'bar' }                       // plate at wrist
  | { t: 'db' }                        // dumbbell at wrist
  | { t: 'cable'; to: [number, number] }
  | { t: 'band' }
  | { t: 'roller'; x: number; y: number }
  | { t: 'box'; x: number; y: number; w: number; h: number }
  | { t: 'barOverhead'; y: number; x1: number; x2: number }
  | { t: 'door'; x: number }

export interface Pose {
  start: SideParams | FrontParams
  end: SideParams | FrontParams
  props?: Prop[]
  note?: string
}

const F = 128
const s = (p: SideParams): SideParams => p

export const POSES: Record<string, Pose> = {
  // ---- Pressing
  seatedHorizontalPress: {
    props: [{ t: 'floor', y: 170 }, { t: 'seat', x: 70, y: 118, w: 40, back: 70, backAngle: 5 }, { t: 'bar' }],
    start: s({ hip: [82, 118], torso: -5, ua: 100, fa: 30, thigh: 85, shin: -5 }),
    end: s({ hip: [82, 118], torso: -5, ua: 95, fa: 92, thigh: 85, shin: -5 }),
  },
  seatedInclinePress: {
    props: [{ t: 'floor', y: 170 }, { t: 'seat', x: 70, y: 118, w: 40, back: 72, backAngle: 30 }, { t: 'bar' }],
    start: s({ hip: [82, 118], torso: -30, ua: 110, fa: 40, thigh: 85, shin: -5 }),
    end: s({ hip: [82, 118], torso: -30, ua: 120, fa: 118, thigh: 85, shin: -5 }),
  },
  lyingPress: {
    props: [{ t: 'floor', y: 170 }, { t: 'bench', x: 20, y: 112, w: 120, h: 10 }, { t: 'db' }],
    start: s({ hip: [95, 108], rot: -90, torso: 0, ua: 100, fa: 10, thigh: 80, shin: 5 }),
    end: s({ hip: [95, 108], rot: -90, torso: 0, ua: 92, fa: 90, thigh: 80, shin: 5 }),
  },
  inclineLyingPress: {
    props: [{ t: 'floor', y: 170 }, { t: 'bench', x: 60, y: 118, w: 50, h: 10 }, { t: 'bench', x: 60, y: 118, w: 70, h: 10, angle: -40 }, { t: 'db' }],
    start: s({ hip: [88, 112], rot: -50, torso: 0, ua: 100, fa: 10, thigh: 85, shin: -10 }),
    end: s({ hip: [88, 112], rot: -50, torso: 0, ua: 92, fa: 90, thigh: 85, shin: -10 }),
  },
  pushUp: {
    props: [{ t: 'floor', y: 160 }],
    start: s({ hip: [100, 118], rot: -80, torso: 0, ua: 170, fa: 100, thigh: 0, shin: 0 }),
    end: s({ hip: [100, 136], rot: -80, torso: 0, ua: 120, fa: 20, thigh: 0, shin: 0 }),
  },
  inclinePushUp: {
    props: [{ t: 'floor', y: 165 }, { t: 'box', x: 20, y: 110, w: 40, h: 55 }],
    start: s({ hip: [112, 100], rot: -55, torso: 0, ua: 170, fa: 95, thigh: 0, shin: 0 }),
    end: s({ hip: [112, 112], rot: -55, torso: 0, ua: 120, fa: 25, thigh: 0, shin: 0 }),
  },
  seatedOverheadPress: {
    props: [{ t: 'floor', y: 170 }, { t: 'seat', x: 70, y: 118, w: 40, back: 70, backAngle: 8 }, { t: 'db' }],
    start: s({ hip: [82, 118], torso: -3, ua: 95, fa: 175, thigh: 85, shin: -5 }),
    end: s({ hip: [82, 118], torso: -3, ua: 170, fa: 178, thigh: 85, shin: -5 }),
  },
  pikePushUp: {
    props: [{ t: 'floor', y: 160 }],
    start: s({ hip: [95, 70], rot: 0, torso: 120, ua: 175, fa: 170, thigh: 0, shin: 5 }),
    end: s({ hip: [95, 70], rot: 0, torso: 130, ua: 150, fa: 100, thigh: 0, shin: 5 }),
  },
  // ---- Front view
  standingLateralRaise: {
    props: [{ t: 'floor', y: 175 }, { t: 'db' }],
    start: { hip: [100, 110], abd: 10, elbow: 10, front: true },
    end: { hip: [100, 110], abd: 88, elbow: 10, front: true },
  },
  seatedLateralRaise: {
    props: [{ t: 'floor', y: 175 }, { t: 'box', x: 80, y: 115, w: 40, h: 60 }],
    start: { hip: [100, 112], abd: 15, elbow: 70, front: true },
    end: { hip: [100, 112], abd: 85, elbow: 70, front: true },
  },
  bandPullApart: {
    props: [{ t: 'floor', y: 175 }, { t: 'band' }],
    start: { hip: [100, 110], abd: 90, elbow: 150, front: true },
    end: { hip: [100, 110], abd: 92, elbow: 5, front: true },
  },
  wallAngel: {
    props: [{ t: 'floor', y: 175 }],
    start: { hip: [100, 110], abd: 90, elbow: 90, front: true },
    end: { hip: [100, 110], abd: 160, elbow: 15, front: true },
  },
  pallofPress: {
    props: [{ t: 'floor', y: 175 }, { t: 'cable', to: [10, 95] }],
    start: { hip: [100, 110], abd: 20, elbow: 150, front: true },
    end: { hip: [100, 110], abd: 20, elbow: 150, front: true, lean: 0 },
    note: 'press-out',
  },
  // ---- Pulling
  seatedVerticalPull: {
    props: [{ t: 'floor', y: 170 }, { t: 'seat', x: 70, y: 118, w: 40 }, { t: 'cable', to: [112, 10] }, { t: 'barOverhead', y: 12, x1: 95, x2: 130 }],
    start: s({ hip: [82, 118], torso: 8, ua: 175, fa: 178, thigh: 85, shin: -5 }),
    end: s({ hip: [82, 118], torso: 12, ua: -30, fa: 150, thigh: 85, shin: -5 }),
  },
  hangingPull: {
    props: [{ t: 'barOverhead', y: 14, x1: 60, x2: 140 }],
    start: s({ hip: [100, 118], torso: 0, ua: 178, fa: 180, thigh: 5, shin: -10 }),
    end: s({ hip: [100, 110], torso: 0, ua: 170, fa: 180, thigh: 5, shin: -10 }),
  },
  standingStraightArmPull: {
    props: [{ t: 'floor', y: 175 }, { t: 'cable', to: [160, 20] }],
    start: s({ hip: [80, 112], torso: 20, ua: 150, fa: 150, thigh: 5, shin: 0 }),
    end: s({ hip: [80, 112], torso: 20, ua: 20, fa: 20, thigh: 5, shin: 0 }),
  },
  chestSupportedRow: {
    props: [{ t: 'floor', y: 170 }, { t: 'bench', x: 60, y: 120, w: 50, h: 10 }, { t: 'bench', x: 70, y: 120, w: 80, h: 10, angle: -45 }, { t: 'db' }],
    start: s({ hip: [86, 118], torso: 45, ua: 10, fa: 5, thigh: 85, shin: -5 }),
    end: s({ hip: [86, 118], torso: 45, ua: -70, fa: 20, thigh: 85, shin: -5 }),
  },
  seatedCableRow: {
    props: [{ t: 'floor', y: 170 }, { t: 'seat', x: 60, y: 122, w: 40 }, { t: 'cable', to: [185, 100] }],
    start: s({ hip: [75, 122], torso: 15, ua: 80, fa: 85, thigh: 80, shin: 70 }),
    end: s({ hip: [75, 122], torso: -3, ua: -40, fa: 70, thigh: 80, shin: 70 }),
  },
  bentOverRow: {
    props: [{ t: 'floor', y: 170 }, { t: 'bench', x: 110, y: 118, w: 60, h: 10 }, { t: 'db' }],
    start: s({ hip: [70, 100], torso: 75, ua: 20, fa: 20, ua2: 90, fa2: 20, thigh: 10, shin: -5, thigh2: 50, shin2: 30 }),
    end: s({ hip: [70, 100], torso: 75, ua: -60, fa: 30, ua2: 90, fa2: 20, thigh: 10, shin: -5, thigh2: 50, shin2: 30 }),
  },
  invertedRow: {
    props: [{ t: 'floor', y: 165 }, { t: 'barOverhead', y: 60, x1: 60, x2: 160 }],
    start: s({ hip: [110, 140], rot: -95, torso: 0, ua: 95, fa: 100, thigh: 0, shin: 0 }),
    end: s({ hip: [110, 125], rot: -95, torso: 0, ua: 30, fa: 100, thigh: 0, shin: 0 }),
  },
  seatedRearFly: {
    props: [{ t: 'floor', y: 170 }, { t: 'seat', x: 70, y: 118, w: 40, back: 60, backAngle: 0 }],
    start: s({ hip: [95, 118], torso: 0, ua: 90, fa: 90, thigh: -85, shin: 5 }),
    end: s({ hip: [95, 118], torso: 0, ua: -20, fa: -20, thigh: -85, shin: 5 }),
  },
  bentOverRearFly: {
    props: [{ t: 'floor', y: 170 }, { t: 'db' }],
    start: s({ hip: [90, 100], torso: 70, ua: 20, fa: 20, thigh: 10, shin: 0 }),
    end: s({ hip: [90, 100], torso: 70, ua: -60, fa: -60, thigh: 10, shin: 0 }),
  },
  standingRearFly: {
    props: [{ t: 'floor', y: 175 }, { t: 'cable', to: [170, 60] }],
    start: s({ hip: [80, 112], torso: 5, ua: 95, fa: 95, thigh: 0, shin: 0 }),
    end: s({ hip: [80, 112], torso: 5, ua: 20, fa: 20, thigh: 0, shin: 0 }),
  },
  facePull: {
    props: [{ t: 'floor', y: 175 }, { t: 'cable', to: [180, 70] }],
    start: s({ hip: [75, 112], torso: 5, ua: 90, fa: 90, thigh: 5, shin: 0 }),
    end: s({ hip: [75, 112], torso: 5, ua: 95, fa: 170, thigh: 5, shin: 0 }),
  },
  // ---- Arms
  standingCurl: {
    props: [{ t: 'floor', y: 175 }, { t: 'db' }],
    start: s({ hip: [100, 112], torso: 0, ua: 5, fa: 10, thigh: 0, shin: 0 }),
    end: s({ hip: [100, 112], torso: 0, ua: 5, fa: 140, thigh: 0, shin: 0 }),
  },
  standingPushdown: {
    props: [{ t: 'floor', y: 175 }, { t: 'cable', to: [120, 10] }],
    start: s({ hip: [95, 112], torso: 8, ua: 15, fa: 100, thigh: 0, shin: 0 }),
    end: s({ hip: [95, 112], torso: 8, ua: 15, fa: 10, thigh: 0, shin: 0 }),
  },
  benchDip: {
    props: [{ t: 'floor', y: 170 }, { t: 'box', x: 20, y: 110, w: 50, h: 60 }],
    start: s({ hip: [95, 120], torso: -10, ua: -165, fa: -175, thigh: 80, shin: 0 }),
    end: s({ hip: [95, 140], torso: -10, ua: -130, fa: -175, thigh: 80, shin: 0 }),
  },
  kickback: {
    props: [{ t: 'floor', y: 170 }, { t: 'bench', x: 110, y: 118, w: 60, h: 10 }, { t: 'db' }],
    start: s({ hip: [70, 100], torso: 75, ua: -40, fa: 40, ua2: 90, fa2: 20, thigh: 10, shin: -5, thigh2: 50, shin2: 30 }),
    end: s({ hip: [70, 100], torso: 75, ua: -40, fa: -40, ua2: 90, fa2: 20, thigh: 10, shin: -5, thigh2: 50, shin2: 30 }),
  },
  overheadExtension: {
    props: [{ t: 'floor', y: 175 }, { t: 'db' }],
    start: s({ hip: [100, 112], torso: 0, ua: 175, fa: 90, thigh: 0, shin: 0 }),
    end: s({ hip: [100, 112], torso: 0, ua: 175, fa: 178, thigh: 0, shin: 0 }),
  },
  skullCrusher: {
    props: [{ t: 'floor', y: 170 }, { t: 'bench', x: 20, y: 112, w: 120, h: 10 }, { t: 'bar' }],
    start: s({ hip: [95, 108], rot: -90, torso: 0, ua: 100, fa: 190, thigh: 80, shin: 5 }),
    end: s({ hip: [95, 108], rot: -90, torso: 0, ua: 100, fa: 100, thigh: 80, shin: 5 }),
  },
  // ---- Legs
  legPress: {
    props: [{ t: 'floor', y: 170 }, { t: 'seat', x: 40, y: 120, w: 40, back: 60, backAngle: 40 }, { t: 'bench', x: 130, y: 40, w: 70, h: 8, angle: 70 }],
    start: s({ hip: [58, 118], torso: -40, ua: 0, fa: 0, thigh: 150, shin: 95 }),
    end: s({ hip: [58, 118], torso: -40, ua: 0, fa: 0, thigh: 125, shin: 130 }),
  },
  squat: {
    props: [{ t: 'floor', y: 175 }, { t: 'db' }],
    start: s({ hip: [100, 110], torso: 5, ua: 50, fa: 140, thigh: 5, shin: 0 }),
    end: s({ hip: [92, 140], torso: 30, ua: 60, fa: 150, thigh: 80, shin: -20 }),
  },
  hackSquat: {
    props: [{ t: 'floor', y: 175 }, { t: 'bench', x: 50, y: 170, w: 120, h: 8, angle: -55 }],
    start: s({ hip: [95, 95], rot: -35, torso: 0, ua: 170, fa: 150, thigh: 10, shin: 0 }),
    end: s({ hip: [80, 115], rot: -35, torso: 0, ua: 170, fa: 150, thigh: 80, shin: -30 }),
  },
  legExtension: {
    props: [{ t: 'floor', y: 170 }, { t: 'seat', x: 60, y: 118, w: 45, back: 65, backAngle: 10 }],
    start: s({ hip: [75, 118], torso: -10, ua: 20, fa: 30, thigh: 85, shin: -10 }),
    end: s({ hip: [75, 118], torso: -10, ua: 20, fa: 30, thigh: 85, shin: 80 }),
  },
  splitSquat: {
    props: [{ t: 'floor', y: 175 }, { t: 'db' }],
    start: s({ hip: [100, 108], torso: 5, ua: 0, fa: 0, thigh: 20, shin: 10, thigh2: -25, shin2: -40 }),
    end: s({ hip: [100, 132], torso: 8, ua: 0, fa: 0, thigh: 80, shin: -10, thigh2: -50, shin2: -70 }),
  },
  wallSit: {
    props: [{ t: 'floor', y: 175 }, { t: 'wall', x: 60 }],
    start: s({ hip: [66, 120], torso: 0, ua: 0, fa: 0, thigh: 90, shin: 0 }),
    end: s({ hip: [66, 120], torso: 0, ua: 0, fa: 0, thigh: 90, shin: 0 }),
  },
  stepUp: {
    props: [{ t: 'floor', y: 175 }, { t: 'box', x: 110, y: 130, w: 60, h: 45 }, { t: 'db' }],
    start: s({ hip: [85, 112], torso: 10, ua: 0, fa: 0, thigh: 0, shin: 0, thigh2: 70, shin2: -20 }),
    end: s({ hip: [128, 70], torso: 5, ua: 0, fa: 0, thigh: 0, shin: 0, thigh2: -15, shin2: -5 }),
  },
  standingCalfRaise: {
    props: [{ t: 'floor', y: 175 }, { t: 'box', x: 80, y: 165, w: 40, h: 10 }],
    start: s({ hip: [100, 108], torso: 0, ua: 0, fa: 0, thigh: 0, shin: 0, foot: 0 }),
    end: s({ hip: [100, 98], torso: 0, ua: 0, fa: 0, thigh: 0, shin: 0, foot: -40 }),
  },
  seatedCalfRaise: {
    props: [{ t: 'floor', y: 170 }, { t: 'seat', x: 60, y: 118, w: 45 }],
    start: s({ hip: [75, 118], torso: 5, ua: 60, fa: 110, thigh: 85, shin: -5, foot: 0 }),
    end: s({ hip: [75, 118], torso: 5, ua: 60, fa: 110, thigh: 80, shin: -5, foot: -40 }),
  },
  legPressCalf: {
    props: [{ t: 'floor', y: 170 }, { t: 'seat', x: 40, y: 120, w: 40, back: 60, backAngle: 40 }, { t: 'bench', x: 130, y: 40, w: 70, h: 8, angle: 70 }],
    start: s({ hip: [58, 118], torso: -40, ua: 0, fa: 0, thigh: 150, shin: 95, foot: 0 }),
    end: s({ hip: [58, 118], torso: -40, ua: 0, fa: 0, thigh: 150, shin: 95, foot: -40 }),
  },
  seatedLegCurl: {
    props: [{ t: 'floor', y: 170 }, { t: 'seat', x: 60, y: 118, w: 45, back: 65, backAngle: 15 }],
    start: s({ hip: [75, 118], torso: -15, ua: 20, fa: 30, thigh: 85, shin: 80 }),
    end: s({ hip: [75, 118], torso: -15, ua: 20, fa: 30, thigh: 85, shin: -10 }),
  },
  lyingLegCurl: {
    props: [{ t: 'floor', y: 170 }, { t: 'bench', x: 20, y: 118, w: 130, h: 10 }],
    start: s({ hip: [100, 112], rot: 90, torso: 0, ua: 100, fa: 100, thigh: 0, shin: 0 }),
    end: s({ hip: [100, 112], rot: 90, torso: 0, ua: 100, fa: 100, thigh: 0, shin: -120 }),
  },
  sliderLegCurl: {
    props: [{ t: 'floor', y: 165 }],
    start: s({ hip: [90, 135], rot: -90, torso: 0, ua: 0, fa: 0, thigh: 20, shin: 10 }),
    end: s({ hip: [90, 135], rot: -90, torso: 0, ua: 0, fa: 0, thigh: 20, shin: -60 }),
  },
  rdl: {
    props: [{ t: 'floor', y: 175 }, { t: 'bar' }],
    start: s({ hip: [100, 110], torso: 5, ua: 0, fa: 0, thigh: 0, shin: 0 }),
    end: s({ hip: [88, 108], torso: 70, ua: -70, fa: -70, thigh: -10, shin: 8 }),
  },
  pullThrough: {
    props: [{ t: 'floor', y: 175 }, { t: 'cable', to: [10, 160] }],
    start: s({ hip: [110, 110], torso: 5, ua: -5, fa: -5, thigh: 0, shin: 0 }),
    end: s({ hip: [95, 108], torso: 65, ua: -80, fa: -80, thigh: -10, shin: 8 }),
  },
  backExtension: {
    props: [{ t: 'floor', y: 175 }, { t: 'bench', x: 40, y: 175, w: 90, h: 10, angle: -45 }],
    start: s({ hip: [95, 100], rot: 0, torso: 45, ua: 130, fa: 160, thigh: -45, shin: -45 }),
    end: s({ hip: [95, 100], rot: 0, torso: 120, ua: 130, fa: 160, thigh: -45, shin: -45 }),
  },
  // ---- Core
  deadBug: {
    props: [{ t: 'floor', y: 160 }],
    start: s({ hip: [100, 150], rot: -90, torso: 0, ua: 90, fa: 90, thigh: 90, shin: 0 }),
    end: s({ hip: [100, 150], rot: -90, torso: 0, ua: 170, fa: 170, thigh: 20, shin: -10 }),
  },
  plank: {
    props: [{ t: 'floor', y: 160 }],
    start: s({ hip: [100, 125], rot: -82, torso: 0, ua: 160, fa: 95, thigh: 0, shin: 0 }),
    end: s({ hip: [100, 125], rot: -82, torso: 0, ua: 160, fa: 95, thigh: 0, shin: 0 }),
  },
  birdDog: {
    props: [{ t: 'floor', y: 160 }],
    start: s({ hip: [110, 110], rot: -90, torso: 0, ua: 90, fa: 90, ua2: 90, fa2: 90, thigh: 90, shin: 90, thigh2: 90, shin2: 90 }),
    end: s({ hip: [110, 110], rot: -90, torso: 0, ua: 180, fa: 180, ua2: 90, fa2: 90, thigh: 90, shin: 90, thigh2: -5, shin2: -5 }),
  },
  sidePlank: {
    props: [{ t: 'floor', y: 160 }],
    start: s({ hip: [100, 140], rot: -75, torso: 0, ua: 160, fa: 95, thigh: 0, shin: 0 }),
    end: s({ hip: [100, 125], rot: -75, torso: 0, ua: 160, fa: 95, thigh: 0, shin: 0 }),
  },
  // ---- Posture
  chinTuck: {
    props: [{ t: 'floor', y: 175 }],
    start: s({ hip: [100, 112], torso: 0, neck: 35, ua: 0, fa: 0, thigh: 0, shin: 0 }),
    end: s({ hip: [100, 112], torso: 0, neck: -5, ua: 0, fa: 0, thigh: 0, shin: 0 }),
  },
  doorwayStretch: {
    props: [{ t: 'floor', y: 175 }, { t: 'door', x: 120 }],
    start: s({ hip: [100, 112], torso: 0, ua: 95, fa: 175, thigh: 0, shin: 0 }),
    end: s({ hip: [100, 112], torso: 12, ua: 75, fa: 170, thigh: 15, shin: 0 }),
  },
  tspineRoller: {
    props: [{ t: 'floor', y: 165 }, { t: 'roller', x: 115, y: 150 }],
    start: s({ hip: [90, 150], rot: -90, torso: 15, ua: 170, fa: 100, thigh: 80, shin: 0 }),
    end: s({ hip: [90, 150], rot: -90, torso: -25, ua: 170, fa: 100, thigh: 80, shin: 0 }),
  },
  tspineChair: {
    props: [{ t: 'floor', y: 170 }, { t: 'seat', x: 60, y: 118, w: 45, back: 50, backAngle: 0 }],
    start: s({ hip: [85, 118], torso: -5, ua: 160, fa: 90, thigh: 85, shin: -5 }),
    end: s({ hip: [85, 118], torso: -35, neck: -20, ua: 160, fa: 90, thigh: 85, shin: -5 }),
  },
  catCow: {
    props: [{ t: 'floor', y: 160 }],
    start: s({ hip: [110, 110], rot: -90, torso: 12, neck: 30, ua: 90, fa: 90, thigh: 90, shin: 90 }),
    end: s({ hip: [110, 110], rot: -90, torso: -12, neck: -30, ua: 90, fa: 90, thigh: 90, shin: 90 }),
  },
  proneYTW: {
    props: [{ t: 'floor', y: 160 }],
    start: s({ hip: [100, 150], rot: 90, torso: 0, ua: 150, fa: 150, thigh: 0, shin: 0 }),
    end: s({ hip: [100, 150], rot: 90, torso: 0, ua: 135, fa: 135, thigh: 0, shin: 0 }),
  },
  latStretch: {
    props: [{ t: 'floor', y: 175 }, { t: 'wall', x: 160 }],
    start: s({ hip: [100, 112], torso: 10, ua: 150, fa: 150, thigh: 0, shin: 0 }),
    end: s({ hip: [80, 118], torso: 60, ua: 120, fa: 120, thigh: 10, shin: 0 }),
  },
}

export const FIGURE_SIZE = F
