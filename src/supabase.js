import { createClient } from '@supabase/supabase-js'
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
if (!url || !key) console.warn('Configura VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY')
export const supabase = createClient(url || 'https://invalid.supabase.co', key || 'invalid', {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
})
