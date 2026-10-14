import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { MenuProvider } from './context/MenuContext'
import { LangProvider } from './context/LangContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import { StartModalProvider } from './context/StartModalContext'
import { ServiceModalProvider } from './context/ServiceModalContext'
import { CustomCursor } from './components/CustomCursor/CustomCursor'
import { StartProjectModal } from './components/StartProjectModal/StartProjectModal'
import { ServiceModal } from './components/ServiceModal/ServiceModal'
import { Home } from './pages/Home'
import { AllWork } from './pages/AllWork'
import { About } from './pages/About'
import { CaseStudy } from './pages/CaseStudy'
import { TimeCase } from './pages/cases/TimeCase'
import { GoodreadsCase } from './pages/cases/GoodreadsCase'
import { SherryCase } from './pages/cases/SherryCase'
import { EcoTripCase } from './pages/cases/EcoTripCase'
import { TeemCase } from './pages/cases/TeemCase'
import { JobquestCase } from './pages/cases/JobquestCase'

export default function App() {
  return (
    <LangProvider>
      <ThemeProvider>
        <ToastProvider>
          <MenuProvider>
            <StartModalProvider>
              <ServiceModalProvider>
                <CustomCursor />
                <StartProjectModal />
                <ServiceModal />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/work" element={<AllWork />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/work/:slug" element={<CaseRoute />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </ServiceModalProvider>
            </StartModalProvider>
          </MenuProvider>
        </ToastProvider>
      </ThemeProvider>
    </LangProvider>
  )
}

/** Case studies with their own bespoke page; the rest use the shared template. */
function CaseRoute() {
  const { slug } = useParams()
  if (slug === 'time') return <TimeCase />
  if (slug === 'goodreads') return <GoodreadsCase />
  if (slug === 'sherry') return <SherryCase />
  if (slug === 'ecotrip') return <EcoTripCase />
  if (slug === 'jobquest') return <JobquestCase />
  if (slug === 'teem') return <TeemCase />
  return <CaseStudy />
}
