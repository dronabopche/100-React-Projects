/**
 * Pure Javascript Feedforward Neural Network (MLP) with Backpropagation
 * designed for client-side visual classification of 2D data.
 */

export class SimpleMLP {
  constructor(layerSizes) {
    this.layerSizes = layerSizes; // e.g. [2, 4, 3, 1]
    this.weights = [];
    this.biases = [];
    
    // Initialize weights and biases (Xavier/Glorot-like initialization)
    for (let i = 0; i < layerSizes.length - 1; i++) {
      const rows = layerSizes[i + 1];
      const cols = layerSizes[i];
      
      const wMatrix = [];
      for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
          row.push((Math.random() - 0.5) * Math.sqrt(2.0 / cols));
        }
        wMatrix.push(row);
      }
      this.weights.push(wMatrix);
      
      const biasVec = Array(rows).fill(0).map(() => 0.01);
      this.biases.push(biasVec);
    }
  }

  // Activation functions
  static tanh(x) {
    return Math.tanh(x);
  }

  static dtanh(x) {
    // x is already activated (tanh(z))
    return 1 - x * x;
  }

  static sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  static dsigmoid(x) {
    // x is already activated (sigmoid(z))
    return x * (1 - x);
  }

  // Forward propagation through the network
  forward(input) {
    let current = [...input];
    const activations = [current];
    const zs = []; // Pre-activation values (optional, we can just use activations for tanh derivative)
    
    for (let i = 0; i < this.weights.length; i++) {
      const next = [];
      const w = this.weights[i];
      const b = this.biases[i];
      const rows = w.length;
      const cols = w[0].length;
      
      for (let r = 0; r < rows; r++) {
        let sum = b[r];
        for (let c = 0; c < cols; c++) {
          sum += current[c] * w[r][c];
        }
        // Use Tanh for hidden layers, Sigmoid for final classification output
        const isOutput = i === this.weights.length - 1;
        const activated = isOutput ? SimpleMLP.sigmoid(sum) : SimpleMLP.tanh(sum);
        next.push(activated);
      }
      current = next;
      activations.push(current);
    }
    
    return { output: current, activations };
  }

  // Backpropagation to compute gradients and update weights/biases
  trainStep(X, y, learningRate = 0.05) {
    let totalLoss = 0;
    
    // Accumulate gradients over batch or do single updates (stochastic gradient descent)
    for (let sampleIdx = 0; sampleIdx < X.length; sampleIdx++) {
      const input = X[sampleIdx];
      const target = y[sampleIdx]; // Single float value for binary classification [0 or 1]
      
      // 1. Forward Pass
      const { output, activations } = this.forward(input);
      const pred = output[0];
      
      // Binary Cross Entropy Loss
      const loss = - (target * Math.log(pred + 1e-15) + (1 - target) * Math.log(1 - pred + 1e-15));
      totalLoss += loss;
      
      // 2. Backpropagation
      // Delta for output layer (dsigmoid)
      // dL/dpred * dpred/dz = ((pred - target) / (pred * (1 - pred))) * (pred * (1 - pred)) = pred - target
      let deltas = [pred - target];
      
      // Backpropagate error deltas
      const allDeltas = [deltas];
      for (let i = this.weights.length - 1; i > 0; i--) {
        const nextDeltas = [];
        const w = this.weights[i];
        const prevActivations = activations[i]; // tanh outputs of hidden layer
        
        for (let c = 0; c < w[0].length; c++) {
          let error = 0;
          for (let r = 0; r < w.length; r++) {
            error += deltas[r] * w[r][c];
          }
          const derivative = SimpleMLP.dtanh(prevActivations[c]);
          nextDeltas.push(error * derivative);
        }
        deltas = nextDeltas;
        allDeltas.unshift(deltas);
      }
      
      // 3. Update Weights and Biases
      for (let i = 0; i < this.weights.length; i++) {
        const w = this.weights[i];
        const b = this.biases[i];
        const layerDeltas = allDeltas[i];
        const inputs = activations[i];
        
        for (let r = 0; r < w.length; r++) {
          const delta = layerDeltas[r];
          b[r] -= learningRate * delta;
          for (let c = 0; c < w[0].length; c++) {
            w[r][c] -= learningRate * delta * inputs[c];
          }
        }
      }
    }
    
    return totalLoss / X.length;
  }
}

// Dataset Generator utilities
export function generateDataset(type = 'xor', size = 150) {
  const X = [];
  const y = [];
  
  if (type === 'xor') {
    for (let i = 0; i < size; i++) {
      // Coordinates in [-1, 1] range
      const x1 = (Math.random() - 0.5) * 2;
      const x2 = (Math.random() - 0.5) * 2;
      
      // Add slight noise
      const noise1 = (Math.random() - 0.5) * 0.1;
      const noise2 = (Math.random() - 0.5) * 0.1;
      
      // XOR label: quadrants 1 & 3 are 1, quadrants 2 & 4 are 0
      const label = (x1 + noise1 > 0 && x2 + noise2 > 0) || (x1 + noise1 < 0 && x2 + noise2 < 0) ? 1 : 0;
      
      X.push([x1, x2]);
      y.push(label);
    }
  } else if (type === 'circle') {
    for (let i = 0; i < size; i++) {
      const r = Math.random();
      const theta = Math.random() * Math.PI * 2;
      
      let x1, x2, label;
      if (r < 0.45) {
        // Inner circle (label 0)
        x1 = Math.cos(theta) * r * 1.1;
        x2 = Math.sin(theta) * r * 1.1;
        label = 0;
      } else {
        // Outer ring (label 1)
        const outerR = 0.65 + r * 0.45;
        x1 = Math.cos(theta) * outerR;
        x2 = Math.sin(theta) * outerR;
        label = 1;
      }
      
      X.push([x1, x2]);
      y.push(label);
    }
  }
  
  return { X, y };
}
