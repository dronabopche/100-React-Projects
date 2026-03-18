import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectCard from '../ProjectCard/ProjectCard'
import styles from './Projects.module.css'

const LANGS = ['All', 'Python', 'JavaScript', 'TypeScript', 'Jupyter', 'HTML', 'Other']

export default function Projects({ repos, loading, error }) {
  const [filter, setFilter] = useState('All')

  const filtered = repos.filter((r) => {
    if (filter === 'All') return true
    if (filter === 'Other') return !LANGS.slice(1, -1).includes(r.language)
    return r.language === filter
  })

  return (
    <motion.section
      className={styles.section}
      id="projects"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8 }}
    >
      <div className={styles.header}>
        <span className="section-label">✦ Work</span>
        <h2 className="section-title">GitHub Projects</h2>
        <div className="divider"><div className="divider-gem" /></div>
      </div>

      <div className={styles.filters}>
        {LANGS.map((lang) => (
          <motion.button
            key={lang}
            className={`${styles.pill} ${filter === lang ? styles.active : ''}`}
            onClick={() => setFilter(lang)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            {lang}
          </motion.button>
        ))}
      </div>

      {loading && (
        <div className={styles.state}>
          <motion.div className={styles.spinner}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          />
          <span>Summoning repositories…</span>
        </div>
      )}

      {error && (
        <div className={styles.state}>
          <p className={styles.error}>⚠ {error}</p>
          <p className={styles.hint}>Set your GitHub username in <code>src/services/github.js</code></p>
        </div>
      )}

      {!loading && !error && (
        <AnimatePresence mode="wait">
          <motion.div key={filter} className={styles.grid}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filtered.length === 0
              ? <p className={styles.empty}>No repositories found.</p>
              : filtered.map((repo, i) => <ProjectCard key={repo.id} repo={repo} index={i} />)
            }
          </motion.div>
        </AnimatePresence>
      )}
    </motion.section>
  )
}
