// Renders figures to a PNG contact sheet for visual review.
// Usage: node scripts/figures-sheet.ts [out.png] [id1 id2 ...]   (no ids = all)
import sharp from 'sharp'
import { FIGURES } from '../src/data/figures/index.ts'
import { renderSvg } from '../src/figure/render.ts'

const [, , outArg, ...ids] = process.argv
const out = outArg && outArg.endsWith('.png') ? outArg : 'scripts/out/figures.png'
const list = (ids.length ? ids : Object.keys(FIGURES)).filter((id) => FIGURES[id])
if (!list.length) { console.error('no figures'); process.exit(1) }
const cell = 240, pad = 8, labelH = 22, cols = 3 // start | end | mistake?
const rowH = cell + labelH + pad
const w = cols * (cell + pad) + pad, h = list.length * rowH + pad
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#09090b"/>`
list.forEach((id, row) => {
  const f = FIGURES[id]
  const y = pad + row * rowH
  svg += `<text x="${pad}" y="${y + 15}" fill="#fafafa" font-family="Helvetica, Arial, sans-serif" font-size="14" font-weight="bold">${id}</text>`
  const frames = [['start', f.start], ['end', f.end], f.mistake ? ['mistake', f.mistake] : null].filter(Boolean) as [string, typeof f.start][]
  frames.forEach(([name, fr], col) => {
    const x = pad + col * (cell + pad)
    const inner = renderSvg(f, fr.joints, fr.note).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')
    svg += `<g transform="translate(${x} ${y + labelH})">${inner}</g><text x="${x + 4}" y="${y + labelH + cell - 6}" fill="#a1a1aa" font-family="Helvetica, Arial, sans-serif" font-size="11">${name}</text>`
  })
})
svg += '</svg>'
await sharp(Buffer.from(svg)).png().toFile(out)
console.log(`${out} (${list.length} figures)`)
