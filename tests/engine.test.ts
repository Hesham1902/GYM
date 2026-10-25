import { describe, expect, it } from 'vitest'
import { evaluate } from '../src/engine/progression'
import { programWeek, rirForWeek, setsForWeek } from '../src/engine/week'
import { detectPrs, est1rm } from '../src/engine/oneRm'
import { warmupSets } from '../src/engine/warmup'
import { adjustRest, isOver, remainingMs, startRest } from '../src/timers/restTimer'
import { movingAverage } from '../src/db/repo/body'
import { streak } from '../src/db/repo/posture'
import type { Exercise } from '../src/types'

const ex = { id: 'x', repRange: [8, 12], weightStep: 2.5, loadType: 'weight', isCompound: true } as unknown as Exercise
const set = (weight: number, reps: number, extra: Partial<{ rir: number; form: 'good' | 'ok' | 'poor'; pain: 0 | 1 | 2 }> = {}) => ({ weight, reps, rir: 3, form: 'good' as const, pain: 0 as const, ...extra })

describe('week', () => {
  it('ramp sets/rir', () => {
    expect(setsForWeek(1, true, true)).toBe(2); expect(setsForWeek(1, false, true)).toBe(1)
    expect(setsForWeek(2, false, false)).toBe(2); expect(setsForWeek(3, false, true)).toBe(3); expect(setsForWeek(5, false, false)).toBe(2)
    expect(rirForWeek(1)).toBe(4); expect(rirForWeek(2)).toBe(3); expect(rirForWeek(9)).toBe(2)
  })
  it('program week from start date, override wins', () => {
    expect(programWeek('2026-10-01', null, '2026-10-01')).toBe(1)
    expect(programWeek('2026-10-01', null, '2026-10-07')).toBe(1)
    expect(programWeek('2026-10-01', null, '2026-10-08')).toBe(2)
    expect(programWeek('2026-10-01', 3, '2026-10-08')).toBe(3)
    expect(programWeek(null, null)).toBe(1)
  })
})

describe('double progression', () => {
  it('new when no history', () => expect(evaluate(ex, [], 4).decision).toBe('new'))
  it('up when all sets at top with clean form', () => {
    const r = evaluate(ex, [set(40, 12), set(40, 12)], 3)
    expect(r.decision).toBe('up'); expect(r.suggestedWeight).toBe(42.5)
  })
  it('hold when reps below top', () => {
    const r = evaluate(ex, [set(40, 12), set(40, 10)], 3)
    expect(r.decision).toBe('hold'); expect(r.suggestedWeight).toBe(40); expect(r.suggestedReps).toBe(11)
  })
  it('down on joint pain', () => {
    const r = evaluate(ex, [set(40, 12, { pain: 2 })], 3)
    expect(r.decision).toBe('down'); expect(r.suggestedWeight).toBe(35)
  })
  it('down on two sloppy sets', () => expect(evaluate(ex, [set(40, 12, { form: 'poor' }), set(40, 12, { form: 'poor' })], 3).decision).toBe('down'))
  it('hold when fatigue high (rir far below target)', () => expect(evaluate(ex, [set(40, 12, { rir: 0 })], 3).decision).toBe('hold'))
})

describe('1rm + prs', () => {
  it('epley', () => { expect(est1rm(100, 1)).toBe(100); expect(est1rm(40, 10)).toBe(53.3) })
  it('detects weight and est1rm PRs only with history', () => {
    const sets = [{ id: '1', slotId: 's', exerciseId: 'x', setIndex: 0, weight: 45, reps: 10, rir: 2, form: 'good' as const, pain: 0 as const, isWarmup: false, loggedAt: 1 }]
    expect(detectPrs(sets, [])).toEqual([])
    const prs = detectPrs(sets, [{ exerciseId: 'x', weight: 40, reps: 12 }])
    expect(prs.map((p) => p.kind).sort()).toEqual(['est1rm', 'weight'])
  })
})

describe('warmup', () => {
  it('scales with load', () => {
    expect(warmupSets(10)).toHaveLength(1); expect(warmupSets(40)).toHaveLength(2); expect(warmupSets(80)).toHaveLength(3)
    expect(warmupSets(80)[2].weight).toBe(65)
  })
})

describe('rest timer', () => {
  it('timestamp based', () => {
    const t = startRest('s', 90, 1000)
    expect(remainingMs(t, 1000)).toBe(90000); expect(remainingMs(t, 50000)).toBe(41000); expect(isOver(t, 91001)).toBe(true)
    const t2 = adjustRest(t, -15, 1000); expect(remainingMs(t2, 1000)).toBe(75000)
    const t3 = adjustRest(t, -200, 1000); expect(remainingMs(t3, 1000)).toBe(0)
  })
})

describe('body + posture', () => {
  it('7-day moving average needs 3 points', () => {
    const e = (d: string, w: number) => ({ id: d, dateKey: d, weightKg: w, at: 0 })
    const r = movingAverage([e('2026-10-01', 90), e('2026-10-02', 91), e('2026-10-03', 89)])
    expect(r[0].avg).toBeNull(); expect(r[2].avg).toBe(90)
  })
  it('streak counts consecutive done days', () => {
    const c = (d: string, done = true) => ({ id: d, dateKey: d, stiffness: 5, routineDone: done, at: 0 })
    expect(streak([c('2026-10-25'), c('2026-10-24'), c('2026-10-22')], '2026-10-25')).toBe(2)
    expect(streak([c('2026-10-24')], '2026-10-25')).toBe(1)
    expect(streak([c('2026-10-23')], '2026-10-25')).toBe(0)
  })
})
