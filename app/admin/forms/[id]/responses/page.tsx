import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { ResponseViewerWrapper } from "@/components/response-viewer-wrapper"
import type { Database } from "@/lib/types"
import { supabaseUrl, supabaseAnonKey } from "@/lib/env"

// Add this export to make the page dynamic and prevent prerendering
export const dynamic = "force-dynamic"

export default async function FormResponsesPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerComponentClient<Database>({
    cookies,
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  })

  // Get form with questions
  const { data: form } = await supabase.from("forms").select("*, questions(*)").eq("id", params.id).single()

  if (!form) {
    notFound()
  }

  // Get responses with answers
  const { data: responses } = await supabase
    .from("responses")
    .select("*, answers(*)")
    .eq("form_id", params.id)
    .order("submitted_at", { ascending: false })

  return <ResponseViewerWrapper form={form} responses={responses || []} formId={params.id} />
}
