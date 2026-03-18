import { motion } from 'framer-motion'
import styles from './Gallery.module.css'

export default function Gallery() {
  const images = [
    '/gallery/img1.jpg',
    '/gallery/img2.jpg',
    '/gallery/img3.jpg',
    '/gallery/img4.jpg',
    '/gallery/img5.jpg',
    '/gallery/img6.jpg',
  ]

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  return (
    <section className={styles.section} id="gallery">
      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.header}>
          <span className="section-label">✦ Gallery</span>
          <h2 className="section-title">Visual Work</h2>
        </div>

        {/* Grid */}
        <motion.div
          className={styles.grid}
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {images.map((src, i) => (
            <motion.div
              key={i}
              className={styles.card}
              variants={item}
              whileHover={{ y: -6 }}
            >
              <img src={src} alt={`gallery-${i}`} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}