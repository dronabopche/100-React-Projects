import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Send, Zap, CheckCircle, Upload, AlertCircle } from 'lucide-react'
import { getPublicJob, addResponse } from '../lib/db'
import { uploadResume } from '../lib/supabase'
import toast from 'react-hot-toast'

function FormField({ field, value, onChange, error }) {
  const baseStyle = {
    ...(error ? { borderColor: 'var(--red)', boxShadow: '0 0 0 3px rgba(244,91,105,0.1)' } : {})
  }

  if (field.type === 'file') {
    return (
      <div>
        <label className="label">
          {field.label} {field.required && <span style={{ color: 'var(--red)' }}>*</span>}
        </label>
        <div
          style={{
            border: `2px dashed ${error ? 'var(--red)' : value ? 'var(--green)' : 'var(--border)'}`,
            borderRadius: 10, padding: '1.5rem', textAlign: 'center', cursor: 'pointer',
            background: value ? 'var(--green-soft)' : 'var(--bg-secondary)', transition: 'all 0.2s',
          }}
          onClick={() => document.getElementById(`file-${field.id}`).click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault()
            const file = e.dataTransfer.files[0]
            if (file) onChange(file)
          }}
        >
          <input
            id={`file-${field.id}`}
            type="file"
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
            onChange={e => onChange(e.target.files[0])}
          />
          {value ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--green)' }}>
              <CheckCircle size={18} />
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{value.name}</span>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)' }}>
              <Upload size={24} style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '0.875rem' }}>Drop your resume here or <span style={{ color: 'var(--accent)' }}>browse</span></div>
              <div style={{ fontSize: '0.75rem', marginTop: 4 }}>PDF, DOC, DOCX</div>
            </div>
          )}
        </div>
        {error && <div style={{ color: 'var(--red)', fontSize: '0.78rem', marginTop: 4 }}>{error}</div>}
      </div>
    )
  }

  if (field.type === 'textarea') {
    return (
      <div>
        <label className="label">
          {field.label} {field.required && <span style={{ color: 'var(--red)' }}>*</span>}
        </label>
        <textarea
          className="input"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          rows={4}
          style={{ resize: 'vertical', ...baseStyle }}
          placeholder={`Enter your ${field.label.toLowerCase()}`}
        />
        {error && <div style={{ color: 'var(--red)', fontSize: '0.78rem', marginTop: 4 }}>{error}</div>}
      </div>
    )
  }

  if (field.type === 'dropdown' && field.options?.length) {
    return (
      <div>
        <label className="label">
          {field.label} {field.required && <span style={{ color: 'var(--red)' }}>*</span>}
        </label>
        <select className="input" value={value || ''} onChange={e => onChange(e.target.value)} style={baseStyle}>
          <option value="">Select...</option>
          {field.options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        {error && <div style={{ color: 'var(--red)', fontSize: '0.78rem', marginTop: 4 }}>{error}</div>}
      </div>
    )
  }

  return (
    <div>
      <label className="label">
        {field.label} {field.required && <span style={{ color: 'var(--red)' }}>*</span>}
      </label>
      <input
        className="input"
        type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : field.type === 'tel' ? 'tel' : 'text'}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={field.type === 'url' ? 'https://' : `Your ${field.label.toLowerCase()}`}
        style={baseStyle}
      />
      {error && <div style={{ color: 'var(--red)', fontSize: '0.78rem', marginTop: 4 }}>{error}</div>}
    </div>
  )
}

export default function PublicFormPage() {
  const { formId } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    getPublicJob(formId).then(({ data }) => {
      if (!data) setNotFound(true)
      else setJob(data)
      setLoading(false)
    })
  }, [formId])

  const validate = () => {
    const errs = {}
    job.fields?.forEach(field => {
      if (field.required && !values[field.key]) {
        errs[field.key] = `${field.label} is required`
      }
      if (field.type === 'email' && values[field.key] && !/\S+@\S+\.\S+/.test(values[field.key])) {
        errs[field.key] = 'Please enter a valid email'
      }
    })
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return toast.error('Please fix the errors below')
    setSubmitting(true)

    try {
      let resumeUrl = null

      // Handle resume upload
      const resumeField = job.fields?.find(f => f.key === 'resume_url')
      if (resumeField && values.resume_url instanceof File) {
        try {
          resumeUrl = await uploadResume(values.resume_url, job.id, values.email || 'anonymous')
        } catch (err) {
          // If Supabase not configured, skip upload
          console.warn('Resume upload skipped:', err.message)
        }
      }

      const responseData = {
        job_id: job.id,
        ...Object.fromEntries(
          Object.entries(values).map(([k, v]) => [k, v instanceof File ? null : v])
        ),
        resume_url: resumeUrl,
      }

      const { error } = await addResponse(responseData)
      if (error) throw error
      setSubmitted(true)
    } catch (err) {
      toast.error('Submission failed: ' + (err.message || 'Unknown error'))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="loading-full">
      <div className="spinner" />
    </div>
  )

  if (notFound) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <div style={{ textAlign: 'center' }}>
        <AlertCircle size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: '0.5rem' }}>Form Not Found</h2>
        <p style={{ color: 'var(--text-muted)' }}>This application form does not exist or has been removed.</p>
      </div>
    </div>
  )

  if (submitted) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <div style={{ textAlign: 'center', maxWidth: 460 }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'var(--green-soft)', border: '2px solid var(--green)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
        }}>
          <CheckCircle size={36} color="var(--green)" />
        </div>
        <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.75rem' }}>
          Application Submitted!
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Thank you for applying for <strong>{job?.title}</strong>. We've received your application and will review it shortly. We'll be in touch if you're a good fit!
        </p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={14} color="#fff" fill="#fff" />
            </div>
            <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.9rem' }}>HireAdstore.ai</span>
          </div>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.75rem', marginBottom: '0.5rem' }}>{job?.title}</h1>
          {job?.description && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: 480, margin: '0 auto' }}>
              {job.description.slice(0, 280)}{job.description.length > 280 ? '...' : ''}
            </p>
          )}
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {job?.fields?.map(field => (
              <FormField
                key={field.id || field.key}
                field={field}
                value={values[field.key]}
                onChange={val => setValues(prev => ({ ...prev, [field.key]: val }))}
                error={errors[field.key]}
              />
            ))}

            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
              style={{ justifyContent: 'center', padding: '0.85rem', marginTop: '0.5rem', fontSize: '0.95rem' }}
            >
              {submitting ? (
                <><div className="spinner" style={{ width: 18, height: 18 }} /> Submitting...</>
              ) : (
                <><Send size={16} /> Submit Application</>
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '1.5rem' }}>
          Powered by HireAdstore.ai · Your data is handled securely
        </p>
      </div>
    </div>
  )
}
