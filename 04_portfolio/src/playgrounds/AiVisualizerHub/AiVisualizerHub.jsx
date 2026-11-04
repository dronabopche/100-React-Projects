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
      data-lenis-prevent
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
              className={styles.backHomeBtn}
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
      <div className={styles.contentBody} data-lenis-prevent>
        <div className={styles.hubContainer}>
          <div className={styles.hubGrid}>
            {/* RAG Card */}
            <div className={styles.folderCard} onClick={() => { onClose && onClose(); navigate('/playground/rag') }}>
              <div className={styles.folderTab}>
                <div className={styles.glassHighlight}></div>
                <span className={styles.folderTabText}>RAG.ENV</span>
              </div>
              <div className={styles.hubCard}>
                <div className={styles.glassHighlight}></div>
                <div className={styles.cardImageContainer}>
                  <img src="playground/rag.webp" alt="RAG Pipeline" className={styles.cardImage} />
                </div>
                <div className={styles.cardContent}>
                  <h3>RAG Pipeline</h3>
                  <button className={styles.hubCardBtn}>
                    <div className={styles.btnWrap}>
                      <p>
                        <span>Launch Simulator</span>
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* NN Card */}
            <div className={styles.folderCard} onClick={() => { onClose && onClose(); navigate('/playground/nn') }}>
              <div className={styles.folderTab}>
                <div className={styles.glassHighlight}></div>
                <span className={styles.folderTabText}>NEURAL.NET</span>
              </div>
              <div className={styles.hubCard}>
                <div className={styles.glassHighlight}></div>
                <div className={styles.cardImageContainer}>
                  <img src="playground/nn.webp" alt="Neural Network" className={styles.cardImage} />
                </div>
                <div className={styles.cardContent}>
                  <h3>Neural Network</h3>
                  <button className={styles.hubCardBtn}>
                    <div className={styles.btnWrap}>
                      <p>
                        <span>Launch Simulator</span>
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* K-Means Card */}
            <div className={styles.folderCard} onClick={() => { onClose && onClose(); navigate('/playground/kmeans') }}>
              <div className={styles.folderTab}>
                <div className={styles.glassHighlight}></div>
                <span className={styles.folderTabText}>K-MEANS.ALG</span>
              </div>
              <div className={styles.hubCard}>
                <div className={styles.glassHighlight}></div>
                <div className={styles.cardImageContainer}>
                  <img src="playground/kmeans.webp" alt="K-Means Clustering" className={styles.cardImage} />
                </div>
                <div className={styles.cardContent}>
                  <h3>K-Means Clustering</h3>
                  <button className={styles.hubCardBtn}>
                    <div className={styles.btnWrap}>
                      <p>
                        <span>Launch Simulator</span>
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Quantum Card */}
            <div className={styles.folderCard} onClick={() => { onClose && onClose(); navigate('/playground/quantum') }}>
              <div className={styles.folderTab}>
                <div className={styles.glassHighlight}></div>
                <span className={styles.folderTabText}>QUANTUM.SIM</span>
              </div>
              <div className={styles.hubCard}>
                <div className={styles.glassHighlight}></div>
                <div className={styles.cardImageContainer}>
                  <img src="playground/quantum.webp" alt="Quantum Circuit" className={styles.cardImage} />
                </div>
                <div className={styles.cardContent}>
                  <h3>Quantum Circuit</h3>
                  <button className={styles.hubCardBtn}>
                    <div className={styles.btnWrap}>
                      <p>
                        <span>Launch Simulator</span>
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Git Card */}
            <div className={styles.folderCard} onClick={() => { onClose && onClose(); navigate('/playground/git') }}>
              <div className={styles.folderTab}>
                <div className={styles.glassHighlight}></div>
                <span className={styles.folderTabText}>GIT.BOX</span>
              </div>
              <div className={styles.hubCard}>
                <div className={styles.glassHighlight}></div>
                <div className={styles.cardImageContainer}>
                  <img src="playground/git.webp" alt="Git Sandbox" className={styles.cardImage} />
                </div>
                <div className={styles.cardContent}>
                  <h3>Git Sandbox</h3>
                  <button className={styles.hubCardBtn}>
                    <div className={styles.btnWrap}>
                      <p>
                        <span>Launch Simulator</span>
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Gradient Descent Card */}
            <div className={styles.folderCard} onClick={() => { onClose && onClose(); navigate('/playground/gradient') }}>
              <div className={styles.folderTab}>
                <div className={styles.glassHighlight}></div>
                <span className={styles.folderTabText}>GRADIENT.OPT</span>
              </div>
              <div className={styles.hubCard}>
                <div className={styles.glassHighlight}></div>
                <div className={styles.cardImageContainer}>
                  <img src="playground/gradient.webp" alt="Gradient Descent" className={styles.cardImage} />
                </div>
                <div className={styles.cardContent}>
                  <h3>Gradient Descent</h3>
                  <button className={styles.hubCardBtn}>
                    <div className={styles.btnWrap}>
                      <p>
                        <span>Launch Simulator</span>
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Equation Visualizer Card */}
            <div className={styles.folderCard} onClick={() => { onClose && onClose(); navigate('/playground/equation') }}>
              <div className={styles.folderTab}>
                <div className={styles.glassHighlight}></div>
                <span className={styles.folderTabText}>EQUATION.VIS</span>
              </div>
              <div className={styles.hubCard}>
                <div className={styles.glassHighlight}></div>
                <div className={styles.cardImageContainer}>
                  <img src="playground/equation.webp" alt="Equation Visualizer" className={styles.cardImage} />
                </div>
                <div className={styles.cardContent}>
                  <h3>Equation Visualizer</h3>
                  <button className={styles.hubCardBtn}>
                    <div className={styles.btnWrap}>
                      <p>
                        <span>Launch Simulator</span>
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Fourier Visualizer Card */}
            <div className={styles.folderCard} onClick={() => { onClose && onClose(); navigate('/playground/fourier') }}>
              <div className={styles.folderTab}>
                <div className={styles.glassHighlight}></div>
                <span className={styles.folderTabText}>FOURIER.VIS</span>
              </div>
              <div className={styles.hubCard}>
                <div className={styles.glassHighlight}></div>
                <div className={styles.cardImageContainer}>
                  <img src="playground/fourier.webp" alt="Fourier Visualizer" className={styles.cardImage} />
                </div>
                <div className={styles.cardContent}>
                  <h3>Fourier Visualizer</h3>
                  <button className={styles.hubCardBtn}>
                    <div className={styles.btnWrap}>
                      <p>
                        <span>Launch Simulator</span>
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  )
}
