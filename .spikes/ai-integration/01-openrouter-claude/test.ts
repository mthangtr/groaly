/**
 * Spike: OpenRouter + Claude Basic Integration
 * 
 * Question: Can we successfully call Claude via OpenRouter with Vercel AI SDK?
 * 
 * Run with: bun .spikes/ai-integration/01-openrouter-claude/test.ts
 */

import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})

async function testBasicCall() {
  console.log("🧪 Test 1: Basic API call to Claude via OpenRouter\n")

  try {
    const { text, usage } = await generateText({
      model: openrouter("anthropic/claude-haiku-4.5"),
      prompt: "Say 'Hello from Claude via OpenRouter!' in exactly those words.",
    })

    console.log("✅ Response received:")
    console.log(`   Text: ${text}`)
    console.log(`   Tokens: ${usage?.totalTokens ?? "N/A"}`)
    return true
  } catch (error) {
    console.error("❌ Failed:", error)
    return false
  }
}

async function testSystemPrompt() {
  console.log("\n🧪 Test 2: System prompt + messages format\n")

  try {
    const { text } = await generateText({
      model: openrouter("anthropic/claude-haiku-4.5"),
      system: "You are a task extraction assistant. Always respond in JSON format.",
      messages: [
        {
          role: "user",
          content: "Extract tasks from: 'I need to buy milk and call mom tomorrow'",
        },
      ],
    })

    console.log("✅ Response received:")
    console.log(`   Text: ${text}`)
    return true
  } catch (error) {
    console.error("❌ Failed:", error)
    return false
  }
}

async function testInvalidKey() {
  console.log("\n🧪 Test 3: Error handling with invalid API key\n")

  const badClient = createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: "invalid-key-12345",
  })

  try {
    await generateText({
      model: badClient("anthropic/claude-haiku-4.5"),
      prompt: "This should fail",
    })
    console.log("❌ Expected error but got success")
    return false
  } catch (error) {
    console.log("✅ Error handled correctly:")
    console.log(`   Type: ${(error as Error).name}`)
    console.log(`   Message: ${(error as Error).message.slice(0, 100)}...`)
    return true
  }
}

async function main() {
  console.log("=" .repeat(60))
  console.log("Spike: OpenRouter + Claude Basic Integration")
  console.log("=" .repeat(60))

  if (!process.env.OPENROUTER_API_KEY) {
    console.error("❌ OPENROUTER_API_KEY not set in environment")
    process.exit(1)
  }

  const results = {
    basicCall: await testBasicCall(),
    systemPrompt: await testSystemPrompt(),
    errorHandling: await testInvalidKey(),
  }

  console.log("\n" + "=" .repeat(60))
  console.log("Results Summary")
  console.log("=" .repeat(60))
  
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? "✅" : "❌"} ${test}`)
  })

  const allPassed = Object.values(results).every(Boolean)
  console.log(`\n${allPassed ? "🎉 All tests passed!" : "⚠️ Some tests failed"}`)
  
  process.exit(allPassed ? 0 : 1)
}

main()
