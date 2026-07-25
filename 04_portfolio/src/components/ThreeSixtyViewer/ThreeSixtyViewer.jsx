import { useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'
import styles from './ThreeSixtyViewer.module.css'

export default function ThreeSixtyViewer({ theme }) {
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const [activeDot, setActiveDot] = useState(0)

  // Trigger autoplay once when the component enters viewport
  const isInView = useInView(containerRef, { once: true, amount: 0.3 })

  const VIEWS = [
    { label: 'Front', time: 0 },
    { label: 'Right', time: 2 },
    { label: 'Back', time: 4 },
    { label: 'Left', time: 6 }
  ]

  useEffect(() => {
    if (isInView && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(err => {
        console.log('Autoplay was blocked or interrupted:', err)
      })
    }
  }, [isInView])

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video) return
    const duration = video.duration || 8
    const progress = (video.currentTime / duration) % 1
    const sector = Math.floor((progress + 0.125) * 4) % 4
    setActiveDot(sector)
  }

  return (
    <section className={styles.section} ref={containerRef}>
      {/* Section Header - position layout-wise before/above the video */}
      <div className={styles.header}>
        <span className="section-label" align="center">
          ✦ 360° View
        </span>
        <h2 className={`section-title ${styles.title}`} align="center">
          Interactive Model
        </h2>
      </div>

      {/* Video Container Layout */}
      <div className={styles.videoWrapper}>
        <video
          ref={videoRef}
          src={theme === 'dark' ? '/360 degree/dark_360.mp4' : '/360 degree/light_360.mp4'}
          className={styles.video}
          muted
          playsInline
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
        />
        
        {/* Vignette Overlay */}
        <div className={styles.vignetteOverlay} />

        {/* Floating Indicators at the bottom center of the video */}
        <div className={styles.overlayContent}>
          <div className={styles.indicatorContainer}>
            <div className={styles.controls}>
              {VIEWS.map((view, index) => (
                <div
                  key={view.label}
                  className={`${styles.indicatorNode} ${activeDot === index ? styles.activeDot : ''}`}
                >
                  <span className={styles.dot} />
                  <span className={styles.dotLabel}>{view.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
