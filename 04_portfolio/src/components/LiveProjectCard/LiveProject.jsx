import { motion, useMotionValue, useAnimationFrame } from 'framer-motion'
import { useState } from 'react'
import styles from './LiveProjects.module.css'

export default function LiveProjects() {
  const x = useMotionValue(0)
  const [isPaused, setIsPaused] = useState(false)
  const speed = 20 // auto scroll speed

  const projects = [
    {
      title: 'House Price Prediction',
      desc: 'ML model predicting real estate prices',
      img: '/data.png',
      link: '#',
    },
    {
      title: 'Employee Retention',
      desc: 'Predict employee churn',
      img: '/leetcode.png',
      link: '#',
    },
    {
      title: 'AI Dashboard',
      desc: 'Real-time analytics system',
      img: '/codeforce.png',
      link: '#',
    },
    {
      title: 'Prompt Tool',
      desc: 'Smart prompt generator',
      img: '/prompt.png',
      link: '#',
    },
  ]

  const loopProjects = [...projects, ...projects, ...projects]

  // auto scroll
  useAnimationFrame((t, delta) => {
    if (!isPaused) {
      x.set(x.get() - (speed * delta) / 1000)
    }
  })

  // manual controls
  const scrollLeft = () => {
    x.set(x.get() + 200)
  }

  const scrollRight = () => {
    x.set(x.get() - 200)
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <p>
          .
        </p>
        <div className={styles.header}>
          <span className="section-label" align="center">
            ✦ Live Projects
          </span>
          <h2 className="section-title" align="center">
            Interactive Work
          </h2>
        </div>

        <div
          className={styles.wrapper}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* LEFT BUTTON */}
          <button className={styles.leftBtn} onClick={scrollLeft}>
            ◀
          </button>

          {/* RIGHT BUTTON */}
          <button className={styles.rightBtn} onClick={scrollRight}>
            ▶
          </button>

          <motion.div className={styles.track} style={{ x }}>
            {loopProjects.map((project, i) => (
              <motion.a
                key={i}
                href={project.link}
                className={styles.card}
                whileHover={{ scale: 1.15 }}
              >
                <img src={project.img} alt={project.title} />
                <div className={styles.overlay} />
                <div className={styles.content}>
                  <h3>{project.title}</h3>
                  <p>{project.desc}</p>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}