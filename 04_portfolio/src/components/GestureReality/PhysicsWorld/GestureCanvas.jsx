import React, { useEffect, useState, useRef } from 'react'
import { useGestureStore } from '../../../store/useGestureStore'
import { handTracker } from '../HandTracker'

// Maps MediaPipe gesture names to our gesture state names
const GESTURE_MAP = {
  Closed_Fist: 'FIST',
  Open_Palm: 'OPEN_PALM',
  Pointing_Up: 'PINCH',
  Victory: 'VICTORY',
  Thumb_Up: 'THUMBS_UP',
  Thumb_Down: 'THUMBS_DOWN',
  ILoveYou: 'SPIDERMAN',
}

const NUM_JEWELS = 20
const TRAIL_LENGTH = 15

export default function GestureCanvas({ theme, onClose }) {
  const [isReady, setIsReady] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(true)
  
  const setMode = useGestureStore((s) => s.setMode)
  const gestureState = useGestureStore((s) => s.gestureState)
  const setGestureState = useGestureStore((s) => s.setGestureState)
  const setHandCursor = useGestureStore((s) => s.setHandCursor)

  const canvasRef = useRef(null)

  // Initialize Camera & Tracker
  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        await handTracker.initialize()
        const hasCam = await handTracker.startCamera()
        if (cancelled) return
        if (hasCam) {
          setIsCameraActive(true)
        } else {
          setIsCameraActive(false)
        }
        setIsReady(true)
      } catch (err) {
        if (!cancelled) {
          setIsCameraActive(false)
          setIsReady(true)
        }
      }
    }

    init()

    return () => {
      cancelled = true
      handTracker.stopCamera()
    }
  }, [])

  // Lock scrolling
  useEffect(() => {
    if (isReady) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isReady])

  // Canvas Physics & Render Loop
  useEffect(() => {
    if (!isReady) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId
    let particles = []
    let lastWristPos = null

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    const darkColors = ['#ffce54', '#c8870c', '#ffc518', '#fffcf2']
    const lightColors = ['#b8860b', '#8b6508', '#5c4b37', '#d4af37']
    const colors = theme === 'light' ? lightColors : darkColors
    const shapes = ['circle', 'diamond', 'square', 'star']

    // Initialize 20 fixed jewels
    for (let i = 0; i < NUM_JEWELS; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        size: 5 + Math.random() * 4,
        angle: Math.random() * Math.PI * 2, // Continuous rotation angle
        rotationSpeed: (Math.random() - 0.5) * 0.2, // Spin velocity
        orbitOffset: Math.random() * Math.PI * 2, // Phase offset for orbiting
        history: [], // For trailing effect
      })
    }

    const digit1Points = Array.from({ length: NUM_JEWELS }, (_, i) => ({
      x: 0,
      y: -180 + 360 * (i / (NUM_JEWELS - 1))
    }))

    const getDigit2Points = () => {
      const pts = []
      for (let i = 0; i < 8; i++) {
        const t = Math.PI - (Math.PI * i / 7)
        pts.push({
          x: Math.cos(t) * 90,
          y: -120 + Math.sin(t) * 70
        })
      }
      for (let i = 1; i <= 6; i++) {
        const ratio = i / 7
        pts.push({
          x: 90 - 180 * ratio,
          y: -120 + 240 * ratio
        })
      }
      for (let i = 1; i <= 6; i++) {
        const ratio = i / 6
        pts.push({
          x: -90 + 180 * ratio,
          y: 120
        })
      }
      return pts
    }

    const getDigit3Points = () => {
      const pts = []
      for (let i = 0; i < 10; i++) {
        const t = Math.PI * 1.25 - (Math.PI * 1.5 * i / 9)
        pts.push({
          x: Math.cos(t) * 85,
          y: -80 + Math.sin(t) * 80
        })
      }
      for (let i = 0; i < 10; i++) {
        const t = Math.PI * 0.25 - (Math.PI * 1.5 * i / 9)
        pts.push({
          x: Math.cos(t) * 85,
          y: 80 + Math.sin(t) * 80
        })
      }
      return pts
    }

    const digit2Points = getDigit2Points()
    const digit3Points = getDigit3Points()

    const getHeartPoints = () => {
      const pts = []
      for (let i = 0; i < NUM_JEWELS; i++) {
        const t = (i / NUM_JEWELS) * Math.PI * 2
        const x = 16 * Math.pow(Math.sin(t), 3)
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
        pts.push({
          x: x * 10,
          y: -y * 10
        })
      }
      return pts
    }
    const heartPoints = getHeartPoints()

    const drawStar = (ctx, cx, cy, spikes, outerRadius, innerRadius) => {
      let rot = (Math.PI / 2) * 3
      let x = cx
      let y = cy
      let step = Math.PI / spikes

      ctx.beginPath()
      ctx.moveTo(cx, cy - outerRadius)
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius
        y = cy + Math.sin(rot) * outerRadius
        ctx.lineTo(x, y)
        rot += step

        x = cx + Math.cos(rot) * innerRadius
        y = cy + Math.sin(rot) * innerRadius
        ctx.lineTo(x, y)
        rot += step
      }
      ctx.lineTo(cx, cy - outerRadius)
      ctx.closePath()
    }

    let currentGesture = 'IDLE'
    let lastGestureTime = 0

    let mousePos = { x: canvas.width / 2, y: canvas.height / 2 }
    let isMouseDown = false
    let currentKeyGesture = null

    const handleMouseMove = (e) => {
      mousePos = { x: e.clientX, y: e.clientY }
    }

    const handleMouseDown = () => {
      isMouseDown = true
    }

    const handleMouseUp = () => {
      isMouseDown = false
    }

    const handleKeyDown = (e) => {
      if (e.key === '1') currentKeyGesture = 'ONE'
      else if (e.key === '2') currentKeyGesture = 'TWO'
      else if (e.key === '3') currentKeyGesture = 'THREE'
      else if (e.key === '0' || e.key === 'Escape' || e.key === 'c') currentKeyGesture = null
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('keydown', handleKeyDown)

    const render = () => {
      // Clear canvas fully to preserve true transparency for portfolio background
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 1. Detect Hand & Gestures
      const results = isCameraActive ? handTracker.detect() : null
      let handCenter = null
      let pointerTip = null
      let isHandPresent = false
      let activeGesture = 'IDLE'
      let currentSwipe = null

      if (isCameraActive && results && results.landmarks && results.landmarks.length > 0) {
        isHandPresent = true
        const landmarks = results.landmarks[0]

        const toScreenX = (x) => (1 - x) * canvas.width
        const toScreenY = (y) => y * canvas.height

        const indexTip = landmarks[8]
        const wrist = landmarks[0]
        const middleBase = landmarks[9]

        if (indexTip) {
          pointerTip = { x: toScreenX(indexTip.x), y: toScreenY(indexTip.y) }
          setHandCursor(pointerTip.x, pointerTip.y)
        }

        if (wrist && middleBase) {
          handCenter = {
            x: toScreenX((wrist.x + middleBase.x) / 2),
            y: toScreenY((wrist.y + middleBase.y) / 2)
          }
        }

        // Swipe Detection
        if (wrist) {
          const screenWristX = toScreenX(wrist.x)
          if (lastWristPos) {
            const dx = screenWristX - lastWristPos.x
            if (dx > 50) currentSwipe = 'SWIPE_RIGHT'
            if (dx < -50) currentSwipe = 'SWIPE_LEFT'
          }
          lastWristPos = { x: screenWristX, y: toScreenY(wrist.y) }
        }

        // Determine Gesture
        if (currentSwipe) {
          activeGesture = currentSwipe
        } else if (results.gestures && results.gestures.length > 0) {
          const top = results.gestures[0][0]
          if (top && top.score > 0.5) {
            activeGesture = GESTURE_MAP[top.categoryName] || 'IDLE'
          }
        }

        // Custom finger counting overrides for 1, 2, 3
        const isIndexUp = landmarks[8].y < landmarks[6].y
        const isMiddleUp = landmarks[12].y < landmarks[10].y
        const isRingUp = landmarks[16].y < landmarks[14].y
        const isPinkyUp = landmarks[20].y < landmarks[18].y

        let fingerCount = 0
        if (isIndexUp) fingerCount++
        if (isMiddleUp) fingerCount++
        if (isRingUp) fingerCount++
        if (isPinkyUp) fingerCount++

        if (!currentSwipe) {
          if (
            activeGesture === 'FIST' ||
            activeGesture === 'PINCH' ||
            activeGesture === 'THUMBS_UP' ||
            activeGesture === 'THUMBS_DOWN' ||
            activeGesture === 'VICTORY' ||
            activeGesture === 'SPIDERMAN'
          ) {
            // keep detected gestures
          } else if (fingerCount === 1) {
            activeGesture = 'ONE'
          } else if (fingerCount === 2) {
            activeGesture = 'TWO'
          } else if (fingerCount === 3) {
            activeGesture = 'THREE'
          } else if (fingerCount >= 4) {
            activeGesture = 'OPEN_PALM'
          }
        }
      } else if (!isCameraActive) {
        // Fallback to mouse interaction ONLY if camera is completely off/disabled
        lastWristPos = null
        isHandPresent = true
        pointerTip = mousePos
        handCenter = mousePos
        setHandCursor(mousePos.x, mousePos.y)

        if (currentKeyGesture) {
          activeGesture = currentKeyGesture
        } else if (isMouseDown) {
          activeGesture = 'FIST'
        } else {
          activeGesture = 'PINCH'
        }
      } else {
        // Camera is active but no hand is detected
        isHandPresent = false
        activeGesture = 'IDLE'
      }

      // Responsive 2-second lock delay for shape transitions
      const now = performance.now()
      if (!isHandPresent) {
        currentGesture = 'IDLE'
      } else {
        // Allow instant transition if coming from IDLE or going to IDLE, otherwise lock transitions between active states
        if (now - lastGestureTime > 2000 || currentGesture === 'IDLE' || activeGesture === 'IDLE') {
          if (activeGesture !== currentGesture) {
            currentGesture = activeGesture
            lastGestureTime = now
          }
        }
      }
      
      setGestureState(currentGesture)

      // 3. Physics Update & Draw main Jewels
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Gesture Forces
        if (isHandPresent && currentGesture === 'FIST' && handCenter) {
          // Circular ring around fist so they remain segregated
          const angle = (i * Math.PI * 2) / NUM_JEWELS
          const targetX = handCenter.x + Math.cos(angle) * 55
          const targetY = handCenter.y + Math.sin(angle) * 55
          const dx = targetX - p.x
          const dy = targetY - p.y
          
          p.vx += dx * 0.04
          p.vy += dy * 0.04
          p.vx *= 0.82
          p.vy *= 0.82
        } else if (isHandPresent && currentGesture === 'PINCH' && pointerTip) {
          // Tilted elliptical orbit around the pointer tip
          p.orbitOffset += 0.025 + (i % 4) * 0.005
          const a = 180 // semi-major axis
          const b = 50  // semi-minor axis (for 3D depth perspective)
          const tiltAngle = -0.4 // Tilted angle in radians (~23 degrees)
          
          const cosT = Math.cos(p.orbitOffset)
          const sinT = Math.sin(p.orbitOffset)
          
          // Position relative to center
          const rx = a * cosT
          const ry = b * sinT
          
          // Rotate by tiltAngle
          const targetX = pointerTip.x + rx * Math.cos(tiltAngle) - ry * Math.sin(tiltAngle)
          const targetY = pointerTip.y + rx * Math.sin(tiltAngle) + ry * Math.cos(tiltAngle)
          
          // Spring force to attract particle to targetX, targetY
          const dx = targetX - p.x
          const dy = targetY - p.y
          
          p.vx += dx * 0.04
          p.vy += dy * 0.04
          p.vx *= 0.85
          p.vy *= 0.85
          
        } else if (isHandPresent && currentGesture === 'OPEN_PALM') {
          // Spherical orbital projection around center
          const center = handCenter || { x: canvas.width / 2, y: canvas.height / 2 }
          const phi = Math.acos(-1 + (2 * i) / NUM_JEWELS)
          const theta = Math.sqrt(NUM_JEWELS * Math.PI) * phi + (performance.now() * 0.0015)
          const sx = Math.sin(phi) * Math.cos(theta)
          const sy = Math.sin(phi) * Math.sin(theta)
          const sz = Math.cos(phi)
          const angleX = 0.5
          const rotY = sy * Math.cos(angleX) - sz * Math.sin(angleX)
          const sphereRadius = 140
          const targetX = center.x + sx * sphereRadius
          const targetY = center.y + rotY * sphereRadius
          const dx = targetX - p.x
          const dy = targetY - p.y
          p.vx += dx * 0.045
          p.vy += dy * 0.045
        } else if (currentGesture === 'THUMBS_UP') {
          // Grid alignment over the whole screen
          const cols = 5
          const rows = 4
          const col = i % cols
          const row = Math.floor(i / cols)
          const targetX = (col + 0.5) * (canvas.width / cols)
          const targetY = (row + 0.5) * (canvas.height / rows)
          const dx = targetX - p.x
          const dy = targetY - p.y
          p.vx += dx * 0.04
          p.vy += dy * 0.04
        } else if (currentGesture === 'THUMBS_DOWN') {
          // Levitating behavior: reverse gravity to float upward gently
          p.vy -= 0.22
          p.vx += (Math.random() - 0.5) * 0.4
        } else if (currentGesture === 'VICTORY' || currentGesture === 'SPIDERMAN') {
          // Different cool shape: Heart formation
          const center = handCenter || { x: canvas.width / 2, y: canvas.height / 2 }
          const pt = heartPoints[i]
          const targetX = center.x + pt.x
          const targetY = center.y + pt.y
          const dx = targetX - p.x
          const dy = targetY - p.y
          p.vx += dx * 0.045
          p.vy += dy * 0.045
        } else if (currentGesture === 'ONE') {
          const pt = digit1Points[i]
          const targetX = canvas.width / 2 + pt.x
          const targetY = canvas.height / 2 + pt.y
          const dx = targetX - p.x
          const dy = targetY - p.y
          p.vx += dx * 0.035
          p.vy += dy * 0.035
          p.vx *= 0.82
          p.vy *= 0.82
        } else if (currentGesture === 'TWO') {
          const pt = digit2Points[i]
          const targetX = canvas.width / 2 + pt.x
          const targetY = canvas.height / 2 + pt.y
          const dx = targetX - p.x
          const dy = targetY - p.y
          p.vx += dx * 0.035
          p.vy += dy * 0.035
          p.vx *= 0.82
          p.vy *= 0.82
        } else if (currentGesture === 'THREE') {
          const pt = digit3Points[i]
          const targetX = canvas.width / 2 + pt.x
          const targetY = canvas.height / 2 + pt.y
          const dx = targetX - p.x
          const dy = targetY - p.y
          p.vx += dx * 0.035
          p.vy += dy * 0.035
          p.vx *= 0.82
          p.vy *= 0.82
        } else if (currentGesture === 'SWIPE_RIGHT') {
          p.vx += 10 // Throw right
        } else if (currentGesture === 'SWIPE_LEFT') {
          p.vx -= 10 // Throw left
        } else {
          // Idle / Release: Gravity takes over (lower gravity)
          p.vy += 0.15
        }

        // Apply velocities
        p.x += p.vx
        p.y += p.vy

        // Damping (air resistance / stability in shape formations)
        const isShapeGesture = [
          'FIST',
          'ONE',
          'TWO',
          'THREE',
          'THUMBS_UP',
          'THUMBS_DOWN',
          'VICTORY',
          'SPIDERMAN',
        ].includes(currentGesture)
        if (!isShapeGesture) {
          p.vx *= 0.985
          p.vy *= 0.985
        } else {
          p.vx *= 0.82
          p.vy *= 0.82
        }

        // Continuous Rotation
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        p.angle += p.rotationSpeed + (speed * 0.01)

        // Boundary collisions (Bouncing off walls with boundary width offset)
        const bounceDamping = 0.85
        if (p.x - p.size < 0) {
          p.x = p.size
          p.vx *= -bounceDamping
        } else if (p.x + p.size > canvas.width) {
          p.x = canvas.width - p.size
          p.vx *= -bounceDamping
        }

        if (p.y - p.size < 0) {
          p.y = p.size
          p.vy *= -bounceDamping
        } else if (p.y + p.size > canvas.height) {
          p.y = canvas.height - p.size
          p.vy *= -bounceDamping
        }

        // Draw Jewel Shape
        ctx.fillStyle = p.color
        
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)

        if (p.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, p.size, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.shape === 'diamond') {
          ctx.beginPath()
          ctx.moveTo(0, -p.size * 1.5)
          ctx.lineTo(p.size, 0)
          ctx.lineTo(0, p.size * 1.5)
          ctx.lineTo(-p.size, 0)
          ctx.closePath()
          ctx.fill()
        } else if (p.shape === 'square') {
          ctx.fillRect(-p.size, -p.size, p.size * 2, p.size * 2)
        } else if (p.shape === 'star') {
          drawStar(ctx, 0, 0, 4, p.size * 1.5, p.size * 0.5)
          ctx.fill()
        }

        ctx.rotate(-p.angle)
        ctx.translate(-p.x, -p.y)
      }

      animationId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('keydown', handleKeyDown)
      cancelAnimationFrame(animationId)
    }
  }, [isReady, theme, setGestureState, setHandCursor, isCameraActive])

  const handleRestore = () => {
    setMode('INACTIVE')
    onClose()
  }

  const gestureLabel =
    gestureState === 'IDLE'
      ? 'No gesture detected — Falling'
      : gestureState === 'FIST'
      ? '✊ Fist — Clustering'
      : gestureState === 'OPEN_PALM'
      ? '🖐 Open Palm — Spherical Swarm'
      : gestureState === 'SWIPE_RIGHT'
      ? '👉 Swipe Right — Throw'
      : gestureState === 'SWIPE_LEFT'
      ? '👈 Swipe Left — Throw'
      : gestureState === 'PINCH'
      ? '☝ Pointing — Orbiting'
      : gestureState === 'ONE'
      ? '1️⃣ One — Shape Formation'
      : gestureState === 'TWO'
      ? '2️⃣ Two — Shape Formation'
      : gestureState === 'THREE'
      ? '3️⃣ Three — Shape Formation'
      : gestureState === 'THUMBS_UP'
      ? '👍 Thumbs Up — Grid Dispersion'
      : gestureState === 'THUMBS_DOWN'
      ? '👎 Thumbs Down — Levitating'
      : gestureState === 'VICTORY'
      ? '✌ Victory — Heart Formation'
      : gestureState === 'SPIDERMAN'
      ? '🤟 Spider-Man — Heart Formation'
      : gestureState

  const textColor = theme === 'light' ? 'var(--text)' : 'var(--cream)'
  const bgStyle = {
    background: theme === 'light' ? 'rgba(253, 252, 247, 0.2)' : 'rgba(12, 8, 6, 0.4)',
    backdropFilter: 'blur(6px)',
  }

  if (!isReady) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'var(--bg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'EB Garamond', Georgia, serif",
          color: 'var(--text)',
          gap: '1rem',
        }}
      >
        <span
          style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
            color: textColor,
          }}
        >
          Initializing Camera & AI…
        </span>
        <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
          Please allow camera access when prompted
        </span>
      </div>
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, ...bgStyle }}>
      
      <canvas 
        ref={canvasRef} 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          width: '100%', 
          height: '100%',
          pointerEvents: 'none',
        }} 
      />

      {/* UI Overlay — Top */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          left: 28,
          zIndex: 10,
          fontFamily: "'EB Garamond', Georgia, serif",
          color: 'var(--text)',
        }}
      >
        <span
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.6rem',
            letterSpacing: '0.25em',
            color: 'var(--gold-dim)',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '0.4rem',
          }}
        >
          ✦ Gesture Reality
        </span>
        <h2
          style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: '1.4rem',
            fontWeight: 400,
            color: textColor,
            letterSpacing: '0.03em',
            margin: 0,
          }}
        >
          Jewel Physics Active
        </h2>
        <p
          style={{
            color: 'var(--muted)',
            fontSize: '0.85rem',
            marginTop: '0.3rem',
            maxWidth: 300,
          }}
        >
          {isCameraActive 
            ? 'Point to Orbit. Fist to Grab. Palm to Sphere. Thumbs Up to Grid. Thumbs Down to Levit. Victory to Heart.' 
            : 'Mouse to Orbit. Left-Click to Grab. Press 1, 2, 3 to Form Numbers.'}
        </p>
        {!isCameraActive && (
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.55rem',
              letterSpacing: '0.15em',
              color: 'var(--gold)',
              background: 'rgba(192, 133, 14, 0.15)',
              border: '1px solid rgba(192, 133, 14, 0.3)',
              padding: '2px 8px',
              borderRadius: '2px',
              display: 'inline-block',
              marginTop: '0.5rem',
              textTransform: 'uppercase'
            }}
          >
            ✦ Mouse Control Fallback
          </span>
        )}
      </div>

      {/* Gesture indicator — Bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          fontFamily: "'Cinzel', serif",
          fontSize: '0.75rem',
          letterSpacing: '0.15em',
          color: 'var(--gold)',
          textTransform: 'uppercase',
          background: theme === 'light' ? 'rgba(253, 252, 247, 0.7)' : 'rgba(12, 8, 6, 0.7)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border)',
          padding: '8px 24px',
          borderRadius: '2px',
        }}
      >
        {gestureLabel}
      </div>

      {/* Restore button */}
      <button
        onClick={handleRestore}
        style={{
          position: 'absolute',
          top: 28,
          right: 28,
          zIndex: 10,
          background: theme === 'light' ? 'rgba(253, 252, 247, 0.6)' : 'rgba(12, 8, 6, 0.6)',
          border: '1px solid var(--border2)',
          color: 'var(--muted)',
          padding: '10px 24px',
          borderRadius: '2px',
          fontFamily: "'Cinzel', serif",
          fontSize: '0.75rem',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          cursor: 'pointer',
          backdropFilter: 'blur(4px)',
          transition: 'all 0.3s',
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = 'var(--gold-dim)'
          e.target.style.color = textColor
          e.target.style.boxShadow = '0 0 15px rgba(192, 133, 14, 0.3)'
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = 'var(--border2)'
          e.target.style.color = 'var(--muted)'
          e.target.style.boxShadow = 'none'
        }}
      >
        ✦ Restore Reality
      </button>
    </div>
  )
}
