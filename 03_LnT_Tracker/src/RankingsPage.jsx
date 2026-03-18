import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabase'
import {
  Trophy,
  Crown,
  Medal,
  Award,
  TrendingUp,
  User,
  Star,
  Target,
  Clock,
  Calendar,
  Search,
  Filter,
  Home,
  RefreshCw,
  Loader,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Users,
  Hash,
  CheckCircle,
  Eye,
  BarChart3,
  Activity,
  Sparkles,
  Flame,
  Zap,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Target as TargetIcon,
  Gem,
  ChevronRight,
  Crown as CrownIcon,
  Award as AwardIcon,
  Book,
  Grid,
  Layers as LayersIcon,
  Zap as Lightning,
  Trophy as TrophyIcon
} from 'lucide-react'

function RankingsPage({ session, theme }) {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('solvedCount')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentUserRank, setCurrentUserRank] = useState(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState('all')
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProblemsSolved: 0,
    averageSolved: 0,
    topScore: 0
  })

  // Theme-based colors - EXACTLY SAME AS HOMEPAGE
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

  const getRankIcon = (rank) => {
    if (rank === 1) {
      return <Crown className="w-6 h-6 fill-yellow-500 text-yellow-500 animate-bounce" />
    } else if (rank === 2) {
      return <Medal className="w-6 h-6 fill-gray-400 text-gray-400" />
    } else if (rank === 3) {
      return <Medal className="w-6 h-6 fill-amber-700 text-amber-700" />
    } else if (rank <= 10) {
      return <Star className="w-5 h-5 text-purple-500 animate-pulse" />
    } else if (rank <= 50) {
      return <Award className="w-5 h-5 text-green-500" />
    }
    return <Hash className="w-4 h-4 text-gray-500" />
  }

  const getRankBadgeColor = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white'
    if (rank === 2) return 'bg-gradient-to-r from-gray-400 to-slate-300 text-white'
    if (rank === 3) return 'bg-gradient-to-r from-amber-700 to-orange-600 text-white'
    if (rank <= 10) return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
    if (rank <= 50) return 'bg-gradient-to-r from-green-500 to-cyan-500 text-white'
    return theme === 'dark' ? 'bg-gradient-to-r from-gray-700 to-gray-500 text-gray-300' : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700'
  }

  const getRankColor = (rank) => {
    if (rank === 1) return 'from-yellow-500 to-amber-500'
    if (rank === 2) return 'from-gray-400 to-slate-300'
    if (rank === 3) return 'from-amber-700 to-orange-600'
    if (rank <= 10) return 'from-purple-500 to-pink-500'
    if (rank <= 50) return 'from-green-500 to-cyan-500'
    return theme === 'dark' ? 'from-gray-600 to-gray-400' : 'from-gray-400 to-gray-600'
  }

  const getUserInitials = (email) => {
    if (!email) return '?'
    return email.substring(0, 2).toUpperCase()
  }

  const getUserDisplayName = (user) => {
    if (user.name && user.name !== 'undefined') return user.name
    if (user.email) return user.email.split('@')[0]
    return 'Anonymous'
  }

  useEffect(() => {
    loadRankings()
  }, [session, selectedTimeframe])

  const loadRankings = async () => {
    try {
      setLoading(true)

      // Fetch all users from Supabase Auth
      let allUsers = []
      try {
        const { data: { users: authUsers }, error: usersError } = await supabase.auth.admin.listUsers()
        if (usersError) {
          console.warn('Cannot fetch users as admin, trying alternative method:', usersError)
        } else {
          allUsers = authUsers || []
        }
      } catch (authError) {
        console.warn('Auth admin access not available:', authError)
      }

      // If we couldn't get users from auth, fetch from user_progress table
      if (allUsers.length === 0) {
        try {
          // Get unique user IDs from user_progress table
          const { data: progressData, error: progressError } = await supabase
            .from('user_progress')
            .select('user_id')
            .eq('solved', true)

          if (progressError) throw progressError

          // Extract unique user IDs
          const uniqueUserIds = [...new Set(progressData.map(p => p.user_id))]

          // For each user ID, try to get their profile
          allUsers = await Promise.all(
            uniqueUserIds.map(async (userId) => {
              try {
                // Try to get user info from auth (if accessible)
                const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId)
                if (!userError && user) {
                  return user
                }
              } catch (e) {
                console.warn(`Cannot get user ${userId}:`, e)
              }

              // Return minimal user object if we can't get auth info
              return {
                id: userId,
                email: `user_${userId.substring(0, 8)}`,
                user_metadata: { name: `User_${userId.substring(0, 8)}` }
              }
            })
          )
        } catch (fetchError) {
          console.error('Error fetching user data:', fetchError)
        }
      }

      // Fetch all solved problems from user_progress
      const { data: allProgress, error: progressError } = await supabase
        .from('user_progress')
        .select('user_id, problem_id, solved, solved_at')
        .eq('solved', true)

      if (progressError) {
        console.error('Error fetching progress:', progressError)
        setLoading(false)
        return
      }

      // Calculate solved counts for each user
      const userStats = {}
      const now = new Date()
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

      // Initialize all users with zero solved
      allUsers.forEach(user => {
        if (user && user.id) {
          userStats[user.id] = {
            id: user.id,
            email: user.email || `user_${user.id.substring(0, 8)}`,
            name: user.user_metadata?.name || user.email?.split('@')[0] || `User_${user.id.substring(0, 8)}`,
            solvedCount: 0,
            solvedRecently: 0,
            solvedThisWeek: 0,
            solvedThisMonth: 0,
            lastSolve: null,
            streak: 0
          }
        }
      })

      // Count solved problems for each user
      if (allProgress && allProgress.length > 0) {
        allProgress.forEach(progress => {
          const userId = progress.user_id
          const solvedAt = progress.solved_at ? new Date(progress.solved_at) : null
          
          if (userStats[userId]) {
            userStats[userId].solvedCount++
            
            // Track timeframe stats
            if (solvedAt) {
              if (solvedAt > oneDayAgo) {
                userStats[userId].solvedRecently++
              }
              if (solvedAt > oneWeekAgo) {
                userStats[userId].solvedThisWeek++
              }
              if (solvedAt > oneMonthAgo) {
                userStats[userId].solvedThisMonth++
              }

              // Track last solve
              if (!userStats[userId].lastSolve || solvedAt > userStats[userId].lastSolve) {
                userStats[userId].lastSolve = solvedAt
              }
            }
          } else {
            // User not in our list yet, add them
            userStats[userId] = {
              id: userId,
              email: `user_${userId.substring(0, 8)}@example.com`,
              name: `User_${userId.substring(0, 8)}`,
              solvedCount: 1,
              solvedRecently: solvedAt && solvedAt > oneDayAgo ? 1 : 0,
              solvedThisWeek: solvedAt && solvedAt > oneWeekAgo ? 1 : 0,
              solvedThisMonth: solvedAt && solvedAt > oneMonthAgo ? 1 : 0,
              lastSolve: solvedAt,
              streak: 0
            }
          }
        })

        // Calculate streaks (simplified - check if solved within last day)
        Object.keys(userStats).forEach(userId => {
          const stats = userStats[userId]
          if (stats.lastSolve) {
            const daysSinceLastSolve = Math.floor((now - stats.lastSolve) / (1000 * 60 * 60 * 24))
            if (daysSinceLastSolve <= 1) {
              // Count consecutive days with solves (simplified)
              stats.streak = Math.min(Math.floor(stats.solvedCount / 2), 30) // Cap at 30 for display
            }
          }
        })
      }

      // Prepare data for display - filter out users with 0 solved unless it's current user
      const usersWithStats = Object.values(userStats)
        .map(stats => ({
          id: stats.id,
          email: stats.email,
          name: stats.name,
          avatar: null, // We don't have avatar URLs from user_progress table
          solvedCount: stats.solvedCount,
          solvedRecently: stats.solvedRecently,
          solvedThisWeek: stats.solvedThisWeek,
          solvedThisMonth: stats.solvedThisMonth,
          streak: stats.streak,
          lastSolve: stats.lastSolve,
          isCurrentUser: session?.user?.id === stats.id
        }))
        .filter(user => user.solvedCount > 0 || user.isCurrentUser) // Show only users with solves OR current user

      // Sort users based on selected timeframe
      const sortedUsers = [...usersWithStats].sort((a, b) => {
        let aValue, bValue
        
        switch(selectedTimeframe) {
          case 'daily':
            aValue = a.solvedRecently
            bValue = b.solvedRecently
            break
          case 'weekly':
            aValue = a.solvedThisWeek
            bValue = b.solvedThisWeek
            break
          case 'monthly':
            aValue = a.solvedThisMonth
            bValue = b.solvedThisMonth
            break
          default:
            aValue = a.solvedCount
            bValue = b.solvedCount
        }
        
        return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
      })

      // Find current user's rank
      if (session) {
        const currentUserIndex = sortedUsers.findIndex(user => user.id === session.user.id)
        if (currentUserIndex !== -1) {
          setCurrentUserRank({
            rank: currentUserIndex + 1,
            ...sortedUsers[currentUserIndex]
          })
        } else {
          // Current user not in rankings (no solved problems), create a placeholder
          const currentUserStats = userStats[session.user.id] || {
            id: session.user.id,
            email: session.user.email,
            name: session.user.email.split('@')[0],
            solvedCount: 0,
            solvedRecently: 0,
            solvedThisWeek: 0,
            solvedThisMonth: 0,
            streak: 0
          }
          
          setCurrentUserRank({
            rank: sortedUsers.length + 1,
            ...currentUserStats,
            isCurrentUser: true
          })
        }
      }

      // Calculate global stats
      const totalUsers = sortedUsers.length
      const totalProblemsSolved = sortedUsers.reduce((sum, user) => sum + user.solvedCount, 0)
      const averageSolved = totalUsers > 0 ? Math.round(totalProblemsSolved / totalUsers) : 0
      const topScore = sortedUsers.length > 0 ? sortedUsers[0]?.solvedCount || 0 : 0

      setUsers(sortedUsers)
      setStats({
        totalUsers,
        totalProblemsSolved,
        averageSolved,
        topScore
      })
      setLoading(false)

    } catch (err) {
      console.error('Error loading rankings:', err)
      // Show empty state instead of mock data
      setUsers([])
      setStats({
        totalUsers: 0,
        totalProblemsSolved: 0,
        averageSolved: 0,
        topScore: 0
      })
      if (session) {
        setCurrentUserRank({
          rank: 1,
          id: session.user.id,
          name: session.user.email.split('@')[0],
          email: session.user.email,
          solvedCount: 0,
          solvedRecently: 0,
          solvedThisWeek: 0,
          solvedThisMonth: 0,
          streak: 0,
          isCurrentUser: true
        })
      }
      setLoading(false)
    }
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const getTimeframeValue = (user) => {
    switch(selectedTimeframe) {
      case 'daily': return user.solvedRecently
      case 'weekly': return user.solvedThisWeek
      case 'monthly': return user.solvedThisMonth
      default: return user.solvedCount
    }
  }

  const getTimeframeLabel = () => {
    switch(selectedTimeframe) {
      case 'daily': return 'Today'
      case 'weekly': return 'This Week'
      case 'monthly': return 'This Month'
      default: return 'All Time'
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${colors.bg} ${theme === 'dark' ? 'text-white' : 'text-gray-900'} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 ${colors.primary} mx-auto mb-4`}></div>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Loading rankings...</p>
          <p className={`text-sm ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'} mt-2`}>Analyzing leaderboard data</p>
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

      {/* Header */}
      <header className={`sticky top-0 z-50 ${colors.headerBg} backdrop-blur-xl border-b ${colors.border}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'} transition-all`}
              >
                <Home className={`w-5 h-5 ${colors.text}`} />
              </button>
              <div>
                <h1 className={`text-2xl font-bold bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent flex items-center gap-2`}>
                  <Trophy className="w-6 h-6" />
                  Leaderboard
                </h1>
                <p className={`text-xs ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>
                  {stats.totalUsers} active problem solvers
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={loadRankings}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'} border ${colors.buttonBorder} ${colors.buttonHoverBorder} transition-all`}
              >
                <RefreshCw className={`w-5 h-5 ${colors.text}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${colors.progressBg} backdrop-blur-sm px-4 py-2 rounded-full mb-6 border ${colors.border}`}>
            <Sparkles className={`w-4 h-4 ${colors.text} animate-pulse`} />
            <span className={`text-sm ${colors.text}`}>Global Rankings • Green Cyan Edition</span>
            <Sparkles className={`w-4 h-4 ${colors.text} animate-pulse`} />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className={`bg-gradient-to-r ${colors.primaryLight} bg-clip-text text-transparent animate-gradient`}>
              Global Leaderboard
            </span>
            <br />
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Where Legends Compete</span>
          </h1>
          
          <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-8 max-w-3xl mx-auto`}>
            See where you stand among {stats.totalUsers} problem solvers. Track progress, compete with peers, and climb the ranks.
          </p>
        </div>

        {/* Current User Stats Card */}
        {currentUserRank && (
          <div className={`mb-8 bg-gradient-to-br ${colors.cardBg} backdrop-blur-xl rounded-2xl p-6 border ${currentUserRank.isCurrentUser ? `border ${colors.solved}` : colors.border} shadow-2xl ${theme === 'dark' ? 'shadow-green-500/10' : 'shadow-green-500/5'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`relative p-4 rounded-xl bg-gradient-to-r ${getRankBadgeColor(currentUserRank.rank)}`}>
                  <span className="text-2xl font-bold">{currentUserRank.rank}</span>
                  <div className="absolute -top-2 -right-2">
                    {getRankIcon(currentUserRank.rank)}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-xl font-bold ${currentUserRank.isCurrentUser ? colors.solvedText : theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {getUserDisplayName(currentUserRank)}
                      {currentUserRank.isCurrentUser && (
                        <span className="ml-2 text-xs bg-gradient-to-r from-green-500/20 to-cyan-500/20 text-green-300 px-2 py-0.5 rounded-full">You</span>
                      )}
                    </h3>
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'} mt-1`}>
                    {currentUserRank.email}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-3xl font-bold bg-gradient-to-r ${getRankColor(currentUserRank.rank)} bg-clip-text text-transparent`}>
                  {getTimeframeValue(currentUserRank)}
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>
                  {getTimeframeLabel()} Solved
                </div>
                {currentUserRank.streak > 0 && (
                  <div className={`inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-gradient-to-r ${colors.solved} text-white text-sm`}>
                    <Flame className="w-3 h-3" />
                    {currentUserRank.streak} day streak
                  </div>
                )}
              </div>
            </div>
            
            {currentUserRank.isCurrentUser && currentUserRank.solvedCount === 0 && (
              <div className={`mt-4 p-3 rounded-lg bg-gradient-to-r ${colors.progressBg} border ${colors.border}`}>
                <p className={`text-sm ${colors.text}`}>
                  <TargetIcon className="w-4 h-4 inline mr-2" />
                  Start solving problems to appear on the leaderboard!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Search and Timeframe Filters */}
        <div className={`mb-8 bg-gradient-to-r ${colors.cardBg} backdrop-blur-xl rounded-2xl p-6 border ${colors.border} shadow-2xl ${theme === 'dark' ? 'shadow-green-500/10' : 'shadow-green-500/5'}`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users by name or email..."
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
              <div className={`flex items-center gap-2 px-4 py-3 ${theme === 'dark' ? 'bg-black/30' : 'bg-white/50'} border ${colors.border} rounded-lg backdrop-blur-sm`}>
                <Activity className={`w-5 h-5 ${colors.text}`} />
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className={`${theme === 'dark' ? 'bg-transparent text-white' : 'bg-transparent text-gray-900'} focus:outline-none`}
                >
                  <option value="all">All Time</option>
                  <option value="monthly">This Month</option>
                  <option value="weekly">This Week</option>
                  <option value="daily">Today</option>
                </select>
              </div>
              
              <button
                onClick={() => handleSort('solvedCount')}
                className={`group px-4 py-3 bg-gradient-to-r ${colors.button} border ${colors.buttonBorder} rounded-lg ${colors.buttonHoverBorder} transition-all duration-300 transform hover:scale-105`}
              >
                <span className={`${colors.buttonText} group-hover:${theme === 'dark' ? 'text-green-200' : 'text-green-700'} flex items-center gap-2`}>
                  Sort by Score
                  {sortBy === 'solvedCount' && (
                    sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className={`group relative bg-gradient-to-br ${colors.cardBg} backdrop-blur-xl rounded-2xl p-6 border ${colors.solved} ${colors.hoverBorder} transition-all duration-500 ${theme === 'dark' ? 'hover:shadow-2xl hover:shadow-emerald-500/10' : 'hover:shadow-2xl hover:shadow-emerald-500/5'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${colors.solved} rounded-xl border ${colors.border}`}>
                <Users className={`w-6 h-6 ${colors.solvedText}`} />
              </div>
              <Gem className={`w-5 h-5 ${colors.solvedText} group-hover:animate-bounce`} />
            </div>
            <div className={`text-3xl font-bold bg-gradient-to-r ${colors.solvedLight} bg-clip-text text-transparent`}>
              {stats.totalUsers}
            </div>
            <div className={colors.solvedText}>Active Solvers</div>
          </div>
          
          <div className={`group relative bg-gradient-to-br ${colors.cardBg} backdrop-blur-xl rounded-2xl p-6 border ${colors.border} ${colors.hoverBorder} transition-all duration-500 ${theme === 'dark' ? 'hover:shadow-2xl hover:shadow-green-500/10' : 'hover:shadow-2xl hover:shadow-green-500/5'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${colors.progressBg} rounded-xl border ${colors.border}`}>
                <CheckCircle className={`w-6 h-6 ${colors.text}`} />
              </div>
              <TargetIcon className={`w-5 h-5 ${colors.text} group-hover:animate-pulse`} />
            </div>
            <div className={`text-3xl font-bold bg-gradient-to-r ${colors.primaryLight} bg-clip-text text-transparent`}>
              {stats.totalProblemsSolved}
            </div>
            <div className={colors.text}>Total Solved</div>
          </div>
          
          <div className={`group relative bg-gradient-to-br ${colors.cardBg} backdrop-blur-xl rounded-2xl p-6 border ${colors.border} ${colors.hoverBorder} transition-all duration-500 ${theme === 'dark' ? 'hover:shadow-2xl hover:shadow-green-500/10' : 'hover:shadow-2xl hover:shadow-green-500/5'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${colors.progressBg} rounded-xl border ${colors.border}`}>
                <BarChart3 className={`w-6 h-6 ${colors.text}`} />
              </div>
              <TrendingUp className={`w-5 h-5 ${colors.text} group-hover:animate-pulse`} />
            </div>
            <div className={`text-3xl font-bold bg-gradient-to-r ${colors.primaryLight} bg-clip-text text-transparent`}>
              {stats.averageSolved}
            </div>
            <div className={colors.text}>Average Solved</div>
          </div>
          
          <div className={`group relative bg-gradient-to-br ${colors.cardBg} backdrop-blur-xl rounded-2xl p-6 border ${colors.border} ${colors.hoverBorder} transition-all duration-500 ${theme === 'dark' ? 'hover:shadow-2xl hover:shadow-green-500/10' : 'hover:shadow-2xl hover:shadow-green-500/5'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${colors.progressBg} rounded-xl border ${colors.border}`}>
                <Crown className={`w-6 h-6 ${colors.text}`} />
              </div>
              <TrophyIcon className={`w-5 h-5 ${colors.text} group-hover:animate-bounce`} />
            </div>
            <div className={`text-3xl font-bold bg-gradient-to-r ${colors.primaryLight} bg-clip-text text-transparent`}>
              {stats.topScore}
            </div>
            <div className={colors.text}>Top Score</div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className={`bg-gradient-to-br ${colors.cardBg} backdrop-blur-xl rounded-2xl border ${colors.border} overflow-hidden shadow-2xl ${theme === 'dark' ? 'shadow-green-500/10' : 'shadow-green-500/5'}`}>
          {/* Leaderboard Header */}
          <div className={`${theme === 'dark' ? 'bg-black/40' : 'bg-white/30'} p-6 border-b ${colors.border}`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-2xl font-bold flex items-center gap-2 ${colors.text}`}>
                <Trophy className="w-6 h-6" />
                {getTimeframeLabel()} Rankings
              </h2>
              <div className={`text-sm ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>
                Showing {filteredUsers.length} of {users.length} users
              </div>
            </div>
          </div>

          {/* Leaderboard Content */}
          <div className="divide-y divide-green-500/10">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center">
                <AlertCircle className={`w-16 h-16 ${theme === 'dark' ? 'text-green-500/50' : 'text-green-600/50'} mx-auto mb-4`} />
                <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {users.length === 0 ? 'No Rankings Yet' : 'No Users Found'}
                </h3>
                <p className={theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}>
                  {users.length === 0 
                    ? 'Be the first to solve problems and appear on the leaderboard!' 
                    : 'Try a different search term'}
                </p>
              </div>
            ) : (
              filteredUsers.map((user, index) => {
                const rank = index + 1
                const isTop3 = rank <= 3
                const timeframeValue = getTimeframeValue(user)
                
                return (
                  <div
                    key={user.id}
                    className={`p-4 md:p-6 transition-all duration-300 hover:bg-gradient-to-r hover:from-green-500/5 hover:to-cyan-500/5 ${
                      user.isCurrentUser ? `border-l-4 ${theme === 'dark' ? 'border-green-500' : 'border-green-600'} bg-gradient-to-r ${theme === 'dark' ? 'from-green-500/10' : 'from-green-600/10'} to-transparent` : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="flex-shrink-0">
                        <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center ${
                          isTop3 ? 'scale-110 transform' : ''
                        }`}>
                          <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${getRankColor(rank)} ${isTop3 ? 'animate-pulse' : ''}`}></div>
                          <div className="relative z-10">
                            <div className="flex items-center justify-center">
                              {getRankIcon(rank)}
                            </div>
                            <div className={`text-xs font-bold mt-1 text-center ${
                              isTop3 ? 'text-white' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              #{rank}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r ${colors.primary} ${
                            user.isCurrentUser ? 'ring-2 ring-green-500' : ''
                          }`}>
                            <span className="text-white font-bold">
                              {getUserInitials(user.email)}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className={`font-bold truncate ${
                                user.isCurrentUser ? colors.solvedText : theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {getUserDisplayName(user)}
                                {user.isCurrentUser && (
                                  <span className="ml-2 text-xs bg-gradient-to-r from-green-500/20 to-cyan-500/20 text-green-300 px-2 py-0.5 rounded-full">You</span>
                                )}
                              </h3>
                              {isTop3 && (
                                <span className={`text-xs px-2 py-1 rounded-full ${getRankBadgeColor(rank)}`}>
                                  {rank === 1 ? '🏆 Champion' : rank === 2 ? '🥈 Runner-up' : '🥉 Third Place'}
                                </span>
                              )}
                            </div>
                            <p className={`text-sm ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'} truncate`}>
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="hidden md:flex flex-col items-end gap-2">
                        <div className={`text-2xl font-bold bg-gradient-to-r ${getRankColor(rank)} bg-clip-text text-transparent`}>
                          {timeframeValue}
                        </div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>
                          {getTimeframeLabel()} Solved
                        </div>
                        
                        {user.streak > 0 && (
                          <div className={`flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r ${colors.solved} text-white text-xs`}>
                            <Flame className="w-3 h-3" />
                            {user.streak} day streak
                          </div>
                        )}
                      </div>

                      {/* Mobile Stats */}
                      <div className="md:hidden flex flex-col items-end">
                        <div className={`text-xl font-bold bg-gradient-to-r ${getRankColor(rank)} bg-clip-text text-transparent`}>
                          {timeframeValue}
                        </div>
                        {user.streak > 0 && (
                          <div className={`flex items-center gap-1 mt-1`}>
                            <Flame className={`w-3 h-3 ${colors.solvedText}`} />
                            <span className={`text-xs ${colors.solvedText}`}>{user.streak}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className={theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}>Progress</span>
                        <span className={`font-bold bg-gradient-to-r ${getRankColor(rank)} bg-clip-text text-transparent`}>
                          {stats.topScore > 0 ? Math.round((timeframeValue / stats.topScore) * 100) : 0}% of top
                        </span>
                      </div>
                      <div className={`w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded-full h-2`}>
                        <div 
                          className={`h-2 rounded-full transition-all duration-1000 bg-gradient-to-r ${getRankColor(rank)}`}
                          style={{ width: `${stats.topScore > 0 ? Math.round((timeframeValue / stats.topScore) * 100) : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Footer Section */}
        <div className={`mt-8 bg-gradient-to-br ${colors.cardBg} backdrop-blur-xl rounded-2xl p-8 border ${colors.border}`}>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className={`w-5 h-5 ${colors.text} animate-pulse`} />
              <span className={colors.text}>Climb the Leaderboard!</span>
              <Sparkles className={`w-5 h-5 ${colors.text} animate-pulse`} />
            </div>
            <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              How to Improve Your Rank
            </h3>
            <p className={`${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'} mb-6 max-w-2xl mx-auto`}>
              Solve more problems daily, maintain your streak, and climb the global rankings.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className={`group px-6 py-3 bg-gradient-to-r ${colors.primaryDark} hover:${colors.primary} text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${theme === 'dark' ? 'hover:shadow-2xl hover:shadow-green-500/30' : 'hover:shadow-2xl hover:shadow-green-500/20'}`}
              >
                <span className="flex items-center gap-2">
                  Solve Problems
                  <TargetIcon className="w-4 h-4 group-hover:animate-bounce" />
                </span>
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className={`group px-6 py-3 bg-gradient-to-r ${colors.primaryDark} hover:${colors.primary} text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${theme === 'dark' ? 'hover:shadow-2xl hover:shadow-green-500/30' : 'hover:shadow-2xl hover:shadow-green-500/20'}`}
              >
                <span className="flex items-center gap-2">
                  View Dashboard
                  <BarChart3 className="w-4 h-4 group-hover:animate-bounce" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default RankingsPage