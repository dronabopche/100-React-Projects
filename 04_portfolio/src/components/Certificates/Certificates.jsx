import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import styles from './Certificates.module.css'
import { SuccessFrame, FailureFrame } from './Frames'

const SUCCESS_CERTS = [
  {
    id: 's1',
    title: 'React JS Advanced Developer Certification',
    issuer: 'IIT Bombay',
    date: '2025',
    image: '/certificates/IIT_Bombay.png',
    badge: 'Honors',
    description: 'Advanced frontend engineering, state synchronization protocols, and concurrent rendering architectures.',
    detailText: 'Awarded for developing a high-fidelity interactive simulation with real-time graph rendering under the guidance of IIT Bombay research staff.'
  },
  {
    id: 's2',
    title: 'Deep Learning Specialization',
    issuer: 'Coursera (DeepLearning.AI)',
    date: '2025',
    image: '/certificates/IIT_Bombay.png',
    badge: 'Specialist',
    description: 'Foundations of Neural Networks, CNNs, RNNs, and Transformer models for NLP.',
    detailText: 'Completed a five-course sequence covering hyperparameter tuning, structuring ML projects, and optimization algorithms like Adam and RMSprop.'
  },
  {
    id: 's3',
    title: 'Machine Learning Engineer Professional',
    issuer: 'Google Cloud',
    date: '2025',
    image: '/certificates/IIT_Bombay.png',
    badge: 'Professional',
    description: 'Enterprise MLOps, model deployment pipelines, and scaling serverless inference.',
    detailText: 'Validated expertise in design and implementation of machine learning models on GCP using Vertex AI, TensorFlow, and Kubeflow pipelines.'
  },
  {
    id: 's4',
    title: 'Data Science & Automation with Python',
    issuer: 'IIT Bombay',
    date: '2024',
    image: '/certificates/IIT_Bombay.png',
    badge: 'Excellent',
    description: 'Mathematical modeling, automated scraping tools, and scientific data analysis.',
    detailText: 'Built multiple automated scripts for harvesting web data, executing linear regressions, and plotting live analytics.'
  },
  {
    id: 's5',
    title: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    date: '2024',
    image: '/certificates/IIT_Bombay.png',
    badge: 'Architect',
    description: 'Distributed cloud architectures, high availability designs, and security policies.',
    detailText: 'Demonstrated proficiency in building cost-effective, resilient systems using EC2, RDS, VPCs, IAM, and Serverless architectures.'
  },
  {
    id: 's6',
    title: 'Advanced Data Structures & Algorithms',
    issuer: 'NPTEL (IIT Kharagpur)',
    date: '2024',
    image: '/certificates/IIT_Bombay.png',
    badge: 'Elite Gold',
    description: 'Graph algorithms, dynamic programming, and complexity class evaluations.',
    detailText: 'Achieved top 2% rank nationwide in coding problems involving segment trees, network flows, and NP-hard approximations.'
  },
  {
    id: 's7',
    title: 'Frontend Engineering Masterclass',
    issuer: 'Frontend Masters',
    date: '2024',
    image: '/certificates/IIT_Bombay.png',
    badge: 'Mastery',
    description: 'Browser internals, performance optimization, and custom build pipelines.',
    detailText: 'Focused on optimizing page load speeds, Webpack configuration, and advanced CSS/layout rendering techniques.'
  },
  {
    id: 's8',
    title: 'AI and Robotics Workshop Hackathon',
    issuer: 'IIT Bombay',
    date: '2023',
    image: '/certificates/IIT_Bombay.png',
    badge: 'Winner',
    description: 'Pathfinding algorithms, hardware integration, and real-time computer vision.',
    detailText: 'Won first place for developing a computer-vision-based object sorting arm controlled via dynamic Python models.'
  },
  {
    id: 's9',
    title: 'Full Stack Development Bootcamp',
    issuer: 'Stairways Tech',
    date: '2023',
    image: '/certificates/IIT_Bombay.png',
    badge: 'Outstanding',
    description: 'Node.js, Express, databases, and continuous integration workflows.',
    detailText: 'Completed an intensive program building end-to-end full stack products with SQL databases, RESTful endpoints, and user auth.'
  },
  {
    id: 's10',
    title: 'Docker & Kubernetes DevOps Professional',
    issuer: 'Linux Foundation',
    date: '2023',
    image: '/certificates/IIT_Bombay.png',
    badge: 'Certified',
    description: 'Containerization, cluster administration, and microservice orchestration.',
    detailText: 'Gained hands-on competency in writing Dockerfiles, configuring ingress, and managing auto-scaling pods in production clusters.'
  }
]

const FAILURE_CERTS = [
  {
    id: 'f1',
    title: 'Advanced Quantum Physics & Computing',
    issuer: 'IBM Quantum (Attempted)',
    date: '2025',
    image: '/certificates/Tata.png',
    badge: 'Milestone',
    description: 'Paused due to gaps in complex linear algebra and quantum mechanics basics.',
    detailText: 'Struggled to write custom quantum circuits in Qiskit because the math foundations grew too dense. Stepped back to study complex vectors first.',
    quote: '"I have not failed. I\'ve just found 10,000 ways that won\'t work." — Thomas A. Edison'
  },
  {
    id: 'f2',
    title: 'Google UX Design Professional',
    issuer: 'Coursera (Interrupted)',
    date: '2025',
    image: '/certificates/Tata.png',
    badge: 'Growth',
    description: 'Paused to prioritize system architectures and core AI/ML execution pipelines.',
    detailText: 'Realized that trying to learn UX design alongside machine learning models diluted focus. Prioritizing core engineering depth over broad styling.',
    quote: '"You can do anything, but not everything." — David Allen'
  },
  {
    id: 'f3',
    title: 'Rust Systems Programming Certificate',
    issuer: 'Rust Foundation (In Progress)',
    date: '2025',
    image: '/certificates/Tata.png',
    badge: 'Resilient',
    description: 'Struggled with the borrow checker and manual thread-safety concurrency model.',
    detailText: 'Attempted to build a high-performance concurrent file system on week one. Hit immediate borrow checker errors. Pausing to learn basic ownership syntax first.',
    quote: '"Difficulties strengthen the mind, as labor does the body." — Seneca'
  },
  {
    id: 'f4',
    title: 'AWS Certified Machine Learning Specialty',
    issuer: 'Amazon Web Services (Deferred)',
    date: '2024',
    image: '/certificates/Tata.png',
    badge: 'Learning',
    description: 'Failed initial practice exam due to insufficient knowledge of serverless pipeline models.',
    detailText: 'Practice exam score was 62%. Noted severe gaps in Amazon SageMaker architecture and pipeline security. Re-studying MLOps models.',
    quote: '"Failure is success if we learn from it." — Malcolm Forbes'
  },
  {
    id: 'f5',
    title: 'Open Source Core Contributor',
    issuer: 'Apache Foundation (PR Rejected)',
    date: '2024',
    image: '/certificates/Tata.png',
    badge: 'Feedback',
    description: 'Pull Request was closed due to structural deviations and style conflicts.',
    detailText: 'The code solved the issue but introduced circular dependencies that violated repository guidelines. Studying codebase architecture to rewrite the PR.',
    quote: '"It is not the mountain we conquer, but ourselves." — Sir Edmund Hillary'
  },
  {
    id: 'f6',
    title: 'Compiler Design and Automata',
    issuer: 'NPTEL (Deferred Study Block)',
    date: '2024',
    image: '/certificates/Tata.png',
    badge: 'Milestone',
    description: 'Missed final exam registration due to workload and tight project deadlines.',
    detailText: 'Underestimated the academic workload of lexers/parsers during product launches. Rescheduling studying to allocate dedicated learning sprints.',
    quote: '"The only limit to our realization of tomorrow will be our doubts of today." — Franklin D. Roosevelt'
  },
  {
    id: 'f7',
    title: 'High-Frequency Trading Simulation Challenge',
    issuer: 'Hudson River Trading (Attempted)',
    date: '2024',
    image: '/certificates/Tata.png',
    badge: 'Challenge',
    description: 'C++ microsecond-level latency task failed to pass throughput standards.',
    detailText: 'My latency pipeline had cache misses and slow memory allocations. Re-studying memory alignment, custom allocators, and hardware counters.',
    quote: '"Pain is temporary. Quitting lasts forever." — Lance Armstrong'
  },
  {
    id: 'f8',
    title: 'Advanced NLP with Transformers',
    issuer: 'Stanford Online (Revisiting Foundations)',
    date: '2023',
    image: '/certificates/Tata.png',
    badge: 'Growth',
    description: 'Struggled with the mathematical derivations of self-attention mechanisms.',
    detailText: 'Got lost in the multi-dimensional tensor contractions and gradient flows. Pausing to complete linear algebra and vector calculus refreshers.',
    quote: '"Do not fear failure but rather fear not trying." — Roy T. Bennett'
  },
  {
    id: 'f9',
    title: 'Certified Kubernetes Administrator (CKA)',
    issuer: 'Cloud Native Foundation (Retaking)',
    date: '2023',
    image: '/certificates/Tata.png',
    badge: 'Resilient',
    description: 'Missed passing grade by 4% due to poor cluster troubleshooting speeds.',
    detailText: 'Struggled with systemd journal debugging on master nodes within the time limit. Building a local laboratory of virtual machines to practice under time stress.',
    quote: '"Fall seven times, stand up eight." — Japanese Proverb'
  },
  {
    id: 'f10',
    title: 'iOS Swift Mobile Architecture',
    issuer: 'Apple Developer (Paused Framework)',
    date: '2023',
    image: '/certificates/Tata.png',
    badge: 'Learning',
    description: 'SwiftUI bindings grew too complex. Reverting to web interfaces for initial release.',
    detailText: 'Created a prototype that suffered from data races and sync glitches. Paused mobile development to double-down on robust web architectures.',
    quote: '"Success is stumbling from failure to failure with no loss of enthusiasm." — Winston S. Churchill'
  }
]

export default function Certificates() {
  const [activeTab, setActiveTab] = useState('success') // 'success' | 'failure'
  const [selectedCert, setSelectedCert] = useState(null)

  // Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedCert(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Prevent scroll behind modal
  useEffect(() => {
    if (selectedCert) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedCert])

  const certs = activeTab === 'success' ? SUCCESS_CERTS : FAILURE_CERTS
  const isSuccess = activeTab === 'success'

  // Divide into three distinct rows to build the three marquee layers
  const row1 = [certs[0], certs[1], certs[2], certs[3]]
  const row2 = [certs[4], certs[5], certs[6], certs[7]]
  const row3 = [certs[8], certs[9], certs[0], certs[1]]

  // Duplicate each row three times to guarantee it wraps fully across ultra-wide viewports
  const row1Items = [...row1, ...row1, ...row1]
  const row2Items = [...row2, ...row2, ...row2]
  const row3Items = [...row3, ...row3, ...row3]

  const renderCardFrame = (cert) => {
    const certIsSuccess = cert.id.startsWith('s')
    return certIsSuccess ? (
      <SuccessFrame>
        <img src={cert.image} alt={cert.title} className={styles.certificateImage} loading="lazy" />
      </SuccessFrame>
    ) : (
      <FailureFrame>
        <img src={cert.image} alt={cert.title} className={styles.certificateImage} loading="lazy" />
      </FailureFrame>
    )
  }

  return (
    <section
      className={`${styles.section} ${isSuccess ? styles.successTheme : styles.failureTheme}`}
      id="certificates"
    >
      <div className={styles.inner}>

        {/* Header (Aligned on the same line) */}
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <span className="section-label">✦ Milestones</span>
            <h2 className={styles.titleText}>Certificates</h2>
          </div>

          {/* Toggle Switch */}
          <div className={styles.toggleContainer}>
            <button
              className={`${styles.toggleTab} ${isSuccess ? styles.activeTabSuccess : ''}`}
              onClick={() => setActiveTab('success')}
              aria-label="View winner certificates"
            >
              {isSuccess && (
                <motion.div
                  layoutId="activeTabHighlight"
                  className={`${styles.toggleHighlight} ${styles.bgSuccess}`}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className={styles.tabText}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2H6v2H2v6c0 2.21 1.79 4 4 4h1.09c.64 2.03 2.37 3.59 4.54 3.91V20H9v2h6v-2h-2.63v-2.09c2.17-.32 3.9-1.88 4.54-3.91H18c2.21 0 4-1.79 4-4V4h-4V2zM6 12c-1.1 0-2-.9-2-2V6h2v6zm14-2c0 1.1-.9 2-2 2v-6h2v6z" />
                </svg>
                Winner
              </span>
            </button>
            <button
              className={`${styles.toggleTab} ${!isSuccess ? styles.activeTabFailure : ''}`}
              onClick={() => setActiveTab('failure')}
              aria-label="View participation certificates"
            >
              {!isSuccess && (
                <motion.div
                  layoutId="activeTabHighlight"
                  className={`${styles.toggleHighlight} ${styles.bgFailure}`}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className={styles.tabText}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22V10" />
                  <path d="M12 10C12 7.79 10.21 6 8 6H4v4c0 2.21 1.79 4 4 4h4" />
                  <path d="M12 14c0-2.21 1.79-4 4-4h4v4c0 2.21-1.79 4-4 4h-4" />
                </svg>
                Participation
              </span>
            </button>
          </div>
        </div>

        {/* Motivational / Happy Theme Intro Line */}
        <div className={styles.themeIntro}>
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success-intro"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}
              >
                <span className={styles.celebrationBadge}>Winner Milestones</span>
                <p>A compilation of courses, specializations, and hackathons completed successfully. Validating technical growth and execution.</p>
              </motion.div>
            ) : (
              <motion.div
                key="failure-intro"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}
              >
                <span className={styles.motivationBadge}>Participation Curve</span>
                <p>"Success is not final, failure is not fatal: it is the courage to continue that counts." A transparent log of participation, learning paths, and resilience.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Three Layers of Scrolling Infinite Marquee Tracks */}
        <div className={styles.marqueeContainer}>

          {/* Row 1 - Slides Left */}
          <div className={styles.marqueeRow}>
            <div className={styles.marqueeTrackLeft}>
              {row1Items.map((cert, index) => (
                <div
                  key={`row1-${cert.id}-${index}`}
                  className={styles.card}
                  onClick={() => setSelectedCert(cert)}
                >
                  {renderCardFrame(cert)}

                  {/* Subtle info overlay visible on hover */}
                  <div className={styles.cardHoverOverlay}>
                    <h3 className={styles.hoverTitle}>{cert.title}</h3>
                    <div className={styles.hoverMeta}>
                      <span className={styles.hoverIssuer}>{cert.issuer}</span>
                      <span className={styles.hoverAction}>View →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 - Slides Right */}
          <div className={styles.marqueeRow}>
            <div className={styles.marqueeTrackRight}>
              {row2Items.map((cert, index) => (
                <div
                  key={`row2-${cert.id}-${index}`}
                  className={styles.card}
                  onClick={() => setSelectedCert(cert)}
                >
                  {renderCardFrame(cert)}

                  <div className={styles.cardHoverOverlay}>
                    <h3 className={styles.hoverTitle}>{cert.title}</h3>
                    <div className={styles.hoverMeta}>
                      <span className={styles.hoverIssuer}>{cert.issuer}</span>
                      <span className={styles.hoverAction}>View →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 3 - Slides Left Fast */}
          <div className={styles.marqueeRow}>
            <div className={styles.marqueeTrackLeftFast}>
              {row3Items.map((cert, index) => (
                <div
                  key={`row3-${cert.id}-${index}`}
                  className={styles.card}
                  onClick={() => setSelectedCert(cert)}
                >
                  {renderCardFrame(cert)}

                  <div className={styles.cardHoverOverlay}>
                    <h3 className={styles.hoverTitle}>{cert.title}</h3>
                    <div className={styles.hoverMeta}>
                      <span className={styles.hoverIssuer}>{cert.issuer}</span>
                      <span className={styles.hoverAction}>View →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Lightbox / Modal View */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              className={styles.modalContent}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className={styles.closeBtn}
                onClick={() => setSelectedCert(null)}
                aria-label="Close details"
              >
                ✕
              </button>

              <div className={styles.modalGrid}>
                {/* Certificate Visual Image */}
                <div className={styles.modalLeft}>
                  <div className={styles.modalImageFrame}>
                    {renderCardFrame(selectedCert)}
                  </div>
                </div>

                {/* Certificate Meta and Text Details */}
                <div className={styles.modalRight}>
                  <div className={styles.modalBadgeRow}>
                    <span className={`${styles.modalBadge} ${isSuccess ? styles.successBadge : styles.failureBadge}`}>
                      {selectedCert.badge}
                    </span>
                    <span className={styles.date}>{selectedCert.date}</span>
                  </div>

                  <h3 className={styles.modalTitle}>{selectedCert.title}</h3>

                  <div className={styles.modalMetaRow}>
                    <div>
                      <span className={styles.metaLabel}>Authority</span>
                      <span className={styles.metaValue}>{selectedCert.issuer}</span>
                    </div>
                  </div>

                  {/* Core Description / Motivation text block */}
                  <div className={styles.modalDescriptionBlock}>
                    <span className={styles.blockTitle}>
                      {isSuccess ? 'Subject Focus' : 'Failure Context & Hurdles'}
                    </span>
                    <p className={styles.blockText}>{selectedCert.description}</p>
                  </div>

                  {/* Deep detail text */}
                  <div className={styles.modalDescriptionBlock}>
                    <span className={styles.blockTitle}>
                      {isSuccess ? 'Milestone Achievement' : 'Key Lesson Learned'}
                    </span>
                    <p className={styles.blockText}>{selectedCert.detailText}</p>
                  </div>

                  {/* Quote block for failures */}
                  {!isSuccess && selectedCert.quote && (
                    <div className={styles.modalQuoteBlock}>
                      {selectedCert.quote}
                    </div>
                  )}
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
