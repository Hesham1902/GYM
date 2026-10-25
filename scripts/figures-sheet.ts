// Renders figures to a PNG contact sheet for visual review.
// Usage: node scripts/figures-sheet.ts [out.png] [id1 id2 ...]   (no ids = all)
import sharp from 'sharp'
import { FIGURES } from '../src/data/figures/index.ts'
import { fitBox, renderInner } from '../src/figure/render.ts'

const [, , outArg, ...ids] = process.argv
const out = outArg && outArg.endsWith('.png') ? outArg : 'scripts/out/figures.png'
const list = (ids.length ? ids : Object.keys(FIGURES)).filter((id) => FIGURES[id])
if (!list.length) { console.error('no figures'); process.exit(1) }
const cell = 240, cellH = 180, pad = 8, labelH = 22, cols = 3 // start | end | mistake?, each cell 4:3 like the app frame
const rowH = cellH + labelH + pad
const w = cols * (cell + pad) + pad, h = list.length * rowH + pad
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#09090b"/>`
list.forEach((id, row) => {
  const f = FIGURES[id]
  const y = pad + row * rowH
  svg += `<text x="${pad}" y="${y + 15}" fill="#fafafa" font-family="Helvetica, Arial, sans-serif" font-size="14" font-weight="bold">${id}</text>`
  const frames = [['start', f.start], ['end', f.end], f.mistake ? ['mistake', f.mistake] : null].filter(Boolean) as [string, typeof f.start][]
  frames.forEach(([name, fr], col) => {
    const x = pad + col * (cell + pad)
    // each cell is a nested 4:3 <svg> with the same crop the app's media frame uses (zoom, or the automatic fit)
    svg += `<rect x="${x}" y="${y + labelH}" width="${cell}" height="${cellH}" fill="#18181b"/><svg x="${x}" y="${y + labelH}" width="${cell}" height="${cellH}" viewBox="${fitBox(f).join(' ')}" preserveAspectRatio="xMidYMid meet">${renderInner(f, fr.joints, fr.note)}</svg><text x="${x + 4}" y="${y + labelH + cellH - 6}" fill="#a1a1aa" font-family="Helvetica, Arial, sans-serif" font-size="11">${name}</text>`
  })
})
svg += '</svg>'
await sharp(Buffer.from(svg)).png().toFile(out)
console.log(`${out} (${list.length} figures)`)
