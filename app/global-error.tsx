"use client"

import * as React from "react"

const isDev = process.env.NODE_ENV === "development"

type GlobalErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Global error page for Next.js App Router.
 * This catches errors in the root layout.
 * 
 * Note: This must provide its own <html> and <body> tags
 * because it replaces the entire root layout when triggered.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    console.error("[GlobalError] Root layout error:", error)
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
    <html lang="en">
      <body className="antialiased" style={{ fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            backgroundColor: "#fafafa",
          }}
          role="alert"
          aria-live="assertive"
        >
          <div
            style={{
              width: "100%",
              maxWidth: "32rem",
              backgroundColor: "white",
              borderRadius: "0.5rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #e5e7eb",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "50%",
                    backgroundColor: "#fee2e2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                  </svg>
                </div>
                <h1 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827" }}>
                  Critical Error
                </h1>
              </div>
              <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                {isDev ? errorMessage : "A critical error occurred. Please refresh the page or try again later."}
              </p>
            </div>

            {isDev && (errorStack || errorDigest) && (
              <div style={{ padding: "0 1.5rem 1rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                    Error Details (Development Only)
                  </span>
                  <button
                    onClick={copyErrorDetails}
                    style={{
                      fontSize: "0.75rem",
                      padding: "0.25rem 0.5rem",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.25rem",
                      backgroundColor: "white",
                      cursor: "pointer",
                      color: "#374151",
                    }}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                {errorDigest && (
                  <div
                    style={{
                      fontSize: "0.75rem",
                      padding: "0.5rem",
                      backgroundColor: "#f3f4f6",
                      borderRadius: "0.25rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span style={{ color: "#6b7280" }}>Digest: </span>
                    <code style={{ color: "#111827" }}>{errorDigest}</code>
                  </div>
                )}
                {errorStack && (
                  <div
                    style={{
                      backgroundColor: "#f3f4f6",
                      borderRadius: "0.25rem",
                      padding: "0.75rem",
                    }}
                  >
                    <pre
                      style={{
                        maxHeight: "10rem",
                        overflow: "auto",
                        whiteSpace: "pre-wrap",
                        fontSize: "0.625rem",
                        color: "#6b7280",
                        margin: 0,
                      }}
                    >
                      {errorStack}
                    </pre>
                  </div>
                )}
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                padding: "1rem 1.5rem",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <button
                onClick={reset}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.5rem 0.75rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "white",
                  backgroundColor: "#111827",
                  border: "none",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                </svg>
                Try Again
              </button>
              <button
                onClick={() => window.location.href = "/"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.5rem 0.75rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                  <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
                Go Home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
