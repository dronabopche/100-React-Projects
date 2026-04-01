import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllModels, searchModels } from '../services/supabase'

const Models = () => {
  const [models, setModels] = useState([])
  const [filteredModels, setFilteredModels] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [displayedSearchQuery, setDisplayedSearchQuery] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 30

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

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, models])

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

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (searchQuery) return

    let timeoutId
    const targetPlaceholder = placeholderTexts[placeholderIndex]

    if (displayedPlaceholder !== targetPlaceholder) {
      setDisplayedPlaceholder('')

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

  const totalPages = Math.ceil(filteredModels.length / ITEMS_PER_PAGE)

  const paginatedModels = filteredModels.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const ModelCard = ({ model }) => {
    const safeModelNumber = encodeURIComponent(model.model_number)

    return (
      <Link to={`/models/${safeModelNumber}`} className="block">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-200 hover:shadow-lg cursor-pointer group h-full flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {model.model_name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {model.model_number}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  model.deployment_status === 'live'
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                    : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'
                }`}
              >
                {model.deployment_status}
              </span>

              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors opacity-0 group-hover:opacity-100"
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
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
            {model.model_description}
          </p>

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-md">
                {model.category}
              </span>

              {model.input_category && (
                <span
                  className={`px-2 py-1 text-xs rounded-md ${
                    model.input_category === 'text'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                      : model.input_category === 'image'
                      ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300'
                      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300'
                  }`}
                >
                  {model.input_category}
                </span>
              )}
            </div>

            <span className="text-purple-600 dark:text-purple-400 text-sm font-medium flex items-center group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
              Test
              <svg
                className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1"
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
            </span>
          </div>
        </div>
      </Link>
    )
  }

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
        <div className="flex justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
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
          <div className="relative group">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-12 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white shadow-sm transition-all duration-200"
              placeholder={displayedPlaceholder || 'Search models...'}
            />

            {/* Search Icon */}
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            {/* Clear Button */}
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setDisplayedSearchQuery('')
                  inputRef.current?.focus()
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          {searchQuery ? (
            <>Found {filteredModels.length} models matching "{displayedSearchQuery}"</>
          ) : (
            <>Showing {filteredModels.length} models</>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedModels.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-10 space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-2 border rounded ${
                      currentPage === i + 1
                        ? 'bg-purple-600 text-white'
                        : ''
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Next
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
