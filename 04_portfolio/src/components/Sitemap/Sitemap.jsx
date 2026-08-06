import React from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import styles from './Sitemap.module.css'
import StarBackground from '../StarBackground/StarBackground'
import MouseTrail from '../MouseTrail/MouseTrail'

const LANDING_SECTIONS = [
  { label: 'Hero / Intro', href: '/#hero' },
  { label: 'About Me', href: '/#about' },
  { label: '3D 360° Viewer', href: '/#three-sixty' },
  { label: 'Skills & Tech Stack', href: '/#skills' },
  { label: 'Featured Projects', href: '/#projects' },
  { label: 'Gallery', href: '/#gallery' },
  { label: 'Certificates & Milestones', href: '/#certificates' },
  { label: 'Experience & Timeline', href: '/#experience' },
  { label: 'Testimonials', href: '/#testimonials' },
  { label: 'Contact', href: '/#contact' },
]

const PLAYGROUNDS = [
  { label: 'AI Visualizer Hub', href: '/playground' },
  { label: 'Neural Network Playground', href: '/playground/nn' },
  { label: 'K-Means Clustering', href: '/playground/kmeans' },
  { label: 'PDF RAG Visualizer', href: '/playground/rag' },
  { label: 'Quantum Computing Playground', href: '/playground/quantum' },
  { label: 'Git Version Control Sandbox', href: '/playground/git' },
  { label: 'Gradient Descent Visualizer', href: '/playground/gradient' },
  { label: 'Mathematical Equation Visualizer', href: '/playground/equation' },
  { label: 'Fourier Series & Transform Visualizer', href: '/playground/fourier' },
]

const SOCIALS = [
  { label: 'LinkedIn Profile', href: 'https://linkedin.com/in/dronabopche', target: '_blank' },
  { label: 'GitHub Profile', href: 'https://github.com/dronabopche', target: '_blank' },
]

export default function Sitemap() {
  const navigate = useNavigate()

  return (
    <div className={styles.sitemapPage}>
      {/* Background & Cursor Effect */}
      <StarBackground />
      <MouseTrail />

      <header className={styles.header}>
        <motion.button 
          className={styles.backBtn}
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back to Home
        </motion.button>
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Sitemap
        </motion.h1>
        <motion.p 
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Explore all sections, playgrounds, and resources of this portfolio.
        </motion.p>
      </header>

      <main className={styles.mainGrid}>
        {/* Section 1: Landing Page Sections */}
        <motion.section 
          className={styles.card}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2 className={styles.sectionTitle}>Main Landing Sections</h2>
          <div className={styles.divider} />
          <ul className={styles.linksList}>
            {LANDING_SECTIONS.map((item, idx) => (
              <li key={idx}>
                <a href={item.href} className={styles.linkItem}>
                  <span className={styles.bullet}>✦</span> {item.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Section 2: AI & ML Playgrounds */}
        <motion.section 
          className={styles.card}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className={styles.sectionTitle}>Interactive Playgrounds</h2>
          <div className={styles.divider} />
          <ul className={styles.linksList}>
            {PLAYGROUNDS.map((item, idx) => (
              <li key={idx}>
                <motion.a 
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.href);
                  }}
                  className={styles.linkItem}
                >
                  <span className={styles.bullet}>🤖</span> {item.label}
                </motion.a>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Section 3: Social & External Profiles */}
        <motion.section 
          className={styles.card}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h2 className={styles.sectionTitle}>External Links & Socials</h2>
          <div className={styles.divider} />
          <ul className={styles.linksList}>
            {SOCIALS.map((item, idx) => (
              <li key={idx}>
                <a 
                  href={item.href}
                  target={item.target}
                  rel="noopener noreferrer"
                  className={styles.linkItem}
                >
                  <span className={styles.bullet}>🔗</span> {item.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.section>
      </main>

      <footer className={styles.sitemapFooter}>
        <p>© {new Date().getFullYear()} Drona Bopche. All rights reserved.</p>
      </footer>
    </div>
  )
}
