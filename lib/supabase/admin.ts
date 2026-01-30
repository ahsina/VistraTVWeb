import { createClient as supabaseCreateClient } from "@supabase/supabase-js"

// Keep the old function name for backward compatibility
export function createAdminClient() {
  return supabaseCreateClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export const createClient = createAdminClient
