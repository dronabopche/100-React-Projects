import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './FourierVisualizerPlayground.module.css'

// 10 PRESETS with functions that return an array of {x, y} coordinates
const PRESETS = [
  {
    name: 'Heart',
    generate: (n = 120) => {
      const pts = []
      for (let i = 0; i < n; i++) {
        const t = (i / n) * Math.PI * 2
        // Parametric heart formula
        const x = 16 * Math.pow(Math.sin(t), 3)
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t))
        pts.push({ x: x * 10, y: y * 10 })
      }
      return pts
    }
  },
  {
    name: 'Circle',
    generate: (n = 100) => {
      const pts = []
      for (let i = 0; i < n; i++) {
        const t = (i / n) * Math.PI * 2
        pts.push({ x: Math.cos(t) * 150, y: Math.sin(t) * 150 })
      }
      return pts
    }
  },
  {
    name: 'Infinity',
    generate: (n = 120) => {
      const pts = []
      for (let i = 0; i < n; i++) {
        const t = (i / n) * Math.PI * 2 - Math.PI
        // Lemniscate of Bernoulli
        const scale = 220 / (Math.pow(Math.sin(t), 2) + 1)
        const x = scale * Math.cos(t)
        const y = scale * Math.sin(t) * Math.cos(t)
        pts.push({ x, y })
      }
      return pts
    }
  },
  {
    name: 'Five-Point Star',
    generate: (n = 120) => {
      const pts = []
      for (let i = 0; i < n; i++) {
        const t = (i / n) * Math.PI * 2
        // Parametric star approximation
        const r = 130 + 50 * Math.sin(5 * t - Math.PI / 2)
        const x = r * Math.cos(t)
        const y = r * Math.sin(t)
        pts.push({ x, y })
      }
      return pts
    }
  },
  {
    name: 'Butterfly',
    generate: (n = 150) => {
      const pts = []
      for (let i = 0; i < n; i++) {
        const t = (i / n) * Math.PI * 2
        // Butterfly curve (Temple H. Fay)
        const r = Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) + Math.pow(Math.sin(t / 12), 5)
        const x = r * Math.sin(t) * 45
        const y = -r * Math.cos(t) * 45
        pts.push({ x, y })
      }
      return pts
    }
  },
  {
    name: 'Square Outline',
    generate: (n = 120) => {
      const pts = []
      const side = 240
      const stepsPerSide = Math.floor(n / 4)
      // Top
      for (let i = 0; i < stepsPerSide; i++) {
        pts.push({ x: -side / 2 + (side * i) / stepsPerSide, y: -side / 2 })
      }
      // Right
      for (let i = 0; i < stepsPerSide; i++) {
        pts.push({ x: side / 2, y: -side / 2 + (side * i) / stepsPerSide })
      }
      // Bottom
      for (let i = 0; i < stepsPerSide; i++) {
        pts.push({ x: side / 2 - (side * i) / stepsPerSide, y: side / 2 })
      }
      // Left
      for (let i = 0; i < stepsPerSide; i++) {
        pts.push({ x: -side / 2, y: side / 2 - (side * i) / stepsPerSide })
      }
      return pts
    }
  },
  {
    name: 'Triangle Outline',
    generate: (n = 120) => {
      const pts = []
      const steps = Math.floor(n / 3)
      // Vertices: top (0, -130), bottom-right (120, 100), bottom-left (-120, 100)
      const v = [{ x: 0, y: -130 }, { x: 120, y: 100 }, { x: -120, y: 100 }]
      for (let s = 0; s < 3; s++) {
        const start = v[s]
        const end = v[(s + 1) % 3]
        for (let i = 0; i < steps; i++) {
          const ratio = i / steps
          pts.push({
            x: start.x + (end.x - start.x) * ratio,
            y: start.y + (end.y - start.y) * ratio
          })
        }
      }
      return pts
    }
  },
  {
    name: 'Four-Leaf Clover',
    generate: (n = 120) => {
      const pts = []
      for (let i = 0; i < n; i++) {
        const t = (i / n) * Math.PI * 2
        const r = 150 * Math.sin(2 * t)
        const x = r * Math.cos(t)
        const y = r * Math.sin(t)
        pts.push({ x, y })
      }
      return pts
    }
  },
  {
    name: 'Flower',
    generate: (n = 120) => {
      const pts = []
      for (let i = 0; i < n; i++) {
        const t = (i / n) * Math.PI * 2
        const r = 110 + 45 * Math.sin(5 * t)
        const x = r * Math.cos(t)
        const y = r * Math.sin(t)
        pts.push({ x, y })
      }
      return pts
    }
  },
  {
    name: 'Spiral',
    generate: (n = 150) => {
      const pts = []
      // A closed spiral loop that winds in and then returns out to close nicely
      const half = Math.floor(n / 2)
      for (let i = 0; i < half; i++) {
        const theta = (i / half) * Math.PI * 5
        const r = (theta / (Math.PI * 5)) * 140 + 10
        pts.push({ x: r * Math.cos(theta), y: r * Math.sin(theta) })
      }
      // Return path
      for (let i = half; i < n; i++) {
        const theta = ((n - i) / half) * Math.PI * 5
        const r = (theta / (Math.PI * 5)) * 140 + 10
        // Shift a bit to avoid exact overlapping
        pts.push({ x: r * Math.cos(theta) + 2, y: r * Math.sin(theta) + 2 })
      }
      return pts
    }
  }
]

// Discrete Fourier Transform algorithm
function computeDFT(points) {
  const N = points.length
  const X = []

  for (let k = 0; k < N; k++) {
    let re = 0
    let im = 0

    for (let n = 0; n < N; n++) {
      const phi = (Math.PI * 2 * k * n) / N
      re += points[n].x * Math.cos(phi) + points[n].y * Math.sin(phi)
      im += -points[n].x * Math.sin(phi) + points[n].y * Math.cos(phi)
    }

    re = re / N
    im = im / N

    const freq = k
    const amp = Math.sqrt(re * re + im * im)
    const phase = Math.atan2(im, re)

    X.push({ freq, amp, phase, re, im })
  }

  // Sort by amplitude descending (so larger epicycles are drawn first)
  return X.sort((a, b) => b.amp - a.amp)
}

export default function FourierVisualizerPlayground({ theme, onClose, isStandalone = false }) {
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const drawCanvasRef = useRef(null)
  
  const [activeTab, setActiveTab] = useState('preset') // 'preset' | 'text' | 'draw'
  const [selectedPreset, setSelectedPreset] = useState(0)
  const [customText, setCustomText] = useState('Antigravity')
  
  const [harmonicsCount, setHarmonicsCount] = useState(60)
  const [speed, setSpeed] = useState(1) // multiplier
  const [showCircles, setShowCircles] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)

  const [points, setPoints] = useState([])
  const [fourierComponents, setFourierComponents] = useState([])
  
  // Tracing variables
  const [time, setTime] = useState(0)
  const [path, setPath] = useState([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawnPoints, setDrawnPoints] = useState([])

  // Setup initial preset points
  useEffect(() => {
    if (activeTab === 'preset') {
      const pts = PRESETS[selectedPreset].generate()
      setPoints(pts)
      setFourierComponents(computeDFT(pts))
      setPath([])
      setTime(0)
    }
  }, [activeTab, selectedPreset])

  // Handle custom text conversion to sorted points
  const handleGenerateText = () => {
    if (!customText.trim()) return
    
    // Create an offscreen canvas to render text and extract coordinates
    const textCanvas = document.createElement('canvas')
    textCanvas.width = 1000
    textCanvas.height = 400
    const ctx = textCanvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, 1000, 400)
    
    // Use clear white outline style for text to extract outline coords
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    
    // Proportional font sizing to keep outline clear
    const fontSize = Math.max(30, Math.min(100, 1000 / (customText.length * 0.75)))
    ctx.font = `italic bold ${fontSize}px Georgia, serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.strokeText(customText, 500, 200)

    const imgData = ctx.getImageData(0, 0, 1000, 400)
    const rawPoints = []
    
    // Sample only the stroke/edge pixels
    const samplingStep = 2
    for (let y = 0; y < 400; y += samplingStep) {
      for (let x = 0; x < 1000; x += samplingStep) {
        const index = (x + y * 1000) * 4
        // If pixel is white (part of the stroke outline)
        if (imgData.data[index] > 100) {
          rawPoints.push({ x: x - 500, y: y - 200 })
        }
      }
    }

    if (rawPoints.length === 0) return

    // Order coordinates using nearest neighbor (TSP) to trace single-stroke path
    const sorted = []
    let current = rawPoints.splice(0, 1)[0]
    sorted.push(current)

    while (rawPoints.length > 0) {
      let minDist = Infinity
      let minIdx = -1
      for (let i = 0; i < rawPoints.length; i++) {
        const dx = rawPoints[i].x - current.x
        const dy = rawPoints[i].y - current.y
        const dist = dx * dx + dy * dy
        if (dist < minDist) {
          minDist = dist
          minIdx = i
        }
      }
      current = rawPoints.splice(minIdx, 1)[0]
      sorted.push(current)
    }

    // Limit point count to ~140 for DFT stability
    const targetCount = 140
    const filterStep = Math.max(1, Math.floor(sorted.length / targetCount))
    let finalPoints = sorted.filter((_, idx) => idx % filterStep === 0)

    // Center coordinates to maintain drawing alignment
    if (finalPoints.length > 0) {
      const minX = Math.min(...finalPoints.map(p => p.x))
      const maxX = Math.max(...finalPoints.map(p => p.x))
      const minY = Math.min(...finalPoints.map(p => p.y))
      const maxY = Math.max(...finalPoints.map(p => p.y))
      
      const midX = (minX + maxX) / 2
      const midY = (minY + maxY) / 2
      
      finalPoints = finalPoints.map(p => ({
        x: p.x - midX,
        y: p.y - midY
      }))
    }

    setPoints(finalPoints)
    setFourierComponents(computeDFT(finalPoints))
    setPath([])
    setTime(0)
  }

  useEffect(() => {
    if (activeTab === 'text') {
      handleGenerateText()
    }
  }, [activeTab])

  // Draw user's path inside the small sidebar drawing box
  const redrawSmallCanvas = () => {
    const canvas = drawCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Background grid
    ctx.strokeStyle = theme === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.04)'
    ctx.lineWidth = 1
    ctx.beginPath()
    for (let x = 0; x < canvas.width; x += 15) {
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
    }
    for (let y = 0; y < canvas.height; y += 15) {
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
    }
    ctx.stroke()

    // Central crosshairs
    ctx.strokeStyle = theme === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)'
    ctx.beginPath()
    ctx.moveTo(canvas.width / 2, 0)
    ctx.lineTo(canvas.width / 2, canvas.height)
    ctx.moveTo(0, canvas.height / 2)
    ctx.lineTo(canvas.width, canvas.height / 2)
    ctx.stroke()

    // Trace path
    if (drawnPoints.length > 0) {
      ctx.strokeStyle = 'var(--gold)'
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(drawnPoints[0].x + canvas.width / 2, drawnPoints[0].y + canvas.height / 2)
      for (let i = 1; i < drawnPoints.length; i++) {
        ctx.lineTo(drawnPoints[i].x + canvas.width / 2, drawnPoints[i].y + canvas.height / 2)
      }
      ctx.stroke()
    }
  }

  useEffect(() => {
    if (activeTab === 'draw') {
      redrawSmallCanvas()
    }
  }, [drawnPoints, activeTab, theme])

  // Custom freehand drawing events in sidebar canvas
  const handleMouseDown = (e) => {
    if (activeTab !== 'draw') return
    setIsDrawing(true)
    const rect = drawCanvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setDrawnPoints([{ x, y }])
  }

  const handleMouseMove = (e) => {
    if (!isDrawing || activeTab !== 'draw') return
    const rect = drawCanvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setDrawnPoints(prev => [...prev, { x, y }])
  }

  const handleMouseUp = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    if (drawnPoints.length < 5) return

    // Downsample points to ~110 coordinates for clean Fourier cycles
    const step = Math.max(1, Math.floor(drawnPoints.length / 110))
    const filtered = drawnPoints.filter((_, idx) => idx % step === 0)

    // Scale up points from the drawing box (280x180) to fit main canvas (800x400)
    const scaledPoints = filtered.map(p => ({
      x: p.x * 1.8,
      y: p.y * 1.8
    }))

    setPoints(scaledPoints)
    setFourierComponents(computeDFT(scaledPoints))
    setPath([])
    setTime(0)
  }

  // Animation trace loop (renders epicycles and path traces)
  useEffect(() => {
    if (!isPlaying || fourierComponents.length === 0) return

    let animationFrameId

    const drawFrame = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Clear main canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Draw epicycles
      let x = centerX
      let y = centerY

      ctx.strokeStyle = theme === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)'
      ctx.lineWidth = 1

      const limit = Math.min(harmonicsCount, fourierComponents.length)

      for (let i = 0; i < limit; i++) {
        const { freq, amp, phase } = fourierComponents[i]
        const prevX = x
        const prevY = y

        x += amp * Math.cos(freq * time + phase)
        y += amp * Math.sin(freq * time + phase)

        if (showCircles && amp > 1.5) {
          // Draw epicycle circle
          ctx.beginPath()
          ctx.arc(prevX, prevY, amp, 0, Math.PI * 2)
          ctx.stroke()

          // Draw rotating arm
          ctx.beginPath()
          ctx.moveTo(prevX, prevY)
          ctx.lineTo(x, y)
          ctx.strokeStyle = theme === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.25)'
          ctx.stroke()
        }
      }

      // Add final coordinate to trace path
      setPath(prev => {
        const newPath = [...prev, { x, y }]
        if (newPath.length > points.length + 50) {
          newPath.shift()
        }
        return newPath
      })

      // Draw trace path
      if (path.length > 1) {
        ctx.beginPath()
        ctx.moveTo(path[0].x, path[0].y)
        for (let i = 1; i < path.length; i++) {
          ctx.lineTo(path[i].x, path[i].y)
        }
        ctx.strokeStyle = 'var(--gold)'
        ctx.lineWidth = 2.5
        ctx.stroke()
      }

      // Increment trace time step
      const dt = (Math.PI * 2) / points.length
      setTime(prev => (prev + dt * speed) % (Math.PI * 2))

      animationFrameId = requestAnimationFrame(drawFrame)
    }

    animationFrameId = requestAnimationFrame(drawFrame)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isPlaying, fourierComponents, harmonicsCount, time, speed, showCircles, points.length, path, theme])

  const handleClose = () => {
    if (isStandalone) {
      navigate('/playground')
    } else if (onClose) {
      onClose()
    }
  }

  return (
    <div className={styles.overlay}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Fourier Transform Visualizer</h1>
          <p>Deconstruct and reconstruct custom 2D paths using rotating Fourier epicycles.</p>
        </div>
        <button className={styles.closeBtn} onClick={handleClose}>
          ◀ Back
        </button>
      </div>

      {/* Body Grid */}
      <div className={styles.contentBody}>
        {/* Left Panel: Sidebar controls */}
        <div className={styles.sidebar}>
          <div className={styles.controlSection}>
            <h3>Input Mode</h3>
            <div className={styles.modeSelector}>
              <button
                className={`${styles.modeTab} ${activeTab === 'preset' ? styles.activeModeTab : ''}`}
                onClick={() => setActiveTab('preset')}
              >
                Presets
              </button>
              <button
                className={`${styles.modeTab} ${activeTab === 'text' ? styles.activeModeTab : ''}`}
                onClick={() => setActiveTab('text')}
              >
                Text
              </button>
              <button
                className={`${styles.modeTab} ${activeTab === 'draw' ? styles.activeModeTab : ''}`}
                onClick={() => setActiveTab('draw')}
              >
                Draw
              </button>
            </div>
          </div>

          {activeTab === 'preset' && (
            <div className={styles.controlSection}>
              <h3>Presets</h3>
              <div className={styles.presetsGrid}>
                {PRESETS.map((p, idx) => (
                  <button
                    key={p.name}
                    className={`${styles.presetBtn} ${selectedPreset === idx ? styles.activePreset : ''}`}
                    onClick={() => setSelectedPreset(idx)}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'text' && (
            <div className={styles.controlSection}>
              <h3>Custom Text</h3>
              <div className={styles.inputGroup}>
                <label htmlFor="text-input">Type a Name:</label>
                <input
                  id="text-input"
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className={styles.textInput}
                  maxLength={15}
                />
                <button className={styles.playBtn} onClick={handleGenerateText}>
                  Convert & Trace
                </button>
              </div>
            </div>
          )}

          {activeTab === 'draw' && (
            <div className={styles.controlSection}>
              <h3>Draw Shape</h3>
              
              {/* Separate drawing screen inside sidebar */}
              <div style={{ position: 'relative', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border2)', borderRadius: '8px', overflow: 'hidden', height: '180px' }}>
                <canvas
                  ref={drawCanvasRef}
                  width={280}
                  height={180}
                  style={{ display: 'block', cursor: 'crosshair' }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
                {drawnPoints.length === 0 && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', color: 'var(--muted)', fontSize: '0.8rem', fontFamily: 'Cinzel, serif' }}>
                    Draw inside this box
                  </div>
                )}
              </div>
              
              <button
                className={styles.actionBtn}
                style={{ padding: '8px' }}
                onClick={() => {
                  setDrawnPoints([])
                  setPoints([])
                  setFourierComponents([])
                  setPath([])
                }}
              >
                Clear Drawing
              </button>
            </div>
          )}

          <div className={styles.controlSection}>
            <h3>Visualization Controls</h3>
            
            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <span>Harmonic Circles</span>
                <span className={styles.sliderVal}>{Math.min(harmonicsCount, fourierComponents.length)}</span>
              </div>
              <input
                type="range"
                min="1"
                max={Math.max(1, fourierComponents.length)}
                value={harmonicsCount}
                onChange={(e) => setHarmonicsCount(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <span>Tracing Speed</span>
                <span className={styles.sliderVal}>{speed}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlsRow}>
              <button className={styles.playBtn} onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>
              <button
                className={styles.actionBtn}
                onClick={() => {
                  setPath([])
                  setTime(0)
                }}
              >
                Reset Path
              </button>
            </div>

            <div className={styles.inputGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <input
                id="show-circles-checkbox"
                type="checkbox"
                checked={showCircles}
                onChange={(e) => setShowCircles(e.target.checked)}
                style={{ accentColor: 'var(--gold)' }}
              />
              <label htmlFor="show-circles-checkbox">Show Epicycles / Arms</label>
            </div>
          </div>
        </div>

        {/* Center Panel: Main Visualizer Screen */}
        <div className={styles.canvasContainer}>
          <div className={styles.canvasWrapper}>
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className={styles.graphCanvas}
            />

            <div className={styles.canvasOverlayLabel}>
              Coordinates: {points.length} pts
            </div>
          </div>
        </div>

        {/* Right Panel: Mathematical details & Fourier coefficients */}
        <div className={styles.infoPanel}>
          <div className={styles.mathSection}>
            <h4>Fourier Series Expansion</h4>
            <div className={styles.mathFormula}>
              f(t) ≈ ∑ C_k · e^(i · ω_k · t)
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '6px' }}>
              Where each cycle has frequency <b>k</b>, amplitude <b>C_k</b>, and starting phase <b>φ_k</b>.
            </p>
          </div>

          <div className={styles.controlSection} style={{ flexGrow: 1, overflow: 'hidden' }}>
            <h3>Top Coefficients</h3>
            <div className={styles.coeffList}>
              {fourierComponents.slice(0, 40).map((coeff, idx) => {
                const maxAmp = fourierComponents[0]?.amp || 1
                const percent = (coeff.amp / maxAmp) * 100
                return (
                  <div key={idx} className={styles.coeffCard}>
                    <div className={styles.coeffMain}>
                      <span className={styles.coeffFreq}>Freq: {coeff.freq}Hz</span>
                      <span className={styles.coeffVal}>
                        Amp: {coeff.amp.toFixed(1)} | Phase: {coeff.phase.toFixed(2)}rad
                      </span>
                    </div>
                    <div className={styles.coeffAmpBar}>
                      <div className={styles.coeffAmpProgress} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
