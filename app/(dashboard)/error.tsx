"use client"

import * as React from "react"
import { AlertTriangle, RefreshCw, LayoutDashboard, Bug, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const isDev = process.env.NODE_ENV === "development"

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Dashboard-specific error page.
 * Catches errors within the dashboard route group.
 * Provides a "Go to Dashboard" button instead of "Go Home".
 */
export default function DashboardErrorPage({ error, reset }: ErrorPageProps) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    // Log error to console
    console.error("[DashboardError] Route error:", error)
    
    // Optional: Log to external service (Sentry, etc.)
    // logErrorToService(error)
  }, [error])

  const errorMessage = error.message || "An unexpected error occurred"
  const errorDigest = error.digest
  const errorStack = error.stack

  const copyErrorDetails = async () => {
    const details = [
      `Error: ${errorMessage}`,
      errorDigest ? `Digest: ${errorDigest}` : "",
      errorStack ? `\nStack Trace:\n${errorStack}` : "",
    ].filter(Boolean).join("\n")

    try {
      await navigator.clipboard.writeText(details)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      console.error("Failed to copy error details")
    }
  }

  return (
    <div
      className={cn(
        "flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-4"
      )}
      role="alert"
      aria-live="assertive"
    >
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="size-5 text-destructive" />
            </div>
            <CardTitle className="text-lg">Dashboard Error</CardTitle>
          </div>
          <CardDescription>
            {isDev ? errorMessage : "Something went wrong while loading this page. Please try again."}
          </CardDescription>
        </CardHeader>

        {isDev && (errorStack || errorDigest) && (
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Bug className="size-3" />
                <span>Error Details (Development Only)</span>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={copyErrorDetails}
                className="gap-1"
              >
                {copied ? (
                  <>
                    <Check className="size-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            {errorDigest && (
              <div className="flex items-center gap-2 rounded-md bg-muted/50 p-2 text-xs">
                <span className="font-medium text-muted-foreground">Digest:</span>
                <code className="text-foreground">{errorDigest}</code>
              </div>
            )}
            
            {errorStack && (
              <div className="rounded-md bg-muted/50 p-3">
                <pre className="max-h-40 overflow-auto whitespace-pre-wrap text-[10px] text-muted-foreground">
                  {errorStack}
                </pre>
              </div>
            )}
          </CardContent>
        )}

        <CardFooter className="flex gap-2">
          <Button onClick={reset} size="sm" className="gap-1.5">
            <RefreshCw className="size-3" />
            Try Again
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = "/kanban"}
            className="gap-1.5"
          >
            <LayoutDashboard className="size-3" />
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
