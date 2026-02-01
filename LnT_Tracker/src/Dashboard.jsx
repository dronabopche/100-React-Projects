import React, { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { 
  BarChart3, 
  Target, 
  Calendar, 
  TrendingUp, 
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  ChevronRight,
  ArrowLeft,
  RefreshCw,
  User,
  Edit,
  Save,
  X,
  Mail,
  Shield,
  Home
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function Dashboard({ session, onLogout, theme }) {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    total: 0,
    solved: 0,
    percentage: 0,
    streak: 0,
    lastActive: null
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryStats, setCategoryStats] = useState([])
  const [problems, setProblems] = useState([])
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    avatar_url: ''
  })
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')

  // Theme-based colors
  const getThemeColors = () => {
    if (theme === 'dark') {
      return {
        bg: 'from-black via-gray-900 to-cyan-900/20',
        primary: 'from-green-500 to-cyan-500',
        primaryLight: 'from-green-400 to-cyan-400',
        primaryDark: 'from-green-600 to-cyan-600',
        border: 'border-green-500/30',
        text: 'text-green-300',
        hoverBorder: 'hover:border-green-400/50',
        cardBg: 'from-black/60 to-gray-900/60',
        headerBg: 'bg-black/80',
        solved: 'from-emerald-500 to-cyan-500',
        solvedLight: 'from-emerald-400 to-cyan-400',
        solvedText: 'text-emerald-300',
        progress: 'from-green-500 to-cyan-500',
        progressBg: 'bg-green-500/20',
        button: 'from-green-700/30 to-cyan-700/30',
        buttonHover: 'hover:from-green-600/40 hover:to-cyan-600/40',
        buttonBorder: 'border-green-500/30',
        buttonHoverBorder: 'hover:border-green-400/50',
        buttonText: 'text-green-300',
        danger: 'from-rose-500 to-red-500',
        dangerLight: 'from-rose-400 to-red-400',
        dangerText: 'text-rose-300',
        warning: 'from-amber-500 to-yellow-500',
        warningLight: 'from-amber-400 to-yellow-400',
        warningText: 'text-amber-300'
      }
    } else {
      return {
        bg: 'from-white via-cyan-50 to-green-50',
        primary: 'from-green-600 to-cyan-600',
        primaryLight: 'from-green-500 to-cyan-500',
        primaryDark: 'from-green-700 to-cyan-700',
        border: 'border-green-400/50',
        text: 'text-green-600',
        hoverBorder: 'hover:border-green-500/70',
        cardBg: 'from-white/80 to-cyan-50/80',
        headerBg: 'bg-white/90',
        solved: 'from-emerald-600 to-cyan-600',
        solvedLight: 'from-emerald-500 to-cyan-500',
        solvedText: 'text-emerald-600',
        progress: 'from-green-600 to-cyan-600',
        progressBg: 'bg-green-500/20',
        button: 'from-green-600/20 to-cyan-600/20',
        buttonHover: 'hover:from-green-500/30 hover:to-cyan-500/30',
        buttonBorder: 'border-green-400/50',
        buttonHoverBorder: 'hover:border-green-500/70',
        buttonText: 'text-green-600',
        danger: 'from-rose-600 to-red-600',
        dangerLight: 'from-rose-500 to-red-500',
        dangerText: 'text-rose-600',
        warning: 'from-amber-600 to-yellow-600',
        warningLight: 'from-amber-500 to-yellow-500',
        warningText: 'text-amber-600'
      }
    }
  }

  const colors = getThemeColors()

  useEffect(() => {
    fetchDashboardData()
    fetchUserProfile()
  }, [session])

  const fetchUserProfile = async () => {
    try {
      const { user } = session
      const metadata = user.user_metadata || {}
      
      setUserProfile({
        name: metadata.name || metadata.full_name || user.email?.split('@')[0] || '',
        email: user.email || '',
        avatar_url: metadata.avatar_url || metadata.picture || ''
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      const { data: problemsData, error: problemsError } = await supabase
        .from('problems')
        .select('*')

      if (problemsError) {
        console.error('Error fetching problems:', problemsError)
        setLoading(false)
        return
      }

      setProblems(problemsData || [])
      
      const { data: progress, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', session.user.id)
        .order('solved_at', { ascending: false })

      if (progressError) {
        console.error('Error fetching progress:', progressError)
      }

      const solvedProblems = (progress || []).filter(p => p.solved)
      const totalProblems = problemsData?.length || 0
      const percentage = totalProblems > 0 ? Math.round((solvedProblems.length / totalProblems) * 100) : 0

      const categoryMap = {}
      if (problemsData) {
        problemsData.forEach(problem => {
          if (!categoryMap[problem.category]) {
            categoryMap[problem.category] = { total: 0, solved: 0 }
          }
          categoryMap[problem.category].total++
          
          const solved = (progress || []).find(p => p.problem_id === problem.id && p.solved)
          if (solved) {
            categoryMap[problem.category].solved++
          }
        })
      }

      const categoryStatsArray = Object.entries(categoryMap).map(([category, data]) => ({
        category,
        total: data.total,
        solved: data.solved,
        percentage: data.total > 0 ? Math.round((data.solved / data.total) * 100) : 0
      })).sort((a, b) => b.solved - a.solved)

      const recent = solvedProblems.slice(0, 5).map(item => ({
        id: item.problem_id,
        solved_at: new Date(item.solved_at).toLocaleDateString(),
        type: 'solved'
      }))

      setStats({
        total: totalProblems,
        solved: solvedProblems.length,
        percentage,
        streak: calculateStreak(progress || []),
        lastActive: solvedProblems[0]?.solved_at || null
      })
      
      setCategoryStats(categoryStatsArray)
      setRecentActivity(recent)
      setLoading(false)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setLoading(false)
    }
  }

  const calculateStreak = (progress) => {
    if (!progress || progress.length === 0) return 0
    
    const solvedDates = progress
      .filter(p => p.solved)
      .map(p => new Date(p.solved_at).toDateString())
    
    const uniqueDates = [...new Set(solvedDates)]
    uniqueDates.sort((a, b) => new Date(b) - new Date(a))
    
    let streak = 0
    const today = new Date().toDateString()
    let currentDate = new Date()
    
    for (let i = 0; i < uniqueDates.length; i++) {
      const dateStr = uniqueDates[i]
      if (dateStr === currentDate.toDateString()) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }
    
    return streak
  }

  const getRandomUnsolvedProblem = () => {
    const solvedIds = recentActivity.map(activity => activity.id)
    const unsolved = problems.filter(problem => !solvedIds.includes(problem.id))
    if (unsolved.length > 0) {
      const randomIndex = Math.floor(Math.random() * unsolved.length)
      return unsolved[randomIndex]
    }
    return problems[0] || null
  }

  const handleStartPracticing = () => {
    const problem = getRandomUnsolvedProblem()
    if (problem) {
      navigate('/', { state: { scrollToProblem: problem.id } })
    } else {
      navigate('/')
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileError('')
    setProfileSuccess('')

    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          name: userProfile.name,
          full_name: userProfile.name
        }
      })

      if (error) throw error

      setUserProfile(prev => ({
        ...prev,
        name: data.user.user_metadata?.name || data.user.user_metadata?.full_name || ''
      }))
      
      setProfileSuccess('Profile updated successfully!')
      setEditingProfile(false)
      
      setTimeout(() => {
        setProfileSuccess('')
      }, 3000)

    } catch (error) {
      console.error('Error updating profile:', error)
      setProfileError(error.message || 'Failed to update profile')
    } finally {
      setProfileLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${colors.bg} ${theme === 'dark' ? 'text-white' : 'text-gray-900'} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 ${colors.primary} mx-auto mb-4`}></div>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const displayName = userProfile.name || session.user.email?.split('@')[0] || 'User'

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bg} ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${colors.headerBg} backdrop-blur-md border-b ${colors.border}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-white/10 text-white' : 'hover:bg-black/10 text-gray-900'}`}
              >
                <Home className="w-5 h-5" />
              </button>
              <Target className={`w-8 h-8 ${colors.text}`} />
              <div>
                <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Dashboard
                </h1>
                <p className={`text-xs ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>
                  {session.user.email}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditingProfile(true)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${theme === 'dark' ? 'hover:bg-white/10 text-white' : 'hover:bg-black/10 text-gray-900'}`}
                title="Edit profile"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r from-green-500 to-cyan-500">
                    {userProfile.avatar_url ? (
                      <img 
                        src={userProfile.avatar_url} 
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {displayName}
                  </span>
                </div>
              </button>
              <button
                onClick={fetchDashboardData}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-black/10 text-gray-600'}`}
                title="Refresh dashboard"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={onLogout}
                className={`px-4 py-2 rounded-lg bg-gradient-to-r ${colors.danger} ${theme === 'dark' ? 'text-white' : 'text-white'} hover:opacity-90`}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Edit Modal */}
      {editingProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} border ${colors.border}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Edit Profile
              </h2>
              <button
                onClick={() => setEditingProfile(false)}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-900'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {profileError && (
              <div className={`mb-4 p-3 rounded-lg bg-gradient-to-r ${colors.danger} text-white`}>
                {profileError}
              </div>
            )}

            {profileSuccess && (
              <div className={`mb-4 p-3 rounded-lg bg-gradient-to-r ${colors.solved} text-white`}>
                {profileSuccess}
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Display Name
                  </div>
                </label>
                <input
                  type="text"
                  name="name"
                  value={userProfile.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className={`w-full px-4 py-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'}`}
                />
                <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  This name will be displayed on your profile
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </div>
                </label>
                <input
                  type="email"
                  value={userProfile.email}
                  readOnly
                  className={`w-full px-4 py-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-500'}`}
                />
                <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Email cannot be changed here
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Account Security
                  </div>
                </label>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  To change your password or other security settings, please use the Google account settings.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingProfile(false)}
                  className={`flex-1 py-3 rounded-lg border ${theme === 'dark' ? 'border-gray-700 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileLoading}
                  className={`flex-1 py-3 rounded-lg bg-gradient-to-r ${colors.primaryDark} text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                  {profileLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className={`mb-8 rounded-2xl p-6 bg-gradient-to-r ${colors.progressBg} border ${colors.border}`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Welcome back, {displayName}!
              </h1>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                {stats.solved === 0 
                  ? "Start your journey by solving your first problem!" 
                  : `Great progress! You've solved ${stats.solved} problems so far.`}
              </p>
              
              {!userProfile.name && (
                <div className="mt-4">
                  <button
                    onClick={() => setEditingProfile(true)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-green-100 hover:bg-green-200 text-green-700'}`}
                  >
                    <Edit className="w-4 h-4" />
                    Add your name to personalize your experience
                  </button>
                </div>
              )}
            </div>
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setEditingProfile(true)}
                className={`flex items-center gap-2 p-3 rounded-full ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
                title="Edit profile"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-r from-green-500 to-cyan-500 border-4 border-white/20">
                  {userProfile.avatar_url ? (
                    <img 
                      src={userProfile.avatar_url} 
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
              </button>
              <Award className={`w-16 h-16 ${colors.warningText}`} />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white'} ${colors.border}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${colors.progressBg}`}>
                <BarChart3 className={`w-6 h-6 ${colors.text}`} />
              </div>
              <span className={`text-sm ${colors.solvedText}`}>
                {stats.percentage}%
              </span>
            </div>
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {stats.solved} / {stats.total}
            </div>
            <div className={colors.text}>Problems Solved</div>
          </div>

          <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white'} ${colors.border}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${colors.progressBg}`}>
                <TrendingUp className={`w-6 h-6 ${colors.text}`} />
              </div>
              <span className={`text-sm ${colors.solvedText}`}>
                {stats.streak} days
              </span>
            </div>
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {stats.streak}
            </div>
            <div className={colors.text}>Current Streak</div>
          </div>

          <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white'} ${colors.border}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${colors.progressBg}`}>
                <Calendar className={`w-6 h-6 ${colors.text}`} />
              </div>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {stats.lastActive ? new Date(stats.lastActive).toLocaleDateString() : 'Never'}
              </span>
            </div>
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {stats.lastActive ? 'Active' : 'Ready'}
            </div>
            <div className={colors.text}>Last Activity</div>
          </div>

          <button
            onClick={handleStartPracticing}
            className={`p-6 rounded-xl border text-left transition-all hover:scale-[1.02] bg-gradient-to-r ${theme === 'dark' ? colors.progressBg : colors.button} ${colors.border} hover:${colors.hoverBorder} ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${theme === 'dark' ? colors.progressBg : 'bg-green-100'}`}>
                <Target className={`w-6 h-6 ${colors.text}`} />
              </div>
              <span className={`text-sm ${colors.text}`}>
                Start →
              </span>
            </div>
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {stats.solved === 0 ? 'Begin' : 'Continue'}
            </div>
            <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Practice Now</div>
          </button>
        </div>

        {/* Category Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Categories */}
          <div className={`rounded-xl border ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white'} ${colors.border}`}>
            <div className={`p-6 border-b ${colors.border}`}>
              <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Category Progress
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Your progress across different topics
              </p>
            </div>
            <div className="p-6">
              {categoryStats.length > 0 ? (
                <div className="space-y-4">
                  {categoryStats.slice(0, 5).map((cat, index) => (
                    <div key={cat.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          index === 0 ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white' :
                          index === 1 ? 'bg-gradient-to-r from-gray-500 to-slate-500 text-white' :
                          index === 2 ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' :
                          `bg-gradient-to-r ${colors.progress} text-white`
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {cat.category}
                          </div>
                          <div className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                            {cat.solved} of {cat.total} solved
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {cat.percentage}%
                        </div>
                        <div className={`w-32 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded-full h-2 mt-1`}>
                          <div 
                            className={`h-2 rounded-full ${
                              cat.percentage === 100 ? `bg-gradient-to-r ${colors.solved}` :
                              cat.percentage >= 70 ? `bg-gradient-to-r ${colors.primary}` :
                              cat.percentage >= 40 ? `bg-gradient-to-r ${colors.warning}` : `bg-gradient-to-r ${colors.danger}`
                            }`}
                            style={{ width: `${cat.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => navigate('/')}
                    className={`w-full mt-6 py-3 rounded-lg flex items-center justify-center gap-2 ${
                      theme === 'dark' 
                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    View All Categories
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className={`w-12 h-12 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-700' : 'text-gray-300'}`} />
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    No categories found
                  </p>
                  <button
                    onClick={() => navigate('/')}
                    className={`mt-4 px-4 py-2 rounded-lg bg-gradient-to-r ${colors.primary} text-white hover:opacity-90`}
                  >
                    Browse Problems
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className={`rounded-xl border ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white'} ${colors.border}`}>
            <div className={`p-6 border-b ${colors.border}`}>
              <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Recent Activity
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Your latest problem solving activity
              </p>
            </div>
            <div className="p-6">
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-100/50'}`}>
                      <div className={`p-2 rounded-full ${theme === 'dark' ? colors.progressBg : 'bg-green-100'}`}>
                        <CheckCircle className={`w-4 h-4 ${colors.solvedText}`} />
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Solved Problem #{activity.id}
                        </div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                          {activity.solved_at}
                        </div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? colors.progressBg : 'bg-green-100'} ${colors.solvedText}`}>
                        Solved
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className={`w-12 h-12 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-700' : 'text-gray-300'}`} />
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    No activity yet. Start solving problems!
                  </p>
                  <button
                    onClick={handleStartPracticing}
                    className={`mt-4 px-4 py-2 rounded-lg bg-gradient-to-r ${colors.primary} text-white hover:opacity-90`}
                  >
                    Start Practicing
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`rounded-xl border p-6 ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white'} ${colors.border}`}>
          <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleStartPracticing}
              className={`p-4 rounded-lg border text-left transition-all hover:scale-[1.02] ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'} ${colors.border}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${colors.progressBg}`}>
                  <Target className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div>
                  <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Practice Problems
                  </div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Start solving problems
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setEditingProfile(true)}
              className={`p-4 rounded-lg border text-left transition-all hover:scale-[1.02] ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'} ${colors.border}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${colors.progressBg}`}>
                  <Edit className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div>
                  <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Edit Profile
                  </div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {userProfile.name ? 'Update your name' : 'Add your name'}
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={fetchDashboardData}
              className={`p-4 rounded-lg border text-left transition-all hover:scale-[1.02] ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'} ${colors.border}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${colors.progressBg}`}>
                  <RefreshCw className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div>
                  <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Refresh Data
                  </div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Update dashboard
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Getting Started Guide */}
        {stats.solved === 0 && (
          <div className={`mt-8 rounded-xl border p-6 bg-gradient-to-r ${colors.progressBg} ${colors.border}`}>
            <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Getting Started
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100'}`}>
                <div className={`text-2xl font-bold mb-2 ${colors.text}`}>1</div>
                <div className={`font-medium mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Complete Your Profile
                </div>
                <div className={`text-sm ${colors.text}`}>
                  Add your name to personalize your experience
                </div>
              </div>
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-100'}`}>
                <div className={`text-2xl font-bold mb-2 ${colors.text}`}>2</div>
                <div className={`font-medium mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Explore Problems
                </div>
                <div className={`text-sm ${colors.text}`}>
                  Browse problems by category or difficulty
                </div>
              </div>
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-green-600/20' : 'bg-green-200'}`}>
                <div className={`text-2xl font-bold mb-2 ${colors.text}`}>3</div>
                <div className={`font-medium mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Track Progress
                </div>
                <div className={`text-sm ${colors.text}`}>
                  Mark problems as solved to track your journey
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard