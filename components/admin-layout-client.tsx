"use client"

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, LayoutDashboard, FileSpreadsheet, LogOut } from "lucide-react"
import { signOut } from "@/app/actions/form-actions"
import type { User } from "@supabase/supabase-js"

interface AdminLayoutClientProps {
  children: React.ReactNode
  user: User
}

export function AdminLayoutClient({ children, user }: AdminLayoutClientProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              <span className="text-xl font-bold">FormFlow</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <form action={signOut}>
              <Button variant="ghost" size="icon" type="submit">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Sign out</span>
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 border-r bg-gray-50 hidden md:block">
          <nav className="p-4 space-y-2">
            <Link href="/admin/dashboard">
              <Button variant="ghost" className="w-full justify-start">
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/forms">
              <Button variant="ghost" className="w-full justify-start">
                <FileSpreadsheet className="mr-2 h-5 w-5" />
                My Forms
              </Button>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
