/**
 * Client-side 2-qubit Quantum State Simulator.
 * State is represented as a vector of 4 complex numbers:
 * index 0: |00>, index 1: |01>, index 2: |10>, index 3: |11>
 */

// Helper to create complex number
const comp = (r, i = 0) => ({ r, i });

// Complex number math helpers
const c_add = (c1, c2) => comp(c1.r + c2.r, c1.i + c2.i);
const c_sub = (c1, c2) => comp(c1.r - c2.r, c1.i - c2.i);
const c_mul = (c1, c2) => comp(c1.r * c2.r - c1.i * c2.i, c1.r * c2.i + c1.i * c2.r);
const c_scale = (c, s) => comp(c.r * s, c.i * s);
const c_mag2 = (c) => c.r * c.r + c.i * c.i;
const c_phase = (c) => {
  const angle = Math.atan2(c.i, c.r);
  return angle >= 0 ? angle : angle + 2 * Math.PI;
};

// 1-Qubit Gate Matrices
const GATES = {
  I: [
    [comp(1), comp(0)],
    [comp(0), comp(1)]
  ],
  X: [
    [comp(0), comp(0)],
    [comp(1), comp(0)]
  ],
  Y: [
    [comp(0), comp(0, -1)],
    [comp(0, 1), comp(0)]
  ],
  Z: [
    [comp(1), comp(0)],
    [comp(0), comp(-1)]
  ],
  H: [
    [comp(1 / Math.sqrt(2)), comp(0)],
    [comp(1 / Math.sqrt(2)), comp(0)]
  ]
};

// Apply Kronecker (tensor) product of two 2x2 matrices to get a 4x4 matrix
function tensorProduct(m1, m2) {
  const result = Array(4).fill(null).map(() => Array(4).fill(null));
  for (let r1 = 0; r1 < 2; r1++) {
    for (let c1 = 0; c1 < 2; c1++) {
      const scaleVal = m1[r1][c1];
      for (let r2 = 0; r2 < 2; r2++) {
        for (let c2 = 0; c2 < 2; c2++) {
          result[r1 * 2 + r2][c1 * 2 + c2] = c_mul(scaleVal, m2[r2][c2]);
        }
      }
    }
  }
  return result;
}

// Multiply 4x4 complex matrix by 4x1 complex state vector
function multiplyMatrixVector(matrix, vector) {
  const result = Array(4).fill(null).map(() => comp(0));
  for (let r = 0; r < 4; r++) {
    let sum = comp(0);
    for (let c = 0; c < 4; c++) {
      sum = c_add(sum, c_mul(matrix[r][c], vector[c]));
    }
    result[r] = sum;
  }
  return result;
}

// Runs the circuit step-by-step
export function runSimulation(stages) {
  // Initialize state vector to |00>
  let state = [comp(1), comp(0), comp(0), comp(0)];

  // Process each stage
  stages.forEach(stage => {
    // Check if CNOT gate is present
    const cnotGate = stage.find(g => g.type === 'CNOT');
    if (cnotGate) {
      const control = cnotGate.qubit; // 0 or 1
      const target = 1 - control;

      const nextState = Array(4).fill(null).map(() => comp(0));
      if (control === 0) {
        // Q0 is control, Q1 is target
        // |00> -> |00>, |01> -> |01>, |10> -> |11>, |11> -> |10>
        nextState[0] = state[0];
        nextState[1] = state[1];
        nextState[2] = state[3];
        nextState[3] = state[2];
      } else {
        // Q1 is control, Q0 is target
        // |00> -> |00>, |01> -> |11>, |10> -> |10>, |11> -> |01>
        nextState[0] = state[0];
        nextState[1] = state[3];
        nextState[2] = state[2];
        nextState[3] = state[1];
      }
      state = nextState;
    } else {
      // Build 1-qubit composite gate matrix
      const gateQ0 = stage.find(g => g.qubit === 0)?.type || 'I';
      const gateQ1 = stage.find(g => g.qubit === 1)?.type || 'I';

      const mQ0 = GATES[gateQ0] || GATES.I;
      const mQ1 = GATES[gateQ1] || GATES.I;

      // Composite operator: Q0 tensor Q1
      const compositeMatrix = tensorProduct(mQ0, mQ1);
      state = multiplyMatrixVector(compositeMatrix, state);
    }
  });

  // Calculate probabilities and phases for rendering
  return state.map((c, idx) => {
    const prob = c_mag2(c);
    const phase = c_phase(c);

    // Label for state index
    const label = '|' + idx.toString(2).padStart(2, '0') + '>';

    return {
      label,
      real: c.r,
      imag: c.i,
      prob: Number(prob.toFixed(4)),
      phase: Number((phase * 180 / Math.PI).toFixed(1))
    };
  });
}
