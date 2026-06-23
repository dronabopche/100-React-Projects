import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import styles from './QuantumPlayground.module.css'
import { runSimulation } from './quantumEngine'
import { useNavigate } from 'react-router-dom'

export default function QuantumPlayground({ theme, onClose, isStandalone = false }) {
  const navigate = useNavigate()
  
  // Stages: 6 timeline columns. Each stage has up to 2 qubit gate entries.
  // Initially empty (Identity 'I' gates)
  const [stages, setStages] = useState([
    [{ qubit: 0, type: 'I' }, { qubit: 1, type: 'I' }],
    [{ qubit: 0, type: 'I' }, { qubit: 1, type: 'I' }],
    [{ qubit: 0, type: 'I' }, { qubit: 1, type: 'I' }],
    [{ qubit: 0, type: 'I' }, { qubit: 1, type: 'I' }],
    [{ qubit: 0, type: 'I' }, { qubit: 1, type: 'I' }],
    [{ qubit: 0, type: 'I' }, { qubit: 1, type: 'I' }]
  ])
  
  const [activeCell, setActiveCell] = useState(null) // { stageIndex, qubitIndex }
  const [results, setResults] = useState([])
  
  // Re-run simulation whenever circuit structure changes
  useEffect(() => {
    const outputs = runSimulation(stages)
    setResults(outputs)
  }, [stages])

  const setGate = (stageIdx, qubitIdx, gateType) => {
    setStages(prev => {
      const next = prev.map((stage, sIdx) => {
        if (sIdx !== stageIdx) return stage
        
        return stage.map((gate, qIdx) => {
          if (qIdx !== qubitIdx) return gate
          return { qubit: qIdx, type: gateType }
        })
      })
      return next
    })
    setActiveCell(null)
  }

  const setCNOT = (stageIdx, controlQubit) => {
    setStages(prev => {
      const next = prev.map((stage, sIdx) => {
        if (sIdx !== stageIdx) return stage
        return [
          { qubit: 0, type: controlQubit === 0 ? 'CNOT' : 'I' },
          { qubit: 1, type: controlQubit === 1 ? 'CNOT' : 'I' }
        ]
      })
      return next
    })
    setActiveCell(null)
  }

  const clearCircuit = () => {
    setStages([
      [{ qubit: 0, type: 'I' }, { qubit: 1, type: 'I' }],
      [{ qubit: 0, type: 'I' }, { qubit: 1, type: 'I' }],
      [{ qubit: 0, type: 'I' }, { qubit: 1, type: 'I' }],
      [{ qubit: 0, type: 'I' }, { qubit: 1, type: 'I' }],
      [{ qubit: 0, type: 'I' }, { qubit: 1, type: 'I' }],
      [{ qubit: 0, type: 'I' }, { qubit: 1, type: 'I' }]
    ])
    setActiveCell(null)
  }

  // Load Presets
  const loadPreset = (type) => {
    clearCircuit()
    if (type === 'superposition') {
      setStages([
        [{ qubit: 0, type: 'H' }, { qubit: 1, type: 'I' }],
        [{ qubit: 0, type: 'I' }, { qubit: 1, type: 'I' }],
        [{ qubit: 0, type: 'I' }, { qubit: 1, type: 'I' }],
        [{ qubit: 0, type: 'I' }, { qubit: 1, type: 'I' }],
        [{ qubit: 0, type: 'I' }, { qubit: 1, type: 'I' }],
        [{ qubit: 0, type: 'I' }, { qubit: 1, type: 'I' }]
      ])
    } else if (type === 'bell') {
      setStages([
        [{ qubit: 0, type: 'H' }, { qubit: 1, type: 'I' }],
        [{ qubit: 0, type: 'CNOT' }, { qubit: 1, type: 'I' }], // Q0 control CNOT
        [{ qubit: 0, type: 'I' }, { qubit: 1, type: 'I' }],
        [{ qubit: 0, type: 'I' }, { qubit: 1, type: 'I' }],
        [{ qubit: 0, type: 'I' }, { qubit: 1, type: 'I' }],
        [{ qubit: 0, type: 'I' }, { qubit: 1, type: 'I' }]
      ])
    } else if (type === 'flip') {
      setStages([
        [{ qubit: 0, type: 'X' }, { qubit: 1, type: 'I' }],
        [{ qubit: 0, type: 'I' }, { qubit: 1, type: 'X' }],
        [{ qubit: 0, type: 'I' }, { qubit: 1, type: 'I' }],
        [{ qubit: 0, type: 'I' }, { qubit: 1, type: 'I' }],
        [{ qubit: 0, type: 'I' }, { qubit: 1, type: 'I' }],
        [{ qubit: 0, type: 'I' }, { qubit: 1, type: 'I' }]
      ])
    }
  }

  const textColor = theme === 'light' ? 'var(--text)' : 'var(--cream)'

  return (
    <div className={isStandalone ? styles.standaloneContainer : styles.overlay}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Quantum Circuit Visualizer</h1>
          <p>Superposition amplitudes, phase rotations, and Bell State entanglement in real-time</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.clearBtn} onClick={clearCircuit}>
            Reset Circuit
          </button>
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
            <div className={styles.sectionTitle}>Presets & Demos</div>
            <div className={styles.presetGroup}>
              <button className={styles.actionBtn} onClick={() => loadPreset('superposition')}>
                Hadamard Superposition
              </button>
              <button className={styles.actionBtn} onClick={() => loadPreset('bell')}>
                Bell State Entanglement
              </button>
              <button className={styles.actionBtn} onClick={() => loadPreset('flip')}>
                Pauli-X State Flip
              </button>
            </div>

            <div className={styles.sectionTitle} style={{ marginTop: '1.5rem' }}>Gate Reference</div>
            <div className={styles.refCard}>
              <div className={styles.refItem}>
                <span className={styles.refBadge} style={{ background: '#3b82f6' }}>H</span>
                <div>
                  <strong>Hadamard</strong>
                  <p>Splits state into equal probabilities of |0⟩ and |1⟩</p>
                </div>
              </div>
              <div className={styles.refItem}>
                <span className={styles.refBadge} style={{ background: '#ef4444' }}>X</span>
                <div>
                  <strong>Pauli-X</strong>
                  <p>Inverts state (classical NOT gate equivalent)</p>
                </div>
              </div>
              <div className={styles.refItem}>
                <span className={styles.refBadge} style={{ background: '#a855f7' }}>Z</span>
                <div>
                  <strong>Pauli-Z</strong>
                  <p>Rotates phase amplitude by 180 degrees</p>
                </div>
              </div>
              <div className={styles.refItem}>
                <span className={styles.refBadge} style={{ background: '#10b981' }}>CX</span>
                <div>
                  <strong>Controlled-X</strong>
                  <p>Entangles qubits. Flips target if control is |1⟩</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.workspace}>
            {/* Visual Circuit timeline */}
            <div className={styles.circuitContainer}>
              <h3>2-Qubit Quantum Circuit Editor</h3>
              <p>Click any cell in the circuit grid to add, swap, or delete gates</p>

              <div className={styles.circuitGrid}>
                {/* Qubit 0 Line */}
                <div className={styles.qubitRow}>
                  <div className={styles.qubitLabel}>Qubit 0 |0⟩</div>
                  <div className={styles.stageCells}>
                    {stages.map((stage, sIdx) => {
                      const gate = stage[0]
                      const isActive = activeCell?.stageIndex === sIdx && activeCell?.qubitIndex === 0
                      return (
                        <div 
                          key={`q0-s${sIdx}`} 
                          className={`${styles.cell} ${gate.type !== 'I' ? styles.cellOccupied : ''} ${isActive ? styles.cellActive : ''}`}
                          onClick={() => setActiveCell({ stageIndex: sIdx, qubitIndex: 0 })}
                        >
                          {gate.type !== 'I' && (
                            <span 
                              className={styles.gateBadge}
                              style={{
                                background: gate.type === 'H' ? '#3b82f6' : gate.type === 'X' ? '#ef4444' : gate.type === 'Z' ? '#a855f7' : '#10b981'
                              }}
                            >
                              {gate.type === 'CNOT' ? '● CX' : gate.type}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className={styles.wireLine} />

                {/* Qubit 1 Line */}
                <div className={styles.qubitRow}>
                  <div className={styles.qubitLabel}>Qubit 1 |0⟩</div>
                  <div className={styles.stageCells}>
                    {stages.map((stage, sIdx) => {
                      const gate = stage[1]
                      const isActive = activeCell?.stageIndex === sIdx && activeCell?.qubitIndex === 1
                      return (
                        <div 
                          key={`q1-s${sIdx}`} 
                          className={`${styles.cell} ${gate.type !== 'I' ? styles.cellOccupied : ''} ${isActive ? styles.cellActive : ''}`}
                          onClick={() => setActiveCell({ stageIndex: sIdx, qubitIndex: 1 })}
                        >
                          {gate.type !== 'I' && (
                            <span 
                              className={styles.gateBadge}
                              style={{
                                background: gate.type === 'H' ? '#3b82f6' : gate.type === 'X' ? '#ef4444' : gate.type === 'Z' ? '#a855f7' : '#10b981'
                              }}
                            >
                              {gate.type === 'CNOT' ? '┼ CX' : gate.type}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Gate Selector Popover */}
                {activeCell && (
                  <div className={styles.popover} style={{ left: `calc(130px + ${activeCell.stageIndex * 15}% + 10px)` }}>
                    <h4>Select Gate for Stage {activeCell.stageIndex + 1}</h4>
                    <div className={styles.popoverGrid}>
                      <button onClick={() => setGate(activeCell.stageIndex, activeCell.qubitIndex, 'H')}>H (Hadamard)</button>
                      <button onClick={() => setGate(activeCell.stageIndex, activeCell.qubitIndex, 'X')}>X (NOT)</button>
                      <button onClick={() => setGate(activeCell.stageIndex, activeCell.qubitIndex, 'Y')}>Y (Pauli-Y)</button>
                      <button onClick={() => setGate(activeCell.stageIndex, activeCell.qubitIndex, 'Z')}>Z (Phase Shift)</button>
                      <button onClick={() => setCNOT(activeCell.stageIndex, activeCell.qubitIndex)}>CNOT (Control)</button>
                      <button onClick={() => setGate(activeCell.stageIndex, activeCell.qubitIndex, 'I')} className={styles.popoverRemove}>Remove</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Simulation Outcomes */}
            <div className={styles.outcomesGrid}>
              {/* Probabilities panel */}
              <div className={styles.outcomePanel}>
                <h3>Live State Vector Probabilities</h3>
                <p>Chance of collapsing into each binary state during measurement</p>
                <div className={styles.chartContainer}>
                  {results.map(res => (
                    <div key={res.label} className={styles.barRow}>
                      <span className={styles.barLabel}>{res.label}</span>
                      <div className={styles.barTrack}>
                        <div 
                          className={styles.barFill} 
                          style={{ width: `${res.prob * 100}%` }}
                        />
                      </div>
                      <span className={styles.barValue}>{(res.prob * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phases panel */}
              <div className={styles.outcomePanel}>
                <h3>Quantum Amplitude Phase Rotations</h3>
                <p>Vector angles in the complex plane showing phase rotation</p>
                <div className={styles.phaseContainer}>
                  {results.map(res => {
                    const radius = 30
                    const angleRad = (res.phase * Math.PI) / 180
                    const cx = 35 + Math.cos(angleRad) * radius
                    const cy = 35 - Math.sin(angleRad) * radius
                    return (
                      <div key={res.label} className={styles.phaseItem}>
                        <div className={styles.phaseCircle}>
                          <svg width="70" height="70">
                            <circle cx="35" cy="35" r={radius} className={styles.circleBg} />
                            {res.prob > 0.001 && (
                              <>
                                <line x1="35" y1="35" x2={cx} y2={cy} className={styles.phaseLine} />
                                <circle cx={cx} cy={cy} r="4.5" className={styles.phaseDot} />
                              </>
                            )}
                          </svg>
                        </div>
                        <span className={styles.phaseLabel}>{res.label}</span>
                        <span className={styles.phaseDegree}>{res.prob > 0.001 ? `${res.phase}°` : '0°'}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
