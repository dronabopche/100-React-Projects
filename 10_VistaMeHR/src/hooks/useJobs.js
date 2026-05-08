import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getJobs, getJob, getResponses } from '../lib/db'

export function useJobs() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const { data, error } = await getJobs(user.id)
      if (error) throw error
      setJobs(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => { load() }, [load])

  return { jobs, loading, error, reload: load, setJobs }
}

export function useJob(id) {
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getJob(id).then(({ data }) => {
      setJob(data)
      setLoading(false)
    })
  }, [id])

  return { job, loading, setJob }
}

export function useResponses(jobId) {
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!jobId) return
    setLoading(true)
    const { data } = await getResponses(jobId)
    setResponses(data || [])
    setLoading(false)
  }, [jobId])

  useEffect(() => { load() }, [load])

  return { responses, loading, reload: load, setResponses }
}
