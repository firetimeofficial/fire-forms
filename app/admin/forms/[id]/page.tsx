import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { EditFormClient } from "@/components/edit-form-client"
import type { Database } from "@/lib/types"
import { supabaseUrl, supabaseAnonKey } from "@/lib/env"

// Add this export to make the page dynamic and prevent prerendering
export const dynamic = "force-dynamic"

export default async function EditFormPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerComponentClient<Database>({
    cookies,
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  })

  // Get form
  const { data: form } = await supabase.from("forms").select("*").eq("id", params.id).single()

  if (!form) {
    notFound()
  }

  // Get questions
  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("form_id", params.id)
    .order("order_number", { ascending: true })

  return <EditFormClient form={form} questions={questions || []} />
}
