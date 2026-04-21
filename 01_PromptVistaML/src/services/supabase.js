import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

/* ─── MODELS ─── */

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


/* ─── PRODUCTS ─── */

export const fetchAllProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('priority', { ascending: true })

  if (error) {
    console.error('Error fetching products:', error)
    throw error
  }

  return data || []
}

export const fetchProductByPriority = async (priority) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('priority', priority)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    throw error
  }

  return data
}

export const searchProducts = async (query) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`Name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('priority', { ascending: true })

  if (error) {
    console.error('Error searching products:', error)
    throw error
  }

  return data || []
}