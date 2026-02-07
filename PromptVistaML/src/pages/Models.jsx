import { useState, useEffect, useRef } from 'react'
import { fetchAllModels, searchModels } from '../services/supabase'

const Models = () => {
  const [models, setModels] = useState([])
  const [filteredModels, setFilteredModels] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [displayedSearchQuery, setDisplayedSearchQuery] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const placeholderTexts = [
    'Search for language models...',
    'Search for vision models...',
    'Search for coding models...',
    'Search by category...',
    'Search by model name...'
  ]

  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    loadModels()
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredModels(models)
      return
    }

    const search = async () => {
      try {
        const results = await searchModels(searchQuery)
        setFilteredModels(results)
      } catch (error) {
        console.error('Error searching:', error)
        setFilteredModels(models)
      }
    }

    const timeoutId = setTimeout(search, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery, models])

  // Simplified typing effect - only for search query when user is typing
  useEffect(() => {
    if (searchQuery === displayedSearchQuery) {
      setIsTyping(false)
      return
    }

    setIsTyping(true)
    const timeoutId = setTimeout(() => {
      setDisplayedSearchQuery(searchQuery)
      setIsTyping(false)
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, displayedSearchQuery])

  // Placeholder animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (searchQuery) return // Don't show placeholder animation when user is typing

    let timeoutId
    const targetPlaceholder = placeholderTexts[placeholderIndex]

    if (displayedPlaceholder !== targetPlaceholder) {
      // Start fresh for new placeholder
      setDisplayedPlaceholder('')
      
      // Type out the new placeholder
      let index = 0
      const typePlaceholder = () => {
        if (index <= targetPlaceholder.length) {
          setDisplayedPlaceholder(targetPlaceholder.slice(0, index))
          index++
          timeoutId = setTimeout(typePlaceholder, 50)
        }
      }
      
      typePlaceholder()
    }

    return () => clearTimeout(timeoutId)
  }, [placeholderIndex, searchQuery])

  const loadModels = async () => {
    try {
      const data = await fetchAllModels()
      setModels(data)
      setFilteredModels(data)
    } catch (error) {
      console.error('Error loading models:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleInputFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const ModelCard = ({ model }) => (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-200 hover:shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
            {model.model_name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {model.model_number}
          </p>
        </div>

        <span
          className={`px-3 py-1 text-xs rounded-full ${
            model.deployment_status === 'live'
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
              : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'
          }`}
        >
          {model.deployment_status}
        </span>
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
        {model.model_description}
      </p>

      <div className="flex justify-between items-center mt-6">
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-md">
          {model.category}
        </span>

        <a
          href={`/models/${model.model_number}`}
          className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium flex items-center"
        >
          Test
          <svg
            className="w-4 h-4 ml-1 transform transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      </div>
    </div>
  )

  const LoadingCard = () => (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="animate-pulse space-y-4">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
        <div className="flex justify-between mt-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            AI Models
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore and test our collection of AI models
          </p>
        </div>

        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative" onClick={handleInputFocus}>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-12 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-transparent text-gray-900 dark:text-white"
                placeholder=""
              />

              {/* Search Icon - Always visible */}
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 0 0114 0z"
                />
              </svg>

              {/* Placeholder or search preview - position adjusted to not cover icon */}
              {!searchQuery && (
                <div className="absolute left-12 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <span className="text-gray-400 dark:text-gray-500 font-mono">
                    {displayedPlaceholder}
                    <span className="inline-block w-[2px] h-5 bg-purple-500 ml-[1px] animate-pulse"></span>
                  </span>
                </div>
              )}

              {/* Clear button when there's text */}
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setDisplayedSearchQuery('')
                    if (inputRef.current) {
                      inputRef.current.focus()
                    }
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {searchQuery ? (
              <>
                Found{' '}
                <span className="font-medium text-gray-900 dark:text-white">
                  {filteredModels.length}
                </span>{' '}
                models matching "
                <span className="font-mono text-purple-600 dark:text-purple-400">
                  {displayedSearchQuery}
                  {isTyping && (
                    <span className="inline-block w-[1px] h-3 bg-purple-500 ml-[1px] animate-pulse align-middle"></span>
                  )}
                </span>
                "
              </>
            ) : (
              <>
                Showing{' '}
                <span className="font-medium text-gray-900 dark:text-white">
                  {filteredModels.length}
                </span>{' '}
                models
              </>
            )}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        ) : filteredModels.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 max-w-md mx-auto">
              <svg
                className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No models found
              </h3>

              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {searchQuery
                  ? 'Try a different search term'
                  : 'No models available at the moment'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Models