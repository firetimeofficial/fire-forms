import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { DashboardClient } from "@/components/dashboard-client"
import type { Database } from "@/lib/types"
import { supabaseUrl, supabaseAnonKey } from "@/lib/env"

// Add this export to make the page dynamic and prevent prerendering
export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const supabase = createServerComponentClient<Database>({
    cookies,
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  })

  // Get forms count
  const { count: formsCount } = await supabase.from("forms").select("*", { count: "exact", head: true })

  // Get responses count
  const { count: responsesCount } = await supabase.from("responses").select("*", { count: "exact", head: true })

  // Get recent forms
  const { data: recentForms } = await supabase
    .from("forms")
    .select("id, title, created_at")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <DashboardClient
      formsCount={formsCount || 0}
      responsesCount={responsesCount || 0}
      recentForms={recentForms || []}
    />
  )
}
