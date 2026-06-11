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
import Fort from './components/Fort/Fort'
import MouseTrail from './components/MouseTrail/MouseTrail'

export default function App() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isGameOpen, setIsGameOpen] = useState(false)
  
  // Theme state persisted in LocalStorage
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
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
        toggleTheme={toggleTheme} 
        theme={theme}
      />

      {/* Main Content */}
      <Hero />
      <About />
      <LiveProjects />
      <Skills />
      {isGameOpen && <Fort onClose={() => setIsGameOpen(false)} />}
      <Projects repos={repos} loading={loading} error={error} />
      <Gallery/>
      <Experience />
      <Contact />
      <Footer />
    </>
  )
}