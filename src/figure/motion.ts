// Shared timing for the exercise demo loop, used by the drawing and the photo cross-fade.

/** ms: pause on the start pose, move, pause on the end pose, move back. */
export const MOTION = { holdStart: 600, move: 1200, holdEnd: 900 }
export const CYCLE_MS = MOTION.holdStart + MOTION.move + MOTION.holdEnd + MOTION.move
/** Tween length when the person taps Start / End / Mistake. */
export const TWEEN_MS = 450

export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

/** Eased position in the loop at `ms` since it started: 0 = start pose, 1 = end pose. */
export function cycleProgress(ms: number): number {
  const { holdStart, move, holdEnd } = MOTION
  const p = ms % CYCLE_MS
  if (p < holdStart) return 0
  if (p < holdStart + move) return easeInOut((p - holdStart) / move)
  if (p < holdStart + move + holdEnd) return 1
  return 1 - easeInOut((p - holdStart - move - holdEnd) / move)
}

/** Arrows and muscle glow arrive with the pose: invisible until 65% of the way, full at the end. */
export const noteFade = (t: number) => clamp01((t - 0.65) / 0.35)
