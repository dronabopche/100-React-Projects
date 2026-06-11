import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './SettingsModal.module.css'

const ANIMATIONS = [
  { id: 'wave', label: 'Wave', description: 'Sweeping columns across the screen' },
  { id: 'fade', label: 'Fade', description: 'Smooth fade transition' },
  { id: 'circle', label: 'Circle', description: 'Expanding circular reveal' },
  { id: 'wipe', label: 'Wipe', description: 'Horizontal wipe effect' },
  { id: 'split', label: 'Split', description: 'Vertical split reveal' },
]

export default function SettingsModal({ isOpen, onClose, currentAnimation, onSelectAnimation }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className={styles.modal}
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.header}>
              <h2 className={styles.title}>Theme Settings</h2>
              <button className={styles.closeBtn} onClick={onClose} aria-label="Close settings">
                ✕
              </button>
            </div>
            
            <div className={styles.content}>
              <p className={styles.description}>
                Select the animation effect that plays when switching between light and dark mode.
              </p>
              
              <div className={styles.animationList}>
                {ANIMATIONS.map((anim) => (
                  <button
                    key={anim.id}
                    className={`${styles.animationOption} ${currentAnimation === anim.id ? styles.selected : ''}`}
                    onClick={() => onSelectAnimation(anim.id)}
                  >
                    <div className={styles.optionHeader}>
                      <span className={styles.optionLabel}>{anim.label}</span>
                      {currentAnimation === anim.id && (
                        <span className={styles.checkIcon}>✓</span>
                      )}
                    </div>
                    <span className={styles.optionDesc}>{anim.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
