/**
 * Spike: Structured Output with Zod Schemas
 * 
 * Question: Does structured output work with Zod schemas for task extraction?
 * 
 * Run with: bun .spikes/ai-integration/02-zod-structured-output/test.ts
 */

import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { z } from "zod"

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})

// Helper to strip markdown code blocks and parse JSON
function parseJsonResponse<T>(text: string, schema: z.ZodSchema<T>): T {
  // Strip markdown code blocks if present
  let jsonStr = text.trim()
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "")
  }
  
  const parsed = JSON.parse(jsonStr)
  return schema.parse(parsed)
}

// Task schema matching our database structure
const TaskSchema = z.object({
  title: z.string().describe("Short, actionable task title"),
  description: z.string().optional().describe("Additional details"),
  priority: z.enum(["0", "1", "2", "3"]).describe("0=urgent, 1=high, 2=medium, 3=low"),
  due_date: z.string().optional().describe("ISO date string if mentioned"),
  tags: z.array(z.string()).optional().describe("Relevant tags"),
})

const ExtractedTasksSchema = z.object({
  tasks: z.array(TaskSchema).describe("List of extracted tasks"),
  summary: z.string().describe("Brief summary of what was extracted"),
})

async function testStructuredOutput() {
  console.log("🧪 Test 1: Extract tasks with Zod schema\n")

  try {
    const { text } = await generateText({
      model: openrouter("anthropic/claude-haiku-4.5"),
      system: `You are a task extraction assistant. Respond ONLY with valid JSON matching this schema:
{
  "tasks": [{ "title": string, "description"?: string, "priority": "0"|"1"|"2"|"3", "due_date"?: string, "tags"?: string[] }],
  "summary": string
}
Priority: 0=urgent, 1=high, 2=medium, 3=low. No markdown, no explanation, just JSON.`,
      prompt: `Extract tasks from this note:
      
Tomorrow I need to:
- Finish the quarterly report (urgent, due Friday)
- Review pull requests from the team
- Schedule dentist appointment
- Buy groceries: milk, eggs, bread`,
    })

    console.log("Raw response:", text.slice(0, 200))
    
    const parsed = parseJsonResponse(text, ExtractedTasksSchema)
    console.log("\n✅ Structured response received:")
    console.log(JSON.stringify(parsed, null, 2))
    console.log(`\n✅ Schema validation passed: ${parsed.tasks.length} tasks extracted`)
    return true
  } catch (error) {
    console.error("❌ Failed:", error)
    return false
  }
}

async function testComplexExtraction() {
  console.log("\n🧪 Test 2: Complex note with implicit tasks\n")

  try {
    const { text } = await generateText({
      model: openrouter("anthropic/claude-haiku-4.5"),
      system: `You are a task extraction assistant. Extract actionable tasks from notes. Respond ONLY with valid JSON:
{
  "tasks": [{ "title": string, "description"?: string, "priority": "0"|"1"|"2"|"3", "due_date"?: string, "tags"?: string[] }],
  "summary": string
}
Priority: 0=urgent, 1=high, 2=medium, 3=low. No markdown, no explanation.`,
      prompt: `Meeting notes from standup:
      
John mentioned the API is broken and needs immediate fix before the demo.
We should probably update the documentation when we get a chance.
Sarah will handle the client call this afternoon.
Don't forget to send the invoice to Acme Corp by end of week.`,
    })

    const parsed = parseJsonResponse(text, ExtractedTasksSchema)
    console.log("✅ Complex extraction result:")
    console.log(JSON.stringify(parsed, null, 2))
    return true
  } catch (error) {
    console.error("❌ Failed:", error)
    return false
  }
}

async function testValidationError() {
  console.log("\n🧪 Test 3: Schema handles edge cases\n")

  // Test with empty/minimal input
  try {
    const { text } = await generateText({
      model: openrouter("anthropic/claude-haiku-4.5"),
      system: `You are a task extraction assistant. If no actionable tasks found, return empty tasks array. Respond ONLY with valid JSON:
{
  "tasks": [{ "title": string, "description"?: string, "priority": "0"|"1"|"2"|"3", "due_date"?: string, "tags"?: string[] }],
  "summary": string
}
No markdown, no explanation.`,
      prompt: "Just some random thoughts about the weather today.",
    })

    const parsed = parseJsonResponse(text, ExtractedTasksSchema)
    console.log("✅ Edge case handled:")
    console.log(JSON.stringify(parsed, null, 2))
    console.log(`   Tasks extracted: ${parsed.tasks.length} (expected 0 or minimal)`)
    return true
  } catch (error) {
    console.error("❌ Failed:", error)
    return false
  }
}

async function main() {
  console.log("=" .repeat(60))
  console.log("Spike: Structured Output with Zod Schemas")
  console.log("=" .repeat(60))

  if (!process.env.OPENROUTER_API_KEY) {
    console.error("❌ OPENROUTER_API_KEY not set in environment")
    process.exit(1)
  }

  const results = {
    structuredOutput: await testStructuredOutput(),
    complexExtraction: await testComplexExtraction(),
    edgeCases: await testValidationError(),
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
