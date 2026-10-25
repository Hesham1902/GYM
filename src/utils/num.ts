export function roundTo(v: number, step: number): number { return Math.round(v / step) * step }
export function clamp(v: number, lo: number, hi: number): number { return Math.min(hi, Math.max(lo, v)) }
export function fmtKg(v: number): string { return Number.isInteger(v) ? String(v) : v.toFixed(1).replace(/\.0$/, '') }
