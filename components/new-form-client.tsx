"use client"

import { FormBuilder } from "@/components/ui/form-builder"

export function NewFormClient() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create New Form</h1>
      <FormBuilder />
    </div>
  )
}
