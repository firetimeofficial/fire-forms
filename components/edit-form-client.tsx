"use client"

import { FormBuilder } from "@/components/ui/form-builder"
import type { Form, Question } from "@/lib/types"

interface EditFormClientProps {
  form: Form
  questions: Question[]
}

export function EditFormClient({ form, questions }: EditFormClientProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Form</h1>
      <FormBuilder form={form} questions={questions} />
    </div>
  )
}
