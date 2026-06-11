import { useState, useEffect } from 'react'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Skills from './components/Skills/Skills'
import Projects from './components/Projects/Projects'
import Experience from './components/Experience/Experience'
import Gallery from './components/Gallery/Gallery'
import LiveProjects from './components/LiveProjectCard/LiveProject'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'
import { fetchRepos } from './services/github'
import StarBackground from './components/StarBackground/StarBackground'
import Sidebar from './components/Sidebar/Sidebar'
import GestureRealityController from './components/GestureReality/GestureRealityController'
import MouseTrail from './components/MouseTrail/MouseTrail'
import SettingsModal from './components/SettingsModal/SettingsModal'
import Testimonials from './components/Testimonials/Testimonials'
import MountainVistaParallax from './components/MountainVistaParallax/MountainVistaParallax'

export default function App() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isGameOpen, setIsGameOpen] = useState(false)
  const [isVistaOpen, setIsVistaOpen] = useState(false)
  
  // Theme state persisted in LocalStorage
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  
  // Animation settings and states
  const [themeAnimation, setThemeAnimation] = useState(() => localStorage.getItem('themeAnimation') || 'wave')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Font state persisted in LocalStorage
  const [activeFont, setActiveFont] = useState(() => localStorage.getItem('activeFont') || 'garamond')

  const FONT_MAP = {
    garamond: "'EB Garamond', Georgia, serif",
    inter: "'Inter', system-ui, -apple-system, sans-serif",
    cormorant: "'Cormorant Garamond', Georgia, serif"
  }

  useEffect(() => {
    // Sync the DOM attribute immediately if not already set by view transition
    if (document.documentElement.getAttribute('data-theme') !== theme) {
      document.documentElement.setAttribute('data-theme', theme)
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('themeAnimation', themeAnimation)
  }, [themeAnimation])

  useEffect(() => {
    localStorage.setItem('activeFont', activeFont)
    document.documentElement.style.setProperty('--font-family-body', FONT_MAP[activeFont] || FONT_MAP.garamond)
  }, [activeFont])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    
    // Fallback if browser doesn't support View Transitions
    if (!document.startViewTransition) {
      document.documentElement.setAttribute('data-theme', newTheme)
      setTheme(newTheme)
      return
    }

    // Set animation type for CSS
    document.documentElement.setAttribute('data-animation', themeAnimation)

    // Trigger transition
    document.startViewTransition(() => {
      document.documentElement.setAttribute('data-theme', newTheme)
      setTheme(newTheme)
    })
  }

  useEffect(() => {
    async function load() {
      try {
        const repoData = await fetchRepos()
        setRepos(repoData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <>
      {/* Global Cursor Trail */}
      <MouseTrail />

      {/* Background Layer */}
      <StarBackground />

      {/* Floating Sidebar */}
      <Sidebar 
        openGame={() => setIsGameOpen(true)} 
        openVista={() => setIsVistaOpen(true)}
        toggleTheme={toggleTheme} 
        theme={theme}
      />

      {/* Main Content */}
      <Hero />
      <About />
      <LiveProjects />
      <Skills />
      {isGameOpen && <GestureRealityController theme={theme} onClose={() => setIsGameOpen(false)} />}
      {isVistaOpen && <MountainVistaParallax theme={theme} onClose={() => setIsVistaOpen(false)} />}
      <Projects repos={repos} loading={loading} error={error} />
      <Gallery/>
      <Experience />
      <Testimonials />
      <Contact />
      <Footer openSettings={() => setIsSettingsOpen(true)} />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        currentAnimation={themeAnimation}
        onSelectAnimation={setThemeAnimation}
        currentFont={activeFont}
        onSelectFont={setActiveFont}
      />
    </>
  )
}