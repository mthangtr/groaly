import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  extractTasksFromContent,
  parseExtractionError,
} from "@/lib/ai/client"
import {
  ExtractTasksRequestSchema,
  type ExtractTasksResponse,
} from "@/lib/ai/schemas"
import { z } from "zod"

type ErrorResponse = {
  error: string
  code?: string
  details?: string
}

/**
 * POST /api/ai/extract-tasks
 *
 * Extract actionable tasks from a note using AI.
 *
 * Request body:
 * {
 *   note_id: string (UUID of the note)
 *   content: string (note content to analyze)
 * }
 *
 * Response:
 * {
 *   tasks: ExtractedTask[] (extracted tasks with title, priority, etc.)
 *   reasoning: string (explanation of extraction logic)
 * }
 *
 * Error responses:
 * - 400: Invalid request body or validation error
 * - 401: Unauthorized (not authenticated)
 * - 404: Note not found or not owned by user
 * - 429: Rate limit exceeded
 * - 500: Internal server error
 * - 503: AI service unavailable
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ExtractTasksResponse | ErrorResponse>> {
  try {
    const supabase = await createClient()

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse and validate request body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      )
    }

    // Validate request schema
    let validatedBody
    try {
      validatedBody = ExtractTasksRequestSchema.parse(body)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zodError = error as z.ZodError<unknown>
        return NextResponse.json(
          {
            error: "Validation error",
            details: zodError.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", "),
          },
          { status: 400 }
        )
      }
      throw error
    }

    const { note_id, content } = validatedBody

    // Verify note exists and belongs to user
    const { data: note, error: noteError } = await supabase
      .from("notes")
      .select("id")
      .eq("id", note_id)
      .eq("user_id", user.id)
      .single()

    if (noteError || !note) {
      return NextResponse.json(
        { error: "Note not found", details: "Note does not exist or you don't have access" },
        { status: 404 }
      )
    }

    // Extract tasks using AI
    const result = await extractTasksFromContent(content)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in POST /api/ai/extract-tasks:", error)

    // Parse and return typed error
    const extractionError = parseExtractionError(error)

    // Map error codes to HTTP status codes
    const statusMap: Record<string, number> = {
      RATE_LIMIT: 429,
      INVALID_RESPONSE: 503,
      VALIDATION_ERROR: 503,
      API_ERROR: 503,
    }

    const status = statusMap[extractionError.code] ?? 500

    return NextResponse.json(
      {
        error: extractionError.message,
        code: extractionError.code,
      },
      { status }
    )
  }
}
