import { motion } from 'motion/react'
import Globe from '../Globe/Globe'
import styles from './Contact.module.css'

export default function Contact({ theme = 'dark' }) {
  const isLight = theme === 'light'
  const links = [
    {
      label: 'LinkedIn Profile',
      href: 'https://linkedin.com/in/dronabopche',
    },
    {
      label: 'Kaggle Profile',
      href: 'https://kaggle.com/dronabopche',
    },
    {
      label: 'YouTube Channel',
      href: 'https://www.youtube.com/@cherry_rxch',
    },
    {
      label: 'LeetCode',
      href: 'https://leetcode.com/dronabopche',
    },
    {
      label: 'GitHub',
      href: 'https://github.com/dronabopche',
    },
    {
      label: 'Email',
      href: 'mailto:dronabopche@gmail.com',
    }
  ]

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: -20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.section
      className={styles.section}
      id="contact"
      initial={{ opacity: 0, y: -30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.container}>
        {/* Left Column — Contact Info & CTAs */}
        <div className={styles.leftCol}>
          <div className={styles.ornament}>
            <span className={styles.ornLine} />
            <span className={styles.ornGem}>✦</span>
            <span className={styles.ornLine} />
          </div>

          <div className={styles.header}>
            <span className="section-label">✦ Reach Out</span>
            <h2 className="section-title">Let's Work Together</h2>
          </div>

          <p className={styles.sub}>
            Have a project in mind, an interesting problem to solve,
            or just want to connect? My inbox is always open.
          </p>

          <motion.div
            className={styles.ctaList}
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {links.map((link, i) => (
              <motion.a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cta}
                variants={item}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.96 }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Right Column — 3D Interactive Globe */}
        <div className={styles.rightCol}>
          <div className={styles.globeWrapper}>
            <Globe
              speed={1.5}
              scale={7.5}
              oceanColor={isLight ? 'rgba(253, 252, 247, 0)' : 'rgba(12, 8, 6, 0)'}
              outlineColor={isLight ? '#b8860b' : '#c0850e'}
              graticuleColor={isLight ? 'rgba(184, 134, 11, 0.15)' : 'rgba(201, 168, 76, 0.15)'}
              dots={{
                color: isLight ? '#b8860b' : '#eebb2f',
                size: 4.5,
                density: 7,
                allDots: false,
              }}
              markerConfig={{
                markers: [
                  { lat: 28.6139, lng: 77.2090 }, // New Delhi, India
                  { lat: 37.7749, lng: -122.4194 }, // San Francisco, USA
                  { lat: 51.5074, lng: -0.1278 }, // London, UK
                  { lat: 35.6762, lng: 139.6503 }, // Tokyo, Japan
                  { lat: 1.3521, lng: 103.8198 }, // Singapore
                ],
                color: isLight ? '#c0850e' : '#ffd700',
                size: 35,
              }}
              dragSpeed={4}
              smoothing={7}
            />
          </div>
        </div>
      </div>
    </motion.section>
  )
}
