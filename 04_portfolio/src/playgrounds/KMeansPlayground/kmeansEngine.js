/**
 * Client-side K-Means Clustering algorithm step simulator.
 */

// Helper to compute Euclidean distance
export function euclideanDistance(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

// Generate random points in 2D space [0.1, 0.9]
export function generateRandomPoints(count = 80) {
  const points = [];
  // Generate points in 3 distinct clusters to make k-means visual clustering beautiful
  const centers = [
    { x: 0.3, y: 0.3 },
    { x: 0.7, y: 0.3 },
    { x: 0.5, y: 0.7 },
  ];
  
  for (let i = 0; i < count; i++) {
    const center = centers[Math.floor(Math.random() * centers.length)];
    // Add Gaussian-like noise around the center
    const r = Math.random() * 0.15;
    const theta = Math.random() * Math.PI * 2;
    
    const x = Math.min(Math.max(center.x + Math.cos(theta) * r, 0.05), 0.95);
    const y = Math.min(Math.max(center.y + Math.sin(theta) * r, 0.05), 0.95);
    
    points.push({
      id: i,
      x,
      y,
      centroidId: -1, // Unassigned
    });
  }
  
  return points;
}

// Initialize K centroids at random point locations or space points
export function initializeCentroids(k, points) {
  const centroids = [];
  if (points.length >= k) {
    // Pick unique random points to avoid duplicate initial centroids
    const indices = new Set();
    while (indices.size < k) {
      indices.add(Math.floor(Math.random() * points.length));
    }
    indices.forEach(idx => {
      centroids.push({
        x: points[idx].x,
        y: points[idx].y,
        prevX: points[idx].x,
        prevY: points[idx].y,
      });
    });
  } else {
    // Fallback if not enough points
    for (let i = 0; i < k; i++) {
      centroids.push({
        x: 0.2 + Math.random() * 0.6,
        y: 0.2 + Math.random() * 0.6,
        prevX: 0.5,
        prevY: 0.5,
      });
    }
  }
  return centroids;
}

// STEP 1: Assign each point to its nearest centroid
export function assignPointsToCentroids(points, centroids) {
  if (centroids.length === 0) return points;
  
  return points.map(point => {
    let minDistance = Infinity;
    let closestCentroidId = -1;
    
    centroids.forEach((centroid, cIdx) => {
      const dist = euclideanDistance(point, centroid);
      if (dist < minDistance) {
        minDistance = dist;
        closestCentroidId = cIdx;
      }
    });
    
    return {
      ...point,
      centroidId: closestCentroidId,
    };
  });
}

// STEP 2: Update centroid coordinates based on mean coordinates of assigned points
// Returns { updatedCentroids, isConverged }
export function updateCentroidPositions(points, centroids) {
  let isConverged = true;
  
  const updatedCentroids = centroids.map((centroid, cIdx) => {
    const assignedPoints = points.filter(p => p.centroidId === cIdx);
    
    if (assignedPoints.length === 0) {
      // If no points are assigned, leave centroid where it is
      return {
        ...centroid,
        prevX: centroid.x,
        prevY: centroid.y,
      };
    }
    
    // Calculate mean position
    let sumX = 0;
    let sumY = 0;
    assignedPoints.forEach(p => {
      sumX += p.x;
      sumY += p.y;
    });
    
    const newX = sumX / assignedPoints.length;
    const newY = sumY / assignedPoints.length;
    
    // Check if centroid moved significantly
    const moved = Math.hypot(newX - centroid.x, newY - centroid.y) > 0.0001;
    if (moved) {
      isConverged = false;
    }
    
    return {
      x: newX,
      y: newY,
      prevX: centroid.x,
      prevY: centroid.y,
    };
  });
  
  return {
    centroids: updatedCentroids,
    isConverged,
  };
}
export function runKMeansStep(points, centroids, currentStep) {
  // If currentStep is 'assign', assign points
  if (currentStep === 'assign') {
    const newPoints = assignPointsToCentroids(points, centroids);
    return { points: newPoints, centroids, nextStep: 'update', isConverged: false };
  } else {
    // If currentStep is 'update', update centroids
    const { centroids: newCentroids, isConverged } = updateCentroidPositions(points, centroids);
    return { points, centroids: newCentroids, nextStep: 'assign', isConverged };
  }
}
