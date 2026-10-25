export type Lang = 'en' | 'ar'
export interface L10n { en: string; ar: string }

export type MuscleGroup =
  | 'chest' | 'upperBack' | 'lats' | 'shoulders' | 'rearDelts' | 'biceps' | 'triceps'
  | 'quads' | 'hamstrings' | 'glutes' | 'calves' | 'core' | 'forearms' | 'neck'
export type Equipment = 'machine' | 'cable' | 'dumbbell' | 'barbell' | 'smith' | 'band' | 'bodyweight' | 'foamRoller'
export type Pattern =
  | 'horizontalPush' | 'verticalPush' | 'horizontalPull' | 'verticalPull'
  | 'squat' | 'hinge' | 'isolation' | 'core' | 'mobility'
export type DayKind = 'upperA' | 'lowerA' | 'recovery' | 'upperB' | 'lowerB' | 'rest'
export type Difficulty = 1 | 2 | 3

export interface Mistake { avoid: L10n; fix: L10n }

export interface CoachingGuide {
  setup: L10n[]
  execution: L10n[]
  targetPrimary: MuscleGroup[]
  targetSecondary: MuscleGroup[]
  breathing: L10n
  mistakes: Mistake[]
  greenFlags: L10n[]
  safety: L10n[]
  startingWeight: L10n
  kyphosisCue?: L10n
}

export interface AlternativeRef {
  exerciseId: string
  differs: L10n
  chooseWhen: L10n
}

export type ExerciseKind = 'strength' | 'posture'
export type LoadType = 'weight' | 'bodyweight' | 'time'

export interface Exercise {
  id: string
  kind: ExerciseKind
  name: L10n
  termEn: string
  muscles: MuscleGroup[]
  equipment: Equipment
  pattern: Pattern
  difficulty: Difficulty
  postureFocus: boolean
  isCompound: boolean
  unilateral: boolean
  loadType: LoadType
  repRange: [number, number]
  weightStep: 2.5 | 5
  videoUrl: string
  poseId: string
  guide: CoachingGuide
  alternatives: AlternativeRef[]
}

export interface ProgramSlot {
  slotId: string
  exerciseId: string
  repRange: [number, number]
  firstCompound: boolean
}

export interface ProgramDay {
  kind: DayKind
  name: L10n
  slots: ProgramSlot[]
  postureRoutineIds: string[]
}

export type PostureStepMode = 'hold' | 'reps' | 'breaths'
export interface PostureStep {
  exerciseId: string
  mode: PostureStepMode
  seconds?: number
  reps?: number
  sides: boolean
  rounds: number
  cue: L10n
}
export interface PostureRoutine {
  id: string
  name: L10n
  context: 'home' | 'gymPre' | 'gymPost'
  minutes: number
  steps: PostureStep[]
}

export interface PostureTip { id: string; title: L10n; body: L10n; context: 'lift' | 'desk' | 'daily' }

export type FormRating = 'good' | 'ok' | 'poor'
export type PainLevel = 0 | 1 | 2
export type Decision = 'up' | 'hold' | 'down' | 'new'

export interface LoggedSet {
  id: string
  slotId: string
  exerciseId: string
  setIndex: number
  weight: number
  reps: number
  rir: number
  form: FormRating
  pain: PainLevel
  isWarmup: boolean
  loggedAt: number
}

export interface SetPrescription {
  sets: number
  repRange: [number, number]
  targetRir: number
  suggestedWeight: number | null
  suggestedReps: number | null
  decision: Decision
  reason: L10n
  lastTime: LoggedSet[] | null
}

export type SwapReason = 'busy' | 'missing' | 'discomfort' | 'other'
export interface SwapRecord { slotId: string; from: string; to: string; reason: SwapReason; permanent: boolean; at: number }
export interface SkipRecord { slotId: string; exerciseId: string; reason: string; at: number }

export interface RestTimerState { endsAt: number; durationMs: number; slotId: string; notified: boolean }

export interface ActiveSlot { slotId: string; exerciseId: string; prescription: SetPrescription }

export interface ActiveWorkout {
  id: string
  dayKind: DayKind
  week: number
  startedAt: number
  slots: ActiveSlot[]
  sets: LoggedSet[]
  swaps: SwapRecord[]
  skips: SkipRecord[]
  currentSlotId: string
  restTimer: RestTimerState | null
  postureDone: boolean
  notes: string
  updatedAt: number
}

export interface PrRecord { exerciseId: string; weight: number; reps: number; est1rm: number; kind: 'weight' | 'est1rm' }

export interface WorkoutSession {
  id: string
  dateKey: string
  dayKind: DayKind
  week: number
  startedAt: number
  endedAt: number | null
  status: 'done' | 'unfinished'
  sets: LoggedSet[]
  swaps: SwapRecord[]
  skips: SkipRecord[]
  volumeKg: number
  setCount: number
  prs: PrRecord[]
  postureDone: boolean
  notes: string
}

export interface ExerciseSetRow {
  id: string
  sessionId: string
  exerciseId: string
  loggedAt: number
  setIndex: number
  weight: number
  reps: number
  rir: number
  form: FormRating
  pain: PainLevel
}

export interface BodyEntry {
  id: string
  dateKey: string
  weightKg?: number
  waistCm?: number
  bodyFatPct?: number
  muscleKg?: number
  steps?: number
  at: number
}

export interface PostureCheckin {
  id: string
  dateKey: string
  stiffness: number
  routineDone: boolean
  photoId?: string
  notes?: string
  at: number
}

export type PhotoView = 'front' | 'side' | 'back'
export interface Photo { id: string; dateKey: string; view: PhotoView; blob: Blob; thumb: Blob; at: number }

export interface Settings {
  language: Lang
  weekdayPlan: Record<number, DayKind>
  slotOrder: Partial<Record<DayKind, string[]>>
  rampWeekOverride: number | null
  programStartDate: string | null
  permanentSwaps: Record<string, string>
  favorites: string[]
  sound: boolean
  vibration: boolean
  defaultRestSec: number
  stepGoal: number
  lastBackupAt: number | null
  onboarded: boolean
}
