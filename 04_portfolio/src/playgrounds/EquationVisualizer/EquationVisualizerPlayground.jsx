import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './EquationVisualizerPlayground.module.css'
import { parseAndEvaluate } from './equationParser'

const PRESETS = [
  { name: 'Sine Wave', eq: 'y = sin(x)' },
  { name: 'Quadratic Curve', eq: 'y = x^2' },
  { name: 'Damped Oscillation', eq: 'y = exp(-0.15 * x) * sin(2 * x)' },
  { name: 'Complex Waves', eq: 'y = sin(x) + cos(2 * x)' },
  { name: 'Cubic Curve', eq: 'y = 0.1 * x^3 - x' }
]

export default function EquationVisualizerPlayground({ theme, onClose, isStandalone = false }) {
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleResize = () => {
      setDimensions({
        width: container.clientWidth,
        height: container.clientHeight
      })
    }

    handleResize()
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const [equation, setEquation] = useState('y = sin(x)')
  const [xMin, setXMin] = useState(-10)
  const [xMax, setXMax] = useState(10)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(100) // ms per step
  const [points, setPoints] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [error, setError] = useState(null)

  // Advanced feature toggles
  const [showTangent, setShowTangent] = useState(true)
  const [showIntegral, setShowIntegral] = useState(true)
  const [showGrid, setShowGrid] = useState(true)

  const handleClose = () => {
    if (isStandalone) {
      navigate('/playground')
    } else if (onClose) {
      onClose()
    }
  }

  // Precompute the points whenever parameters change
  useEffect(() => {
    try {
      setError(null)
      const computedPoints = []
      const stepSize = (xMax - xMin) / 100 // 100 steps for tracing

      for (let i = 0; i <= 100; i++) {
        const xVal = xMin + stepSize * i
        const yVal = parseAndEvaluate(equation, xVal)
        computedPoints.push({ x: xVal, y: yVal })
      }

      setPoints(computedPoints)
      setCurrentIndex(0)
      setIsPlaying(false)
    } catch (err) {
      setError(err.message || 'Math evaluation error.')
      setPoints([])
    }
  }, [equation, xMin, xMax])

  // Tracing animation effect
  useEffect(() => {
    let timer = null
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= points.length - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, playbackSpeed)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isPlaying, points, playbackSpeed])

  // Numerical Derivative (Tangent Slope) calculation
  const getSlopeAtCurrent = () => {
    if (points.length === 0 || currentIndex >= points.length) return 0
    const nextIdx = Math.min(currentIndex + 1, points.length - 1)
    const prevIdx = Math.max(currentIndex - 1, 0)
    const dx = points[nextIdx].x - points[prevIdx].x
    if (dx === 0) return 0
    return (points[nextIdx].y - points[prevIdx].y) / dx
  }

  // Cumulative Numerical Integration (Trapezoidal Rule)
  const getIntegralAtCurrent = () => {
    let area = 0
    for (let i = 1; i <= currentIndex; i++) {
      const dx = points[i].x - points[i - 1].x
      const avgY = (points[i].y + points[i - 1].y) / 2
      area += avgY * dx
    }
    return area
  }

  // Canvas drawing
  useEffect(() => {
    let animationId
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      const width = canvas.width
      const height = canvas.height

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Compute Y bounds dynamically based on computed points to center/scale properly
      if (points.length === 0) return

      const yVals = points.map(p => p.y)
      let yMin = Math.min(...yVals)
      let yMax = Math.max(...yVals)

      // Add padding to bounds
      const yMargin = (yMax - yMin) * 0.15 || 1.0
      yMin -= yMargin
      yMax += yMargin

      // Translate coordinates
      const toCanvasX = (x) => ((x - xMin) / (xMax - xMin)) * width
      const toCanvasY = (y) => height - ((y - yMin) / (yMax - yMin)) * height

      // Draw grid lines (optional)
      if (showGrid) {
        ctx.strokeStyle = theme === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)'
        ctx.lineWidth = 1
        
        // Vertical gridlines
        for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
          const cx = toCanvasX(x)
          ctx.beginPath()
          ctx.moveTo(cx, 0)
          ctx.lineTo(cx, height)
          ctx.stroke()
        }

        // Horizontal gridlines
        for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
          const cy = toCanvasY(y)
          ctx.beginPath()
          ctx.moveTo(0, cy)
          ctx.lineTo(width, cy)
          ctx.stroke()
        }
      }

      // Draw main axes (X and Y axes)
      ctx.strokeStyle = theme === 'light' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.2)'
      ctx.lineWidth = 2

      // X Axis
      const xAxisY = toCanvasY(0)
      if (xAxisY >= 0 && xAxisY <= height) {
        ctx.beginPath()
        ctx.moveTo(0, xAxisY)
        ctx.lineTo(width, xAxisY)
        ctx.stroke()
      }

      // Y Axis
      const yAxisX = toCanvasX(0)
      if (yAxisX >= 0 && yAxisX <= width) {
        ctx.beginPath()
        ctx.moveTo(yAxisX, 0)
        ctx.lineTo(yAxisX, height)
        ctx.stroke()
      }

      const activePoints = points.slice(0, currentIndex + 1)
      if (activePoints.length > 0) {
        // 1. Shaded Area Under Curve (Integral visualization)
        if (showIntegral && activePoints.length > 1) {
          ctx.fillStyle = theme === 'light' ? 'rgba(238, 187, 47, 0.12)' : 'rgba(238, 187, 47, 0.08)'
          ctx.beginPath()
          ctx.moveTo(toCanvasX(activePoints[0].x), toCanvasY(0))
          for (let i = 0; i < activePoints.length; i++) {
            ctx.lineTo(toCanvasX(activePoints[i].x), toCanvasY(activePoints[i].y))
          }
          ctx.lineTo(toCanvasX(activePoints[activePoints.length - 1].x), toCanvasY(0))
          ctx.closePath()
          ctx.fill()
        }

        // 2. Draw entire light trace curve (ghost line)
        ctx.strokeStyle = theme === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.06)'
        ctx.lineWidth = 2
        ctx.setLineDash([4, 4])
        ctx.beginPath()
        ctx.moveTo(toCanvasX(points[0].x), toCanvasY(points[0].y))
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(toCanvasX(points[i].x), toCanvasY(points[i].y))
        }
        ctx.stroke()
        ctx.setLineDash([]) // Reset dash

        // 3. Draw moving active trace line
        ctx.strokeStyle = 'var(--gold)'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(toCanvasX(activePoints[0].x), toCanvasY(activePoints[0].y))
        for (let i = 1; i < activePoints.length; i++) {
          ctx.lineTo(toCanvasX(activePoints[i].x), toCanvasY(activePoints[i].y))
        }
        ctx.stroke()

        // 4. Draw Tangent line (Derivative visualization)
        const currentPt = activePoints[activePoints.length - 1]
        if (currentPt) {
          const currCX = toCanvasX(currentPt.x)
          const currCY = toCanvasY(currentPt.y)

          if (showTangent && activePoints.length > 1) {
            const m = getSlopeAtCurrent()
            // Draw tangent segment spanning 1.5 units on X axis
            const xOffset = 2.0
            const x1 = currentPt.x - xOffset
            const y1 = currentPt.y - m * xOffset
            const x2 = currentPt.x + xOffset
            const y2 = currentPt.y + m * xOffset

            ctx.strokeStyle = '#06b6d4' // Neon cyan tangent
            ctx.lineWidth = 2.5
            ctx.beginPath()
            ctx.moveTo(toCanvasX(x1), toCanvasY(y1))
            ctx.lineTo(toCanvasX(x2), toCanvasY(y2))
            ctx.stroke()
          }

          // 5. Draw intermediate nodes
          ctx.fillStyle = theme === 'light' ? '#3b82f6' : '#2563eb'
          activePoints.forEach((p, idx) => {
            if (idx % 10 === 0 || idx === currentIndex) {
              ctx.beginPath()
              ctx.arc(toCanvasX(p.x), toCanvasY(p.y), 4, 0, 2 * Math.PI)
              ctx.fill()
            }
          })

          // 6. Highlight current point
          // Outer pulsing ring
          ctx.strokeStyle = 'var(--gold-dim)'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(currCX, currCY, 8 + Math.sin(Date.now() / 100) * 3, 0, 2 * Math.PI)
          ctx.stroke()

          // Inner dot
          ctx.fillStyle = 'var(--cream)'
          ctx.beginPath()
          ctx.arc(currCX, currCY, 5, 0, 2 * Math.PI)
          ctx.fill()
        }
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [points, currentIndex, theme, showTangent, showIntegral, showGrid])

  const currentPoint = points[currentIndex]
  const currentSlope = getSlopeAtCurrent()
  const currentArea = getIntegralAtCurrent()

  return (
    <div className={styles.overlay}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Equation Visualizer</h1>
          <p>Animate point-by-point coordinate calculations and trace graphs dynamically.</p>
        </div>
        <div className={styles.headerActions}>
          <button
            onClick={handleClose}
            className={styles.closeBtn}
            aria-label="Close"
          >
            ◀ Back to Hub
          </button>
        </div>
      </div>

      <div className={styles.contentBody}>
        {/* Sidebar Controls */}
        <div className={styles.sidebar}>
          <div className={styles.controlSection}>
            <h3>Define Equation</h3>
            <div className={styles.inputGroup}>
              <label>Formula</label>
              <input
                type="text"
                value={equation}
                onChange={(e) => setEquation(e.target.value)}
                className={styles.textInput}
                placeholder="y = sin(x)"
              />
              {error && <span className={styles.errorMsg}>{error}</span>}
            </div>

            <div className={styles.presetsGrid}>
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setEquation(preset.eq)}
                  className={`${styles.presetBtn} ${equation === preset.eq ? styles.activePreset : ''}`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.controlSection}>
            <h3>Plot Range</h3>
            <div className={styles.rangeInputs}>
              <div className={styles.rangeGroup}>
                <label>x Min</label>
                <input
                  type="number"
                  value={xMin}
                  onChange={(e) => setXMin(Number(e.target.value))}
                  className={styles.numberInput}
                />
              </div>
              <div className={styles.rangeGroup}>
                <label>x Max</label>
                <input
                  type="number"
                  value={xMax}
                  onChange={(e) => setXMax(Number(e.target.value))}
                  className={styles.numberInput}
                />
              </div>
            </div>
          </div>

          <div className={styles.controlSection}>
            <h3>Playback & Scrub</h3>
            <div className={styles.controlsRow}>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={points.length === 0}
                className={styles.playBtn}
              >
                {isPlaying ? '⏸ Pause' : '▶ Start Trace'}
              </button>
              <button
                onClick={() => {
                  setIsPlaying(false)
                  setCurrentIndex(0)
                }}
                className={styles.resetBtn}
              >
                Reset
              </button>
            </div>

            {/* Seek Scrubber Slider */}
            <div className={styles.sliderGroup}>
              <label>Seek Track ({currentIndex}%)</label>
              <input
                type="range"
                min="0"
                max={Math.max(0, points.length - 1)}
                value={currentIndex}
                onChange={(e) => {
                  setIsPlaying(false)
                  setCurrentIndex(Number(e.target.value))
                }}
                className={styles.slider}
              />
            </div>

            <div className={styles.sliderGroup}>
              <label>Speed ({playbackSpeed}ms)</label>
              <input
                type="range"
                min="20"
                max="500"
                step="20"
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className={styles.slider}
              />
            </div>
          </div>

          <div className={styles.controlSection}>
            <h3>Calculus & Visual Toggles</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={showTangent}
                  onChange={(e) => setShowTangent(e.target.checked)}
                />
                Show Tangent Line (Derivative)
              </label>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={showIntegral}
                  onChange={(e) => setShowIntegral(e.target.checked)}
                />
                Show Shaded Area (Integral)
              </label>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                />
                Show Coordinate Grid
              </label>
            </div>
          </div>

          {currentPoint && (
            <div className={styles.statsCard}>
              <h4>Interactive Stats</h4>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Coordinate Point</span>
                <span className={styles.statVal}>
                  ({currentPoint.x.toFixed(2)}, {currentPoint.y.toFixed(2)})
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Derivative dy/dx (Slope)</span>
                <span className={styles.statVal} style={{ color: '#06b6d4' }}>
                  {currentSlope.toFixed(4)}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Integral ∫y dx (Area)</span>
                <span className={styles.statVal} style={{ color: '#eab308' }}>
                  {currentArea.toFixed(4)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Canvas Area */}
        <div className={styles.canvasContainer}>
          <div className={styles.canvasWrapper} ref={containerRef}>
            <canvas
              ref={canvasRef}
              width={dimensions.width}
              height={dimensions.height}
              className={styles.graphCanvas}
            />
            {currentPoint && (
              <div className={styles.canvasOverlayLabel}>
                Target: ({currentPoint.x.toFixed(2)}, {currentPoint.y.toFixed(2)})
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
