import sharp from 'sharp'
import { readFileSync } from 'node:fs'
const svg = readFileSync(new URL('../public/icons/icon.svg', import.meta.url))
const out = (n) => new URL(`../public/icons/${n}`, import.meta.url).pathname
await sharp(svg).resize(192, 192).png().toFile(out('icon-192.png'))
await sharp(svg).resize(512, 512).png().toFile(out('icon-512.png'))
await sharp(svg).resize(180, 180).flatten({ background: '#09090b' }).png().toFile(out('apple-touch-icon-180.png'))
// maskable: pad 20% safe zone
const inner = await sharp(svg).resize(410, 410).png().toBuffer()
await sharp({ create: { width: 512, height: 512, channels: 4, background: '#09090b' } })
  .composite([{ input: inner, left: 51, top: 51 }]).png().toFile(out('icon-512-maskable.png'))
console.log('icons written')
