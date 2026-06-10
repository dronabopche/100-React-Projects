import React from 'react'
import { motion } from 'framer-motion'
import styles from './Sidebar.module.css'

const SOCIALS = [
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/yourusername',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
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
    name: 'YouTube',
    href: 'https://youtube.com/@yourchannel',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.518 0 9.39-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    name: 'Kaggle',
    href: 'https://kaggle.com/yourusername',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.825 2.25c-.22 0-.435.086-.6.24l-7.397 7.085-2.942-2.316V2.7a.45.45 0 0 0-.45-.45H5.568a.45.45 0 0 0-.45.45v18.6a.45.45 0 0 0 .45.45h1.868a.45.45 0 0 0 .45-.45v-5.267l1.792-1.41 5.753 6.945c.17.206.426.327.697.327h2.822c.41 0 .668-.456.44-.798l-6.852-8.27 6.444-6.17a.64.64 0 0 0-.44-1.096h-3.003c-.272 0-.528.121-.7.327L10.366 12.2l4.898-3.854 4.02-6.101z"/>
      </svg>
    ),
  },
]

export default function Sidebar() {
  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.lineTop} />
      <div className={styles.iconList}>
        {SOCIALS.map((soc, idx) => (
          <motion.a
            key={soc.name}
            href={soc.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconLink}
            aria-label={soc.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * idx, duration: 0.5 }}
            whileHover={{ scale: 1.2, x: -6, color: 'var(--gold)' }}
            whileTap={{ scale: 0.95 }}
          >
            {soc.icon}
          </motion.a>
        ))}
      </div>
      <div className={styles.lineBottom} />
    </div>
  )
}
