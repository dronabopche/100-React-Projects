import { motion } from 'framer-motion'
import styles from './Contact.module.css'

export default function Contact() {
  const links = [
    {
      label: 'View GitHub Profile ↗',
      href: 'https://github.com/yourusername',
    },
    {
      label: 'View LinkedIn Profile ↗',
      href: 'https://linkedin.com/in/yourusername',
    },
    {
      label: 'View Kaggle Profile ↗',
      href: 'https://kaggle.com/yourusername',
    },
    {
      label: 'Send an Email ↗',
      href: 'mailto:your@email.com',
    },
     {
      label: 'YouTube ↗',
      href: 'mailto:your@email.com',
    },
  ]

  return (
    <motion.section
      className={styles.section}
      id="contact"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8 }}
    >
      <div className={styles.inner}>
        {/* Top ornament */}
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

        {/* Vertical CTA Links */}
        <div className={styles.ctaList}>
          {links.map((link, i) => (
            <motion.a
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cta}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {link.label}
            </motion.a>
          ))}
        </div>
      </div>
    </motion.section>
  )
}