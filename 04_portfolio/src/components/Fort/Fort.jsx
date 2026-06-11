import React, { useState, useEffect, useCallback, useRef } from 'react'
import styles from './Fort.module.css'
import ChibiKing from '../ChibiKing/ChibiKing'

const GRID_SIZE = 15

// Maps: # = Wall, . = Floor, P = Player, H = Horizontal Guard, V = Vertical Guard, K = Key, J = Jewel, E = Exit
const LEVELS = [
  [
    "###############",
    "#P......#.....#",
    "#.###.###.#.#.#",
    "#.#H......#.#.#",
    "#.#.#.###.#.#.#",
    "#...#...#K#...#",
    "###.###.#.###.#",
    "#V....#...#J..#",
    "#.###.###.#.###",
    "#.#.......#...#",
    "#.#.###.###.###",
    "#K..#H........#",
    "###.#####.###.#",
    "#.........#E..#",
    "###############",
  ],
  [
    "###############",
    "#P#K........#.#",
    "#.#.###.###.#.#",
    "#.....#.#J#...#",
    "#####.#.###.###",
    "#...V.#.......#",
    "#.###.#####.#.#",
    "#.#...#K..#.#.#",
    "#.#.###.#.#.#.#",
    "#.....#.#.....#",
    "###.###.###.###",
    "#.....H.......#",
    "#.###########.#",
    "#.......H...E.#",
    "###############",
  ]
]

export default function Fort({ onClose }) {
  const [levelIdx, setLevelIdx] = useState(0)
  const [gameState, setGameState] = useState('START') // START, PLAYING, GAME_OVER, VICTORY
  const [grid, setGrid] = useState([])
  const [player, setPlayer] = useState({ x: 1, y: 1 })
  const [guards, setGuards] = useState([])
  const [keys, setKeys] = useState([])
  const [jewel, setJewel] = useState(null)
  const [exit, setExit] = useState(null)
  
  const [keysCollected, setKeysCollected] = useState(0)
  const [hasJewel, setHasJewel] = useState(false)
  
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showGuide, setShowGuide] = useState(false)

  // Use refs for state accessed in event listeners and intervals to avoid stale closures
  const stateRef = useRef({ player, grid, guards, keys, jewel, exit, keysCollected, hasJewel, gameState })
  
  useEffect(() => {
    stateRef.current = { player, grid, guards, keys, jewel, exit, keysCollected, hasJewel, gameState }
  }, [player, grid, guards, keys, jewel, exit, keysCollected, hasJewel, gameState])

  const loadLevel = (index) => {
    const map = LEVELS[index % LEVELS.length]
    let newGrid = []
    let newGuards = []
    let newKeys = []
    let newJewel = null
    let newExit = null
    let newPlayer = { x: 1, y: 1 }

    for (let y = 0; y < GRID_SIZE; y++) {
      let row = []
      for (let x = 0; x < GRID_SIZE; x++) {
        const char = map[y][x]
        if (char === '#') row.push(1)
        else row.push(0)

        if (char === 'P') newPlayer = { x, y }
        if (char === 'H') newGuards.push({ x, y, dx: 1, dy: 0, type: 'H' })
        if (char === 'V') newGuards.push({ x, y, dx: 0, dy: 1, type: 'V' })
        if (char === 'K') newKeys.push({ x, y, collected: false })
        if (char === 'J') newJewel = { x, y, collected: false }
        if (char === 'E') newExit = { x, y }
      }
      newGrid.push(row)
    }

    setGrid(newGrid)
    setPlayer(newPlayer)
    setGuards(newGuards)
    setKeys(newKeys)
    setJewel(newJewel)
    setExit(newExit)
    setKeysCollected(0)
    setHasJewel(false)
    setGameState('PLAYING')
  }

  const startGame = () => {
    setLevelIdx(0)
    loadLevel(0)
  }

  const nextLevel = () => {
    setLevelIdx(prev => prev + 1)
    loadLevel(levelIdx + 1)
  }

  // Check Line of Sight
  const checkLineOfSight = (pX, pY, gX, gY, gDx, gDy, currentGrid) => {
    // If guard moves horizontally, check horizontal LoS
    if (gDx !== 0 && pY === gY) {
      const minX = Math.min(pX, gX)
      const maxX = Math.max(pX, gX)
      // Check if player is in front of the guard (based on guard's direction)
      if ((gDx > 0 && pX > gX) || (gDx < 0 && pX < gX)) {
        let wallFound = false
        for (let x = minX + 1; x < maxX; x++) {
          if (currentGrid[gY][x] === 1) wallFound = true
        }
        if (!wallFound) return true
      }
    }
    // If guard moves vertically, check vertical LoS
    if (gDy !== 0 && pX === gX) {
      const minY = Math.min(pY, gY)
      const maxY = Math.max(pY, gY)
      if ((gDy > 0 && pY > gY) || (gDy < 0 && pY < gY)) {
        let wallFound = false
        for (let y = minY + 1; y < maxY; y++) {
          if (currentGrid[y][gX] === 1) wallFound = true
        }
        if (!wallFound) return true
      }
    }
    // Also check direct adjacent (in case they step on each other)
    if (pX === gX && pY === gY) return true

    return false
  }

  // Guard AI Loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return

    const interval = setInterval(() => {
      const { guards: currentGuards, grid: currentGrid, player: currentPlayer } = stateRef.current
      
      let spotted = false
      const updatedGuards = currentGuards.map(g => {
        let nextX = g.x + g.dx
        let nextY = g.y + g.dy
        let newDx = g.dx
        let newDy = g.dy

        // Wall collision -> reverse direction
        if (currentGrid[nextY] && currentGrid[nextY][nextX] === 1) {
          newDx = -g.dx
          newDy = -g.dy
          nextX = g.x + newDx
          nextY = g.y + newDy
        }

        if (checkLineOfSight(currentPlayer.x, currentPlayer.y, nextX, nextY, newDx, newDy, currentGrid)) {
          spotted = true
        }

        return { ...g, x: nextX, y: nextY, dx: newDx, dy: newDy }
      })

      setGuards(updatedGuards)

      if (spotted) {
        setGameState('GAME_OVER')
      }
    }, 400) // Guard speed

    return () => clearInterval(interval)
  }, [gameState])

  // Move Player Logic
  const movePlayer = useCallback((dx, dy) => {
    const { player: p, grid: g, gameState: gs, keys: kList, jewel: j, exit: ex } = stateRef.current
    if (gs !== 'PLAYING') return

    let nx = p.x + dx
    let ny = p.y + dy

    // Boundaries & Wall collision
    if (ny < 0 || ny >= GRID_SIZE || nx < 0 || nx >= GRID_SIZE) return
    if (g[ny] && g[ny][nx] === 1) return

    // Update position
    setPlayer({ x: nx, y: ny })

    // Check Key collection
    const keyIndex = kList.findIndex(k => k.x === nx && k.y === ny && !k.collected)
    if (keyIndex !== -1) {
      const newKeys = [...kList]
      newKeys[keyIndex].collected = true
      setKeys(newKeys)
      setKeysCollected(prev => prev + 1)
    }

    // Check Jewel collection
    if (j && nx === j.x && ny === j.y && !j.collected) {
      const allKeysCollected = kList.every(k => k.collected)
      if (allKeysCollected) {
        setJewel({ ...j, collected: true })
        setHasJewel(true)
      }
    }

    // Check Exit
    if (ex && nx === ex.x && ny === ex.y) {
      const isReadyToExit = stateRef.current.hasJewel || (j && nx === j.x && ny === j.y && kList.every(k => k.collected))
      if (isReadyToExit) {
        setGameState('VICTORY')
      }
    }
  }, [])

  // Player Keydown Handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      const { gameState: gs } = stateRef.current
      if (gs !== 'PLAYING') return

      let dx = 0
      let dy = 0

      if (e.key === 'ArrowUp' || e.key === 'w') dy = -1
      else if (e.key === 'ArrowDown' || e.key === 's') dy = 1
      else if (e.key === 'ArrowLeft' || e.key === 'a') dx = -1
      else if (e.key === 'ArrowRight' || e.key === 'd') dx = 1
      else return

      e.preventDefault()
      movePlayer(dx, dy)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [movePlayer])

  return (
    <div className={`${styles.modalOverlay} ${isFullscreen ? styles.fullScreen : ''}`}>
      {/* Floating Chibi King NPC inside the Fort Game Modal */}
      <ChibiKing openGame={startGame} />

      {/* Drifting embers for atmospheric background */}
      <div className={styles.ambientBackground}>
        <div className={styles.ember} style={{ left: '8%', animationDelay: '0s', animationDuration: '6s' }} />
        <div className={styles.ember} style={{ left: '22%', animationDelay: '1.2s', animationDuration: '7.5s' }} />
        <div className={styles.ember} style={{ left: '40%', animationDelay: '0.4s', animationDuration: '7s' }} />
        <div className={styles.ember} style={{ left: '58%', animationDelay: '1.8s', animationDuration: '8.5s' }} />
        <div className={styles.ember} style={{ left: '76%', animationDelay: '0.8s', animationDuration: '6.5s' }} />
        <div className={styles.ember} style={{ left: '92%', animationDelay: '2.5s', animationDuration: '8s' }} />
        <div className={styles.castleGlow} />
      </div>

      <div className={styles.modalContent}>
        {/* Navigation / Actions Bar */}
        <div className={styles.modalHeader}>
          <button className={styles.backBtn} onClick={onClose} title="Back to main portfolio">
            ← Back to Portfolio
          </button>
          
          <div className={styles.headerRight}>
            <button className={styles.guideBtn} onClick={() => setShowGuide(true)} title="View Heist Guide">
              📖 Guide
            </button>
            <button className={styles.fullScreenBtn} onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
            </button>
            <button className={styles.closeBtn} onClick={onClose} title="Close Game">✖</button>
          </div>
        </div>

        {/* Title */}
        <div className={styles.header}>
          <span className="section-label">✦ Fort Mini Game</span>
          <h2 className="section-title">Jewel Heist Escape</h2>
          <p className={styles.subtitle}>Collect all keys, steal the King's Jewel, and escape the fort.</p>
        </div>

        {/* Game Area */}
        <div className={styles.gameContainer}>
          {/* Side Panel (Stats and Dpad) */}
          <div className={styles.sidePanel}>
            <div className={styles.statsPanel}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Level</span>
                <span className={styles.statValue}>{levelIdx + 1}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Keys</span>
                <span className={styles.statValue}>{keysCollected} / {keys.length}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Royal Jewel</span>
                <span className={styles.statValue}>{hasJewel ? '💎 Secured' : '❌ Locked'}</span>
              </div>
            </div>

            {/* Virtual Controls for Mobile & Desktop clickers */}
            <div className={styles.controlsPanel}>
              <h4 className={styles.panelTitle}>Controls</h4>
              <div className={styles.dpad}>
                <div />
                <button 
                  className={styles.dpadBtn} 
                  onMouseDown={(e) => { e.preventDefault(); movePlayer(0, -1); }}
                  onTouchStart={(e) => { e.preventDefault(); movePlayer(0, -1); }}
                  title="Move Up"
                >
                  ▲
                </button>
                <div />
                
                <button 
                  className={styles.dpadBtn} 
                  onMouseDown={(e) => { e.preventDefault(); movePlayer(-1, 0); }}
                  onTouchStart={(e) => { e.preventDefault(); movePlayer(-1, 0); }}
                  title="Move Left"
                >
                  ◀
                </button>
                <div className={styles.dpadCenter}>🥷</div>
                <button 
                  className={styles.dpadBtn} 
                  onMouseDown={(e) => { e.preventDefault(); movePlayer(1, 0); }}
                  onTouchStart={(e) => { e.preventDefault(); movePlayer(1, 0); }}
                  title="Move Right"
                >
                  ▶
                </button>
                
                <div />
                <button 
                  className={styles.dpadBtn} 
                  onMouseDown={(e) => { e.preventDefault(); movePlayer(0, 1); }}
                  onTouchStart={(e) => { e.preventDefault(); movePlayer(0, 1); }}
                  title="Move Down"
                >
                  ▼
                </button>
                <div />
              </div>
              <p className={styles.dpadHint}>Click arrows or use WASD / Arrows</p>
            </div>
          </div>

          {/* Game Board */}
          <div className={styles.boardWrapper}>
            {gameState === 'START' && (
              <div className={styles.overlay}>
                <h3>Jewel Heist</h3>
                <p>Use Arrow Keys, WASD, or the D-Pad to move.</p>
                <p>1. Collect all 🗝️</p>
                <p>2. Grab the 💎</p>
                <p>3. Escape through the 🚪</p>
                <button className={styles.actionBtn} onClick={startGame}>Start Heist</button>
              </div>
            )}

            {gameState === 'GAME_OVER' && (
              <div className={styles.overlay}>
                <h3>Busted!</h3>
                <p>A guard spotted you.</p>
                <button className={styles.actionBtn} onClick={() => loadLevel(levelIdx)}>Retry Level</button>
              </div>
            )}

            {gameState === 'VICTORY' && (
              <div className={styles.overlay}>
                <h3>Level Cleared!</h3>
                <p>You escaped with the jewel.</p>
                <button className={styles.actionBtn} onClick={nextLevel}>Next Level</button>
              </div>
            )}

            <div className={styles.grid}>
              {grid.map((row, y) => (
                <div key={y} className={styles.row}>
                  {row.map((cell, x) => {
                    let isPlayer = player.x === x && player.y === y
                    let isGuard = guards.find(g => g.x === x && g.y === y)
                    let isKey = keys.find(k => k.x === x && k.y === y && !k.collected)
                    let isJewel = jewel && jewel.x === x && jewel.y === y && !jewel.collected
                    let isExit = exit && exit.x === x && exit.y === y
                    
                    return (
                      <div key={`${x}-${y}`} className={`${styles.cell} ${cell === 1 ? styles.wall : styles.floor}`}>
                        {cell === 1 ? '' : (
                          <>
                            {isExit && <span className={styles.entity} title="Exit">🚪</span>}
                            {isKey && <span className={styles.entity}>🗝️</span>}
                            {isJewel && <span className={`${styles.entity} ${styles.pulse}`}>💎</span>}
                            {isGuard && <span className={styles.entity}>💂</span>}
                            {isPlayer && <span className={`${styles.entity} ${styles.playerAnim}`}>🥷</span>}
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rules & Guide Overlay */}
        {showGuide && (
          <div className={styles.guideOverlay}>
            <div className={styles.guideCard}>
              <button className={styles.guideCloseIcon} onClick={() => setShowGuide(false)} title="Close Guide">✖</button>
              <h3 className={styles.guideTitle}>📖 Heist Instructions</h3>
              
              <div className={styles.guideScrollable}>
                <p>Welcome to the <strong>King's Fort Heist</strong>. You must navigate the maze, collect keys, secure the Royal Jewel, and exit without getting spotted by the patrolling guards.</p>
                
                <h4 className={styles.guideSubTitle}>Legend & Objectives</h4>
                <div className={styles.guideLegendGrid}>
                  <div className={styles.legendItem}><span>🥷</span> <strong>You (Thief)</strong></div>
                  <div className={styles.legendItem}><span>💂</span> <strong>Patrolling Guards</strong></div>
                  <div className={styles.legendItem}><span>🗝️</span> <strong>Keys (Required)</strong></div>
                  <div className={styles.legendItem}><span>💎</span> <strong>Royal Jewel</strong></div>
                  <div className={styles.legendItem}><span>🚪</span> <strong>Escape Portal</strong></div>
                </div>

                <h4 className={styles.guideSubTitle}>Stealth System</h4>
                <p>Guards patrol along predefined horizontal or vertical routes. They can spot you instantly if you cross their line of sight. Solid walls block their view. Avoid standing in their clear paths!</p>
                
                <h4 className={styles.guideSubTitle}>Controls</h4>
                <p><strong>Desktop:</strong> Use <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> or the <kbd>Arrow Keys</kbd> to move.</p>
                <p><strong>Mobile/Tablet:</strong> Use the on-screen Directional Pad (D-pad) next to or below the board.</p>
              </div>

              <button className={styles.guideCloseBtn} onClick={() => setShowGuide(false)}>Close Guide</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
