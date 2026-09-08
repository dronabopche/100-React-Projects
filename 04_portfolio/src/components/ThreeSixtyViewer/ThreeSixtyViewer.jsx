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

  const animationFrameRef = useRef(null)

  useEffect(() => {
    if (isInView && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(err => {
        console.log('Autoplay was blocked or interrupted:', err)
      })
    }
  }, [isInView])

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video) return
    const duration = video.duration || 8
    const progress = (video.currentTime / duration) % 1
    const sector = Math.floor((progress + 0.125) * 4) % 4
    setActiveDot(sector)
  }

  const handleViewClick = (targetTime) => {
    const video = videoRef.current
    if (!video) return

    // Cancel any existing interpolation animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    video.pause()
    const duration = video.duration || 8
    const startTime = video.currentTime % duration
    let diff = (targetTime - startTime) % duration

    // Find the shortest path around the 360 loop
    if (diff > duration / 2) {
      diff -= duration
    } else if (diff < -duration / 2) {
      diff += duration
    }

    const animDuration = 600 // ms
    const startTimestamp = performance.now()

    // Smooth cubic ease-in-out curve
    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

    const animateTransition = (currentTimestamp) => {
      const elapsed = currentTimestamp - startTimestamp
      const progress = Math.min(elapsed / animDuration, 1)
      const easedProgress = easeInOutCubic(progress)

      let newTime = (startTime + diff * easedProgress) % duration
      if (newTime < 0) newTime += duration

      video.currentTime = newTime

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateTransition)
      } else {
        video.currentTime = targetTime
        video.play().catch(() => {})
      }
    }

    animationFrameRef.current = requestAnimationFrame(animateTransition)
  }

  return (
    <section className={styles.section} ref={containerRef}>
      {/* Video Container Layout filling viewport */}
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
      </div>

      {/* Section Header overlay */}
      <div className={styles.header}>
        <h2 className={styles.title}>
          Interactive Model
        </h2>
      </div>

      {/* Floating Indicators at bottom */}
      <div className={styles.overlayContent}>
        <div className={styles.indicatorContainer}>
          <div className={styles.controls}>
            {VIEWS.map((view, index) => (
              <button
                key={view.label}
                type="button"
                onClick={() => handleViewClick(view.time)}
                className={`${styles.indicatorNode} ${activeDot === index ? styles.activeDot : ''}`}
                aria-label={`View ${view.label}`}
              >
                <span className={styles.dot} />
                <span className={styles.dotLabel}>{view.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
