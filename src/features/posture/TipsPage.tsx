import { useState } from 'react'
import { useT } from '@/i18n'
import { Card, Chip, PageHeader } from '@/components/ui'
import { Mixed } from '@/components/Mixed'
import { TIPS } from '@/data/tips'

export default function TipsPage() {
  const { t, l } = useT()
  const [ctx, setCtx] = useState<'lift' | 'desk' | 'daily'>('lift')
  return (
    <main className="page">
      <PageHeader title={t('posture.tips')} back />
      <div className="flex gap-2 mb-3">{(['lift', 'desk', 'daily'] as const).map((c) => <Chip key={c} active={ctx === c} onClick={() => setCtx(c)}>{t(c === 'lift' ? 'posture.tipsLift' : c === 'desk' ? 'posture.tipsDesk' : 'posture.tipsDaily')}</Chip>)}</div>
      {TIPS.filter((x) => x.context === ctx).map((tip) => <Card key={tip.id} className="mb-2"><div className="font-semibold mb-1"><Mixed>{l(tip.title)}</Mixed></div><p className="text-[15px] text-muted leading-relaxed"><Mixed>{l(tip.body)}</Mixed></p></Card>)}
    </main>
  )
}
