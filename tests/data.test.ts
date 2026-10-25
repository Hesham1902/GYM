import { describe, expect, it } from 'vitest'
import { EXERCISE_LIST, EXERCISES } from '../src/data/exercises'
import { POSES } from '../src/data/poses'
import { PROGRAM } from '../src/data/program'
import { ROUTINES } from '../src/data/routines'

describe('exercise data integrity', () => {
  it('unique ids', () => {
    const ids = EXERCISE_LIST.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.length).toBeGreaterThanOrEqual(70)
  })
  it('alternatives, poses resolve; bilingual strings non-empty', () => {
    for (const e of EXERCISE_LIST) {
      expect(POSES[e.poseId], `${e.id} pose ${e.poseId}`).toBeDefined()
      expect(e.alternatives.length, `${e.id} alts`).toBeGreaterThanOrEqual(2)
      for (const a of e.alternatives) expect(EXERCISES[a.exerciseId], `${e.id} -> ${a.exerciseId}`).toBeDefined()
      const g = e.guide
      expect(g.setup.length).toBeGreaterThanOrEqual(3); expect(g.execution.length).toBeGreaterThanOrEqual(2)
      expect(g.mistakes.length).toBeGreaterThanOrEqual(2); expect(g.greenFlags.length).toBeGreaterThanOrEqual(1); expect(g.safety.length).toBeGreaterThanOrEqual(1)
      const strings = [e.name, g.breathing, g.startingWeight, ...g.setup, ...g.execution, ...g.greenFlags, ...g.safety, ...g.mistakes.flatMap((m) => [m.avoid, m.fix]), ...e.alternatives.flatMap((a) => [a.differs, a.chooseWhen])]
      for (const s of strings) { expect(s.en.trim(), e.id).not.toBe(''); expect(s.ar.trim(), e.id).not.toBe('') }
      expect(e.muscles.length).toBeGreaterThan(0)
      expect(e.videoUrl.startsWith('https://')).toBe(true)
    }
  })
  it('program and routines reference real exercises', () => {
    for (const d of Object.values(PROGRAM)) for (const s of d.slots) expect(EXERCISES[s.exerciseId], s.exerciseId).toBeDefined()
    for (const r of Object.values(ROUTINES)) for (const s of r.steps) expect(EXERCISES[s.exerciseId], s.exerciseId).toBeDefined()
  })
})
