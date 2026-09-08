import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './LiveProjects.module.css'

const COLUMN_ONE = [
  { id: 'c1-1', title: 'Neural Networks', img: '/playground/nn.webp', link: '/playground/nn' },
  { id: 'c1-2', title: 'Web Project Showcase', img: '/photo view/Screenshot 2026-09-02 at 15.47.39.png', link: '#' },
  { id: 'c1-3', title: 'Prompt Studio', img: '/photo view/prompt.webp', link: '#' },
  { id: 'c1-4', title: 'Gradient Descent', img: '/playground/gradient.webp', link: '/playground/gradient' },
]

const COLUMN_TWO = [
  { id: 'c2-1', title: 'Quantum Compute', img: '/playground/quantum.webp', link: '/playground/quantum' },
  { id: 'c2-2', title: 'Vector RAG Pipeline', img: '/playground/rag.webp', link: '/playground/rag' },
  { id: 'c2-3', title: 'Portfolio Architecture', img: '/photo view/Screenshot 2026-09-02 at 15.48.00.png', link: '#' },
  { id: 'c2-4', title: 'Competitive Code', img: '/photo view/codeforce.webp', link: '#' },
]

const COLUMN_THREE = [
  { id: 'c3-1', title: 'Git Visualizer', img: '/playground/git.webp', link: '/playground/git' },
  { id: 'c3-2', title: 'K-Means Clustering', img: '/playground/kmeans.webp', link: '/playground/kmeans' },
  { id: 'c3-3', title: 'Data Analytics', img: '/photo view/data.webp', link: '#' },
  { id: 'c3-4', title: 'Event Platform Host', img: '/visual-work/host.webp', link: '#' },
]

const COLUMN_FOUR = [
  { id: 'c4-1', title: 'Fourier Dynamics', img: '/playground/fourier.webp', link: '/playground/fourier' },
  { id: 'c4-2', title: 'LeetCode Platform', img: '/photo view/leetcode.webp', link: '#' },
  { id: 'c4-3', title: 'Offline Codefest', img: '/visual-work/codefest.webp', link: '#' },
  { id: 'c4-4', title: 'Equation Engine', img: '/playground/equation.webp', link: '/playground/equation' },
]

export default function LiveProjects() {
  const navigate = useNavigate()
  const sectionRef = useRef(null)

  const handleCardClick = (link) => {
    if (!link || link === '#') return
    if (link.startsWith('/')) {
      navigate(link)
    } else {
      window.open(link, '_blank')
    }
  }

  // Duplicate arrays for seamless vertical infinite loops
  const col1Loop = [...COLUMN_ONE, ...COLUMN_ONE]
  const col2Loop = [...COLUMN_TWO, ...COLUMN_TWO]
  const col3Loop = [...COLUMN_THREE, ...COLUMN_THREE]
  const col4Loop = [...COLUMN_FOUR, ...COLUMN_FOUR]

  const renderCard = (card, keyPrefix, index) => (
    <div
      key={`${keyPrefix}-${index}`}
      className={styles.card}
      onClick={() => handleCardClick(card.link)}
    >
      <img src={card.img} alt={card.title} className={styles.cardImage} loading="lazy" />

      {/* On Hover Reveal: Name & Yellow Cosmic Glow Know More Button */}
      <div className={styles.cardOverlay}>
        <span className={styles.cardTitle}>{card.title}</span>
        <button
          type="button"
          className={styles.knowMoreButton}
          aria-label={`Know more about ${card.title}`}
          onClick={(e) => {
            e.stopPropagation()
            handleCardClick(card.link)
          }}
        >
          <span className={styles.fold} />
          <div className={styles.points_wrapper}>
            <i className={styles.point} />
            <i className={styles.point} />
            <i className={styles.point} />
            <i className={styles.point} />
            <i className={styles.point} />
            <i className={styles.point} />
            <i className={styles.point} />
            <i className={styles.point} />
          </div>
          <span className={styles.innerBtn}>
            <span>Know More</span>
            <svg
              className={styles.btnIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  )

  return (
    <section className={styles.section} ref={sectionRef}>
      {/* Main SaaS Vertical Columns Showcase with Top & Bottom Fade */}
      <div className={styles.viewportContainer}>
        <div className={styles.columnsGrid}>

          {/* Column 1: Moves Upward */}
          <div className={styles.columnWrapper}>
            <div className={`${styles.columnTrack} ${styles.scrollUp}`}>
              {col1Loop.map((card, i) => renderCard(card, 'col1', i))}
            </div>
          </div>

          {/* Column 2: Moves Downward */}
          <div className={styles.columnWrapper}>
            <div className={`${styles.columnTrack} ${styles.scrollDown}`}>
              {col2Loop.map((card, i) => renderCard(card, 'col2', i))}
            </div>
          </div>

          {/* Column 3: Moves Upward */}
          <div className={styles.columnWrapper}>
            <div className={`${styles.columnTrack} ${styles.scrollUpSlow}`}>
              {col3Loop.map((card, i) => renderCard(card, 'col3', i))}
            </div>
          </div>

          {/* Column 4: Moves Downward */}
          <div className={styles.columnWrapper}>
            <div className={`${styles.columnTrack} ${styles.scrollDownSlow}`}>
              {col4Loop.map((card, i) => renderCard(card, 'col4', i))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}