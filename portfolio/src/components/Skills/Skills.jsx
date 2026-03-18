import { motion, useAnimation } from 'framer-motion'
import styles from './Skills.module.css'
import React from 'react'


const SKILL_GROUPS = [
  {
    category: 'Languages',
    skills: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'Bash'],
  },
  {
    category: 'Frameworks & Libraries',
    skills: ['React', 'FastAPI', 'Node.js', 'Pandas', 'Scikit-learn', 'TensorFlow'],
  },
  {
    category: 'ML & AI',
    skills: ['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'LLMs'],
  },
  {
    category: 'Tools & Automation',
    skills: ['n8n', 'Docker', 'Git', 'REST APIs', 'GitHub Actions', 'Automation'],
  },
]

const BELT_SKILLS = [
  'Python', 'React', 'Machine Learning', 'Scikit-learn', 'n8n',
  'Automation', 'JavaScript', 'Node.js', 'FastAPI', 'Docker',
  'Git', 'TensorFlow', 'Pandas', 'REST APIs', 'SQL', 'LLMs',
]

const BELT_DOUBLE = [...BELT_SKILLS, ...BELT_SKILLS]

export default function Skills() {
  const controls1 = useAnimation()
  const controls2 = useAnimation()

  // start animations
  React.useEffect(() => {
    controls1.start({
      x: ['0%', '-50%'],
      transition: { duration: 30, ease: 'linear', repeat: Infinity },
    })

    controls2.start({
      x: ['-50%', '0%'],
      transition: { duration: 30, ease: 'linear', repeat: Infinity },
    })
  }, [])

  return (
    <motion.section
      className={styles.section}
      id="skills"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className={styles.header}>
        <span className="section-label">✦ Expertise</span>
        <h2 className="section-title">Skills & Arsenal</h2>
      </div>

      <div className={styles.groups}>
        {SKILL_GROUPS.map((group, gi) => (
          <motion.div
            key={group.category}
            className={styles.group}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.1 }}
          >
            <h3 className={styles.groupTitle}>{group.category}</h3>
            <div className={styles.pills}>
              {group.skills.map((skill) => (
                <motion.span
                  key={skill}
                  className={styles.pill}
                  whileHover={{ scale: 1.06, y: -2 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Belt 1 */}
      <div
        className={styles.belt}
        onMouseEnter={() => controls1.stop()}
        onMouseLeave={() =>
          controls1.start({
            x: ['0%', '-50%'],
            transition: { duration: 30, ease: 'linear', repeat: Infinity },
          })
        }
      >
        <div className={styles.beltInner}>
          <motion.div className={styles.beltRow} animate={controls1}>
            {BELT_DOUBLE.map((s, i) => (
              <span key={i} className={styles.beltTag}>
                <span className={styles.beltDot}>✦</span> {s}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Belt 2 (reverse direction) */}
      <div
        className={styles.belt}
        onMouseEnter={() => controls2.stop()}
        onMouseLeave={() =>
          controls2.start({
            x: ['-50%', '0%'],
            transition: { duration: 20, ease: 'linear', repeat: Infinity },
          })
        }
      >
        <div className={styles.beltInner}>
          <motion.div className={styles.beltRow} animate={controls2}>
            {BELT_DOUBLE.map((s, i) => (
              <span key={i} className={styles.beltTag}>
                <span className={styles.beltDot}>✦</span> {s}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}