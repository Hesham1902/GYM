import type { Figure } from '../../figure/types.ts'
import { chestFigures } from './chest.ts'
import { shouldersFigures } from './shoulders.ts'
import { backFigures } from './back.ts'
import { armsFigures } from './arms.ts'
import { legsQuadsFigures } from './legsQuads.ts'
import { legsPosteriorFigures } from './legsPosterior.ts'
import { coreFigures } from './core.ts'
import { postureFigures } from './posture.ts'

export const FIGURES: Record<string, Figure> = { ...chestFigures, ...shouldersFigures, ...backFigures, ...armsFigures, ...legsQuadsFigures, ...legsPosteriorFigures, ...coreFigures, ...postureFigures }
export const getFigure = (id: string): Figure | undefined => FIGURES[id]
