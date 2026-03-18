import { motion } from 'framer-motion'
import styles from './Hero.module.css'

export default function Hero() {
  const name = 'Cherry'
  const role = 'AI/ML Developer · Builder · Creator'
  const tagline =
    'Crafting elegant solutions through code, automation, and machine intelligence.'

  return (
    <section className={styles.hero}>
      {/* Left — text side */}
      <div className={styles.left}>
        <motion.div
          className={styles.textBlock}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.eyebrow}>✦ Portfolio</span>

          <h1 className={styles.name}>{name}</h1>

          <div className={styles.titleRow}>
            <span className={styles.titleLine} />
            <p className={styles.role}>{role}</p>
          </div>

          <p className={styles.tagline}>{tagline}</p>

          <div className={styles.ctas}>
            <motion.a
              href="#projects"
              className={styles.ctaPrimary}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              View Work
            </motion.a>

            <motion.a
              href="#contact"
              className={styles.ctaGhost}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Get in Touch
            </motion.a>
          </div>

          <div className={styles.scroll}>
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              ↓
            </motion.span>
            <span>Scroll</span>
          </div>
        </motion.div>
      </div>

      {/* Right — image side */}
      <motion.div
        className={styles.right}
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src="/profile.png"
          alt={name}
          className={styles.portrait}
        />

        {/* Frame corners */}
        <div className={styles.frameCornerTL} />
        <div className={styles.frameCornerTR} />
        <div className={styles.frameCornerBL} />
        <div className={styles.frameCornerBR} />

        {/* Floating badge */}
        <motion.div
          className={styles.badge}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className={styles.badgeIcon}>⚡</span>
          <span>Open to Work</span>
        </motion.div>
      </motion.div>
    </section>
  )
}