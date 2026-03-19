import { useState, useEffect } from 'react'
import { fetchComponents } from '../lib/supabase.js'
import mockData from '../data/mockData.js'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || !import.meta.env.VITE_SUPABASE_URL

/**
 * Returns { data, loading, error } for a given category.
 * Falls back to mockData if Supabase is not configured or USE_MOCK=true.
 */
export function useComponents(category) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    if (USE_MOCK) {
      setTimeout(() => {
        setData(mockData[category] || [])
        setLoading(false)
      }, 400) // simulate network delay
      return
    }

    fetchComponents(category)
      .then(rows => {
        setData(rows)
        setLoading(false)
      })
      .catch(err => {
        console.warn('Supabase fetch failed, using mock data:', err.message)
        setData(mockData[category] || [])
        setLoading(false)
        setError(err.message)
      })
  }, [category])

  return { data, loading, error }
}
