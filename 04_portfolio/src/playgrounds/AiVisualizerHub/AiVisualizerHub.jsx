import React from 'react'
import { motion } from 'motion/react'
import styles from './AiVisualizerHub.module.css'
import { useNavigate } from 'react-router-dom'

export default function AiVisualizerHub({ theme, onClose, isStandalone = false }) {
  const navigate = useNavigate()

  const handleClose = () => {
    if (isStandalone) {
      navigate('/')
    } else if (onClose) {
      onClose()
    }
  }

  const textColor = theme === 'light' ? 'var(--text)' : 'var(--cream)'

  return (
    <motion.div 
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1>AI/ML & DS Playground</h1>
        </div>
        <div className={styles.headerActions}>
          {isStandalone ? (
            <button
              onClick={() => navigate('/')}
              style={{
                background: theme === 'light' ? 'rgba(253, 252, 247, 0.6)' : 'rgba(12, 8, 6, 0.6)',
                border: '1px solid var(--border2)',
                color: 'var(--muted)',
                padding: '10px 24px',
                borderRadius: '2px',
                fontFamily: "'Cinzel', serif",
                fontSize: '0.75rem',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                backdropFilter: 'blur(4px)',
                transition: 'all 0.3s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'var(--gold-dim)'
                e.target.style.color = textColor
                e.target.style.boxShadow = '0 0 15px rgba(192, 133, 14, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'var(--border2)'
                e.target.style.color = 'var(--muted)'
                e.target.style.boxShadow = 'none'
              }}
            >
              ◀ Back to Home
            </button>
          ) : (
            <button className={styles.closeBtn} onClick={handleClose} aria-label="Close modal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Main Switcher */}
      <div className={styles.contentBody}>
        <div className={styles.hubContainer}>
          <div className={styles.hubHeader}>
            <h2>Select a Playground</h2>
            <p>Explore visual simulations of foundational AI, Machine Learning, and Data Science models.</p>
          </div>
          <div className={styles.hubGrid}>
            {/* RAG Card */}
            <div className={styles.hubCard} onClick={() => { onClose && onClose(); navigate('/rag') }}>
              <svg className={styles.hubCardIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <h3>RAG Pipeline</h3>
              <p>Upload a PDF document. Observe text chunk overlaps, semantic vector projections, and test query matches using Cosine Similarity.</p>
              <button className={styles.hubCardBtn}>Launch Simulator</button>
            </div>

            {/* NN Card */}
            <div className={styles.hubCard} onClick={() => { onClose && onClose(); navigate('/playground/nn') }}>
              <svg className={styles.hubCardIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.75a9 9 0 11-18 0 9 9 0 0118 0zM12 2.25v4.5m0 10.5v4.5M2.25 12h4.5m10.5 0h4.5M5.25 5.25l3.182 3.182m6.364 6.364l3.182 3.182M5.25 18.75l3.182-3.182m6.364-6.364l3.182-3.182" />
              </svg>
              <h3>Neural Network</h3>
              <p>Configure custom layers and neurons. Run backpropagation on XOR/Circle data clusters and watch decision boundaries form in real-time.</p>
              <button className={styles.hubCardBtn}>Launch Simulator</button>
            </div>

            {/* K-Means Card */}
            <div className={styles.hubCard} onClick={() => { onClose && onClose(); navigate('/k-meanas') }}>
              <svg className={styles.hubCardIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              <h3>K-Means Clustering</h3>
              <p>Step through clustering point densities. Adjust centroids ($K$), place custom nodes, and visualize centroids adjusting paths to coordinate means.</p>
              <button className={styles.hubCardBtn}>Launch Simulator</button>
            </div>

            {/* Quantum Card */}
            <div className={styles.hubCard} onClick={() => { onClose && onClose(); navigate('/playground/quantum') }}>
              <svg className={styles.hubCardIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="3" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
              <h3>Quantum Circuit</h3>
              <p>Construct 2-qubit quantum circuits. View state superpositions, phase rotations, and create quantum entanglement live.</p>
              <button className={styles.hubCardBtn}>Launch Simulator</button>
            </div>

            {/* Git Card */}
            <div className={styles.hubCard} onClick={() => { onClose && onClose(); navigate('/playground/git') }}>
              <svg className={styles.hubCardIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
              <h3>Git Sandbox</h3>
              <p>Visualize commit DAG trees, checkouts, branching, and rebasing. Build branch models with interactive terminal logs.</p>
              <button className={styles.hubCardBtn}>Launch Simulator</button>
            </div>

            {/* Gradient Descent Card */}
            <div className={styles.hubCard} onClick={() => { onClose && onClose(); navigate('/playground/gradient') }}>
              <svg className={styles.hubCardIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
              </svg>
              <h3>Gradient Descent</h3>
              <p>Adjust optimization parameters on multi-dimensional loss contours. Watch particles converge using SGD, Momentum, or Adam.</p>
              <button className={styles.hubCardBtn}>Launch Simulator</button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
