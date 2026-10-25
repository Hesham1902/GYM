import type { Exercise } from '@/types'
import { chest } from './chest'
import { shoulders } from './shoulders'
import { back } from './back'
import { arms } from './arms'
import { legsQuads } from './legsQuads'
import { legsPosterior } from './legsPosterior'
import { core } from './core'
import { postureDrills } from './posture'

export const EXERCISE_LIST: Exercise[] = [...chest, ...shoulders, ...back, ...arms, ...legsQuads, ...legsPosterior, ...core, ...postureDrills]
export const EXERCISES: Record<string, Exercise> = Object.fromEntries(EXERCISE_LIST.map((e) => [e.id, e]))
export const getExercise = (id: string): Exercise | undefined => EXERCISES[id]
