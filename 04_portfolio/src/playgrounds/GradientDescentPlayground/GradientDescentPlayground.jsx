import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GradientDescentPlayground.module.css';
import { FUNCTIONS, computePath } from './gradientEngine';

export default function GradientDescentPlayground({ theme, onClose, isStandalone = false }) {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [fnType, setFnType] = useState('bowl');
  const [optimizer, setOptimizer] = useState('sgd');
  const [lr, setLr] = useState(0.1);
  const [momentum, setMomentum] = useState(0.9);
  const [steps, setSteps] = useState(60);

  // Starting point (normalized within [-1, 1], mapped to actual domain bounds)
  const [startPoint, setStartPoint] = useState({ x: 1.8, y: 1.8 });
  const [path, setPath] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(200); // ms per step

  // Compute the path whenever parameters change
  useEffect(() => {
    const fn = FUNCTIONS[fnType];
    if (!fn) return;

    const computed = computePath({
      fnType,
      optimizer,
      lr,
      momentum,
      startX: startPoint.x,
      startY: startPoint.y,
      steps
    });
    setPath(computed);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [fnType, optimizer, lr, momentum, startPoint, steps]);

  // Autoplay effect
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= path.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, path, playbackSpeed]);

  // Draw contours and path on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const fn = FUNCTIONS[fnType];
    const bounds = fn.domain;

    // Helper functions to translate math coordinates to canvas pixels
    const toCanvasX = (mx) => ((mx - bounds.x[0]) / (bounds.x[1] - bounds.x[0])) * width;
    const toCanvasY = (my) => height - ((my - bounds.y[0]) / (bounds.y[1] - bounds.y[0])) * height;

    // Helper to translate canvas pixels back to math coords
    const toMathX = (cx) => bounds.x[0] + (cx / width) * (bounds.x[1] - bounds.x[0]);
    const toMathY = (cy) => bounds.y[0] + ((height - cy) / height) * (bounds.y[1] - bounds.y[0]);

    // 1. Draw contour background (dense matrix evaluation)
    const imgData = ctx.createImageData(width, height);

    // Find min and max value to normalize colors
    const maxVal = fnType === 'rosenbrock' ? 100 : fnType === 'rastrigin' ? 40 : 15;

    for (let py = 0; py < height; py += 2) {
      for (let px = 0; px < width; px += 2) {
        const mx = toMathX(px);
        const my = toMathY(py);
        const z = fn.compute(mx, my);

        const ratio = Math.min(Math.max(z / maxVal, 0), 1);

        const hue = 240 - ratio * 240;
        const s = 65;
        const l = 15 + (1 - ratio) * 20;

        const [r, g, b_val] = hslToRgb(hue / 360, s / 100, l / 100);

        for (let dy = 0; dy < 2; dy++) {
          for (let dx = 0; dx < 2; dx++) {
            const idx = ((py + dy) * width + (px + dx)) * 4;
            if (idx < imgData.data.length) {
              imgData.data[idx] = r;
              imgData.data[idx + 1] = g;
              imgData.data[idx + 2] = b_val;
              imgData.data[idx + 3] = 255;
            }
          }
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // 2. Draw contour boundary rings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    const centerCX = toCanvasX(fn.minima[0]);
    const centerCY = toCanvasY(fn.minima[1]);
    for (let r = 30; r < width; r += 40) {
      ctx.beginPath();
      ctx.arc(centerCX, centerCY, r, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // 3. Draw Global Minimum star/cross
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerCX - 8, centerCY);
    ctx.lineTo(centerCX + 8, centerCY);
    ctx.moveTo(centerCX, centerCY - 8);
    ctx.lineTo(centerCX, centerCY + 8);
    ctx.stroke();

    // 4. Draw Trajectory Path up to currentStepIndex
    const activePath = path.slice(0, currentStepIndex + 1);
    if (activePath.length > 0) {
      ctx.strokeStyle = 'var(--gold-dim)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(toCanvasX(activePath[0].x), toCanvasY(activePath[0].y));

      for (let i = 1; i < activePath.length; i++) {
        ctx.lineTo(toCanvasX(activePath[i].x), toCanvasY(activePath[i].y));
      }
      ctx.stroke();

      // Draw nodes
      activePath.forEach((pt, idx) => {
        ctx.fillStyle = idx === 0 ? '#ef4444' : idx === currentStepIndex ? '#10b981' : 'var(--cream)';
        ctx.beginPath();
        ctx.arc(toCanvasX(pt.x), toCanvasY(pt.y), idx === 0 || idx === currentStepIndex ? 5 : 3, 0, 2 * Math.PI);
        ctx.fill();
      });

      // Draw Gradient Vector Arrow at active node
      const activeNode = activePath[activePath.length - 1];
      if (activeNode) {
        const [gx, gy] = fn.gradient(activeNode.x, activeNode.y);
        // Normalize and scale gradient for visual presentation
        const mag = Math.sqrt(gx * gx + gy * gy);
        if (mag > 0.001) {
          const arrowScale = 25; // Arrow length scaling
          const dx = -(gx / mag) * arrowScale;
          const dy = -(gy / mag) * arrowScale; // point opposite to gradient (direction of update)

          const startX = toCanvasX(activeNode.x);
          const startY = toCanvasY(activeNode.y);
          const endX = startX + dx;
          const endY = startY - dy; // canvas coordinates have Y reversed

          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();

          // Arrow head
          const angle = Math.atan2(endY - startY, endX - startX);
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.moveTo(endX, endY);
          ctx.lineTo(endX - 7 * Math.cos(angle - Math.PI / 6), endY - 7 * Math.sin(angle - Math.PI / 6));
          ctx.lineTo(endX - 7 * Math.cos(angle + Math.PI / 6), endY - 7 * Math.sin(angle + Math.PI / 6));
          ctx.fill();
        }
      }
    }
  }, [fnType, path, currentStepIndex]);

  // Click on canvas to update start point
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;
    const fn = FUNCTIONS[fnType];
    const bounds = fn.domain;

    const mx = bounds.x[0] + (cx / width) * (bounds.x[1] - bounds.x[0]);
    const my = bounds.y[0] + ((height - cy) / height) * (bounds.y[1] - bounds.y[0]);

    setStartPoint({ x: mx, y: my });
  };

  const textColor = theme === 'light' ? 'var(--text)' : 'var(--cream)';

  return (
    <div className={isStandalone ? styles.standaloneContainer : styles.overlay}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Gradient Descent Visualizer</h1>
          <p>Tweak hyperparameters and watch optimization particles navigate complex cost function landscapes</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.clearBtn} onClick={() => setStartPoint({ x: 1.8, y: 1.8 })}>
            Reset Position
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
        <div className={styles.sidebar}>
          <div className={styles.sectionTitle}>Hyperparameters</div>

          <div className={styles.controlGroup}>
            <label>Loss Landscape</label>
            <select
              value={fnType}
              onChange={(e) => {
                setFnType(e.target.value);
                const fn = FUNCTIONS[e.target.value];
                setStartPoint({ x: fn.domain.x[1] * 0.7, y: fn.domain.y[1] * 0.7 });
              }}
              className={styles.selectInput}
            >
              {Object.entries(FUNCTIONS).map(([key, val]) => (
                <option key={key} value={key}>{val.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.controlGroup}>
            <label>Optimizer Algorithm</label>
            <select
              value={optimizer}
              onChange={(e) => setOptimizer(e.target.value)}
              className={styles.selectInput}
            >
              <option value="sgd">SGD (Stochastic Gradient Descent)</option>
              <option value="momentum">Classical Momentum</option>
              <option value="adam">Adam (Adaptive Moment Estimation)</option>
            </select>
          </div>

          <div className={styles.controlGroup}>
            <label>Learning Rate ($\alpha$)</label>
            <input
              type="range"
              min="0.001"
              max="0.5"
              step="0.005"
              value={lr}
              onChange={(e) => setLr(parseFloat(e.target.value))}
              className={styles.sliderInput}
            />
            <div className={styles.sliderValue}>
              <span>0.001</span>
              <strong>{lr.toFixed(3)}</strong>
              <span>0.50</span>
            </div>
          </div>

          {optimizer === 'momentum' && (
            <div className={styles.controlGroup}>
              <label>Momentum coefficient ($\beta$)</label>
              <input
                type="range"
                min="0.1"
                max="0.99"
                step="0.01"
                value={momentum}
                onChange={(e) => setMomentum(parseFloat(e.target.value))}
                className={styles.sliderInput}
              />
              <div className={styles.sliderValue}>
                <span>0.10</span>
                <strong>{momentum.toFixed(2)}</strong>
                <span>0.99</span>
              </div>
            </div>
          )}

          <div className={styles.controlGroup}>
            <label>Max Epochs / Iterations</label>
            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value, 10))}
              className={styles.sliderInput}
            />
            <div className={styles.sliderValue}>
              <span>10</span>
              <strong>{steps}</strong>
              <span>200</span>
            </div>
          </div>
        </div>

        <div className={styles.workspace}>
          <div className={styles.visualizerCard}>
            <h3>Contour Cost Surface map</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '1rem' }}>
              Click anywhere on the map to set the starting position of the optimizer. Green cross is the target minimum.
            </p>

            <div className={styles.canvasContainer} onClick={handleCanvasClick}>
              <canvas ref={canvasRef} width="500" height="500" className={styles.canvas} />
            </div>

            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <div className={styles.statValue}>
                  {path.length > 0 ? path[path.length - 1].z.toFixed(4) : 'N/A'}
                </div>
                <div className={styles.statLabel}>Final Loss Value</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>
                  {path.length} / {steps}
                </div>
                <div className={styles.statLabel}>Steps Taken</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue} style={{ color: '#10b981' }}>
                  {path.length > 0 && path[path.length - 1].z < 0.01 ? 'Converged' : 'Optimizing'}
                </div>
                <div className={styles.statLabel}>Convergence State</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// HSL to RGB conversion helper
function hslToRgb(h, s, l) {
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
