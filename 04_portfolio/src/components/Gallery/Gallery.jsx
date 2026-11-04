import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import styles from './Gallery.module.css'

export default function Gallery() {
  const images = [
    { src: '/visual-work/codefest.webp', subtitle: 'Runner UP in Offline Coding Competition' },
    { src: '/visual-work/host.webp', subtitle: 'Hosted Coding Competition at St. Edmund' },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // Swipe detection for mobile touch
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  const minSwipeDistance = 40

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe) {
      handleNext()
    } else if (isRightSwipe) {
      handlePrev()
    }
  }

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: -25 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  return (
    <motion.section
      className={styles.section}
      id="gallery"
      initial={{ opacity: 0, y: -30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.inner}>
        
        {/* Header */}
        <div className={styles.header}>
          <span className="section-label">✦ Gallery</span>
          <h2 className="section-title">Visual Work</h2>
        </div>

        {/* Desktop Grid Layout */}
        <motion.div
          className={styles.grid}
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {images.map((img, i) => (
            <motion.div
              key={i}
              className={styles.card}
              variants={item}
              whileHover={{ y: -6 }}
            >
              <img src={img.src} alt={`gallery-${i}`} />
              <div className={styles.overlay} />
              <div className={styles.subtitle}>
                {img.subtitle}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Carousel / Swipe Slider */}
        <div 
          className={styles.sliderWrapper}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className={styles.sliderCard}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className={styles.sliderImageContainer}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                <img 
                  src={images[currentIndex].src} 
                  alt={`gallery-${currentIndex}`} 
                  className={styles.sliderImage}
                />
                <div className={styles.sliderOverlay} />
                <div className={styles.sliderSubtitle}>
                  {images[currentIndex].subtitle}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className={styles.dots}>
            {images.map((_, idx) => (
              <button
                key={idx}
                className={`${styles.dot} ${currentIndex === idx ? styles.activeDot : ''}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to photo ${idx + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </motion.section>
  )
}