import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/types"
import { supabaseUrl, supabaseAnonKey } from "@/lib/env"

export const createClient = () => {
  return createServerComponentClient<Database>({
    cookies,
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  })
}
