import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { useT } from '@/i18n'
import { EXERCISES } from '@/data/exercises'
import type { Exercise, L10n } from '@/types'
import { Chip } from '@/components/ui'
import { Mixed } from '@/components/Mixed'

export function keyCues(ex: Exercise): L10n[] {
  const g = ex.guide
  return [g.kyphosisCue, g.execution[0], g.execution[1], g.mistakes[0]?.fix, g.greenFlags[0]].filter(Boolean).slice(0, 5) as L10n[]
}

function Section({ title, children, open: initial = false }: { title: string; children: ReactNode; open?: boolean }) {
  const [open, setOpen] = useState(initial)
  return (
    <div className="border-t border-border">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between min-h-12 text-start font-semibold" aria-expanded={open}>
        {title}<ChevronDown size={18} className={`text-muted transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  )
}

/** Coaching guide: key cues first, then collapsible detail sections. */
export function GuideBody({ exerciseId, allOpen = false }: { exerciseId: string; allOpen?: boolean }) {
  const { t, l } = useT()
  const ex = EXERCISES[exerciseId]
  if (!ex) return null
  const g = ex.guide
  const List = ({ items }: { items: L10n[] }) => <ol className="list-decimal ps-5 space-y-1.5 text-[15px] leading-relaxed">{items.map((x, i) => <li key={i}><Mixed>{l(x)}</Mixed></li>)}</ol>
  return (
    <div>
      <div className="text-xs font-semibold text-accent uppercase tracking-wide mb-2">{t('library.keyCues')}</div>
      <ul className="space-y-2 mb-3">
        {keyCues(ex).map((c, i) => <li key={i} className="flex gap-2 text-[15px] leading-snug"><span className="text-accent shrink-0">●</span><Mixed>{l(c)}</Mixed></li>)}
      </ul>
      <Section title={t('library.setup')} open={allOpen}><List items={g.setup} /></Section>
      <Section title={t('library.execution')} open={allOpen}><List items={g.execution} /><p className="text-sm text-muted mt-2"><b>{t('library.breathing')}:</b> <Mixed>{l(g.breathing)}</Mixed></p></Section>
      <Section title={t('library.mistakes')} open={allOpen}>
        <div className="space-y-2">{g.mistakes.map((m, i) => (
          <div key={i} className="rounded-xl bg-bg p-3 text-[15px]"><div className="text-danger"><span className="text-xs font-semibold">{t('library.avoid')}: </span><Mixed>{l(m.avoid)}</Mixed></div><div className="text-accent mt-1"><span className="text-xs font-semibold">{t('library.fix')}: </span><Mixed>{l(m.fix)}</Mixed></div></div>
        ))}</div>
      </Section>
      <Section title={t('library.greenFlags')} open={allOpen}><ul className="ps-5 list-disc space-y-1.5 text-[15px]">{g.greenFlags.map((x, i) => <li key={i}><Mixed>{l(x)}</Mixed></li>)}</ul></Section>
      <Section title={t('library.safety')} open={allOpen}><ul className="ps-5 list-disc space-y-1.5 text-[15px]">{g.safety.map((x, i) => <li key={i}><Mixed>{l(x)}</Mixed></li>)}</ul></Section>
      <Section title={t('library.startingWeight')} open={allOpen}><p className="text-[15px] leading-relaxed"><Mixed>{l(g.startingWeight)}</Mixed></p></Section>
      <Section title={t('library.targets')}>
        <div className="flex flex-wrap gap-2"><span className="text-xs text-muted self-center">{t('library.primary')}:</span>{g.targetPrimary.map((m) => <Chip key={m} active>{t(`muscles.${m}`)}</Chip>)}</div>
        {g.targetSecondary.length > 0 && <div className="flex flex-wrap gap-2 mt-2"><span className="text-xs text-muted self-center">{t('library.secondary')}:</span>{g.targetSecondary.map((m) => <Chip key={m}>{t(`muscles.${m}`)}</Chip>)}</div>}
      </Section>
    </div>
  )
}
