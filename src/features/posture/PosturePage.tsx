import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { Play, Flame, Lightbulb, Camera, ChevronRight, Check } from 'lucide-react'
import { useT } from '@/i18n'
import { useUi } from '@/stores/uiStore'
import { Button, Card, PageHeader } from '@/components/ui'
import { BottomSheet } from '@/components/BottomSheet'
import { LineSeries } from '@/components/charts'
import { db } from '@/db/db'
import { postureRepo, streak } from '@/db/repo/posture'
import { ROUTINES, ROUTINE_ORDER } from '@/data/routines'
import { EXERCISES } from '@/data/exercises'
import { dateKey } from '@/utils/date'
import { uid } from '@/utils/id'

export default function PosturePage() {
  const nav = useNavigate()
  const { t, l } = useT()
  const toast = useUi((s) => s.toast)
  const checkins = useLiveQuery(() => db.postureCheckins.orderBy('dateKey').toArray(), []) ?? []
  const today = checkins.find((c) => c.dateKey === dateKey())
  const n = streak(checkins)
  const [checkin, setCheckin] = useState(false)
  const [stiff, setStiff] = useState(today?.stiffness ?? 5)
  const save = async (routineDone: boolean) => {
    await postureRepo.put({ id: today?.id ?? uid(), dateKey: dateKey(), stiffness: stiff, routineDone: routineDone || !!today?.routineDone, photoId: today?.photoId, notes: today?.notes, at: Date.now() })
    setCheckin(false); toast(t('posture.checkinSaved'), 'success')
  }
  const chart = checkins.slice(-30).map((c) => ({ x: c.dateKey.slice(5), stiffness: c.stiffness }))
  return (
    <main className="page">
      <PageHeader title={t('posture.title')} sub={t('posture.subtitle')} />

      <section className="card p-4 mb-3 flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${n ? 'bg-warn/15 text-warn' : 'bg-surface-2 text-muted'}`}><Flame size={24} /></div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold leading-tight">{n ? t('posture.streak', { n }) : t('posture.streakNone')}</div>
          <div className="t-cap mt-0.5">{today?.routineDone ? t('posture.doneToday') : t('dashboard.postureTodo')}</div>
        </div>
        <Button variant={today?.routineDone ? 'secondary' : 'soft'} size="sm" onClick={() => { setStiff(today?.stiffness ?? 5); setCheckin(true) }}>{today?.routineDone ? <Check size={16} /> : null}{t('posture.checkin')}</Button>
      </section>

      {ROUTINE_ORDER.map((id) => { const r = ROUTINES[id]; return (
        <section key={id} className="card p-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="t-h3">{l(r.name)}</h2>
              <div className="t-cap mt-0.5">{t('posture.minutes', { n: r.minutes })} · {t('posture.drills', { n: r.steps.length })}</div>
            </div>
            <Button size="md" variant={id === 'daily' ? 'primary' : 'secondary'} onClick={() => nav(`/posture/play/${id}`)}><Play size={18} />{t('common.start')}</Button>
          </div>
          <p className="t-small text-muted mt-3 leading-relaxed num">{r.steps.map((s) => EXERCISES[s.exerciseId]?.termEn).join(' · ')}</p>
        </section>
      ) })}

      <div className="card mb-3 divide-y divide-border px-4">
        <button onClick={() => nav('/posture/tips')} className="w-full flex items-center gap-3 min-h-14 text-start active:opacity-70"><Lightbulb className="text-warn shrink-0" size={22} /><span className="font-medium flex-1">{t('posture.tips')}</span><ChevronRight size={18} className="text-faint rtl:flip" /></button>
        <button onClick={() => nav('/photos')} className="w-full flex items-center gap-3 min-h-14 text-start active:opacity-70"><Camera className="text-info shrink-0" size={22} /><span className="font-medium flex-1">{t('posture.photos')}</span><ChevronRight size={18} className="text-faint rtl:flip" /></button>
      </div>

      {chart.length >= 2 && <Card className="mb-3"><div className="font-semibold mb-2">{t('posture.stiffnessHistory')}</div><LineSeries data={chart} keys={[{ k: 'stiffness', color: 'var(--color-warn)', name: t('posture.stiffness') }]} height={140} yDomain={[1, 10]} /></Card>}

      <Card className="mb-3"><div className="font-semibold mb-1">{t('posture.whyTitle')}</div><p className="t-small text-muted leading-relaxed">{t('posture.why')}</p></Card>

      <BottomSheet open={checkin} onClose={() => setCheckin(false)} title={t('posture.checkin')}>
        <div className="text-sm text-muted mb-2">{t('posture.stiffness')}</div>
        <div className="grid grid-cols-5 gap-1.5 mb-1" dir="ltr">{Array.from({ length: 10 }, (_, i) => i + 1).map((v) => <button key={v} onClick={() => setStiff(v)} className={`min-h-11 rounded-lg text-sm font-semibold ${stiff === v ? (v <= 3 ? 'bg-accent text-black' : v <= 6 ? 'bg-warn text-black' : 'bg-danger text-white') : 'bg-surface-2 text-muted'}`}>{v}</button>)}</div>
        <div className="flex justify-between text-xs text-muted mb-4" dir="ltr"><span>1 · {t('posture.stiffnessLow')}</span><span>{t('posture.stiffnessHigh')} · 10</span></div>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={() => save(false)}>{t('common.save')}</Button>
          <Button className="flex-1" onClick={() => save(true)}><Check size={18} />{t('posture.markDone')}</Button>
        </div>
      </BottomSheet>
    </main>
  )
}
