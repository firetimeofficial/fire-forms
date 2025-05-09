"use client"

import Link from "next/link"
import { FormRenderer } from "@/components/form-renderer"
import { FileText } from "lucide-react"
import type { FormWithQuestions } from "@/lib/types"

interface FormPageProps {
  form: FormWithQuestions
  hasSubmitted: boolean
  formId: string
}

export function FormPage({ form, hasSubmitted, formId }: FormPageProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            <span className="text-xl font-bold">FormFlow</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{form.title}</h1>
            {form.description && <p className="text-gray-600">{form.description}</p>}
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-6">
            <FormRenderer form={form} hasSubmitted={hasSubmitted} />
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container text-center text-sm text-gray-500">Powered by FormFlow</div>
      </footer>
    </div>
  )
}
