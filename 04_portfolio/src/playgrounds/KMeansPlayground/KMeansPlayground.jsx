import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import styles from './KMeansPlayground.module.css'
import { generateRandomPoints, initializeCentroids, runKMeansStep } from './kmeansEngine'
import { parseCSV, processCSVData, SAMPLE_CUSTOMERS_CSV } from '../NeuralNetworkPlayground/csvParser'
import { useNavigate } from 'react-router-dom'

export default function KMeansPlayground({ theme, onClose, isStandalone = false }) {
  const navigate = useNavigate()
  const [kmIsRunning, setKmIsRunning] = useState(false)
  const [kmK, setKmK] = useState(3)
  const [kmDatasetType, setKmDatasetType] = useState('random')
  const [kmPoints, setKmPoints] = useState([])
  const [kmCentroids, setKmCentroids] = useState([])
  const [kmNextStep, setKmNextStep] = useState('assign')
  const [kmIsConverged, setKmIsConverged] = useState(false)
  const kmCanvasRef = useRef(null)
  const kmFileInputRef = useRef(null)

  const loadSampleKmCsv = () => {
    setKmIsRunning(false)
    const parsed = parseCSV(SAMPLE_CUSTOMERS_CSV)
    const processed = processCSVData(parsed, 'kmeans')
    setKmPoints(processed.points)
    const cens = initializeCentroids(kmK, processed.points)
    setKmCentroids(cens)
    setKmNextStep('assign')
    setKmIsConverged(false)
  }

  const handleKmCsvUpload = (file) => {
    if (!file) return
    setKmIsRunning(false)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target.result
      const parsed = parseCSV(text)
      const processed = processCSVData(parsed, 'kmeans')
      if (processed.points.length === 0) {
        alert('Invalid CSV structure. Ensure there are at least 2 numerical columns.')
        return
      }
      setKmPoints(processed.points)
      const cens = initializeCentroids(kmK, processed.points)
      setKmCentroids(cens)
      setKmNextStep('assign')
      setKmIsConverged(false)
    }
    reader.readAsText(file)
  }

  const initKMeans = () => {
    setKmIsRunning(false)
    if (kmDatasetType === 'csv') {
      if (kmPoints.length === 0 || !kmPoints[0].hasOwnProperty('x')) {
        loadSampleKmCsv()
        return
      } else {
        const cens = initializeCentroids(kmK, kmPoints)
        setKmCentroids(cens)
        setKmNextStep('assign')
        setKmIsConverged(false)
      }
    } else {
      const pts = generateRandomPoints(75)
      setKmPoints(pts)
      const cens = initializeCentroids(kmK, pts)
      setKmCentroids(cens)
      setKmNextStep('assign')
      setKmIsConverged(false)
    }
  }

  useEffect(() => {
    initKMeans()
  }, [kmK, kmDatasetType])

  // Step KMeans
  const handleKMeansStep = () => {
    if (kmIsConverged) return
    const res = runKMeansStep(kmPoints, kmCentroids, kmNextStep)
    setKmPoints(res.points)
    setKmCentroids(res.centroids)
    setKmNextStep(res.nextStep)
    if (res.isConverged) {
      setKmIsConverged(true)
      setKmIsRunning(false)
    }
  }

  // Auto-run loop logic
  useEffect(() => {
    if (!kmIsRunning || kmIsConverged) return
    const interval = setInterval(() => {
      handleKMeansStep()
    }, 600)
    return () => clearInterval(interval)
  }, [kmIsRunning, kmIsConverged, kmPoints, kmCentroids, kmNextStep])

  // Render Canvas
  useEffect(() => {
    if (!kmCanvasRef.current) return
    const canvas = kmCanvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
    const w = rect.width
    const h = rect.height

    ctx.clearRect(0, 0, w, h)
    const rootStyle = getComputedStyle(document.documentElement)
    const border = rootStyle.getPropertyValue('--border').trim() || '#2e200f'
    const colors = ['#eebb2f', '#ef4444', '#3b82f6', '#10b981', '#a855f7', '#f97316']

    ctx.strokeStyle = border
    ctx.lineWidth = 0.5
    for (let i = 40; i < w; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke()
    }
    for (let j = 40; j < h; j += 40) {
      ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(w, j); ctx.stroke()
    }

    if (kmNextStep === 'update') {
      ctx.lineWidth = 0.5
      kmPoints.forEach(p => {
        if (p.centroidId !== -1) {
          const cen = kmCentroids[p.centroidId]
          if (cen) {
            ctx.strokeStyle = colors[p.centroidId % colors.length] + '22'
            ctx.beginPath()
            ctx.moveTo(p.x * w, p.y * h)
            ctx.lineTo(cen.x * w, cen.y * h)
            ctx.stroke()
          }
        }
      })
    }

    kmPoints.forEach(p => {
      const color = p.centroidId === -1 ? '#7a6448' : colors[p.centroidId % colors.length]
      ctx.fillStyle = color
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 0.5
      ctx.beginPath(); ctx.arc(p.x * w, p.y * h, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
    })

    kmCentroids.forEach((c, idx) => {
      const cx = c.x * w
      const cy = c.y * h
      const color = colors[idx % colors.length]
      
      ctx.shadowBlur = 8; ctx.shadowColor = color
      ctx.fillStyle = color
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 1.5
      
      ctx.beginPath()
      ctx.moveTo(cx - 8, cy)
      ctx.lineTo(cx + 8, cy)
      ctx.moveTo(cx, cy - 8)
      ctx.lineTo(cx, cy + 8)
      ctx.stroke()
      
      ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
      ctx.shadowBlur = 0

      if (kmNextStep === 'assign' && c.prevX) {
        ctx.strokeStyle = color
        ctx.setLineDash([3, 3])
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(c.prevX * w, c.prevY * h)
        ctx.lineTo(cx, cy)
        ctx.stroke()
        ctx.setLineDash([])
      }
    })
  }, [kmPoints, kmCentroids, kmNextStep])

  const handleKMeansClick = (e) => {
    setKmIsRunning(false)
    if (!kmCanvasRef.current) return
    const canvas = kmCanvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    
    const newPt = {
      id: kmPoints.length,
      x,
      y,
      centroidId: -1,
    }
    setKmPoints(prev => [...prev, newPt])
    setKmNextStep('assign')
    setKmIsConverged(false)
  }

  const textColor = theme === 'light' ? 'var(--text)' : 'var(--cream)'

  return (
    <div className={isStandalone ? styles.standaloneContainer : styles.overlay}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1>K-Means Clustering Playground</h1>
          <p>Observe centroids settle density boundaries step-by-step or place custom node clusters</p>
        </div>
        <div className={styles.headerActions}>
          {isStandalone && (
            <button
              onClick={() => navigate('/')}
              style={{
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
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
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
              ◀ Back to Home
            </button>
          )}
          {!isStandalone && (
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className={styles.contentBody}>
        <div className={styles.dashboard}>
          <div className={styles.sidebar}>
            <div className={styles.sectionTitle}>K-Means Configuration</div>
            
            <div className={styles.controlGroup}>
              <div className={styles.controlLabel}>Dataset Type</div>
              <select 
                value={kmDatasetType} 
                onChange={(e) => setKmDatasetType(e.target.value)}
                className={styles.select}
              >
                <option value="random">Random Clusters</option>
                <option value="csv">Custom CSV Dataset</option>
              </select>
              
              {kmDatasetType === 'csv' && (
                <div style={{ marginTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input 
                    type="file" 
                    ref={kmFileInputRef} 
                    accept=".csv" 
                    onChange={(e) => handleKmCsvUpload(e.target.files[0])} 
                    style={{ display: 'none' }} 
                  />
                  <button className={styles.actionBtn} onClick={() => kmFileInputRef.current.click()}>
                    Upload CSV File
                  </button>
                  <button className={styles.actionBtn} onClick={loadSampleKmCsv}>
                    Use Sample Customer CSV
                  </button>
                </div>
              )}
            </div>

            <div className={styles.controlGroup}>
              <div className={styles.controlLabel}>
                <span>Clusters (K)</span>
                <span className={styles.controlValue}>{kmK}</span>
              </div>
              <input 
                type="range" min="2" max="6" step="1" 
                value={kmK} onChange={(e) => setKmK(Number(e.target.value))}
                className={styles.slider} 
              />
            </div>
            
            <button className={styles.actionBtn} onClick={initKMeans}>
              {kmDatasetType === 'csv' ? 'Re-initialize Centroids' : 'Generate Points'}
            </button>
          </div>

          <div className={styles.workspace} style={{ padding: '1.5rem', gap: '1.5rem' }}>
            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Next Pipeline step</span>
                <span className={styles.statValue} style={{ textTransform: 'uppercase' }}>{kmNextStep}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Convergence status</span>
                <span className={styles.statValue} style={{ color: kmIsConverged ? '#10b981' : 'var(--gold)' }}>
                  {kmIsConverged ? 'Converged' : 'Calculating'}
                </span>
              </div>
              <div className={styles.btnGroup}>
                <button 
                  className={styles.actionBtn} 
                  onClick={() => { setKmIsRunning(false); handleKMeansStep(); }} 
                  disabled={kmIsConverged}
                >
                  Step clustering
                </button>
                <button 
                  className={styles.actionBtn} 
                  onClick={() => setKmIsRunning(!kmIsRunning)} 
                  disabled={kmIsConverged}
                >
                  {kmIsRunning ? '⏸ Pause' : '▶ Run All'}
                </button>
              </div>
            </div>

            <div className={styles.kmeansWorkspace}>
              <div className={styles.kmeansCanvasContainer}>
                <div className={styles.projectionTitle}>
                  <h3>2D Coordinate Density Space</h3>
                  <p>Click inside the canvas grid to place custom coordinates, then run steps to re-adjust cluster divisions.</p>
                </div>
                <canvas ref={kmCanvasRef} onClick={handleKMeansClick} className={styles.kmeansCanvas} />
              </div>

              <div className={styles.detailsCard} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <h4>Unsupervised Clustering</h4>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text)', opacity: 0.85 }}>
                  K-Means is a fundamental data science model that groups coordinates by minimizing squared distances. 
                  <br /><br />
                  <strong>How it works:</strong>
                  <br />
                  1. Points assign to the nearest centroid vector (Euclidean metric).
                  <br />
                  2. Centroid centers shift to the average coordinates of all points assigned to them.
                  <br />
                  3. Repeat until centroid coordinate centers stabilize (convergence).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
