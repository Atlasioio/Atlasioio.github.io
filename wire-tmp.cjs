const fs = require('fs')
const p = __dirname + '/src/data/content.ts'
let s = fs.readFileSync(p, 'utf8')
const before = s.length

const M = (src, caption) =>
  `          { src: '/work/goodreads/process/${src}.webp', caption: '${caption}' },`

/* ---- 1. Discover gets the audit and the architecture as it stands --------- */
const discoverAnchor = `It was the distance between a reader and the three things they do most.',
      },`
if (!s.includes(discoverAnchor)) throw new Error('discover anchor missing')
s = s.replace(
  discoverAnchor,
  `It was the distance between a reader and the three things they do most.',
        media: [
${M('audit-current', 'Audit of the live Android app. Four findings, each turned into a decision the redesign had to answer to.')}
${M('ia-before', 'The architecture as it stands: three jobs split across five tabs, every one of them ending in “More”, and no home at all for the reading.')}
        ],
      },`
)

/* ---- 2. Define gets the readers and the restraint call ------------------- */
const defineAnchor = `What changes is what the surface is for.',
      },`
if (!s.includes(defineAnchor)) throw new Error('define anchor missing')
s = s.replace(
  defineAnchor,
  `What changes is what the surface is for.',
        media: [
${M('personas', 'Two assumption personas, built from the teardown and public complaints. Labelled as assumptions rather than dressed up as research nobody ran.')}
${M('split', 'The restraint call: loved-and-untouchable on one side, cluttered-and-fixable on the other. Every change had to pass one test, that a reader returning after two years still knows where they are.')}
        ],
      },`
)

/* ---- 3. Develop: name the tab consolidation, add the two new artifacts ---- */
const tabSentence = `The Stack won: your books as a stack you reach into, covers doing the visual work, the library present and the current book obvious.`
if (!s.includes(tabSentence)) throw new Error('develop sentence missing')
s = s.replace(
  tabSentence,
  `${tabSentence} Structurally, five tabs and a drawer collapsed into four, with everything buried in “More” relocated rather than cut.`
)

const developMedia = `${M('explorations', 'Three whole home screens, built before committing to one. The Bookmark, The Ledger, and The Stack, which became the app.')}`
const oldDevelopMedia = `          { src: '/work/goodreads/process/explorations.webp', caption: 'Three whole home screens, built before committing to one. The Bookmark, The Ledger, and The Stack, which became the app.' },`
if (!s.includes(oldDevelopMedia)) throw new Error('develop media missing')
s = s.replace(
  oldDevelopMedia,
  `${developMedia}
${M('ia-after', 'The architecture after: four tabs, each job landing in one place, and reading finally given a tab of its own.')}
${M('design-system', 'One warm family so the covers can shout, including the mid-project reversal that killed the green accent.')}`
)

/* ---- 4. Drop the native design-system block, now that the artifact says it - */
const dsStart = s.indexOf('    designSystem: {', s.indexOf("id: 'goodreads'"))
if (dsStart < 0) throw new Error('designSystem block missing')
const dsEnd = s.indexOf('\n    },\n', dsStart) + '\n    },\n'.length
s = s.slice(0, dsStart) + s.slice(dsEnd)

fs.writeFileSync(p, s)
console.log(`content.ts ${before} -> ${s.length} chars`)
const seg = s.slice(s.indexOf("id: 'goodreads'"), s.indexOf("id: 'jobquest'"))
console.log('artifacts wired: ' + (seg.match(/process\//g) || []).length)
console.log('designSystem present: ' + seg.includes('designSystem'))
