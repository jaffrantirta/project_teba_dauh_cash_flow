import { createClient } from '@supabase/supabase-js'

export function getSupabase() {
  const rawUrl = process.env.SUPABASE_URL
  if (!rawUrl) throw new Error('SUPABASE_URL is not set in .env.local')

  // Only use the origin — strips any accidental /rest/v1 or trailing slash
  const url = new URL(rawUrl).origin

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in .env.local')

  return createClient(url, key, { auth: { persistSession: false } })
}
