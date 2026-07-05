import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

const createSupabaseClient = (): SupabaseClient | null => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  try {
    return createClient(supabaseUrl, supabaseAnonKey)
  } catch {
    return null
  }
}

export const supabaseClient = createSupabaseClient()
export const isSupabaseConfigured = supabaseClient !== null
