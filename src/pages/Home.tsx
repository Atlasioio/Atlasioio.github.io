import { useState } from 'react'
import { useLenis } from '../hooks/useLenis'
import { Loader } from '../components/Loader/Loader'
import { Nav } from '../components/nav/Nav'
import { FixedControls } from '../components/nav/FixedControls'
import { LangFixed } from '../components/nav/LangFixed'
import { Menu } from '../components/nav/Menu'
import { Hero } from '../components/sections/Hero'
import { Marquee } from '../components/sections/Marquee'
import { Studio } from '../components/sections/Studio'
import { Services } from '../components/sections/Services'
import { Work } from '../components/sections/Work'
import { Credibility } from '../components/sections/Credibility'
import { Process } from '../components/sections/Process'
import { Footer } from '../components/sections/Footer'

/** The marketing homepage (route "/"). */
export function Home() {
  // `started` flips once the loader finishes (or immediately under reduced
  // motion) → triggers the hero's clip-reveal.
  const [started, setStarted] = useState(false)

  useLenis()

  return (
    <>
      <Loader onDone={() => setStarted(true)} />

      <Nav />
      <FixedControls />
      <LangFixed />
      <Menu />

      <main id="top">
        <Hero started={started} />
        <Marquee />
        <Studio />
        <Services />
        <Work />
        <Credibility />
        <Process />
        <Footer />
      </main>
    </>
  )
}
