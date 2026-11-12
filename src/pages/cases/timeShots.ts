/**
 * The Koitto case's screens, grouped into the strips the page shows: the key
 * flows, how each decision got there, and the directions drawn afterwards.
 *
 * Every frame keeps the label it was made under, so nothing drawn later reads
 * as past process:
 *   real     captured from the repo, a build or a design canvas from that date
 *   redrawn  rebuilt from memory in Nov 2026; the original wasn't saved
 *   rebuilt  a reconstruction from the app's own code
 *   new      drawn in Nov 2026; never part of the original work
 *   built    a notification the app really sends, drawn on a lock screen
 */

export const K = '/work/time/koitto'

export type Origin = 'real' | 'redrawn' | 'rebuilt' | 'new' | 'built'
export type Verdict = 'chosen' | 'set aside' | 'moved' | 'shipped'

export type Shot = {
  /** path under K, without the extension */
  src: string
  label: string
  note?: string
  origin?: Origin
  date?: string
  verdict?: Verdict
  /** a partial board rather than a whole phone screen */
  detail?: boolean
  /** a full-length scrolling page: cropped to a screen in the strip */
  tall?: boolean
}

export type Track = {
  id: string
  tab: string
  /** the situation someone is in when they reach this flow */
  when?: string
  intro: string
  shots: Shot[]
}

/* ---- The solution: the four key flows ---- */
export const FLOWS: Track[] = [
  {
    id: 'session',
    tab: 'Run a session',
    when: 'Sunday, 20:00. Sitting down to work on a research case.',
    intro:
      'What kind of time it is comes first, then a name, then the length. Once it starts there is nothing to press but a control you hold. At the end, one question.',
    shots: [
      { src: '01-session-flow/01-pick-a-category', label: 'Pick the kind of time', note: 'Swipe the arc. Each card is its category’s own gradient.' },
      { src: '01-session-flow/03-name-it-typed', label: 'Name it, or don’t', note: 'Optional. Recent names come back as one-tap chips.' },
      { src: '01-session-flow/04-set-the-length', label: 'Set the length, last', note: 'Drag the ruler. It shows when you’ll be done: 20:00 – 20:50.' },
      { src: '01-session-flow/05-set-the-length-wheels', label: 'Or tap for exact', note: 'Hours and minutes on two wheels.' },
      { src: '01-session-flow/07-running', label: 'Running', note: 'No pause. The only control is Hold to end.' },
      { src: '01-session-flow/09-finished', label: 'Finished', note: '50 min of deep work, 100% kept.' },
      { src: '01-session-flow/10-how-did-it-go', label: 'How did it go?', note: 'Rough to Perfect, on the same arc it started on.' },
      { src: '01-session-flow/13-summary', label: 'What it came to', note: 'Held, how it felt, today, the streak and the week.' },
    ],
  },
  {
    id: 'todo',
    tab: 'Plan it as a to-do',
    when: 'Sunday evening. Planning the week, and the swim that keeps slipping.',
    intro:
      'A to-do carries a category and a length, so starting one is a single tap. Ticking it lands on the day you did it, and the time spent on it stays with it.',
    shots: [
      { src: '02-todo-flow/01-todo-list', label: 'Today’s list', note: 'Grouped by category. Every row can start a session.' },
      { src: '02-todo-flow/03-new-todo-typed', label: 'A new to-do', note: '“Go for a swim”, as Move.' },
      { src: '02-todo-flow/04-pick-a-duration', label: 'How long it takes', note: 'The length a session from it will start at.' },
      { src: '02-todo-flow/05-repeat-on-weekends', label: 'When it comes back', note: 'Here, every weekend.' },
      { src: '02-todo-flow/06-added-to-the-list', label: 'On the list', note: 'Tagged Weekends, under Move.' },
      { src: '02-todo-flow/07-tap-a-todo', label: 'Tap a to-do', note: 'Start a session, mark it done, edit it.' },
      { src: '02-todo-flow/10-start-from-the-todo', label: 'Straight to the length', note: 'The session already knows its kind and name.' },
      { src: '02-todo-flow/11-tick-it-off', label: 'Tick it off', note: 'The tick lands on the day you did it.' },
      { src: '02-todo-flow/12-done-today', label: 'Done today', note: 'Folded away under the list, not deleted.' },
    ],
  },
  {
    id: 'record',
    tab: 'Read the record',
    when: 'Friday. “I have no idea where my week went.”',
    intro:
      'Every figure is stated against something: last week, a usual day, a total. Every figure and every day opens into what it is made of. Patterns wait behind a button.',
    shots: [
      { src: '03-me-flow/01-me-today', label: 'Today', note: 'When in the day, and against yesterday.' },
      { src: '03-me-flow/04-by-week', label: 'The week', note: '8h 22m, and 5h 34m more than last week.' },
      { src: '03-me-flow/05-week-sessions', label: 'A figure, opened', note: 'Sessions over six weeks, and where the time went.' },
      { src: '03-me-flow/07-week-streak', label: 'The streak', note: 'Five weeks of days, with runs joined up.' },
      { src: '03-me-flow/08-a-day-from-the-week', label: 'A day, opened', note: 'Tap a bar: what ran, and how much was held.' },
      { src: '03-me-flow/09-by-month', label: 'The month', note: 'One dot a day, in the colour the day mostly was.' },
      { src: '03-me-flow/15-what-the-record-shows', label: 'Patterns, on request', note: 'When you hold best, and what you cut short.' },
    ],
  },
  {
    id: 'away',
    tab: 'Away from the app',
    when: '20:18. The phone goes in a pocket, mid-session.',
    intro:
      'The end of a session is handed to the system the moment it starts, so it lands on the second with the phone asleep. To-do reminders arrive only on the days the to-do is due. The lock screens are drawn; the wording is the app’s own.',
    shots: [
      { src: '08-notifications/01-built-ios-lock-screen-session-ends', label: 'The session ends', note: '“50 min done. Say how it went?”', origin: 'built' },
      { src: '08-notifications/02-built-ios-lock-screen-todo-reminder', label: 'A to-do is due', note: '“30 min, when you are ready.”', origin: 'built' },
      { src: '08-notifications/03-built-android-lock-screen-session-ends', label: 'The same, on Android', note: 'Its own sound, on a “Session end” channel.', origin: 'built' },
      { src: '08-notifications/04-built-android-lock-screen-todo-reminder', label: 'A reminder, on Android', note: 'One repeating trigger per day it’s due.', origin: 'built' },
    ],
  },
]

/* ---- The process: how each decision got there ---- */
export const ITERATIONS: Track[] = [
  {
    id: 'category',
    tab: 'Choosing the category',
    intro:
      'Simpler pickers came first: a list, chips, tiles, a hand of cards, a stack, arrows. The arc won because it gives one category the whole card, so its colour leads, makes the choice feel like a moment rather than a form, and is the same gesture a session ends on. Later, the app also stopped guessing the category for you.',
    shots: [
      { src: '04-category-iterations/01-redrawn-a-plain-list', label: 'A plain list', note: 'Fastest to scan, but the card and its colour disappear.', origin: 'redrawn' },
      { src: '04-category-iterations/02-redrawn-chips-on-the-timer', label: 'Chips on the timer', origin: 'redrawn' },
      { src: '04-category-iterations/03-redrawn-tiles', label: 'Tiles', note: 'Everything at once, so no one choice feels like a moment.', origin: 'redrawn' },
      { src: '04-category-iterations/04-redrawn-a-hand-of-cards', label: 'A hand of cards', origin: 'redrawn' },
      { src: '04-category-iterations/05-redrawn-a-stack-of-cards', label: 'A stack of cards', origin: 'redrawn' },
      { src: '04-category-iterations/06-redrawn-one-card-with-arrows', label: 'One card, with arrows', origin: 'redrawn' },
      { src: '04-category-iterations/07-real-15-sep-the-first-arc', label: 'The first arc', note: 'On the session-flow canvas.', origin: 'real' },
      { src: '04-category-iterations/08-real-16-sep-the-prototype', label: 'The prototype', note: 'Clickable, the next day.', origin: 'real' },
      { src: '04-category-iterations/09-rebuilt-just-before-github-tall-cards-glow', label: 'Tall cards, a glow', note: 'No icons and no reflection yet.', origin: 'rebuilt' },
      { src: '04-category-iterations/10-real-7-oct-first-commit', label: 'The first commit', note: 'On a slightly violet black.', origin: 'real' },
      { src: '04-category-iterations/11-real-shipped-today', label: 'Shipped', note: 'The same arc on neutral black.', origin: 'real', verdict: 'shipped' },
    ],
  },
  {
    id: 'time',
    tab: 'Setting the time',
    intro:
      'At first the length came before the name. The order flipped, so a session is named before it is measured. A keypad read digits like a clock, so 1-3-0 meant 1:30, or 90 minutes, and it had to validate a string. Another version offered the usual lengths as chips, different for each kind of time. Two wheels replaced them.',
    shots: [
      { src: '05-time-iterations/01-real-15-sep-the-canvas', label: 'Length before name', note: 'A dense ruler, then “Name it”.', origin: 'real' },
      { src: '05-time-iterations/02-real-16-sep-the-prototype', label: 'The prototype', origin: 'real' },
      { src: '05-time-iterations/03-real-7-oct-to-today-the-ruler', label: 'The order flipped', note: 'Category, name, then length. Sparse ticks, and Start.', origin: 'real', verdict: 'shipped' },
      { src: '05-time-iterations/04-real-until-14-oct-tap-the-number-a-keypad', label: 'Tap the number: a keypad', origin: 'real', verdict: 'set aside' },
      { src: '05-time-iterations/05-real-until-14-oct-keypad-one-digit', label: 'One digit', note: 'Capped at 5 min to 3 h, so one digit said “At least 5 min”.', origin: 'real', verdict: 'set aside' },
      { src: '05-time-iterations/06-real-until-14-oct-keypad-reads-1-30-as-90-min', label: '1-3-0 reads as 90 min', note: 'Typed like a clock, read as a duration.', origin: 'real', verdict: 'set aside' },
      { src: '05-time-iterations/06b-presets-per-category', label: 'Presets for each kind of time', note: 'The usual lengths as chips, different for each category, and the number to type any other.', verdict: 'set aside' },
      { src: '05-time-iterations/07-real-from-15-oct-two-wheels', label: 'Two wheels', note: 'Hours and minutes. Nothing to validate.', origin: 'real', verdict: 'shipped' },
    ],
  },
  {
    id: 'figures',
    tab: 'The figures',
    intro:
      'Every round asked the same question of a figure: compared to what? Four treatments were drawn for the week’s figures. A small mark beside each one won; the others said the same thing three times, crowded a quiet page, or gave it two headlines.',
    shots: [
      { src: '06-data-viz-iterations/08-real-6-oct-figures-0-as-it-was', label: 'As it was', origin: 'real' },
      { src: '06-data-viz-iterations/09-real-6-oct-figures-1-a-change-not-a-number-set-aside', label: 'A change, not a number', note: 'Said the same kind of thing three times.', origin: 'real', verdict: 'set aside' },
      { src: '06-data-viz-iterations/10-real-6-oct-figures-2-a-mark-beside-it-chosen', label: 'A mark beside it', note: 'One small drawing per figure.', origin: 'real', verdict: 'chosen' },
      { src: '06-data-viz-iterations/11-real-6-oct-figures-3-mark-and-change-set-aside', label: 'Mark and change', note: '80pt rows instead of 62, and the busiest thing on a quiet page.', origin: 'real', verdict: 'set aside' },
      { src: '06-data-viz-iterations/12-real-6-oct-figures-4-one-promoted-set-aside', label: 'One promoted', note: 'Gave the page two headlines.', origin: 'real', verdict: 'set aside' },
      { src: '06-data-viz-iterations/25-real-15-oct-me-page-a-week-led-full-page', label: 'Me, led by the week', note: 'The whole page drawn three ways.', origin: 'real', tall: true },
      { src: '06-data-viz-iterations/26-real-15-oct-me-page-b-two-acts-full-page', label: 'Me, in two acts', origin: 'real', tall: true },
      { src: '06-data-viz-iterations/27-real-15-oct-me-page-c-cumulative-led-full-page', label: 'Me, led by the total', origin: 'real', tall: true },
    ],
  },
  {
    id: 'streak',
    tab: 'Streak and colour',
    intro:
      'A month with dates was the familiar option, but “what about the 14th?” isn’t a question anyone asks a timer. Half a year answered a different question, whether the habit is taking, so it moved to Patterns. On the bars, a gradient everywhere turned into a blob at 11pt.',
    shots: [
      { src: '06-data-viz-iterations/16-real-6-oct-streak-a-runs-welded-chosen', label: 'Runs joined up', note: 'Five weeks of days.', origin: 'real', verdict: 'chosen' },
      { src: '06-data-viz-iterations/17-real-6-oct-streak-b-the-month-with-dates-set-aside', label: 'The month, with dates', note: 'Familiar from other apps; the wrong question for a timer.', origin: 'real', verdict: 'set aside' },
      { src: '06-data-viz-iterations/18-real-6-oct-streak-c-half-a-year-moved-to-patterns', label: 'Half a year', note: 'Whether the habit is taking. A different question.', origin: 'real', verdict: 'moved' },
      { src: '06-data-viz-iterations/22-real-6-oct-bars-a-flat-colour-detail', label: 'Bars: flat colour', origin: 'real', detail: true },
      { src: '06-data-viz-iterations/23-real-6-oct-bars-b-gradient-on-the-bar-chosen-detail', label: 'Bars: gradient on the bar', origin: 'real', verdict: 'chosen', detail: true },
      { src: '06-data-viz-iterations/24-real-6-oct-bars-c-gradient-everywhere-set-aside-detail', label: 'Bars: gradient everywhere', note: 'At 11pt, four stops read as a blob.', origin: 'real', verdict: 'set aside', detail: true },
      { src: '06-data-viz-iterations/28-real-18-oct-empty-day-b-ghost-figures-detail', label: 'An empty day: ghosts', origin: 'real', detail: true },
      { src: '06-data-viz-iterations/29-real-18-oct-empty-day-d-real-values-detail', label: 'An empty day: real zeros', note: 'With one line under them.', origin: 'real', detail: true },
    ],
  },
]

/* ---- Looking back: directions drawn since, never part of the original work ---- */
export const DIRECTIONS: Track[] = [
  {
    id: 'live',
    tab: 'The session, outside the app',
    intro:
      'A session that keeps running on the lock screen, in the Dynamic Island and in Android’s status bar. The rules carry over: no pause or stop button anywhere, since ending early stays a hold inside the app; the bar draws down the way the ring does; the end asks how it went. Building it needs an ActivityKit extension on iOS and an ongoing notification on Android.',
    shots: [
      { src: '08-notifications/05-new-ios-lock-screen-live-session', label: 'Lock screen, running', note: '“32:14 left of 50 min.”', origin: 'new' },
      { src: '08-notifications/06-new-ios-dynamic-island-compact', label: 'Dynamic Island, compact', origin: 'new' },
      { src: '08-notifications/07-new-ios-dynamic-island-expanded', label: 'Dynamic Island, expanded', note: 'No pausing. Ends 20:50.', origin: 'new' },
      { src: '08-notifications/08-new-ios-dynamic-island-session-ends', label: 'Dynamic Island, the end', note: 'Say how it went.', origin: 'new' },
      { src: '08-notifications/09-new-ios-lock-screen-session-ended', label: 'Lock screen, ended', origin: 'new' },
      { src: '08-notifications/10-new-android-ongoing-notification', label: 'Android, ongoing', origin: 'new' },
      { src: '08-notifications/11-new-android-status-bar-chip', label: 'Android, status bar', origin: 'new' },
    ],
  },
  {
    id: 'pick',
    tab: 'Choosing, another way',
    intro: 'Four other ways to pick the kind of time, and what each would trade.',
    shots: [
      { src: '04-category-iterations/12-new-direction-a-dial', label: 'A dial', note: 'One thumb, one motion, and it looks like a timer. Labels on a curve read badly, and a sixth category has nowhere to go.', origin: 'new' },
      { src: '04-category-iterations/13-new-direction-words-only', label: 'Words only', note: 'The calmest. The gradient shrinks to a word, so colour stops leading.', origin: 'new' },
      { src: '04-category-iterations/14-new-direction-pick-by-colour', label: 'Pick by colour', note: 'Colour becomes the whole decision, so you have to remember which is which.', origin: 'new' },
      { src: '04-category-iterations/15-new-direction-suggested-first', label: 'Suggested first', note: 'One tap for the usual. But guessing for you is what the app stopped doing.', origin: 'new' },
    ],
  },
  {
    id: 'length',
    tab: 'Setting the time, another way',
    intro: 'Five other ways to set a length, and what each would trade.',
    shots: [
      { src: '05-time-iterations/08-new-direction-three-lengths', label: 'Three lengths', note: 'No dragging, and the names persuade. Anything odd needs a second screen.', origin: 'new' },
      { src: '05-time-iterations/09-new-direction-a-stepper', label: 'A stepper', note: 'Plain and accessible. From 25 to 90 is thirteen taps.', origin: 'new' },
      { src: '05-time-iterations/10-new-direction-a-kitchen-timer', label: 'A kitchen timer', note: 'The most physical. Past an hour it needs a second lap.', origin: 'new' },
      { src: '05-time-iterations/11-new-direction-until-when', label: 'Until when', note: 'Answers when you’ll be free. The length becomes a side note.', origin: 'new' },
      { src: '05-time-iterations/12-new-direction-block-out-the-time', label: 'Block out the time', note: 'Sits the session beside the day. Needs calendar access, which the app has never asked for.', origin: 'new' },
    ],
  },
  {
    id: 'read',
    tab: 'The record, another way',
    intro: 'Four other ways to show where the time went, and what each would trade.',
    shots: [
      { src: '06-data-viz-iterations/30-new-direction-the-day-as-a-clock', label: 'The day as a clock', note: 'Shows when, not just how much. Short sessions become slivers.', origin: 'new' },
      { src: '06-data-viz-iterations/31-new-direction-where-it-went-as-a-ring', label: 'Where it went, as a ring', note: 'The mix at a glance. Silent on whether the week beat the last.', origin: 'new' },
      { src: '06-data-viz-iterations/32-new-direction-said-not-drawn', label: 'Said, not drawn', note: 'Exactly the app’s voice. Nothing to scan, so every visit is reading.', origin: 'new' },
      { src: '06-data-viz-iterations/33-new-direction-the-week-as-lanes', label: 'The week as lanes', note: 'Time-of-day patterns jump out. Most of it is empty track.', origin: 'new' },
    ],
  },
]

/* ---- Edge cases ---- */
export type Edge = { q: string; a: string; shot?: string }
export const EDGES: Edge[] = [
  {
    q: 'You want to stop early',
    a: 'Hold for over a second; “Keep holding…” says what is happening, and letting go too soon changes nothing. It is logged as what you kept, 90% here, in amber.',
    shot: '01-session-flow/15-hold-to-end-early',
  },
  {
    q: 'It ended early',
    a: 'Shown at its real length, as a shorter column in the week. Never red: going down is information, not an error.',
    shot: '01-session-flow/16-ended-early-never-red',
  },
  {
    q: 'You leave mid-session',
    a: 'The end is handed to the system when the session starts, so it lands on time with the phone asleep. Open the app and you’re back in the running session.',
    shot: '08-notifications/01-built-ios-lock-screen-session-ends',
  },
  {
    q: 'Nothing is planned yet',
    a: 'An empty day isn’t an empty list. It asks “What will this day be for?”, with every kind of time one tap from a new to-do.',
    shot: '02-todo-flow/20-empty-day-ahead',
  },
  {
    q: 'A task never ends',
    a: '“Always there” never leaves the list. Each tick is logged, and the hours underneath are its progress: 10h 15m over 17 sessions.',
    shot: '02-todo-flow/09-time-on-this',
  },
  {
    q: 'Play runs long',
    a: 'Play gets a length like anything else, but for play the length is a ceiling, not a target.',
  },
  {
    q: 'There’s no connection',
    a: 'Everything lives on the device and is written twice, so an interrupted write can’t lose a record. No account, no server.',
  },
  {
    q: 'You’re in a browser',
    a: 'Reminders are left out on the web: a browser has no scheduler that survives the tab closing, and a reminder that only arrives while you’re looking isn’t one.',
  },
  {
    q: 'Colour doesn’t reach you',
    a: 'Status is never colour alone: always a word, a number or a mark beside it. Every control carries a label for screen readers.',
  },
]

/* ---- The problem: four problems behind the complaints ---- */
export const PROBLEMS: { h: string; quotes: string[]; so: string; tone: 'pink' | 'green' | 'blue' | 'gold' }[] = [
  {
    h: 'Nothing holds you to the session.',
    quotes: ['I’d just ignore it when it rang', 'I paused it and never came back', 'One hour of gaming turned into four'],
    so: 'No pause. Ending early means holding a button, and Play’s length is a ceiling.',
    tone: 'pink',
  },
  {
    h: 'Nothing is kept afterwards.',
    quotes: ['I have no idea where my week went', 'It’s a stopwatch, not a record', 'Finishing a session felt like nothing'],
    so: 'A record of time set aside against time held, which you can read back.',
    tone: 'blue',
  },
  {
    h: 'No sense of whether it went well.',
    quotes: ['Did that session even go well?', '25 minutes, whether I’m in flow or not'],
    so: 'One question at the end, and a length you choose.',
    tone: 'gold',
  },
  {
    h: 'The tools don’t fit how the day splits.',
    quotes: ['Doing my taxes counted the same as deep work', 'My to-do list and my timer don’t know each other'],
    so: 'Admin is its own category, rest and play count too, and sessions start from to-dos.',
    tone: 'green',
  },
]

/* ---- The process, step by step ---- */
export const TIMELINE: [string, string][] = [
  ['Canvas', 'The session flow on one canvas, as a timer for myself: the arc, the ruler, naming, the session, the rating, the summary.'],
  ['Prototype', 'A clickable prototype of the session flow.'],
  ['Opening it up', 'Deciding to launch it for others: what would bring people back? The to-do list and the record came from that question.'],
  ['Option sheets', 'View by view, the current design beside its alternatives and what each would cost: naming, the to-do list, the figures on Me, and more.'],
  ['First build', 'The app in code, built from the canvas and the sheets.'],
  ['Two wheels', 'Wheels replace the keypad, and Me is drawn three ways.'],
  ['On the web', 'Live as an installable web app, 206 commits in.'],
  ['Next: the stores', 'iOS and Android builds for the App Store and Google Play.'],
]

/* ---- Details that make it yours ---- */
export const DETAILS: Edge[] = [
  {
    q: 'Colours that start right, and end up yours.',
    a: 'Every kind of time comes with a suggested colour, and it follows that time everywhere: the card you pick, the running session, the bars in your week, the dot on a day. Change any of them, hide the ones you don’t use, or add your own. Reading, Cooking or Study come ready with an icon and a colour that won’t clash.',
    shot: '03-me-flow/17-settings',
  },
  {
    q: 'An aim that doesn’t nag.',
    a: 'Set how many hours you want to hold in a week. It shows on Me, and nothing pings you about it. How a session ends is up to you as well: a chime, a buzz, or both.',
    shot: '03-me-flow/18-settings-further-down',
  },
  {
    q: 'Your record stays yours.',
    a: 'No account and no server. Everything lives on your phone, updates never touch it, and a backup is one tap. Hide a category you’ve stopped using and its history stays.',
    shot: '03-me-flow/13-since-you-started',
  },
]
