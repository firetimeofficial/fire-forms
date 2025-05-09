import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { Database } from "@/lib/types"
import { supabaseUrl, supabaseAnonKey, siteUrl } from "@/lib/env"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabase = createRouteHandlerClient<Database>({
      cookies,
      supabaseUrl,
      supabaseKey: supabaseAnonKey,
    })

    try {
      await supabase.auth.exchangeCodeForSession(code)
    } catch (error) {
      console.error("Error exchanging code for session:", error)
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${siteUrl}/admin/dashboard`)
}
