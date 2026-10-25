export function dateKey(d: Date | number = new Date()): string {
  const x = typeof d === 'number' ? new Date(d) : d
  const y = x.getFullYear(), m = String(x.getMonth() + 1).padStart(2, '0'), day = String(x.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
export function parseKey(k: string): Date { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d) }
export function addDays(k: string, n: number): string { const d = parseKey(k); d.setDate(d.getDate() + n); return dateKey(d) }
export function daysBetween(a: string, b: string): number { return Math.round((parseKey(b).getTime() - parseKey(a).getTime()) / 86400000) }
export function startOfWeekKey(k: string, weekStart = 6): string {
  const d = parseKey(k); const diff = (d.getDay() - weekStart + 7) % 7; d.setDate(d.getDate() - diff); return dateKey(d)
}
export function fmtDate(k: string, lang: string): string {
  return parseKey(k).toLocaleDateString(lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}
export function fmtTime(ts: number, lang: string): string {
  return new Date(ts).toLocaleTimeString(lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB', { hour: '2-digit', minute: '2-digit' })
}
export function fmtDuration(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000)); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}` : `${m}:${String(sec).padStart(2, '0')}`
}
export function fmtClock(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
