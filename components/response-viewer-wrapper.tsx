"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ResponseViewer } from "@/components/response-viewer"
import { ArrowLeft } from "lucide-react"
import type { FormWithQuestions, ResponseWithAnswers } from "@/lib/types"

interface ResponseViewerWrapperProps {
  form: FormWithQuestions
  responses: ResponseWithAnswers[]
  formId: string
}

export function ResponseViewerWrapper({ form, responses, formId }: ResponseViewerWrapperProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/forms/${formId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Form
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{form.title}: Responses</h1>
      </div>

      <ResponseViewer form={form} responses={responses} />
    </div>
  )
}
