import { motion, useInView } from 'motion/react'
import { useEffect, useState, useRef } from 'react'
import styles from './About.module.css'
import WavePath from '../WavePath/WavePath'

const STATS = [
  { value: '20+', label: 'Projects Built' },
  { value: '3+', label: 'Years Coding' },
  { value: '5+', label: 'Technologies' },
  { value: '∞', label: 'Curiosity' },
]

function AnimatedCounter({ value, duration = 1.5 }) {
  const [count, setCount] = useState(0)
  const [showInfinity, setShowInfinity] = useState(false)
  const [isBlasted, setIsBlasted] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  // Check if it's the infinity symbol
  const isInfinity = value === '∞'

  // Parse target number and suffix (like '+')
  const numMatch = typeof value === 'string' ? value.match(/^(\d+)(.*)$/) : null
  const target = numMatch ? parseInt(numMatch[1], 10) : typeof value === 'number' ? value : null
  const suffix = numMatch ? numMatch[2] : ''

  useEffect(() => {
    if (!isInView) return

    if (isInfinity) {
      const totalMiliseconds = duration * 1000
      const startTime = performance.now()
      let animationFrameId

      const updateGlitch = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / totalMiliseconds, 1)

        // Rapidly roll numbers that grow in length
        const digits = Math.floor(progress * 4) + 1 // 1 to 4 digits
        const randomNum = Math.floor(Math.random() * Math.pow(10, digits))
        setCount(randomNum)

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(updateGlitch)
        } else {
          setShowInfinity(true)
          setIsBlasted(true)
        }
      }

      animationFrameId = requestAnimationFrame(updateGlitch)
      return () => cancelAnimationFrame(animationFrameId)
    }

    if (target === null) return

    let start = 0
    const end = target
    if (start === end) return

    const totalMiliseconds = duration * 1000
    const startTime = performance.now()
    let animationFrameId

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / totalMiliseconds, 1)

      // Easing out quad
      const easeProgress = progress * (2 - progress)

      const currentCount = Math.floor(easeProgress * (end - start) + start)
      setCount(currentCount)

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount)
      } else {
        setCount(end)
      }
    }

    animationFrameId = requestAnimationFrame(updateCount)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isInView, target, duration, isInfinity])

  if (isInfinity) {
    return (
      <span
        ref={ref}
        style={{
          display: 'inline-block',
          transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), filter 0.4s ease, color 0.4s ease',
          transform: isBlasted ? 'scale(1.25)' : 'scale(1)',
          filter: isBlasted ? 'drop-shadow(0 0 8px var(--accent))' : 'none',
          color: isBlasted ? 'var(--accent)' : 'inherit',
        }}
      >
        {showInfinity ? '∞' : count}
      </span>
    )
  }

  if (target === null) {
    return <span ref={ref}>{value}</span>
  }

  return <span ref={ref}>{count}{suffix}</span>
}

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
          <div className="divider-interactive">
            <WavePath />
            <div className="divider-gem" />
            <WavePath />
          </div>

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
                <span className={styles.statVal}>
                  <AnimatedCounter value={s.value} />
                </span>
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
                <span className={styles.statVal}>
                  <AnimatedCounter value={publicRepos} />
                </span>
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
                <span className={styles.statVal}>
                  <AnimatedCounter value={followers} />
                </span>
                <span className={styles.statLabel}>Followers</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
