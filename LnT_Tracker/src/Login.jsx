import React, { useState } from 'react'
import { supabase } from './supabase'
import { 
  Target, 
  Chrome,
  Mail,
  Lock,
  User,
  LogIn,
  UserPlus,
  Sparkles,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  ArrowLeft
} from 'lucide-react'

function Login({ onLoginSuccess, theme }) {
  const [authView, setAuthView] = useState('login') // 'login', 'signup', or 'addUser'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authSuccess, setAuthSuccess] = useState('')

  // Theme-based colors for auth page
  const getAuthColors = () => {
    if (theme === 'dark') {
      return {
        bg: 'from-black via-gray-900 to-cyan-900/20',
        primary: 'from-green-500 to-cyan-500',
        primaryLight: 'from-green-400 to-cyan-400',
        border: 'border-green-500/30',
        text: 'text-green-300',
        cardBg: 'from-black/60 to-gray-900/60',
        buttonBorder: 'border-green-500/30',
        buttonHoverBorder: 'hover:border-green-400/50'
      }
    } else {
      return {
        bg: 'from-white via-cyan-50 to-green-50',
        primary: 'from-green-600 to-cyan-600',
        primaryLight: 'from-green-500 to-cyan-500',
        border: 'border-green-400/50',
        text: 'text-green-600',
        cardBg: 'from-white/80 to-cyan-50/80',
        buttonBorder: 'border-green-400/50',
        buttonHoverBorder: 'hover:border-green-500/70'
      }
    }
  }

  const authColors = getAuthColors()

  // Reset form fields
  const resetForm = () => {
    setEmail('')
    setPassword('')
    setName('')
    setAuthError('')
    setAuthSuccess('')
  }

  // Authentication functions
  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')
    setAuthSuccess('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
    } catch (err) {
      setAuthError(err.message)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setAuthLoading(true)
    setAuthError('')
    setAuthSuccess('')

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      
      if (error) throw error
    } catch (err) {
      setAuthError(err.message)
      setAuthLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')
    setAuthSuccess('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0],
          },
        },
      })
      
      if (error) throw error
      
      // Show success message
      if (data.user) {
        setAuthSuccess('Account created successfully! Check your email for confirmation link.')
        resetForm()
        setTimeout(() => {
          setAuthView('login')
        }, 3000)
      }
      
    } catch (err) {
      setAuthError(err.message)
    } finally {
      setAuthLoading(false)
    }
  }

  // Admin: Add new user directly (without email verification)
  const handleAddNewUser = async (e) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')
    setAuthSuccess('')

    try {
      // First create the user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            email_confirm: true // Auto-confirm email
          },
          emailRedirectTo: window.location.origin
        }
      })

      if (authError) throw authError

      if (authData.user) {
        // Update user metadata
        const { error: updateError } = await supabase.auth.updateUser({
          data: { name: name }
        })

        if (updateError) console.error('Update error:', updateError)

        // Show success message
        setAuthSuccess(`User "${name}" (${email}) created successfully!`)
        resetForm()
        
        // Return to login after 3 seconds
        setTimeout(() => {
          setAuthView('login')
        }, 3000)
      }
      
    } catch (err) {
      console.error('Error adding user:', err)
      setAuthError(err.message || 'Failed to create user. Please try again.')
    } finally {
      setAuthLoading(false)
    }
  }

  // Get modal title based on view
  const getModalTitle = () => {
    switch (authView) {
      case 'login':
        return 'Welcome Back'
      case 'signup':
        return 'Create Account'
      case 'addUser':
        return 'Add New User'
      default:
        return 'LnT Tracker'
    }
  }

  // Get modal subtitle based on view
  const getModalSubtitle = () => {
    switch (authView) {
      case 'login':
        return 'Sign in to track your progress'
      case 'signup':
        return 'Create an account and begin your mastery'
      case 'addUser':
        return 'Add a new user to the system'
      default:
        return ''
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${authColors.bg}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 ${theme === 'dark' ? 'bg-green-500/10' : 'bg-green-500/5'} rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 ${theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-500/5'} rounded-full blur-3xl animate-pulse delay-1000`}></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center gap-2 p-3 bg-gradient-to-r ${authColors.primary}/10 rounded-2xl mb-4 border ${authColors.border}`}>
              <Target className={`w-10 h-10 ${authColors.text}`} />
            </div>
            <h1 className="text-4xl font-bold mb-2">
              <span className={`bg-gradient-to-r ${authColors.primary} bg-clip-text text-transparent`}>
                LnT Tracker
              </span>
            </h1>
            <p className={`${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>Green Cyan Mastery</p>
          </div>

          <div className={`bg-gradient-to-br ${authColors.cardBg} backdrop-blur-xl rounded-2xl p-8 border ${authColors.border} ${theme === 'dark' ? 'shadow-2xl shadow-green-500/10' : 'shadow-2xl shadow-green-500/5'}`}>
            {/* Back button for addUser view */}
            {authView === 'addUser' && (
              <button
                onClick={() => {
                  setAuthView('login')
                  resetForm()
                }}
                className={`flex items-center gap-2 mb-6 ${theme === 'dark' ? 'text-green-500/70 hover:text-green-300' : 'text-green-600/70 hover:text-green-700'} transition-colors`}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            )}

            <div className="text-center mb-8">
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
                {getModalTitle()}
              </h2>
              <p className={`${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>
                {getModalSubtitle()}
              </p>
            </div>

            {/* Show Google Login only for login/signup */}
            {authView !== 'addUser' && (
              <>
                <button
                  onClick={handleGoogleLogin}
                  disabled={authLoading}
                  className={`group w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg mb-6 ${theme === 'dark' ? 'bg-gradient-to-r from-black to-gray-900' : 'bg-gradient-to-r from-white to-gray-100'} border ${authColors.buttonBorder} ${authColors.buttonHoverBorder} ${authColors.text} transition-all duration-300 transform hover:scale-[1.02]`}
                >
                  <Chrome className="w-5 h-5 group-hover:animate-pulse" />
                  Continue with Google
                </button>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className={`w-full border-t ${authColors.border}`}></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className={`px-2 ${theme === 'dark' ? 'bg-black/60' : 'bg-white/60'} ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>
                      Or continue with email
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Email/Password Form */}
            <form onSubmit={
              authView === 'login' ? handleEmailLogin : 
              authView === 'signup' ? handleSignup : 
              handleAddNewUser
            } className="space-y-4">
              {authError && (
                <div className={`p-3 rounded-lg bg-rose-500/10 ${theme === 'dark' ? 'text-rose-400' : 'text-rose-600'} ${theme === 'dark' ? 'border-rose-500/20' : 'border-rose-500/30'} border`}>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {authError}
                  </div>
                </div>
              )}

              {authSuccess && (
                <div className={`p-3 rounded-lg bg-emerald-500/10 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'} ${theme === 'dark' ? 'border-emerald-500/20' : 'border-emerald-500/30'} border`}>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {authSuccess}
                  </div>
                </div>
              )}

              {/* Name field for signup and addUser */}
              {(authView === 'signup' || authView === 'addUser') && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-3.5">
                      <User className={`w-5 h-5 ${theme === 'dark' ? 'text-green-500/50' : 'text-green-600/50'}`} />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 ${theme === 'dark' ? 'bg-black/30' : 'bg-white/50'} border ${authColors.border} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${theme === 'dark' ? 'placeholder-green-500/50' : 'placeholder-green-600/50'} transition-all duration-300`}
                      placeholder="Name"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3.5">
                    <Mail className={`w-5 h-5 ${theme === 'dark' ? 'text-green-500/50' : 'text-green-600/50'}`} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 ${theme === 'dark' ? 'bg-black/30' : 'bg-white/50'} border ${authColors.border} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${theme === 'dark' ? 'placeholder-green-500/50' : 'placeholder-green-600/50'} transition-all duration-300`}
                    placeholder="dsa@example.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3.5">
                    <Lock className={`w-5 h-5 ${theme === 'dark' ? 'text-green-500/50' : 'text-green-600/50'}`} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 ${theme === 'dark' ? 'bg-black/30' : 'bg-white/50'} border ${authColors.border} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${theme === 'dark' ? 'placeholder-green-500/50' : 'placeholder-green-600/50'} transition-all duration-300`}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
                <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-green-500/50' : 'text-green-600/50'}`}>
                  {authView === 'addUser' ? 'Set password for the new user' : 'Minimum 6 characters'}
                </p>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className={`group w-full py-3 bg-gradient-to-r ${authColors.primary} hover:opacity-90 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2`}
              >
                {authLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    {authView === 'login' && <><LogIn className="w-5 h-5" /> Sign In</>}
                    {authView === 'signup' && <><UserPlus className="w-5 h-5" /> Create Account</>}
                    {authView === 'addUser' && <><Plus className="w-5 h-5" /> Add User</>}
                  </>
                )}
              </button>
            </form>

            {/* View switcher */}
            <div className="mt-6">
              {authView === 'login' && (
                <div className="space-y-3 text-center">
                  <button
                    onClick={() => {
                      setAuthView('signup')
                      resetForm()
                    }}
                    className={`text-sm ${theme === 'dark' ? 'text-green-500/70 hover:text-green-300' : 'text-green-600/70 hover:text-green-700'} transition-colors`}
                  >
                    Don't have an account? Create one
                  </button>
                  
                </div>
              )}

              {authView === 'signup' && (
                <div className="text-center">
                  <button
                    onClick={() => {
                      setAuthView('login')
                      resetForm()
                    }}
                    className={`text-sm ${theme === 'dark' ? 'text-green-500/70 hover:text-green-300' : 'text-green-600/70 hover:text-green-700'} transition-colors`}
                  >
                    Already have an account? Sign in
                  </button>
                </div>
              )}

              {authView === 'addUser' && (
                <div className="text-center">
                  <div className={`text-xs ${theme === 'dark' ? 'text-amber-500/50' : 'text-amber-600/50'} mb-3`}>
                    This will create a user without email verification
                  </div>
                  <button
                    onClick={() => {
                      setAuthView('login')
                      resetForm()
                    }}
                    className={`text-sm ${theme === 'dark' ? 'text-green-500/70 hover:text-green-300' : 'text-green-600/70 hover:text-green-700'} transition-colors`}
                  >
                    Back to Login
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center mt-6">
            <p className={`text-xs ${theme === 'dark' ? 'text-green-500/50' : 'text-green-600/50'}`}>
              Track your DSA progress with precision and style
            </p>
            {authView === 'addUser' && (
              <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-amber-500/50' : 'text-amber-600/50'}`}>
                Admin function: Direct user creation
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login