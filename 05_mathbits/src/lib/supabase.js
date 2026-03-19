import { createClient } from '@supabase/supabase-js'

// Replace with your Supabase project URL and anon key
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

/**
 * Fetch components for a given category table.
 * Each table should have columns: id, name, description, code, tags
 *
 * @param {'backgrounds'|'color_checker'|'text_animations'|'animations'} table
 */
export async function fetchComponents(table) {
  const { data, error } = await supabase
    .from(table)
    .select('id, name, description, code, tags')
    .order('id')

  if (error) throw error
  return data
}
