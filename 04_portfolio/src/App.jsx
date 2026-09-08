import { useState, useEffect } from 'react'
import Lenis from 'lenis'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Skills from './components/Skills/Skills'
import Projects from './components/Projects/Projects'
import Experience from './components/Experience/Experience'
import Gallery from './components/Gallery/Gallery'
import Certificates from './components/Certificates/Certificates'
import LiveProjects from './components/LiveProjectCard/LiveProject'
import ThreeSixtyViewer from './components/ThreeSixtyViewer/ThreeSixtyViewer'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'
import { fetchRepos } from './services/github'
import StarBackground from './components/StarBackground/StarBackground'
import Sidebar from './components/Sidebar/Sidebar'
import GestureRealityController from './components/GestureReality/GestureRealityController'
import MouseTrail from './components/MouseTrail/MouseTrail'
import SettingsModal from './components/SettingsModal/SettingsModal'
import Testimonials from './components/Testimonials/Testimonials'
import AiVisualizerHub from './playgrounds/AiVisualizerHub/AiVisualizerHub'
import { Routes, Route, useNavigate } from 'react-router-dom'
import PdfRagVisualizer from './playgrounds/PdfRagVisualizer/PdfRagVisualizer'
import NeuralNetworkPlayground from './playgrounds/NeuralNetworkPlayground/NeuralNetworkPlayground'
import KMeansPlayground from './playgrounds/KMeansPlayground/KMeansPlayground'
import QuantumPlayground from './playgrounds/QuantumPlayground/QuantumPlayground'
import GitSandbox from './playgrounds/GitSandbox/GitSandbox'
import GradientDescentPlayground from './playgrounds/GradientDescentPlayground/GradientDescentPlayground'
import EquationVisualizerPlayground from './playgrounds/EquationVisualizer/EquationVisualizerPlayground'
import FourierVisualizerPlayground from './playgrounds/FourierVisualizer/FourierVisualizerPlayground'
import Sitemap from './components/Sitemap/Sitemap'



export default function App() {
  const navigate = useNavigate()
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isGameOpen, setIsGameOpen] = useState(false)

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

  // Initialize Lenis smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease-out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
    })

    let animationFrameId
    function raf(time) {
      lenis.raf(time)
      animationFrameId = requestAnimationFrame(raf)
    }

    animationFrameId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(animationFrameId)
      lenis.destroy()
    }
  }, [])

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
    <Routes>
      <Route path="/playground/nn" element={<NeuralNetworkPlayground theme={theme} isStandalone={true} />} />
      <Route path="/playground/kmeans" element={<KMeansPlayground theme={theme} isStandalone={true} />} />
      <Route path="/playground/rag" element={<PdfRagVisualizer theme={theme} isStandalone={true} />} />
      <Route path="/playground/quantum" element={<QuantumPlayground theme={theme} isStandalone={true} />} />
      <Route path="/playground/git" element={<GitSandbox theme={theme} isStandalone={true} />} />
      <Route path="/playground/gradient" element={<GradientDescentPlayground theme={theme} isStandalone={true} />} />
      <Route path="/playground/equation" element={<EquationVisualizerPlayground theme={theme} isStandalone={true} />} />
      <Route path="/playground/fourier" element={<FourierVisualizerPlayground theme={theme} isStandalone={true} />} />

      <Route path="/playground" element={<AiVisualizerHub theme={theme} isStandalone={true} />} />
      <Route path="/sitemap" element={<Sitemap />} />
      <Route path="/" element={
        <>
          {/* Background Layer */}
          <StarBackground />

          {/* Floating Sidebar */}
          <Sidebar
            openGame={() => setIsGameOpen(true)}
            openVisualizerHub={() => navigate('/playground')}
            toggleTheme={toggleTheme}
            theme={theme}
          />

          {/* Main Content */}
          <Hero />
          <About />
          <LiveProjects />
          <Skills />
          {isGameOpen && <GestureRealityController theme={theme} onClose={() => setIsGameOpen(false)} />}
          <Projects repos={repos} loading={loading} error={error} />
          <Gallery />
          <Certificates />
          <Experience />
          <Testimonials />
          <ThreeSixtyViewer theme={theme} />
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
      } />
    </Routes>
  )
}