import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Copy, Trash2, Users, Link2, Edit3, ChevronRight, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getJobs, deleteJob, duplicateJob } from '../lib/db'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

export default function FormsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [copiedId, setCopiedId] = useState(null)

  const load = async () => {
    setLoading(true)
    const { data } = await getJobs(user?.id)
    setJobs(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [user?.id])

  const handleCopyLink = (jobId) => {
    const url = `${window.location.origin}/apply/${jobId}`
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(jobId)
      toast.success('Application link copied!')
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this job form? All responses will also be deleted.')) return
    setDeletingId(id)
    await deleteJob(id)
    toast.success('Job form deleted')
    setJobs(prev => prev.filter(j => j.id !== id))
    setDeletingId(null)
  }

  const handleDuplicate = async (id) => {
    const { data, error } = await duplicateJob(id, user?.id)
    if (error) return toast.error('Failed to duplicate')
    toast.success('Job form duplicated!')
    setJobs(prev => [data, ...prev])
  }

  if (loading) return <div className="loading-full" style={{ height: '60vh' }}><div className="spinner" /></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="section-title">Job Forms</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
            Create and manage application forms
          </p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/forms/new')}>
          <Plus size={16} /> New Form
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div style={{ width: 60, height: 60, borderRadius: 16, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={28} color="var(--accent)" />
            </div>
            <h3>Create your first job form</h3>
            <p>Build custom application forms and share unique links with candidates</p>
            <button className="btn-primary" onClick={() => navigate('/forms/new')}>
              <Plus size={16} /> Create Form
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {jobs.map(job => (
            <div key={job.id} className="card card-hover" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                  <h3 style={{ margin: 0, fontWeight: 600, fontSize: '1rem' }}>{job.title}</h3>
                  <span className={`badge ${job.is_active ? 'badge-green' : 'badge-gray'}`}>
                    {job.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', display: 'flex', gap: '1rem' }}>
                  <span>{job.fields?.length || 0} fields</span>
                  <span>Created {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                <button
                  onClick={() => navigate(`/forms/${job.id}/candidates`)}
                  className="btn-secondary"
                  style={{ padding: '0.5rem 0.85rem' }}
                >
                  <Users size={15} />
                  {job.response_count || 0} candidates
                </button>

                <button
                  onClick={() => handleCopyLink(job.id)}
                  className="btn-secondary"
                  title="Copy application link"
                  style={{ padding: '0.5rem 0.75rem' }}
                >
                  {copiedId === job.id ? <CheckCircle2 size={15} color="var(--green)" /> : <Link2 size={15} />}
                </button>

                <button
                  onClick={() => navigate(`/forms/${job.id}/edit`)}
                  className="btn-secondary"
                  title="Edit form"
                  style={{ padding: '0.5rem 0.75rem' }}
                >
                  <Edit3 size={15} />
                </button>

                <button
                  onClick={() => handleDuplicate(job.id)}
                  className="btn-secondary"
                  title="Duplicate"
                  style={{ padding: '0.5rem 0.75rem' }}
                >
                  <Copy size={15} />
                </button>

                <button
                  onClick={() => handleDelete(job.id)}
                  title="Delete"
                  disabled={deletingId === job.id}
                  style={{
                    background: 'transparent', border: '1px solid var(--border)', borderRadius: 8,
                    padding: '0.5rem 0.75rem', cursor: 'pointer', color: 'var(--red)',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--red-soft)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
