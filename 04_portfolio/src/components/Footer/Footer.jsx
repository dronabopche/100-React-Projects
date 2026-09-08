import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

const NAV = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Gallery', href: '#gallery' },
  // { label: 'Certificates', href: '#certificates' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer({ openSettings }) {
  const year = new Date().getFullYear()

  const name = 'Drona Bopche'

  return (
    <motion.footer
      className={styles.footer}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className={styles.topBorder} />

      <div className={styles.inner}>
        {/* Brand */}
        <div className={styles.brand}>
          <span className={styles.brandName}>{name}</span>
          <span className={styles.brandSub}>
            Quantum Enthusiast · AI Engineer · ML Developer
          </span>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {NAV.map((n) => (
            <a key={n.label} href={n.href} className={styles.navLink}>
              {n.label}
            </a>
          ))}
          <Link to="/sitemap" className={styles.navLink}>
            Sitemap
          </Link>
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            onClick={openSettings}
            className={styles.settingsBtn}
            aria-label="Theme Settings"
            title="Theme Settings"
          >
            <svg 
              className={styles.settingsIcon} 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.75" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom */}
      <div className={styles.bottom}>
        <div className={styles.bottomLine} />

        <div className={styles.bottomInner}>
          <span>© {year} {name}. Built with React & Framer Motion.</span>
          <span className={styles.ornament}>✦</span>
          <span>Designed & Developed by {name}</span>
        </div>
      </div>
    </motion.footer>
  )
}