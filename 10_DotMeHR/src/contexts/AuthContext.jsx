import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

const DEMO_USER = {
  id: 'demo-user',
  email: 'demo@hireadstore.ai',
  user_metadata: { full_name: 'Demo HR Manager' },
  isDemo: true,
}

export const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL || ''
  return url && url !== 'https://placeholder.supabase.co' && !url.includes('placeholder') && url.startsWith('https://')
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDemoMode] = useState(!isSupabaseConfigured())

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      const saved = localStorage.getItem('hireadstore_demo_session')
      if (saved) setUser(DEMO_USER)
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const demoSignIn = () => {
    localStorage.setItem('hireadstore_demo_session', '1')
    setUser(DEMO_USER)
  }
  const demoSignOut = () => {
    localStorage.removeItem('hireadstore_demo_session')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, isDemoMode, demoSignIn, demoSignOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}

export { DEMO_USER }
