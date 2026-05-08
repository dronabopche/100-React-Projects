import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Users, TrendingUp, Plus, ChevronRight, Clock, Link2, CheckCircle2, Brain } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getJobs, getAllResponses } from '../lib/db'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

function StatCard({ icon: Icon, label, value, color = 'var(--accent)', sub, onClick }) {
  return (
    <div
      className={`stat-card${onClick ? ' card-hover' : ''}`}
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', cursor: onClick ? 'pointer' : 'default' }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
        background: color === 'var(--accent)' ? 'var(--accent-soft)'
          : color === 'var(--green)' ? 'var(--green-soft)'
          : color === 'var(--amber)' ? 'var(--amber-soft)'
          : 'var(--red-soft)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
          {label}
        </div>
        <div style={{ fontSize: '1.85rem', fontWeight: 700, fontFamily: 'Syne, sans-serif', lineHeight: 1, color: 'var(--text-primary)' }}>
          {value}
        </div>
        {sub && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{sub}</div>}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, isDemoMode } = useAuth()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    async function load() {
      const [jobsRes, responsesRes] = await Promise.all([
        getJobs(user?.id),
        getAllResponses(user?.id)
      ])
      setJobs(jobsRes.data || [])
      setRecent((responsesRes.data || []).slice(0, 8))
      setLoading(false)
    }
    load()
  }, [user?.id])

  const handleCopyLink = (jobId, e) => {
    e.stopPropagation()
    const url = `${window.location.origin}/apply/${jobId}`
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(jobId)
      toast.success('Application link copied!')
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  const totalResponses = jobs.reduce((sum, j) => sum + (j.response_count || 0), 0)
  const activeJobs = jobs.filter(j => j.is_active).length
  const shortlisted = recent.filter(r => r.status === 'shortlisted').length
  const avgScore = recent.filter(r => r.score != null).length > 0
    ? Math.round(recent.filter(r => r.score != null).reduce((s, r) => s + r.score, 0) / recent.filter(r => r.score != null).length)
    : null

  if (loading) return (
    <div className="loading-full" style={{ height: '60vh' }}>
      <div className="spinner" />
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="section-title">Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
            Welcome back, <strong style={{ color: 'var(--text-secondary)' }}>{user?.email?.split('@')[0]}</strong>
            {isDemoMode && <span className="badge badge-amber" style={{ marginLeft: '0.5rem', fontSize: '0.68rem' }}>Demo</span>}
          </p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/forms/new')}>
          <Plus size={16} /> New Job Form
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard
          icon={FileText} label="Active Forms" value={activeJobs} color="var(--accent)"
          sub={`${jobs.length} total`} onClick={() => navigate('/forms')}
        />
        <StatCard
          icon={Users} label="Total Applicants" value={totalResponses} color="var(--green)"
          sub="across all jobs"
        />
        <StatCard
          icon={TrendingUp} label="Shortlisted" value={shortlisted} color="var(--amber)"
          sub="from recent"
        />
        {avgScore != null && (
          <StatCard
            icon={Brain} label="Avg AI Score" value={avgScore} color="var(--red)"
            sub="across scored candidates"
          />
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Active Jobs */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', margin: 0 }}>Active Job Forms</h2>
            <button
              onClick={() => navigate('/forms')}
              style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              View all <ChevronRight size={14} />
            </button>
          </div>

          {jobs.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <FileText size={32} color="var(--text-muted)" />
              <h3>No job forms yet</h3>
              <p>Create your first job form to start receiving applications</p>
              <button className="btn-primary" style={{ marginTop: '0.5rem' }} onClick={() => navigate('/forms/new')}>
                <Plus size={15} /> Create Form
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {jobs.slice(0, 6).map(job => (
                <div
                  key={job.id}
                  onClick={() => navigate(`/forms/${job.id}/candidates`)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.7rem 0.9rem',
                    background: 'var(--bg-secondary)', borderRadius: 8, cursor: 'pointer',
                    transition: 'background 0.15s', border: '1px solid transparent',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; e.currentTarget.style.borderColor = 'var(--border)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.borderColor = 'transparent' }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {job.title}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 1 }}>
                      {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, marginLeft: '0.75rem' }}>
                    <span className="badge badge-accent">{job.response_count || 0}</span>
                    <button
                      onClick={(e) => handleCopyLink(job.id, e)}
                      title="Copy link"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.2rem', display: 'flex' }}
                    >
                      {copiedId === job.id
                        ? <CheckCircle2 size={14} color="var(--green)" />
                        : <Link2 size={14} />
                      }
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Clock size={16} color="var(--text-muted)" />
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', margin: 0 }}>Recent Submissions</h2>
          </div>

          {recent.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <Users size={32} color="var(--text-muted)" />
              <h3>No submissions yet</h3>
              <p>Share job form links to start receiving applications</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {recent.map((r, i) => (
                <div
                  key={r.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.7rem 0',
                    borderBottom: i < recent.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: 'var(--accent-soft)', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, color: 'var(--accent)', fontSize: '0.875rem',
                  }}>
                    {(r.name || r.email || '?')[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {r.name || r.email}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: 1 }}>
                      {formatDistanceToNow(new Date(r.submitted_at), { addSuffix: true })}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {r.score != null && (
                      <span style={{
                        fontSize: '0.82rem', fontWeight: 700, fontFamily: 'JetBrains Mono',
                        color: r.score >= 65 ? 'var(--green)' : r.score >= 35 ? 'var(--amber)' : 'var(--red)',
                      }}>
                        {r.score}
                      </span>
                    )}
                    <span className={`badge ${
                      r.status === 'shortlisted' ? 'badge-green'
                      : r.status === 'rejected' ? 'badge-red'
                      : r.status === 'interviewing' ? 'badge-accent'
                      : 'badge-gray'
                    }`} style={{ fontSize: '0.7rem' }}>
                      {r.status || 'pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick links row */}
      {jobs.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            Quick Share — Application Links
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {jobs.slice(0, 5).map(job => (
              <button
                key={job.id}
                onClick={(e) => handleCopyLink(job.id, e)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '0.45rem 0.85rem',
                  cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)',
                  fontFamily: 'DM Sans', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
              >
                {copiedId === job.id
                  ? <CheckCircle2 size={13} color="var(--green)" />
                  : <Link2 size={13} />
                }
                {job.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
