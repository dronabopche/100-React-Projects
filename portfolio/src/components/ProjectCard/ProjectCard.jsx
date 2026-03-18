import { motion } from 'framer-motion'
import styles from './ProjectCard.module.css'

const LANG_COLORS = {
  JavaScript: '#f7df1e', TypeScript: '#3178c6', Python: '#3572A5',
  HTML: '#e34c26', CSS: '#563d7c', Rust: '#dea584', Go: '#00ADD8',
  Java: '#b07219', Ruby: '#701516', 'C++': '#f34b7d', C: '#555',
  Shell: '#89e051', Jupyter: '#DA5B0B', Swift: '#ffac45', Kotlin: '#A97BFF',
}

const StarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)

export default function ProjectCard({ repo, index }) {
  const langColor = LANG_COLORS[repo.language] || '#7a6448'

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: (index % 6) * 0.07, ease: [0.22,1,0.36,1] }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
    >
      <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className={styles.link}>
        <div className={styles.topLine} />
        <div className={styles.top}>
          <span className={styles.name}>{repo.name}</span>
          <span className={styles.arrow}>↗</span>
        </div>
        {repo.description && <p className={styles.desc}>{repo.description}</p>}
        <div className={styles.meta}>
          {repo.language && (
            <span className={styles.lang}>
              <span className={styles.dot} style={{ background: langColor }} />
              {repo.language}
            </span>
          )}
          {repo.stargazers_count > 0 && (
            <span className={styles.stars}><StarIcon /> {repo.stargazers_count}</span>
          )}
          {repo.topics?.slice(0, 2).map(t => (
            <span key={t} className={styles.topic}>{t}</span>
          ))}
        </div>
      </a>
    </motion.div>
  )
}
