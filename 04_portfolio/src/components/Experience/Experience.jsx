import { motion } from 'motion/react'
import styles from './Experience.module.css'

const TIMELINE = [
  {
    year: '2026 — Present',
    role: 'AI/ML Execution Internship',
    place: 'Stairways Techonlogies LLP.',
    logo: '/experience/stairways.webp',
    desc: 'Building end-to-end applications combining modern web frameworks with machine learning pipelines. Specialising in automation workflows with n8n and intelligent API integrations.',
  },
  {
    year: '2025',
    role: 'Machine Learning Projects',
    place: 'Personal Research',
    logo: '/experience/v2.webp',
    desc: 'Developed classification, regression, and NLP models using Scikit-learn, TensorFlow, and Pandas. Focused on model explainability and production deployment.',
  },
  {
    year: '2025',
    role: 'Open Source Contribution',
    place: 'MetaBrainz Foundation',
    logo: '/experience/MB.webp',
    desc: 'A California 501.c.3 non-profit organization running MusicBrainz and other open data/open source projects.',
  },
  {
    year: '2022',
    role: 'Python & Automation',
    place: 'Self-taught',
    logo: '/experience/selftaught.webp',
    desc: 'Started the journey with Python scripting, web scraping, data analysis, and process automation. Built tools that eliminated repetitive manual tasks.',
  },
]

export default function Experience() {
  return (
    <motion.section
      className={styles.section}
      id="experience"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8 }}
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className="section-label">✦ Journey</span>
          <h2 className="section-title">Experience</h2>
          <div className="divider"><div className="divider-gem" /></div>
        </div>

        <div className={styles.timeline}>
          {TIMELINE.map((item, i) => (
            <motion.div
              key={i}
              className={styles.item}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
            >
              <div className={styles.yearCol}>
                <span className={styles.year}>{item.year}</span>
                <div className={styles.line} />
              </div>
              <div className={styles.content}>
                <div className={styles.dot} />
                <div className={styles.roleHeader}>
                  <img src={item.logo} alt={`${item.place} logo`} className={styles.companyLogo} onError={(e) => { e.target.style.display = 'none' }} />
                  <div className={styles.roleInfo}>
                    <h3 className={styles.role}>{item.role}</h3>
                    <span className={styles.place}>{item.place}</span>
                  </div>
                </div>
                <p className={styles.desc}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
