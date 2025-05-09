"use client"

import type React from "react"

import { useState } from "react"
import { PlusCircle, Trash2, GripVertical, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Question, Form } from "@/lib/types"
import { createForm, updateForm } from "@/app/actions/form-actions"
import { useRouter } from "next/navigation"

type QuestionType = "text" | "multiple_choice" | "checkbox" | "email" | "number"

// Update the FormBuilder component to accept form and questions props
type FormBuilderProps = {
  form?: Form
  questions?: Question[]
}

export function FormBuilder({ form, questions }: FormBuilderProps = {}) {
  const router = useRouter()
  const [title, setTitle] = useState(form?.title || "")
  const [description, setDescription] = useState(form?.description || "")
  const [isPublic, setIsPublic] = useState(form?.is_public || false)
  const [allowMultipleSubmissions, setAllowMultipleSubmissions] = useState(form?.allow_multiple_submissions || false)
  const [formQuestions, setFormQuestions] = useState<Partial<Question>[]>(
    questions && questions.length > 0
      ? questions.map((q) => ({
          ...q,
          options: q.options || [],
        }))
      : [
          {
            question_text: "",
            question_type: "text",
            options: [],
            required: false,
            order_number: 0,
          },
        ],
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addQuestion = () => {
    setFormQuestions([
      ...formQuestions,
      {
        question_text: "",
        question_type: "text",
        options: [],
        required: false,
        order_number: formQuestions.length,
      },
    ])
  }

  const removeQuestion = (index: number) => {
    if (formQuestions.length > 1) {
      const newQuestions = [...formQuestions]
      newQuestions.splice(index, 1)
      // Update order numbers
      newQuestions.forEach((q, i) => {
        q.order_number = i
      })
      setFormQuestions(newQuestions)
    }
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...formQuestions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }
    setFormQuestions(newQuestions)
  }

  const addOption = (questionIndex: number) => {
    const newQuestions = [...formQuestions]
    const currentOptions = newQuestions[questionIndex].options || []
    newQuestions[questionIndex].options = [...currentOptions, ""]
    setFormQuestions(newQuestions)
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...formQuestions]
    const options = [...(newQuestions[questionIndex].options || [])]
    options[optionIndex] = value
    newQuestions[questionIndex].options = options
    setFormQuestions(newQuestions)
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...formQuestions]
    const options = [...(newQuestions[questionIndex].options || [])]
    options.splice(optionIndex, 1)
    newQuestions[questionIndex].options = options
    setFormQuestions(newQuestions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert("Please enter a form title")
      return
    }

    // Validate questions
    for (let i = 0; i < formQuestions.length; i++) {
      const q = formQuestions[i]
      if (!q.question_text?.trim()) {
        alert(`Question ${i + 1} is missing text`)
        return
      }

      if (
        (q.question_type === "multiple_choice" || q.question_type === "checkbox") &&
        (!q.options || q.options.length < 2)
      ) {
        alert(`Question ${i + 1} needs at least 2 options`)
        return
      }
    }

    setIsSubmitting(true)

    try {
      const formData = {
        title,
        description,
        is_public: isPublic,
        allow_multiple_submissions: allowMultipleSubmissions,
        questions: formQuestions.map((q) => ({
          ...q,
          options: q.options && q.options.length > 0 ? q.options : null,
        })),
      }

      if (form) {
        // Update existing form
        const { error } = await updateForm(form.id, formData)
        if (error) {
          throw new Error(error)
        }
        router.push(`/admin/forms/${form.id}`)
      } else {
        // Create new form
        const { formId, error } = await createForm(formData)
        if (error) {
          throw new Error(error)
        }
        router.push(`/admin/forms/${formId}`)
      }
    } catch (error) {
      console.error("Error saving form:", error)
      alert("Failed to save form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-10">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Form Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter form title"
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter form description"
            className="mt-1"
          />
        </div>

        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <Switch id="is-public" checked={isPublic} onCheckedChange={setIsPublic} />
            <Label htmlFor="is-public">Make form public</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="allow-multiple"
              checked={allowMultipleSubmissions}
              onCheckedChange={setAllowMultipleSubmissions}
            />
            <Label htmlFor="allow-multiple">Allow multiple submissions</Label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Questions</h2>

        {formQuestions.map((question, index) => (
          <Card key={index} className="relative">
            <CardContent className="pt-6">
              <div className="absolute top-3 right-3 flex space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeQuestion(index)}
                  disabled={formQuestions.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="cursor-move">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-4">
                  <div>
                    <Label htmlFor={`question-${index}`}>Question</Label>
                    <Input
                      id={`question-${index}`}
                      value={question.question_text || ""}
                      onChange={(e) => updateQuestion(index, "question_text", e.target.value)}
                      placeholder="Enter your question"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`type-${index}`}>Question Type</Label>
                    <Select
                      value={question.question_type}
                      onValueChange={(value) => updateQuestion(index, "question_type", value)}
                    >
                      <SelectTrigger id={`type-${index}`} className="mt-1">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                        <SelectItem value="checkbox">Checkbox</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(question.question_type === "multiple_choice" || question.question_type === "checkbox") && (
                  <div className="space-y-2">
                    <Label>Options</Label>
                    {(question.options || []).map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOption(index, optionIndex)}
                          disabled={(question.options || []).length <= 2}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => addOption(index)} className="mt-2">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id={`required-${index}`}
                    checked={question.required || false}
                    onCheckedChange={(checked) => updateQuestion(index, "required", checked)}
                  />
                  <Label htmlFor={`required-${index}`}>Required question</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button type="button" variant="outline" onClick={addQuestion} className="w-full">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : form ? "Update Form" : "Create Form"}
          <Save className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
