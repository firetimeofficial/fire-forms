"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, ExternalLink, Pencil, Copy, BarChart } from "lucide-react"
import type { Form } from "@/lib/types"

interface FormsClientProps {
  forms: (Form & { response_count: number })[]
}

export function FormsClient({ forms }: FormsClientProps) {
  const copyFormLink = (formId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/form/${formId}`)
    alert("Form link copied to clipboard!")
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Forms</h1>
        <Link href="/admin/forms/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Form
          </Button>
        </Link>
      </div>

      {forms && forms.length > 0 ? (
        <div className="grid gap-6">
          {forms.map((form) => (
            <Card key={form.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{form.title}</CardTitle>
                    <CardDescription className="mt-1">{form.description || "No description"}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/form/${form.id}`} target="_blank">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/admin/forms/${form.id}`}>
                      <Button size="sm">
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium">{new Date(form.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">{form.is_public ? "Public" : "Private"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Responses</p>
                    <p className="font-medium">{form.response_count}</p>
                  </div>
                  <div className="flex-grow flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/forms/${form.id}/responses`}>
                        <BarChart className="h-4 w-4 mr-2" />
                        Responses
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => copyFormLink(form.id)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500 mb-4">You haven't created any forms yet</p>
            <Link href="/admin/forms/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create your first form
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
