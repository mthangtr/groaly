/**
 * Spike: Tool Calling with Mock Functions
 * 
 * Question: Does tool calling work with multiple functions?
 * 
 * Run with: bun .spikes/ai-integration/05-tool-calling/test.ts
 */

import { generateText, tool } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { z } from "zod"

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})

// Mock database
const mockTasks = [
  { id: "1", title: "Review PR", status: "todo", priority: 1 },
  { id: "2", title: "Write tests", status: "in_progress", priority: 2 },
  { id: "3", title: "Deploy to staging", status: "todo", priority: 0 },
]

// Track tool executions (since toolCalls metadata might not be reliable)
const toolExecutions: string[] = []

// Define tools
const tools = {
  listTasks: tool({
    description: "List all tasks, optionally filtered by status",
    parameters: z.object({
      status: z.enum(["todo", "in_progress", "done"]).optional(),
    }),
    execute: async ({ status }) => {
      console.log(`  [Tool: listTasks] status=${status ?? "all"}`)
      toolExecutions.push("listTasks")
      const filtered = status 
        ? mockTasks.filter(t => t.status === status)
        : mockTasks
      return filtered
    },
  }),
  
  createTask: tool({
    description: "Create a new task",
    parameters: z.object({
      title: z.string(),
      priority: z.number().min(0).max(3).default(2),
    }),
    execute: async ({ title, priority }) => {
      console.log(`  [Tool: createTask] title="${title}", priority=${priority}`)
      toolExecutions.push("createTask")
      const newTask = {
        id: String(mockTasks.length + 1),
        title,
        status: "todo" as const,
        priority,
      }
      mockTasks.push(newTask)
      return newTask
    },
  }),
  
  updateTaskStatus: tool({
    description: "Update a task's status",
    parameters: z.object({
      taskId: z.string(),
      status: z.enum(["todo", "in_progress", "done"]),
    }),
    execute: async ({ taskId, status }) => {
      console.log(`  [Tool: updateTaskStatus] id=${taskId}, status=${status}`)
      toolExecutions.push("updateTaskStatus")
      const task = mockTasks.find(t => t.id === taskId)
      if (!task) return { error: "Task not found" }
      task.status = status
      return task
    },
  }),
  
  getHighPriorityTasks: tool({
    description: "Get tasks with priority 0 or 1 (urgent/high)",
    parameters: z.object({}),
    execute: async () => {
      console.log("  [Tool: getHighPriorityTasks]")
      toolExecutions.push("getHighPriorityTasks")
      return mockTasks.filter(t => t.priority <= 1)
    },
  }),
}

async function testSingleToolCall() {
  console.log("🧪 Test 1: Single tool call\n")
  toolExecutions.length = 0 // Reset

  try {
    const result = await generateText({
      model: openrouter("anthropic/claude-haiku-4.5"),
      tools,
      toolChoice: "required",
      maxSteps: 2,
      prompt: "What are my high priority tasks?",
    })

    console.log(`Steps: ${result.steps.length}`)
    console.log(`Tool executions: ${toolExecutions.join(", ") || "none"}`)
    console.log(`Response: ${result.text || "(no final text)"}`)
    
    const passed = toolExecutions.length > 0
    console.log(passed ? "✅ Tool was executed" : "❌ No tool executed")
    return passed
  } catch (error) {
    console.error("❌ Failed:", error)
    return false
  }
}

async function testMultipleToolCalls() {
  console.log("\n🧪 Test 2: Multiple tool calls in sequence\n")
  toolExecutions.length = 0 // Reset

  try {
    const result = await generateText({
      model: openrouter("anthropic/claude-haiku-4.5"),
      tools,
      toolChoice: "required",
      maxSteps: 5,
      prompt: "First list all my todo tasks, then create a new task called 'Write documentation' with priority 1",
    })

    console.log(`Steps: ${result.steps.length}`)
    console.log(`Tool executions: ${toolExecutions.join(", ") || "none"}`)

    const passed = toolExecutions.includes("createTask")
    console.log(passed ? "✅ createTask was executed" : "❌ createTask not executed")
    return passed
  } catch (error) {
    console.error("❌ Failed:", error)
    return false
  }
}

async function testToolWithFollowUp() {
  console.log("\n🧪 Test 3: Tool call with AI follow-up response\n")
  toolExecutions.length = 0 // Reset

  try {
    const result = await generateText({
      model: openrouter("anthropic/claude-haiku-4.5"),
      tools,
      toolChoice: "required",
      maxSteps: 3,
      prompt: "How many tasks do I have in total? Use listTasks to find out.",
    })

    console.log(`Steps: ${result.steps.length}`)
    console.log(`Tool executions: ${toolExecutions.join(", ") || "none"}`)
    console.log(`Final response: ${result.text || "(no text)"}`)

    const passed = toolExecutions.includes("listTasks")
    console.log(passed ? "✅ listTasks was executed" : "❌ listTasks not executed")
    return passed
  } catch (error) {
    console.error("❌ Failed:", error)
    return false
  }
}

async function testNoToolNeeded() {
  console.log("\n🧪 Test 4: Query that doesn't need tools\n")

  try {
    const { text, toolCalls } = await generateText({
      model: openrouter("anthropic/claude-haiku-4.5"),
      tools,
      prompt: "What's 2 + 2?",
    })

    console.log(`Tool calls: ${toolCalls.length}`)
    console.log(`Response: ${text}`)

    // Should answer directly without calling tools
    return toolCalls.length === 0 && text.includes("4")
  } catch (error) {
    console.error("❌ Failed:", error)
    return false
  }
}

async function main() {
  console.log("=" .repeat(60))
  console.log("Spike: Tool Calling with Mock Functions")
  console.log("=" .repeat(60))

  if (!process.env.OPENROUTER_API_KEY) {
    console.error("❌ OPENROUTER_API_KEY not set")
    process.exit(1)
  }

  const results = {
    singleToolCall: await testSingleToolCall(),
    multipleToolCalls: await testMultipleToolCalls(),
    toolWithFollowUp: await testToolWithFollowUp(),
    noToolNeeded: await testNoToolNeeded(),
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
