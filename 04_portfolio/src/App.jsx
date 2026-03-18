import { useState, useEffect } from 'react'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Skills from './components/Skills/Skills'
import Projects from './components/Projects/Projects'
import Experience from './components/Experience/Experience'
import Gallery from './components/Gallery/Gallery'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'
import { fetchRepos } from './services/github'
import StarBackground from './components/StarBackground/StarBackground'

export default function App() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
      {/* Background Layer */}
      <StarBackground />

      {/* Main Content */}
      <Hero />
      <About />
      <Skills />
      <Projects repos={repos} loading={loading} error={error} />
      <Gallery/>
      <Experience />
      <Contact />
      <Footer />
    </>
  )
}