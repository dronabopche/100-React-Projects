import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)

  // Subtle grid + floating particles background
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W, H, raf
    const particles = []

    function resize() {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        o: Math.random() * 0.5 + 0.2,
      })
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)
      // Grid
      ctx.strokeStyle = 'rgba(30,37,48,0.6)'
      ctx.lineWidth = 1
      const step = 48
      for (let x = 0; x < W; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }
      for (let y = 0; y < H; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      }
      // Particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H
        if (p.y > H) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(94,234,212,${p.o})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg flex flex-col items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(94,234,212,0.06) 0%, transparent 70%)',
        }}
      />

      <div
        className="relative z-10 flex flex-col items-center text-center px-6"
        style={{ animation: 'fade-up 0.8s ease forwards' }}
      >
        {/* Symbol */}
        <div
          className="mb-8 text-6xl select-none"
          style={{
            color: '#5eead4',
            textShadow: '0 0 40px rgba(94,234,212,0.5)',
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          ∑
        </div>

        <h1
          className="text-5xl md:text-7xl font-bold mb-4 tracking-tight"
          style={{
            fontFamily: 'Syne, sans-serif',
            background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          MathBits
        </h1>

        <p
          className="text-text-dim text-lg md:text-xl mb-2 font-light"
          style={{ fontFamily: 'DM Sans, sans-serif', maxWidth: 420 }}
        >
          Mathematically generated UI components.
        </p>
        <p
          className="text-muted text-sm mb-12"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          Backgrounds · Animations · Color · Text
        </p>

        <button
          onClick={() => navigate('/home')}
          className="group relative px-8 py-3.5 rounded-xl font-medium text-sm tracking-wide transition-all duration-200"
          style={{
            background: 'rgba(94,234,212,0.1)',
            border: '1px solid rgba(94,234,212,0.35)',
            color: '#5eead4',
            fontFamily: 'DM Sans, sans-serif',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(94,234,212,0.18)'
            e.currentTarget.style.boxShadow = '0 0 24px rgba(94,234,212,0.2)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(94,234,212,0.1)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          Browse Components →
        </button>

        {/* Stat row */}
        <div className="mt-16 flex gap-10 text-center">
          {[
            { val: '12+', label: 'Components' },
            { val: '4', label: 'Categories' },
            { val: '∞', label: 'Math' },
          ].map(s => (
            <div key={s.label}>
              <div
                className="text-2xl font-bold"
                style={{ fontFamily: 'Syne, sans-serif', color: '#5eead4' }}
              >
                {s.val}
              </div>
              <div className="text-xs text-muted mt-0.5" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
