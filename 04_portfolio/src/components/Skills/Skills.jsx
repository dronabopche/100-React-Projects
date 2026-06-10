import React from 'react'
import { motion, useAnimation } from 'framer-motion'
import styles from './Skills.module.css'
import IconRenderer from './Icons'

const BELT_SKILLS = [
  'Python', 'React', 'Machine Learning', 'Scikit-learn', 'n8n',
  'Automation', 'JavaScript', 'Node.js', 'FastAPI', 'Docker',
  'Git', 'TensorFlow', 'Pandas', 'REST APIs', 'SQL', 'LLMs',
]

const BELT_DOUBLE = [...BELT_SKILLS, ...BELT_SKILLS]

export default function Skills() {
  const controls1 = useAnimation()
  const controls2 = useAnimation()

  const startAnimation1 = () => {
    controls1.start({
      x: ['0%', '-50%'],
      transition: { duration: 30, ease: 'linear', repeat: Infinity },
    })
  }

  const startAnimation2 = () => {
    controls2.start({
      x: ['-50%', '0%'],
      transition: { duration: 30, ease: 'linear', repeat: Infinity },
    })
  }

  React.useEffect(() => {
    startAnimation1()
    startAnimation2()
  }, [])

  return (
    <section className={styles.section} id="skills">
      <div className={styles.header}>
        <span className="section-label">✦ Expertise</span>
        <h2 className="section-title">Skills & Arsenal</h2>
      </div>

      <div className={styles.beltsContainer}>
        {/* Belt 1 */}
        <div
          className={styles.belt}
          onMouseEnter={() => controls1.stop()}
          onMouseLeave={startAnimation1}
        >
          <div className={styles.beltInner}>
            <motion.div className={styles.beltRow} animate={controls1}>
              {BELT_DOUBLE.map((skill, i) => (
                <span key={i} className={styles.beltTag}>
                  <div className={styles.iconContainer}>
                    <IconRenderer name={skill} className={styles.techIcon} />
                  </div>
                  <span className={styles.tagName}>{skill}</span>
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Belt 2 */}
        <div
          className={styles.belt}
          onMouseEnter={() => controls2.stop()}
          onMouseLeave={startAnimation2}
        >
          <div className={styles.beltInner}>
            <motion.div className={styles.beltRow} animate={controls2}>
              {BELT_DOUBLE.map((skill, i) => (
                <span key={i} className={styles.beltTag}>
                  <div className={styles.iconContainer}>
                    <IconRenderer name={skill} className={styles.techIcon} />
                  </div>
                  <span className={styles.tagName}>{skill}</span>
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}