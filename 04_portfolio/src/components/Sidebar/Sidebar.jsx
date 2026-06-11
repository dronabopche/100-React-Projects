import React from 'react'
import { motion } from 'framer-motion'
import styles from './Sidebar.module.css'

const SOCIALS = [
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/dronabopche',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    href: 'https://github.com/dronabopche',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    ),
  },
  {
    name: 'Kaggle',
    href: 'https://kaggle.com/dronabopche',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.825 2.25c-.22 0-.435.086-.6.24l-7.397 7.085-2.942-2.316V2.7a.45.45 0 0 0-.45-.45H5.568a.45.45 0 0 0-.45.45v18.6a.45.45 0 0 0 .45.45h1.868a.45.45 0 0 0 .45-.45v-5.267l1.792-1.41 5.753 6.945c.17.206.426.327.697.327h2.822c.41 0 .668-.456.44-.798l-6.852-8.27 6.444-6.17a.64.64 0 0 0-.44-1.096h-3.003c-.272 0-.528.121-.7.327L10.366 12.2l4.898-3.854 4.02-6.101z" />
      </svg>
    ),
  },
  {
    name: 'Games',
    isGame: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.58 6.9l-3.3-3.3A2.02 2.02 0 0 0 16.85 3H7.15c-.53 0-1.04.21-1.42.59L2.42 6.9C2.15 7.18 2 7.55 2 7.93v5.6c0 1.95 1.57 3.53 3.52 3.53h.05c.84 0 1.63-.3 2.27-.85l2.25-1.92h3.8l2.25 1.93c.64.55 1.43.84 2.27.84h.05c1.95 0 3.52-1.57 3.52-3.52v-5.6c0-.38-.15-.75-.42-1.03zM8 11.5H6.5V13H5v-1.5H3.5V10H5V8.5h1.5V10H8v1.5zm8 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2.5-2.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
      </svg>
    ),
  },
  {
    name: 'ThemeToggle',
    isTheme: true,
  }
]

export default function Sidebar({ openGame, toggleTheme, theme }) {
  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.lineTop} />
      <div className={styles.iconList}>
        {SOCIALS.map((soc, idx) => {
          let icon = soc.icon
          let name = soc.name

          if (soc.isTheme) {
            name = theme === 'dark' ? 'Light Mode' : 'Dark Mode'
            icon = theme === 'dark' ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0-7a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm0 17a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1zm9-9a1 1 0 0 1 0 2h-1a1 1 0 1 1 0-2h1zM4 12a1 1 0 0 1 0 2H3a1 1 0 1 1 0-2h1zm13.364-7.364a1 1 0 0 1 0 1.414l-.707.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0zM7.757 16.243a1 1 0 0 1 0 1.414l-.707.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0zm10.607.707a1 1 0 0 1 1.414 0l.707.707a1 1 0 1 1-1.414 1.414l-.707-.707a1 1 0 0 1 0-1.414zM7.757 7.757a1 1 0 0 1-1.414 0l-.707-.707a1 1 0 1 1 1.414-1.414l.707.707a1 1 0 0 1 0 1.414z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a1 1 0 0 0-1.88-.18 7.004 7.004 0 0 1-8.28-8.28 1 1 0 0 0-1.18-1.18c-.44.06-.9.1-1.36.1z" />
              </svg>
            )
          }

          return (
            <motion.a
              key={soc.name}
              href={soc.href}
              target={soc.href ? "_blank" : undefined}
              rel={soc.href ? "noopener noreferrer" : undefined}
              className={styles.iconLink}
              aria-label={name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx, duration: 0.5 }}
              whileHover={{ scale: 1.2, x: -6 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                if (soc.isGame) {
                  e.preventDefault()
                  openGame()
                } else if (soc.isTheme) {
                  e.preventDefault()
                  toggleTheme()
                }
              }}
            >
              {icon}
            </motion.a>
          )
        })}
      </div>
      <div className={styles.lineBottom} />
    </div>
  )
}
