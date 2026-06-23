import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import styles from './NeuralNetworkPlayground.module.css'
import { SimpleMLP, generateDataset } from './neuralNetworkEngine'
import { parseCSV, processCSVData, SAMPLE_ADS_CSV } from './csvParser'
import { useNavigate } from 'react-router-dom'

export default function NeuralNetworkPlayground({ theme, onClose, isStandalone = false }) {
  const navigate = useNavigate()
  const [nnDatasetType, setNnDatasetType] = useState('xor')
  const [nnHiddenLayers, setNnHiddenLayers] = useState([4, 3])
  const [nnLearningRate, setNnLearningRate] = useState(0.04)
  const [nnEpochs, setNnEpochs] = useState(0)
  const [nnLoss, setNnLoss] = useState(0)
  const [nnIsTraining, setNnIsTraining] = useState(false)
  const nnNetworkCanvasRef = useRef(null)
  const nnBoundaryCanvasRef = useRef(null)
  const nnModelRef = useRef(null)
  const nnDatasetRef = useRef({ X: [], y: [] })
  const nnFileInputRef = useRef(null)

  const loadSampleNnCsv = () => {
    const parsed = parseCSV(SAMPLE_ADS_CSV)
    const processed = processCSVData(parsed, 'nn')
    nnDatasetRef.current = processed
    nnModelRef.current = new SimpleMLP([2, ...nnHiddenLayers, 1])
    setNnEpochs(0)
    setNnLoss(0.8)
    drawNN()
    drawBoundary()
  }

  const handleNnCsvUpload = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target.result
      const parsed = parseCSV(text)
      const processed = processCSVData(parsed, 'nn')
      if (processed.X.length === 0) {
        alert('Invalid CSV structure. Ensure there are at least 2 numerical feature columns and a binary label column.')
        return
      }
      nnDatasetRef.current = processed
      nnModelRef.current = new SimpleMLP([2, ...nnHiddenLayers, 1])
      setNnEpochs(0)
      setNnLoss(0.8)
      drawNN()
      drawBoundary()
    }
    reader.readAsText(file)
  }

  const initNN = () => {
    if (nnDatasetType === 'csv') {
      if (!nnDatasetRef.current.X || nnDatasetRef.current.X.length === 0) {
        loadSampleNnCsv()
        return
      }
    } else {
      nnDatasetRef.current = generateDataset(nnDatasetType, 160)
    }
    nnModelRef.current = new SimpleMLP([2, ...nnHiddenLayers, 1])
    setNnEpochs(0)
    setNnLoss(0.8)
    drawNN()
    drawBoundary()
  }

  useEffect(() => {
    initNN()
  }, [nnDatasetType, nnHiddenLayers])

  // Training Loop
  useEffect(() => {
    if (!nnIsTraining) return
    let animId
    const step = () => {
      if (nnModelRef.current && nnDatasetRef.current.X.length > 0) {
        let lastLoss = 0
        for (let i = 0; i < 5; i++) {
          lastLoss = nnModelRef.current.trainStep(
            nnDatasetRef.current.X,
            nnDatasetRef.current.y,
            nnLearningRate
          )
        }
        setNnLoss(lastLoss)
        setNnEpochs(prev => prev + 5)
        drawNN()
        drawBoundary()
      }
      animId = requestAnimationFrame(step)
    }
    animId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animId)
  }, [nnIsTraining, nnLearningRate])

  // Draw Layer Graph
  const drawNN = () => {
    if (!nnNetworkCanvasRef.current || !nnModelRef.current) return
    const canvas = nnNetworkCanvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
    const w = rect.width
    const h = rect.height

    ctx.clearRect(0, 0, w, h)
    const rootStyle = getComputedStyle(document.documentElement)
    const gold = rootStyle.getPropertyValue('--gold').trim() || '#eebb2f'
    const text = rootStyle.getPropertyValue('--text').trim() || '#e8dcc8'
    const border = rootStyle.getPropertyValue('--border').trim() || '#2e200f'

    const model = nnModelRef.current
    const layerSizes = model.layerSizes
    const layerCount = layerSizes.length

    const nodes = []
    const layerSpacing = w / (layerCount + 0.5)
    for (let l = 0; l < layerCount; l++) {
      const nodeCount = layerSizes[l]
      const layerNodes = []
      const x = layerSpacing * (l + 0.7)
      const nodeSpacing = h / (nodeCount + 1)
      for (let n = 0; n < nodeCount; n++) {
        layerNodes.push({ x, y: nodeSpacing * (n + 1) })
      }
      nodes.push(layerNodes)
    }

    for (let l = 0; l < layerCount - 1; l++) {
      const currentLayer = nodes[l]
      const nextLayer = nodes[l + 1]
      const weights = model.weights[l]

      for (let r = 0; r < nextLayer.length; r++) {
        for (let c = 0; c < currentLayer.length; c++) {
          const val = weights[r][c]
          ctx.strokeStyle = val > 0 ? gold : '#6b1a1a'
          ctx.lineWidth = Math.min(Math.abs(val) * 1.5, 3.5)
          ctx.globalAlpha = Math.max(Math.min(Math.abs(val), 0.8), 0.15)
          ctx.beginPath()
          ctx.moveTo(currentLayer[c].x, currentLayer[c].y)
          ctx.lineTo(nextLayer[r].x, nextLayer[r].y)
          ctx.stroke()
        }
      }
    }
    ctx.globalAlpha = 1.0

    nodes.forEach((layer, lIdx) => {
      layer.forEach((node) => {
        ctx.fillStyle = lIdx === 0 ? text : lIdx === layerCount - 1 ? gold : border
        ctx.strokeStyle = border
        ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.arc(node.x, node.y, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
      })
    })
  }

  // Draw Decision Boundary
  const drawBoundary = () => {
    if (!nnBoundaryCanvasRef.current || !nnModelRef.current) return
    const canvas = nnBoundaryCanvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
    const w = rect.width
    const h = rect.height

    const resolution = 40
    const cellW = w / resolution
    const cellH = h / resolution

    const rootStyle = getComputedStyle(document.documentElement)
    const gold = rootStyle.getPropertyValue('--gold').trim() || '#eebb2f'

    for (let r = 0; r < resolution; r++) {
      for (let c = 0; c < resolution; c++) {
        const nx = ((c / resolution) - 0.5) * 2.4
        const ny = (0.5 - (r / resolution)) * 2.4
        const { output } = nnModelRef.current.forward([nx, ny])
        const score = output[0]
        ctx.fillStyle = `rgba(${score > 0.5 ? '238, 187, 47' : '107, 26, 26'}, ${Math.abs(score - 0.5) * 0.35})`
        ctx.fillRect(c * cellW, r * cellH, cellW + 0.5, cellH + 0.5)
      }
    }

    const { X, y } = nnDatasetRef.current
    X.forEach((coords, idx) => {
      const px = ((coords[0] / 2.4) + 0.5) * w
      const py = (0.5 - (coords[1] / 2.4)) * h
      const label = y[idx]
      ctx.fillStyle = label === 1 ? gold : '#ef4444'
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.arc(px, py, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
    })
  }

  const textColor = theme === 'light' ? 'var(--text)' : 'var(--cream)'

  return (
    <div className={isStandalone ? styles.standaloneContainer : styles.overlay}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Neural Network Playground</h1>
          <p>Train a Multi-Layer Perceptron (MLP) live and sample dynamic classification decision boundaries</p>
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
            <div className={styles.sectionTitle}>Dataset Configuration</div>
            <div className={styles.controlGroup}>
              <div className={styles.controlLabel}>Dataset Type</div>
              <select 
                value={nnDatasetType} 
                onChange={(e) => setNnDatasetType(e.target.value)}
                className={styles.select}
              >
                <option value="xor">XOR Quadrants</option>
                <option value="circle">Concentric Circles</option>
                <option value="csv">Custom CSV Dataset</option>
              </select>
              
              {nnDatasetType === 'csv' && (
                <div style={{ marginTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input 
                    type="file" 
                    ref={nnFileInputRef} 
                    accept=".csv" 
                    onChange={(e) => handleNnCsvUpload(e.target.files[0])} 
                    style={{ display: 'none' }} 
                  />
                  <button className={styles.actionBtn} onClick={() => nnFileInputRef.current.click()}>
                    Upload CSV File
                  </button>
                  <button className={styles.actionBtn} onClick={loadSampleNnCsv}>
                    Use Sample Ads CSV
                  </button>
                </div>
              )}
            </div>

            <div className={styles.sectionTitle}>Hyperparameters</div>
            <div className={styles.controlGroup}>
              <div className={styles.controlLabel}>
                <span>Learning Rate</span>
                <span className={styles.controlValue}>{nnLearningRate}</span>
              </div>
              <input 
                type="range" min="0.01" max="0.3" step="0.01" 
                value={nnLearningRate} onChange={(e) => setNnLearningRate(Number(e.target.value))}
                className={styles.slider} 
              />
            </div>

            <div className={styles.sectionTitle}>Network Architecture</div>
            <div className={styles.architectureControls}>
              <button className={styles.layerConfigBtn} onClick={() => {
                if (nnHiddenLayers.length < 4) setNnHiddenLayers([...nnHiddenLayers, 3])
              }}>+</button>
              <span>Layers: {nnHiddenLayers.join('-')}</span>
              <button className={styles.layerConfigBtn} onClick={() => {
                if (nnHiddenLayers.length > 1) setNnHiddenLayers(nnHiddenLayers.slice(0, -1))
              }}>-</button>
            </div>
            <button className={styles.actionBtn} onClick={initNN}>Randomize Weights</button>
          </div>

          <div className={styles.workspace} style={{ padding: '1.5rem' }}>
            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Epochs Trained</span>
                <span className={styles.statValue}>{nnEpochs}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Cross-Entropy Loss</span>
                <span className={styles.statValue}>{nnLoss.toFixed(5)}</span>
              </div>
              <button className={styles.playBtn} onClick={() => setNnIsTraining(!nnIsTraining)}>
                {nnIsTraining ? '⏸ Pause Training' : '▶ Train Network'}
              </button>
            </div>

            <div className={styles.nnWorkspace} style={{ marginTop: '1.5rem' }}>
              <div className={styles.nnPanel}>
                <h3>MLP Neuron Connections</h3>
                <p>Weights are drawn as connection lines. Yellow indicates positive weights, crimson indicates negative weights.</p>
                <canvas ref={nnNetworkCanvasRef} className={styles.nnCanvas} />
              </div>

              <div className={styles.nnPanel}>
                <h3>Decision Space</h3>
                <p>Background gradients show model probability fields. Scatter nodes show labeled coordinates.</p>
                <canvas ref={nnBoundaryCanvasRef} className={styles.nnCanvas} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
