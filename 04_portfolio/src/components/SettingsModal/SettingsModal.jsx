import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import styles from './SettingsModal.module.css'

const ANIMATIONS = [
  { id: 'wave', label: 'Wave', description: 'Sweeping columns across the screen' },
  { id: 'fade', label: 'Fade', description: 'Smooth fade transition' },
  { id: 'circle', label: 'Circle', description: 'Expanding circular reveal' },
  { id: 'wipe', label: 'Wipe', description: 'Horizontal wipe effect' },
  { id: 'split', label: 'Split', description: 'Vertical split reveal' },
]

const FONTS = [
  { id: 'garamond', label: 'Classical Serif' },
  { id: 'inter', label: 'Modern Sans' },
  { id: 'cormorant', label: 'Warm Serif' },
]

export default function SettingsModal({ isOpen, onClose, currentAnimation, onSelectAnimation, currentFont, onSelectFont }) {
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
              <div className={styles.sectionHeader}>Page Transitions</div>
              <p className={styles.description}>
                Select the animation effect that plays when switching between light and dark mode.
              </p>
              
              <div className={styles.animationList} style={{ maxHeight: '180px', overflowY: 'auto', paddingRight: '4px', marginBottom: '1.2rem' }}>
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

              <div className={styles.sectionHeader}>Website Font</div>
              <div className={styles.fontGrid}>
                {FONTS.map((font) => (
                  <button
                    key={font.id}
                    style={{ fontFamily: font.id === 'inter' ? 'Inter, sans-serif' : font.id === 'cormorant' ? 'Cormorant Garamond, serif' : 'EB Garamond, serif' }}
                    className={`${styles.fontOption} ${currentFont === font.id ? styles.selected : ''}`}
                    onClick={() => onSelectFont(font.id)}
                  >
                    {font.label}
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
