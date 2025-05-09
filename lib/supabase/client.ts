import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/types"
import { supabaseUrl, supabaseAnonKey } from "@/lib/env"

// This ensures the client is only created in the browser
let supabaseClient: ReturnType<typeof createClientComponentClient<Database>> | null = null

export const createClient = () => {
  if (supabaseClient) return supabaseClient

  supabaseClient = createClientComponentClient<Database>({
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  })
  return supabaseClient
}
