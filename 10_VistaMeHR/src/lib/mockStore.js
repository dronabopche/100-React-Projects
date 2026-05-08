// In-memory mock store for demo/development when Supabase is not configured
// All data is stored in localStorage for persistence

const STORAGE_KEY = 'hireadstore_mock_data'

function getStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return {
    jobs: [
      {
        id: 'demo-job-1',
        title: 'Senior Frontend Engineer',
        description: 'We are looking for a Senior Frontend Engineer with 5+ years of experience in React, TypeScript, and modern web development. You will work on our core product and collaborate with designers and backend engineers.',
        fields: [
          { id: 'f1', type: 'text', label: 'Full Name', required: true, key: 'name' },
          { id: 'f2', type: 'email', label: 'Email', required: true, key: 'email' },
          { id: 'f3', type: 'text', label: 'Phone', required: false, key: 'phone' },
          { id: 'f4', type: 'file', label: 'Resume (PDF)', required: true, key: 'resume_url' },
          { id: 'f5', type: 'url', label: 'GitHub Profile', required: false, key: 'github' },
          { id: 'f6', type: 'url', label: 'LinkedIn', required: false, key: 'linkedin' },
        ],
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        user_id: 'demo-user',
        is_active: true,
        response_count: 3,
      },
      {
        id: 'demo-job-2',
        title: 'ML Engineer',
        description: 'Seeking an experienced ML Engineer to build and deploy machine learning models at scale. Experience with PyTorch, MLOps, and cloud platforms required.',
        fields: [
          { id: 'f1', type: 'text', label: 'Full Name', required: true, key: 'name' },
          { id: 'f2', type: 'email', label: 'Email', required: true, key: 'email' },
          { id: 'f3', type: 'file', label: 'Resume', required: true, key: 'resume_url' },
          { id: 'f4', type: 'url', label: 'Kaggle / Portfolio', required: false, key: 'portfolio' },
          { id: 'f5', type: 'url', label: 'GitHub', required: false, key: 'github' },
        ],
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        user_id: 'demo-user',
        is_active: true,
        response_count: 1,
      }
    ],
    responses: [
      {
        id: 'resp-1', job_id: 'demo-job-1',
        name: 'Alex Johnson', email: 'alex@example.com', phone: '+1 555-0101',
        github: 'https://github.com/alexj', linkedin: 'https://linkedin.com/in/alexj',
        resume_url: null, submitted_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        score: 87, category: 'Highly Relevant', recommendation: 'Shortlist',
        status: 'shortlisted', ai_summary: 'Strong React and TypeScript background with relevant experience.',
        notes: ''
      },
      {
        id: 'resp-2', job_id: 'demo-job-1',
        name: 'Maria Santos', email: 'maria@example.com', phone: '+1 555-0102',
        github: 'https://github.com/marias', linkedin: null,
        resume_url: null, submitted_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        score: 61, category: 'Medium', recommendation: 'Review',
        status: 'pending', ai_summary: 'Some frontend experience but limited React expertise.',
        notes: ''
      },
      {
        id: 'resp-3', job_id: 'demo-job-1',
        name: 'Tom Bradley', email: 'tom@example.com', phone: '+1 555-0103',
        github: null, linkedin: 'https://linkedin.com/in/tomb',
        resume_url: null, submitted_at: new Date(Date.now() - 86400000).toISOString(),
        score: 32, category: 'Not Relevant', recommendation: 'Reject',
        status: 'rejected', ai_summary: 'Background primarily in backend Java, limited frontend experience.',
        notes: ''
      },
      {
        id: 'resp-4', job_id: 'demo-job-2',
        name: 'Priya Patel', email: 'priya@example.com', phone: '+1 555-0104',
        portfolio: 'https://kaggle.com/priyap', github: 'https://github.com/priyap',
        resume_url: null, submitted_at: new Date(Date.now() - 86400000).toISOString(),
        score: 91, category: 'Highly Relevant', recommendation: 'Shortlist',
        status: 'shortlisted', ai_summary: 'Excellent ML background with PyTorch and MLOps experience.',
        notes: ''
      },
    ],
    schedules: []
  }
}

function saveStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {}
}

// Jobs
export const mockGetJobs = () => {
  const store = getStore()
  return store.jobs.map(j => ({
    ...j,
    response_count: store.responses.filter(r => r.job_id === j.id).length
  }))
}

export const mockGetJob = (id) => getStore().jobs.find(j => j.id === id)

export const mockCreateJob = (job) => {
  const store = getStore()
  const newJob = { ...job, id: 'job-' + Date.now(), created_at: new Date().toISOString(), is_active: true }
  store.jobs.unshift(newJob)
  saveStore(store)
  return newJob
}

export const mockUpdateJob = (id, updates) => {
  const store = getStore()
  const idx = store.jobs.findIndex(j => j.id === id)
  if (idx !== -1) {
    store.jobs[idx] = { ...store.jobs[idx], ...updates }
    saveStore(store)
    return store.jobs[idx]
  }
}

export const mockDeleteJob = (id) => {
  const store = getStore()
  store.jobs = store.jobs.filter(j => j.id !== id)
  saveStore(store)
}

export const mockDuplicateJob = (id) => {
  const store = getStore()
  const job = store.jobs.find(j => j.id === id)
  if (!job) return null
  const copy = { ...job, id: 'job-' + Date.now(), title: job.title + ' (Copy)', created_at: new Date().toISOString() }
  store.jobs.unshift(copy)
  saveStore(store)
  return copy
}

// Responses
export const mockGetResponses = (jobId) => getStore().responses.filter(r => r.job_id === jobId)

export const mockAddResponse = (response) => {
  const store = getStore()
  const newResp = { ...response, id: 'resp-' + Date.now(), submitted_at: new Date().toISOString(), status: 'pending', score: null, category: null }
  store.responses.push(newResp)
  saveStore(store)
  return newResp
}

export const mockUpdateResponse = (id, updates) => {
  const store = getStore()
  const idx = store.responses.findIndex(r => r.id === id)
  if (idx !== -1) {
    store.responses[idx] = { ...store.responses[idx], ...updates }
    saveStore(store)
    return store.responses[idx]
  }
}

// Schedules
export const mockGetSchedules = () => getStore().schedules

export const mockAddSchedule = (schedule) => {
  const store = getStore()
  const s = { ...schedule, id: 'sched-' + Date.now(), created_at: new Date().toISOString() }
  store.schedules.push(s)
  saveStore(store)
  return s
}

export const mockDeleteSchedule = (id) => {
  const store = getStore()
  store.schedules = store.schedules.filter(s => s.id !== id)
  saveStore(store)
}

export const mockGetAllResponses = () => getStore().responses
