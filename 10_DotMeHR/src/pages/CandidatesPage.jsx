import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Brain, Download, Filter, ExternalLink, Calendar, FileText, MessageSquare, ChevronDown, X } from 'lucide-react'
import { getJob, getResponses, updateResponse } from '../lib/db'
import { batchScoreCandidates } from '../lib/ai'
import { formatDistanceToNow } from 'date-fns'
import Papa from 'papaparse'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['pending', 'shortlisted', 'rejected', 'interviewing']
const CATEGORY_COLORS = {
  'Highly Relevant': 'badge-green',
  'Medium': 'badge-amber',
  'Not Relevant': 'badge-red',
}

function ScoreBar({ score }) {
  const color = score >= 65 ? 'var(--green)' : score >= 35 ? 'var(--amber)' : 'var(--red)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div className="score-bar" style={{ width: 60 }}>
        <div className="score-fill" style={{ width: `${score}%`, background: color }} />
      </div>
      <span style={{ fontSize: '0.82rem', fontWeight: 600, color, fontFamily: 'JetBrains Mono, monospace', minWidth: 28 }}>{score}</span>
    </div>
  )
}

function NotesModal({ candidate, onClose, onSave }) {
  const [notes, setNotes] = useState(candidate.notes || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await onSave(candidate.id, notes)
    setSaving(false)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ margin: 0, fontFamily: 'Syne', fontWeight: 700 }}>Notes — {candidate.name || candidate.email}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>
        {candidate.ai_summary && (
          <div style={{ background: 'var(--accent-soft)', border: '1px solid rgba(109,116,247,0.2)', borderRadius: 8, padding: '0.85rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>AI Assessment</div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{candidate.ai_summary}</p>
          </div>
        )}
        <div>
          <label className="label">Notes</label>
          <textarea
            className="input"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={5}
            placeholder="Add interview notes, observations, or follow-up tasks..."
            style={{ resize: 'vertical' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <div className="spinner" style={{ width: 16, height: 16 }} /> : null}
            Save Notes
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CandidatesPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [scoring, setScoring] = useState(false)
  const [scoreProgress, setScoreProgress] = useState({ current: 0, total: 0 })
  const [filter, setFilter] = useState('all')
  const [notesCandidate, setNotesCandidate] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const [jobRes, respRes] = await Promise.all([getJob(id), getResponses(id)])
    setJob(jobRes.data)
    setCandidates(respRes.data || [])
    setLoading(false)
  }, [id])

  useEffect(() => { load() }, [load])

  const handleAIScore = async () => {
    if (!job?.description) return toast.error('Add a job description to enable AI scoring')
    const unscored = candidates.filter(c => c.score == null)
    if (unscored.length === 0) return toast('All candidates already scored', { icon: '✓' })

    setScoring(true)
    setScoreProgress({ current: 0, total: unscored.length })

    try {
      const scored = await batchScoreCandidates(job.description, unscored, (current, total) => {
        setScoreProgress({ current, total })
      })

      // Update in DB and local state
      for (const c of scored) {
        const updates = {
          score: c.ai_result?.score,
          category: c.ai_result?.category,
          ai_summary: c.ai_result?.summary,
          recommendation: c.ai_result?.recommendation,
        }
        await updateResponse(c.id, updates)
        setCandidates(prev => prev.map(p => p.id === c.id ? { ...p, ...updates } : p))
      }

      toast.success(`Scored ${scored.length} candidate${scored.length !== 1 ? 's' : ''}!`)
    } catch (err) {
      toast.error('Scoring failed: ' + err.message)
    } finally {
      setScoring(false)
    }
  }

  const handleStatusChange = async (candidateId, newStatus) => {
    await updateResponse(candidateId, { status: newStatus })
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, status: newStatus } : c))
    toast.success('Status updated')
  }

  const handleSaveNotes = async (id, notes) => {
    await updateResponse(id, { notes })
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, notes } : c))
    toast.success('Notes saved')
  }

  const handleExportCSV = () => {
    const rows = filteredCandidates.map(c => ({
      Name: c.name || '',
      Email: c.email || '',
      Phone: c.phone || '',
      Score: c.score ?? '',
      Category: c.category || '',
      Status: c.status || '',
      Recommendation: c.recommendation || '',
      GitHub: c.github || '',
      LinkedIn: c.linkedin || '',
      Portfolio: c.portfolio || '',
      Resume: c.resume_url || '',
      Notes: c.notes || '',
      Submitted: c.submitted_at,
    }))
    const csv = Papa.unparse(rows)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${job?.title || 'candidates'}_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('CSV exported!')
  }

  const filteredCandidates = candidates
    .filter(c => {
      if (filter === 'all') return true
      if (filter === 'shortlisted') return c.status === 'shortlisted'
      if (filter === 'rejected') return c.status === 'rejected'
      if (filter === 'top') return (c.score || 0) >= 65
      return true
    })
    .sort((a, b) => (b.score || 0) - (a.score || 0))

  if (loading) return <div className="loading-full" style={{ height: '60vh' }}><div className="spinner" /></div>

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn-secondary" style={{ padding: '0.5rem 0.75rem' }} onClick={() => navigate('/forms')}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="section-title">{job?.title}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '0.2rem 0 0' }}>
              {candidates.length} candidate{candidates.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn-secondary" onClick={handleExportCSV}>
            <Download size={15} /> Export CSV
          </button>
          <button
            className="btn-primary"
            onClick={handleAIScore}
            disabled={scoring}
          >
            {scoring ? (
              <>
                <div className="spinner" style={{ width: 16, height: 16 }} />
                Scoring {scoreProgress.current}/{scoreProgress.total}...
              </>
            ) : (
              <><Brain size={15} /> AI Score All</>
            )}
          </button>
        </div>
      </div>

      {/* AI progress */}
      {scoring && (
        <div style={{
          background: 'var(--accent-soft)', border: '1px solid rgba(109,116,247,0.2)',
          borderRadius: 10, padding: '0.85rem 1.25rem', marginBottom: '1.25rem',
          display: 'flex', alignItems: 'center', gap: '1rem'
        }}>
          <Brain size={18} color="var(--accent)" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.4rem' }}>
              Analyzing candidates with AI...
            </div>
            <div style={{ background: 'var(--border)', borderRadius: 3, height: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 3, background: 'var(--accent)',
                width: `${scoreProgress.total ? (scoreProgress.current / scoreProgress.total) * 100 : 0}%`,
                transition: 'width 0.3s'
              }} />
            </div>
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--accent)', fontFamily: 'JetBrains Mono' }}>
            {scoreProgress.current}/{scoreProgress.total}
          </span>
        </div>
      )}

      {/* Summary stats */}
      {candidates.some(c => c.score != null) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Highly Relevant', count: candidates.filter(c => c.category === 'Highly Relevant').length, cls: 'badge-green', color: 'var(--green)' },
            { label: 'Medium', count: candidates.filter(c => c.category === 'Medium').length, cls: 'badge-amber', color: 'var(--amber)' },
            { label: 'Not Relevant', count: candidates.filter(c => c.category === 'Not Relevant').length, cls: 'badge-red', color: 'var(--red)' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'Syne', color: s.color }}>{s.count}</div>
              <div className={`badge ${s.cls}`} style={{ marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {[
          { value: 'all', label: 'All' },
          { value: 'top', label: 'Top Candidates' },
          { value: 'shortlisted', label: 'Shortlisted' },
          { value: 'rejected', label: 'Rejected' },
        ].map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)} style={{
            padding: '0.4rem 0.85rem',
            borderRadius: 999,
            border: `1px solid ${filter === f.value ? 'var(--accent)' : 'var(--border)'}`,
            background: filter === f.value ? 'var(--accent-soft)' : 'transparent',
            color: filter === f.value ? 'var(--accent)' : 'var(--text-muted)',
            cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500, fontFamily: 'DM Sans',
          }}>
            {f.label}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.82rem', alignSelf: 'center' }}>
          {filteredCandidates.length} shown
        </span>
      </div>

      {/* Table */}
      {filteredCandidates.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <FileText size={36} color="var(--text-muted)" />
            <h3>No candidates {filter !== 'all' ? 'in this filter' : 'yet'}</h3>
            <p>
              {filter !== 'all'
                ? 'Try changing the filter'
                : 'Share the application link to start receiving applications'}
            </p>
            {filter !== 'all' && (
              <button className="btn-secondary" onClick={() => setFilter('all')}>Clear filter</button>
            )}
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Score</th>
                <th>Category</th>
                <th>Status</th>
                <th>Links</th>
                <th>Applied</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{c.name || '—'}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.email}</div>
                  </td>
                  <td>
                    {c.score != null
                      ? <ScoreBar score={c.score} />
                      : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Not scored</span>
                    }
                  </td>
                  <td>
                    {c.category
                      ? <span className={`badge ${CATEGORY_COLORS[c.category] || 'badge-gray'}`}>{c.category}</span>
                      : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                    }
                  </td>
                  <td>
                    <select
                      value={c.status || 'pending'}
                      onChange={e => handleStatusChange(c.id, e.target.value)}
                      style={{
                        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                        color: 'var(--text-primary)', borderRadius: 6, padding: '0.3rem 0.6rem',
                        fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'DM Sans',
                      }}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {c.resume_url && (
                        <a href={c.resume_url} target="_blank" rel="noopener noreferrer" title="Resume" style={{ color: 'var(--accent)', display: 'flex' }}>
                          <FileText size={15} />
                        </a>
                      )}
                      {c.github && (
                        <a href={c.github} target="_blank" rel="noopener noreferrer" title="GitHub" style={{ color: 'var(--text-secondary)', display: 'flex' }}>
                          <ExternalLink size={14} />
                        </a>
                      )}
                      {c.linkedin && (
                        <a href={c.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn" style={{ color: 'var(--text-secondary)', display: 'flex' }}>
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    {formatDistanceToNow(new Date(c.submitted_at), { addSuffix: true })}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => setNotesCandidate(c)}
                        title="Notes"
                        style={{
                          background: c.notes ? 'var(--accent-soft)' : 'transparent',
                          border: '1px solid var(--border)', borderRadius: 6,
                          padding: '0.3rem 0.55rem', cursor: 'pointer',
                          color: c.notes ? 'var(--accent)' : 'var(--text-muted)'
                        }}
                      >
                        <MessageSquare size={14} />
                      </button>
                      <button
                        onClick={() => navigate(`/scheduler?candidateId=${c.id}&jobId=${id}&name=${encodeURIComponent(c.name || '')}&email=${encodeURIComponent(c.email)}&jobTitle=${encodeURIComponent(job?.title || '')}`)}
                        title="Schedule Interview"
                        style={{
                          background: 'transparent', border: '1px solid var(--border)',
                          borderRadius: 6, padding: '0.3rem 0.55rem', cursor: 'pointer',
                          color: 'var(--text-muted)'
                        }}
                      >
                        <Calendar size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Notes Modal */}
      {notesCandidate && (
        <NotesModal
          candidate={notesCandidate}
          onClose={() => setNotesCandidate(null)}
          onSave={handleSaveNotes}
        />
      )}
    </div>
  )
}
