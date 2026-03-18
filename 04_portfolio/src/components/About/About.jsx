import { motion } from 'framer-motion'
import styles from './About.module.css'

const STATS = [
  { value: '20+', label: 'Projects Built' },
  { value: '3+', label: 'Years Coding' },
  { value: '5+', label: 'Technologies' },
  { value: '∞', label: 'Curiosity' },
]

export default function About({ profile }) {
  const bio = profile?.bio || null
  const followers = profile?.followers
  const publicRepos = profile?.public_repos

  return (
    <motion.section
      className={styles.section}
      id="about"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.inner}>
        <div className={styles.left}>
          <span className="section-label">✦ About Me</span>
          <h2 className="section-title">The Mind Behind the Code</h2>
          <div className="divider"><div className="divider-gem" /></div>

          <p className={styles.para}>
            I'm a developer passionate about building intelligent systems and elegant
            interfaces. My work sits at the intersection of software engineering,
            machine learning, and automation — turning complex problems into clean,
            maintainable solutions.
          </p>
          {bio && (
            <p className={styles.para} style={{ fontStyle: 'italic', color: 'var(--muted)' }}>
              "{bio}"
            </p>
          )}
          <p className={styles.para}>
            When I'm not writing code, I'm exploring new tools, experimenting with AI
            pipelines, or diving deep into whatever problem sparks curiosity.
          </p>
        </div>

        <div className={styles.right}>
          <div className={styles.statsGrid}>
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                className={styles.stat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <span className={styles.statVal}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </motion.div>
            ))}
            {publicRepos && (
              <motion.div
                className={styles.stat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <span className={styles.statVal}>{publicRepos}</span>
                <span className={styles.statLabel}>Public Repos</span>
              </motion.div>
            )}
            {followers && (
              <motion.div
                className={styles.stat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <span className={styles.statVal}>{followers}</span>
                <span className={styles.statLabel}>Followers</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
