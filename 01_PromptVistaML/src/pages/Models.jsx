import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllModels, searchModels } from '../services/supabase'

/* ─── Constants ─── */
const ITEMS_PER_PAGE = 30
const PLACEHOLDER_TEXTS = [
  'Search for language models...',
  'Search for vision models...',
  'Search for coding models...',
  'Search by category...',
  'Search by model name...'
]

/* ─── Intersection observer hook ─── */
function useReveal(threshold = 0.08) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el); return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

/* ─── Model Card Component ─── */
const ModelCard = ({ model, index }) => {
  const safeModelNumber = encodeURIComponent(model.model_number)
  const [cardRef, cardVis] = useReveal(0.05)

  return (
    <div 
      ref={cardRef}
      className="h-full"
      style={{ 
        opacity: 0, 
        animation: cardVis ? `pv-up 0.6s cubic-bezier(.22,1,.36,1) ${index % 6 * 0.05}s forwards` : 'none' 
      }}
    >
      <Link to={`/models/${safeModelNumber}`} className="block h-full">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 hover:shadow-[0_15px_30px_rgba(139,92,246,0.1)] cursor-pointer group h-full flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-purple-500/10 transition-colors" />
          
          <div className="relative z-10 text-left">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors tracking-tight">
                  {model.model_name}
                </h3>
                <p className="text-[10px] font-mono text-gray-500 mt-1 uppercase tracking-widest">
                  {model.model_number}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border ${
                    model.deployment_status === 'live'
                      ? 'border-green-500/30 text-green-600 dark:text-green-400 bg-green-500/5'
                      : 'border-yellow-500/30 text-yellow-600 dark:text-yellow-400 bg-yellow-500/5'
                  }`}
                >
                  {model.deployment_status}
                </span>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">
              {model.model_description}
            </p>
          </div>

          <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 relative z-10">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold uppercase tracking-wider">
                {model.category}
              </span>

              {model.input_category && (
                <span
                  className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider border ${
                    model.input_category === 'text'
                      ? 'border-blue-500/20 text-blue-600 dark:text-blue-400 bg-blue-500/5'
                      : model.input_category === 'image'
                      ? 'border-pink-500/20 text-pink-600 dark:text-pink-400 bg-pink-500/5'
                      : 'border-orange-500/20 text-orange-600 dark:text-orange-400 bg-orange-500/5'
                  }`}
                >
                  {model.input_category}
                </span>
              )}
            </div>

            <span className="text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-widest flex items-center group-hover:translate-x-1 transition-transform">
              Open →
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

/* ─── Main Component ─── */
const Models = () => {
  const [models, setModels] = useState([])
  const [filteredModels, setFilteredModels] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [displayedSearchQuery, setDisplayedSearchQuery] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('')
  
  const inputRef = useRef(null)
  const [headerRef, headerVis] = useReveal(0.05)
  const [searchRef, searchVis] = useReveal(0.05)

  // Initial Load
  useEffect(() => {
    let active = true
    fetchAllModels().then(data => {
      if (active) {
        setModels(data)
        setFilteredModels(data)
        setIsLoading(false)
      }
    })
    return () => { active = false }
  }, [])

  // Search Logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredModels(models)
      setDisplayedSearchQuery('')
      setIsTyping(false)
      return
    }

    setIsTyping(true)
    const timeoutId = setTimeout(async () => {
      try {
        const results = await searchModels(searchQuery)
        setFilteredModels(results)
        setDisplayedSearchQuery(searchQuery)
      } catch (error) {
        console.error('Error searching:', error)
      } finally {
        setIsTyping(false)
      }
    }, 400)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, models])

  // Reset Page on Search
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Placeholder Animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_TEXTS.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (searchQuery) return
    let active = true
    let timeoutId
    const target = PLACEHOLDER_TEXTS[placeholderIndex]
    
    setDisplayedPlaceholder('')
    let idx = 0
    const type = () => {
      if (idx <= target.length && active) {
        setDisplayedPlaceholder(target.slice(0, idx))
        idx++
        timeoutId = setTimeout(type, 60)
      }
    }
    type()
    return () => { active = false; clearTimeout(timeoutId) }
  }, [placeholderIndex, searchQuery])

  const totalPages = Math.ceil(filteredModels.length / ITEMS_PER_PAGE)
  const paginatedModels = filteredModels.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative overflow-hidden pb-20">
      <div className="fixed inset-0 pv-grid pointer-events-none" />

      <header className="relative pt-20 pb-12 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div 
          ref={headerRef}
          className="max-w-7xl mx-auto px-4 text-center"
          style={{ opacity: 0, animation: headerVis ? 'pv-up .8s ease forwards' : 'none' }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-bold tracking-widest uppercase border border-purple-200 dark:border-purple-800 mb-6">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
            Model Repository
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            Explore <span className="pv-grad-text">Models</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed font-normal">
            Browse our curated collection of production-ready machine learning models, 
            each integrated with Gemini validation and structured output mapping.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div 
          ref={searchRef}
          className="mb-12 max-w-2xl mx-auto"
          style={{ opacity: 0, animation: searchVis ? 'pv-up .8s ease .1s forwards' : 'none' }}
        >
          <div className="relative group text-left">
            <div className="absolute inset-0 bg-purple-500/5 blur-xl group-focus-within:bg-purple-500/10 transition-colors" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="relative w-full pl-12 pr-10 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-none focus:outline-none focus:border-purple-500 text-gray-900 dark:text-white shadow-sm transition-all duration-300 font-medium"
              placeholder={displayedPlaceholder || 'Search models...'}
            />

            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-500 transition-colors z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center hover:text-purple-500 transition-colors z-10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          <div className="mt-4 flex items-center justify-between px-1">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
              {searchQuery ? (
                <>Found {filteredModels.length} models matching "{displayedSearchQuery || searchQuery}"</>
              ) : (
                <>Database: {models.length} Total Models</>
              )}
            </div>
            {isTyping && <div className="text-[10px] text-purple-500 font-bold animate-pulse">Filtering...</div>}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-800/50 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                <div className="flex justify-between mt-8">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedModels.map((model, idx) => (
                <ModelCard key={model.id} model={model} index={idx} />
              ))}
            </div>

            {paginatedModels.length === 0 && (
              <div className="text-center py-20 border border-dashed border-gray-200 dark:border-gray-800 bg-white/30 dark:bg-gray-900/30">
                <h3 className="text-lg font-bold text-gray-600 dark:text-gray-400">No models found</h3>
                <button onClick={() => setSearchQuery('')} className="mt-6 px-6 py-2 border border-purple-500 text-purple-500 text-xs font-black uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all">Clear Search</button>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-16 space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-200 dark:border-gray-800 disabled:opacity-30 hover:text-purple-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 border text-xs font-bold transition-all ${currentPage === i + 1 ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-200 dark:border-gray-800 text-gray-400 hover:border-purple-500 hover:text-purple-500'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-200 dark:border-gray-800 disabled:opacity-30 hover:text-purple-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
      

    </div>
  )
}

export default Models
