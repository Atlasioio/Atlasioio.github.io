import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const OUT = 'public/work/teem'
mkdirSync(OUT, { recursive: true })
const base = 'https://www.lukasahlse.com/case-studies/teem'

const assets = [
  'hero',
  'logo',
  'packaging',
  'leaflet-cover',
  'leaflet-back',
  'leaflet-spread',
  'leaflet-cover-mockup',
  'process-name',
  'process-logo',
  'process-packaging',
  'process-leaflet',
]

for (const name of assets) {
  try {
    const res = await fetch(`${base}/${name}.png`)
    if (!res.ok) {
      console.log(name, 'HTTP', res.status)
      continue
    }
    const buf = Buffer.from(await res.arrayBuffer())
    const info = await sharp(buf)
      .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 88 })
      .toFile(`${OUT}/${name}.webp`)
    console.log(name, '->', info.width + 'x' + info.height, Math.round(info.size / 1024) + 'KB')
  } catch (e) {
    console.log(name, 'FAIL', e.message)
  }
}
