import React from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText, Calendar, LogOut, FlaskConical, Settings, Sun, Moon, Sparkles } from 'lucide-react'
import { signOut } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import toast from 'react-hot-toast'

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/forms',     icon: FileText,        label: 'Job Forms' },
  { path: '/scheduler', icon: Calendar,        label: 'Scheduler' },
]

export default function Layout() {
  const { user, isDemoMode, demoSignOut } = useAuth()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    if (isDemoMode) {
      demoSignOut()
      toast.success('Signed out of demo')
    } else {
      await signOut()
      toast.success('Signed out')
    }
    navigate('/')
  }

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 230,
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        height: '100vh', position: 'fixed', left: 0, top: 0,
        zIndex: 50, padding: '1.25rem 0.85rem',
        transition: 'background 0.25s, border-color 0.25s',
      }}>
        {/* Logo */}
        <div style={{ padding: '0.25rem 0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9, flexShrink: 0,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 10px var(--accent-glow)',
          }}>
            <span style={{ fontFamily: 'Syne', fontWeight: 800, color: '#fff', fontSize: '0.9rem' }}>H</span>
          </div>
          <div>
            <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '0.9rem', lineHeight: 1.1, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              HireAdstore.ai
            </div>
          </div>
        </div>

        {/* Demo banner */}
        {isDemoMode && (
          <div style={{
            background: 'var(--amber-soft)', border: '1px solid rgba(245,166,35,0.2)',
            borderRadius: 8, padding: '0.45rem 0.7rem', marginBottom: '1rem',
            display: 'flex', alignItems: 'center', gap: '0.45rem',
          }}>
            <FlaskConical size={12} color="var(--amber)" />
            <span style={{ fontSize: '0.72rem', color: 'var(--amber)', fontWeight: 600 }}>Demo Mode</span>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(({ path, icon: Icon, label }) => (
            <button key={path} className={`sidebar-link ${isActive(path) ? 'active' : ''}`} onClick={() => navigate(path)}>
              <Icon size={17} />
              <span>{label}</span>
            </button>
          ))}

          {/* AI badge */}
          <div style={{ margin: '0.75rem 0', height: 1, background: 'var(--border)' }} />
          <div style={{ padding: '0.5rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={13} color="var(--accent)" />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>AI Features</span>
          </div>
          <button className={`sidebar-link ${isActive('/forms') ? '' : ''}`}
            onClick={() => { navigate('/forms'); setTimeout(() => {}, 100) }}
            style={{ fontSize: '0.82rem', paddingLeft: '1.25rem', color: 'var(--text-muted)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} />
            AI Resume Scoring
          </button>
        </nav>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
          {/* Theme toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.9rem', marginBottom: '0.35rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
              {theme === 'dark' ? 'Dark' : 'Light'}
            </div>
            <button onClick={toggle} className={`theme-toggle ${theme === 'light' ? 'on' : ''}`} title="Toggle theme" />
          </div>

          <button className={`sidebar-link ${isActive('/settings') ? 'active' : ''}`} onClick={() => navigate('/settings')} style={{ marginBottom: 2 }}>
            <Settings size={17} />
            <span>Settings</span>
          </button>

          <div style={{ padding: '0.5rem 0.9rem 0.5rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 2 }}>{isDemoMode ? 'Demo Account' : 'Signed in'}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', wordBreak: 'break-all', lineHeight: 1.3 }}>{user?.email}</div>
          </div>

          <button className="sidebar-link" onClick={handleSignOut}
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-soft)'; e.currentTarget.style.color = 'var(--red)' }}
            onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--text-muted)' }}>
            <LogOut size={17} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main style={{
        marginLeft: 230, flex: 1,
        padding: '2rem 2.5rem',
        minHeight: '100vh',
        maxWidth: 'calc(100vw - 230px)',
        overflowX: 'hidden',
        transition: 'background 0.25s',
      }}>
        <Outlet />
      </main>
    </div>
  )
}
