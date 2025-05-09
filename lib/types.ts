export type Form = {
  id: string
  title: string
  description: string | null
  created_at: string
  user_id: string
  is_public: boolean
  allow_multiple_submissions: boolean
}

export type Question = {
  id: string
  form_id: string
  question_text: string
  question_type: "text" | "multiple_choice" | "checkbox" | "email" | "number"
  options: string[] | null
  required: boolean
  order_number: number
}

export type Response = {
  id: string
  form_id: string
  user_email: string | null
  submitted_at: string
  respondent_ip: string | null
}

export type Answer = {
  id: string
  response_id: string
  question_id: string
  answer_text: string | null
  answer_options: string[] | null
}

export type FormWithQuestions = Form & {
  questions: Question[]
}

export type ResponseWithAnswers = Response & {
  answers: Answer[]
}

// Supabase Database type definition
export type Database = {
  public: {
    Tables: {
      forms: {
        Row: Form
        Insert: Omit<Form, "id" | "created_at">
        Update: Partial<Omit<Form, "id" | "created_at">>
      }
      questions: {
        Row: Question
        Insert: Omit<Question, "id">
        Update: Partial<Omit<Question, "id">>
      }
      responses: {
        Row: Response
        Insert: Omit<Response, "id" | "submitted_at">
        Update: Partial<Omit<Response, "id" | "submitted_at">>
      }
      answers: {
        Row: Answer
        Insert: Omit<Answer, "id">
        Update: Partial<Omit<Answer, "id">>
      }
    }
    Views: {}
    Functions: {}
  }
}
