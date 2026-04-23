import React, { useState } from 'react'
import { CheckCircle2, XCircle, AlertCircle, Trash2, RefreshCw, Mail, Key, Database, Server, Copy, Check, Sun, Moon, Monitor } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { DEFAULT_INTERVIEW_TEMPLATE } from '../lib/email'
import toast from 'react-hot-toast'

const ENV_CHECKS = [
  { key: 'VITE_SUPABASE_URL',      label: 'Supabase URL',           icon: Database, test: v => v && v.startsWith('https://') && v.includes('.supabase.co'), hint: 'Supabase Dashboard → Settings → API' },
  { key: 'VITE_SUPABASE_ANON_KEY', label: 'Supabase Anon Key',      icon: Key,      test: v => v && v.length > 50,  hint: 'Supabase Dashboard → Settings → API' },
  { key: 'VITE_OPENAI_API_KEY',    label: 'Anthropic API Key (AI)', icon: Server,   test: v => v && v.length > 10,  hint: 'console.anthropic.com → API Keys' },
  { key: 'VITE_EMAIL_API_KEY',     label: 'Resend API Key (Email)', icon: Mail,     test: v => v && v.length > 10,  hint: 'resend.com → API Keys. Optional.', optional: true },
]

function EnvRow({ check }) {
  const val = import.meta.env[check.key] || ''
  const configured = check.test(val) && !val.includes('your_') && !val.includes('placeholder')
  const Icon = check.icon
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem',
      background: 'var(--bg-secondary)', borderRadius: 8,
      border: `1px solid ${configured ? 'rgba(52,212,122,0.2)' : check.optional ? 'var(--border)' : 'rgba(244,85,106,0.15)'}`,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        background: configured ? 'var(--green-soft)' : check.optional ? 'var(--bg-card)' : 'var(--red-soft)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={16} color={configured ? 'var(--green)' : check.optional ? 'var(--text-muted)' : 'var(--red)'} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
          <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{check.label}</span>
          {check.optional && <span className="badge badge-gray" style={{ fontSize: '0.68rem' }}>Optional</span>}
        </div>
        <code style={{ fontSize: '0.73rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>{check.key}</code>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{check.hint}</div>
      </div>
      {configured
        ? <CheckCircle2 size={18} color="var(--green)" style={{ flexShrink: 0 }} />
        : check.optional
        ? <AlertCircle size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
        : <XCircle size={18} color="var(--red)" style={{ flexShrink: 0 }} />
      }
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem', marginTop: 0, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
      {children}
    </h2>
  )
}

export default function SettingsPage() {
  const { user, isDemoMode } = useAuth()
  const { theme, toggle } = useTheme()
  const [emailTemplate, setEmailTemplate] = useState(() => localStorage.getItem('hireadstore_email_template') || DEFAULT_INTERVIEW_TEMPLATE)
  const [templateSaved, setTemplateSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  const configuredCount = ENV_CHECKS.filter(c => {
    const v = import.meta.env[c.key] || ''
    return c.test(v) && !v.includes('your_') && !v.includes('placeholder')
  }).length

  const handleSaveTemplate = () => {
    localStorage.setItem('hireadstore_email_template', emailTemplate)
    setTemplateSaved(true)
    toast.success('Email template saved')
    setTimeout(() => setTemplateSaved(false), 2000)
  }

  const handleResetTemplate = () => {
    setEmailTemplate(DEFAULT_INTERVIEW_TEMPLATE)
    localStorage.removeItem('hireadstore_email_template')
    toast.success('Template reset')
  }

  const handleClearData = () => {
    if (!confirm('Reset all demo data? This cannot be undone.')) return
    localStorage.removeItem('hireadstore_mock_data')
    toast.success('Demo data cleared — refresh to reload defaults')
  }

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(`# Supabase\nVITE_SUPABASE_URL=https://your-project.supabase.co\nVITE_SUPABASE_ANON_KEY=your-anon-key\n\n# Anthropic (AI scoring)\nVITE_OPENAI_API_KEY=your-anthropic-api-key\n\n# Resend (emails)\nVITE_EMAIL_API_KEY=your-resend-api-key\nVITE_EMAIL_FROM=noreply@yourdomain.com`)
    setCopied(true)
    toast.success('.env template copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="section-title">Settings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>Manage your workspace preferences</p>
        </div>
      </div>

      {/* Account */}
      <section style={{ marginBottom: '2rem' }}>
        <SectionTitle>Account</SectionTitle>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Syne', fontWeight: 800, fontSize: '1.1rem', color: '#fff', flexShrink: 0,
          }}>
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user?.email}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
              {isDemoMode ? 'Demo Account · localStorage mode' : 'Authenticated via Supabase'}
            </div>
          </div>
          {isDemoMode && <span className="badge badge-amber" style={{ marginLeft: 'auto' }}>Demo</span>}
        </div>
      </section>

      {/* Appearance */}
      <section style={{ marginBottom: '2rem' }}>
        <SectionTitle>Appearance</SectionTitle>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 500, marginBottom: '0.2rem' }}>Theme</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Switch between dark and light mode</div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[
                { id: 'dark', icon: Moon, label: 'Dark' },
                { id: 'light', icon: Sun, label: 'Light' },
              ].map(t => (
                <button key={t.id} onClick={() => theme !== t.id && toggle()} style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.5rem 0.9rem', borderRadius: 8, cursor: 'pointer',
                  border: `1px solid ${theme === t.id ? 'var(--accent)' : 'var(--border)'}`,
                  background: theme === t.id ? 'var(--accent-soft)' : 'transparent',
                  color: theme === t.id ? 'var(--accent)' : 'var(--text-secondary)',
                  fontFamily: 'DM Sans', fontWeight: 500, fontSize: '0.875rem',
                  transition: 'all 0.15s',
                }}>
                  <t.icon size={15} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* OAuth Providers */}
      <section style={{ marginBottom: '2rem' }}>
        <SectionTitle>OAuth Providers</SectionTitle>
        <div className="card">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 0, marginBottom: '1rem', lineHeight: 1.6 }}>
            To enable Google, GitHub, and Microsoft sign-in, configure OAuth providers in your Supabase dashboard under <strong style={{ color: 'var(--text-secondary)' }}>Authentication → Providers</strong>. Set the redirect URL to <code style={{ fontFamily: 'JetBrains Mono', fontSize: '0.78rem', color: 'var(--accent)' }}>{window.location.origin}/</code>
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { name: 'Google', color: '#4285F4', hint: 'Requires OAuth 2.0 credentials from Google Cloud Console' },
              { name: 'GitHub', color: '#333', hint: 'Requires OAuth App from GitHub Developer Settings' },
              { name: 'Microsoft', color: '#0078D4', hint: 'Requires Azure AD App Registration (provider: azure)' },
            ].map(p => (
              <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{p.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.hint}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Environment */}
      <section style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <SectionTitle>Environment Variables</SectionTitle>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span className={`badge ${configuredCount === ENV_CHECKS.length ? 'badge-green' : configuredCount > 0 ? 'badge-amber' : 'badge-red'}`}>
              {configuredCount}/{ENV_CHECKS.length} set
            </span>
            <button className="btn-secondary" onClick={handleCopyEnv} style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem' }}>
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'Copy .env'}
            </button>
          </div>
        </div>
        {isDemoMode && (
          <div style={{ background: 'var(--amber-soft)', border: '1px solid rgba(245,166,35,0.25)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.82rem', color: 'var(--amber)' }}>
            Running in Demo Mode. Create a <code style={{ fontFamily: 'JetBrains Mono' }}>.env</code> file with the variables below, then restart.
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {ENV_CHECKS.map(c => <EnvRow key={c.key} check={c} />)}
        </div>
      </section>

      {/* Email Template */}
      <section style={{ marginBottom: '2rem' }}>
        <SectionTitle>Default Email Template</SectionTitle>
        <div className="card">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '0 0 0.75rem' }}>
            Placeholders: {['{candidateName}','{jobTitle}','{interviewTime}','{interviewFormat}','{duration}','{additionalNotes}','{senderName}'].map(p => (
              <code key={p} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 4, padding: '0.1rem 0.35rem', fontSize: '0.72rem', fontFamily: 'JetBrains Mono', color: 'var(--accent)', marginLeft: 4 }}>{p}</code>
            ))}
          </p>
          <textarea className="input" value={emailTemplate} onChange={e => setEmailTemplate(e.target.value)}
            rows={10} style={{ fontFamily: 'JetBrains Mono', fontSize: '0.78rem', resize: 'vertical', lineHeight: 1.6 }} />
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
            <button className="btn-secondary" onClick={handleResetTemplate}><RefreshCw size={14} /> Reset</button>
            <button className="btn-primary" onClick={handleSaveTemplate}>
              {templateSaved ? <Check size={14} /> : <Mail size={14} />}
              {templateSaved ? 'Saved!' : 'Save Template'}
            </button>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      {isDemoMode && (
        <section>
          <SectionTitle>Danger Zone</SectionTitle>
          <div className="card" style={{ border: '1px solid rgba(244,85,106,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 500, marginBottom: '0.2rem' }}>Reset Demo Data</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Clears all local jobs, candidates, and schedules.</div>
              </div>
              <button className="btn-danger" onClick={handleClearData} style={{ flexShrink: 0, marginLeft: '1.5rem' }}>
                <Trash2 size={15} /> Clear Data
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
