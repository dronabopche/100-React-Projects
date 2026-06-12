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

const NUM_JEWELS = 40
const TRAIL_LENGTH = 15

export default function GestureCanvas({ theme, onClose }) {
  const [isReady, setIsReady] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(true)

  const setMode = useGestureStore((s) => s.setMode)
  const gestureState = useGestureStore((s) => s.gestureState)
  const setGestureState = useGestureStore((s) => s.setGestureState)
  const setHandCursor = useGestureStore((s) => s.setHandCursor)

  const canvasRef = useRef(null)
  const lastGestureStateRef = useRef('IDLE')

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
    let lastWristPosArray = [null, null]
    let currentGestureArray = ['IDLE', 'IDLE']
    let lastGestureTimeArray = [0, 0]

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

    // Initialize 40 fixed jewels with pre-rendered offscreen canvases for performance
    for (let i = 0; i < NUM_JEWELS; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)]
      const shape = shapes[Math.floor(Math.random() * shapes.length)]
      const size = 5 + Math.random() * 4
      
      // Pre-render shape to offscreen canvas to prevent lag
      const offCanvas = document.createElement('canvas')
      const offCtx = offCanvas.getContext('2d')
      const padding = size * 3 + 15 // space for shadows and rotations
      offCanvas.width = padding * 2
      offCanvas.height = padding * 2
      const cx = padding
      const cy = padding

      offCtx.save()
      offCtx.translate(cx, cy)
      
      // Drop shadow for 3D float effect (light shadow in light mode, dark in dark mode)
      offCtx.shadowColor = theme === 'light' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0.5)'
      offCtx.shadowBlur = 12
      offCtx.shadowOffsetX = 4
      offCtx.shadowOffsetY = 6

      // Glassy / clear gem effect
      offCtx.globalAlpha = 0.85

      if (shape === 'circle') {
        const grad = offCtx.createRadialGradient(-size * 0.3, -size * 0.3, size * 0.1, 0, 0, size)
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
        grad.addColorStop(0.4, color)
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.3)') // Softer edge for clear look
        offCtx.fillStyle = grad
        offCtx.beginPath()
        offCtx.arc(0, 0, size, 0, Math.PI * 2)
        offCtx.fill()
      } else if (shape === 'diamond') {
        offCtx.fillStyle = color
        offCtx.beginPath()
        offCtx.moveTo(0, -size * 1.5)
        offCtx.lineTo(0, size * 1.5)
        offCtx.lineTo(-size, 0)
        offCtx.closePath()
        offCtx.fill()
        offCtx.fillStyle = 'rgba(255, 255, 255, 0.6)' // Stronger highlight
        offCtx.fill()
        
        offCtx.fillStyle = color
        offCtx.beginPath()
        offCtx.moveTo(0, -size * 1.5)
        offCtx.lineTo(size, 0)
        offCtx.lineTo(0, size * 1.5)
        offCtx.closePath()
        offCtx.fill()
        offCtx.fillStyle = 'rgba(0, 0, 0, 0.2)' // Softer shade
        offCtx.fill()
        
        offCtx.beginPath()
        offCtx.moveTo(0, -size * 1.5)
        offCtx.lineTo(-size * 0.4, -size * 0.6)
        offCtx.lineTo(size * 0.4, -size * 0.6)
        offCtx.closePath()
        offCtx.fillStyle = 'rgba(255, 255, 255, 0.8)' // Specular highlight
        offCtx.fill()
      } else if (shape === 'square') {
        offCtx.fillStyle = color
        offCtx.fillRect(-size, -size, size * 2, size * 2)
        
        offCtx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        offCtx.beginPath()
        offCtx.moveTo(-size, -size)
        offCtx.lineTo(size, -size)
        offCtx.lineTo(size * 0.6, -size * 0.6)
        offCtx.lineTo(-size * 0.6, -size * 0.6)
        offCtx.closePath()
        offCtx.fill()
        
        offCtx.fillStyle = 'rgba(255, 255, 255, 0.4)'
        offCtx.beginPath()
        offCtx.moveTo(-size, -size)
        offCtx.lineTo(-size * 0.6, -size * 0.6)
        offCtx.lineTo(-size * 0.6, size * 0.6)
        offCtx.lineTo(-size, size)
        offCtx.closePath()
        offCtx.fill()
        
        offCtx.fillStyle = 'rgba(0, 0, 0, 0.2)'
        offCtx.beginPath()
        offCtx.moveTo(-size, size)
        offCtx.lineTo(-size * 0.6, size * 0.6)
        offCtx.lineTo(size * 0.6, size * 0.6)
        offCtx.lineTo(size, size)
        offCtx.closePath()
        offCtx.fill()

        offCtx.fillStyle = 'rgba(0, 0, 0, 0.4)'
        offCtx.beginPath()
        offCtx.moveTo(size, -size)
        offCtx.lineTo(size, size)
        offCtx.lineTo(size * 0.6, size * 0.6)
        offCtx.lineTo(size * 0.6, -size * 0.6)
        offCtx.closePath()
        offCtx.fill()
      } else if (shape === 'star') {
        const grad = offCtx.createRadialGradient(0, 0, size * 0.1, 0, 0, size * 1.5)
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
        grad.addColorStop(0.4, color)
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.3)')
        offCtx.fillStyle = grad
        let rot = (Math.PI / 2) * 3
        let x = 0, y = 0
        let step = Math.PI / 4
        offCtx.beginPath()
        offCtx.moveTo(0, -size * 1.5)
        for (let j = 0; j < 4; j++) {
          x = Math.cos(rot) * size * 1.5
          y = Math.sin(rot) * size * 1.5
          offCtx.lineTo(x, y)
          rot += step
          x = Math.cos(rot) * size * 0.5
          y = Math.sin(rot) * size * 0.5
          offCtx.lineTo(x, y)
          rot += step
        }
        offCtx.lineTo(0, -size * 1.5)
        offCtx.closePath()
        offCtx.fill()
      }
      offCtx.restore()

      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        color,
        shape,
        size,
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        orbitOffset: Math.random() * Math.PI * 2,
        history: [],
        offCanvas,
        padding
      })
    }

    const getDigit2Points = (count) => {
      const pts = []
      const part1 = Math.round(count * 8 / 20)
      const part2 = Math.round(count * 6 / 20)
      const part3 = count - part1 - part2
      for (let i = 0; i < part1; i++) {
        const t = Math.PI - (Math.PI * i / (part1 - 1))
        pts.push({
          x: Math.cos(t) * 90,
          y: -120 + Math.sin(t) * 70
        })
      }
      for (let i = 1; i <= part2; i++) {
        const ratio = i / (part2 + 1)
        pts.push({
          x: 90 - 180 * ratio,
          y: -120 + 240 * ratio
        })
      }
      for (let i = 1; i <= part3; i++) {
        const ratio = i / part3
        pts.push({
          x: -90 + 180 * ratio,
          y: 120
        })
      }
      return pts
    }

    const getDigit3Points = (count) => {
      const pts = []
      const part1 = Math.floor(count / 2)
      const part2 = count - part1
      for (let i = 0; i < part1; i++) {
        const t = Math.PI * 1.25 - (Math.PI * 1.5 * i / (part1 - 1))
        pts.push({
          x: Math.cos(t) * 85,
          y: -80 + Math.sin(t) * 80
        })
      }
      for (let i = 0; i < part2; i++) {
        const t = Math.PI * 0.25 - (Math.PI * 1.5 * i / (part2 - 1))
        pts.push({
          x: Math.cos(t) * 85,
          y: 80 + Math.sin(t) * 80
        })
      }
      return pts
    }

    const getHeartPoints = (count) => {
      const pts = []
      for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2
        const x = 16 * Math.pow(Math.sin(t), 3)
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
        pts.push({
          x: x * 10,
          y: -y * 10
        })
      }
      return pts
    }

    const digit1Points20 = Array.from({ length: 20 }, (_, i) => ({
      x: 0,
      y: -180 + 360 * (i / 19)
    }))
    const digit1Points40 = Array.from({ length: 40 }, (_, i) => ({
      x: 0,
      y: -180 + 360 * (i / 39)
    }))

    const digit2Points20 = getDigit2Points(20)
    const digit2Points40 = getDigit2Points(40)
    const digit3Points20 = getDigit3Points(20)
    const digit3Points40 = getDigit3Points(40)
    const heartPoints20 = getHeartPoints(20)
    const heartPoints40 = getHeartPoints(40)

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
      const detectedHands = []

      if (isCameraActive && results && results.landmarks && results.landmarks.length > 0) {
        for (let h = 0; h < results.landmarks.length; h++) {
          const landmarks = results.landmarks[h]

          const toScreenX = (x) => (1 - x) * canvas.width
          const toScreenY = (y) => y * canvas.height

          const indexTip = landmarks[8]
          const wrist = landmarks[0]
          const middleBase = landmarks[9]

          let pointerTip = null
          let handCenter = null

          if (indexTip) {
            pointerTip = { x: toScreenX(indexTip.x), y: toScreenY(indexTip.y) }
          }

          if (wrist && middleBase) {
            handCenter = {
              x: toScreenX((wrist.x + middleBase.x) / 2),
              y: toScreenY((wrist.y + middleBase.y) / 2)
            }
          }

          // Swipe Detection
          let currentSwipe = null
          if (wrist) {
            const screenWristX = toScreenX(wrist.x)
            if (lastWristPosArray[h]) {
              const dx = screenWristX - lastWristPosArray[h].x
              if (dx > 50) currentSwipe = 'SWIPE_RIGHT'
              if (dx < -50) currentSwipe = 'SWIPE_LEFT'
            }
            lastWristPosArray[h] = { x: screenWristX, y: toScreenY(wrist.y) }
          }

          // Determine Gesture
          let activeGesture = 'IDLE'
          if (currentSwipe) {
            activeGesture = currentSwipe
          } else if (results.gestures && results.gestures[h] && results.gestures[h].length > 0) {
            const top = results.gestures[h][0]
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
              activeGesture = 'PINCH'
            } else if (fingerCount === 2) {
              activeGesture = 'TWO'
            } else if (fingerCount === 3) {
              activeGesture = 'THREE'
            } else if (fingerCount >= 4) {
              activeGesture = 'OPEN_PALM'
            }
          }

          detectedHands.push({
            pointerTip,
            handCenter,
            activeGesture,
          })
        }

        // Clear wrist tracking for hands that are no longer present
        for (let h = results.landmarks.length; h < 2; h++) {
          lastWristPosArray[h] = null
        }
      } else if (!isCameraActive) {
        // Fallback to mouse interaction ONLY if camera is completely off/disabled
        lastWristPosArray[0] = null
        lastWristPosArray[1] = null

        let activeGesture = 'PINCH'
        if (currentKeyGesture) {
          activeGesture = currentKeyGesture
        } else if (isMouseDown) {
          activeGesture = 'FIST'
        }

        detectedHands.push({
          pointerTip: mousePos,
          handCenter: mousePos,
          activeGesture,
        })
      } else {
        // Camera is active but no hand is detected
        lastWristPosArray[0] = null
        lastWristPosArray[1] = null
      }

      // Resolve hand gestures and lock transitions
      const resolvedHands = []
      const now = performance.now()

      for (let h = 0; h < 2; h++) {
        const detHand = detectedHands[h]
        if (!detHand) {
          currentGestureArray[h] = 'IDLE'
          resolvedHands.push({
            pointerTip: null,
            handCenter: null,
            gesture: 'IDLE'
          })
        } else {
          const activeGesture = detHand.activeGesture
          let currentGesture = currentGestureArray[h]
          let lastGestureTime = lastGestureTimeArray[h]

          if (now - lastGestureTime > 2000 || currentGesture === 'IDLE' || activeGesture === 'IDLE') {
            if (activeGesture !== currentGesture) {
              currentGesture = activeGesture
              currentGestureArray[h] = activeGesture
              lastGestureTimeArray[h] = now
            }
          }

          resolvedHands.push({
            pointerTip: detHand.pointerTip,
            handCenter: detHand.handCenter,
            gesture: currentGesture
          })
        }
      }


      // Update Zustand store cursor position (using primary/first hand if available)
      if (resolvedHands[0] && resolvedHands[0].pointerTip) {
        setHandCursor(resolvedHands[0].pointerTip.x, resolvedHands[0].pointerTip.y)
      }

      // Update Zustand store gestureState (only if it changed)
      let combinedState = 'IDLE'
      if (detectedHands.length === 1) {
        combinedState = resolvedHands[0].gesture
      } else if (detectedHands.length === 2) {
        combinedState = `${resolvedHands[0].gesture} & ${resolvedHands[1].gesture}`
      }

      if (lastGestureStateRef.current !== combinedState) {
        lastGestureStateRef.current = combinedState
        setGestureState(combinedState)
      }

      // 3. Physics Update & Draw main Jewels
      const numActiveHands = detectedHands.length

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        let hand = null
        let subIdx = i
        let isSingle = true

        if (numActiveHands === 1) {
          hand = resolvedHands[0]
          subIdx = i
          isSingle = true
        } else if (numActiveHands === 2) {
          if (i < 20) {
            hand = resolvedHands[0]
            subIdx = i
            isSingle = false
          } else {
            hand = resolvedHands[1]
            subIdx = i - 20
            isSingle = false
          }
        }

        const isHandPresent = hand !== null && hand.gesture !== 'IDLE'
        const currentGesture = isHandPresent ? hand.gesture : 'IDLE'
        const handCenter = isHandPresent ? hand.handCenter : null
        const pointerTip = isHandPresent ? hand.pointerTip : null

        const shapeLen = isSingle ? 40 : 20
        const d1Points = isSingle ? digit1Points40 : digit1Points20
        const d2Points = isSingle ? digit2Points40 : digit2Points20
        const d3Points = isSingle ? digit3Points40 : digit3Points20
        const hPoints = isSingle ? heartPoints40 : heartPoints20

        // Gesture Forces
        if (isHandPresent && currentGesture === 'FIST' && handCenter) {
          // Spherical orbital projection around center
          const center = handCenter || { x: canvas.width / 2, y: canvas.height / 2 }
          const phi = Math.acos(-1 + (2 * subIdx) / shapeLen)
          const theta = Math.sqrt(shapeLen * Math.PI) * phi + (performance.now() * 0.0015)
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
        } else if (isHandPresent && currentGesture === 'PINCH' && pointerTip) {
          // Snake follow chain: each particle follows the preceding particle (creating a sequential delayed trail)
          let targetX = pointerTip.x
          let targetY = pointerTip.y

          if (subIdx > 0) {
            const prevP = particles[i - 1]
            if (prevP) {
              targetX = prevP.x
              targetY = prevP.y
            }
          }

          const dx = targetX - p.x
          const dy = targetY - p.y

          p.vx += dx * 0.15
          p.vy += dy * 0.15
          p.vx *= 0.62
          p.vy *= 0.62

        } else if (isHandPresent && currentGesture === 'OPEN_PALM') {
          // Levitating behavior: reverse gravity to float upward gently
          p.vy -= 0.22
          p.vx += (Math.random() - 0.5) * 0.4
        } else if (isHandPresent && currentGesture === 'THUMBS_UP') {
          // Grid alignment over the whole screen
          const cols = shapeLen === 40 ? 8 : 5
          const rows = shapeLen === 40 ? 5 : 4
          const col = subIdx % cols
          const row = Math.floor(subIdx / cols)
          const targetX = (col + 0.5) * (canvas.width / cols)
          const targetY = (row + 0.5) * (canvas.height / rows)
          const dx = targetX - p.x
          const dy = targetY - p.y
          p.vx += dx * 0.04
          p.vy += dy * 0.04
        } else if (isHandPresent && (currentGesture === 'VICTORY' || currentGesture === 'SPIDERMAN')) {
          // Different cool shape: Heart formation
          const center = handCenter || { x: canvas.width / 2, y: canvas.height / 2 }
          const pt = hPoints[subIdx]
          const targetX = center.x + pt.x
          const targetY = center.y + pt.y
          const dx = targetX - p.x
          const dy = targetY - p.y
          p.vx += dx * 0.045
          p.vy += dy * 0.045
        } else if (isHandPresent && currentGesture === 'ONE') {
          const center = handCenter || { x: canvas.width / 2, y: canvas.height / 2 }
          const pt = d1Points[subIdx]
          const targetX = center.x + pt.x
          const targetY = center.y + pt.y
          const dx = targetX - p.x
          const dy = targetY - p.y
          p.vx += dx * 0.035
          p.vy += dy * 0.035
          p.vx *= 0.82
          p.vy *= 0.82
        } else if (isHandPresent && currentGesture === 'TWO') {
          const center = handCenter || { x: canvas.width / 2, y: canvas.height / 2 }
          const pt = d2Points[subIdx]
          const targetX = center.x + pt.x
          const targetY = center.y + pt.y
          const dx = targetX - p.x
          const dy = targetY - p.y
          p.vx += dx * 0.035
          p.vy += dy * 0.035
          p.vx *= 0.82
          p.vy *= 0.82
        } else if (isHandPresent && currentGesture === 'THREE') {
          const center = handCenter || { x: canvas.width / 2, y: canvas.height / 2 }
          const pt = d3Points[subIdx]
          const targetX = center.x + pt.x
          const targetY = center.y + pt.y
          const dx = targetX - p.x
          const dy = targetY - p.y
          p.vx += dx * 0.035
          p.vy += dy * 0.035
          p.vx *= 0.82
          p.vy *= 0.82
        } else if (isHandPresent && currentGesture === 'SWIPE_RIGHT') {
          p.vx += 10 // Throw right
        } else if (isHandPresent && currentGesture === 'SWIPE_LEFT') {
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

        // Draw Jewel Shape from pre-rendered offscreen canvas for extreme performance
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)

        ctx.drawImage(p.offCanvas, -p.padding, -p.padding)

        ctx.restore()
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

  const getGestureText = (state) => {
    switch (state) {
      case 'IDLE': return 'Idle'
      case 'FIST': return '✊ Fist'
      case 'OPEN_PALM': return '🖐 Open Palm'
      case 'SWIPE_RIGHT': return '👉 Swipe Right'
      case 'SWIPE_LEFT': return '👈 Swipe Left'
      case 'PINCH': return '☝ Pointing'
      case 'ONE': return '1️⃣ One'
      case 'TWO': return '2️⃣ Two'
      case 'THREE': return '3️⃣ Three'
      case 'THUMBS_UP': return '👍 Thumbs Up'
      case 'THUMBS_DOWN': return '👎 Thumbs Down'
      case 'VICTORY': return '✌ Victory'
      case 'SPIDERMAN': return '🤟 Spider-Man'
      default: return state
    }
  }

  const formatGestureLabel = (state) => {
    if (!state) return 'No gesture detected — Falling'
    if (state.includes('&')) {
      const parts = state.split('&').map(s => s.trim())
      return `Hand 1: ${getGestureText(parts[0])}  |  Hand 2: ${getGestureText(parts[1])}`
    }

    switch (state) {
      case 'IDLE': return 'No gesture detected — Falling'
      case 'FIST': return '✊ Fist — Clustering'
      case 'OPEN_PALM': return '🖐 Open Palm — Spherical Swarm'
      case 'SWIPE_RIGHT': return '👉 Swipe Right — Throw'
      case 'SWIPE_LEFT': return '👈 Swipe Left — Throw'
      case 'PINCH': return '☝ Pointing — Orbiting'
      case 'ONE': return '1️⃣ One — Shape Formation'
      case 'TWO': return '2️⃣ Two — Shape Formation'
      case 'THREE': return '3️⃣ Three — Shape Formation'
      case 'THUMBS_UP': return '👍 Thumbs Up — Grid Dispersion'
      case 'THUMBS_DOWN': return '👎 Thumbs Down — Levitating'
      case 'VICTORY': return '✌ Victory — Heart Formation'
      case 'SPIDERMAN': return '🤟 Spider-Man — Heart Formation'
      default: return state
    }
  }

  const gestureLabel = formatGestureLabel(gestureState)

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
