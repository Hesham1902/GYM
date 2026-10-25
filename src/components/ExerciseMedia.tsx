import { useState } from 'react'
import { Play, Image as ImageIcon, PenLine, AlertTriangle } from 'lucide-react'
import { FigureView, type FigureFrame } from '@/figure/FigureView'
import { getFigure } from '@/data/figures'
import { hasPhoto } from '@/data/photos'
import { useT } from '@/i18n'
import { Chip } from './ui'

const photoUrl = (id: string, i: 0 | 1) => `${import.meta.env.BASE_URL}photos/${id}-${i}.jpg`

/** Static thumbnail: figure end frame, else photo, else blank. */
export function ExerciseThumb({ id, className = '' }: { id: string; className?: string }) {
  const fig = getFigure(id)
  if (fig) return <div className={`bg-bg overflow-hidden ${className}`}><FigureView figure={fig} frame="end" className="w-full h-full" /></div>
  if (hasPhoto(id)) return <div className={`bg-bg overflow-hidden ${className}`}><img src={photoUrl(id, 1)} alt="" className="w-full h-full object-cover" loading="lazy" /></div>
  return <div className={`bg-bg ${className}`} />
}

/** Full media block: animated figure with Start/Play/End/Mistake, or the real photos (start | end). */
export function ExerciseMedia({ id, compact = false }: { id: string; compact?: boolean }) {
  const { t } = useT()
  const fig = getFigure(id)
  const photo = hasPhoto(id)
  const [mode, setMode] = useState<'figure' | 'photo'>(fig ? 'figure' : 'photo')
  const [frame, setFrame] = useState<FigureFrame>(null)
  if (!fig && !photo) return null
  const showFig = mode === 'figure' && fig
  return (
    <div>
      {showFig ? (
        <div className={`${compact ? 'h-48' : 'aspect-square max-h-80'} mx-auto rounded-2xl bg-bg overflow-hidden`}><FigureView figure={fig} frame={frame} className="w-full h-full" /></div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {[0, 1].map((i) => (
            <figure key={i} className="m-0">
              <img src={photoUrl(id, i as 0 | 1)} alt="" className={`w-full ${compact ? 'h-40' : 'aspect-[4/5]'} object-cover rounded-2xl bg-bg`} />
              <figcaption className="text-[11px] text-muted text-center mt-1">{i === 0 ? t('figure.start') : t('figure.end')}</figcaption>
            </figure>
          ))}
        </div>
      )}
      <div className="flex gap-1.5 justify-center mt-2 flex-wrap">
        {showFig && <>
          <Chip active={frame === 'start'} onClick={() => setFrame('start')} className="!min-h-9 !px-3 !text-xs">{t('figure.start')}</Chip>
          <Chip active={frame === null} onClick={() => setFrame(null)} className="!min-h-9 !px-3 !text-xs"><Play size={12} className="inline -mt-0.5 me-1" />{t('library.animate')}</Chip>
          <Chip active={frame === 'end'} onClick={() => setFrame('end')} className="!min-h-9 !px-3 !text-xs">{t('figure.end')}</Chip>
          {fig.mistake && <Chip active={frame === 'mistake'} onClick={() => setFrame('mistake')} className={`!min-h-9 !px-3 !text-xs ${frame === 'mistake' ? '!bg-danger !border-danger !text-white' : '!text-danger'}`}><AlertTriangle size={12} className="inline -mt-0.5 me-1" />{t('figure.mistake')}</Chip>}
        </>}
        {fig && photo && (
          <Chip onClick={() => setMode(mode === 'figure' ? 'photo' : 'figure')} className="!min-h-9 !px-3 !text-xs">
            {mode === 'figure' ? <><ImageIcon size={12} className="inline -mt-0.5 me-1" />{t('figure.photo')}</> : <><PenLine size={12} className="inline -mt-0.5 me-1" />{t('figure.drawing')}</>}
          </Chip>
        )}
      </div>
    </div>
  )
}
