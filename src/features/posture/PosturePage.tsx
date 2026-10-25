import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { Play, Flame, Lightbulb, Camera, ChevronRight, Check } from 'lucide-react'
import { useT } from '@/i18n'
import { useUi } from '@/stores/uiStore'
import { Button, Card, Chip, PageHeader } from '@/components/ui'
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
      <Card className="mb-3 flex items-center gap-3">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${n ? 'bg-warn/20 text-warn' : 'bg-surface-2 text-muted'}`}><Flame size={28} /></div>
        <div className="flex-1">
          <div className="font-bold">{n ? t('posture.streak', { n }) : t('posture.streakNone')}</div>
          <div className="text-sm text-muted">{today?.routineDone ? t('posture.doneToday') : t('dashboard.postureTodo')}</div>
        </div>
        <Button variant={today?.routineDone ? 'secondary' : 'primary'} className="h-11" onClick={() => { setStiff(today?.stiffness ?? 5); setCheckin(true) }}>{today?.routineDone ? <Check size={18} /> : null}{t('posture.checkin')}</Button>
      </Card>

      {ROUTINE_ORDER.map((id) => { const r = ROUTINES[id]; return (
        <Card key={id} className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <div><div className="font-bold">{l(r.name)}</div><div className="text-xs text-muted">{t('posture.minutes', { n: r.minutes })} · {r.steps.length} {t('common.of') === 'of' ? 'drills' : 'تمارين'}</div></div>
            <Button className="h-11" onClick={() => nav(`/posture/play/${id}`)}><Play size={18} />{t('common.start')}</Button>
          </div>
          <div className="flex flex-wrap gap-1.5">{r.steps.map((s, i) => <Chip key={i} className="!min-h-8 !px-2.5 !text-xs" onClick={() => nav(`/library/${s.exerciseId}`)}>{EXERCISES[s.exerciseId]?.termEn}</Chip>)}</div>
        </Card>
      ) })}

      <div className="grid grid-cols-2 gap-2 mb-3">
        <button onClick={() => nav('/posture/tips')} className="card p-3 flex items-center gap-2 text-start active:bg-surface-2"><Lightbulb className="text-warn shrink-0" /><span className="text-sm font-semibold flex-1">{t('posture.tips')}</span><ChevronRight size={18} className="text-muted rtl:flip" /></button>
        <button onClick={() => nav('/photos')} className="card p-3 flex items-center gap-2 text-start active:bg-surface-2"><Camera className="text-info shrink-0" /><span className="text-sm font-semibold flex-1">{t('posture.photos')}</span><ChevronRight size={18} className="text-muted rtl:flip" /></button>
      </div>

      {chart.length >= 2 && <Card className="mb-3 p-3"><div className="text-sm font-semibold mb-1">{t('posture.stiffnessHistory')}</div><LineSeries data={chart} keys={[{ k: 'stiffness', color: 'var(--color-warn)', name: t('posture.stiffness') }]} height={140} yDomain={[1, 10]} /></Card>}

      <Card className="mb-3"><div className="font-semibold mb-1">{t('posture.whyTitle')}</div><p className="text-sm text-muted leading-relaxed">{t('posture.why')}</p></Card>

      <BottomSheet open={checkin} onClose={() => setCheckin(false)} title={t('posture.checkin')}>
        <div className="text-sm text-muted mb-2">{t('posture.stiffness')}</div>
        <div className="flex gap-1 mb-1">{Array.from({ length: 10 }, (_, i) => i + 1).map((v) => <button key={v} onClick={() => setStiff(v)} className={`flex-1 min-h-11 rounded-lg text-sm font-semibold ${stiff === v ? (v <= 3 ? 'bg-accent text-black' : v <= 6 ? 'bg-warn text-black' : 'bg-danger text-white') : 'bg-surface-2 text-muted'}`}>{v}</button>)}</div>
        <div className="flex justify-between text-[11px] text-muted mb-4"><span>{t('posture.stiffnessLow')}</span><span>{t('posture.stiffnessHigh')}</span></div>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={() => save(false)}>{t('common.save')}</Button>
          <Button className="flex-1" onClick={() => save(true)}><Check size={18} />{t('posture.markDone')}</Button>
        </div>
      </BottomSheet>
    </main>
  )
}
