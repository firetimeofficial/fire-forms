"use client"

import type React from "react"

import { useState } from "react"
import type { FormWithQuestions } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { submitFormResponse } from "@/app/actions/form-actions"
import { useRouter } from "next/navigation"

interface FormRendererProps {
  form: FormWithQuestions
  hasSubmitted?: boolean
}

export function FormRenderer({ form, hasSubmitted = false }: FormRendererProps) {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(hasSubmitted)

  const handleTextChange = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value })
    if (errors[questionId]) {
      const newErrors = { ...errors }
      delete newErrors[questionId]
      setErrors(newErrors)
    }
  }

  const handleCheckboxChange = (questionId: string, option: string, checked: boolean) => {
    const currentValues = answers[questionId] || []
    let newValues

    if (checked) {
      newValues = [...currentValues, option]
    } else {
      newValues = currentValues.filter((val: string) => val !== option)
    }

    setAnswers({ ...answers, [questionId]: newValues })

    if (errors[questionId]) {
      const newErrors = { ...errors }
      delete newErrors[questionId]
      setErrors(newErrors)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    // Check required questions
    form.questions.forEach((question) => {
      if (question.required) {
        const answer = answers[question.id]

        if (!answer || (Array.isArray(answer) && answer.length === 0)) {
          newErrors[question.id] = "This question is required"
          isValid = false
        }
      }
    })

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, value]) => ({
        question_id: questionId,
        answer_text: typeof value === "string" ? value : null,
        answer_options: Array.isArray(value) ? value : null,
      }))

      const { success, error } = await submitFormResponse({
        formId: form.id,
        email: email || null,
        answers: formattedAnswers,
      })

      if (error) {
        throw new Error(error)
      }

      setSubmitted(true)
      router.refresh()
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Failed to submit form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Thank you for your submission!</h2>
        <p className="text-gray-600 mb-6">Your response has been recorded.</p>
        {form.allow_multiple_submissions && (
          <Button
            onClick={() => {
              setAnswers({})
              setEmail("")
              setSubmitted(false)
            }}
          >
            Submit another response
          </Button>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {form.questions.map((question) => (
        <div key={question.id} className="space-y-2">
          <Label className={question.required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}>
            {question.question_text}
          </Label>

          {question.question_type === "text" && (
            <Textarea
              value={answers[question.id] || ""}
              onChange={(e) => handleTextChange(question.id, e.target.value)}
              placeholder="Your answer"
            />
          )}

          {question.question_type === "email" && (
            <Input
              type="email"
              value={answers[question.id] || ""}
              onChange={(e) => handleTextChange(question.id, e.target.value)}
              placeholder="your@email.com"
            />
          )}

          {question.question_type === "number" && (
            <Input
              type="number"
              value={answers[question.id] || ""}
              onChange={(e) => handleTextChange(question.id, e.target.value)}
              placeholder="Your answer"
            />
          )}

          {question.question_type === "multiple_choice" && question.options && (
            <RadioGroup
              value={answers[question.id] || ""}
              onValueChange={(value) => handleTextChange(question.id, value)}
            >
              {question.options.map((option, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${question.id}-option-${i}`} />
                  <Label htmlFor={`${question.id}-option-${i}`} className="font-normal">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.question_type === "checkbox" && question.options && (
            <div className="space-y-2">
              {question.options.map((option, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question.id}-option-${i}`}
                    checked={(answers[question.id] || []).includes(option)}
                    onCheckedChange={(checked) => handleCheckboxChange(question.id, option, checked as boolean)}
                  />
                  <Label htmlFor={`${question.id}-option-${i}`} className="font-normal">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {errors[question.id] && <p className="text-sm text-red-500">{errors[question.id]}</p>}
        </div>
      ))}

      <div className="space-y-2">
        <Label htmlFor="email">Your email (optional)</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        <p className="text-xs text-gray-500">Providing your email is optional. It helps identify your response.</p>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  )
}
