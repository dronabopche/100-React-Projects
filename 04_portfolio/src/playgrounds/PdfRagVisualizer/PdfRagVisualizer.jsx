import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import styles from './PdfRagVisualizer.module.css'
import { chunkText, buildVectorSpace, retrieveTopK } from './ragEngine'
import { useNavigate } from 'react-router-dom'

export default function PdfRagVisualizer({ theme, onClose, isStandalone = false }) {
  const navigate = useNavigate()
  // RAG States
  const [rawText, setRawText] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  
  // RAG Parameters
  const [chunkSize, setChunkSize] = useState(300)
  const [chunkOverlap, setChunkOverlap] = useState(80)
  const [kValue, setKValue] = useState(3)
  
  // Processed Data
  const [chunks, setChunks] = useState([])
  const [vectorSpace, setVectorSpace] = useState(null)
  
  // Navigation / Interactive States
  const [activeTab, setActiveTab] = useState('chunking') // 'chunking' | 'embeddings' | 'retrieval'
  const [selectedChunkId, setSelectedChunkId] = useState(0)
  const [query, setQuery] = useState('')
  const [retrievedResults, setRetrievedResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  
  // Refs
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  const [hoveredChunkId, setHoveredChunkId] = useState(null)

  // 1. Load from Cache on Mount
  useEffect(() => {
    const cachedText = localStorage.getItem('pdf_rag_rawText')
    const cachedName = localStorage.getItem('pdf_rag_fileName')
    const cachedSize = localStorage.getItem('pdf_rag_fileSize')
    
    if (cachedText && cachedName) {
      setRawText(cachedText)
      setFileName(cachedName)
      setFileSize(Number(cachedSize) || 0)
    }
  }, [])

  // 2. Re-process chunks when text, size, or overlap changes
  useEffect(() => {
    if (!rawText) {
      setChunks([])
      setVectorSpace(null)
      return
    }
    
    const calculatedChunks = chunkText(rawText, chunkSize, chunkOverlap)
    setChunks(calculatedChunks)
    
    if (calculatedChunks.length > 0) {
      const space = buildVectorSpace(calculatedChunks)
      setVectorSpace(space)
      setSelectedChunkId(0)
    } else {
      setVectorSpace(null)
    }
  }, [rawText, chunkSize, chunkOverlap])

  // 3. Clear Cache Utility
  const clearCache = () => {
    localStorage.removeItem('pdf_rag_rawText')
    localStorage.removeItem('pdf_rag_fileName')
    localStorage.removeItem('pdf_rag_fileSize')
    setRawText('')
    setFileName('')
    setFileSize(0)
    setChunks([])
    setVectorSpace(null)
    setQuery('')
    setRetrievedResults([])
  }

  // 4. PDF Extraction via CDN-loaded PDF.js
  const loadPdfJs = () => {
    return new Promise((resolve, reject) => {
      if (window.pdfjsLib) {
        resolve(window.pdfjsLib)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js'
      script.onload = () => {
        const pdfjsLib = window['pdfjs-dist/build/pdf']
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js'
        window.pdfjsLib = pdfjsLib
        resolve(pdfjsLib)
      }
      script.onerror = (err) => reject(new Error('Failed to load PDF.js engine.'))
      document.head.appendChild(script)
    })
  }

  const handleFile = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      alert('Please upload a valid PDF file.')
      return
    }
    
    setIsLoading(true)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdfjs = await loadPdfJs()
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
      
      let fullText = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map(item => item.str).join(' ')
        fullText += pageText + '\n'
      }
      
      if (!fullText.trim()) {
        throw new Error('No readable text found in this PDF.')
      }

      // Save to localStorage
      try {
        localStorage.setItem('pdf_rag_rawText', fullText)
        localStorage.setItem('pdf_rag_fileName', file.name)
        localStorage.setItem('pdf_rag_fileSize', file.size.toString())
      } catch (storageError) {
        console.warn('LocalStorage limit exceeded, proceeding in memory.')
      }
      
      setRawText(fullText)
      setFileName(file.name)
      setFileSize(file.size)
    } catch (err) {
      console.error(err)
      alert(err.message || 'Error parsing PDF.')
    } finally {
      setIsLoading(false)
    }
  }

  const onDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const onDragLeave = () => {
    setDragOver(false)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  // Query retrieval function
  const handleRetrieve = (e) => {
    e.preventDefault()
    if (!query.trim() || !vectorSpace) return
    
    setIsSearching(true)
    setTimeout(() => {
      const topK = retrieveTopK(query, vectorSpace, chunks, kValue)
      setRetrievedResults(topK)
      setIsSearching(false)
    }, 600)
  }

  // Draw 2D Embedding space Canvas
  useEffect(() => {
    if (activeTab !== 'embeddings' || !canvasRef.current || !vectorSpace) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    
    const width = rect.width
    const height = rect.height

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      
      const rootStyle = getComputedStyle(document.documentElement)
      const gold = rootStyle.getPropertyValue('--gold').trim() || '#eebb2f'
      const goldDim = rootStyle.getPropertyValue('--gold-dim').trim() || '#c0850e'
      const text = rootStyle.getPropertyValue('--text').trim() || '#e8dcc8'
      const muted = rootStyle.getPropertyValue('--muted').trim() || '#7a6448'
      const border = rootStyle.getPropertyValue('--border').trim() || '#2e200f'
      
      // Draw grid lines
      ctx.strokeStyle = border
      ctx.lineWidth = 0.5
      for (let i = 50; i < width; i += 50) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, height)
        ctx.stroke()
      }
      for (let j = 50; j < height; j += 50) {
        ctx.beginPath()
        ctx.moveTo(0, j)
        ctx.lineTo(width, j)
        ctx.stroke()
      }

      const coords = vectorSpace.coordinates
      
      // Draw links between sequential chunks to show document flow
      ctx.strokeStyle = muted + '22'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      coords.forEach((coord, i) => {
        const px = coord.x * width
        const py = coord.y * height
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      })
      ctx.stroke()

      // Draw Chunk Nodes
      coords.forEach((coord, i) => {
        const px = coord.x * width
        const py = coord.y * height
        const isSelected = i === selectedChunkId
        const isHovered = i === hoveredChunkId
        
        let dotColor = text
        let dotSize = 5
        
        if (isSelected) {
          dotColor = gold
          dotSize = 8
          // Outer gold ring
          ctx.strokeStyle = goldDim + '66'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(px, py, 14, 0, Math.PI * 2)
          ctx.stroke()
        } else if (isHovered) {
          dotColor = gold
          dotSize = 7
        }
        
        // Fill Node
        ctx.fillStyle = dotColor
        ctx.beginPath()
        ctx.arc(px, py, dotSize, 0, Math.PI * 2)
        ctx.fill()
        
        // Add ID label for selected or hovered nodes
        if (isSelected || isHovered) {
          ctx.fillStyle = text
          ctx.font = '500 11px var(--font-family-body), Georgia, serif'
          ctx.fillText(`Chunk ${i}`, px + 12, py - 4)
        }
      })
    }
    
    render()
    
    // Canvas Mouse interaction handlers
    const handleMouseMove = (e) => {
      const cRect = canvas.getBoundingClientRect()
      const mx = e.clientX - cRect.left
      const my = e.clientY - cRect.top
      
      let foundIndex = null
      const coords = vectorSpace.coordinates
      
      for (let i = 0; i < coords.length; i++) {
        const px = coords[i].x * rect.width
        const py = coords[i].y * rect.height
        const dist = Math.hypot(px - mx, py - my)
        if (dist < 12) {
          foundIndex = i
          break
        }
      }
      
      if (foundIndex !== hoveredChunkId) {
        setHoveredChunkId(foundIndex)
      }
    }
    
    const handleMouseClick = () => {
      if (hoveredChunkId !== null) {
        setSelectedChunkId(hoveredChunkId)
      }
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('click', handleMouseClick)
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('click', handleMouseClick)
    }
  }, [activeTab, vectorSpace, selectedChunkId, hoveredChunkId])

  // Render active step helper
  const getStepStatus = (stepIndex) => {
    if (!rawText) return stepIndex === 1 ? styles.stepActive : ''
    
    if (stepIndex === 1) return styles.stepDone
    if (stepIndex === 2) {
      if (activeTab === 'chunking') return styles.stepActive
      return styles.stepDone
    }
    if (stepIndex === 3) {
      if (activeTab === 'embeddings') return styles.stepActive
      if (activeTab === 'retrieval') return styles.stepDone
      return ''
    }
    if (stepIndex === 4) {
      return activeTab === 'retrieval' ? styles.stepActive : ''
    }
    return ''
  }

  // Render chunk text with overlap highlighting
  const renderChunkContent = (chunk) => {
    const { text, overlapPrev } = chunk
    
    if (overlapPrev && text.startsWith(overlapPrev)) {
      const normalPart = text.substring(overlapPrev.length)
      return (
        <>
          <span className={styles.overlapHighlight} title="Overlap with previous chunk">
            {overlapPrev}
          </span>
          {normalPart}
        </>
      )
    }
    
    return text
  }

  // Selected chunk's vector entries
  const selectedVector = vectorSpace && vectorSpace.vectors[selectedChunkId] ? vectorSpace.vectors[selectedChunkId] : {}
  const selectedVectorSorted = Object.entries(selectedVector)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)

  const textColor = theme === 'light' ? 'var(--text)' : 'var(--cream)'

  return (
    <div className={isStandalone ? styles.standaloneContainer : styles.overlay}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1>RAG Document Pipeline Visualizer</h1>
          <p>Analyze text chunking, visual vector embeddings, and search retrieval in real-time</p>
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
          {rawText && (
            <button className={styles.clearBtn} onClick={clearCache}>
              Clear Cache
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

      {/* Stepper progress indicator */}
      <div className={styles.stepper}>
        <div className={`${styles.step} ${getStepStatus(1)}`}>
          <div className={styles.stepNumber}>1</div>
          <span>Upload PDF</span>
        </div>
        <div className={`${styles.stepConnector} ${rawText ? styles.stepConnectorActive : ''}`} />
        <div className={`${styles.step} ${getStepStatus(2)}`}>
          <div className={styles.stepNumber}>2</div>
          <span>Chunking</span>
        </div>
        <div className={`${styles.stepConnector} ${rawText && activeTab !== 'chunking' ? styles.stepConnectorActive : ''}`} />
        <div className={`${styles.step} ${getStepStatus(3)}`}>
          <div className={styles.stepNumber}>3</div>
          <span>Embedding Space</span>
        </div>
        <div className={`${styles.stepConnector} ${rawText && activeTab === 'retrieval' ? styles.stepConnectorActive : ''}`} />
        <div className={`${styles.step} ${getStepStatus(4)}`}>
          <div className={styles.stepNumber}>4</div>
          <span>Top-K Retrieval</span>
        </div>
      </div>

      {/* Body Content */}
      <div className={styles.contentBody}>
        {isLoading ? (
          <div className={styles.loaderContainer}>
            <div className={styles.spinner} />
            <div className={styles.loaderText}>Extracting document text using PDF.js...</div>
          </div>
        ) : !rawText ? (
          // File Upload Screen
          <div className={styles.uploadContainer}>
            <div 
              className={`${styles.dropzone} ${dragOver ? styles.dropzoneHover : ''}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
              <h3>Upload PDF Document</h3>
              <p>Drag and drop a PDF file here, or click to browse files. The contents will be processed locally in your browser cache.</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => handleFile(e.target.files[0])} 
                accept=".pdf"
                className={styles.fileInput} 
              />
              <span className={styles.orText}>OR</span>
              <button className={styles.browseBtn} onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current.click();
              }}>
                Choose File
              </button>
            </div>
          </div>
        ) : (
          // RAG Dashboard
          <div className={styles.dashboard}>
            {/* Left Controls Bar */}
            <div className={styles.sidebar}>
              <div className={styles.sectionTitle}>Document Details</div>
              <div className={styles.fileInfoCard}>
                <div className={styles.fileName}>{fileName}</div>
                <div className={styles.fileStats}>
                  Size: {(fileSize / 1024).toFixed(1)} KB | Chunks: {chunks.length}
                </div>
              </div>

              <div className={styles.sectionTitle}>RAG Parameters</div>
              
              <div className={styles.controlGroup}>
                <div className={styles.controlLabel}>
                  <span>Chunk Size</span>
                  <span className={styles.controlValue}>{chunkSize} chars</span>
                </div>
                <input 
                  type="range" 
                  min="150" 
                  max="1000" 
                  step="50" 
                  value={chunkSize} 
                  onChange={(e) => setChunkSize(Number(e.target.value))}
                  className={styles.slider} 
                />
                <div className={styles.fileStats}>Character length for text splitting.</div>
              </div>

              <div className={styles.controlGroup}>
                <div className={styles.controlLabel}>
                  <span>Overlap Size</span>
                  <span className={styles.controlValue}>{chunkOverlap} chars</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="300" 
                  step="10" 
                  value={chunkOverlap} 
                  onChange={(e) => setChunkOverlap(Math.min(Number(e.target.value), chunkSize - 50))}
                  className={styles.slider} 
                />
                <div className={styles.fileStats}>Duplicate prefix length for window sliding.</div>
              </div>

              <div className={styles.controlGroup}>
                <div className={styles.controlLabel}>
                  <span>Retrieve K Elements</span>
                  <span className={styles.controlValue}>k = {kValue}</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="8" 
                  step="1" 
                  value={kValue} 
                  onChange={(e) => setKValue(Number(e.target.value))}
                  className={styles.slider} 
                />
                <div className={styles.fileStats}>Number of top matching chunks returned.</div>
              </div>
            </div>

            {/* Right Interactive Panel */}
            <div className={styles.workspace}>
              {/* Tab Navigation */}
              <div className={styles.tabBar}>
                <button 
                  className={`${styles.tabBtn} ${activeTab === 'chunking' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('chunking')}
                >
                  1. Document & Chunking
                </button>
                <button 
                  className={`${styles.tabBtn} ${activeTab === 'embeddings' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('embeddings')}
                >
                  2. Embedding Vector Space
                </button>
                <button 
                  className={`${styles.tabBtn} ${activeTab === 'retrieval' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('retrieval')}
                >
                  3. Query & Retrieve
                </button>
              </div>

              {/* Tab Content Panels */}
              <div className={styles.tabContent}>
                
                {/* TAB 1: CHUNKING */}
                {activeTab === 'chunking' && (
                  <div>
                    <div className={styles.chunkingIntro}>
                      <p>
                        <strong>How Chunking works:</strong> To process documents in language models, we split large texts into smaller chunks. The yellow segments show the <strong>overlap</strong> with the preceding chunk, which preserves context between adjacent segments.
                      </p>
                    </div>
                    <div className={styles.chunksGrid}>
                      {chunks.map((chunk) => (
                        <div key={chunk.id} className={styles.chunkCard}>
                          <div className={styles.chunkHeader}>
                            <span className={styles.chunkBadge}>Chunk #{chunk.id}</span>
                            <span className={styles.chunkRange}>Chars: {chunk.start}-{chunk.end}</span>
                          </div>
                          <div className={styles.chunkText}>
                            {renderChunkContent(chunk)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 2: EMBEDDINGS */}
                {activeTab === 'embeddings' && vectorSpace && (
                  <div className={styles.embeddingWorkspace}>
                    {/* 2D Cluster Canvas */}
                    <div className={styles.projectionContainer}>
                      <div className={styles.projectionTitle}>
                        <h3>Semantic Projection Space</h3>
                        <p>2D projection of TF-IDF vectors. Nearby nodes share similar keywords. Click nodes to inspect.</p>
                      </div>
                      <canvas ref={canvasRef} className={styles.projectionCanvas} />
                      <div className={styles.projectionLegend}>
                        <div className={styles.legendItem}>
                          <div className={styles.legendDot} style={{ background: 'var(--gold)' }} />
                          <span>Selected Chunk</span>
                        </div>
                        <div className={styles.legendItem}>
                          <div className={styles.legendDot} style={{ background: 'rgba(255, 255, 255, 0.4)' }} />
                          <span>Other Chunks</span>
                        </div>
                      </div>
                    </div>

                    {/* Embedding detail bar */}
                    <div className={styles.embeddingDetailPanel}>
                      <div className={styles.detailsCard}>
                        <h4>Chunk #{selectedChunkId} Vector Embedding</h4>
                        <div className={styles.fileStats} style={{ marginBottom: '0.8rem' }}>
                          Visualized weights (TF-IDF value map) for this chunk:
                        </div>
                        {/* Heatmap visualization grid */}
                        <div className={styles.vectorGrid}>
                          {Array.from({ length: 64 }).map((_, idx) => {
                            const weightVal = selectedVectorSorted[idx] ? selectedVectorSorted[idx][1] : 0
                            const alpha = Math.min(weightVal * 8, 1) // Scale for visualization
                            const color = `rgba(238, 187, 47, ${Math.max(alpha, 0.05)})`
                            return (
                              <div 
                                key={idx} 
                                className={styles.vectorCell} 
                                style={{ 
                                  backgroundColor: color, 
                                  color: '#eebb2f' 
                                }}
                                title={selectedVectorSorted[idx] ? `${selectedVectorSorted[idx][0]}: ${selectedVectorSorted[idx][1].toFixed(4)}` : 'Empty weight'}
                              />
                            )
                          })}
                        </div>

                        <div className={styles.sectionTitle} style={{ marginTop: '1.2rem', marginBottom: '0.6rem' }}>
                          Top Vocabulary Weights
                        </div>
                        <div className={styles.vectorScrollList}>
                          {selectedVectorSorted.length > 0 ? (
                            selectedVectorSorted.map(([word, val]) => (
                              <div key={word} className={styles.vectorRow}>
                                <span className={styles.vectorWord}>{word}</span>
                                <span className={styles.vectorValue}>{val.toFixed(4)}</span>
                              </div>
                            ))
                          ) : (
                            <div className={styles.fileStats} style={{ textAlign: 'center', padding: '1rem' }}>
                              No significant term frequencies found.
                            </div>
                          )}
                        </div>
                      </div>

                      <div className={styles.detailsCard}>
                        <h4>Chunk Text Preview</h4>
                        <p className={styles.chunkText} style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                          {chunks[selectedChunkId]?.text}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: RETRIEVAL */}
                {activeTab === 'retrieval' && (
                  <div className={styles.retrievalContainer}>
                    <form onSubmit={handleRetrieve} className={styles.queryBox}>
                      <div className={styles.sectionTitle}>Vector Query Engine</div>
                      <div className={styles.searchBar}>
                        <input 
                          type="text" 
                          placeholder="Ask a question about the document..." 
                          value={query} 
                          onChange={(e) => setQuery(e.target.value)}
                          className={styles.queryInput}
                        />
                        <button 
                          type="submit" 
                          className={`${styles.retrieveBtn} ${!query.trim() || isSearching ? styles.retrieveBtnDisabled : ''}`}
                          disabled={!query.trim() || isSearching}
                        >
                          {isSearching ? 'Retrieving...' : 'Search'}
                        </button>
                      </div>
                      <p className={styles.retrievalExplanation}>
                        The search query is tokenized and embedded into the same vector space. Cosine Similarity is calculated between the query vector and all chunk vectors. The top K results are retrieved based on their scores.
                      </p>
                    </form>

                    <div className={styles.resultsSection}>
                      <h3>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                        </svg>
                        Retrieved Chunks (k = {kValue})
                      </h3>

                      {retrievedResults.length > 0 ? (
                        <div className={styles.resultsList}>
                          {retrievedResults.map((result, idx) => (
                            <div key={result.id} className={styles.resultCard}>
                              <div className={result.scoreWrapper}>
                                <div className={styles.resultMeta}>
                                  <span className={styles.resultRank}>{idx + 1}</span>
                                  <span className={styles.resultId}>Chunk #{result.id}</span>
                                </div>
                                <div className={scoreWrapper}>
                                  <span className={styles.scoreLabel}>Similarity Score:</span>
                                  <span className={styles.scoreValue}>{result.score}</span>
                                  <div className={styles.scoreBarBg}>
                                    <div 
                                      className={styles.scoreBarFill} 
                                      style={{ width: `${Math.max(result.score * 100, 0)}%` }} 
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className={styles.chunkText}>
                                {result.text}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={styles.noResults}>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <p>Enter a query above to calculate cosine similarity and retrieve matching nodes.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const scoreWrapper = styles.scoreWrapper
