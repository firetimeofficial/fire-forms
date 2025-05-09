"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { Database } from "@/lib/types"
import { supabaseUrl, supabaseAnonKey, siteUrl } from "@/lib/env"

export async function createForm(formData: any) {
  const supabase = createServerActionClient<Database>({
    cookies,
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to create a form" }
  }

  // Insert form
  const { data: form, error: formError } = await supabase
    .from("forms")
    .insert({
      title: formData.title,
      description: formData.description || null,
      is_public: formData.is_public,
      allow_multiple_submissions: formData.allow_multiple_submissions,
      user_id: user.id,
    })
    .select()
    .single()

  if (formError) {
    console.error("Error creating form:", formError)
    return { error: "Failed to create form" }
  }

  // Insert questions
  const questions = formData.questions.map((q: any) => ({
    form_id: form.id,
    question_text: q.question_text,
    question_type: q.question_type,
    options: q.options,
    required: q.required,
    order_number: q.order_number,
  }))

  const { error: questionsError } = await supabase.from("questions").insert(questions)

  if (questionsError) {
    console.error("Error creating questions:", questionsError)
    return { error: "Failed to create questions" }
  }

  revalidatePath("/admin/forms")
  return { formId: form.id }
}

export async function updateForm(formId: string, formData: any) {
  const supabase = createServerActionClient<Database>({
    cookies,
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to update a form" }
  }

  // Update form
  const { error: formError } = await supabase
    .from("forms")
    .update({
      title: formData.title,
      description: formData.description || null,
      is_public: formData.is_public,
      allow_multiple_submissions: formData.allow_multiple_submissions,
    })
    .eq("id", formId)
    .eq("user_id", user.id)

  if (formError) {
    console.error("Error updating form:", formError)
    return { error: "Failed to update form" }
  }

  // Delete existing questions
  const { error: deleteError } = await supabase.from("questions").delete().eq("form_id", formId)

  if (deleteError) {
    console.error("Error deleting questions:", deleteError)
    return { error: "Failed to update questions" }
  }

  // Insert new questions
  const questions = formData.questions.map((q: any) => ({
    form_id: formId,
    question_text: q.question_text,
    question_type: q.question_type,
    options: q.options,
    required: q.required,
    order_number: q.order_number,
  }))

  const { error: questionsError } = await supabase.from("questions").insert(questions)

  if (questionsError) {
    console.error("Error creating questions:", questionsError)
    return { error: "Failed to create questions" }
  }

  revalidatePath(`/admin/forms/${formId}`)
  revalidatePath(`/form/${formId}`)
  return { success: true }
}

export async function deleteForm(formId: string) {
  const supabase = createServerActionClient<Database>({
    cookies,
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to delete a form" }
  }

  // Delete form (cascade will delete questions and responses)
  const { error } = await supabase.from("forms").delete().eq("id", formId).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting form:", error)
    return { error: "Failed to delete form" }
  }

  revalidatePath("/admin/forms")
  return { success: true }
}

export async function submitFormResponse(data: {
  formId: string
  email: string | null
  answers: Array<{
    question_id: string
    answer_text: string | null
    answer_options: string[] | null
  }>
}) {
  const supabase = createServerActionClient<Database>({
    cookies,
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  })

  // Check if form exists and is public
  const { data: form, error: formError } = await supabase
    .from("forms")
    .select("id, is_public, allow_multiple_submissions")
    .eq("id", data.formId)
    .single()

  if (formError || !form) {
    console.error("Error fetching form:", formError)
    return { error: "Form not found" }
  }

  // Check if user has already submitted a response
  if (!form.allow_multiple_submissions && data.email) {
    const { data: existingResponse, error: responseError } = await supabase
      .from("responses")
      .select("id")
      .eq("form_id", data.formId)
      .eq("user_email", data.email)
      .maybeSingle()

    if (existingResponse) {
      return { error: "You have already submitted a response to this form" }
    }
  }

  // Get client IP
  let clientIp = null
  try {
    const response = await fetch("https://api.ipify.org?format=json")
    const ipData = await response.json()
    clientIp = ipData.ip
  } catch (error) {
    console.error("Error getting client IP:", error)
  }

  // Insert response
  const { data: response, error: responseError } = await supabase
    .from("responses")
    .insert({
      form_id: data.formId,
      user_email: data.email,
      respondent_ip: clientIp,
    })
    .select()
    .single()

  if (responseError) {
    console.error("Error creating response:", responseError)
    return { error: "Failed to submit response" }
  }

  // Insert answers
  const answers = data.answers.map((answer) => ({
    response_id: response.id,
    question_id: answer.question_id,
    answer_text: answer.answer_text,
    answer_options: answer.answer_options,
  }))

  const { error: answersError } = await supabase.from("answers").insert(answers)

  if (answersError) {
    console.error("Error creating answers:", answersError)
    return { error: "Failed to submit answers" }
  }

  // Set a cookie to prevent multiple submissions
  if (!form.allow_multiple_submissions) {
    cookies().set(`form_${data.formId}_submitted`, "true", {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    })
  }

  revalidatePath(`/form/${data.formId}`)
  return { success: true }
}

export async function signOut() {
  const supabase = createServerActionClient<Database>({
    cookies,
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  })

  await supabase.auth.signOut()
  revalidatePath("/")
  redirect(siteUrl)
}
