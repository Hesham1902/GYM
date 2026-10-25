import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, Download, Upload, Trash2, X } from 'lucide-react'
import { useT } from '@/i18n'
import { useSettings } from '@/stores/settingsStore'
import { useUi } from '@/stores/uiStore'
import { Button, Card, PageHeader, Row, Toggle, Chip } from '@/components/ui'
import { Segmented } from '@/components/Segmented'
import { PROGRAM, TRAINING_DAYS } from '@/data/program'
import { EXERCISES } from '@/data/exercises'
import { orderedSlots } from '@/engine/workoutBuilder'
import { programWeek } from '@/engine/week'
import type { DayKind } from '@/types'
import { bodyCsv, buildBackup, downloadText, importBackup, setsCsv, storageUsedMb, wipeAll } from '@/db/exportImport'
import { supportsVibration } from '@/timers/cues'
import { applyUpdate } from '@/pwa'
import { dateKey, fmtDate } from '@/utils/date'

const KINDS: DayKind[] = ['upperA', 'lowerA', 'recovery', 'upperB', 'lowerB', 'rest']

export default function SettingsPage() {
  const { t, l, lang } = useT()
  const s = useSettings()
  const toast = useUi((x) => x.toast)
  const swNeedsRefresh = useUi((x) => x.swNeedsRefresh)
  const fileRef = useRef<HTMLInputElement>(null)
  const [reorderDay, setReorderDay] = useState<DayKind>('upperA')
  const [mb, setMb] = useState<number | null>(null)
  useEffect(() => { storageUsedMb().then(setMb) }, [])
  const week = programWeek(s.programStartDate, s.rampWeekOverride)
  const standalone = typeof window !== 'undefined' && (window.matchMedia('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true)

  const exportJson = async () => {
    const b = await buildBackup()
    downloadText(`gym-backup-${dateKey()}.json`, JSON.stringify(b, null, 1))
    s.set({ lastBackupAt: Date.now() }); toast(t('toast.saved'), 'success')
  }
  const onImport = async (f: File) => {
    if (!confirm(t('settings.importConfirm'))) return
    try { const r = await importBackup(await f.text()); toast(t('settings.imported', { n: r.sessions }), 'success') }
    catch (e) { toast(t('settings.importFailed', { msg: (e as Error).message }), 'error') }
  }
  const slots = orderedSlots(reorderDay, s)
  const move = (i: number, d: -1 | 1) => {
    const ids = slots.map((x) => x.slotId); const j = i + d; if (j < 0 || j >= ids.length) return
    ;[ids[i], ids[j]] = [ids[j], ids[i]]; s.setSlotOrder(reorderDay, ids)
  }

  return (
    <main className="page">
      <PageHeader title={t('settings.title')} back />
      {swNeedsRefresh && <Card className="mb-3 flex items-center justify-between"><span>{t('settings.updateAvailable')}</span><Button onClick={() => applyUpdate()} className="h-11">{t('settings.reload')}</Button></Card>}

      <h2 className="section">{t('settings.language')}</h2>
      <Card className="mb-4"><Segmented value={s.language} onChange={(v) => s.set({ language: v })} options={[{ value: 'ar', label: t('settings.arabic') }, { value: 'en', label: t('settings.english') }]} /></Card>

      <h2 className="section">{t('settings.program')}</h2>
      <Card className="mb-4">
        <Row label={t('settings.programStart')}><input type="date" value={s.programStartDate ?? ''} onChange={(e) => s.set({ programStartDate: e.target.value || null })} className="bg-surface-2 rounded-xl px-3 h-11 text-text" /></Row>
        <Row label={t('settings.rampWeek')} value={s.rampWeekOverride ? t('settings.rampWeekN', { n: s.rampWeekOverride }) : `${t('settings.rampAuto')} · ${t('settings.rampWeekN', { n: week })}`} />
        <div className="flex flex-wrap gap-2 mb-2">
          <Chip active={!s.rampWeekOverride} onClick={() => s.set({ rampWeekOverride: null })}>{t('settings.rampAuto')}</Chip>
          {[1, 2, 3, 4, 6, 8].map((n) => <Chip key={n} active={s.rampWeekOverride === n} onClick={() => s.set({ rampWeekOverride: n })}>{t('settings.rampWeekN', { n })}</Chip>)}
        </div>
        <p className="text-xs text-muted">{t('settings.rampHint')}</p>
      </Card>

      <h2 className="section">{t('settings.weekdayPlan')}</h2>
      <Card className="mb-4 divide-y divide-border">
        {[6, 0, 1, 2, 3, 4, 5].map((d) => (
          <div key={d} className="py-2">
            <div className="text-sm font-semibold mb-1.5">{t(`weekdaysLong.${d as 0}`)}</div>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {KINDS.map((k) => <Chip key={k} active={s.weekdayPlan[d] === k} onClick={() => s.setWeekday(d, k)}>{k === 'rest' ? t('settings.weekdayNone') : k === 'recovery' ? t('dashboard.recoveryDay') : t(`days.${k}`)}</Chip>)}
            </div>
          </div>
        ))}
      </Card>

      <h2 className="section">{t('settings.reorder')}</h2>
      <Card className="mb-4">
        <div className="flex gap-2 mb-3">{TRAINING_DAYS.map((k) => <Chip key={k} active={reorderDay === k} onClick={() => setReorderDay(k)}>{t(`days.${k}`)}</Chip>)}</div>
        <div className="divide-y divide-border">
          {slots.map((sl, i) => {
            const exId = s.permanentSwaps[sl.slotId] ?? sl.exerciseId
            return (
              <div key={sl.slotId} className="flex items-center gap-2 py-1.5">
                <span className="text-muted w-5 text-sm">{i + 1}</span>
                <span className="flex-1 text-sm truncate">{l(EXERCISES[exId]?.name)}{s.permanentSwaps[sl.slotId] && <span className="text-xs text-warn ms-1">({t('workout.swap')})</span>}</span>
                {s.permanentSwaps[sl.slotId] && <button aria-label={t('settings.removeSwap')} className="tap h-10 w-10 min-h-10 min-w-10 text-muted" onClick={() => s.setPermanentSwap(sl.slotId, null)}><X size={18} /></button>}
                <button aria-label="up" disabled={i === 0} className="tap h-10 w-10 min-h-10 min-w-10 rounded-xl bg-surface-2 disabled:opacity-30" onClick={() => move(i, -1)}><ArrowUp size={18} className="mx-auto" /></button>
                <button aria-label="down" disabled={i === slots.length - 1} className="tap h-10 w-10 min-h-10 min-w-10 rounded-xl bg-surface-2 disabled:opacity-30" onClick={() => move(i, 1)}><ArrowDown size={18} className="mx-auto" /></button>
              </div>
            )
          })}
        </div>
        {s.slotOrder[reorderDay] && <button className="text-xs text-muted mt-2 underline" onClick={() => s.setSlotOrder(reorderDay, PROGRAM[reorderDay].slots.map((x) => x.slotId))}>{t('settings.reset')}</button>}
      </Card>

      <h2 className="section">{t('settings.workoutCues')}</h2>
      <Card className="mb-4">
        <Row label={t('settings.sound')}><Toggle checked={s.sound} onChange={(v) => s.set({ sound: v })} label={t('settings.sound')} /></Row>
        {supportsVibration ? <Row label={t('settings.vibration')}><Toggle checked={s.vibration} onChange={(v) => s.set({ vibration: v })} label={t('settings.vibration')} /></Row> : <p className="text-xs text-muted py-1">{t('settings.vibrationIos')}</p>}
        <Row label={t('settings.restSec')}>
          <div className="flex gap-1.5">{[60, 90, 120, 150, 180].map((n) => <Chip key={n} active={s.defaultRestSec === n} onClick={() => s.set({ defaultRestSec: n })}>{n}s</Chip>)}</div>
        </Row>
        <Row label={t('settings.stepGoal')}><input type="number" inputMode="numeric" value={s.stepGoal} onChange={(e) => s.set({ stepGoal: parseInt(e.target.value) || 0 })} className="bg-surface-2 rounded-xl px-3 h-11 w-24 text-end text-text" /></Row>
      </Card>

      <h2 className="section">{t('settings.data')}</h2>
      <Card className="mb-4 flex flex-col gap-2">
        <p className={`text-sm ${s.lastBackupAt ? 'text-muted' : 'text-warn'}`}>{s.lastBackupAt ? t('settings.lastBackup', { date: fmtDate(dateKey(s.lastBackupAt), lang) }) : t('settings.neverBackup')}</p>
        <Button variant="secondary" onClick={exportJson}><Download size={18} />{t('settings.exportJson')}</Button>
        <Button variant="secondary" onClick={async () => { downloadText(`gym-sets-${dateKey()}.csv`, await setsCsv(), 'text/csv'); toast(t('toast.saved'), 'success') }}><Download size={18} />{t('settings.exportCsv')}</Button>
        <Button variant="secondary" onClick={async () => { downloadText(`gym-body-${dateKey()}.csv`, await bodyCsv(), 'text/csv'); toast(t('toast.saved'), 'success') }}><Download size={18} />{t('settings.exportBodyCsv')}</Button>
        <Button variant="secondary" onClick={() => fileRef.current?.click()}><Upload size={18} />{t('settings.importJson')}</Button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onImport(f); e.target.value = '' }} />
        {mb !== null && <p className="text-xs text-muted">{t('settings.storageUsed', { mb })}</p>}
      </Card>

      <h2 className="section">{t('settings.install')}</h2>
      <Card className="mb-4 text-sm text-muted">{standalone ? <span className="text-accent">{t('settings.installed')}</span> : t('settings.installHint')}</Card>

      <h2 className="section text-danger">{t('settings.danger')}</h2>
      <Card className="mb-4"><Button variant="danger" className="w-full" onClick={async () => { if (confirm(t('settings.wipeConfirm'))) { await wipeAll(); toast(t('toast.deleted'), 'success'); location.hash = '#/' } }}><Trash2 size={18} />{t('settings.wipe')}</Button></Card>
      <p className="text-xs text-muted text-center">{t('settings.version')} {__APP_VERSION__}</p>
    </main>
  )
}
