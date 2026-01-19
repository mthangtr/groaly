/**
 * Spike: Streaming Chat Responses
 * 
 * Question: Can we stream chat responses from Claude using Vercel AI SDK?
 * 
 * Run with: bun .spikes/ai-integration/04-streaming-chat/test.ts
 */

import { streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})

async function testBasicStreaming() {
  console.log("🧪 Test 1: Basic streaming response\n")

  try {
    const stream = streamText({
      model: openrouter("anthropic/claude-haiku-4.5"),
      prompt: "Count from 1 to 5, one number per line with a brief pause between each.",
    })

    console.log("Streaming chunks:")
    let fullText = ""
    let chunkCount = 0

    for await (const chunk of stream.textStream) {
      process.stdout.write(chunk)
      fullText += chunk
      chunkCount++
    }

    console.log(`\n\n✅ Received ${chunkCount} chunks, ${fullText.length} chars total`)
    return chunkCount > 1 // Should have multiple chunks
  } catch (error) {
    console.error("❌ Failed:", error)
    return false
  }
}

async function testStreamWithMessages() {
  console.log("\n🧪 Test 2: Streaming with system + messages format\n")

  try {
    const stream = streamText({
      model: openrouter("anthropic/claude-haiku-4.5"),
      system: "You are a helpful task assistant. Be concise.",
      messages: [
        { role: "user", content: "What are 3 tips for staying focused?" },
      ],
    })

    console.log("Streaming response:")
    let fullText = ""

    for await (const chunk of stream.textStream) {
      process.stdout.write(chunk)
      fullText += chunk
    }

    console.log("\n")
    
    // Get final result with usage
    const result = await stream
    console.log(`✅ Tokens used: ${result.usage?.totalTokens ?? "N/A"}`)
    return fullText.length > 0
  } catch (error) {
    console.error("❌ Failed:", error)
    return false
  }
}

async function testStreamToResponse() {
  console.log("\n🧪 Test 3: Get full text after streaming\n")

  try {
    const stream = streamText({
      model: openrouter("anthropic/claude-haiku-4.5"),
      prompt: "Say 'Hello World' in exactly those words.",
    })

    // Consume stream and get full text
    const text = await stream.text
    console.log(`Full text: "${text}"`)
    
    const usage = await stream.usage
    console.log(`Usage: ${JSON.stringify(usage)}`)

    console.log("✅ Successfully got full text after stream")
    return text.toLowerCase().includes("hello")
  } catch (error) {
    console.error("❌ Failed:", error)
    return false
  }
}

async function testStreamAbort() {
  console.log("\n🧪 Test 4: Stream abort handling\n")

  try {
    const controller = new AbortController()
    
    const stream = streamText({
      model: openrouter("anthropic/claude-haiku-4.5"),
      prompt: "Write a very long story about a dragon. Make it at least 500 words.",
      abortSignal: controller.signal,
    })

    let charCount = 0
    const maxChars = 50

    try {
      for await (const chunk of stream.textStream) {
        charCount += chunk.length
        process.stdout.write(chunk)
        
        if (charCount > maxChars) {
          console.log("\n  [Aborting stream...]")
          controller.abort()
          break
        }
      }
    } catch (err) {
      // Abort throws an error, which is expected
      if ((err as Error).name === "AbortError") {
        console.log("  [Stream aborted as expected]")
      } else {
        throw err
      }
    }

    console.log(`\n✅ Aborted after ${charCount} chars (limit: ${maxChars})`)
    return charCount >= maxChars
  } catch (error) {
    console.error("❌ Failed:", error)
    return false
  }
}

async function main() {
  console.log("=" .repeat(60))
  console.log("Spike: Streaming Chat Responses")
  console.log("=" .repeat(60))

  if (!process.env.OPENROUTER_API_KEY) {
    console.error("❌ OPENROUTER_API_KEY not set")
    process.exit(1)
  }

  const results = {
    basicStreaming: await testBasicStreaming(),
    streamWithMessages: await testStreamWithMessages(),
    streamToResponse: await testStreamToResponse(),
    streamAbort: await testStreamAbort(),
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
