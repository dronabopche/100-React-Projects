import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Calendar, Clock, Mail, Send, Trash2, X, Edit2, Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getSchedules, addSchedule, deleteSchedule } from '../lib/db'
import { sendInterviewEmail, DEFAULT_INTERVIEW_TEMPLATE } from '../lib/email'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, startOfWeek, endOfWeek, addMonths, subMonths } from 'date-fns'
import toast from 'react-hot-toast'

function MiniCalendar({ selectedDate, onSelect, schedules }) {
  const [viewMonth, setViewMonth] = useState(selectedDate || new Date())

  const monthStart = startOfMonth(viewMonth)
  const monthEnd = endOfMonth(viewMonth)
  const calStart = startOfWeek(monthStart)
  const calEnd = endOfWeek(monthEnd)
  const days = eachDayOfInterval({ start: calStart, end: calEnd })

  const hasSchedule = (day) => schedules.some(s => isSameDay(new Date(s.scheduled_at), day))

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <button onClick={() => setViewMonth(subMonths(viewMonth, 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '0.25rem 0.5rem' }}>‹</button>
        <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.9rem' }}>{format(viewMonth, 'MMMM yyyy')}</span>
        <button onClick={() => setViewMonth(addMonths(viewMonth, 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '0.25rem 0.5rem' }}>›</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', padding: '0.3rem 0', fontWeight: 600 }}>{d}</div>
        ))}
        {days.map(day => {
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const isToday = isSameDay(day, new Date())
          const isCurrentMonth = isSameMonth(day, viewMonth)
          const hasSched = hasSchedule(day)
          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelect(day)}
              style={{
                padding: '0.5rem 0',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontFamily: 'DM Sans',
                transition: 'all 0.1s',
                background: isSelected ? 'var(--accent)' : isToday ? 'var(--accent-soft)' : 'transparent',
                color: isSelected ? '#fff' : isToday ? 'var(--accent)' : isCurrentMonth ? 'var(--text-primary)' : 'var(--text-muted)',
                position: 'relative',
                fontWeight: isToday ? 600 : 400,
              }}
            >
              {format(day, 'd')}
              {hasSched && !isSelected && (
                <div style={{
                  position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)',
                  width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)'
                }} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ScheduleModal({ prefill, onClose, onSave }) {
  const [form, setForm] = useState({
    candidateName: prefill?.name || '',
    candidateEmail: prefill?.email || '',
    jobTitle: prefill?.jobTitle || '',
    date: prefill?.date || format(new Date(), 'yyyy-MM-dd'),
    time: '10:00',
    duration: '45',
    format: 'Video Call',
    notes: '',
    sendEmail: true,
    customTemplate: DEFAULT_INTERVIEW_TEMPLATE,
    editTemplate: false,
  })
  const [saving, setSaving] = useState(false)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSave = async () => {
    if (!form.candidateEmail || !form.date || !form.time) return toast.error('Fill required fields')
    setSaving(true)
    try {
      await onSave(form)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 580 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, fontFamily: 'Syne', fontWeight: 700 }}>Schedule Interview</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="label">Candidate Name *</label>
              <input className="input" value={form.candidateName} onChange={e => set('candidateName', e.target.value)} placeholder="Full name" />
            </div>
            <div>
              <label className="label">Email *</label>
              <input className="input" type="email" value={form.candidateEmail} onChange={e => set('candidateEmail', e.target.value)} placeholder="candidate@email.com" />
            </div>
          </div>
          <div>
            <label className="label">Job Title</label>
            <input className="input" value={form.jobTitle} onChange={e => set('jobTitle', e.target.value)} placeholder="e.g. Senior Frontend Engineer" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="label">Date *</label>
              <input className="input" type="date" value={form.date} onChange={e => set('date', e.target.value)} min={format(new Date(), 'yyyy-MM-dd')} />
            </div>
            <div>
              <label className="label">Time *</label>
              <input className="input" type="time" value={form.time} onChange={e => set('time', e.target.value)} />
            </div>
            <div>
              <label className="label">Duration (min)</label>
              <select className="input" value={form.duration} onChange={e => set('duration', e.target.value)}>
                {['30','45','60','90'].map(d => <option key={d} value={d}>{d} min</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Format</label>
            <select className="input" value={form.format} onChange={e => set('format', e.target.value)}>
              {['Video Call','Phone Call','In Person','Technical Assessment'].map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Additional Notes</label>
            <textarea className="input" value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} placeholder="Any special instructions or preparation notes..." style={{ resize: 'none' }} />
          </div>

          {/* Email section */}
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '1rem', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: form.sendEmail ? '0.75rem' : 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
                <input type="checkbox" checked={form.sendEmail} onChange={e => set('sendEmail', e.target.checked)} style={{ accentColor: 'var(--accent)' }} />
                <Mail size={15} color="var(--accent)" />
                Send confirmation email to candidate
              </label>
              {form.sendEmail && (
                <button onClick={() => set('editTemplate', !form.editTemplate)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'DM Sans' }}>
                  <Edit2 size={12} /> {form.editTemplate ? 'Hide' : 'Edit'} template
                </button>
              )}
            </div>
            {form.sendEmail && form.editTemplate && (
              <textarea className="input" value={form.customTemplate} onChange={e => set('customTemplate', e.target.value)} rows={8} style={{ fontSize: '0.8rem', resize: 'vertical', fontFamily: 'JetBrains Mono' }} />
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <div className="spinner" style={{ width: 16, height: 16 }} /> : <Send size={15} />}
            {saving ? 'Scheduling...' : 'Schedule & Send'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SchedulerPage() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showModal, setShowModal] = useState(false)

  const prefillFromParams = {
    name: searchParams.get('name') || '',
    email: searchParams.get('email') || '',
    jobTitle: searchParams.get('jobTitle') || '',
  }
  const hasPreFill = !!searchParams.get('email')

  useEffect(() => {
    if (hasPreFill) setShowModal(true)
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    const { data } = await getSchedules(user?.id)
    setSchedules(data || [])
    setLoading(false)
  }

  const handleSaveSchedule = async (form) => {
    const scheduledAt = new Date(`${form.date}T${form.time}:00`).toISOString()
    const scheduleData = {
      user_id: user?.id || 'demo-user',
      candidate_name: form.candidateName,
      candidate_email: form.candidateEmail,
      job_title: form.jobTitle,
      scheduled_at: scheduledAt,
      duration_minutes: parseInt(form.duration),
      format: form.format,
      notes: form.notes,
    }

    const { data, error } = await addSchedule(scheduleData)
    if (error) { toast.error('Failed to save schedule'); return }

    setSchedules(prev => [...prev, data])

    if (form.sendEmail) {
      try {
        const result = await sendInterviewEmail({
          to: form.candidateEmail,
          candidateName: form.candidateName || 'Candidate',
          jobTitle: form.jobTitle,
          interviewTime: format(new Date(scheduledAt), "EEEE, MMMM d, yyyy 'at' h:mm a"),
          interviewFormat: form.format,
          duration: `${form.duration} minutes`,
          additionalNotes: form.notes,
          customTemplate: form.customTemplate !== DEFAULT_INTERVIEW_TEMPLATE ? form.customTemplate : null,
        })
        toast.success(result.message || 'Interview scheduled and email sent!')
      } catch (err) {
        toast.error('Scheduled but email failed: ' + err.message)
      }
    } else {
      toast.success('Interview scheduled!')
    }

    setShowModal(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove this scheduled interview?')) return
    await deleteSchedule(id)
    setSchedules(prev => prev.filter(s => s.id !== id))
    toast.success('Interview removed')
  }

  const daySchedules = schedules.filter(s => isSameDay(new Date(s.scheduled_at), selectedDate))

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="section-title">Interview Scheduler</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
            {schedules.length} scheduled interview{schedules.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Calendar size={15} /> Schedule Interview
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem' }}>
        {/* Calendar */}
        <div className="card">
          <MiniCalendar selectedDate={selectedDate} onSelect={setSelectedDate} schedules={schedules} />
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>
              Upcoming
            </div>
            {schedules
              .filter(s => new Date(s.scheduled_at) >= new Date())
              .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))
              .slice(0, 4)
              .map(s => (
                <div key={s.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.8rem' }}>
                  <div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {s.candidate_name || s.candidate_email}
                  </div>
                  <div style={{ color: 'var(--text-muted)' }}>{format(new Date(s.scheduled_at), 'MMM d, h:mm a')}</div>
                </div>
              ))
            }
            {schedules.filter(s => new Date(s.scheduled_at) >= new Date()).length === 0 && (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No upcoming interviews</div>
            )}
          </div>
        </div>

        {/* Day view */}
        <div className="card">
          <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', marginTop: 0, marginBottom: '1.25rem' }}>
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h2>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><div className="spinner" /></div>
          ) : daySchedules.length === 0 ? (
            <div className="empty-state">
              <Calendar size={36} color="var(--text-muted)" />
              <h3>No interviews scheduled</h3>
              <p>Click "Schedule Interview" to add one for this day</p>
              <button className="btn-primary" onClick={() => setShowModal(true)}>
                <Calendar size={15} /> Schedule Interview
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {daySchedules
                .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))
                .map(s => (
                  <div key={s.id} style={{
                    display: 'flex', gap: '1rem',
                    background: 'var(--bg-secondary)', borderRadius: 10,
                    padding: '1rem 1.25rem',
                    borderLeft: '3px solid var(--accent)',
                  }}>
                    <div style={{ textAlign: 'center', minWidth: 56 }}>
                      <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', color: 'var(--accent)' }}>
                        {format(new Date(s.scheduled_at), 'h:mm')}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {format(new Date(s.scheduled_at), 'a')}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, marginBottom: 2 }}>{s.candidate_name || 'Candidate'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.candidate_email}</div>
                      {s.job_title && <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>{s.job_title}</div>}
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <span className="badge badge-accent">{s.format || 'Video Call'}</span>
                        <span className="badge badge-gray"><Clock size={11} /> {s.duration_minutes || 45} min</span>
                      </div>
                      {s.notes && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>{s.notes}</div>}
                    </div>
                    <button onClick={() => handleDelete(s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', alignSelf: 'flex-start' }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <ScheduleModal
          prefill={hasPreFill ? { ...prefillFromParams, date: format(selectedDate, 'yyyy-MM-dd') } : { date: format(selectedDate, 'yyyy-MM-dd') }}
          onClose={() => setShowModal(false)}
          onSave={handleSaveSchedule}
        />
      )}
    </div>
  )
}
