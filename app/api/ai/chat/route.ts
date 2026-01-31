/**
 * AI Chat API with Streaming
 *
 * POST /api/ai/chat
 *
 * Accepts messages and streams AI responses with tool calling support.
 * Tools can interact with user's tasks and notes.
 */

import { streamText, stepCountIs } from "ai"
import type { ModelMessage } from "ai"
import { createClient } from "@/lib/supabase/server"
import { openrouter } from "@/lib/ai/openrouter"
import { buildSystemPrompt } from "@/lib/ai/context-builder"
import {
  createChatTools,
  setToolContext,
  clearToolContext,
} from "@/lib/ai/tools"
import type { Task } from "@/types/task"
import type { Note } from "@/types/note"

// ============================================================================
// Types
// ============================================================================

type ChatRequest = {
  messages: ModelMessage[]
  /** Optional: context mode affects how much task/note data is included */
  contextMode?: "minimal" | "default" | "detailed"
}

type ErrorResponse = {
  error: string
  details?: string
}

// ============================================================================
// Route Handler
// ============================================================================

export async function POST(request: Request): Promise<Response> {
  try {
    // Parse request body
    const body = (await request.json()) as ChatRequest
    const { messages, contextMode = "default" } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: "Invalid request", details: "messages array is required" } satisfies ErrorResponse,
        { status: 400 }
      )
    }

    // Authenticate user
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json(
        { error: "Unauthorized" } satisfies ErrorResponse,
        { status: 401 }
      )
    }

    // Fetch user's tasks and notes for context
    const [tasksResult, notesResult] = await Promise.all([
      supabase.from("tasks").select("*").eq("user_id", user.id),
      supabase.from("notes").select("*").eq("user_id", user.id).limit(20),
    ])

    if (tasksResult.error) {
      console.error("Error fetching tasks:", tasksResult.error)
      return Response.json(
        { error: "Failed to fetch tasks", details: tasksResult.error.message } satisfies ErrorResponse,
        { status: 500 }
      )
    }

    if (notesResult.error) {
      console.error("Error fetching notes:", notesResult.error)
      return Response.json(
        { error: "Failed to fetch notes", details: notesResult.error.message } satisfies ErrorResponse,
        { status: 500 }
      )
    }

    const tasks = (tasksResult.data ?? []) as Task[]
    const notes = (notesResult.data ?? []) as Note[]

    // Build system prompt with context
    const contextOptions = getContextOptions(contextMode)
    const systemPrompt = buildSystemPrompt({ tasks, notes }, contextOptions)

    // Set up tool context for tool execution
    setToolContext({
      userId: user.id,
      tasks,
      notes,
      supabase,
    })

    try {
      // Create tools
      const tools = createChatTools()

      // Stream the response
      const result = streamText({
        model: openrouter.chat("google/gemini-3-flash-preview"),
        system: systemPrompt,
        messages,
        tools,
        stopWhen: stepCountIs(5), // Allow up to 5 tool call steps per response
        abortSignal: request.signal,
        onFinish: () => {
          // Clean up tool context when done
          clearToolContext()
        },
      })

      // Return streaming response
      return result.toTextStreamResponse()
    } catch (streamError) {
      // Clean up on error
      clearToolContext()
      throw streamError
    }
  } catch (error) {
    // Clean up on any error
    clearToolContext()

    // Handle abort errors gracefully
    if (error instanceof Error && error.name === "AbortError") {
      return Response.json(
        { error: "Request aborted" } satisfies ErrorResponse,
        { status: 499 }
      )
    }

    console.error("Unexpected error in POST /api/ai/chat:", error)
    return Response.json(
      { error: "Internal server error" } satisfies ErrorResponse,
      { status: 500 }
    )
  }
}

// ============================================================================
// Helpers
// ============================================================================

function getContextOptions(mode: ChatRequest["contextMode"]) {
  switch (mode) {
    case "minimal":
      return {
        maxTaskTokens: 500,
        maxNoteTokens: 250,
        includeCompleted: false,
      }
    case "detailed":
      return {
        maxTaskTokens: 4000,
        maxNoteTokens: 2000,
        includeCompleted: true,
      }
    default:
      return {
        maxTaskTokens: 2000,
        maxNoteTokens: 1000,
        includeCompleted: false,
      }
  }
}
