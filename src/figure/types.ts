export type Pt = [number, number]

/** Side-view joints. +x is the direction the person faces. */
export interface SideJoints {
  head: Pt; neck: Pt; shoulder: Pt; hip: Pt
  elbow: Pt; wrist: Pt
  knee: Pt; ankle: Pt; toe: Pt
  elbow2?: Pt; wrist2?: Pt
  knee2?: Pt; ankle2?: Pt; toe2?: Pt
  /** optional control point to curve the spine (neutral = omit) */
  spine?: Pt
  /** head rotation hint: where the face points, default +x */
  face?: 'front' | 'up' | 'down' | 'back'
}
/** Front/back view joints. */
export interface FrontJoints {
  head: Pt; neck: Pt; shoulderL: Pt; shoulderR: Pt; hip: Pt
  elbowL: Pt; wristL: Pt; elbowR: Pt; wristR: Pt
  kneeL: Pt; ankleL: Pt; kneeR: Pt; ankleR: Pt
  back?: boolean
}
export type Joints = SideJoints | FrontJoints
export const isFront = (j: Joints): j is FrontJoints => 'shoulderL' in j

export type EquipmentId =
  | 'floor' | 'wall' | 'doorFrame' | 'chair' | 'box' | 'benchFlat' | 'benchIncline' | 'seat'
  | 'chestPress' | 'inclinePress' | 'shoulderPress' | 'latPulldown' | 'cableHigh' | 'cableLow' | 'cableMid' | 'cableFace'
  | 'rowStation' | 'chestSupportRow' | 'rearDeltMachine' | 'legPress' | 'legExtension' | 'legCurlSeated' | 'legCurlLying'
  | 'hackSquat' | 'calfStanding' | 'calfSeated' | 'smith' | 'pullupBar' | 'backExtension' | 'foamRoller' | 'assistedPullup'
export interface EquipmentUse { id: EquipmentId; x?: number; y?: number; s?: number; flip?: boolean; a?: number }

export type LoadId = 'dumbbell' | 'barbell' | 'ezBar' | 'band' | 'handle' | 'ropeHandle' | 'kettle' | 'plate'
export interface LoadUse { id: LoadId; at: 'wrist' | 'wrist2' | 'wristL' | 'wristR' | 'both'; a?: number }

export interface Annotation {
  /** arrow from a joint in a direction (deg, 0 = +x, 90 = down) with length */
  arrow?: { from: keyof SideJoints | keyof FrontJoints | Pt; dir: number; len?: number; curve?: number }[]
  /** muscle glow at joints or points */
  muscle?: (keyof SideJoints | keyof FrontJoints | Pt)[]
  /** draw neutral spine guide */
  spine?: boolean
  /** mistake marker (red) at a point with optional short label key */
  mistake?: { at: keyof SideJoints | keyof FrontJoints | Pt }
}

export interface Frame { joints: Joints; note?: Annotation }

export interface Figure {
  /** 'side' means the person faces +x (right). Set flip to face left. */
  view: 'side' | 'front' | 'back'
  flip?: boolean
  equipment?: EquipmentUse[]
  load?: LoadUse[]
  /** cable from a fixed point (pulley) to the hand(s) */
  cable?: { from: Pt; to: 'wrist' | 'wrist2' | 'wristL' | 'wristR' | 'both' }
  start: Frame
  end: Frame
  /** optional viewBox crop (x y w h) so small floor figures fill the frame */
  zoom?: [number, number, number, number]
  /** optional mistake frame shown when the user taps "mistake" */
  mistake?: Frame
}
