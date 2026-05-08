import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Trash2, GripVertical, ChevronDown, Save, ArrowLeft, Eye } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { createJob, updateJob, getJob } from '../lib/db'
import toast from 'react-hot-toast'

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Phone' },
  { value: 'url', label: 'URL' },
  { value: 'file', label: 'File Upload' },
  { value: 'textarea', label: 'Long Text' },
  { value: 'dropdown', label: 'Dropdown' },
]

const PRESET_FIELDS = [
  { key: 'name', label: 'Full Name', type: 'text', required: true },
  { key: 'email', label: 'Email Address', type: 'email', required: true },
  { key: 'phone', label: 'Phone Number', type: 'tel', required: false },
  { key: 'resume_url', label: 'Resume (PDF)', type: 'file', required: true },
  { key: 'github', label: 'GitHub Profile', type: 'url', required: false },
  { key: 'linkedin', label: 'LinkedIn Profile', type: 'url', required: false },
  { key: 'portfolio', label: 'Portfolio / Kaggle', type: 'url', required: false },
  { key: 'cover_letter', label: 'Cover Letter', type: 'textarea', required: false },
]

function FieldEditor({ field, index, onChange, onDelete, total }) {
  return (
    <div style={{
      background: 'var(--bg-secondary)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '1rem 1.25rem',
      display: 'flex', alignItems: 'flex-start', gap: '0.75rem'
    }}>
      <div style={{ color: 'var(--text-muted)', paddingTop: 8, cursor: 'grab' }}>
        <GripVertical size={16} />
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 160px auto', gap: '0.75rem', alignItems: 'start' }}>
        <div>
          <label className="label">Field Label</label>
          <input
            className="input"
            value={field.label}
            onChange={e => onChange(index, 'label', e.target.value)}
            placeholder="e.g. Full Name"
          />
        </div>
        <div>
          <label className="label">Type</label>
          <select
            className="input"
            value={field.type}
            onChange={e => onChange(index, 'type', e.target.value)}
          >
            {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="label" style={{ visibility: 'hidden' }}>_</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: 2 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
              <input
                type="checkbox"
                checked={field.required}
                onChange={e => onChange(index, 'required', e.target.checked)}
                style={{ accentColor: 'var(--accent)' }}
              />
              Required
            </label>
          </div>
        </div>
      </div>
      {field.type === 'dropdown' && (
        <div style={{ gridColumn: '1/-1', marginTop: '0.5rem' }}>
          <label className="label">Options (comma-separated)</label>
          <input
            className="input"
            value={field.options?.join(', ') || ''}
            onChange={e => onChange(index, 'options', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            placeholder="Option 1, Option 2, Option 3"
          />
        </div>
      )}
      <button
        onClick={() => onDelete(index)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '6px', borderRadius: 6, marginTop: 20, flexShrink: 0 }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}

export default function FormBuilderPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [fields, setFields] = useState([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    if (isEdit) {
      getJob(id).then(({ data }) => {
        if (data) {
          setTitle(data.title)
          setDescription(data.description || '')
          setFields(data.fields || [])
        }
        setLoading(false)
      })
    }
  }, [id])

  const addPreset = (preset) => {
    const exists = fields.some(f => f.key === preset.key)
    if (exists) return toast.error('Field already added')
    setFields(prev => [...prev, { ...preset, id: Date.now().toString() }])
  }

  const addCustomField = () => {
    setFields(prev => [...prev, {
      id: Date.now().toString(),
      key: 'field_' + Date.now(),
      label: 'Custom Field',
      type: 'text',
      required: false
    }])
  }

  const updateField = (index, key, value) => {
    setFields(prev => prev.map((f, i) => i === index ? { ...f, [key]: value } : f))
  }

  const deleteField = (index) => {
    setFields(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!title.trim()) return toast.error('Job title is required')
    if (fields.length === 0) return toast.error('Add at least one field')
    setSaving(true)

    const jobData = {
      title: title.trim(),
      description: description.trim(),
      fields,
      user_id: user?.id || 'demo-user',
      is_active: true,
    }

    try {
      if (isEdit) {
        const { error } = await updateJob(id, jobData)
        if (error) throw error
        toast.success('Form updated!')
      } else {
        const { data, error } = await createJob(jobData)
        if (error) throw error
        toast.success('Form created!')
        navigate('/forms')
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="loading-full" style={{ height: '60vh' }}><div className="spinner" /></div>

  return (
    <div style={{ maxWidth: 820, margin: '0 auto' }}>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn-secondary" style={{ padding: '0.5rem 0.75rem' }} onClick={() => navigate('/forms')}>
            <ArrowLeft size={16} />
          </button>
          <h1 className="section-title">{isEdit ? 'Edit Form' : 'New Job Form'}</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {isEdit && (
            <button className="btn-secondary" onClick={() => window.open(`/apply/${id}`, '_blank')}>
              <Eye size={15} /> Preview
            </button>
          )}
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <div className="spinner" style={{ width: 16, height: 16 }} /> : <Save size={15} />}
            {saving ? 'Saving...' : 'Save Form'}
          </button>
        </div>
      </div>

      {/* Job Details */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', marginTop: 0 }}>Job Details</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label">Job Title *</label>
            <input
              className="input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
            />
          </div>
          <div>
            <label className="label">Job Description</label>
            <textarea
              className="input"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the role, requirements, and responsibilities. This is used by AI to score candidates."
              rows={5}
              style={{ resize: 'vertical' }}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
              Tip: A detailed description improves AI candidate scoring accuracy
            </div>
          </div>
        </div>
      </div>

      {/* Preset Fields */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem', marginTop: 0 }}>Quick Add Fields</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1rem', marginTop: 0 }}>Click to add common fields</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {PRESET_FIELDS.map(preset => {
            const added = fields.some(f => f.key === preset.key)
            return (
              <button
                key={preset.key}
                onClick={() => addPreset(preset)}
                disabled={added}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 999,
                  border: `1px solid ${added ? 'var(--border)' : 'var(--accent)'}`,
                  background: added ? 'var(--bg-secondary)' : 'var(--accent-soft)',
                  color: added ? 'var(--text-muted)' : 'var(--accent)',
                  cursor: added ? 'default' : 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'all 0.15s',
                }}
              >
                {added ? '✓ ' : '+ '}{preset.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Field Builder */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>Form Fields</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '0.2rem 0 0' }}>{fields.length} fields</p>
          </div>
          <button className="btn-secondary" onClick={addCustomField}>
            <Plus size={15} /> Add Custom Field
          </button>
        </div>

        {fields.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <p>No fields added yet. Use "Quick Add" above or add custom fields.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {fields.map((field, index) => (
              <FieldEditor
                key={field.id || index}
                field={field}
                index={index}
                onChange={updateField}
                onDelete={deleteField}
                total={fields.length}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
