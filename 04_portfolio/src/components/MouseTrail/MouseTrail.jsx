import React, { useEffect, useRef } from 'react'
import styles from './MouseTrail.module.css'

export default function MouseTrail() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId
    let particles = []

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    const createParticle = (x, y, isScroll = false) => {
      const colors = ['#ffce54ff', '  #fff7a2ff', '#785a00ff', '#fffcf2ff']
      const color = colors[Math.floor(Math.random() * colors.length)]
      return {
        x,
        y,
        vx: isScroll ? (Math.random() - 0.5) * 0.6 : (Math.random() - 0.5) * 1.6,
        vy: isScroll ? (Math.random() - 0.5) * 4.0 : (Math.random() - 0.5) * 1.6 - 0.3,
        life: 1.0,
        decay: isScroll ? 0.025 + Math.random() * 0.02 : 0.03 + Math.random() * 0.03,
        color,
        size: isScroll ? 2 + Math.random() * 3.5 : 1.5 + Math.random() * 3
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.life -= p.decay

        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        ctx.fillStyle = p.color
        ctx.shadowBlur = 4
        ctx.shadowColor = p.color
        ctx.globalAlpha = p.life
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1.0
      ctx.shadowBlur = 0 // reset shadow for performance

      animationId = requestAnimationFrame(render)
    }

    render()

    const handleMouseMove = (e) => {
      particles.push(createParticle(e.clientX, e.clientY))
      if (Math.random() > 0.4) {
        particles.push(createParticle(e.clientX, e.clientY))
      }
    }

    const handleScroll = () => {
      const scrollY = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight
      const innerHeight = window.innerHeight
      const maxScroll = scrollHeight - innerHeight
      if (maxScroll <= 0) return

      // Calculate vertical scrollbar thumb dimensions and position
      const thumbHeight = Math.max(30, innerHeight * (innerHeight / scrollHeight))
      const trackHeight = innerHeight - thumbHeight
      const scrollRatio = scrollY / maxScroll
      const yTop = scrollRatio * trackHeight
      const xPos = window.innerWidth - 6 // right edge browser scrollbar position

      // Shoot sparkles leftward along the entire height of the scrollbar thumb (vertical line)
      particles.push(createParticle(xPos, yTop + Math.random() * thumbHeight, true))
      if (Math.random() > 0.3) {
        particles.push(createParticle(xPos, yTop + Math.random() * thumbHeight, true))
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.globalTrailCanvas} />
}
