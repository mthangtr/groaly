"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Mail, Loader2, Sparkles, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left Column - Login Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Header with Logo */}
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </div>
            dumtasking
          </a>
        </div>

        {/* Form Container */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {/* Success State */}
            {success ? (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2 text-center">
                  <h1 className="text-2xl font-bold">Check your email</h1>
                  <p className="text-balance text-sm text-muted-foreground">
                    We&apos;ve sent a magic link to{" "}
                    <span className="font-medium text-foreground">{email}</span>
                  </p>
                </div>
                <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle2 className="size-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Magic link sent</p>
                      <p className="text-sm text-muted-foreground">
                        Click the link in your email to sign in
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSuccess(false)
                      setEmail("")
                    }}
                    className="w-full"
                  >
                    Try another email
                  </Button>
                </div>
              </div>
            ) : (
              /* Login Form */
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2 text-center">
                  <h1 className="text-2xl font-bold">Login to your account</h1>
                  <p className="text-balance text-sm text-muted-foreground">
                    Enter your email below to receive a magic link
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        required
                        autoComplete="email"
                        placeholder="m@example.com"
                        className={cn("pl-9", error && "border-destructive")}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Sending magic link...
                      </>
                    ) : (
                      "Send magic link"
                    )}
                  </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  By signing in, you agree to our{" "}
                  <a
                    href="#"
                    className="underline underline-offset-4 hover:text-foreground"
                  >
                    Terms
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="underline underline-offset-4 hover:text-foreground"
                  >
                    Privacy Policy
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Cover Image / Features */}
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-10">
          <div className="max-w-md space-y-6">
            {/* Quote Section */}
            <div className="space-y-2 rounded-lg border border-dashed bg-background/50 p-6 backdrop-blur-sm">
              <Sparkles className="mx-auto size-5 text-muted-foreground/70" />
              <blockquote className="text-center text-sm italic text-foreground">
                &ldquo;Dump your notes, AI Agents handle the rest&rdquo;
              </blockquote>
            </div>

            {/* Features List */}
            <div className="space-y-3 rounded-lg border bg-background/50 p-6 backdrop-blur-sm">
              <p className="text-sm font-medium">What you&apos;ll get:</p>
              <div className="space-y-3">
                {[
                  {
                    title: "AI-Powered Extraction",
                    desc: "Transform notes into structured tasks automatically",
                  },
                  {
                    title: "Smart Scheduling",
                    desc: "Daily suggestions based on priorities and energy",
                  },
                  {
                    title: "Focus Mode",
                    desc: "Pomodoro timer with ambient sounds",
                  },
                  {
                    title: "Weekly Insights",
                    desc: "AI-generated reviews and patterns",
                  },
                ].map((feature) => (
                  <div key={feature.title} className="flex gap-3">
                    <div className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-medium">{feature.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
