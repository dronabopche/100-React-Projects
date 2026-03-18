import { motion } from 'framer-motion'
import styles from './Experience.module.css'

const TIMELINE = [
  {
    year: '2024 — Present',
    role: 'Full-Stack Developer & ML Engineer',
    place: 'Freelance / Open Source',
    desc: 'Building end-to-end applications combining modern web frameworks with machine learning pipelines. Specialising in automation workflows with n8n and intelligent API integrations.',
  },
  {
    year: '2023',
    role: 'Machine Learning Projects',
    place: 'Personal Research',
    desc: 'Developed classification, regression, and NLP models using Scikit-learn, TensorFlow, and Pandas. Focused on model explainability and production deployment.',
  },
  {
    year: '2022',
    role: 'Web Development',
    place: 'Learning & Building',
    desc: 'Mastered React, Node.js, and REST API design. Built full-stack applications with authentication, database integration, and responsive UI.',
  },
  {
    year: '2021',
    role: 'Python & Automation',
    place: 'Self-taught',
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
                <h3 className={styles.role}>{item.role}</h3>
                <span className={styles.place}>{item.place}</span>
                <p className={styles.desc}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
