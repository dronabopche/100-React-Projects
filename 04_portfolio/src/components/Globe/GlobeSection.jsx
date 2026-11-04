import React from 'react'
import { motion } from 'motion/react'
import Globe from './Globe'
import styles from './GlobeSection.module.css'

export default function GlobeSection({ theme }) {
  const isLight = theme === 'light'

  return (
    <motion.section
      className={styles.section}
      id="global-presence"
      initial={{ opacity: 0, y: -30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className="section-label">✦ Global Reach</span>
          <h2 className="section-title">Worldwide Impact</h2>
          <div className="divider">
            <div className="divider-gem" />
          </div>
        </div>

        <div className={styles.globeWrapper}>
          <Globe
            speed={1.5}
            scale={7.5}
            oceanColor={isLight ? 'rgba(253, 252, 247, 0)' : 'rgba(12, 8, 6, 0)'}
            outlineColor={isLight ? '#b8860b' : '#c0850e'}
            graticuleColor={isLight ? 'rgba(184, 134, 11, 0.15)' : 'rgba(201, 168, 76, 0.15)'}
            dots={{
              color: isLight ? '#b8860b' : '#eebb2f',
              size: 4.5,
              density: 7,
              allDots: false,
            }}
            markerConfig={{
              markers: [
                { lat: 28.6139, lng: 77.2090 }, // New Delhi, India
                { lat: 37.7749, lng: -122.4194 }, // San Francisco, USA
                { lat: 51.5074, lng: -0.1278 }, // London, UK
                { lat: 35.6762, lng: 139.6503 }, // Tokyo, Japan
                { lat: 1.3521, lng: 103.8198 }, // Singapore
              ],
              color: isLight ? '#c0850e' : '#ffd700',
              size: 35,
            }}
            dragSpeed={4}
            smoothing={7}
          />
        </div>
      </div>
    </motion.section>
  )
}

