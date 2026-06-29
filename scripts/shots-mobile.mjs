import puppeteer from 'puppeteer'

const URL = 'https://goodness-jargon-613166.framer.app/'
const OUT = 'public/work/reel'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const shot = (page, name) =>
  page.screenshot({ path: `${OUT}/${name}.webp`, type: 'webp', quality: 92 })

async function hideBadge(page) {
  await page.evaluate(() => {
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
async function frame(page, heading, off = 60) {
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
const m = await browser.newPage()
await m.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await m.goto(URL, { waitUntil: 'networkidle2', timeout: 90000 })
await sleep(1800)
await settle(m)
await hideBadge(m)
await frame(m, 'About')
await shot(m, 'm-about')
// Footer / contact — scroll to the bottom of the page.
await m.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await sleep(900)
await shot(m, 'm-contact')
await browser.close()
console.log('done')
