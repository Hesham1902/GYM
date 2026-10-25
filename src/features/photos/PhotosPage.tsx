import { useEffect, useMemo, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Camera, Images, Trash2, Lock } from 'lucide-react'
import { useT } from '@/i18n'
import { confirmSheet } from '@/components/Confirm'
import { useUi } from '@/stores/uiStore'
import { Button, Card, Chip, Empty, PageHeader } from '@/components/ui'
import { BottomSheet } from '@/components/BottomSheet'
import { db } from '@/db/db'
import { photosRepo } from '@/db/repo/photos'
import type { Photo, PhotoView } from '@/types'
import { fmtDate } from '@/utils/date'

function useObjectUrl(blob: Blob | undefined) {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => { if (!blob) return; const u = URL.createObjectURL(blob); setUrl(u); return () => URL.revokeObjectURL(u) }, [blob])
  return url
}
function Img({ blob, className, onClick }: { blob?: Blob; className?: string; onClick?: () => void }) {
  const url = useObjectUrl(blob)
  return url ? <img src={url} className={className} onClick={onClick} alt="" /> : <div className={className} />
}

export default function PhotosPage() {
  const { t, lang } = useT()
  const toast = useUi((s) => s.toast)
  const photos = useLiveQuery(() => db.photos.orderBy('at').reverse().toArray(), []) ?? []
  const [view, setView] = useState<PhotoView>('side')
  const [adding, setAdding] = useState(false)
  const [compare, setCompare] = useState<string[]>([])
  const [open, setOpen] = useState<Photo | null>(null)
  const camRef = useRef<HTMLInputElement>(null), libRef = useRef<HTMLInputElement>(null)
  const list = useMemo(() => photos.filter((p) => p.view === view), [photos, view])
  const onFile = async (f: File | undefined) => { if (!f) return; await photosRepo.addFromFile(f, view); setAdding(false); toast(t('toast.saved'), 'success') }
  const toggleCompare = (id: string) => setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c.slice(-1), id]))
  const pair = compare.map((id) => photos.find((p) => p.id === id)).filter(Boolean) as Photo[]
  const sorted = [...pair].sort((a, b) => a.at - b.at)
  return (
    <main className="page">
      <PageHeader title={t('photos.title')} back right={<Button size="sm" onClick={() => setAdding(true)}><Camera size={16} />{t('photos.add')}</Button>} />
      <div className="flex gap-2 mb-3">{(['side', 'front', 'back'] as PhotoView[]).map((v) => <Chip key={v} active={view === v} onClick={() => { setView(v); setCompare([]) }}>{t(`photos.${v}`)}</Chip>)}</div>
      {sorted.length === 2 && (
        <Card className="mb-3 p-2">
          <div className="grid grid-cols-2 gap-2">
            {sorted.map((p, i) => <div key={p.id}><Img blob={p.blob} className="w-full aspect-[3/4] object-cover rounded-xl" /><div className="text-xs text-center text-muted mt-1">{i === 0 ? t('photos.before') : t('photos.after')} · {fmtDate(p.dateKey, lang)}</div></div>)}
          </div>
        </Card>
      )}
      {!list.length ? <Empty text={t('photos.empty')} /> : <>
        <p className="text-xs text-muted mb-2">{t('photos.pick')} ({compare.length}/2)</p>
        <div className="grid grid-cols-3 gap-2">
          {list.map((p) => (
            <div key={p.id} className={`relative rounded-xl overflow-hidden border-2 ${compare.includes(p.id) ? 'border-accent' : 'border-transparent'}`}>
              <Img blob={p.thumb} className="w-full aspect-[3/4] object-cover" onClick={() => toggleCompare(p.id)} />
              <button onClick={() => setOpen(p)} className="absolute bottom-0 inset-x-0 bg-black/60 text-[11px] text-white min-h-8 text-center">{fmtDate(p.dateKey, lang)}</button>
            </div>
          ))}
        </div>
      </>}
      <BottomSheet open={adding} onClose={() => setAdding(false)} title={t('photos.add')}>
        {view === 'side' && <p className="text-sm text-muted mb-3">{t('photos.tipSide')}</p>}
        <div className="flex flex-col gap-2">
          <Button onClick={() => camRef.current?.click()}><Camera size={18} />{t('photos.takePhoto')}</Button>
          <Button variant="secondary" onClick={() => libRef.current?.click()}><Images size={18} />{t('photos.choose')}</Button>
        </div>
        <p className="text-xs text-muted flex items-center gap-1.5 mt-3"><Lock size={12} className="shrink-0" />{t('photos.private')}</p>
        <input ref={camRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = '' }} />
        <input ref={libRef} type="file" accept="image/*" className="hidden" onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = '' }} />
      </BottomSheet>
      <BottomSheet open={!!open} onClose={() => setOpen(null)} title={open ? fmtDate(open.dateKey, lang) : ''} tall>
        {open && <><Img blob={open.blob} className="w-full rounded-xl object-contain max-h-[70dvh]" /><Button variant="danger" className="w-full mt-3" onClick={async () => { if (await confirmSheet(t('photos.delete'), { body: t('common.confirmDelete'), danger: true, okLabel: t('common.delete') })) { await photosRepo.delete(open.id); setOpen(null) } }}><Trash2 size={18} />{t('photos.delete')}</Button></>}
      </BottomSheet>
    </main>
  )
}
