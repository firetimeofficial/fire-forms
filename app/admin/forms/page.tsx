import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { FormsClient } from "@/components/forms-client"
import type { Database } from "@/lib/types"
import { supabaseUrl, supabaseAnonKey } from "@/lib/env"

// Add this export to make the page dynamic and prevent prerendering
export const dynamic = "force-dynamic"

export default async function FormsPage() {
  const supabase = createServerComponentClient<Database>({
    cookies,
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  })

  // Get all forms
  const { data: forms } = await supabase
    .from("forms")
    .select(`
      id, 
      title, 
      description, 
      created_at, 
      is_public,
      (
        SELECT count(*) 
        FROM responses 
        WHERE responses.form_id = forms.id
      ) as response_count
    `)
    .order("created_at", { ascending: false })

  return <FormsClient forms={forms || []} />
}
