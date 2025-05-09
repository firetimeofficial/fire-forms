import { AuthForm } from "@/components/auth-form"
import Link from "next/link"
import { FileText } from "lucide-react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { Database } from "@/lib/types"
import { supabaseUrl, supabaseAnonKey } from "@/lib/env"

// Add this export to make the page dynamic and prevent prerendering
export const dynamic = "force-dynamic"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirectedFrom?: string }
}) {
  const supabase = createServerComponentClient<Database>({
    cookies,
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If already logged in, redirect to dashboard or the page they were trying to access
  if (session) {
    redirect(searchParams.redirectedFrom || "/admin/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col justify-center px-6 py-12">
        <div className="mx-auto w-full max-w-md">
          <div className="flex justify-center mb-6">
            <Link href="/" className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              <span className="text-xl font-bold">FormFlow</span>
            </Link>
          </div>

          <div className="rounded-lg border bg-card p-8 shadow-sm">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-sm text-gray-500 mt-1">Sign in to your account to continue</p>
            </div>

            <AuthForm initialMode="signin" />
          </div>
        </div>
      </div>
    </div>
  )
}
