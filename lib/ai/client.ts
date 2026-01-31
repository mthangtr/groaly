/**
 * High-level AI client wrapper for task extraction
 */
import { generateStructuredOutput } from "./structured-output"
import { withRetry } from "./retry"
import {
  TaskExtractionResponseSchema,
  TASK_EXTRACTION_SCHEMA_DESCRIPTION,
  type TaskExtractionResponse,
} from "./schemas"

// Model for task extraction - Gemini 3 Flash Preview
export const EXTRACTION_MODEL = "google/gemini-3-flash-preview"

/**
 * System prompt for task extraction
 * Guides the AI to identify, prioritize, and structure tasks from unstructured text
 */
const TASK_EXTRACTION_SYSTEM_PROMPT = `You are a task extraction assistant that helps users identify actionable items from their notes.

Your job is to:
1. **Identify tasks**: Find explicit todos, implicit action items, commitments, and deadlines
2. **Prioritize intelligently**: 
   - Priority 0 (Urgent): Time-critical, blocking, or explicitly marked urgent
   - Priority 1 (High): Important deadlines, key deliverables, high-impact items  
   - Priority 2 (Medium): Standard tasks without urgency indicators
   - Priority 3 (Low): Nice-to-haves, someday/maybe items, low-impact tasks
3. **Detect dependencies**: If task B cannot start until task A is done, mark B as depending on A
4. **Estimate time**: Provide realistic time estimates based on task complexity
5. **Extract dates**: Convert relative dates (tomorrow, next week, Friday) to YYYY-MM-DD format

Guidelines:
- Be comprehensive but not excessive - extract real tasks, not observations
- Use clear, actionable language for titles (start with verbs)
- Add relevant tags to help categorization
- Keep descriptions concise but informative
- If content has no actionable tasks, return empty tasks array with explanation

Today's date is: ${new Date().toISOString().split("T")[0]}`

/**
 * Extract tasks from note content using AI
 *
 * @param content - The note text to extract tasks from
 * @returns Extracted tasks with reasoning
 * @throws Error if extraction fails after retries
 */
export async function extractTasksFromContent(
  content: string
): Promise<TaskExtractionResponse> {
  return withRetry(
    async () => {
      return generateStructuredOutput({
        schema: TaskExtractionResponseSchema,
        schemaDescription: TASK_EXTRACTION_SCHEMA_DESCRIPTION,
        system: TASK_EXTRACTION_SYSTEM_PROMPT,
        prompt: `Extract actionable tasks from the following note:\n\n${content}`,
        model: EXTRACTION_MODEL,
      })
    },
    {
      maxRetries: 3,
      initialDelayMs: 1000,
      maxDelayMs: 10000,
    }
  )
}

/**
 * Error types for task extraction
 */
export class TaskExtractionError extends Error {
  constructor(
    message: string,
    public readonly code: TaskExtractionErrorCode,
    public readonly cause?: unknown
  ) {
    super(message)
    this.name = "TaskExtractionError"
  }
}

export type TaskExtractionErrorCode =
  | "RATE_LIMIT"
  | "INVALID_RESPONSE"
  | "API_ERROR"
  | "VALIDATION_ERROR"

/**
 * Parse AI errors into typed errors
 */
export function parseExtractionError(error: unknown): TaskExtractionError {
  if (error instanceof TaskExtractionError) {
    return error
  }

  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error)

  if (message.includes("rate limit") || message.includes("429")) {
    return new TaskExtractionError(
      "Rate limit exceeded. Please try again later.",
      "RATE_LIMIT",
      error
    )
  }

  if (message.includes("parse") || message.includes("json")) {
    return new TaskExtractionError(
      "AI returned invalid response format",
      "INVALID_RESPONSE",
      error
    )
  }

  if (message.includes("zod") || message.includes("validation")) {
    return new TaskExtractionError(
      "Response failed schema validation",
      "VALIDATION_ERROR",
      error
    )
  }

  return new TaskExtractionError(
    error instanceof Error ? error.message : "AI extraction failed",
    "API_ERROR",
    error
  )
}
