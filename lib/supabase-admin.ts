// lib/supabase/admin.ts
// Client Supabase admin avec service role pour bypasser RLS
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

let adminClient: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  if (adminClient) return adminClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL is required for admin client")
  }

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for admin client")
  }

  adminClient = createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return adminClient
}

export function createAdminClient() {
  return createClient()
}

export default createClient
