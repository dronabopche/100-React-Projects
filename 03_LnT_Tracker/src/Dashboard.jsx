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
  Home,
  Plus,
  Trash2,
  Search,
  FileText,
  AlertCircle,
  ThumbsUp,
  Brain,
  Star,
  Trophy,
  Zap,
  Lightbulb,
  MessageSquare,
  Bookmark,
  Flag,
  BarChart
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function Dashboard({ session, onLogout, theme }) {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    total: 0,
    solved: 0,
    percentage: 0,
    streak: 0,
    lastActive: null,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    totalEasy: 0,
    totalMedium: 0,
    totalHard: 0
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
  
  // Notes Section State
  const [notes, setNotes] = useState([])
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: 'general',
    problem_id: null,
    tags: []
  })
  const [noteTag, setNoteTag] = useState('')
  const [notesLoading, setNotesLoading] = useState(false)
  const [activeNoteTab, setActiveNoteTab] = useState('all') // 'all', 'general', 'problem-specific'
  const [searchTerm, setSearchTerm] = useState('')
  
  // Recent Submissions
  const [recentSubmissions, setRecentSubmissions] = useState([])
  const [showAllSubmissions, setShowAllSubmissions] = useState(false)

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
        warningText: 'text-amber-300',
        info: 'from-blue-500 to-cyan-500',
        infoLight: 'from-blue-400 to-cyan-400',
        infoText: 'text-blue-300',
        success: 'from-green-500 to-emerald-500',
        successLight: 'from-green-400 to-emerald-400',
        successText: 'text-green-300'
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
        warningText: 'text-amber-600',
        info: 'from-blue-600 to-cyan-600',
        infoLight: 'from-blue-500 to-cyan-500',
        infoText: 'text-blue-600',
        success: 'from-green-600 to-emerald-600',
        successLight: 'from-green-500 to-emerald-500',
        successText: 'text-green-600'
      }
    }
  }

  const colors = getThemeColors()

  useEffect(() => {
    fetchDashboardData()
    fetchUserProfile()
    fetchUserNotes()
    fetchRecentSubmissions()
  }, [session])

  useEffect(() => {
    if (showNotesModal) {
      fetchProblemsForNotes()
    }
  }, [showNotesModal])

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

      // Calculate difficulty stats
      const difficultyStats = {
        easy: { solved: 0, total: 0 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 0, total: 0 }
      }

      if (problemsData) {
        problemsData.forEach(problem => {
          difficultyStats[problem.difficulty.toLowerCase()].total++
          const solved = (progress || []).find(p => p.problem_id === problem.id && p.solved)
          if (solved) {
            difficultyStats[problem.difficulty.toLowerCase()].solved++
          }
        })
      }

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

      const recent = solvedProblems.slice(0, 5).map(item => {
        const problem = problemsData?.find(p => p.id === item.problem_id)
        return {
          id: item.problem_id,
          title: problem?.title || `Problem #${item.problem_id}`,
          solved_at: new Date(item.solved_at),
          type: 'solved',
          difficulty: problem?.difficulty || 'medium'
        }
      })

      setStats({
        total: totalProblems,
        solved: solvedProblems.length,
        percentage,
        streak: calculateStreak(progress || []),
        lastActive: solvedProblems[0]?.solved_at || null,
        easySolved: difficultyStats.easy.solved,
        mediumSolved: difficultyStats.medium.solved,
        hardSolved: difficultyStats.hard.solved,
        totalEasy: difficultyStats.easy.total,
        totalMedium: difficultyStats.medium.total,
        totalHard: difficultyStats.hard.total
      })
      
      setCategoryStats(categoryStatsArray)
      setRecentActivity(recent)
      setLoading(false)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setLoading(false)
    }
  }

  const fetchUserNotes = async () => {
    try {
      setNotesLoading(true)
      const { data, error } = await supabase
        .from('user_notes')
        .select(`
          *,
          problems (title, difficulty)
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      setNotes(data || [])
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setNotesLoading(false)
    }
  }

  const fetchRecentSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select(`
          *,
          problems (title, difficulty, category)
        `)
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false })
        .limit(10)

      if (error) throw error
      
      setRecentSubmissions(data || [])
    } catch (error) {
      console.error('Error fetching submissions:', error)
    }
  }

  const fetchProblemsForNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('problems')
        .select('id, title, difficulty')
        .order('title')

      if (error) throw error
      
      // You can use this data to populate a dropdown for problem-specific notes
    } catch (error) {
      console.error('Error fetching problems for notes:', error)
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

  // Notes Functions
  const handleAddNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      alert('Please fill in both title and content')
      return
    }

    try {
      const { data, error } = await supabase
        .from('user_notes')
        .insert({
          user_id: session.user.id,
          title: newNote.title,
          content: newNote.content,
          category: newNote.category,
          problem_id: newNote.problem_id,
          tags: newNote.tags,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()

      if (error) throw error

      setNotes([data[0], ...notes])
      setNewNote({
        title: '',
        content: '',
        category: 'general',
        problem_id: null,
        tags: []
      })
      setNoteTag('')
      setShowNotesModal(false)
    } catch (error) {
      console.error('Error adding note:', error)
      alert('Failed to add note')
    }
  }

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return

    try {
      const { error } = await supabase
        .from('user_notes')
        .delete()
        .eq('id', noteId)

      if (error) throw error

      setNotes(notes.filter(note => note.id !== noteId))
    } catch (error) {
      console.error('Error deleting note:', error)
      alert('Failed to delete note')
    }
  }

  const handleAddTag = () => {
    if (noteTag.trim() && !newNote.tags.includes(noteTag.trim())) {
      setNewNote(prev => ({
        ...prev,
        tags: [...prev.tags, noteTag.trim()]
      }))
      setNoteTag('')
    }
  }

  const handleRemoveTag = (tag) => {
    setNewNote(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const filteredNotes = notes.filter(note => {
    if (activeNoteTab === 'problem-specific') {
      return note.problem_id !== null
    } else if (activeNoteTab === 'general') {
      return note.problem_id === null
    }
    return true
  }).filter(note => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      note.title.toLowerCase().includes(searchLower) ||
      note.content.toLowerCase().includes(searchLower) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  })

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-emerald-500'
      case 'medium': return 'text-amber-500'
      case 'hard': return 'text-rose-500'
      default: return theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
    }
  }

  const getStatusIcon = (solved) => {
    return solved ? (
      <CheckCircle className="w-4 h-4 text-emerald-500" />
    ) : (
      <XCircle className="w-4 h-4 text-rose-500" />
    )
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
  const totalNotes = notes.length
  const problemNotes = notes.filter(n => n.problem_id).length

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
                onClick={() => setShowNotesModal(true)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'} ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                title="Add note"
              >
                <FileText className="w-5 h-5" />
                <span className="hidden md:inline">Add Note</span>
              </button>
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
                  <span className={`font-medium hidden md:inline ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
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

      {/* Add Note Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} border ${colors.border}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Add New Note
              </h2>
              <button
                onClick={() => setShowNotesModal(false)}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-900'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Title *
                </label>
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Note title"
                  className={`w-full px-4 py-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Category
                </label>
                <select
                  value={newNote.category}
                  onChange={(e) => setNewNote(prev => ({ ...prev, category: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                >
                  <option value="general">General Notes</option>
                  <option value="algorithm">Algorithm</option>
                  <option value="data-structure">Data Structure</option>
                  <option value="debugging">Debugging Tips</option>
                  <option value="optimization">Optimization</option>
                  <option value="review">Code Review</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Related Problem (Optional)
                </label>
                <select
                  value={newNote.problem_id || ''}
                  onChange={(e) => setNewNote(prev => ({ ...prev, problem_id: e.target.value || null }))}
                  className={`w-full px-4 py-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                >
                  <option value="">Select a problem</option>
                  {problems.map(problem => (
                    <option key={problem.id} value={problem.id}>
                      {problem.title} ({problem.difficulty})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={noteTag}
                    onChange={(e) => setNoteTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="Add a tag and press Enter"
                    className={`flex-1 px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'}`}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className={`px-4 py-2 rounded-lg bg-gradient-to-r ${colors.primary} text-white hover:opacity-90`}
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newNote.tags.map(tag => (
                    <div
                      key={tag}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Content *
                </label>
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your notes here..."
                  rows={8}
                  className={`w-full px-4 py-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'}`}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNotesModal(false)}
                  className={`flex-1 py-3 rounded-lg border ${theme === 'dark' ? 'border-gray-700 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddNote}
                  className={`flex-1 py-3 rounded-lg bg-gradient-to-r ${colors.primaryDark} text-white hover:opacity-90 flex items-center justify-center gap-2`}
                >
                  <Save className="w-4 h-4" />
                  Save Note
                </button>
              </div>
            </div>
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
                Welcome back, {displayName}! 🎯
              </h1>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                {stats.solved === 0 
                  ? "Start your journey by solving your first problem!" 
                  : `Great progress! You've solved ${stats.solved} problems and taken ${totalNotes} notes so far.`}
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
                <Trophy className={`w-6 h-6 ${colors.text}`} />
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
                <Zap className={`w-6 h-6 ${colors.text}`} />
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
                <FileText className={`w-6 h-6 ${colors.text}`} />
              </div>
              <span className={`text-sm ${colors.solvedText}`}>
                {problemNotes} notes
              </span>
            </div>
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {totalNotes}
            </div>
            <div className={colors.text}>Total Notes</div>
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

        {/* Difficulty Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { difficulty: 'Easy', solved: stats.easySolved, total: stats.totalEasy, color: 'from-emerald-500 to-green-500' },
            { difficulty: 'Medium', solved: stats.mediumSolved, total: stats.totalMedium, color: 'from-amber-500 to-yellow-500' },
            { difficulty: 'Hard', solved: stats.hardSolved, total: stats.totalHard, color: 'from-rose-500 to-red-500' }
          ].map((diff) => (
            <div key={diff.difficulty} className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white'} ${colors.border}`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${diff.color}`}>
                  {diff.difficulty === 'Easy' && <ThumbsUp className="w-6 h-6 text-white" />}
                  {diff.difficulty === 'Medium' && <Brain className="w-6 h-6 text-white" />}
                  {diff.difficulty === 'Hard' && <Flag className="w-6 h-6 text-white" />}
                </div>
                <span className={`text-sm ${diff.difficulty === 'Easy' ? 'text-emerald-500' : diff.difficulty === 'Medium' ? 'text-amber-500' : 'text-rose-500'}`}>
                  {diff.total > 0 ? Math.round((diff.solved / diff.total) * 100) : 0}%
                </span>
              </div>
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {diff.solved} / {diff.total}
              </div>
              <div className={diff.difficulty === 'Easy' ? 'text-emerald-500' : diff.difficulty === 'Medium' ? 'text-amber-500' : 'text-rose-500'}>
                {diff.difficulty} Problems
              </div>
              <div className={`mt-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded-full h-2`}>
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${diff.color}`}
                  style={{ width: `${diff.total > 0 ? (diff.solved / diff.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Notes Section */}
        <div className={`rounded-xl border ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white'} ${colors.border} mb-8`}>
          <div className={`p-6 border-b ${colors.border} flex items-center justify-between`}>
            <div>
              <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                My Notes
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Personal notes and problem insights ({totalNotes} total)
              </p>
            </div>
            <button
              onClick={() => setShowNotesModal(true)}
              className={`px-4 py-2 rounded-lg bg-gradient-to-r ${colors.primary} text-white hover:opacity-90 flex items-center gap-2`}
            >
              <Plus className="w-4 h-4" />
              Add Note
            </button>
          </div>
          
          <div className="p-6">
            {/* Notes Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex space-x-1 rounded-lg p-1 bg-gray-100 dark:bg-gray-800">
                {['all', 'problem-specific', 'general'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveNoteTab(tab)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeNoteTab === tab
                        ? `bg-white dark:bg-gray-700 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} shadow`
                        : `${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
                    }`}
                  >
                    {tab === 'all' ? 'All Notes' : tab === 'problem-specific' ? 'Problem Notes' : 'General Notes'}
                  </button>
                ))}
              </div>
              
              <div className="flex-1">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search notes by title, content, or tags..."
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'}`}
                  />
                </div>
              </div>
            </div>

            {/* Notes List */}
            {notesLoading ? (
              <div className="text-center py-12">
                <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${colors.primary} mx-auto mb-4`}></div>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Loading notes...</p>
              </div>
            ) : filteredNotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className={`rounded-lg border ${colors.border} ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'} p-4 hover:shadow-lg transition-all`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} line-clamp-1`}>
                          {note.title}
                        </h4>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'} mt-1`}>
                          {new Date(note.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className={`p-1 rounded hover:bg-red-500/10 text-red-500 hover:text-red-600`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {note.problems && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-gray-500" />
                          <span className={`text-sm font-medium ${getDifficultyColor(note.problems.difficulty)}`}>
                            {note.problems.title}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="mb-3">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        note.category === 'algorithm' ? 'bg-blue-500/10 text-blue-500' :
                        note.category === 'data-structure' ? 'bg-purple-500/10 text-purple-500' :
                        note.category === 'debugging' ? 'bg-yellow-500/10 text-yellow-500' :
                        note.category === 'optimization' ? 'bg-green-500/10 text-green-500' :
                        'bg-gray-500/10 text-gray-500'
                      }`}>
                        {note.category}
                      </span>
                    </div>

                    <p className={`text-sm mb-4 line-clamp-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {note.content}
                    </p>

                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {note.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className={`px-2 py-1 text-xs rounded-full ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                          >
                            {tag}
                          </span>
                        ))}
                        {note.tags.length > 3 && (
                          <span className={`px-2 py-1 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                            +{note.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-700' : 'text-gray-300'}`} />
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {searchTerm ? 'No notes match your search' : 'No notes yet. Add your first note!'}
                </p>
                <button
                  onClick={() => setShowNotesModal(true)}
                  className={`mt-4 px-4 py-2 rounded-lg bg-gradient-to-r ${colors.primary} text-white hover:opacity-90 flex items-center gap-2 mx-auto`}
                >
                  <Plus className="w-4 h-4" />
                  Add First Note
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Submissions */}
        <div className={`rounded-xl border ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white'} ${colors.border} mb-8`}>
          <div className={`p-6 border-b ${colors.border}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Recent Submissions
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your latest problem attempts
                </p>
              </div>
              <button
                onClick={() => setShowAllSubmissions(!showAllSubmissions)}
                className={`text-sm ${colors.text} hover:underline`}
              >
                {showAllSubmissions ? 'Show Less' : 'View All'}
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {recentSubmissions.length > 0 ? (
              <div className="space-y-3">
                {(showAllSubmissions ? recentSubmissions : recentSubmissions.slice(0, 5)).map((submission) => (
                  <div
                    key={submission.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      theme === 'dark' 
                        ? submission.solved ? 'bg-emerald-500/10' : 'bg-rose-500/10'
                        : submission.solved ? 'bg-emerald-50' : 'bg-rose-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(submission.solved)}
                      <div>
                        <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {submission.problems?.title || `Problem #${submission.problem_id}`}
                        </div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {submission.problems?.category || 'Unknown Category'} • 
                          <span className={`ml-1 ${getDifficultyColor(submission.problems?.difficulty)}`}>
                            {submission.problems?.difficulty || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {new Date(submission.updated_at).toLocaleDateString()}
                      </div>
                      <div className={`text-xs ${submission.solved ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {submission.solved ? 'Solved' : 'Attempted'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className={`w-12 h-12 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-700' : 'text-gray-300'}`} />
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  No submissions yet. Start solving problems!
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
                          {activity.title}
                        </div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                          {activity.solved_at.toLocaleDateString()} • 
                          <span className={`ml-1 ${getDifficultyColor(activity.difficulty)}`}>
                            {activity.difficulty}
                          </span>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              onClick={() => setShowNotesModal(true)}
              className={`p-4 rounded-lg border text-left transition-all hover:scale-[1.02] ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'} ${colors.border}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${colors.progressBg}`}>
                  <FileText className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div>
                  <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Add Note
                  </div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Capture your insights
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

        {/* User Stats Summary */}
        <div className={`mt-8 rounded-xl border p-6 ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white'} ${colors.border}`}>
          <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Your Learning Journey
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`text-3xl font-bold ${colors.text}`}>{stats.streak}</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Day Streak</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${colors.solvedText}`}>{stats.percentage}%</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Completion</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${colors.infoText}`}>{totalNotes}</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Notes Taken</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${colors.warningText}`}>{recentSubmissions.length}</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Attempts</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard