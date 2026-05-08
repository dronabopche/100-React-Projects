import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// ── Storage ──────────────────────────────────────────────────
export const uploadResume = async (file, jobId, applicantEmail) => {
  const ext = file.name.split('.').pop()
  const path = `resumes/${jobId}/${applicantEmail.replace('@','_')}_${Date.now()}.${ext}`
  const { data, error } = await supabase.storage.from('resumes').upload(path, file, { upsert: false })
  if (error) throw error
  const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(path)
  return urlData.publicUrl
}

// ── Auth: email/password ──────────────────────────────────────
export const signIn    = (email, pw) => supabase.auth.signInWithPassword({ email, password: pw })
export const signUp    = (email, pw) => supabase.auth.signUp({ email, password: pw })
export const signOut   = ()          => supabase.auth.signOut()
export const getSession = ()         => supabase.auth.getSession()

// ── Auth: OAuth providers ─────────────────────────────────────
export const signInWithGoogle = () =>
  supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/` }
  })

export const signInWithGithub = () =>
  supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: `${window.location.origin}/` }
  })

export const signInWithMicrosoft = () =>
  supabase.auth.signInWithOAuth({
    provider: 'azure',
    options: {
      scopes: 'email profile',
      redirectTo: `${window.location.origin}/`
    }
  })
