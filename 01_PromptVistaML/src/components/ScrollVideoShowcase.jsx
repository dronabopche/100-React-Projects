import { useEffect, useRef, useState } from 'react'

const ScrollVideoShowcase = () => {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const [theme, setTheme] = useState('light')

  // 1. Detect current theme and observe changes on documentElement
  useEffect(() => {
    const root = window.document.documentElement
    
    // Get initial theme
    const isDark = root.classList.contains('dark')
    setTheme(isDark ? 'dark' : 'light')

    // Observe changes to the 'class' attribute of documentElement
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDarkNow = root.classList.contains('dark')
          setTheme(isDarkNow ? 'dark' : 'light')
        }
      })
    })

    observer.observe(root, { attributes: true })

    return () => {
      observer.disconnect()
    }
  }, [])

  // 2. Play video when in viewport (scroll down) and pause when out (scroll up)
  // Also dispatch custom event to make the navbar transparent when video overlaps/intersects
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.currentTime = 0 // Play once from the beginning on scroll entry
          video.play()
            .catch((err) => {
              console.log('Autoplay play execution failed/interrupted:', err)
            })
          window.dispatchEvent(new CustomEvent('video-in-view', { detail: { inView: true } }))
        } else {
          video.pause()
          window.dispatchEvent(new CustomEvent('video-in-view', { detail: { inView: false } }))
        }
      },
      {
        threshold: 0.15, // Trigger when 15% of the video is visible in the viewport
      }
    )

    observer.observe(video)

    return () => {
      observer.disconnect()
      window.dispatchEvent(new CustomEvent('video-in-view', { detail: { inView: false } }))
    }
  }, [theme])

  const videoSrc = theme === 'dark' ? '/video/Dark_mode_ss.mp4' : '/video/Light_mode_ss.mp4'

  return (
    <>
      <div className="video-divider-top" />
      <div 
        ref={containerRef} 
        className="relative w-screen h-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden bg-black select-none"
      >
        <video
          ref={videoRef}
          src={videoSrc}
          key={videoSrc} // Force React to recreate video element on source change for clean transition
          muted
          playsInline
          className="w-full h-full object-cover opacity-100"
        />
      </div>
      <div className="video-divider-bottom" />
    </>
  )
}

export default ScrollVideoShowcase
