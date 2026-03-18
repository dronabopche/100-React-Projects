import { motion } from 'framer-motion'
import styles from './Footer.module.css'

const NAV = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  const name = 'Cherry'

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
            AI/ML Developer · Builder · Creator
          </span>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {NAV.map((n) => (
            <a key={n.label} href={n.href} className={styles.navLink}>
              {n.label}
            </a>
          ))}
        </nav>

        {/* Social */}
        <div className={styles.social}>
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            GitHub ↗
          </a>
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