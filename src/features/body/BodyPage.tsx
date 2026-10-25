import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Trash2, ChevronDown } from 'lucide-react'
import { useT } from '@/i18n'
import { confirmSheet } from '@/components/Confirm'
import { useSettings } from '@/stores/settingsStore'
import { useUi } from '@/stores/uiStore'
import { Button, Card, Empty, PageHeader } from '@/components/ui'
import { BottomSheet } from '@/components/BottomSheet'
import { LineSeries } from '@/components/charts'
import { Ring } from '@/components/Ring'
import { Mixed } from '@/components/Mixed'
import { db } from '@/db/db'
import { bodyRepo, movingAverage } from '@/db/repo/body'
import type { BodyEntry } from '@/types'
import { uid } from '@/utils/id'
import { addDays, dateKey, fmtDate } from '@/utils/date'

const FIELDS = ['weightKg', 'waistCm', 'bodyFatPct', 'muscleKg', 'steps'] as const
type Field = (typeof FIELDS)[number]

export default function BodyPage() {
  const { t, lang } = useT()
  const stepGoal = useSettings((s) => s.stepGoal)
  const toast = useUi((s) => s.toast)
  const entries = useLiveQuery(() => db.bodyEntries.orderBy('dateKey').toArray(), []) ?? []
  const [edit, setEdit] = useState<BodyEntry | null>(null)
  const [more, setMore] = useState(false)
  const ma = useMemo(() => movingAverage(entries), [entries])
  const latest = [...entries].reverse().find((e) => e.weightKg)
  const latestAvg = [...ma].reverse().find((x) => x.avg !== null)?.avg ?? null
  const monthAgo = addDays(dateKey(), -30)
  const prevAvg = [...ma].reverse().find((x) => x.dateKey <= monthAgo && x.avg !== null)?.avg ?? null
  const today = entries.find((e) => e.dateKey === dateKey())
  const labels: Record<Field, string> = { weightKg: t('body.weight'), waistCm: t('body.waist'), bodyFatPct: t('body.bodyFat'), muscleKg: t('body.muscle'), steps: t('body.steps') }
  const units: Record<Field, string> = { weightKg: t('common.kg'), waistCm: t('common.cm'), bodyFatPct: '%', muscleKg: t('common.kg'), steps: '' }
  const open = (e: BodyEntry) => { setMore(FIELDS.some((f) => f !== 'weightKg' && e[f] !== undefined)); setEdit(e) }
  const openToday = () => open(today ?? { id: uid(), dateKey: dateKey(), at: Date.now() })
  const empty = !edit || FIELDS.every((f) => edit[f] === undefined || Number.isNaN(edit[f]))
  const save = async () => { if (!edit) return; await bodyRepo.put({ ...edit, at: Date.now() }); setEdit(null); toast(t('toast.saved'), 'success') }
  const chart = ma.slice(-60).map((x) => ({ x: x.dateKey.slice(5), weight: x.weight, avg: x.avg }))
  const waist = entries.filter((e) => e.waistCm).slice(-60).map((e) => ({ x: e.dateKey.slice(5), waist: e.waistCm }))

  return (
    <main className="page">
      <PageHeader title={t('body.title')} back right={<Button size="sm" onClick={openToday}>{t('body.logToday')}</Button>} />
      {entries.length > 0 && <>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <Card className="p-3 text-center"><div className="text-xs text-muted">{t('body.latest')}</div><div className="text-xl font-bold">{latest?.weightKg ?? '–'}</div></Card>
        <Card className="p-3 text-center"><div className="text-xs text-muted">{t('body.movingAvg')}</div><div className="text-xl font-bold text-accent">{latestAvg ?? '–'}</div></Card>
        <Card className="p-3 text-center"><div className="text-xs text-muted">{t('body.changeSince')}</div><div className={`text-xl font-bold ${latestAvg !== null && prevAvg !== null && latestAvg < prevAvg ? 'text-accent' : ''}`}>{latestAvg !== null && prevAvg !== null ? (latestAvg - prevAvg > 0 ? '+' : '') + (latestAvg - prevAvg).toFixed(1) : '–'}</div></Card>
      </div>
      {chart.length >= 2 && <Card className="mb-3 p-3">
        <LineSeries data={chart} keys={[{ k: 'weight', color: 'var(--color-muted)', dashed: true, name: t('body.weight') }, { k: 'avg', color: 'var(--color-accent)', name: t('body.movingAvg') }]} />
        <p className="text-[12px] text-muted mt-1"><Mixed>{t('body.trendNote')}</Mixed></p>
      </Card>}
      {waist.length >= 2 && <Card className="mb-3 p-3"><div className="text-sm font-semibold mb-1">{t('body.waist')}</div><LineSeries data={waist} keys={[{ k: 'waist', color: 'var(--color-info)', name: t('body.waist') }]} height={140} /></Card>}
      {today?.steps !== undefined && <Card className="mb-3 p-3 flex items-center gap-3"><Ring value={today.steps / stepGoal} size={56}>{Math.round((today.steps / stepGoal) * 100)}%</Ring><div><div className="font-semibold">{t('body.steps')}</div><div className="text-sm text-muted">{today.steps} / {stepGoal}</div></div></Card>}

      <h2 className="section">{t('body.entries')}</h2>
      </>}
      {!entries.length ? <Empty text={t('body.noEntries')} /> : (
        <Card className="p-0 divide-y divide-border mb-4">
          {[...entries].reverse().slice(0, 60).map((e) => (
            <button key={e.id} onClick={() => open(e)} className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-start active:bg-surface-2">
              <span className="text-muted">{fmtDate(e.dateKey, lang)}</span>
              <span className="tabular-nums"><Mixed>{[e.weightKg ? `${e.weightKg} ${t('common.kg')}` : '', e.waistCm ? `${e.waistCm} ${t('common.cm')}` : '', e.bodyFatPct ? `${e.bodyFatPct}%` : '', e.steps ? `${e.steps} ${t('body.steps')}` : ''].filter(Boolean).join(' · ')}</Mixed></span>
            </button>
          ))}
        </Card>
      )}

      <BottomSheet open={!!edit} onClose={() => setEdit(null)} title={edit?.dateKey === dateKey() ? t('body.logToday') : t('body.editEntry')}>
        {edit && <>
          <label className="block mb-3"><span className="text-xs text-muted">{t('analytics.date')}</span><input type="date" value={edit.dateKey} max={dateKey()} onChange={(e) => setEdit({ ...edit, dateKey: e.target.value })} className="w-full h-12 bg-surface-2 rounded-xl px-3 mt-1 text-text" /></label>
          {FIELDS.filter((f) => f === 'weightKg' || more).map((f) => (
            <label key={f} className="block mb-3">
              <span className="text-xs text-muted">{labels[f]} {units[f] && `(${units[f]})`} {f !== 'weightKg' && <span className="opacity-60">· {t('common.optional')}</span>}</span>
              <input type="number" inputMode="decimal" step={f === 'steps' ? 100 : 0.1} value={edit[f] ?? ''} onChange={(e) => setEdit({ ...edit, [f]: e.target.value === '' ? undefined : parseFloat(e.target.value) })} className="w-full h-12 bg-surface-2 rounded-xl px-3 mt-1 text-text text-lg" />
            </label>
          ))}
          {!more && <button type="button" onClick={() => setMore(true)} className="w-full flex items-center justify-between min-h-11 mb-3 text-sm text-muted">{t('body.moreFields')}<ChevronDown size={18} /></button>}
          <div className="flex gap-2">
            {entries.some((x) => x.id === edit.id) && <Button variant="danger" aria-label={t('body.deleteEntry')} onClick={async () => { if (await confirmSheet(t('body.deleteEntry'), { body: t('common.confirmDelete'), danger: true, okLabel: t('common.delete') })) { await bodyRepo.delete(edit.id); setEdit(null) } }}><Trash2 size={18} /></Button>}
            <Button className="flex-1" onClick={save} disabled={empty}>{t('common.save')}</Button>
          </div>
        </>}
      </BottomSheet>
    </main>
  )
}
