import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { supabase } from './supabase'
import { 
  LogIn, 
  LogOut, 
  Check, 
  ExternalLink, 
  Target, 
  Star,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Book,
  Database,
  FileText,
  GitBranch,
  Layers,
  Network,
  Zap,
  Cpu,
  Award,
  BarChart3,
  AlertCircle,
  Loader,
  CheckCircle,
  TrendingUp,
  Hash,
  Clock,
  Grid,
  Sun,
  Moon,
  User,
  Mail,
  Lock,
  Menu,
  X,
  Chrome,
  Home,
  Sparkles,
  Trophy,
  Flame,
  Zap as Lightning,
  Crown,
  Gem,
  LayoutGrid,
  Table,
  Hash as HashIcon
} from 'lucide-react'
import Dashboard from './Dashboard'
import SheetsPage from './SheetsPage'

// Category icons mapping
const categoryIcons = {
  'Arrays': <Database className="w-5 h-5" />,
  'Strings': <FileText className="w-5 h-5" />,
  'Linked Lists': <GitBranch className="w-5 h-5" />,
  'Trees': <Layers className="w-5 h-5" />,
  'Graphs': <Network className="w-5 h-5" />,
  'Dynamic Programming': <Zap className="w-5 h-5" />,
  'Recursion': <Cpu className="w-5 h-5" />,
  'Sorting': <Filter className="w-5 h-5" />,
  'Searching': <Search className="w-5 h-5" />,
  'Backtracking': <Clock className="w-5 h-5" />,
  'Greedy': <Award className="w-5 h-5" />,
  'Heap': <Database className="w-5 h-5" />,
  'Stack': <Layers className="w-5 h-5" />,
  'Queue': <TrendingUp className="w-5 h-5" />,
  'Hash Tables': <Hash className="w-5 h-5" />,
  'Binary Search': <Search className="w-5 h-5" />,
  'Bit Manipulation': <Cpu className="w-5 h-5" />,
  'Math': <Hash className="w-5 h-5" />,
  'Two Pointers': <TrendingUp className="w-5 h-5" />,
  'Miscellaneous': <Grid className="w-5 h-5" />
}

// Main App Component
function MainApp({ session, onLogout, theme, toggleTheme }) {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [problemsByCategory, setProblemsByCategory] = useState({})
  const [userProgress, setUserProgress] = useState({})
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [expandedCategories, setExpandedCategories] = useState({})
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [stats, setStats] = useState({ total: 0, solved: 0, percentage: 0 })
  
  // Modal state
  const [showProblemModal, setShowProblemModal] = useState(false)
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [problemNumberInput, setProblemNumberInput] = useState('')
  const [modalLoading, setModalLoading] = useState(false)
  const [modalError, setModalError] = useState('')
  const [modalSuccess, setModalSuccess] = useState('')

  // Theme-based colors - GREEN/CYAN THEME
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
    loadData()
  }, [session])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Fetch all problems
      const { data: problems, error: problemsError } = await supabase
        .from('problems')
        .select('*')
        .order('problem_number')

      if (problemsError) throw problemsError
      
      console.log('Loaded problems:', problems?.length)

      if (!problems || problems.length === 0) {
        setLoading(false)
        return
      }

      // Fetch user progress if logged in
      let progressMap = {}
      let totalSolved = 0
      
      if (session?.user?.id) {
        try {
          const { data: progress, error: progressError } = await supabase
            .from('user_progress')
            .select('problem_id, solved')
            .eq('user_id', session.user.id)

          console.log('Loaded user progress:', progress)

          if (progressError) {
            console.error('Progress error:', progressError)
          }
          
          if (progress && progress.length > 0) {
            progress.forEach(item => {
              progressMap[item.problem_id] = item.solved
              if (item.solved) {
                totalSolved++
              }
            })
          }
        } catch (progressErr) {
          console.error('Error fetching progress:', progressErr)
        }
      }

      console.log('Progress map:', progressMap)
      console.log('Total solved:', totalSolved)

      // Group problems by category
      const grouped = {}
      const uniqueCategories = new Set()
      
      problems.forEach(problem => {
        const category = problem.category || 'Uncategorized'
        uniqueCategories.add(category)
        
        if (!grouped[category]) {
          grouped[category] = []
        }
        
        // Determine if solved (check user progress if logged in)
        // Use problem.problem_number as the key since that's what's stored as problem_id
        const isSolved = session?.user?.id ? Boolean(progressMap[problem.problem_number]) : false
        
        grouped[category].push({
          id: problem.id,
          problem_number: problem.problem_number,
          name: problem.name,
          difficulty: problem.difficulty,
          category: category,
          leetcode_link: problem.leetcode_link,
          solved: isSolved
        })
      })

      // Sort problems within each category
      Object.keys(grouped).forEach(category => {
        grouped[category] = grouped[category].sort((a, b) => {
          if (session?.user?.id) {
            // For logged in users: unsolved first, then by difficulty
            if (a.solved !== b.solved) {
              return a.solved ? 1 : -1
            }
          }
          
          // Sort by difficulty
          const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 }
          const diffA = difficultyOrder[a.difficulty] || 4
          const diffB = difficultyOrder[b.difficulty] || 4
          
          if (diffA !== diffB) {
            return diffA - diffB
          }
          
          // Finally sort by problem number
          return a.problem_number - b.problem_number
        })
      })

      // Calculate statistics
      const percentage = problems.length > 0 ? Math.round((totalSolved / problems.length) * 100) : 0

      console.log('Final stats:', {
        total: problems.length,
        solved: totalSolved,
        percentage: percentage
      })

      // Update state
      const sortedCategories = Array.from(uniqueCategories).sort()
      setCategories(sortedCategories)
      setProblemsByCategory(grouped)
      setUserProgress(progressMap)
      setStats({ 
        total: problems.length, 
        solved: totalSolved, 
        percentage: percentage
      })
      
      // Expand all categories by default
      const expanded = {}
      sortedCategories.forEach(cat => {
        expanded[cat] = true
      })
      setExpandedCategories(expanded)
      setLoading(false)

    } catch (err) {
      console.error('Error fetching data:', err)
      setLoading(false)
    }
  }

  const openProblemModal = (problem) => {
    if (!session?.user?.id) {
      alert('Please login to track your progress')
      return
    }
    
    setSelectedProblem(problem)
    setProblemNumberInput('')
    setModalError('')
    setModalSuccess('')
    setShowProblemModal(true)
  }

  const handleSubmitProblem = async () => {
    if (!selectedProblem || !problemNumberInput.trim()) {
      setModalError('Please enter a problem number')
      return
    }

    const enteredNumber = parseInt(problemNumberInput.trim())
    if (isNaN(enteredNumber) || enteredNumber <= 0) {
      setModalError('Please enter a valid problem number')
      return
    }

    setModalLoading(true)
    setModalError('')
    setModalSuccess('')

    try {
      // Fetch problem (problem_number IS the problem_id)
      const { data: problemData, error: problemError } = await supabase
        .from('problems')
        .select('problem_number, name')
        .eq('problem_number', enteredNumber)
        .single()

      if (problemError || !problemData) {
        console.error('Error finding problem:', problemError)
        setModalError(`Problem #${enteredNumber} not found in database`)
        setModalLoading(false)
        return
      }

      const problemId = problemData.problem_number
      const now = new Date().toISOString()

      // Check if entry already exists
      const { data: existingEntry, error: checkError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('problem_id', problemId)
        .maybeSingle()

      if (checkError) {
        console.error('Error checking existing entry:', checkError)
        throw checkError
      }

      let upsertError = null

      if (existingEntry) {
        // Update existing entry
        console.log('Updating existing entry for problem:', problemId)

        const { error: updateError } = await supabase
          .from('user_progress')
          .update({
            solved: true,
            solved_at: now
            // Removed: updated_at: now
          })
          .eq('user_id', session.user.id)
          .eq('problem_id', problemId)

        upsertError = updateError
      } else {
        // Insert new entry
        console.log('Inserting new entry for problem:', problemId)

        const { error: insertError } = await supabase
          .from('user_progress')
          .insert({
            user_id: session.user.id,
            problem_id: problemId,
            solved: true,
            solved_at: now,
            created_at: now
          })

        upsertError = insertError
      }

      if (upsertError) {
        console.error('Database error:', upsertError)
        throw upsertError
      }

      // Update local progress map
      const updatedProgressMap = {
        ...userProgress,
        [problemId]: true
      }
      setUserProgress(updatedProgressMap)

      // Recalculate stats
      const newSolvedCount = Object.values(updatedProgressMap).filter(Boolean).length
      const newPercentage =
        stats.total > 0 ? Math.round((newSolvedCount / stats.total) * 100) : 0

      setStats(prev => ({
        ...prev,
        solved: newSolvedCount,
        percentage: newPercentage
      }))

      // Update problemsByCategory state
      setProblemsByCategory(prev => {
        const newState = { ...prev }
        Object.keys(newState).forEach(category => {
          newState[category] = newState[category].map(problem =>
            problem.problem_number === problemId
              ? { ...problem, solved: true }
              : problem
          )
        })
        return newState
      })

      setModalSuccess(`Successfully marked Problem #${problemId} as solved!`)
      setModalLoading(false)

      // Close modal after 2 seconds
      setTimeout(() => {
        setShowProblemModal(false)
        setProblemNumberInput('')
      }, 2000)

    } catch (err) {
      console.error('Error submitting problem:', err)
      setModalError(err.message || 'Failed to update progress. Please try again.')
      setModalLoading(false)
    }
  }

  const handleMarkUnsolved = async (problemId, category) => {
    if (!session?.user?.id) {
      alert('Please login to track your progress')
      return
    }

    try {
      // Update in database
      const { error } = await supabase
        .from('user_progress')
        .update({
          solved: false,
          solved_at: null,
        })
        .eq('user_id', session.user.id)
        .eq('problem_id', problemId)

      if (error) throw error

      // Update local state
      const updatedProgressMap = {
        ...userProgress,
        [problemId]: false
      }
      setUserProgress(updatedProgressMap)

      // Calculate new solved count
      const newSolvedCount = Object.values(updatedProgressMap).filter(Boolean).length
      const newPercentage = stats.total > 0 ? Math.round((newSolvedCount / stats.total) * 100) : 0

      // Update stats
      setStats(prev => ({
        ...prev,
        solved: newSolvedCount,
        percentage: newPercentage
      }))

      // Update problemsByCategory
      setProblemsByCategory(prev => {
        const newState = { ...prev }
        if (newState[category]) {
          newState[category] = newState[category].map(problem => 
            problem.problem_number === problemId 
              ? { ...problem, solved: false }
              : problem
          )
        }
        return newState
      })

    } catch (err) {
      console.error('Error marking unsolved:', err)
      alert('Failed to update progress. Please try again.')
    }
  }

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const toggleAllCategories = () => {
    const allExpanded = Object.values(expandedCategories).every(v => v)
    const newState = {}
    categories.forEach(cat => {
      newState[cat] = !allExpanded
    })
    setExpandedCategories(newState)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
      case 'medium': return 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white'
      case 'hard': return 'bg-gradient-to-r from-rose-500 to-red-500 text-white'
      default: return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white'
    }
  }

  const getFilteredProblems = (problems) => {
    let filtered = [...problems]
    
    if (searchQuery) {
      filtered = filtered.filter(problem => 
        problem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.problem_number.toString().includes(searchQuery)
      )
    }
    
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(problem => 
        problem.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase()
      )
    }
    
    return filtered
  }

  const getCategoryStats = (category) => {
    const problems = problemsByCategory[category] || []
    const solvedCount = session?.user?.id ? problems.filter(p => p.solved).length : 0
    const totalCount = problems.length
    const percentage = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0
    
    return { total: totalCount, solved: solvedCount, percentage }
  }

  const getOverallStats = () => {
    return stats // Directly return the stats state
  }

  const overallStats = getOverallStats()

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${colors.bg} ${theme === 'dark' ? 'text-white' : 'text-gray-900'} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 ${colors.primary} mx-auto mb-4`}></div>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Loading problems...</p>
          <p className={`text-sm ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'} mt-2`}>Preparing your journey</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bg} ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 ${theme === 'dark' ? 'bg-green-500/10' : 'bg-green-500/5'} rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 ${theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-500/5'} rounded-full blur-3xl animate-pulse delay-1000`}></div>
        <div className={`absolute top-1/2 left-1/4 w-60 h-60 ${theme === 'dark' ? 'bg-white/5' : 'bg-green-500/5'} rounded-full blur-3xl animate-pulse delay-500`}></div>
      </div>

      {/* Problem Submission Modal */}
      {showProblemModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} border ${colors.border}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Mark Problem as Solved
              </h2>
              <button
                onClick={() => setShowProblemModal(false)}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-900'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <div className={`flex items-center gap-3 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100/50'}`}>
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-green-500/10' : 'bg-green-100'}`}>
                  <HashIcon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <div>
                  <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Enter Problem Number
                  </div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Which problem did you solve?
                  </div>
                </div>
              </div>
            </div>

            {modalError && (
              <div className={`mb-4 p-3 rounded-lg bg-gradient-to-r ${colors.danger} text-white`}>
                {modalError}
              </div>
            )}

            {modalSuccess && (
              <div className={`mb-4 p-3 rounded-lg bg-gradient-to-r ${colors.solved} text-white`}>
                {modalSuccess}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Problem Number
                </label>
                <input
                  type="number"
                  value={problemNumberInput}
                  onChange={(e) => setProblemNumberInput(e.target.value)}
                  placeholder="e.g., 1, 42, 100"
                  className={`w-full px-4 py-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  min="1"
                  autoFocus
                />
                <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Enter the problem number from LeetCode
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProblemModal(false)}
                  className={`flex-1 py-3 rounded-lg border ${theme === 'dark' ? 'border-gray-700 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitProblem}
                  disabled={modalLoading || !problemNumberInput.trim()}
                  className={`flex-1 py-3 rounded-lg bg-gradient-to-r ${colors.primaryDark} text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                  {modalLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Mark as Solved
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`sticky top NA0 z-50 ${colors.headerBg} backdrop-blur-xl border-b ${colors.border}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/')}
                  className="group relative"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${colors.primary} rounded-full blur group-hover:animate-pulse`}></div>
                  <Target className={`relative w-8 h-8 ${colors.text}`} />
                </button>
                <div>
                  <h1 className={`text-2xl font-bold bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent`}>
                    DSA Tracker
                  </h1>
                  <p className={`text-xs ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>Green Cyan Mastery</p>
                </div>
              </div>
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2 rounded-lg ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'} transition-all`}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
            
            <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row md:items-center gap-4`}>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className={`text-xl font-bold bg-gradient-to-r ${colors.solvedLight} bg-clip-text text-transparent`}>
                    {stats.solved}
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>Solved</div>
                </div>
                <div className="text-center">
                  <div className={`text-xl font-bold bg-gradient-to-r ${colors.primaryLight} bg-clip-text text-transparent`}>
                    {stats.total}
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>Total</div>
                </div>
                <div className="text-center">
                  <div className={`text-xl font-bold bg-gradient-to-r ${colors.primaryLight} bg-clip-text text-transparent`}>
                    {stats.percentage}%
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>Progress</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/sheets')}
                  className={`group relative px-4 py-2 bg-gradient-to-r ${colors.button} ${colors.buttonHover} ${colors.buttonText} rounded-lg border ${colors.buttonBorder} ${colors.buttonHoverBorder} transition-all duration-300 transform hover:scale-105`}
                >
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4" />
                    <span>Sheets</span>
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-r from-green-500/0 to-cyan-500/0 group-hover:from-green-500/10 group-hover:to-cyan-500/10 rounded-lg transition-all duration-300`}></div>
                </button>
                
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`group relative px-4 py-2 bg-gradient-to-r ${colors.button} ${colors.buttonHover} ${colors.buttonText} rounded-lg border ${colors.buttonBorder} ${colors.buttonHoverBorder} transition-all duration-300 transform hover:scale-105`}
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>Dashboard</span>
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-r from-green-500/0 to-cyan-500/0 group-hover:from-green-500/10 group-hover:to-cyan-500/10 rounded-lg transition-all duration-300`}></div>
                </button>
                
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'} border ${colors.buttonBorder} ${colors.buttonHoverBorder} transition-all duration-300 transform hover:scale-110`}
                >
                  {theme === 'dark' ? <Sun className={`w-5 h-5 ${colors.text}`} /> : <Moon className={`w-5 h-5 ${colors.text}`} />}
                </button>
                
                <div className="relative group">
                  <button className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r ${colors.primary} p-0.5`}>
                      <div className={`w-full h-full rounded-full ${theme === 'dark' ? 'bg-black' : 'bg-white'} flex items-center justify-center`}>
                        {session?.user?.user_metadata?.avatar_url ? (
                          <img 
                            src={session.user.user_metadata.avatar_url} 
                            alt={session.user.email}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className={`w-4 h-4 ${colors.text}`} />
                        )}
                      </div>
                    </div>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 py-2 rounded-lg shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className={`bg-gradient-to-b ${theme === 'dark' ? 'from-gray-900 to-black' : 'from-white to-gray-100'} rounded-lg border ${colors.border} backdrop-blur-xl`}>
                      <div className={`px-4 py-3 border-b ${colors.border}`}>
                        <p className="text-sm font-medium truncate">
                          {session?.user?.email}
                        </p>
                      </div>
                      <button
                        onClick={onLogout}
                        className={`w-full text-left px-4 py-2 text-sm ${theme === 'dark' ? 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10' : 'text-rose-600 hover:text-rose-500 hover:bg-rose-500/10'} transition-colors`}
                      >
                        <LogOut className="w-4 h-4 inline mr-2" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${colors.progressBg} backdrop-blur-sm px-4 py-2 rounded-full mb-6 border ${colors.border}`}>
            <Sparkles className={`w-4 h-4 ${colors.text} animate-pulse`} />
            <span className={`text-sm ${colors.text}`}>Green Cyan Mastery Path</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className={`bg-gradient-to-r ${colors.primaryLight} bg-clip-text text-transparent animate-gradient`}>
              Master DSA
            </span>
            <br />
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>With Precision</span>
          </h1>
          
          <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-8 max-w-3xl mx-auto`}>
            Track your progress across {categories.length} categories with green cyan precision. 
            Transform your skills with systematic practice.
          </p>
          
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <div className={`group relative bg-gradient-to-r ${theme === 'dark' ? 'from-black to-gray-900' : 'from-white to-gray-100'} px-4 py-2 rounded-lg border ${colors.border} ${colors.hoverBorder} transition-all duration-300`}>
              <div className="flex items-center gap-2">
                <Trophy className={`w-4 h-4 ${colors.text} group-hover:animate-bounce`} />
                <span className={colors.text}>{categories.length} Categories</span>
              </div>
            </div>
            <div className={`group relative bg-gradient-to-r ${theme === 'dark' ? 'from-black to-gray-900' : 'from-white to-gray-100'} px-4 py-2 rounded-lg border ${colors.solved} ${colors.hoverBorder} transition-all duration-300`}>
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-4 h-4 ${colors.solvedText} group-hover:animate-pulse`} />
                <span className={colors.solvedText}>{stats.solved} Problems Solved</span>
              </div>
            </div>
            <div className={`group relative bg-gradient-to-r ${theme === 'dark' ? 'from-black to-gray-900' : 'from-white to-gray-100'} px-4 py-2 rounded-lg border ${colors.border} ${colors.hoverBorder} transition-all duration-300`}>
              <div className="flex items-center gap-2">
                <Flame className={`w-4 h-4 ${colors.text} group-hover:animate-pulse`} />
                <span className={colors.text}>{stats.percentage}% Complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className={`mb-8 bg-gradient-to-r ${colors.cardBg} backdrop-blur-xl rounded-2xl p-6 border ${colors.border} shadow-2xl ${theme === 'dark' ? 'shadow-green-500/10' : 'shadow-green-500/5'}`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search problems by name or number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full px-4 py-3 pl-12 ${theme === 'dark' ? 'bg-black/30' : 'bg-white/50'} border ${colors.border} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${theme === 'dark' ? 'placeholder-green-500/50' : 'placeholder-green-600/50'} transition-all duration-300 ${theme === 'dark' ? 'focus:shadow-lg focus:shadow-green-500/20' : 'focus:shadow-lg focus:shadow-green-500/10'}`}
                />
                <div className="absolute left-4 top-3.5">
                  <Search className={`w-5 h-5 ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`} />
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className={`px-4 py-3 ${theme === 'dark' ? 'bg-black/30' : 'bg-white/50'} border ${colors.border} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'} transition-all duration-300 ${theme === 'dark' ? 'focus:shadow-lg focus:shadow-green-500/20' : 'focus:shadow-lg focus:shadow-green-500/10'}`}
              >
                <option value="All" className={theme === 'dark' ? 'bg-black' : 'bg-white'}>All Difficulties</option>
                <option value="Easy" className={theme === 'dark' ? 'bg-black' : 'bg-white'}>Easy</option>
                <option value="Medium" className={theme === 'dark' ? 'bg-black' : 'bg-white'}>Medium</option>
                <option value="Hard" className={theme === 'dark' ? 'bg-black' : 'bg-white'}>Hard</option>
              </select>
              
              <button
                onClick={toggleAllCategories}
                className={`group px-4 py-3 bg-gradient-to-r ${colors.button} border ${colors.buttonBorder} rounded-lg ${colors.buttonHoverBorder} transition-all duration-300 transform hover:scale-105`}
              >
                <span className={`${colors.buttonText} group-hover:${theme === 'dark' ? 'text-green-200' : 'text-green-700'}`}>
                  {Object.values(expandedCategories).every(v => v) ? 'Collapse All' : 'Expand All'}
                </span>
              </button>
              
              <button
                onClick={loadData}
                className={`group p-3 bg-gradient-to-r ${colors.button} border ${colors.buttonBorder} rounded-lg ${colors.buttonHoverBorder} transition-all duration-300 transform hover:scale-110 hover:rotate-180`}
                title="Refresh data"
              >
                <RefreshCw className={`w-5 h-5 ${colors.buttonText} group-hover:animate-spin`} />
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Gem className={`w-6 h-6 ${colors.text} animate-pulse`} />
              <span className={`bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent`}>
                Categories ({categories.length})
              </span>
            </h2>
            <div className={`text-sm ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>
              Total: {stats.total} problems • {stats.solved} solved
            </div>
          </div>

          {categories.length === 0 ? (
            <div className={`text-center py-12 bg-gradient-to-br ${colors.cardBg} rounded-2xl border ${colors.border}`}>
              <div className="text-5xl mb-4">📝</div>
              <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>No Categories Found</h3>
              <p className={theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}>Add problems to your database</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => {
                const categoryProblems = problemsByCategory[category] || []
                const filteredProblems = getFilteredProblems(categoryProblems)
                const categoryStats = getCategoryStats(category)
                const isExpanded = expandedCategories[category] || false
                
                return (
                  <div 
                    key={category} 
                    className={`group bg-gradient-to-br ${colors.cardBg} backdrop-blur-xl rounded-2xl overflow-hidden border ${colors.border} ${colors.hoverBorder} transition-all duration-500 ${theme === 'dark' ? 'hover:shadow-2xl hover:shadow-green-500/10' : 'hover:shadow-2xl hover:shadow-green-500/5'}`}
                  >
                    {/* Category Header */}
                    <div 
                      className="p-4 md:p-6 cursor-pointer hover:bg-gradient-to-r hover:from-green-500/5 hover:to-cyan-500/5 transition-all duration-300"
                      onClick={() => toggleCategory(category)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className={`p-2 md:p-3 bg-gradient-to-r ${colors.progressBg} rounded-xl border ${colors.border} group-hover:${colors.hoverBorder} transition-all duration-300`}>
                            {categoryIcons[category] || <Grid className={`w-5 h-5 md:w-6 md:h-6 ${colors.text}`} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`text-lg md:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {category}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-1">
                              <span className={`text-sm ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>
                                {categoryStats.total} problems
                              </span>
                              <span className={`text-sm ${colors.solvedText}`}>
                                {categoryStats.solved} solved
                              </span>
                              <span className={`text-sm px-2 py-1 rounded-full ${
                                categoryStats.percentage === 100 ? `bg-gradient-to-r ${colors.solved} ${colors.solvedText}` :
                                categoryStats.percentage >= 50 ? `bg-gradient-to-r ${colors.progressBg} ${colors.text}` : 'bg-gradient-to-r from-rose-500/20 to-red-500/20 text-rose-400'
                              }`}>
                                {categoryStats.percentage}% complete
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="hidden md:block w-24 bg-gray-800 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-1000 ${
                                categoryStats.percentage === 100 ? `bg-gradient-to-r ${colors.solved}` :
                                categoryStats.percentage >= 50 ? `bg-gradient-to-r ${colors.progress}` : 'bg-gradient-to-r from-rose-500 to-red-500'
                              }`}
                              style={{ width: `${categoryStats.percentage}%` }}
                            ></div>
                          </div>
                          
                          {isExpanded ? (
                            <ChevronUp className={`w-5 h-5 ${colors.text} group-hover:${theme === 'dark' ? 'text-green-300' : 'text-green-700'} transition-colors`} />
                          ) : (
                            <ChevronDown className={`w-5 h-5 ${colors.text} group-hover:${theme === 'dark' ? 'text-green-300' : 'text-green-700'} transition-colors`} />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Problems List */}
                    {isExpanded && filteredProblems.length > 0 && (
                      <div className={`border-t ${colors.border}`}>
                        <div className="p-2 md:p-4">
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px]">
                              <thead className={`bg-gradient-to-r ${colors.progressBg}`}>
                                <tr>
                                  <th className={`p-3 text-left text-sm font-semibold ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>Status</th>
                                  <th className={`p-3 text-left text-sm font-semibold ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>#</th>
                                  <th className={`p-3 text-left text-sm font-semibold ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>Problem Name</th>
                                  <th className={`p-3 text-left text-sm font-semibold ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>Difficulty</th>
                                  <th className={`p-3 text-left text-sm font-semibold ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredProblems.map((problem, index) => (
                                  <tr 
                                    key={problem.id} 
                                    className={`border-b ${colors.border} hover:bg-gradient-to-r hover:from-green-500/5 hover:to-cyan-500/5 transition-all duration-300 ${
                                      index % 2 === 0 ? (theme === 'dark' ? 'bg-black/20' : 'bg-gray-50') : 'bg-transparent'
                                    }`}
                                  >
                                    {/* Solved Status */}
                                    <td className="p-3">
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => {
                                            if (problem.solved) {
                                              handleMarkUnsolved(problem.problem_number, category)
                                            } else {
                                              openProblemModal(problem)
                                            }
                                          }}
                                          className={`group relative w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
                                            problem.solved 
                                              ? `bg-gradient-to-r ${colors.solved} shadow-lg ${theme === 'dark' ? 'shadow-emerald-500/25' : 'shadow-emerald-500/15'}` 
                                              : `${theme === 'dark' ? 'bg-gradient-to-r from-gray-800 to-black' : 'bg-gradient-to-r from-gray-100 to-white'} border ${colors.buttonBorder} ${colors.buttonHoverBorder}`
                                          }`}
                                          title={problem.solved ? 'Mark as unsolved' : 'Mark as solved'}
                                        >
                                          {problem.solved ? (
                                            <Check className="w-4 h-4 text-white" />
                                          ) : (
                                            <div className={`w-3 h-3 rounded-full border-2 ${theme === 'dark' ? 'border-green-500/50' : 'border-green-600/50'} group-hover:${theme === 'dark' ? 'border-green-300' : 'border-green-700'}`}></div>
                                          )}
                                        </button>
                                      </div>
                                    </td>
                                    
                                    {/* Problem Number */}
                                    <td className="p-3">
                                      <span className={`font-mono ${theme === 'dark' ? 'text-green-300/90' : 'text-green-600/90'}`}>
                                        #{problem.problem_number}
                                      </span>
                                    </td>
                                    
                                    {/* Problem Name */}
                                    <td className="p-3">
                                      <div className={`font-medium group-hover:${colors.text} transition-colors`}>
                                        {problem.name}
                                      </div>
                                      <div className={`text-xs ${theme === 'dark' ? 'text-green-500/50' : 'text-green-600/50'} mt-1 truncate max-w-[200px]`}>
                                        {problem.leetcode_link?.replace('https://leetcode.com/problems/', '')}
                                      </div>
                                    </td>
                                    
                                    {/* Difficulty */}
                                    <td className="p-3">
                                      <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${getDifficultyColor(problem.difficulty)}`}>
                                        {problem.difficulty}
                                      </span>
                                    </td>
                                    
                                    {/* Actions */}
                                    <td className="p-3">
                                      <div className="flex items-center gap-2">
                                        <a
                                          href={problem.leetcode_link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className={`group relative px-3 py-1.5 bg-gradient-to-r ${colors.button} border ${colors.buttonBorder} rounded-lg ${colors.buttonText} ${colors.buttonHoverBorder} transition-all duration-300 transform hover:scale-105`}
                                        >
                                          <span className="flex items-center gap-1">
                                            Solve
                                            <ExternalLink className="w-3 h-3" />
                                          </span>
                                        </a>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Empty category */}
                    {isExpanded && filteredProblems.length === 0 && (
                      <div className={`border-t ${colors.border} p-6 text-center`}>
                        <p className={theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}>
                          {searchQuery || selectedDifficulty !== 'All' 
                            ? 'No problems match your search criteria'
                            : 'No problems found in this category'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className={`group relative bg-gradient-to-br ${colors.cardBg} backdrop-blur-xl rounded-2xl p-6 border ${colors.solved} ${colors.hoverBorder} transition-all duration-500 ${theme === 'dark' ? 'hover:shadow-2xl hover:shadow-emerald-500/10' : 'hover:shadow-2xl hover:shadow-emerald-500/5'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${colors.solved} rounded-xl border ${colors.border}`}>
                <CheckCircle className={`w-6 h-6 ${colors.solvedText}`} />
              </div>
              <Flame className={`w-5 h-5 ${colors.solvedText} group-hover:animate-pulse`} />
            </div>
            <div className={`text-3xl font-bold bg-gradient-to-r ${colors.solvedLight} bg-clip-text text-transparent`}>
              {stats.solved}
            </div>
            <div className={colors.solvedText}>Problems Solved</div>
          </div>
          
          <div className={`group relative bg-gradient-to-br ${colors.cardBg} backdrop-blur-xl rounded-2xl p-6 border ${colors.border} ${colors.hoverBorder} transition-all duration-500 ${theme === 'dark' ? 'hover:shadow-2xl hover:shadow-green-500/10' : 'hover:shadow-2xl hover:shadow-green-500/5'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${colors.progressBg} rounded-xl border ${colors.border}`}>
                <Target className={`w-6 h-6 ${colors.text}`} />
              </div>
              <Lightning className={`w-5 h-5 ${colors.text} group-hover:animate-pulse`} />
            </div>
            <div className={`text-3xl font-bold bg-gradient-to-r ${colors.primaryLight} bg-clip-text text-transparent`}>
              {stats.total}
            </div>
            <div className={colors.text}>Total Problems</div>
          </div>
          
          <div className={`group relative bg-gradient-to-br ${colors.cardBg} backdrop-blur-xl rounded-2xl p-6 border ${colors.border} ${colors.hoverBorder} transition-all duration-500 ${theme === 'dark' ? 'hover:shadow-2xl hover:shadow-green-500/10' : 'hover:shadow-2xl hover:shadow-green-500/5'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${colors.progressBg} rounded-xl border ${colors.border}`}>
                <BarChart3 className={`w-6 h-6 ${colors.text}`} />
              </div>
              <TrendingUp className={`w-5 h-5 ${colors.text} group-hover:animate-pulse`} />
            </div>
            <div className={`text-3xl font-bold bg-gradient-to-r ${colors.primaryLight} bg-clip-text text-transparent`}>
              {stats.percentage}%
            </div>
            <div className={colors.text}>Progress</div>
          </div>
          
          <div className={`group relative bg-gradient-to-br ${colors.cardBg} backdrop-blur-xl rounded-2xl p-6 border ${colors.border} ${colors.hoverBorder} transition-all duration-500 ${theme === 'dark' ? 'hover:shadow-2xl hover:shadow-green-500/10' : 'hover:shadow-2xl hover:shadow-green-500/5'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${colors.progressBg} rounded-xl border ${colors.border}`}>
                <Crown className={`w-6 h-6 ${colors.text}`} />
              </div>
              <Gem className={`w-5 h-5 ${colors.text} group-hover:animate-bounce`} />
            </div>
            <div className={`text-3xl font-bold bg-gradient-to-r ${colors.primaryLight} bg-clip-text text-transparent`}>
              {categories.length}
            </div>
            <div className={colors.text}>Categories</div>
          </div>
        </div>

        {/* Footer Section */}
        <div className={`bg-gradient-to-br ${colors.cardBg} backdrop-blur-xl rounded-2xl p-8 border ${colors.border}`}>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className={`w-5 h-5 ${colors.text} animate-pulse`} />
              <span className={colors.text}>Ready for the Challenge?</span>
              <Sparkles className={`w-5 h-5 ${colors.text} animate-pulse`} />
            </div>
            <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Start Your Journey to DSA Mastery
            </h3>
            <p className={`${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'} mb-6 max-w-2xl mx-auto`}>
              Track your progress, solve problems systematically, and transform into a DSA champion with our green cyan tracking system.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => navigate('/sheets')}
                className={`group px-6 py-3 bg-gradient-to-r ${colors.primaryDark} hover:${colors.primary} text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${theme === 'dark' ? 'hover:shadow-2xl hover:shadow-green-500/30' : 'hover:shadow-2xl hover:shadow-green-500/20'}`}
              >
                <span className="flex items-center gap-2">
                  View Sheets
                  <LayoutGrid className="w-4 h-4 group-hover:animate-bounce" />
                </span>
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className={`group px-6 py-3 bg-gradient-to-r ${colors.primaryDark} hover:${colors.primary} text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${theme === 'dark' ? 'hover:shadow-2xl hover:shadow-green-500/30' : 'hover:shadow-2xl hover:shadow-green-500/20'}`}
              >
                <span className="flex items-center gap-2">
                  View Dashboard
                  <TrendingUp className="w-4 h-4 group-hover:animate-bounce" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Main App Component
function App() {
  // Authentication state
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authView, setAuthView] = useState('login') // 'login' or 'signup'
  const [theme, setTheme] = useState('dark') // 'dark' or 'light'
  
  // Auth form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')

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

  // Initialize - check session
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

  // Authentication functions
  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')

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

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) throw error
      
      // Show success message
      if (data.user) {
        setAuthError('Check your email for confirmation link!')
        setTimeout(() => {
          setAuthView('login')
          setAuthError('')
        }, 3000)
      }
      
    } catch (err) {
      setAuthError(err.message)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    console.log('Logging out...')
    await supabase.auth.signOut()
  }

  // Loading state
  if (loading) {
    const authColors = getAuthColors()
    return (
      <div className={`min-h-screen bg-gradient-to-br ${authColors.bg} ${theme === 'dark' ? 'text-white' : 'text-gray-900'} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 ${theme === 'dark' ? 'border-green-500' : 'border-green-600'} mx-auto mb-4`}></div>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Loading...</p>
          <p className={`text-sm ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'} mt-2`}>Preparing your journey</p>
        </div>
      </div>
    )
  }

  // If not logged in, show auth page
  if (!session) {
    const authColors = getAuthColors()
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
                  DSA Tracker
                </span>
              </h1>
              <p className={`${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>Green Cyan Mastery</p>
            </div>

            <div className={`bg-gradient-to-br ${authColors.cardBg} backdrop-blur-xl rounded-2xl p-8 border ${authColors.border} ${theme === 'dark' ? 'shadow-2xl shadow-green-500/10' : 'shadow-2xl shadow-green-500/5'}`}>
              <div className="text-center mb-8">
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {authView === 'login' ? 'Welcome Back' : 'Start Your Journey'}
                </h2>
                <p className={`${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>
                  {authView === 'login' 
                    ? 'Sign in to track your progress' 
                    : 'Create an account and begin your mastery'
                  }
                </p>
              </div>

              {/* Google Sign In */}
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

              {/* Email/Password Form */}
              <form onSubmit={authView === 'login' ? handleEmailLogin : handleSignup} className="space-y-4">
                {authError && (
                  <div className={`p-3 rounded-lg ${
                    authError.includes('Check your email') 
                      ? `bg-emerald-500/10 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'} ${theme === 'dark' ? 'border-emerald-500/20' : 'border-emerald-500/30'}` 
                      : `bg-rose-500/10 ${theme === 'dark' ? 'text-rose-400' : 'text-rose-600'} ${theme === 'dark' ? 'border-rose-500/20' : 'border-rose-500/30'}`
                  } border`}>
                    {authError}
                  </div>
                )}

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-black/30' : 'bg-white/50'} border ${authColors.border} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${theme === 'dark' ? 'placeholder-green-500/50' : 'placeholder-green-600/50'} transition-all duration-300`}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-black/30' : 'bg-white/50'} border ${authColors.border} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${theme === 'dark' ? 'placeholder-green-500/50' : 'placeholder-green-600/50'} transition-all duration-300`}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className={`group w-full py-3 bg-gradient-to-r ${authColors.primary} hover:opacity-90 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50`}
                >
                  {authLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Loading...
                    </span>
                  ) : authView === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
              </form>

              <div className="text-center mt-6">
                <button
                  onClick={() => {
                    setAuthView(authView === 'login' ? 'signup' : 'login')
                    setAuthError('')
                  }}
                  className={`text-sm ${theme === 'dark' ? 'text-green-500/70 hover:text-green-300' : 'text-green-600/70 hover:text-green-700'} transition-colors`}
                >
                  {authView === 'login' 
                    ? "Don't have an account? Start your journey" 
                    : "Already have an account? Continue your journey"
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main app with routing (logged in)
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <MainApp 
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
      </Routes>
    </Router>
  )
}

export default App