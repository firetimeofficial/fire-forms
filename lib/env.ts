// This file centralizes environment variable access and provides fallbacks

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://talprviimbwlsunfthkq.supabase.co"
export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhbHBydmlpbWJ3bHN1bmZ0aGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3OTYwNDcsImV4cCI6MjA2MjM3MjA0N30.CRIkYd1bNoLKBjgJ0Ch9b7RO0IKwSJBfJIDSUG6lbV8"
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://forms.firetime.me"
