import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, FileText, Calendar, Mail, Users, Link2, Download, Shield, Zap, ChevronRight, Sun, Moon, Star, ArrowRight, CheckCircle2, BarChart3, Clock } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const FEATURES = [
  { icon: FileText, title: 'Smart Form Builder', desc: 'Drag-and-drop fields. Custom questions. Shareable public links — no login required for applicants.', color: 'var(--accent)' },
  { icon: Brain, title: 'AI Resume Scoring', desc: 'Claude AI scores every candidate 0–100, flags strengths/gaps, and ranks them best-to-worst automatically.', color: 'var(--green)' },
  { icon: Calendar, title: 'Interview Scheduler', desc: 'Calendar UI, time slot assignment, and automatic confirmation emails sent the moment you schedule.', color: 'var(--amber)' },
  { icon: Users, title: 'Candidate Pipeline', desc: 'Table view with status tracking, notes per candidate, filters by score or stage — all in one place.', color: 'var(--blue)' },
  { icon: Mail, title: 'Email Automation', desc: 'Customizable email templates trigger automatically on scheduling. Powered by Resend API.', color: 'var(--accent)' },
  { icon: Download, title: 'CSV Export', desc: 'One click exports your entire candidate list with scores, categories, links, and notes.', color: 'var(--green)' },
]

const STATS = [
  { value: '10×', label: 'Faster screening' },
  { value: '94%', label: 'AI accuracy' },
  { value: '0', label: 'Setup time' },
]

const TESTIMONIALS = [
  { name: 'Sarah K.', role: 'Head of Talent @ FinTech Co', quote: 'HireAdstore cut our screening time from 3 days to 2 hours. The AI scoring is shockingly accurate.' },
  { name: 'Marcus T.', role: 'Engineering Manager', quote: 'Finally a tool that gets out of the way. Form builder in 5 mins, shareable link, AI ranks candidates — done.' },
  { name: 'Priya M.', role: 'HR Director', quote: 'The interview scheduler + auto-emails saved us so much back-and-forth. Candidates love the experience too.' },
]

function NavBar({ onGetStarted }) {
  const { theme, toggle } = useTheme()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99,
      background: scrolled ? 'var(--bg-card)' : 'transparent',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      transition: 'all 0.3s',
      padding: '0 2rem',
    }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 12px var(--accent-glow)',
          }}>
            <span style={{ fontFamily: 'Syne', fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>H</span>
          </div>
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.05rem', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            HireAdstore.ai
          </span>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={toggle}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', padding: '0.4rem', borderRadius: 8, transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-soft)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={onGetStarted}>
            Sign In
          </button>
          <button className="btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }} onClick={onGetStarted}>
            Get Started Free <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()

  const goToLogin = () => navigate('/login')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', overflowX: 'hidden' }}>
      <NavBar onGetStarted={goToLogin} />

      {/* ── HERO ── */}
      <section style={{ paddingTop: 120, paddingBottom: 80, textAlign: 'center', position: 'relative' }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 800, height: 400,
          background: 'radial-gradient(ellipse, var(--accent-soft) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--accent-soft)', border: '1px solid var(--border-active)', borderRadius: 999, padding: '0.35rem 0.9rem' }}>
            <Zap size={13} color="var(--accent)" fill="var(--accent)" />
            <span style={{ fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 600 }}>Powered by Claude AI</span>
          </div>

          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', lineHeight: 1.1, marginBottom: '1.25rem', marginTop: 0 }}>
            Hire smarter with{' '}
            <span className="gradient-text">AI that actually works</span>
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 580, margin: '0 auto 2.5rem' }}>
            Build job forms in minutes, let AI rank your candidates automatically, and schedule interviews — all from one beautifully simple dashboard.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <button className="btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }} onClick={goToLogin}>
              Start for free <ArrowRight size={16} />
            </button>
            <button className="btn-secondary" style={{ padding: '0.85rem 1.5rem', fontSize: '1rem' }} onClick={goToLogin}>
              See demo
            </button>
          </div>

          {/* Trust line */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {['No credit card', 'Works instantly', 'Full data control'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={14} color="var(--green)" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: '3rem 1.5rem', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {STATS.map(s => (
            <div key={s.label} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '2rem 1.5rem', textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2.75rem', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '4rem 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: '0.75rem', marginTop: 0 }}>
            Everything your team needs
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
            From form to hire — no extra tools, no switching tabs, no chaos.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {FEATURES.map(f => (
            <div key={f.title} className="feature-card">
              <div style={{
                width: 44, height: 44, borderRadius: 12, marginBottom: '1rem',
                background: `${f.color}18`, border: `1px solid ${f.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <f.icon size={20} color={f.color} />
              </div>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', margin: '0 0 0.5rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '4rem 1.5rem', maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: '0.75rem', marginTop: 0 }}>
          Three steps to your next hire
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1rem' }}>Seriously, that's it.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {[
            { step: '01', icon: FileText, title: 'Build your form', desc: 'Pick fields, add your job description, get a shareable link in under 5 minutes.' },
            { step: '02', icon: Brain, title: 'AI scores applicants', desc: 'Every submission gets scored 0-100. Claude reads resumes and ranks against your JD.' },
            { step: '03', icon: Calendar, title: 'Schedule & hire', desc: 'One-click interview scheduling with auto-emails. Done.' },
          ].map(s => (
            <div key={s.step} style={{ position: 'relative' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', margin: '0 auto 1.25rem',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 20px var(--accent-glow)',
              }}>
                <s.icon size={22} color="#fff" />
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.08em' }}>{s.step}</div>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', marginTop: 0 }}>{s.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '4rem 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', textAlign: 'center', marginBottom: '2.5rem', marginTop: 0 }}>
          Loved by hiring teams
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '1.5rem',
            }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: '1rem' }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="var(--amber)" color="var(--amber)" />)}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, margin: '0 0 1.25rem', fontStyle: 'italic' }}>"{t.quote}"</p>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '5rem 1.5rem', textAlign: 'center', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 600, height: 300,
          background: 'radial-gradient(ellipse, var(--accent-soft), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '1rem', marginTop: 0 }}>
            Ready to hire smarter?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem' }}>
            Join teams using HireAdstore.ai to cut screening time and find better candidates.
          </p>
          <button className="btn-primary" style={{ padding: '0.9rem 2.5rem', fontSize: '1.05rem' }} onClick={goToLogin}>
            Get started free <ArrowRight size={17} />
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'Syne', fontWeight: 800, color: '#fff', fontSize: '0.65rem' }}>H</span>
          </div>
          <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.9rem' }}>HireAdstore.ai</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
          © {new Date().getFullYear()} HireAdstore.ai · AI-powered hiring for modern teams
        </p>
      </footer>
    </div>
  )
}
