import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, FileText, BarChart } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            <span className="text-xl font-bold">FormFlow</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Create beautiful forms <span className="text-primary">in minutes</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mb-10">
              A modern, simple form builder that helps you collect and analyze responses with ease. No complexity, just
              results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Why choose FormFlow?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="mb-4 text-primary">
                  <FileText className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Simple & Modern</h3>
                <p className="text-gray-600">
                  Clean, intuitive interface that makes form creation a breeze. No unnecessary complexity.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="mb-4 text-primary">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">One-time Submissions</h3>
                <p className="text-gray-600">
                  Prevent duplicate responses with our one-time submission feature. Get clean, accurate data.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="mb-4 text-primary">
                  <BarChart className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Powerful Analytics</h3>
                <p className="text-gray-600">
                  View and analyze responses with our intuitive dashboard. Export data with one click.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <FileText className="h-5 w-5" />
            <span className="font-semibold">FormFlow</span>
          </div>
          <div className="text-sm text-gray-500">&copy; {new Date().getFullYear()} FormFlow. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
