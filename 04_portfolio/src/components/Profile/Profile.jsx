// ─── components/Profile/Profile.jsx ──────────────────────────────────────────
import { motion } from 'framer-motion'
import styles from './Profile.module.css'

export default function Profile({ profile }) {
  const name = profile?.name || 'Your Name'
  const bio = profile?.bio || 'Developer · Builder · Creator'
  const avatarUrl = profile?.avatar_url || null
  const login = profile?.login || 'username'

  return (
    <motion.section
      className={styles.section}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Ambient glow behind avatar */}
      <div className={styles.glowRing} />

      <motion.div
        className={styles.avatarWrap}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder}>
            <span>{name.charAt(0)}</span>
          </div>
        )}
      </motion.div>

      <motion.div
        className={styles.info}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        <h1 className={styles.name}>{name}</h1>
        <p className={styles.handle}>@{login}</p>
        {bio && <p className={styles.bio}>{bio}</p>}
      </motion.div>

      <motion.div
        className={styles.scroll}
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        ↓
      </motion.div>
    </motion.section>
  )
}
