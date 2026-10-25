// Resize free-exercise-db photos into public/photos/<id>-0.jpg and <id>-1.jpg.
// Usage: node scripts/photos.mjs <mapping.json> <raw-dir> [width]
//   mapping.json: { "<ourId>": { "name": "...", "dir": "<DatasetDir>" }, ... }
//   raw-dir:      contains <ourId>/0.jpg and <ourId>/1.jpg per mapped id
import { readFile, mkdir, stat } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import sharp from 'sharp'

const [mappingPath, rawDir, widthArg] = process.argv.slice(2)
if (!mappingPath || !rawDir) {
  console.error('usage: node scripts/photos.mjs <mapping.json> <raw-dir> [width]')
  process.exit(1)
}
const width = Number(widthArg ?? 720)
const outDir = resolve('public/photos')
await mkdir(outDir, { recursive: true })

const mapping = JSON.parse(await readFile(mappingPath, 'utf8'))
let total = 0
let files = 0
for (const id of Object.keys(mapping)) {
  for (const i of [0, 1]) {
    const src = join(rawDir, id, `${i}.jpg`)
    const dest = join(outDir, `${id}-${i}.jpg`)
    await sharp(src)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality: 72, mozjpeg: true })
      .toFile(dest)
    total += (await stat(dest)).size
    files++
  }
}
console.log(`${files} files, ${(total / 1024 / 1024).toFixed(2)} MB at width ${width} -> ${outDir}`)
