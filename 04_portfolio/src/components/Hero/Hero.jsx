import React, { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import SpecularButton from '../SpecularButton/SpecularButton'
import styles from './Hero.module.css'

export default function Hero() {
  const name = 'Drona Bopche'
  const role = 'ML Developer · Quantum Enthusiast · AI Engineer'
  const tagline =
    'Crafting elegant solutions through code, automation, and machine intelligence.'

  const darkVideoRef = useRef(null)
  const lightVideoRef = useRef(null)
  const heroRef = useRef(null)

  useEffect(() => {
    const darkVideo = darkVideoRef.current
    const lightVideo = lightVideoRef.current

    if (darkVideo) darkVideo.pause()
    if (lightVideo) lightVideo.pause()

    const handleScroll = () => {
      if (!heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      const heroHeight = rect.height || window.innerHeight
      const scrolled = -rect.top
      let progress = scrolled / heroHeight
      progress = Math.max(0, Math.min(1, progress))

      if (darkVideo && darkVideo.duration) {
        darkVideo.currentTime = progress * darkVideo.duration
      }
      if (lightVideo && lightVideo.duration) {
        lightVideo.currentTime = progress * lightVideo.duration
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    if (darkVideo) {
      darkVideo.addEventListener('loadedmetadata', handleScroll)
    }
    if (lightVideo) {
      lightVideo.addEventListener('loadedmetadata', handleScroll)
    }

    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (darkVideo) {
        darkVideo.removeEventListener('loadedmetadata', handleScroll)
      }
      if (lightVideo) {
        lightVideo.removeEventListener('loadedmetadata', handleScroll)
      }
    }
  }, [])

  return (
    <section ref={heroRef} className={styles.hero}>
      {/* Left — text side */}
      <div className={styles.left}>
        <motion.div
          className={styles.textBlock}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.eyebrow}>✦ Portfolio</span>

          <h1 className={styles.name}>
            Drona <br className={styles.mobileBreak} /> Bopche
          </h1>

          <div className={styles.titleRow}>
            <span className={styles.titleLine} />
            <p className={styles.role}>{role}</p>
          </div>

          <p className={styles.tagline}>{tagline}</p>

          <div className={styles.ctas}>
            <a
              href="#projects"
              className={styles.button}
            >
              <div className={styles.wrap}>
                <p>
                  <span>View Work</span>
                </p>
              </div>
            </a>

            <SpecularButton
              href="#contact"
              size="lg"
              radius={2}
              intensity={1.1}
              thickness={1.1}
              proximity={300}
              speed={0.4}
              followMouse={true}
            >
              Get in Touch
            </SpecularButton>
          </div>

          <div className={styles.scroll}>
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              ↓
            </motion.span>
            <span>Scroll</span>
          </div>
        </motion.div>
      </div>

      {/* Right — video side */}
      <motion.div
        className={styles.right}
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Dark theme profile video */}
        <video
          ref={darkVideoRef}
          src="/landing_page/profile.webm"
          muted
          playsInline
          preload="auto"
          className={`${styles.portrait} ${styles.portraitDark}`}
        />

        {/* Light theme profile video */}
        <video
          ref={lightVideoRef}
          src="/landing_page/profile-light.webm"
          muted
          playsInline
          preload="auto"
          className={`${styles.portrait} ${styles.portraitLight}`}
        />

      </motion.div>
    </section>
  )
}