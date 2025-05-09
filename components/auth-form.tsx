"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { siteUrl } from "@/lib/env"

type AuthMode = "signin" | "signup"

interface AuthFormProps {
  initialMode?: AuthMode
}

export function AuthForm({ initialMode = "signin" }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin")
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Create the Supabase client only when needed (client-side only)
      const supabase = createClient()

      if (mode === "signin") {
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        console.log("Login successful:", data)

        // Force a refresh to update the auth state
        router.refresh()

        // Redirect to dashboard
        router.push("/admin/dashboard")
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${siteUrl}/auth/callback`,
          },
        })

        if (error) throw error

        alert("Check your email for the confirmation link")
      }
    } catch (error: any) {
      console.error("Auth error:", error)
      setError(error.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">{error}</div>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Processing..." : mode === "signin" ? "Sign In" : "Sign Up"}
        </Button>

        <div className="text-center text-sm">
          {mode === "signin" ? "Don't have an account?" : "Already have an account?"}
          <Button variant="link" onClick={toggleMode} className="ml-1 p-0">
            {mode === "signin" ? "Sign Up" : "Sign In"}
          </Button>
        </div>
      </form>
    </div>
  )
}
