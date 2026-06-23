// Gradient Descent functions and optimizer trajectories

export const FUNCTIONS = {
  bowl: {
    name: 'Quadratic Bowl',
    compute: (x, y) => x * x + y * y,
    gradient: (x, y) => [2 * x, 2 * y],
    domain: { x: [-3, 3], y: [-3, 3] },
    minima: [0, 0]
  },
  saddle: {
    name: 'Saddle Point',
    compute: (x, y) => x * x - y * y,
    gradient: (x, y) => [2 * x, -2 * y],
    domain: { x: [-3, 3], y: [-3, 3] },
    minima: [0, 0] // Saddle point
  },
  rosenbrock: {
    name: "Rosenbrock's Valley",
    compute: (x, y) => Math.pow(1 - x, 2) + 100 * Math.pow(y - x * x, 2),
    gradient: (x, y) => [
      -2 * (1 - x) - 400 * x * (y - x * x),
      200 * (y - x * x)
    ],
    domain: { x: [-2, 2], y: [-1, 3] },
    minima: [1, 1]
  },
  rastrigin: {
    name: 'Rastrigin Function',
    compute: (x, y) => {
      const A = 10;
      return 2 * A + (x * x - A * Math.cos(2 * Math.PI * x)) + (y * y - A * Math.cos(2 * Math.PI * y));
    },
    gradient: (x, y) => [
      2 * x + 20 * Math.PI * Math.sin(2 * Math.PI * x),
      2 * y + 20 * Math.PI * Math.sin(2 * Math.PI * y)
    ],
    domain: { x: [-4, 4], y: [-4, 4] },
    minima: [0, 0]
  }
};

export function computePath({ fnType, optimizer, lr, momentum, startX, startY, steps = 100 }) {
  const fn = FUNCTIONS[fnType];
  if (!fn) return [];

  const path = [{ x: startX, y: startY, z: fn.compute(startX, startY) }];
  let cx = startX;
  let cy = startY;

  // Optimizer state variables
  let vx = 0;
  let vy = 0; // Momentum velocity
  let sx = 0;
  let sy = 0; // Adam scale (squared gradients)
  let beta1 = 0.9;
  let beta2 = 0.999;
  let eps = 1e-8;

  for (let t = 1; t <= steps; t++) {
    const [gx, gy] = fn.gradient(cx, cy);

    // Stop if gradients explode or disappear
    if (isNaN(gx) || isNaN(gy) || Math.abs(gx) > 1000 || Math.abs(gy) > 1000) {
      break;
    }

    if (optimizer === 'sgd') {
      cx = cx - lr * gx;
      cy = cy - lr * gy;
    } else if (optimizer === 'momentum') {
      vx = momentum * vx + lr * gx;
      vy = momentum * vy + lr * gy;
      cx = cx - vx;
      cy = cy - vy;
    } else if (optimizer === 'adam') {
      // Update biased first moment estimate
      vx = beta1 * vx + (1 - beta1) * gx;
      vy = beta1 * vy + (1 - beta1) * gy;
      // Update biased second raw moment estimate
      sx = beta2 * sx + (1 - beta2) * (gx * gx);
      sy = beta2 * sy + (1 - beta2) * (gy * gy);

      // Compute bias-corrected first and second moment estimate
      const vxCorr = vx / (1 - Math.pow(beta1, t));
      const vyCorr = vy / (1 - Math.pow(beta1, t));
      const sxCorr = sx / (1 - Math.pow(beta2, t));
      const syCorr = sy / (1 - Math.pow(beta2, t));

      cx = cx - (lr * vxCorr) / (Math.sqrt(sxCorr) + eps);
      cy = cy - (lr * vyCorr) / (Math.sqrt(syCorr) + eps);
    }

    // Keep within bounds
    const bounds = fn.domain;
    if (cx < bounds.x[0] || cx > bounds.x[1] || cy < bounds.y[0] || cy > bounds.y[1]) {
      break;
    }

    path.push({ x: cx, y: cy, z: fn.compute(cx, cy) });
  }

  return path;
}
