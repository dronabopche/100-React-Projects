import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export const fetchAllModels = async () => {
  const { data, error } = await supabase
    .from('models')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching models:', error)
    throw error
  }
  
  return data || []
}

export const fetchModelById = async (id) => {
  const { data, error } = await supabase
    .from('models')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching model:', error)
    throw error
  }
  
  return data
}

export const fetchModelByNumber = async (modelNumber) => {
  const { data, error } = await supabase
    .from('models')
    .select('*')
    .eq('model_number', modelNumber)
    .single()
  
  if (error) {
    console.error('Error fetching model:', error)
    throw error
  }
  
  return data
}

export const searchModels = async (query) => {
  const { data, error } = await supabase
    .from('models')
    .select('*')
    .or(`model_name.ilike.%${query}%,model_description.ilike.%${query}%,category.ilike.%${query}%`)
  
  if (error) {
    console.error('Error searching models:', error)
    throw error
  }
  
  return data || []
}

export const fetchDocumentationSections = async () => {
  const { data, error } = await supabase
    .from('api_documentation')
    .select('*')
    .order('section_order', { ascending: true })
  
  if (error) {
    console.error('Error fetching documentation:', error)
    throw error
  }
  
  return data || []
}

export const fetchRateLimits = async () => {
  const { data, error } = await supabase
    .from('rate_limits')
    .select('*')
    .order('price_per_month', { ascending: true })
  
  if (error) {
    console.error('Error fetching rate limits:', error)
    throw error
  }
  
  return data || []
}

export const fetchApiResources = async () => {
  const { data, error } = await supabase
    .from('api_resources')
    .select('*')
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('Error fetching API resources:', error)
    throw error
  }
  
  return data || []
}

export const fetchModelDocumentation = async (modelNumber) => {
  const { data, error } = await supabase
    .from('model_documentation')
    .select('*')
    .eq('model_number', modelNumber)
    .single()
  
  if (error) {
    console.error('Error fetching model documentation:', error)
    throw error
  }
  
  return data
}