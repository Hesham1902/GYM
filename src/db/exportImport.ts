import { db, withRetry } from './db'
import { useSettings, DEFAULT_SETTINGS } from '@/stores/settingsStore'
import type { BodyEntry, PostureCheckin, Settings, WorkoutSession } from '@/types'
import { EXERCISES } from '@/data/exercises'
import { toRow } from './repo/sessions'

export interface Backup { version: 1; exportedAt: number; settings: Settings; sessions: WorkoutSession[]; bodyEntries: BodyEntry[]; postureCheckins: PostureCheckin[] }

export async function buildBackup(): Promise<Backup> {
  const s = useSettings.getState()
  const settings: Settings = Object.fromEntries(Object.keys(DEFAULT_SETTINGS).map((k) => [k, (s as unknown as Record<string, unknown>)[k]])) as unknown as Settings
  const [sessions, bodyEntries, postureCheckins] = await withRetry(() => Promise.all([db.sessions.toArray(), db.bodyEntries.toArray(), db.postureCheckins.toArray()]))
  return { version: 1, exportedAt: Date.now(), settings, sessions, bodyEntries, postureCheckins }
}

export async function importBackup(json: string): Promise<{ sessions: number }> {
  const data = JSON.parse(json) as Partial<Backup>
  if (!data || data.version !== 1 || !Array.isArray(data.sessions)) throw new Error('Not a GYM backup')
  await withRetry(() => db.transaction('rw', db.sessions, db.exerciseSets, db.bodyEntries, db.postureCheckins, async () => {
    await db.sessions.clear(); await db.exerciseSets.clear(); await db.bodyEntries.clear(); await db.postureCheckins.clear()
    await db.sessions.bulkPut(data.sessions!)
    const rows = data.sessions!.filter((s) => s.status === 'done').flatMap((s) => s.sets.filter((x) => !x.isWarmup).map((x) => toRow(s.id, x)))
    await db.exerciseSets.bulkPut(rows)
    if (data.bodyEntries) await db.bodyEntries.bulkPut(data.bodyEntries)
    if (data.postureCheckins) await db.postureCheckins.bulkPut(data.postureCheckins)
  }))
  if (data.settings) useSettings.getState().set({ ...DEFAULT_SETTINGS, ...data.settings })
  return { sessions: data.sessions!.length }
}

export async function wipeAll() {
  await withRetry(() => Promise.all([db.sessions.clear(), db.exerciseSets.clear(), db.bodyEntries.clear(), db.postureCheckins.clear(), db.photos.clear()]))
  useSettings.getState().reset()
  localStorage.removeItem('gym.active')
}

const csvCell = (v: unknown) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }

export async function setsCsv(): Promise<string> {
  const sessions = await withRetry(() => db.sessions.orderBy('startedAt').toArray())
  const head = ['date', 'day', 'week', 'exercise', 'exercise_id', 'set', 'warmup', 'weight_kg', 'reps', 'rir', 'form', 'pain']
  const lines = [head.join(',')]
  for (const s of sessions) for (const x of [...s.sets].sort((a, b) => a.loggedAt - b.loggedAt))
    lines.push([s.dateKey, s.dayKind, s.week, EXERCISES[x.exerciseId]?.name.en ?? x.exerciseId, x.exerciseId, x.setIndex + 1, x.isWarmup ? 1 : 0, x.weight, x.reps, x.rir, x.form, x.pain].map(csvCell).join(','))
  return lines.join('\n')
}

export async function bodyCsv(): Promise<string> {
  const rows = await withRetry(() => db.bodyEntries.orderBy('dateKey').toArray())
  const head = ['date', 'weight_kg', 'waist_cm', 'body_fat_pct', 'muscle_kg', 'steps']
  return [head.join(','), ...rows.map((r) => [r.dateKey, r.weightKg, r.waistCm, r.bodyFatPct, r.muscleKg, r.steps].map(csvCell).join(','))].join('\n')
}

export function downloadText(name: string, text: string, type = 'application/json') {
  const blob = new Blob([text], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

export async function storageUsedMb(): Promise<number | null> {
  try { const e = await navigator.storage?.estimate?.(); return e?.usage ? Math.round((e.usage / 1048576) * 10) / 10 : 0 } catch { return null }
}
