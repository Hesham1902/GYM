import { db, withRetry } from '../db'
import type { Photo, PhotoView } from '@/types'
import { uid } from '@/utils/id'
import { dateKey } from '@/utils/date'

export const photosRepo = {
  all: () => withRetry(() => db.photos.orderBy('at').reverse().toArray()),
  byView: (v: PhotoView) => withRetry(() => db.photos.where('view').equals(v).reverse().sortBy('at')),
  get: (id: string) => withRetry(() => db.photos.get(id)),
  delete: (id: string) => withRetry(() => db.photos.delete(id)),
  addFromFile: async (file: File, view: PhotoView): Promise<Photo> => {
    const blob = await downscale(file, 1280, 0.82)
    const thumb = await downscale(file, 320, 0.7)
    const p: Photo = { id: uid(), dateKey: dateKey(), view, blob, thumb, at: Date.now() }
    await withRetry(() => db.photos.put(p))
    return p
  },
}

async function downscale(file: Blob, max: number, q: number): Promise<Blob> {
  const bmp = await createImageBitmap(file).catch(() => null)
  if (!bmp) return file
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height))
  const w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale)
  const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h
  canvas.getContext('2d')!.drawImage(bmp, 0, 0, w, h)
  bmp.close?.()
  return new Promise((res) => canvas.toBlob((b) => res(b ?? file), 'image/jpeg', q))
}
