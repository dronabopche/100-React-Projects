import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn, signUp, signInWithGoogle, signInWithGithub, signInWithMicrosoft } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Sun, Moon, FlaskConical } from 'lucide-react'
import toast from 'react-hot-toast'

// Provider SVG icons
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
)

const MicrosoftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
    <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
    <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
    <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
  </svg>
)

export default function LoginPage() {
  const { isDemoMode, demoSignIn } = useAuth()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState('')

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    if (!email || !password) return toast.error('Fill all fields')
    setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password)
        if (error) throw error
        toast.success('Welcome back!')
      } else {
        const { error } = await signUp(email, password)
        if (error) throw error
        toast.success('Account created! Check your email to verify.')
      }
    } catch (err) {
      toast.error(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async (provider, fn) => {
    setOauthLoading(provider)
    try {
      const { error } = await fn()
      if (error) throw error
    } catch (err) {
      toast.error(err.message || `${provider} sign-in failed`)
      setOauthLoading('')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      display: 'flex', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', top: '-10%', left: '30%', width: 700, height: 700, background: 'radial-gradient(circle, var(--accent-soft), transparent 65%)', pointerEvents: 'none' }} />

      {/* Left panel — branding */}
      <div style={{
        width: '42%', minHeight: '100vh',
        background: 'linear-gradient(160deg, var(--accent) 0%, var(--accent-2) 100%)',
        padding: '3rem', display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* decorative circles */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -40, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '4rem', position: 'relative' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'Syne', fontWeight: 800, color: '#fff', fontSize: '1rem' }}>H</span>
          </div>
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>HireAdstore.ai</span>
        </div>

        {/* Tagline */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
          <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2.2rem', color: '#fff', lineHeight: 1.2, marginBottom: '1.25rem', marginTop: 0 }}>
            Hire smarter,<br/>not harder.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 340 }}>
            AI scores your candidates, ranks them best-to-worst, and helps you schedule interviews — all automated.
          </p>

          {/* Mini feature list */}
          {['AI resume scoring & ranking', 'Smart form builder + public links', 'Auto interview scheduling & emails'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '0.65rem', color: '#fff' }}>✓</span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem' }}>{f}</span>
            </div>
          ))}
        </div>

        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', position: 'relative' }}>
          © {new Date().getFullYear()} HireAdstore.ai
        </p>
      </div>

      {/* Right panel — auth form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' }}>
        {/* Top controls */}
        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '0.5rem' }}>
          <button onClick={toggle} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.45rem', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={() => navigate('/')} className="btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
            <ArrowLeft size={14} /> Back
          </button>
        </div>

        <div style={{ width: '100%', maxWidth: 420 }}>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.75rem', marginBottom: '0.4rem', marginTop: 0 }}>
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', marginTop: 0 }}>
            {mode === 'login' ? 'Sign in to your HireAdstore.ai workspace' : 'Start hiring smarter today'}
          </p>

          {/* Demo mode banner */}
          {isDemoMode && (
            <div style={{ background: 'var(--amber-soft)', border: '1px solid rgba(245,166,35,0.25)', borderRadius: 10, padding: '0.85rem 1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
              <FlaskConical size={16} color="var(--amber)" style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ fontSize: '0.8rem', color: 'var(--amber)', lineHeight: 1.5 }}>
                <strong>Demo Mode</strong> — No Supabase configured. Data stored locally.
              </div>
            </div>
          )}

          {/* Demo CTA */}
          {isDemoMode && (
            <button className="btn-primary" onClick={demoSignIn} style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              ⚡ Enter Demo — pre-loaded data
            </button>
          )}

          {/* OAuth buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <button className="btn-oauth" onClick={() => handleOAuth('google', signInWithGoogle)} disabled={!!oauthLoading}>
              {oauthLoading === 'google' ? <div className="spinner" style={{ width: 16, height: 16 }} /> : <GoogleIcon />}
              Continue with Google
            </button>
            <button className="btn-oauth" onClick={() => handleOAuth('github', signInWithGithub)} disabled={!!oauthLoading}>
              {oauthLoading === 'github' ? <div className="spinner" style={{ width: 16, height: 16 }} /> : <GithubIcon />}
              Continue with GitHub
            </button>
            <button className="btn-oauth" onClick={() => handleOAuth('microsoft', signInWithMicrosoft)} disabled={!!oauthLoading}>
              {oauthLoading === 'microsoft' ? <div className="spinner" style={{ width: 16, height: 16 }} /> : <MicrosoftIcon />}
              Continue with Microsoft
            </button>
          </div>

          {/* Divider */}
          <div className="divider" style={{ marginBottom: '1.25rem' }}>or continue with email</div>

          {/* Mode toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--bg-secondary)', borderRadius: 10, padding: 4, marginBottom: '1.25rem', border: '1px solid var(--border)' }}>
            {['login','signup'].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                padding: '0.55rem', borderRadius: 7, border: 'none', cursor: 'pointer',
                fontFamily: 'DM Sans', fontWeight: 500, fontSize: '0.875rem',
                transition: 'all 0.15s',
                background: mode === m ? 'var(--bg-card)' : 'transparent',
                color: mode === m ? 'var(--text-primary)' : 'var(--text-muted)',
                boxShadow: mode === m ? 'var(--shadow-sm)' : 'none',
              }}>
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label">Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="input" style={{ paddingLeft: 36 }} type="email" placeholder="you@company.com"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="input" style={{ paddingLeft: 36, paddingRight: 42 }}
                  type={showPw ? 'text' : 'password'} placeholder="Min 8 characters"
                  value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex',
                }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button className="btn-primary" type="submit" disabled={loading}
              style={{ justifyContent: 'center', padding: '0.8rem', marginTop: '0.25rem' }}>
              {loading ? <div className="spinner" style={{ width: 17, height: 17 }} /> : null}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '1.5rem' }}>
            By continuing, you agree to HireAdstore.ai's Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
