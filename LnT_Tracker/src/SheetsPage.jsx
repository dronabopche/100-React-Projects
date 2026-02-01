import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabase'
import { 
  Table, 
  Grid, 
  Database, 
  FileText, 
  ChevronRight,
  Search,
  Filter,
  Home,
  RefreshCw,
  Loader,
  AlertCircle,
  CheckCircle,
  Hash,
  TrendingUp,
  Folder,
  Layers,
  Clock,
  Zap,
  Cpu,
  Award,
  Book,
  GitBranch,
  Network
} from 'lucide-react'

function SheetsPage({ session, theme }) {
  const navigate = useNavigate()
  const [sheets, setSheets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sheetStats, setSheetStats] = useState({})

  // Theme-based colors
  const getThemeColors = () => {
    if (theme === 'dark') {
      return {
        bg: 'from-black via-gray-900 to-cyan-900/20',
        primary: 'from-green-500 to-cyan-500',
        primaryLight: 'from-green-400 to-cyan-400',
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
        buttonText: 'text-green-300'
      }
    } else {
      return {
        bg: 'from-white via-cyan-50 to-green-50',
        primary: 'from-green-600 to-cyan-600',
        primaryLight: 'from-green-500 to-cyan-500',
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
        buttonText: 'text-green-600'
      }
    }
  }

  const colors = getThemeColors()

  // Category icons for sheet naming
  const sheetIcons = {
    'Arrays': <Database className="w-6 h-6" />,
    'Strings': <FileText className="w-6 h-6" />,
    'Linked Lists': <GitBranch className="w-6 h-6" />,
    'Trees': <Layers className="w-6 h-6" />,
    'Graphs': <Network className="w-6 h-6" />,
    'Dynamic Programming': <Zap className="w-6 h-6" />,
    'Recursion': <Cpu className="w-6 h-6" />,
    'Sorting': <Filter className="w-6 h-6" />,
    'Searching': <Search className="w-6 h-6" />,
    'Backtracking': <Clock className="w-6 h-6" />,
    'Greedy': <Award className="w-6 h-6" />,
    'Heap': <Database className="w-6 h-6" />,
    'Stack': <Layers className="w-6 h-6" />,
    'Queue': <TrendingUp className="w-6 h-6" />,
    'Hash Tables': <Hash className="w-6 h-6" />,
    'Binary Search': <Search className="w-6 h-6" />,
    'Bit Manipulation': <Cpu className="w-6 h-6" />,
    'Math': <Hash className="w-6 h-6" />,
    'Two Pointers': <TrendingUp className="w-6 h-6" />,
    'Miscellaneous': <Grid className="w-6 h-6" />,
    'default': <Book className="w-6 h-6" />
  }

  useEffect(() => {
    loadSheets()
  }, [session])

  const loadSheets = async () => {
    try {
      setLoading(true)
      
      // Fetch all tables/sheets from Supabase
      const { data, error } = await supabase
        .from('problems')
        .select('category')
        .not('category', 'is', null)
      
      if (error) throw error
      
      // Get unique categories (sheets)
      const uniqueCategories = [...new Set(data.map(item => item.category))].filter(Boolean)
      
      // Get stats for each sheet
      const stats = {}
      for (const category of uniqueCategories) {
        // Get total problems in this category
        const { data: problems, error: problemsError } = await supabase
          .from('problems')
          .select('id')
          .eq('category', category)
        
        if (!problemsError) {
          // Get solved count for logged in user
          let solvedCount = 0
          if (session) {
            const problemIds = problems.map(p => p.id)
            const { data: progress, error: progressError } = await supabase
              .from('user_progress')
              .select('problem_id, solved')
              .eq('user_id', session.user.id)
              .in('problem_id', problemIds)
              .eq('solved', true)
            
            if (!progressError) {
              solvedCount = progress.length
            }
          }
          
          stats[category] = {
            total: problems.length,
            solved: solvedCount,
            percentage: problems.length > 0 ? Math.round((solvedCount / problems.length) * 100) : 0
          }
        }
      }
      
      setSheets(uniqueCategories.sort())
      setSheetStats(stats)
      setLoading(false)
      
    } catch (err) {
      console.error('Error loading sheets:', err)
      setLoading(false)
    }
  }

  const getSheetIcon = (sheetName) => {
    return sheetIcons[sheetName] || sheetIcons['default']
  }

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'from-emerald-400 to-cyan-400'
    if (percentage >= 50) return 'from-green-400 to-cyan-400'
    return 'from-amber-400 to-yellow-400'
  }

  const filteredSheets = sheets.filter(sheet => 
    sheet.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${colors.bg} ${theme === 'dark' ? 'text-white' : 'text-gray-900'} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 ${colors.primary} mx-auto mb-4`}></div>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Loading sheets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bg} ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 ${theme === 'dark' ? 'bg-green-500/10' : 'bg-green-500/5'} rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 ${theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-500/5'} rounded-full blur-3xl animate-pulse delay-1000`}></div>
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
                <h1 className={`text-2xl font-bold bg-gradient-to-r ${colors.primaryLight} bg-clip-text text-transparent`}>
                  Study Sheets
                </h1>
                <p className={`text-xs ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>{sheets.length} sheets available</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={loadSheets}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'} border ${colors.buttonBorder} ${colors.buttonHoverBorder} transition-all`}
              >
                <RefreshCw className={`w-5 h-5 ${colors.text}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search sheets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-4 py-3 pl-12 ${theme === 'dark' ? 'bg-black/30' : 'bg-white/50'} border ${colors.border} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${theme === 'dark' ? 'placeholder-green-500/50' : 'placeholder-green-600/50'}`}
            />
            <div className="absolute left-4 top-3.5">
              <Search className={`w-5 h-5 ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`} />
            </div>
          </div>
        </div>

        {/* Sheets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSheets.length === 0 ? (
            <div className={`col-span-full text-center py-12 bg-gradient-to-br ${colors.cardBg} rounded-2xl border ${colors.border}`}>
              <AlertCircle className={`w-16 h-16 ${theme === 'dark' ? 'text-green-500/50' : 'text-green-600/50'} mx-auto mb-4`} />
              <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>No Sheets Found</h3>
              <p className={theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}>Try a different search term</p>
            </div>
          ) : (
            filteredSheets.map((sheet) => {
              const stats = sheetStats[sheet] || { total: 0, solved: 0, percentage: 0 }
              
              return (
                <div
                  key={sheet}
                  onClick={() => navigate(`/?category=${encodeURIComponent(sheet)}`)}
                  className={`group cursor-pointer bg-gradient-to-br ${colors.cardBg} backdrop-blur-xl rounded-2xl p-6 border ${colors.border} ${colors.hoverBorder} transition-all duration-300 hover:shadow-2xl ${theme === 'dark' ? 'hover:shadow-green-500/10' : 'hover:shadow-green-500/5'} hover:transform hover:-translate-y-1`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-r ${colors.progressBg} rounded-xl border ${colors.border} group-hover:${colors.hoverBorder}`}>
                      {getSheetIcon(sheet)}
                    </div>
                    <ChevronRight className={`w-5 h-5 ${theme === 'dark' ? 'text-green-500/50' : 'text-green-600/50'} group-hover:${colors.text} transition-colors`} />
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-3 truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {sheet}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className={theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}>Total Problems</span>
                      <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{stats.total}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className={theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}>Solved</span>
                      <span className={colors.solvedText}>{stats.solved}</span>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className={theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}>Progress</span>
                        <span className={`font-bold bg-gradient-to-r ${getProgressColor(stats.percentage)} bg-clip-text text-transparent`}>
                          {stats.percentage}%
                        </span>
                      </div>
                      <div className={`w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded-full h-2`}>
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(stats.percentage)} transition-all duration-1000`}
                          style={{ width: `${stats.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-green-500/20">
                    <button className={`w-full py-2 bg-gradient-to-r ${colors.button} ${colors.buttonHover} ${colors.buttonText} rounded-lg border ${colors.buttonBorder} ${colors.buttonHoverBorder} transition-all duration-300`}>
                      Open Sheet
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Stats Summary */}
        {sheets.length > 0 && (
          <div className={`mt-12 bg-gradient-to-br ${colors.cardBg} backdrop-blur-xl rounded-2xl p-6 border ${colors.border}`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold bg-gradient-to-r ${colors.primaryLight} bg-clip-text text-transparent`}>
                  {sheets.length}
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>Sheets</div>
              </div>
              
              <div className="text-center">
                <div className={`text-2xl font-bold bg-gradient-to-r ${colors.solvedLight} bg-clip-text text-transparent`}>
                  {Object.values(sheetStats).reduce((sum, stat) => sum + stat.solved, 0)}
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>Total Solved</div>
              </div>
              
              <div className="text-center">
                <div className={`text-2xl font-bold bg-gradient-to-r ${colors.primaryLight} bg-clip-text text-transparent`}>
                  {Object.values(sheetStats).reduce((sum, stat) => sum + stat.total, 0)}
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>Total Problems</div>
              </div>
              
              <div className="text-center">
                <div className={`text-2xl font-bold bg-gradient-to-r ${colors.primaryLight} bg-clip-text text-transparent`}>
                  {Math.round(
                    Object.values(sheetStats).reduce((sum, stat) => sum + stat.solved, 0) / 
                    Math.max(1, Object.values(sheetStats).reduce((sum, stat) => sum + stat.total, 0)) * 100
                  )}%
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-green-500/70' : 'text-green-600/70'}`}>Overall Progress</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default SheetsPage