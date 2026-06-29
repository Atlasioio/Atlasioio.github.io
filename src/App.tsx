import { Routes, Route, Navigate } from 'react-router-dom'
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
import { CaseStudy } from './pages/CaseStudy'

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
                  <Route path="/work/:slug" element={<CaseStudy />} />
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
