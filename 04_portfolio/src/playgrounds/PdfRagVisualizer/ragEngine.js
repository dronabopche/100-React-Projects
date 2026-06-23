/**
 * Simple client-side RAG engine for parsing, chunking, embedding, and retrieval.
 */

// Helper to clean and tokenize text
export function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 1);
}

// 1. Chunking with Overlap and tracking overlap text
export function chunkText(text, chunkSize = 400, chunkOverlap = 100) {
  if (!text) return [];
  const chunks = [];
  let start = 0;
  
  while (start < text.length) {
    let end = start + chunkSize;
    if (end > text.length) {
      end = text.length;
    } else {
      // Align to word boundary (next space)
      const nextSpace = text.indexOf(' ', end);
      if (nextSpace !== -1 && nextSpace - end < 40) {
        end = nextSpace;
      }
    }
    
    const content = text.substring(start, end).trim();
    if (content.length > 0) {
      chunks.push({
        id: chunks.length,
        text: content,
        start,
        end,
      });
    }
    
    const step = chunkSize - chunkOverlap;
    if (step <= 0) {
      start += chunkSize; // Prevent infinite loop
    } else {
      start += step;
      // Align start to the nearest word boundary
      const nextSpace = text.indexOf(' ', start);
      if (nextSpace !== -1 && nextSpace - start < 30) {
        start = nextSpace + 1;
      }
    }
    
    if (start >= text.length - 1) break;
  }
  
  // Calculate specific overlap strings for visual highlights
  return chunks.map((chunk, index) => {
    let overlapPrev = '';
    let overlapNext = '';
    
    // Overlap with next chunk
    if (index < chunks.length - 1) {
      const nextChunk = chunks[index + 1];
      if (nextChunk.start < chunk.end) {
        overlapNext = text.substring(nextChunk.start, chunk.end);
      }
    }
    
    // Overlap with previous chunk
    if (index > 0) {
      const prevChunk = chunks[index - 1];
      if (chunk.start < prevChunk.end) {
        overlapPrev = text.substring(chunk.start, prevChunk.end);
      }
    }
    
    return {
      ...chunk,
      overlapPrev,
      overlapNext,
    };
  });
}

// 2. TF-IDF & Cosine Similarity Embeddings
export function buildVectorSpace(chunks) {
  // 1. Build Vocabulary
  const vocabularySet = new Set();
  const chunkTokens = chunks.map(c => {
    const tokens = tokenize(c.text);
    tokens.forEach(t => vocabularySet.add(t));
    return tokens;
  });
  
  const vocabulary = Array.from(vocabularySet);
  const N = chunks.length;
  
  // 2. Calculate Document Frequency (DF) for IDF
  const df = {};
  vocabulary.forEach(word => {
    df[word] = 0;
    chunkTokens.forEach(tokens => {
      if (tokens.includes(word)) {
        df[word]++;
      }
    });
  });
  
  // Calculate IDF
  const idf = {};
  vocabulary.forEach(word => {
    idf[word] = Math.log(1 + N / (1 + df[word]));
  });
  
  // 3. Compute TF-IDF Vectors for each chunk
  const vectors = chunks.map((chunk, idx) => {
    const tokens = chunkTokens[idx];
    const tf = {};
    tokens.forEach(word => {
      tf[word] = (tf[word] || 0) + 1;
    });
    
    // Build sparse/dense representation
    const vector = {};
    vocabulary.forEach(word => {
      const tfVal = (tf[word] || 0) / tokens.length;
      const idfVal = idf[word] || 0;
      const score = tfVal * idfVal;
      if (score > 0) {
        vector[word] = score;
      }
    });
    
    return vector;
  });
  
  // 4. Generate Random Projection matrix for 2D visualization
  // Projects V dimensions onto 2 dimensions (x, y) deterministically
  const randomProjectionMatrix = vocabulary.map((word, index) => {
    // Deterministic pseudo-random seed based on word hash
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = word.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Generate x, y coordinates between -1 and 1
    const x = Math.sin(hash + 1);
    const y = Math.cos(hash + 2);
    return { word, x, y };
  });
  
  // Project each chunk vector to 2D
  const coordinates = vectors.map(vec => {
    let x = 0;
    let y = 0;
    let sumWeights = 0;
    
    randomProjectionMatrix.forEach(proj => {
      const weight = vec[proj.word] || 0;
      if (weight > 0) {
        x += proj.x * weight;
        y += proj.y * weight;
        sumWeights += weight;
      }
    });
    
    // Default fallback if chunk has no vocabulary overlap
    if (sumWeights === 0) {
      return { x: 0.5, y: 0.5 };
    }
    
    return {
      x: x / sumWeights,
      y: y / sumWeights,
    };
  });
  
  // Normalize coordinates between 0.1 and 0.9 for canvas fitting
  let minX = Math.min(...coordinates.map(c => c.x));
  let maxX = Math.max(...coordinates.map(c => c.x));
  let minY = Math.min(...coordinates.map(c => c.y));
  let maxY = Math.max(...coordinates.map(c => c.y));
  
  const normalizedCoordinates = coordinates.map(c => {
    const normX = maxX === minX ? 0.5 : 0.1 + ((c.x - minX) / (maxX - minX)) * 0.8;
    const normY = maxY === minY ? 0.5 : 0.1 + ((c.y - minY) / (maxY - minY)) * 0.8;
    return { x: normX, y: normY };
  });
  
  return {
    vocabulary,
    idf,
    vectors,
    coordinates: normalizedCoordinates,
  };
}

// 3. Cosine Similarity & Retrieval
export function retrieveTopK(queryText, vectorSpace, chunks, k = 3) {
  if (!queryText || !vectorSpace || chunks.length === 0) return [];
  
  const { vocabulary, idf, vectors } = vectorSpace;
  const queryTokens = tokenize(queryText);
  
  // 1. Build Query Vector
  const queryTf = {};
  queryTokens.forEach(word => {
    queryTf[word] = (queryTf[word] || 0) + 1;
  });
  
  const queryVector = {};
  vocabulary.forEach(word => {
    const tfVal = (queryTf[word] || 0) / queryTokens.length;
    const idfVal = idf[word] || 0;
    const score = tfVal * idfVal;
    if (score > 0) {
      queryVector[word] = score;
    }
  });
  
  // Helper to calculate vector magnitude
  const magnitude = (vec) => {
    let sum = 0;
    Object.values(vec).forEach(val => {
      sum += val * val;
    });
    return Math.sqrt(sum);
  };
  
  const qMag = magnitude(queryVector);
  if (qMag === 0) {
    // Return empty matches if no words overlap vocabulary
    return chunks.map(chunk => ({
      ...chunk,
      score: 0,
    })).sort((a, b) => b.score - a.score).slice(0, k);
  }
  
  // 2. Compute similarity for each chunk
  const results = chunks.map((chunk, index) => {
    const chunkVector = vectors[index];
    const cMag = magnitude(chunkVector);
    
    if (cMag === 0) {
      return { ...chunk, score: 0 };
    }
    
    // Dot product
    let dotProduct = 0;
    Object.keys(queryVector).forEach(word => {
      if (chunkVector[word]) {
        dotProduct += queryVector[word] * chunkVector[word];
      }
    });
    
    const score = dotProduct / (qMag * cMag);
    
    return {
      ...chunk,
      score: Number(score.toFixed(4)),
    };
  });
  
  // Sort descending and return top K
  return results.sort((a, b) => b.score - a.score).slice(0, k);
}
