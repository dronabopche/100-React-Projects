// Data access layer
// Uses Supabase when configured, falls back to mock store for demo
import { supabase } from './supabase'
import * as mock from './mockStore'

const isConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL || ''
  return url && url !== 'https://placeholder.supabase.co' && !url.includes('placeholder')
}

// ─── Jobs ──────────────────────────────────────────────────────────────────
export async function getJobs(userId) {
  if (!isConfigured()) return { data: mock.mockGetJobs(), error: null }
  const { data, error } = await supabase
    .from('jobs')
    .select('*, responses(count)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data: data?.map(j => ({ ...j, response_count: j.responses?.[0]?.count ?? 0 })), error }
}

export async function getJob(id) {
  if (!isConfigured()) return { data: mock.mockGetJob(id), error: null }
  const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single()
  return { data, error }
}

export async function createJob(job) {
  if (!isConfigured()) return { data: mock.mockCreateJob(job), error: null }
  const { data, error } = await supabase.from('jobs').insert(job).select().single()
  return { data, error }
}

export async function updateJob(id, updates) {
  if (!isConfigured()) return { data: mock.mockUpdateJob(id, updates), error: null }
  const { data, error } = await supabase.from('jobs').update(updates).eq('id', id).select().single()
  return { data, error }
}

export async function deleteJob(id) {
  if (!isConfigured()) { mock.mockDeleteJob(id); return { error: null } }
  const { error } = await supabase.from('jobs').delete().eq('id', id)
  return { error }
}

export async function duplicateJob(id, userId) {
  if (!isConfigured()) return { data: mock.mockDuplicateJob(id), error: null }
  const { data: job } = await getJob(id)
  if (!job) return { error: new Error('Job not found') }
  const copy = { ...job, id: undefined, title: job.title + ' (Copy)', created_at: undefined, user_id: userId }
  return createJob(copy)
}

// ─── Responses ────────────────────────────────────────────────────────────
export async function getResponses(jobId) {
  if (!isConfigured()) return { data: mock.mockGetResponses(jobId), error: null }
  const { data, error } = await supabase
    .from('responses')
    .select('*')
    .eq('job_id', jobId)
    .order('submitted_at', { ascending: false })
  return { data, error }
}

export async function getAllResponses(userId) {
  if (!isConfigured()) return { data: mock.mockGetAllResponses(), error: null }
  const { data, error } = await supabase
    .from('responses')
    .select('*, jobs!inner(user_id, title)')
    .eq('jobs.user_id', userId)
    .order('submitted_at', { ascending: false })
    .limit(20)
  return { data, error }
}

export async function addResponse(response) {
  if (!isConfigured()) return { data: mock.mockAddResponse(response), error: null }
  const { data, error } = await supabase.from('responses').insert(response).select().single()
  return { data, error }
}

export async function updateResponse(id, updates) {
  if (!isConfigured()) return { data: mock.mockUpdateResponse(id, updates), error: null }
  const { data, error } = await supabase.from('responses').update(updates).eq('id', id).select().single()
  return { data, error }
}

// ─── Schedules ────────────────────────────────────────────────────────────
export async function getSchedules(userId) {
  if (!isConfigured()) return { data: mock.mockGetSchedules(), error: null }
  const { data, error } = await supabase
    .from('schedules')
    .select('*, responses(name, email), jobs(title)')
    .eq('user_id', userId)
    .order('scheduled_at', { ascending: true })
  return { data, error }
}

export async function addSchedule(schedule) {
  if (!isConfigured()) return { data: mock.mockAddSchedule(schedule), error: null }
  const { data, error } = await supabase.from('schedules').insert(schedule).select().single()
  return { data, error }
}

export async function deleteSchedule(id) {
  if (!isConfigured()) { mock.mockDeleteSchedule(id); return { error: null } }
  const { error } = await supabase.from('schedules').delete().eq('id', id)
  return { error }
}

// ─── Public job for apply page ─────────────────────────────────────────────
export async function getPublicJob(formId) {
  if (!isConfigured()) {
    const all = mock.mockGetJobs()
    return { data: all.find(j => j.id === formId) || null, error: null }
  }
  const { data, error } = await supabase.from('jobs').select('id, title, description, fields').eq('id', formId).single()
  return { data, error }
}

export { isConfigured }
