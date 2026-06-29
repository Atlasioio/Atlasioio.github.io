import puppeteer from 'puppeteer'
import { mkdirSync } from 'node:fs'

const URL = 'https://goodness-jargon-613166.framer.app/'
const OUT = 'public/work/reel'
mkdirSync(OUT, { recursive: true })

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const shot = (page, name, opts = {}) =>
  page.screenshot({ path: `${OUT}/${name}.webp`, type: 'webp', quality: 92, ...opts })

async function hideBadge(page) {
  await page.evaluate(() => {
    const s = document.createElement('style')
    s.textContent =
      '#__framer-badge-container,.framer-badge,[data-framer-badge-container]{display:none!important}'
    document.head.appendChild(s)
    document.querySelectorAll('a[href*="framer.com"]').forEach((a) => {
      let n = a
      while (n && n !== document.body) {
        const pos = getComputedStyle(n).position
        if (pos === 'fixed' || pos === 'sticky') {
          n.style.setProperty('display', 'none', 'important')
          break
        }
        n = n.parentElement
      }
    })
  })
}

async function settle(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0
      const id = setInterval(() => {
        window.scrollBy(0, 500)
        y += 500
        if (y >= document.body.scrollHeight + 1000) {
          clearInterval(id)
          resolve()
        }
      }, 110)
    })
  })
  await page.evaluate(() => window.scrollTo(0, 0))
  await sleep(1000)
}

async function frame(page, heading, off = 90) {
  await page.evaluate(
    (txt, o) => {
      const el = [...document.querySelectorAll('h1,h2,h3')].find((e) =>
        e.textContent.trim().toLowerCase().startsWith(txt.toLowerCase()),
      )
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - o)
    },
    heading,
    off,
  )
  await sleep(700)
}

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })

// ---- Desktop (1.5x → crisp but light) ----
const d = await browser.newPage()
await d.setViewport({ width: 1512, height: 950, deviceScaleFactor: 2 })
await d.goto(URL, { waitUntil: 'networkidle2', timeout: 90000 })
await sleep(1800)
await settle(d)
await hideBadge(d)
await d.evaluate(() => window.scrollTo(0, 0))
await sleep(500)
await shot(d, 'd-hero')
await frame(d, 'About')
await shot(d, 'd-about')
await frame(d, 'Services')
await shot(d, 'd-services')
await frame(d, 'Projects')
await shot(d, 'd-projects')
await d.setViewport({ width: 1512, height: 950, deviceScaleFactor: 1 })
await hideBadge(d)
await shot(d, 'd-full', { fullPage: true })

// ---- Mobile ----
const m = await browser.newPage()
await m.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await m.goto(URL, { waitUntil: 'networkidle2', timeout: 90000 })
await sleep(1800)
await settle(m)
await hideBadge(m)
await m.evaluate(() => window.scrollTo(0, 0))
await sleep(500)
await shot(m, 'm-hero')
await frame(m, 'Services', 60)
await shot(m, 'm-services')
await frame(m, 'Projects', 60)
await shot(m, 'm-projects')
await m.setViewport({ width: 390, height: 844, deviceScaleFactor: 1.5, isMobile: true, hasTouch: true })
await hideBadge(m)
await shot(m, 'm-full', { fullPage: true })

await browser.close()
console.log('done')
