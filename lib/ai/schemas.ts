/**
 * Zod schemas for AI task extraction
 */
import { z } from "zod"

/**
 * Priority levels matching database schema
 * 0 = Urgent (immediate attention required)
 * 1 = High (important, do soon)
 * 2 = Medium (default, normal importance)
 * 3 = Low (can wait, nice to have)
 */
export const PrioritySchema = z
  .number()
  .int()
  .min(0)
  .max(3)
  .describe("0=urgent, 1=high, 2=medium, 3=low")

/**
 * Schema for a single extracted task
 */
export const ExtractedTaskSchema = z.object({
  title: z
    .string()
    .min(1)
    .max(200)
    .describe("Short, actionable task title (max 200 chars)"),
  description: z
    .string()
    .max(1000)
    .optional()
    .describe("Additional context or details about the task"),
  priority: PrioritySchema.describe(
    "Task priority: 0=urgent, 1=high, 2=medium, 3=low"
  ),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .describe("Due date in YYYY-MM-DD format, if mentioned or inferable"),
  tags: z
    .array(z.string().max(50))
    .max(10)
    .optional()
    .describe("Relevant tags/categories (e.g., work, personal, shopping)"),
  estimated_minutes: z
    .number()
    .int()
    .min(5)
    .max(480)
    .optional()
    .describe("Estimated time to complete in minutes (5-480)"),
  depends_on: z
    .array(z.number().int().min(0))
    .optional()
    .describe(
      "Indices of other tasks this task depends on (0-indexed references to tasks array)"
    ),
})

export type ExtractedTask = z.infer<typeof ExtractedTaskSchema>

/**
 * Schema for the full extraction response
 */
export const TaskExtractionResponseSchema = z.object({
  tasks: z
    .array(ExtractedTaskSchema)
    .max(20)
    .describe("List of extracted tasks (max 20)"),
  reasoning: z
    .string()
    .max(500)
    .describe(
      "Brief explanation of how tasks were identified and prioritized"
    ),
})

export type TaskExtractionResponse = z.infer<typeof TaskExtractionResponseSchema>

/**
 * Schema description for AI prompt injection
 * This gets included in the system prompt to guide the AI's output format
 */
export const TASK_EXTRACTION_SCHEMA_DESCRIPTION = `{
  "tasks": [
    {
      "title": string (required, max 200 chars - short actionable title),
      "description": string (optional, max 1000 chars - additional details),
      "priority": number (required, 0=urgent, 1=high, 2=medium, 3=low),
      "due_date": string (optional, YYYY-MM-DD format),
      "tags": string[] (optional, max 10 tags),
      "estimated_minutes": number (optional, 5-480 mins),
      "depends_on": number[] (optional, 0-indexed task indices this depends on)
    }
  ],
  "reasoning": string (required, max 500 chars - explain how you identified and prioritized tasks)
}`

/**
 * Request body schema for the extract-tasks API
 */
export const ExtractTasksRequestSchema = z.object({
  note_id: z
    .string()
    .uuid()
    .describe("UUID of the note to extract tasks from"),
  content: z
    .string()
    .min(1)
    .max(10000)
    .describe("The note content to extract tasks from (max 10000 chars)"),
})

export type ExtractTasksRequest = z.infer<typeof ExtractTasksRequestSchema>

/**
 * API response schema
 */
export const ExtractTasksResponseSchema = z.object({
  tasks: z.array(ExtractedTaskSchema),
  reasoning: z.string(),
})

export type ExtractTasksResponse = z.infer<typeof ExtractTasksResponseSchema>
