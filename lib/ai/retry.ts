/**
 * Retry utility with exponential backoff for AI API calls
 */

export interface RetryOptions {
  maxRetries?: number
  initialDelayMs?: number
  maxDelayMs?: number
  retryOn?: (error: unknown) => boolean
}

export function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false

  const errorMessage = error.message.toLowerCase()

  // Rate limit errors
  if (errorMessage.includes("rate limit") || errorMessage.includes("429")) {
    return true
  }

  // Network/timeout errors
  if (
    errorMessage.includes("timeout") ||
    errorMessage.includes("network") ||
    errorMessage.includes("econnreset") ||
    errorMessage.includes("socket hang up")
  ) {
    return true
  }

  // 5xx server errors
  if (
    errorMessage.includes("500") ||
    errorMessage.includes("502") ||
    errorMessage.includes("503")
  ) {
    return true
  }

  return false
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelayMs = 1000,
    maxDelayMs = 30000,
    retryOn = isRetryableError,
  } = options

  let lastError: unknown

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      if (attempt === maxRetries || !retryOn(error)) {
        throw error
      }

      const delay = Math.min(initialDelayMs * Math.pow(2, attempt), maxDelayMs)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError
}
