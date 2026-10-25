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
  /** head tilt in degrees on top of `face`: positive lifts the chin, negative tucks it (nods down) */
  headTilt?: number
}
/** Front/back view joints. */
export interface FrontJoints {
  head: Pt; neck: Pt; shoulderL: Pt; shoulderR: Pt; hip: Pt
  elbowL: Pt; wristL: Pt; elbowR: Pt; wristR: Pt
  kneeL: Pt; ankleL: Pt; kneeR: Pt; ankleR: Pt
  back?: boolean
}
export type JointName = Exclude<keyof SideJoints | keyof FrontJoints, 'face' | 'back' | 'headTilt'>
export type Joints = SideJoints | FrontJoints
export const isFront = (j: Joints): j is FrontJoints => 'shoulderL' in j

export type EquipmentId =
  | 'floor' | 'wall' | 'doorFrame' | 'chair' | 'box' | 'benchFlat' | 'benchIncline' | 'seat'
  | 'chestPress' | 'inclinePress' | 'shoulderPress' | 'latPulldown' | 'cableHigh' | 'cableLow' | 'cableMid' | 'cableFace'
  | 'rowStation' | 'chestSupportRow' | 'rearDeltMachine' | 'legPress' | 'legExtension' | 'legCurlSeated' | 'legCurlLying'
  | 'hackSquat' | 'calfStanding' | 'calfSeated' | 'smith' | 'pullupBar' | 'backExtension' | 'foamRoller' | 'assistedPullup'
  | 'legPressSled' | 'kneePad' | 'wallBack' | 'benchEnd' | 'rearDeltFront'
export interface EquipmentUse {
  id: EquipmentId; x?: number; y?: number; s?: number; flip?: boolean; a?: number
  /** pin the symbol's origin to this joint so it moves with the body (x/y then offset from the joint) */
  attach?: JointName
}

/** Rigid machine arm from a fixed pivot to a joint (the hand on a handle, the ankle on a roller pad). */
export interface Lever {
  pivot: Pt
  to: JointName
  /** what sits at the joint end: a vertical grip handle (default), a foam roller pad, or nothing */
  end?: 'handle' | 'roller' | 'none'
  /** offset of the end from the joint, e.g. a roller pad in front of the shin */
  off?: Pt
}

export type LoadId = 'dumbbell' | 'barbell' | 'ezBar' | 'band' | 'handle' | 'ropeHandle' | 'kettle' | 'plate'
export interface LoadUse {
  id: LoadId; at: 'wrist' | 'wrist2' | 'wristL' | 'wristR' | 'both'; a?: number
  /** draw behind the torso and head (a bar resting on the upper back) */
  behind?: boolean
}

export interface Annotation {
  /** arrow from a joint in a direction (deg, 0 = +x, 90 = down) with length */
  arrow?: { from: JointName | Pt; dir: number; len?: number; curve?: number }[]
  /** muscle glow at joints or points */
  muscle?: (JointName | Pt)[]
  /** draw neutral spine guide */
  spine?: boolean
  /** mistake marker (red) at a point with optional short label key */
  mistake?: { at: JointName | Pt }
}

export interface Frame { joints: Joints; note?: Annotation }

export interface Figure {
  /** 'side' means the person faces +x (right). Set flip to face left. */
  view: 'side' | 'front' | 'back'
  flip?: boolean
  equipment?: EquipmentUse[]
  load?: LoadUse[]
  /** cable from a fixed point (pulley) to the hand(s) */
  cable?: { from: Pt; to: 'wrist' | 'wrist2' | 'wristL' | 'wristR' | 'both'; behind?: boolean }
  /** rigid machine arms drawn from a fixed pivot to a joint, behind the body */
  lever?: Lever[]
  start: Frame
  end: Frame
  /** optional viewBox crop (x y w h) so small floor figures fill the frame */
  zoom?: [number, number, number, number]
  /** optional mistake frame shown when the user taps "mistake" */
  mistake?: Frame
}
