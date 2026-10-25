import { describe, expect, it } from 'vitest'
import { EXERCISE_LIST, EXERCISES } from '../src/data/exercises'
import { FIGURES } from '../src/data/figures/index.ts'
import { PHOTOS } from '../src/data/photos'
import { EQUIPMENT } from '../src/figure/equipment.ts'
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
  it('figures and photos reference real exercises and equipment', () => {
    for (const [id, f] of Object.entries(FIGURES)) {
      expect(EXERCISES[id], `figure ${id}`).toBeDefined()
      for (const e of f.equipment ?? []) expect(EQUIPMENT[e.id], `${id} equipment ${e.id}`).toBeDefined()
      expect(f.start.joints && f.end.joints).toBeTruthy()
    }
    for (const id of Object.keys(PHOTOS)) expect(EXERCISES[id], `photo ${id}`).toBeDefined()
  })
  it('program and routines reference real exercises', () => {
    for (const d of Object.values(PROGRAM)) for (const s of d.slots) expect(EXERCISES[s.exerciseId], s.exerciseId).toBeDefined()
    for (const r of Object.values(ROUTINES)) for (const s of r.steps) expect(EXERCISES[s.exerciseId], s.exerciseId).toBeDefined()
  })
})
