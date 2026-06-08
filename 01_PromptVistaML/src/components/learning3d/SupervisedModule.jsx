import React, { useState, useEffect, useRef } from 'react'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RefreshCw, 
  Terminal as TerminalIcon, 
  Sliders, 
  Plus, 
  Target, 
  Activity, 
  HelpCircle,
  GraduationCap,
  BookOpen,
  CheckSquare,
  Square,
  Lock,
  ChevronRight,
  Sparkles
} from 'lucide-react'

// Constants
const CANVAS_SIZE = 500

// Lessons Definition
const LESSONS = [
  {
    title: "Lesson 1: 3D Spatial Hyperplanes",
    shortDesc: "Understand how decision boundaries slice 3D coordinate space.",
    concept: "In a 3D classification task, each coordinate has 3 features $(x_1, x_2, x_3)$ plotted in space. A linear Support Vector Machine (SVM) tries to find a flat 2D plane (hyperplane) that completely splits two classes: Purple (+1) and Gold (-1). The plane is governed by: w1*x1 + w2*x2 + w3*x3 + b = 0.",
    instructions: "Inspect the spatial separation of the data. Use mouse drag inside the canvas viewport to rotate the coordinate system and look at the gap between clusters from different perspectives.",
    setupPreset: {
      datasetSize: 80,
      noise: 0.10,
      learningRate: 0.01,
      lambda: 0.05
    },
    objectives: [
      { id: "rotate", text: "Rotate the 3D viewport using mouse drag" },
      { id: "seed", text: "Generate a new separable dataset (Click 'Seed Coordinates')" }
    ]
  },
  {
    title: "Lesson 2: Stochastic Optimization",
    shortDesc: "Watch how SGD aligns weights and highlights support vectors.",
    concept: "We optimize the decision plane using Stochastic Gradient Descent (SGD). For each point, if it violates the margin boundary ($y_i(W * x_i + b) < 1$), the model rotates the weights. Points lying directly on or inside the margins are the critical 'Support Vectors' that define the plane, highlighted here with double outer rings.",
    instructions: "Start the training solver. Click 'Auto-Train' and watch the decision plane rotate and slide. Support vectors will highlight in double rings as accuracy climbs.",
    setupPreset: {
      datasetSize: 100,
      noise: 0.15,
      learningRate: 0.01,
      lambda: 0.05
    },
    objectives: [
      { id: "train", text: "Activate 'Auto-Train' to start fitting" },
      { id: "acc_90", text: "Achieve >90% training classification accuracy" }
    ]
  },
  {
    title: "Lesson 3: Hard vs. Soft Margins",
    shortDesc: "Tune regularization lambda (λ) to manage noisy overlapping data.",
    concept: "When clusters overlap, a perfect boundary is impossible. We introduce a soft-margin SVM. The regularization lambda (λ) controls the margin thickness. A tiny λ (Hard Margin) penalizes mistakes heavily, making the margin narrow and unstable. A larger λ (Soft Margin) allows some overlaps but maximizes margin thickness for better generalization.",
    instructions: "Generate overlapping data by using high noise (e.g. 0.45). Run training and adjust lambda (λ) from hard-margin (0.001) to soft-margin (0.05) to see the margin planes contract or expand.",
    setupPreset: {
      datasetSize: 120,
      noise: 0.45,
      learningRate: 0.01,
      lambda: 0.05
    },
    objectives: [
      { id: "change_lambda", text: "Switch regularization λ in dropdown (e.g. to 0.01 or 0.001)" },
      { id: "train_soft", text: "Optimize overlapping clusters for at least 50 epochs" }
    ]
  },
  {
    title: "Lesson 4: Custom Prediction Validation",
    shortDesc: "Evaluate and plot out-of-sample custom feature predictions.",
    concept: "Once the hyperplane parameters are learned, predicting a new unseen coordinate is instantaneous. We simply compute: f(x) = w1*x1 + w2*x2 + w3*x3 + b. If the score is >= 0, we predict Class +1 (Purple). If < 0, we predict Class -1 (Gold).",
    instructions: "Input coordinates inside the custom point classification form on the sandbox. Click 'Predict & Plot Point' to see its projected coordinate blink inside the 3D space.",
    setupPreset: {
      datasetSize: 80,
      noise: 0.20,
      learningRate: 0.01,
      lambda: 0.05
    },
    objectives: [
      { id: "predict_point", text: "Successfully project a manual custom test coordinate" }
    ]
  }
]

const SupervisedModule = () => {
  // --- STATE ---
  // Hyperparameters
  const [datasetSize, setDatasetSize] = useState(100)
  const [learningRate, setLearningRate] = useState(0.01)
  const [lambda, setLambda] = useState(0.05) // Regularization (C = 1/lambda)
  const [noise, setNoise] = useState(0.2) // Overlap between clusters

  // Model Parameters
  const [weights, setWeights] = useState([0.5, -0.2, 0.1])
  const [bias, setBias] = useState(-0.05)

  // Simulation State
  const [dataset, setDataset] = useState([])
  const [isTraining, setIsTraining] = useState(false)
  const [epoch, setEpoch] = useState(0)
  const [accuracy, setAccuracy] = useState(0)
  const [hingeLoss, setHingeLoss] = useState(0)
  const [terminalLogs, setTerminalLogs] = useState([])
  
  // Custom test point
  const [testPoint, setTestPoint] = useState({ x: 0.15, y: 0.25, z: -0.15 })
  const [testPrediction, setTestPrediction] = useState(null)
  const [testPointsList, setTestPointsList] = useState([])

  // UI Tab Swapper: 'lessons' or 'sandbox'
  const [rightPanelTab, setRightPanelTab] = useState('lessons')
  const [activeLessonIdx, setActiveLessonIdx] = useState(0)
  
  // Lesson objective progress tracking
  const [completedObjectives, setCompletedObjectives] = useState({})

  // 3D View Angles (Yaw & Pitch)
  const [yaw, setYaw] = useState(0.6)
  const [pitch, setPitch] = useState(0.4)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })

  // Refs
  const canvasRef = useRef(null)
  const trainingTimer = useRef(null)

  // --- INITIALIZATION ---
  useEffect(() => {
    generateNewDataset()
    addLog('System initialized. Soft-Margin Linear SVM engine ready.')
    addLog('Lessons Academy launched. Load Lesson 1 to get started.')
    // Load Lesson 1 by default
    loadLessonPreset(0)
    return () => stopTraining()
  }, [])

  // Trigger dataset regeneration on datasetSize change in manual mode
  useEffect(() => {
    if (rightPanelTab === 'sandbox') {
      generateNewDataset()
    }
  }, [datasetSize])

  // Redraw canvas whenever drawing-related state updates
  useEffect(() => {
    draw3D()
  }, [dataset, weights, bias, yaw, pitch, testPointsList])

  // Monitor objective completions Reactively
  useEffect(() => {
    const currentObjectives = LESSONS[activeLessonIdx].objectives
    
    currentObjectives.forEach(obj => {
      if (completedObjectives[obj.id]) return // Already checked

      let met = false
      if (obj.id === 'rotate') {
        // Did the user rotate? Checked via state yaw/pitch shift in mouse drag (tracked by manual flags or yaw variations)
        if (Math.abs(yaw - 0.6) > 0.15 || Math.abs(pitch - 0.4) > 0.15) met = true
      }
      if (obj.id === 'seed') {
        // Checked when user generates new coordinates
        // Handled in generateNewDataset trigger
      }
      if (obj.id === 'train') {
        if (isTraining) met = true
      }
      if (obj.id === 'acc_90') {
        if (accuracy > 90) met = true
      }
      if (obj.id === 'change_lambda') {
        // Checked when user changes lambda
        // Handled in setLambda call
      }
      if (obj.id === 'train_soft') {
        if (epoch >= 50) met = true
      }
      if (obj.id === 'predict_point') {
        if (testPointsList.length > 0) met = true
      }

      if (met) {
        completeObjective(obj.id)
      }
    })
  }, [yaw, pitch, isTraining, accuracy, epoch, lambda, testPointsList, activeLessonIdx, completedObjectives])

  // --- LOGGING ---
  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString().split(' ')[0]
    setTerminalLogs(prev => [`[${time}] ${msg}`, ...prev].slice(0, 30))
  }

  // --- OBJECTIVE STATE MODIFIER ---
  const completeObjective = (id) => {
    setCompletedObjectives(prev => {
      if (prev[id]) return prev
      addLog(`Objective Met: "${LESSONS[activeLessonIdx].objectives.find(o => o.id === id)?.text}"`)
      return { ...prev, [id]: true }
    })
  }

  // --- LESSON preset LOADER ---
  const loadLessonPreset = (idx) => {
    stopTraining()
    setActiveLessonIdx(idx)
    
    // Clear lesson objectives completion state
    setCompletedObjectives({})
    setTestPointsList([])
    setTestPrediction(null)

    const lesson = LESSONS[idx]
    const preset = lesson.setupPreset

    // Apply Preset Hyperparameters
    setDatasetSize(preset.datasetSize)
    setNoise(preset.noise)
    setLearningRate(preset.learningRate)
    setLambda(preset.lambda)

    // Generate dataset manually so we enforce the preset values instantly
    const points = []
    const half = Math.floor(preset.datasetSize / 2)
    const genCoord = (center, spread) => center + (Math.random() - 0.5) * spread

    for (let i = 0; i < half; i++) {
      points.push({
        id: `p1-${i}`,
        x: genCoord(0.35, 0.45) + (Math.random() - 0.5) * preset.noise * 0.8,
        y: genCoord(0.35, 0.45) + (Math.random() - 0.5) * preset.noise * 0.8,
        z: genCoord(0.35, 0.45) + (Math.random() - 0.5) * preset.noise * 0.8,
        label: 1
      })
    }

    for (let i = 0; i < half; i++) {
      points.push({
        id: `p2-${i}`,
        x: genCoord(-0.35, 0.45) + (Math.random() - 0.5) * preset.noise * 0.8,
        y: genCoord(-0.35, 0.45) + (Math.random() - 0.5) * preset.noise * 0.8,
        z: genCoord(-0.35, 0.45) + (Math.random() - 0.5) * preset.noise * 0.8,
        label: -1
      })
    }

    setDataset(points)
    
    // Reset weights
    const w = [
      (Math.random() - 0.5) * 0.4,
      (Math.random() - 0.5) * 0.4,
      (Math.random() - 0.5) * 0.4
    ]
    const b = (Math.random() - 0.5) * 0.1
    setWeights(w)
    setBias(b)
    setEpoch(0)
    setAccuracy(0)
    setHingeLoss(0)

    addLog(`LOADED ${lesson.title}. Preset configs loaded.`)
    addLog(`Task: ${lesson.shortDesc}`)
  }

  // --- DATA GENERATION ---
  const generateNewDataset = () => {
    const points = []
    const half = Math.floor(datasetSize / 2)

    const genCoord = (center, spread) => {
      return center + (Math.random() - 0.5) * spread
    }

    // Class +1 (Purple Cluster)
    for (let i = 0; i < half; i++) {
      points.push({
        id: `p1-${i}`,
        x: genCoord(0.35, 0.45) + (Math.random() - 0.5) * noise * 0.8,
        y: genCoord(0.35, 0.45) + (Math.random() - 0.5) * noise * 0.8,
        z: genCoord(0.35, 0.45) + (Math.random() - 0.5) * noise * 0.8,
        label: 1
      })
    }

    // Class -1 (Gold/Amber Cluster)
    for (let i = 0; i < half; i++) {
      points.push({
        id: `p2-${i}`,
        x: genCoord(-0.35, 0.45) + (Math.random() - 0.5) * noise * 0.8,
        y: genCoord(-0.35, 0.45) + (Math.random() - 0.5) * noise * 0.8,
        z: genCoord(-0.35, 0.45) + (Math.random() - 0.5) * noise * 0.8,
        label: -1
      })
    }

    setDataset(points)
    resetModelWeights()
    addLog(`Generated ${points.length} coordinates inside 3D space (Noise: ${noise.toFixed(2)})`)
    
    // Check seed coordinate objective
    if (rightPanelTab === 'lessons') {
      completeObjective('seed')
    }
  }

  // --- MODEL RESET ---
  const resetModelWeights = () => {
    const w = [
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5
    ]
    const b = (Math.random() - 0.5) * 0.2
    setWeights(w)
    setBias(b)
    setEpoch(0)
    setAccuracy(0)
    setHingeLoss(0)
    setTestPrediction(null)
    setTestPointsList([])
  }

  const handleReset = () => {
    stopTraining()
    resetModelWeights()
    addLog('Weights re-initialized. Model states wiped.')
  }

  // --- SVM SGD SOLVER ---
  const runSingleTrainingEpoch = () => {
    if (dataset.length === 0) return

    let [w1, w2, w3] = [...weights]
    let b = bias

    // Shuffle
    const shuffled = [...dataset].sort(() => Math.random() - 0.5)

    // Training pass
    shuffled.forEach(point => {
      const { x, y, z, label } = point
      const score = w1 * x + w2 * y + w3 * z + b
      const marginCondition = label * score

      if (marginCondition < 1) {
        w1 = w1 - learningRate * (2 * lambda * w1 - label * x)
        w2 = w2 - learningRate * (2 * lambda * w2 - label * y)
        w3 = w3 - learningRate * (2 * lambda * w3 - label * z)
        b = b + learningRate * label
      } else {
        w1 = w1 - learningRate * (2 * lambda * w1)
        w2 = w2 - learningRate * (2 * lambda * w2)
        w3 = w3 - learningRate * (2 * lambda * w3)
      }
    })

    // Calculate accuracy and loss
    let correct = 0
    let totalHingeLoss = 0

    dataset.forEach(point => {
      const { x, y, z, label } = point
      const score = w1 * x + w2 * y + w3 * z + b
      const prediction = score >= 0 ? 1 : -1
      
      if (prediction === label) correct++
      totalHingeLoss += Math.max(0, 1 - label * score)
    })

    const newAcc = (correct / dataset.length) * 100
    const avgHingeLoss = totalHingeLoss / dataset.length

    const wNorm = Math.sqrt(w1 * w1 + w2 * w2 + w3 * w3)
    const marginWidth = wNorm > 0 ? (2 / wNorm).toFixed(4) : 'N/A'

    setWeights([w1, w2, w3])
    setBias(b)
    setEpoch(prev => {
      const nextEpoch = prev + 1
      if (nextEpoch % 10 === 0 || nextEpoch === 1) {
        addLog(`Epoch ${nextEpoch} - Loss: ${avgHingeLoss.toFixed(4)} | Acc: ${newAcc.toFixed(1)}% | Margin Width: ${marginWidth}`)
      }
      return nextEpoch
    })
    setAccuracy(newAcc)
    setHingeLoss(avgHingeLoss)
  }

  // Training controllers
  const startTraining = () => {
    if (isTraining) return
    setIsTraining(true)
    addLog('Auto-training engine STARTED.')

    const trainLoop = () => {
      runSingleTrainingEpoch()
      trainingTimer.current = requestAnimationFrame(trainLoop)
    }
    trainingTimer.current = requestAnimationFrame(trainLoop)
  }

  const stopTraining = () => {
    setIsTraining(false)
    if (trainingTimer.current) {
      cancelAnimationFrame(trainingTimer.current)
      trainingTimer.current = null
      addLog('Auto-training engine PAUSED.')
    }
  }

  const toggleTraining = () => {
    if (isTraining) {
      stopTraining()
    } else {
      startTraining()
    }
  }

  // --- MANUAL TEST PREDICTION ---
  const handleTestPointClassify = (e) => {
    e.preventDefault()
    const { x, y, z } = testPoint
    const [w1, w2, w3] = weights
    
    const score = w1 * x + w2 * y + w3 * z + bias
    const prediction = score >= 0 ? 1 : -1
    setTestPrediction(prediction)

    const newPoint = {
      id: `test-${Date.now()}`,
      x, y, z,
      label: prediction,
      isTest: true
    }

    setTestPointsList(prev => [...prev, newPoint])
    addLog(`Custom Coordinate Classification: [${x}, ${y}, ${z}] -> ${prediction === 1 ? 'Purple (+1)' : 'Gold (-1)'}`)
  }

  // --- 3D CANVAS RENDERING ENGINE (Trigonometric projection) ---
  const draw3D = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    
    // Clear viewport
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    const cx = CANVAS_SIZE / 2
    const cy = CANVAS_SIZE / 2
    const dCamera = 2.4

    // 3D rotation projection mapping
    const project = (x, y, z) => {
      const cosY = Math.cos(yaw)
      const sinY = Math.sin(yaw)
      const xRotY = x * cosY - z * sinY
      const zRotY = x * sinY + z * cosY

      const cosP = Math.cos(pitch)
      const sinP = Math.sin(pitch)
      const yRotP = y * cosP - zRotY * sinP
      const zRotP = y * sinP + zRotY * cosP

      const zoom = 230
      const perspectiveScale = zoom / (dCamera + zRotP)
      
      const screenX = cx + xRotY * perspectiveScale
      const screenY = cy - yRotP * perspectiveScale

      return {
        x: screenX,
        y: screenY,
        depth: zRotP,
        visible: (dCamera + zRotP) > 0.1
      }
    }

    const renderQueue = []

    // 1. Plot Axes Lines
    const addAxisLine = (start, end, color, label, labelPos) => {
      renderQueue.push({
        type: 'line',
        start,
        end,
        color,
        lineWidth: 1.5,
        isDashed: true,
        label,
        labelPos,
        depth: (project(start.x, start.y, start.z).depth + project(end.x, end.y, end.z).depth) / 2
      })
    }

    addAxisLine({ x: -0.9, y: 0, z: 0 }, { x: 0.9, y: 0, z: 0 }, '#ef4444', 'x1 (x)', { x: 0.95, y: 0, z: 0 })
    addAxisLine({ x: 0, y: -0.9, z: 0 }, { x: 0, y: 0.9, z: 0 }, '#22c55e', 'x2 (y)', { x: 0, y: 0.95, z: 0 })
    addAxisLine({ x: 0, y: 0, z: -0.9 }, { x: 0, y: 0, z: 0.9 }, '#3b82f6', 'x3 (z)', { x: 0, y: 0, z: 0.95 })

    // 2. Wireframe Bounding Box
    const addBoundingBox = () => {
      const corners = [
        { x: -0.8, y: -0.8, z: -0.8 }, { x: 0.8, y: -0.8, z: -0.8 },
        { x: 0.8, y: 0.8, z: -0.8 }, { x: -0.8, y: 0.8, z: -0.8 },
        { x: -0.8, y: -0.8, z: 0.8 }, { x: 0.8, y: -0.8, z: 0.8 },
        { x: 0.8, y: 0.8, z: 0.8 }, { x: -0.8, y: 0.8, z: 0.8 }
      ]

      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
      ]

      edges.forEach(([sIdx, eIdx]) => {
        const start = corners[sIdx]
        const end = corners[eIdx]
        renderQueue.push({
          type: 'line',
          start,
          end,
          color: 'rgba(156, 163, 175, 0.15)',
          lineWidth: 1,
          isDashed: false,
          depth: (project(start.x, start.y, start.z).depth + project(end.x, end.y, end.z).depth) / 2
        })
      })
    }
    addBoundingBox()

    // 3. Draw Hyperplane & Margins
    const [w1, w2, w3] = weights
    const addSVMPlane = (offset, colorFill, colorStroke, isDashed = false) => {
      let wMax = Math.max(Math.abs(w1), Math.abs(w2), Math.abs(w3))
      if (wMax < 1e-4) return

      let quadCorners = []
      const limit = 0.75

      if (wMax === Math.abs(w2)) {
        const calcY = (x, z) => (offset - bias - w1 * x - w3 * z) / w2
        quadCorners = [
          { x: -limit, y: calcY(-limit, -limit), z: -limit },
          { x: limit, y: calcY(limit, -limit), z: -limit },
          { x: limit, y: calcY(limit, limit), z: limit },
          { x: -limit, y: calcY(-limit, limit), z: limit }
        ]
      } else if (wMax === Math.abs(w1)) {
        const calcX = (y, z) => (offset - bias - w2 * y - w3 * z) / w1
        quadCorners = [
          { x: calcX(-limit, -limit), y: -limit, z: -limit },
          { x: calcX(limit, -limit), y: limit, z: -limit },
          { x: calcX(limit, limit), y: limit, z: limit },
          { x: calcX(-limit, limit), y: -limit, z: limit }
        ]
      } else {
        const calcZ = (x, y) => (offset - bias - w1 * x - w2 * y) / w3
        quadCorners = [
          { x: -limit, y: -limit, z: calcZ(-limit, -limit) },
          { x: limit, y: -limit, z: calcZ(limit, -limit) },
          { x: limit, y: limit, z: calcZ(limit, limit) },
          { x: -limit, y: limit, z: calcZ(-limit, limit) }
        ]
      }

      const clampCorner = (pt) => ({
        x: Math.max(-0.85, Math.min(0.85, pt.x)),
        y: Math.max(-0.85, Math.min(0.85, pt.y)),
        z: Math.max(-0.85, Math.min(0.85, pt.z))
      })

      const clampedCorners = quadCorners.map(clampCorner)
      const depthsSum = clampedCorners.reduce((acc, pt) => acc + project(pt.x, pt.y, pt.z).depth, 0)
      const avgDepth = depthsSum / 4

      renderQueue.push({
        type: 'plane',
        corners: clampedCorners,
        colorFill,
        colorStroke,
        isDashed,
        depth: avgDepth
      })
    }

    addSVMPlane(0, 'rgba(109, 40, 217, 0.12)', 'rgba(109, 40, 217, 0.7)', false) // Decision Hyperplane
    addSVMPlane(1, 'rgba(109, 40, 217, 0.02)', 'rgba(139, 92, 246, 0.3)', true) // Positive Margin
    addSVMPlane(-1, 'rgba(109, 40, 217, 0.02)', 'rgba(139, 92, 246, 0.3)', true) // Negative Margin

    // 4. Project Data Points
    const allPoints = [...dataset, ...testPointsList]
    allPoints.forEach(pt => {
      const score = w1 * pt.x + w2 * pt.y + w3 * pt.z + bias
      const projPt = project(pt.x, pt.y, pt.z)
      const isSupportVector = !pt.isTest && Math.abs(pt.label * score) <= 1.05

      renderQueue.push({
        type: 'point',
        point: pt,
        proj: projPt,
        isSupportVector,
        depth: projPt.depth
      })
    })

    // Painter's algorithm sort
    renderQueue.sort((a, b) => b.depth - a.depth)

    // Draw frame
    renderQueue.forEach(item => {
      if (item.type === 'line') {
        const startProj = project(item.start.x, item.start.y, item.start.z)
        const endProj = project(item.end.x, item.end.y, item.end.z)

        if (!startProj.visible || !endProj.visible) return

        ctx.beginPath()
        ctx.moveTo(startProj.x, startProj.y)
        ctx.lineTo(endProj.x, endProj.y)
        ctx.strokeStyle = item.color
        ctx.lineWidth = item.lineWidth
        if (item.isDashed) ctx.setLineDash([4, 4])
        else ctx.setLineDash([])
        ctx.stroke()
        ctx.setLineDash([])

        if (item.label && item.labelPos) {
          const lblProj = project(item.labelPos.x, item.labelPos.y, item.labelPos.z)
          ctx.fillStyle = item.color
          ctx.font = 'bold 9px monospace'
          ctx.fillText(item.label, lblProj.x - 10, lblProj.y + 4)
        }
      }

      if (item.type === 'plane') {
        const projected = item.corners.map(c => project(c.x, c.y, c.z))
        if (projected.some(p => !p.visible)) return

        ctx.beginPath()
        ctx.moveTo(projected[0].x, projected[0].y)
        for (let i = 1; i < projected.length; i++) {
          ctx.lineTo(projected[i].x, projected[i].y)
        }
        ctx.closePath()
        ctx.fillStyle = item.colorFill
        ctx.fill()

        ctx.strokeStyle = item.colorStroke
        ctx.lineWidth = item.isDashed ? 1 : 2
        if (item.isDashed) ctx.setLineDash([3, 5])
        else ctx.setLineDash([])
        ctx.stroke()
        ctx.setLineDash([])

        // Tech grid lines overlay on separating plane
        if (!item.isDashed) {
          ctx.strokeStyle = 'rgba(109, 40, 217, 0.15)'
          ctx.lineWidth = 0.5
          const steps = 6
          for (let step = 1; step < steps; step++) {
            const ratio = step / steps
            
            const pA1 = {
              x: item.corners[0].x + (item.corners[1].x - item.corners[0].x) * ratio,
              y: item.corners[0].y + (item.corners[1].y - item.corners[0].y) * ratio,
              z: item.corners[0].z + (item.corners[1].z - item.corners[0].z) * ratio
            }
            const pA2 = {
              x: item.corners[3].x + (item.corners[2].x - item.corners[3].x) * ratio,
              y: item.corners[3].y + (item.corners[2].y - item.corners[3].y) * ratio,
              z: item.corners[3].z + (item.corners[2].z - item.corners[3].z) * ratio
            }
            const projA1 = project(pA1.x, pA1.y, pA1.z)
            const projA2 = project(pA2.x, pA2.y, pA2.z)

            ctx.beginPath()
            ctx.moveTo(projA1.x, projA1.y)
            ctx.lineTo(projA2.x, projA2.y)
            ctx.stroke()

            const pB1 = {
              x: item.corners[0].x + (item.corners[3].x - item.corners[0].x) * ratio,
              y: item.corners[0].y + (item.corners[3].y - item.corners[0].y) * ratio,
              z: item.corners[0].z + (item.corners[3].z - item.corners[0].z) * ratio
            }
            const pB2 = {
              x: item.corners[1].x + (item.corners[2].x - item.corners[1].x) * ratio,
              y: item.corners[1].y + (item.corners[2].y - item.corners[1].y) * ratio,
              z: item.corners[1].z + (item.corners[2].z - item.corners[1].z) * ratio
            }
            const projB1 = project(pB1.x, pB1.y, pB1.z)
            const projB2 = project(pB2.x, pB2.y, pB2.z)

            ctx.beginPath()
            ctx.moveTo(projB1.x, projB1.y)
            ctx.lineTo(projB2.x, projB2.y)
            ctx.stroke()
          }
        }
      }

      if (item.type === 'point') {
        const { proj, point, isSupportVector } = item
        if (!proj.visible) return

        ctx.beginPath()
        
        if (point.isTest) {
          const pulse = 2 * Math.sin(Date.now() * 0.01)
          const radius = 6 + pulse
          ctx.arc(proj.x, proj.y, radius, 0, 2 * Math.PI)
          ctx.fillStyle = point.label === 1 ? '#a78bfa' : '#fbbf24'
          ctx.fill()
          ctx.lineWidth = 2
          ctx.strokeStyle = '#ef4444'
          ctx.stroke()

          ctx.fillStyle = '#ef4444'
          ctx.font = 'bold 9px monospace'
          ctx.fillText('MANUAL_TEST', proj.x + 8, proj.y - 4)
        } else {
          const radius = isSupportVector ? 5 : 4
          ctx.arc(proj.x, proj.y, radius, 0, 2 * Math.PI)
          ctx.fillStyle = point.label === 1 ? '#6d28d9' : '#d97706'
          ctx.fill()

          if (isSupportVector) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)'
            ctx.lineWidth = 1.2
            ctx.stroke()
            
            ctx.strokeStyle = point.label === 1 ? '#a78bfa' : '#facc15'
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.arc(proj.x, proj.y, radius + 2, 0, 2 * Math.PI)
            ctx.stroke()
          } else {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
    })
  }

  // Mouse handlers for rotation dragging
  const handleMouseDown = (e) => {
    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y

    const sensitivity = 0.008
    setYaw(prev => prev + dx * sensitivity)
    setPitch(prev => Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, prev - dy * sensitivity)))

    dragStart.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left font-mono">
      
      {/* ─── LEFT PANEL: Viewport & Core Metrics (7 columns) ─── */}
      <div className="lg:col-span-7 flex flex-col space-y-6">
        
        {/* Canvas Display Viewport Card */}
        <div className="boxy-card bg-white dark:bg-[#0c0c10] border-gray-200 dark:border-gray-800 p-4 relative overflow-hidden select-none">
          <div className="absolute top-2 left-2 flex items-center space-x-1.5 px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-[9px] font-bold text-purple-600 dark:text-purple-400">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping" />
            <span>3D VIEWPORT: ACTIVE SIMULATOR</span>
          </div>

          <div className="absolute top-2 right-2 flex items-center space-x-2 text-[9px] text-gray-400">
            <span>Yaw: {yaw.toFixed(2)}</span>
            <span>|</span>
            <span>Pitch: {pitch.toFixed(2)}</span>
          </div>

          {/* Interactive HTML5 Canvas */}
          <div className="flex justify-center items-center py-4 bg-gray-50/50 dark:bg-black/30 border border-dashed border-gray-100 dark:border-gray-900/60 cursor-grab active:cursor-grabbing">
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="max-w-full h-auto aspect-square"
            />
          </div>

          <p className="text-[10px] text-gray-500 text-center mt-2 uppercase tracking-wider">
            🖱️ Click and drag inside the viewport to rotate coordinates in 3D perspective
          </p>
        </div>

        {/* Model Metrics & Play Controls Bar */}
        <div className="boxy-card bg-white dark:bg-[#0c0c10] border-gray-200 dark:border-gray-800 p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTraining}
              className={`px-5 py-2 flex items-center space-x-2 font-bold text-xs uppercase cursor-pointer border ${
                isTraining 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20' 
                  : 'bg-purple-600 border-purple-600 text-white hover:bg-purple-700 hover:border-purple-700'
              }`}
            >
              {isTraining ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Training</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Auto-Train</span>
                </>
              )}
            </button>

            <button
              onClick={runSingleTrainingEpoch}
              disabled={isTraining}
              className="px-4 py-2 border border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 text-xs font-bold uppercase transition disabled:opacity-40"
            >
              Step Epoch
            </button>

            <button
              onClick={handleReset}
              className="p-2 border border-gray-200 dark:border-gray-800 hover:text-red-500 hover:border-red-500/30 transition text-gray-500"
              title="Reset weights and biases"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-6 text-xs border-l border-gray-100 dark:border-gray-900 pl-6">
            <div>
              <div className="text-[9px] text-gray-400 uppercase">Epoch</div>
              <div className="font-bold text-gray-900 dark:text-white">{epoch}</div>
            </div>
            <div>
              <div className="text-[9px] text-gray-400 uppercase">Accuracy</div>
              <div className="font-bold text-purple-600 dark:text-purple-400">{accuracy.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-[9px] text-gray-400 uppercase">Hinge Loss</div>
              <div className="font-bold text-amber-500">{hingeLoss.toFixed(4)}</div>
            </div>
          </div>
        </div>

      </div>

      {/* ─── RIGHT PANEL: Lessons Academy & Manual Sandbox Tabs (5 columns) ─── */}
      <div className="lg:col-span-5 flex flex-col space-y-6">
        
        {/* Core Swapper Tab System */}
        <div className="boxy-card bg-white dark:bg-[#0c0c10] border-gray-200 dark:border-gray-800 flex flex-col">
          <div className="grid grid-cols-2 border-b border-gray-100 dark:border-gray-900">
            <button
              onClick={() => setRightPanelTab('lessons')}
              className={`py-3 text-center text-xs font-bold uppercase tracking-wider transition-colors ${
                rightPanelTab === 'lessons'
                  ? 'bg-purple-500/5 text-purple-600 dark:text-purple-400 border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className="flex items-center justify-center space-x-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Lessons Academy</span>
              </span>
            </button>
            <button
              onClick={() => setRightPanelTab('sandbox')}
              className={`py-3 text-center text-xs font-bold uppercase tracking-wider transition-colors ${
                rightPanelTab === 'sandbox'
                  ? 'bg-purple-500/5 text-purple-600 dark:text-purple-400 border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className="flex items-center justify-center space-x-2">
                <Sliders className="w-3.5 h-3.5" />
                <span>Manual Sandbox</span>
              </span>
            </button>
          </div>

          {/* TAB 1: LESSONS ACADEMY */}
          {rightPanelTab === 'lessons' && (
            <div className="p-5 space-y-5 flex flex-col">
              
              {/* Horizontal Lessons Selector */}
              <div className="grid grid-cols-4 gap-1 bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-gray-900 p-1">
                {LESSONS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadLessonPreset(idx)}
                    className={`py-2 text-center text-[10px] font-black uppercase transition-all border ${
                      activeLessonIdx === idx
                        ? 'bg-purple-600 text-white border-purple-600 shadow-[0_0_8px_rgba(147,51,234,0.3)]'
                        : 'border-transparent text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    L{idx + 1}
                  </button>
                ))}
              </div>

              {/* Lesson Core Text */}
              <div className="space-y-3">
                <div className="inline-flex items-center space-x-1.5 text-[9px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 px-2 py-0.5 bg-purple-500/10 border border-purple-500/20">
                  <GraduationCap className="w-3 h-3" />
                  <span>Module Tutorial Active</span>
                </div>

                <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">
                  {LESSONS[activeLessonIdx].title}
                </h3>
                
                <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 leading-relaxed italic">
                  "{LESSONS[activeLessonIdx].shortDesc}"
                </p>

                <div className="text-[11px] text-gray-500 leading-relaxed border-t border-gray-100 dark:border-gray-900/60 pt-2 bg-gray-50/20 dark:bg-transparent p-2.5">
                  <span className="text-gray-400 uppercase font-bold text-[9px] block mb-1">Key Machine Learning Concept:</span>
                  {LESSONS[activeLessonIdx].concept}
                </div>

                <div className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed bg-purple-500/5 border border-purple-500/10 p-3">
                  <span className="text-purple-600 dark:text-purple-400 uppercase font-black text-[9px] block mb-1">Interactive Task:</span>
                  {LESSONS[activeLessonIdx].instructions}
                </div>
              </div>

              {/* Live Objective Tracking Checklist */}
              <div className="border-t border-gray-100 dark:border-gray-900/60 pt-4 space-y-2.5">
                <span className="text-gray-400 uppercase font-black text-[9px] block">Live Lesson Objectives:</span>
                
                <div className="space-y-2">
                  {LESSONS[activeLessonIdx].objectives.map((obj) => {
                    const isDone = !!completedObjectives[obj.id]
                    return (
                      <div 
                        key={obj.id} 
                        className={`flex items-start space-x-2.5 text-[11px] p-2 border transition-all ${
                          isDone 
                            ? 'bg-purple-500/5 border-purple-500/20 text-purple-600 dark:text-purple-400 line-through decoration-purple-500/30' 
                            : 'bg-white dark:bg-black/20 border-gray-100 dark:border-gray-900 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {isDone ? (
                          <CheckSquare className="w-4 h-4 text-purple-500 shrink-0 mt-0.5 animate-bounce" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                        )}
                        <span>{obj.text}</span>
                      </div>
                    )
                  })}
                </div>

                {/* Lesson Completed Confetti Badge */}
                {LESSONS[activeLessonIdx].objectives.every(o => completedObjectives[o.id]) && (
                  <div className="p-3 bg-purple-600 border border-purple-700 text-white text-xs font-black text-center uppercase tracking-widest flex items-center justify-center space-x-2 animate-pulse">
                    <Sparkles className="w-4 h-4" />
                    <span>LESSON COMPLETE! PRESET CLEAR</span>
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: MANUAL SANDBOX OVERLAYS */}
          {rightPanelTab === 'sandbox' && (
            <div className="p-5 space-y-5">
              
              {/* Dataset coordinate sizing */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Dataset Sizing (N):</span>
                  <span className="text-purple-500 font-bold">{datasetSize} coordinate points</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="200" 
                  step="20"
                  value={datasetSize}
                  onChange={(e) => setDatasetSize(Number(e.target.value))}
                  className="w-full accent-purple-500 bg-gray-100 dark:bg-gray-800"
                />
              </div>

              {/* Coordinate boundary overlap noise */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Cluster Overlap (Noise):</span>
                  <span className="text-purple-500 font-bold">{noise.toFixed(2)}</span>
                </div>
                <input 
                  type="range" 
                  min="0.05" 
                  max="0.80" 
                  step="0.05"
                  value={noise}
                  onChange={(e) => setNoise(Number(e.target.value))}
                  className="w-full accent-purple-500 bg-gray-100 dark:bg-gray-800"
                />
              </div>

              {/* Hypers select grids */}
              <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                <div className="space-y-1.5">
                  <span className="text-gray-400 block">Learning Rate (η):</span>
                  <select 
                    value={learningRate} 
                    onChange={(e) => setLearningRate(Number(e.target.value))}
                    className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-2 focus:border-purple-500 focus:outline-none"
                  >
                    <option value={0.001}>0.001 (Slow)</option>
                    <option value={0.01}>0.01 (Standard)</option>
                    <option value={0.05}>0.05 (Fast)</option>
                    <option value={0.1}>0.10 (Aggressive)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="text-gray-400 block">Regularization (λ):</span>
                  <select 
                    value={lambda} 
                    onChange={(e) => {
                      setLambda(Number(e.target.value))
                      completeObjective('change_lambda') // objective reactive completion trigger
                    }}
                    className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-2 focus:border-purple-500 focus:outline-none"
                  >
                    <option value={0.001}>0.001 (Hard Margin)</option>
                    <option value={0.01}>0.01 (Balanced)</option>
                    <option value={0.05}>0.05 (Soft Margin)</option>
                    <option value={0.2}>0.20 (High Decay)</option>
                  </select>
                </div>
              </div>

              {/* Seed Coordinates */}
              <button
                onClick={generateNewDataset}
                className="w-full py-2.5 border border-dashed border-purple-500/40 text-purple-600 dark:text-purple-400 bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-500 transition font-bold uppercase flex items-center justify-center space-x-2 text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Seed Coordinates</span>
              </button>

              {/* Interactive classification form */}
              <div className="border-t border-gray-100 dark:border-gray-900/60 pt-4 space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-white flex items-center space-x-2">
                  <Target className="w-4 h-4 text-purple-500" />
                  <span>Manual Coordinate Classifier</span>
                </h3>

                <form onSubmit={handleTestPointClassify} className="space-y-3 text-xs">
                  <p className="text-[10px] text-gray-500 uppercase leading-relaxed">
                    Inject customized feature scalars inside the $[-0.8, 0.8]$ bounds to test prediction coordinates.
                  </p>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-gray-400 block mb-1 font-mono text-[9px] uppercase">Axis X (x1)</label>
                      <input 
                        type="number" 
                        step="0.05"
                        min="-0.8"
                        max="0.8"
                        value={testPoint.x}
                        onChange={(e) => setTestPoint(prev => ({ ...prev, x: Number(e.target.value) }))}
                        className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-1.5 text-center focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 block mb-1 font-mono text-[9px] uppercase">Axis Y (x2)</label>
                      <input 
                        type="number" 
                        step="0.05"
                        min="-0.8"
                        max="0.8"
                        value={testPoint.y}
                        onChange={(e) => setTestPoint(prev => ({ ...prev, y: Number(e.target.value) }))}
                        className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-1.5 text-center focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 block mb-1 font-mono text-[9px] uppercase">Axis Z (x3)</label>
                      <input 
                        type="number" 
                        step="0.05"
                        min="-0.8"
                        max="0.8"
                        value={testPoint.z}
                        onChange={(e) => setTestPoint(prev => ({ ...prev, z: Number(e.target.value) }))}
                        className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-1.5 text-center focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-black dark:bg-[#0c0c10] border border-gray-200 dark:border-gray-800 py-2 text-xs font-bold text-gray-900 dark:text-white uppercase hover:bg-gray-100 dark:hover:bg-gray-900 transition flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Predict & Plot Point</span>
                  </button>
                </form>

                {testPrediction !== null && (
                  <div className="border border-dashed border-gray-200 dark:border-gray-800 p-3 bg-gray-50/40 dark:bg-black/20 flex items-center justify-between text-xs">
                    <span className="text-gray-400">Class Prediction:</span>
                    <span className={`font-bold px-2 py-0.5 ${
                      testPrediction === 1 
                        ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400' 
                        : 'bg-amber-500/15 text-amber-500'
                    }`}>
                      {testPrediction === 1 ? 'Class +1 (Purple)' : 'Class -1 (Gold)'}
                    </span>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Live Mathematical Log Terminal */}
        <div className="boxy-card bg-white dark:bg-[#0c0c10] border-gray-200 dark:border-gray-800">
          <div className="w-full flex items-center justify-between p-4 font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-900">
            <span className="flex items-center space-x-2">
              <TerminalIcon className="w-4 h-4 text-purple-500" />
              <span>Supervisor Math Engine Console</span>
            </span>
          </div>

          <div className="p-4 bg-black/95 text-green-500 dark:text-green-400 h-[190px] overflow-y-auto text-[10px] leading-relaxed select-text flex flex-col-reverse font-mono border-t border-black scrollbar-thin">
            {terminalLogs.length === 0 ? (
              <div className="text-gray-600 font-mono">No events logged. Run training cycles to generate solver statistics...</div>
            ) : (
              terminalLogs.map((log, idx) => (
                <div key={idx} className="whitespace-pre-wrap font-mono truncate">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  )
}

export default SupervisedModule
