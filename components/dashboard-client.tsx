"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, BarChart, Plus } from "lucide-react"

interface DashboardClientProps {
  formsCount: number
  responsesCount: number
  recentForms: Array<{
    id: string
    title: string
    created_at: string
  }>
}

export function DashboardClient({ formsCount, responsesCount, recentForms }: DashboardClientProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/admin/forms/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Form
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formsCount}</div>
            <p className="text-xs text-gray-500 mt-1">Forms created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{responsesCount}</div>
            <p className="text-xs text-gray-500 mt-1">Responses collected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <BarChart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formsCount ? Math.round(responsesCount / formsCount) : 0}</div>
            <p className="text-xs text-gray-500 mt-1">Avg. responses per form</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Forms</h2>
        {recentForms && recentForms.length > 0 ? (
          <div className="space-y-4">
            {recentForms.map((form) => (
              <Card key={form.id}>
                <CardHeader className="py-4">
                  <div className="flex justify-between items-center">
                    <CardTitle>{form.title}</CardTitle>
                    <div className="flex gap-2">
                      <Link href={`/form/${form.id}`} target="_blank">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link href={`/admin/forms/${form.id}`}>
                        <Button size="sm">Manage</Button>
                      </Link>
                    </div>
                  </div>
                  <CardDescription>Created on {new Date(form.created_at).toLocaleDateString()}</CardDescription>
                </CardHeader>
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
    </div>
  )
}
