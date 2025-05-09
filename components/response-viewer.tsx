"use client"

import { useState } from "react"
import type { FormWithQuestions, ResponseWithAnswers } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, ChevronDown, ChevronUp } from "lucide-react"

interface ResponseViewerProps {
  form: FormWithQuestions
  responses: ResponseWithAnswers[]
}

export function ResponseViewer({ form, responses }: ResponseViewerProps) {
  const [expandedResponse, setExpandedResponse] = useState<string | null>(null)

  const toggleExpand = (responseId: string) => {
    if (expandedResponse === responseId) {
      setExpandedResponse(null)
    } else {
      setExpandedResponse(responseId)
    }
  }

  const downloadCSV = () => {
    // Create headers
    const headers = ["Submission Time", "Email"]
    form.questions.forEach((q) => {
      headers.push(q.question_text)
    })

    // Create rows
    const rows = responses.map((response) => {
      const row: string[] = [new Date(response.submitted_at).toLocaleString(), response.user_email || "Anonymous"]

      form.questions.forEach((question) => {
        const answer = response.answers.find((a) => a.question_id === question.id)
        if (!answer) {
          row.push("No answer")
        } else if (answer.answer_text) {
          row.push(answer.answer_text)
        } else if (answer.answer_options) {
          row.push(answer.answer_options.join(", "))
        } else {
          row.push("No answer")
        }
      })

      return row
    })

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")),
    ].join("\n")

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${form.title.replace(/\s+/g, "_")}_responses.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (responses.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No responses yet</h2>
        <p className="text-gray-600">Share your form to start collecting responses.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {responses.length} {responses.length === 1 ? "Response" : "Responses"}
        </h2>
        <Button onClick={downloadCSV} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download CSV
        </Button>
      </div>

      <Tabs defaultValue="individual">
        <TabsList>
          <TabsTrigger value="individual">Individual Responses</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-4">
          {responses.map((response) => (
            <Card key={response.id}>
              <CardHeader className="py-4 px-6 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-medium">{response.user_email || "Anonymous"}</CardTitle>
                  <p className="text-sm text-gray-500">{new Date(response.submitted_at).toLocaleString()}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => toggleExpand(response.id)}>
                  {expandedResponse === response.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CardHeader>

              {expandedResponse === response.id && (
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {form.questions.map((question) => {
                      const answer = response.answers.find((a) => a.question_id === question.id)
                      return (
                        <div key={question.id} className="space-y-1">
                          <h4 className="font-medium text-sm">{question.question_text}</h4>
                          {!answer ? (
                            <p className="text-sm text-gray-500 italic">No answer</p>
                          ) : answer.answer_text ? (
                            <p className="text-sm">{answer.answer_text}</p>
                          ) : answer.answer_options ? (
                            <ul className="list-disc list-inside text-sm">
                              {answer.answer_options.map((option, i) => (
                                <li key={i}>{option}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500 italic">No answer</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="summary">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Responses</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {form.questions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell className="font-medium">{question.question_text}</TableCell>
                  <TableCell>
                    {question.question_type === "multiple_choice" || question.question_type === "checkbox" ? (
                      <div className="space-y-2">
                        {question.options?.map((option) => {
                          const count = responses.filter((r) =>
                            r.answers.some(
                              (a) =>
                                a.question_id === question.id &&
                                (a.answer_text === option || (a.answer_options && a.answer_options.includes(option))),
                            ),
                          ).length

                          const percentage = Math.round((count / responses.length) * 100)

                          return (
                            <div key={option} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{option}</span>
                                <span>
                                  {count} ({percentage}%)
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: `${percentage}%` }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="italic text-gray-500">
                        {
                          responses.filter((r) =>
                            r.answers.some(
                              (a) => a.question_id === question.id && (a.answer_text || a.answer_options?.length),
                            ),
                          ).length
                        }{" "}
                        responses
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  )
}
