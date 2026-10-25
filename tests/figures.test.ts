import { describe, expect, it } from 'vitest'
import { FIGURES } from '../src/data/figures/index.ts'
import { lerpJoints, renderDynamic, renderInner } from '../src/figure/render.ts'
import { cycleProgress, CYCLE_MS, MOTION } from '../src/figure/motion.ts'
import { isFront, type SideJoints } from '../src/figure/types.ts'

describe('figure renderer', () => {
  it('renders every frame and every in-between pose without NaN', () => {
    for (const [id, f] of Object.entries(FIGURES)) {
      for (const fr of [f.start, f.end, f.mistake].filter(Boolean)) expect(renderInner(f, fr!.joints, fr!.note), id).not.toMatch(/NaN|undefined/)
      for (const t of [0.25, 0.5, 0.75]) expect(renderDynamic(f, lerpJoints(f.start.joints, f.end.joints, t), f.end.note, t), `${id} t=${t}`).not.toMatch(/NaN|undefined/)
    }
  })

  it('start and end frames share a view and limb set, so the loop interpolates', () => {
    for (const [id, f] of Object.entries(FIGURES)) {
      expect(isFront(f.start.joints), id).toBe(isFront(f.end.joints))
      const keys = (j: object) => Object.keys(j).filter((k) => k !== 'spine' && k !== 'headTilt' && k !== 'face').sort()
      expect(keys(f.end.joints), id).toEqual(keys(f.start.joints))
    }
  })

  it('interpolates headTilt and treats a missing spine control point as straight', () => {
    const a = { ...(FIGURES['chin-tuck'].start.joints as SideJoints), headTilt: 10 }
    const b = { ...(FIGURES['chin-tuck'].end.joints as SideJoints), headTilt: undefined, spine: [90, 100] as [number, number] }
    const m = lerpJoints(a, b, 0.5) as SideJoints
    expect(m.headTilt).toBe(5)
    const straight: [number, number] = [(a.shoulder[0] + a.hip[0]) / 2, (a.shoulder[1] + a.hip[1]) / 2]
    expect(m.spine).toEqual([(straight[0] + 90) / 2, (straight[1] + 100) / 2])
  })

  it('attached equipment follows its joint', () => {
    const f = FIGURES['leg-press']
    const at = (j: SideJoints) => renderDynamic(f, j).match(/<g transform="translate\(([\d.]+) ([\d.]+)\) rotate\(45\)/)!.slice(1).map(Number)
    expect(at(f.start.joints as SideJoints)).toEqual((f.start.joints as SideJoints).ankle)
    expect(at(f.end.joints as SideJoints)).toEqual((f.end.joints as SideJoints).ankle)
  })
})

describe('demo loop timing', () => {
  it('holds at each end and eases in between', () => {
    expect(cycleProgress(0)).toBe(0)
    expect(cycleProgress(MOTION.holdStart - 1)).toBe(0)
    expect(cycleProgress(MOTION.holdStart + MOTION.move / 2)).toBeCloseTo(0.5)
    expect(cycleProgress(MOTION.holdStart + MOTION.move + 10)).toBe(1)
    expect(cycleProgress(CYCLE_MS + 5)).toBe(0)
    const early = cycleProgress(MOTION.holdStart + MOTION.move * 0.1)
    expect(early).toBeLessThan(0.1) // ease-in: slow start
  })
})
