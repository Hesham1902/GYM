import { useState } from 'react'
import { useT } from '@/i18n'
import { Card, Chip, PageHeader } from '@/components/ui'
import { TIPS } from '@/data/tips'

export default function TipsPage() {
  const { t, l } = useT()
  const [ctx, setCtx] = useState<'lift' | 'desk' | 'daily'>('lift')
  return (
    <main className="page">
      <PageHeader title={t('posture.tips')} back />
      <div className="flex gap-2 mb-3">{(['lift', 'desk', 'daily'] as const).map((c) => <Chip key={c} active={ctx === c} onClick={() => setCtx(c)}>{t(c === 'lift' ? 'posture.tipsLift' : c === 'desk' ? 'posture.tipsDesk' : 'posture.tipsDaily')}</Chip>)}</div>
      {TIPS.filter((x) => x.context === ctx).map((tip) => <Card key={tip.id} className="mb-2"><div className="font-semibold mb-1">{l(tip.title)}</div><p className="text-[15px] text-muted leading-relaxed">{l(tip.body)}</p></Card>)}
    </main>
  )
}
