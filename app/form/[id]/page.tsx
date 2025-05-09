import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { FormPage } from "@/components/form-page"
import type { Database } from "@/lib/types"
import { supabaseUrl, supabaseAnonKey } from "@/lib/env"

// Add this export to make the page dynamic and prevent prerendering
export const dynamic = "force-dynamic"

export default async function FormPageRoute({
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

  // Check if form is public
  if (!form.is_public) {
    // Check if user is the owner
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || user.id !== form.user_id) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="w-full max-w-md text-center">
            <h1 className="text-2xl font-bold mb-4">Form not available</h1>
            <p className="text-gray-600 mb-6">This form is private and cannot be accessed.</p>
          </div>
        </div>
      )
    }
  }

  // Sort questions by order_number
  form.questions.sort((a, b) => a.order_number - b.order_number)

  // Check if user has already submitted a response (using cookies)
  const hasSubmitted = cookies().get(`form_${params.id}_submitted`)?.value === "true"

  return <FormPage form={form} hasSubmitted={hasSubmitted} formId={params.id} />
}
