import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { supabase } from './supabase'
import Login from './Login'
import HomePage from './HomePage'
import Dashboard from './Dashboard'
import SheetsPage from './SheetsPage'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    // Check for saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(savedTheme)
    document.documentElement.className = savedTheme
    
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session)
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', session)
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.className = newTheme
  }

  const handleLogout = async () => {
    console.log('Logging out...')
    await supabase.auth.signOut()
  }

  // Loading state
  if (loading) {
    const colors = theme === 'dark' 
      ? { primary: 'from-green-500 to-cyan-500' }
      : { primary: 'from-green-600 to-cyan-600' }
    
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme === 'dark' ? 'from-black via-gray-900 to-cyan-900/20' : 'from-white via-cyan-50 to-green-50'} ${theme === 'dark' ? 'text-white' : 'text-gray-900'} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 ${colors.primary} mx-auto mb-4`}></div>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Loading...</p>
          <p className={`text-sm ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'} mt-2`}>Preparing your journey</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        {!session && (
          <Route 
            path="*" 
            element={
              <Login 
                onLoginSuccess={() => {}} 
                theme={theme}
              />
            } 
          />
        )}
        
        {/* Protected routes */}
        {session && (
          <>
            <Route 
              path="/" 
              element={
                <HomePage 
                  session={session} 
                  onLogout={handleLogout} 
                  theme={theme} 
                  toggleTheme={toggleTheme}
                />
              } 
            />
            <Route 
              path="/sheets" 
              element={
                <SheetsPage 
                  session={session} 
                  theme={theme}
                />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <Dashboard 
                  session={session} 
                  onLogout={handleLogout} 
                  theme={theme}
                />
              } 
            />
          </>
        )}
      </Routes>
    </Router>
  )
}

export default App