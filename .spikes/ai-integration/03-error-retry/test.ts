/**
 * Spike: Error Handling and Retry Logic
 * 
 * Question: How to handle rate limits, API errors, and implement retry logic?
 * 
 * Run with: bun .spikes/ai-integration/03-error-retry/test.ts
 */

import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})

// Simple retry with exponential backoff
async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number
    initialDelayMs?: number
    maxDelayMs?: number
    retryOn?: (error: unknown) => boolean
  } = {}
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
      console.log(`  Retry ${attempt + 1}/${maxRetries} after ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

function isRetryableError(error: unknown): boolean {
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
  if (errorMessage.includes("500") || errorMessage.includes("502") || errorMessage.includes("503")) {
    return true
  }

  return false
}

async function testSuccessfulRetry() {
  console.log("🧪 Test 1: Successful call (no retry needed)\n")

  try {
    const result = await withRetry(async () => {
      return await generateText({
        model: openrouter("anthropic/claude-haiku-4.5"),
        prompt: "Say 'OK'",
      })
    })

    console.log(`✅ Response: ${result.text}`)
    return true
  } catch (error) {
    console.error("❌ Failed:", error)
    return false
  }
}

async function testInvalidKeyError() {
  console.log("\n🧪 Test 2: Non-retryable error (invalid API key)\n")

  const badClient = createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: "invalid-key-12345",
  })

  try {
    await withRetry(
      async () => {
        return await generateText({
          model: badClient("anthropic/claude-haiku-4.5"),
          prompt: "This should fail immediately",
        })
      },
      { maxRetries: 2 }
    )
    console.log("❌ Expected error but got success")
    return false
  } catch (error) {
    console.log("✅ Error not retried (auth errors should fail fast):")
    console.log(`   ${(error as Error).message.slice(0, 80)}...`)
    return true
  }
}

async function testRetryableErrorSimulation() {
  console.log("\n🧪 Test 3: Retryable error simulation\n")

  let attempts = 0
  const maxFailures = 2

  try {
    const result = await withRetry(
      async () => {
        attempts++
        console.log(`  Attempt ${attempts}`)

        // Simulate transient failure for first 2 attempts
        if (attempts <= maxFailures) {
          const error = new Error("Connection timeout")
          throw error
        }

        return { text: "Success after retries!" }
      },
      { maxRetries: 3, initialDelayMs: 100 }
    )

    console.log(`✅ Succeeded after ${attempts} attempts: ${result.text}`)
    return attempts === maxFailures + 1
  } catch (error) {
    console.error("❌ Failed:", error)
    return false
  }
}

async function testMaxRetriesExceeded() {
  console.log("\n🧪 Test 4: Max retries exceeded\n")

  let attempts = 0

  try {
    await withRetry(
      async () => {
        attempts++
        console.log(`  Attempt ${attempts}`)
        throw new Error("Network timeout - always fails")
      },
      { maxRetries: 2, initialDelayMs: 50 }
    )
    console.log("❌ Expected error but got success")
    return false
  } catch (_error) {
    console.log(`✅ Correctly failed after ${attempts} attempts`)
    return attempts === 3 // initial + 2 retries
  }
}

async function main() {
  console.log("=".repeat(60))
  console.log("Spike: Error Handling and Retry Logic")
  console.log("=".repeat(60))

  if (!process.env.OPENROUTER_API_KEY) {
    console.error("❌ OPENROUTER_API_KEY not set")
    process.exit(1)
  }

  const results = {
    successfulCall: await testSuccessfulRetry(),
    invalidKeyError: await testInvalidKeyError(),
    retrySimulation: await testRetryableErrorSimulation(),
    maxRetriesExceeded: await testMaxRetriesExceeded(),
  }

  console.log("\n" + "=".repeat(60))
  console.log("Results Summary")
  console.log("=".repeat(60))

  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? "✅" : "❌"} ${test}`)
  })

  const allPassed = Object.values(results).every(Boolean)
  console.log(`\n${allPassed ? "🎉 All tests passed!" : "⚠️ Some tests failed"}`)

  process.exit(allPassed ? 0 : 1)
}

main()
