import { useEffect, useState } from 'react'

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('')

  // Fetch while typing (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query)
    }, 300) // delay in ms (you can change to 200/400)

    return () => clearTimeout(timer)
  }, [query, onSearch])

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
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
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search models by name, description, or category..."
          className="input-field pl-10 pr-4 py-3"
        />
      </div>
    </div>
  )
}

export default SearchBar
