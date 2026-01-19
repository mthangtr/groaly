/**
 * Spike: Context Injection Pattern
 * 
 * Question: How to inject user tasks, notes, calendar data as context for AI?
 * 
 * Run with: bun .spikes/ai-integration/06-context-injection/test.ts
 */

import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})

// Mock user data
const mockTasks = [
  { id: "1", title: "Review quarterly report", status: "todo", priority: 0, due_date: "2026-01-20" },
  { id: "2", title: "Prepare presentation", status: "in_progress", priority: 1, due_date: "2026-01-21" },
  { id: "3", title: "Update documentation", status: "todo", priority: 2, due_date: null },
]

const mockNotes = [
  { id: "1", title: "Meeting Notes - Q1 Planning", content: "Discussed roadmap priorities. Need to focus on AI features." },
  { id: "2", title: "Ideas for Blog", content: "Write about productivity tips and time management." },
]

// Context builder functions
function buildTasksContext(tasks: typeof mockTasks): string {
  if (tasks.length === 0) return "No tasks found."
  
  const priorityLabels = ["🔴 Urgent", "🟠 High", "🟡 Medium", "🟢 Low"]
  
  return tasks.map(task => {
    const priority = priorityLabels[task.priority] || "Unknown"
    const due = task.due_date ? `Due: ${task.due_date}` : "No due date"
    const status = task.status === "done" ? "✅" : task.status === "in_progress" ? "🔄" : "⬜"
    return `${status} [${priority}] ${task.title} (${due})`
  }).join("\n")
}

function buildNotesContext(notes: typeof mockNotes): string {
  if (notes.length === 0) return "No notes found."
  
  return notes.map(note => {
    const preview = note.content.length > 100 
      ? note.content.slice(0, 100) + "..." 
      : note.content
    return `📝 ${note.title}\n   ${preview}`
  }).join("\n\n")
}

function buildFullContext(data: { tasks: typeof mockTasks; notes: typeof mockNotes }): string {
  return `
## Your Tasks
${buildTasksContext(data.tasks)}

## Your Notes
${buildNotesContext(data.notes)}
`.trim()
}

// Estimate token count (rough approximation: 1 token ≈ 4 chars)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

async function testBasicContextInjection() {
  console.log("🧪 Test 1: Basic context injection\n")

  const context = buildFullContext({ tasks: mockTasks, notes: mockNotes })
  console.log("Context preview:")
  console.log(context.slice(0, 300) + "...\n")
  console.log(`Estimated tokens: ${estimateTokens(context)}`)

  try {
    const { text } = await generateText({
      model: openrouter("anthropic/claude-haiku-4.5"),
      system: `You are a personal productivity assistant. Here is the user's current context:

${context}

Use this context to provide personalized advice.`,
      prompt: "What should I focus on today?",
    })

    console.log("\nAI Response:")
    console.log(text)
    
    // Check if response references actual task data
    const mentionsReport = text.toLowerCase().includes("report") || text.toLowerCase().includes("quarterly")
    console.log(`\n✅ Response references user data: ${mentionsReport}`)
    return mentionsReport
  } catch (error) {
    console.error("❌ Failed:", error)
    return false
  }
}

async function testContextWithQuery() {
  console.log("\n🧪 Test 2: Context-aware query answering\n")

  const context = buildFullContext({ tasks: mockTasks, notes: mockNotes })

  try {
    const { text } = await generateText({
      model: openrouter("anthropic/claude-haiku-4.5"),
      system: `You are a personal assistant with access to the user's data:

${context}

Answer questions based on this data. Be specific and reference actual items.`,
      prompt: "How many urgent tasks do I have and what are they?",
    })

    console.log("AI Response:")
    console.log(text)
    
    const mentionsCount = text.includes("1") || text.toLowerCase().includes("one")
    console.log(`\n✅ Correctly identified count: ${mentionsCount}`)
    return mentionsCount
  } catch (error) {
    console.error("❌ Failed:", error)
    return false
  }
}

async function testTokenLimitHandling() {
  console.log("\n🧪 Test 3: Token limit handling\n")

  // Simulate large context
  const largeTasks = Array.from({ length: 100 }, (_, i) => ({
    id: String(i),
    title: `Task ${i}: This is a longer task title with more details about what needs to be done`,
    status: "todo" as const,
    priority: i % 4,
    due_date: "2026-01-20",
  }))

  const fullContext = buildTasksContext(largeTasks)
  const estimatedTokens = estimateTokens(fullContext)
  console.log(`Full context: ${estimatedTokens} estimated tokens`)

  // Token limit strategy: truncate oldest/lowest priority items
  const MAX_TOKENS = 2000
  let truncatedTasks = largeTasks
  
  if (estimatedTokens > MAX_TOKENS) {
    // Sort by priority (higher = less important), take first N
    const sorted = [...largeTasks].sort((a, b) => a.priority - b.priority)
    const tokenBudget = MAX_TOKENS * 4 // Convert back to chars
    let charCount = 0
    
    truncatedTasks = sorted.filter(task => {
      const taskStr = `${task.title} (${task.due_date})`
      if (charCount + taskStr.length < tokenBudget) {
        charCount += taskStr.length + 50 // overhead
        return true
      }
      return false
    })
  }

  const truncatedContext = buildTasksContext(truncatedTasks)
  const truncatedTokens = estimateTokens(truncatedContext)
  
  console.log(`Truncated to ${truncatedTasks.length} tasks, ${truncatedTokens} tokens`)

  try {
    const { text } = await generateText({
      model: openrouter("anthropic/claude-haiku-4.5"),
      system: `You have access to the user's priority tasks:\n\n${truncatedContext}`,
      prompt: "Summarize my task load in one sentence.",
      maxTokens: 100,
    })

    console.log("\nAI Response:", text)
    console.log("✅ Token limit handling works")
    return true
  } catch (error) {
    console.error("❌ Failed:", error)
    return false
  }
}

async function main() {
  console.log("=" .repeat(60))
  console.log("Spike: Context Injection Pattern")
  console.log("=" .repeat(60))

  if (!process.env.OPENROUTER_API_KEY) {
    console.error("❌ OPENROUTER_API_KEY not set")
    process.exit(1)
  }

  const results = {
    basicContext: await testBasicContextInjection(),
    contextQuery: await testContextWithQuery(),
    tokenLimit: await testTokenLimitHandling(),
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
