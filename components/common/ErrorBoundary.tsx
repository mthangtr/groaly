"use client"

import * as React from "react"
import { AlertTriangle, RefreshCw, Home, Bug, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const isDev = process.env.NODE_ENV === "development"

type ErrorBoundaryProps = {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  onReset?: () => void
  showDetails?: boolean
  className?: string
}

type ErrorBoundaryState = {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

/**
 * ErrorBoundary catches JavaScript errors in child components,
 * logs them, and displays a fallback UI.
 * 
 * Note: Error boundaries do not catch errors in:
 * - Event handlers (use try/catch)
 * - Async code (use error.tsx for route-level async errors)
 * - Server-side rendering
 * - Errors thrown in the boundary itself
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to console
    console.error("[ErrorBoundary] Caught error:", error)
    console.error("[ErrorBoundary] Component stack:", errorInfo.componentStack)

    // Store error info for display
    this.setState({ errorInfo })

    // Call optional error callback (e.g., for Sentry logging)
    this.props.onError?.(error, errorInfo)

    // Optional: Log to external service
    // logErrorToService(error, errorInfo)
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
    this.props.onReset?.()
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Custom fallback provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
          showDetails={this.props.showDetails ?? isDev}
          className={this.props.className}
        />
      )
    }

    return this.props.children
  }
}

type ErrorFallbackProps = {
  error: Error | null
  errorInfo?: React.ErrorInfo | null
  onReset?: () => void
  showDetails?: boolean
  className?: string
  showHomeButton?: boolean
}

/**
 * Default error fallback UI component.
 * Can be used standalone or as the default UI for ErrorBoundary.
 */
function ErrorFallback({
  error,
  errorInfo,
  onReset,
  showDetails = isDev,
  className,
  showHomeButton = true,
}: ErrorFallbackProps) {
  const [copied, setCopied] = React.useState(false)

  const errorMessage = error?.message || "An unexpected error occurred"
  const errorStack = error?.stack
  const componentStack = errorInfo?.componentStack

  const copyErrorDetails = async () => {
    const details = [
      `Error: ${errorMessage}`,
      errorStack ? `\nStack Trace:\n${errorStack}` : "",
      componentStack ? `\nComponent Stack:${componentStack}` : "",
    ].join("")

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
        "flex min-h-[400px] w-full items-center justify-center p-4",
        className
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
            <CardTitle className="text-lg">Something went wrong</CardTitle>
          </div>
          <CardDescription>
            {showDetails ? errorMessage : "We encountered an unexpected error. Please try again."}
          </CardDescription>
        </CardHeader>

        {showDetails && (errorStack || componentStack) && (
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
            
            {errorStack && (
              <div className="rounded-md bg-muted/50 p-3">
                <pre className="max-h-32 overflow-auto whitespace-pre-wrap text-[10px] text-muted-foreground">
                  {errorStack}
                </pre>
              </div>
            )}
            
            {componentStack && (
              <div className="rounded-md bg-muted/50 p-3">
                <p className="mb-1 text-[10px] font-medium text-muted-foreground">Component Stack:</p>
                <pre className="max-h-24 overflow-auto whitespace-pre-wrap text-[10px] text-muted-foreground">
                  {componentStack}
                </pre>
              </div>
            )}
          </CardContent>
        )}

        <CardFooter className="flex gap-2">
          {onReset && (
            <Button onClick={onReset} size="sm" className="gap-1.5">
              <RefreshCw className="size-3" />
              Try Again
            </Button>
          )}
          {showHomeButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = "/"}
              className="gap-1.5"
            >
              <Home className="size-3" />
              Go Home
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export { ErrorBoundary, ErrorFallback }
export type { ErrorBoundaryProps, ErrorFallbackProps }
