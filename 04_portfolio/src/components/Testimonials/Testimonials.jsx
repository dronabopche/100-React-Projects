import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Testimonials.module.css'

const TESTIMONIALS = [
  { id: 1, name: 'Sarah Jenkins', role: 'Lead Architect @ TechNova', content: 'Working with Drona was a game-changer. His deep understanding of AI models and architecture significantly accelerated our product roadmap. Highly recommend!', date: 'Oct 2025' },
  { id: 2, name: 'David Chen', role: 'CTO @ QuantumLeap', content: 'Exceptional problem-solving skills and a true quantum enthusiast. Drona delivered beyond expectations on our complex machine learning integrations.', date: 'Nov 2025' },
  { id: 3, name: 'Elena Rodriguez', role: 'Product Manager @ InnovateAI', content: 'Drona brings a rare combination of technical brilliance and clear communication. The solutions provided were scalable, efficient, and brilliantly executed.', date: 'Dec 2025' },
  { id: 4, name: 'Michael Chang', role: 'VP Engineering @ DataSync', content: 'A visionary developer. Drona seamlessly blended cutting-edge frontend frameworks with robust backend architectures. A critical asset to any serious engineering team.', date: 'Jan 2026' },
  { id: 5, name: 'Jessica Alba', role: 'Design Lead @ CreativeFlow', content: 'His eye for design and pixel-perfect implementation is unmatched. Drona translated our complex Figma files into a flawless, high-performance web experience.', date: 'Feb 2026' },
  { id: 6, name: 'Robert Fox', role: 'Founder @ StartupX', content: 'Drona is the rare breed of engineer who understands business goals just as well as technical constraints. He helped us achieve our MVP 3 weeks ahead of schedule.', date: 'Mar 2026' },
  { id: 7, name: 'Emily White', role: 'Director of UX @ Visionary', content: 'The micro-interactions and performance optimizations he implemented blew us away. Highly recommended for premium, high-fidelity web applications.', date: 'Apr 2026' },
  { id: 8, name: 'Omar Hassan', role: 'Senior Developer @ GlobalTech', content: 'Collaborating with Drona was a breeze. Clean code, comprehensive documentation, and a brilliant approach to scalable state management.', date: 'May 2026' },
  { id: 9, name: 'Rachel Green', role: 'Marketing Head @ Trendify', content: 'Not only is he a brilliant engineer, but he also deeply cares about SEO and web accessibility. Our organic traffic surged after his technical overhaul.', date: 'Jun 2026' },
  { id: 10, name: 'Liam Neeson', role: 'Security Consultant @ CyberSafe', content: 'Impeccable attention to security practices. Drona proactively addressed vulnerabilities and built an incredibly secure authentication flow for us.', date: 'Jul 2026' },
  { id: 11, name: 'Sophia Martinez', role: 'Lead Data Scientist @ InsightAI', content: 'His ability to integrate complex machine learning endpoints into a beautiful, user-friendly frontend interface is truly remarkable.', date: 'Aug 2026' },
  { id: 12, name: 'William Blake', role: 'Chief Product Officer @ NextGen', content: 'Drona doesn’t just write code; he crafts digital experiences. The level of polish on the final product was beyond anything we had anticipated.', date: 'Sep 2026' },
  { id: 13, name: 'Olivia Scott', role: 'Scrum Master @ AgileTech', content: 'A true team player and a highly communicative developer. Drona consistently delivered sprint goals with zero bugs and zero delays.', date: 'Oct 2026' },
  { id: 14, name: 'James Wilson', role: 'DevOps Engineer @ CloudFirst', content: 'His understanding of CI/CD pipelines and cloud deployments is top-tier. He optimized our build times and created a flawless deployment strategy.', date: 'Nov 2026' },
  { id: 15, name: 'Isabella Taylor', role: 'CEO @ FutureWeb', content: 'Drona is simply one of the best engineers I have worked with. His dedication, skill level, and creative problem-solving are world-class.', date: 'Dec 2026' }
];

export default function Testimonials() {
  const [selectedId, setSelectedId] = useState(null)

  const activeTestimonial = TESTIMONIALS.find(t => t.id === selectedId)

  // We render the envelope card inside a component for cleaner mapping
  const MailCard = ({ t }) => (
    <div
      className={styles.mailCard}
      onClick={() => setSelectedId(t.id)}
    >
      <div className={styles.sleeveBack} />
      <div className={styles.letterPreview}>
        <div className={styles.letterTop}>
          <div className={styles.letterLine}></div>
          <div className={styles.letterLineShort}></div>
        </div>
        <div className={styles.letterAuthor}>
          {t.name}
        </div>
      </div>
      <div className={styles.sleeveFront}>
        <div className={styles.glassHighlight}></div>
        <div className={styles.sleeveContent}>
          <div className={styles.stamp}></div>
          <div className={styles.deliveryInfo}>
            <span className={styles.deliveryLabel}>{t.role}</span>
            <span className={styles.deliveryTarget}>{t.name}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section id="testimonials" className={styles.section}>
      <div className="divider">
        <div className="divider-gem" />
      </div>

      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">Words from Colleagues</span>
          <h2 className="section-title">Testimonials</h2>
          <p className={styles.subtext}>Select a letter to read</p>
        </motion.div>
      </div>

      {/* Infinite Marquee Container */}
      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeTrack}>
          {/* First Group */}
          <div className={styles.marqueeGroup}>
            {TESTIMONIALS.map((t) => (
              <MailCard key={`first-${t.id}`} t={t} />
            ))}
          </div>
          {/* Second Group (Duplicated for seamless infinite scroll) */}
          <div className={styles.marqueeGroup}>
            {TESTIMONIALS.map((t) => (
              <MailCard key={`second-${t.id}`} t={t} />
            ))}
          </div>
        </div>
      </div>

      {/* Immersive Reader Modal */}
      <AnimatePresence>
        {activeTestimonial && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            onClick={() => setSelectedId(null)}
          >
            <div className={styles.modalContentWrapper}>
              <motion.button 
                className={styles.closeBtn}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, transition: { delay: 0.3 } }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSelectedId(null)}
              >
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </motion.button>

              <motion.div 
                className={styles.fullLetter}
                initial={{ y: 100, opacity: 0, scale: 0.9, rotateX: 20 }}
                animate={{ 
                  y: 0, 
                  opacity: 1, 
                  scale: 1, 
                  rotateX: 0,
                  transition: { type: "spring", stiffness: 80, damping: 15, mass: 1.2 } 
                }}
                exit={{ 
                  y: 100, 
                  opacity: 0, 
                  scale: 0.9,
                  transition: { duration: 0.25 } 
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.fullLetterInner}>
                  <div className={styles.letterHeader}>
                    <div className={styles.dateBadge}>{activeTestimonial.date}</div>
                    <div className={styles.greeting}>To Drona,</div>
                  </div>
                  
                  <div className={styles.letterBody}>
                    <span className={styles.quoteMark}>"</span>
                    <p>{activeTestimonial.content}</p>
                  </div>

                  <div className={styles.letterFooter}>
                    <div className={styles.signatureBlock}>
                      <div className={styles.signatureName}>{activeTestimonial.name}</div>
                      <div className={styles.signatureRole}>{activeTestimonial.role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
