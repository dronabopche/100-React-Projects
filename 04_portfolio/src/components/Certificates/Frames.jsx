import React from 'react'
import styles from './Certificates.module.css'

export function SuccessFrame({ children }) {
  return (
    <div className={styles.successFrameContainer}>
      <div className={styles.successCertificateWrapper}>
        {children}
      </div>
      <img
        src="/certificates/royal_frame_new.png"
        alt="Success Frame"
        className={styles.frameOverlay}
        loading="lazy"
      />
    </div>
  )
}

export function FailureFrame({ children }) {
  return (
    <div className={styles.failureFrameContainer}>
      <div className={styles.failureCertificateWrapper}>
        {children}
      </div>
      <img
        src="/certificates/royal_frame_failure.png"
        alt="Failure Frame"
        className={styles.frameOverlay}
        loading="lazy"
      />
    </div>
  )
}

