import { motion } from 'framer-motion'
import styles from './Contact.module.css'

export default function Contact() {
  const links = [
    {
      label: 'GitHub Profile',
      href: 'https://github.com/yourusername',
    },
    {
      label: 'LinkedIn Profile',
      href: 'https://linkedin.com/in/yourusername',
    },
    {
      label: 'Kaggle Profile',
      href: 'https://kaggle.com/yourusername',
    },
    {
      label: 'Send Email',
      href: 'mailto:your@email.com',
    },
    {
      label: 'YouTube Channel',
      href: 'https://youtube.com/@yourchannel',
    },
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

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
        
        {/* Ornament */}
        <div className={styles.ornament}>
          <span className={styles.ornLine} />
          <span className={styles.ornGem}>✦</span>
          <span className={styles.ornLine} />
        </div>

        {/* Header */}
        <div className={styles.header}>
          <span className="section-label">✦ Reach Out</span>
          <h2 className="section-title">Let's Work Together</h2>
        </div>

        {/* Subtext */}
        <p className={styles.sub}>
          Have a project in mind, an interesting problem to solve,
          or just want to connect? My inbox is always open.
        </p>

        {/* CTA Links */}
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
    </motion.section>
  )
}
