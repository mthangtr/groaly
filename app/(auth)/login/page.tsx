"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Lock, Mail, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signInError) {
        setError(signInError.message)
      } else {
        setSuccess(true)
        setEmail("")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-zinc-50">
      {/* Left Panel - Branding */}
      <div className="hidden md:flex md:flex-col md:justify-between bg-gradient-to-br from-zinc-900 to-zinc-800 p-12 text-white">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">DumTasking</h1>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Focus on what matters
            </h2>
            <p className="text-zinc-400">
              A productivity system designed for deep work, task management, and weekly reflection.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { title: "Protected Focus", desc: "Block time for important work" },
              { title: "Smart Tasks", desc: "Organize with priorities and tracking" },
              { title: "Weekly Reviews", desc: "Reflect and plan for next week" },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="text-sm text-zinc-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-zinc-500">
          © 2026 DumTasking. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex flex-col justify-center px-6 md:px-12 py-12">
        <div className="w-full max-w-sm mx-auto space-y-8">
          {/* Mobile Header */}
          <div className="md:hidden text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-zinc-900">DumTasking</h1>
            <p className="text-zinc-600">Sign in to your account</p>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:space-y-2 md:block">
            <h2 className="text-3xl font-bold text-zinc-900">Sign in</h2>
            <p className="text-zinc-600">
              Enter your email to receive a magic link
            </p>
          </div>

          {success ? (
            <div className="space-y-4 bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-green-900">Check your email</p>
                  <p className="text-sm text-green-700">
                    We&apos;ve sent a magic link to <span className="font-medium">{email}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSuccess(false)}
                className="text-sm font-medium text-green-700 hover:text-green-800 underline"
              >
                Try another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-900"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    autoComplete="email"
                    className={cn(
                      "w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm font-medium",
                      "placeholder:text-zinc-400 text-zinc-900",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                      "disabled:bg-zinc-100 disabled:text-zinc-500 disabled:cursor-not-allowed",
                      "transition-colors",
                      error && "border-red-500 focus:ring-red-500"
                    )}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !email}
                className={cn(
                  "w-full px-4 py-2.5 rounded-lg font-medium text-white transition-all",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  "text-sm font-semibold",
                  isLoading || !email
                    ? "bg-zinc-300 cursor-not-allowed"
                    : "bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950"
                )}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending magic link...
                  </span>
                ) : (
                  "Send magic link"
                )}
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-zinc-500">
            <p>
              By signing in, you agree to our{" "}
              <a href="#" className="hover:text-zinc-700 underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="hover:text-zinc-700 underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
