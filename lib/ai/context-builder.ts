/**
 * Context builder for AI chat conversations
 *
 * Builds system prompts with user's tasks and notes injected for context.
 */

import type { Task } from "@/types/task"
import type { Note } from "@/types/note"
import {
  formatTasksContext,
  formatNotesContext,
  truncateTasksToFit,
  estimateTokens,
} from "./context"

// ============================================================================
// Types
// ============================================================================

export type ChatContext = {
  tasks: Task[]
  notes: Note[]
  userName?: string
}

export type ContextBuildOptions = {
  /** Maximum tokens for task context (default: 2000) */
  maxTaskTokens?: number
  /** Maximum tokens for notes context (default: 1000) */
  maxNoteTokens?: number
  /** Include completed tasks (default: false) */
  includeCompleted?: boolean
  /** Focus on a specific date range */
  dateRange?: {
    start: string // YYYY-MM-DD
    end: string
  }
}

// ============================================================================
// System Prompt Template
// ============================================================================

const SYSTEM_PROMPT_BASE = `You are a helpful task management assistant for the Groaly app. You help users manage their tasks and notes efficiently.

Your capabilities:
- View and understand the user's tasks and notes
- Search for specific tasks
- Update task properties (status, priority, due date)
- Extract tasks from notes
- Reschedule tasks in bulk
- Generate task summaries and analytics
- Find blocking/overdue tasks
- Suggest the next best task to work on
- Optimize schedules to balance workload

Guidelines:
- Be concise and actionable in your responses
- When updating tasks, confirm what you changed
- For ambiguous requests, ask for clarification
- Proactively suggest optimizations when you notice issues (like overdue tasks or overloaded days)
- Format task lists clearly using bullet points or numbered lists
- Use dates in a human-friendly format (e.g., "tomorrow", "next Monday")

Today's date: {{TODAY_DATE}}`

// ============================================================================
// Context Builder Functions
// ============================================================================

/**
 * Build the system prompt with user context injected
 */
export function buildSystemPrompt(
  context: ChatContext,
  options: ContextBuildOptions = {}
): string {
  const {
    maxTaskTokens = 2000,
    maxNoteTokens = 1000,
    includeCompleted = false,
    dateRange,
  } = options

  const parts: string[] = []

  // Base prompt with today's date
  const today = new Date().toISOString().split("T")[0]
  parts.push(SYSTEM_PROMPT_BASE.replace("{{TODAY_DATE}}", today))

  // Filter and format tasks
  let filteredTasks = context.tasks
  if (!includeCompleted) {
    filteredTasks = filteredTasks.filter(
      (t) => t.status !== "done" && t.status !== "cancelled"
    )
  }
  if (dateRange) {
    const start = new Date(dateRange.start)
    const end = new Date(dateRange.end)
    filteredTasks = filteredTasks.filter((t) => {
      if (!t.due_date) return true // Include tasks without dates
      const due = new Date(t.due_date)
      return due >= start && due <= end
    })
  }

  // Truncate tasks to fit token budget
  const truncatedTasks = truncateTasksToFit(filteredTasks, maxTaskTokens)

  if (truncatedTasks.length > 0) {
    const tasksContext = formatTasksContext(truncatedTasks)
    const taskStats = getTaskStats(filteredTasks)

    parts.push(`
## User's Current Tasks (${truncatedTasks.length}${filteredTasks.length > truncatedTasks.length ? ` of ${filteredTasks.length}` : ""})
${taskStats}

${tasksContext}`)
  } else {
    parts.push("\n## User's Tasks\nNo active tasks found.")
  }

  // Format notes (truncate if needed)
  if (context.notes.length > 0) {
    const notesContext = formatNotesContext(context.notes)
    const noteTokens = estimateTokens(notesContext)

    if (noteTokens <= maxNoteTokens) {
      parts.push(`
## User's Recent Notes (${context.notes.length})
${notesContext}`)
    } else {
      // Truncate notes by limiting count
      const maxNotes = Math.max(1, Math.floor((maxNoteTokens / noteTokens) * context.notes.length))
      const truncatedNotes = context.notes.slice(0, maxNotes)
      parts.push(`
## User's Recent Notes (${truncatedNotes.length} of ${context.notes.length})
${formatNotesContext(truncatedNotes)}`)
    }
  }

  // Add user name if available
  if (context.userName) {
    parts.push(`\nUser's name: ${context.userName}`)
  }

  return parts.join("\n")
}

/**
 * Get quick stats about tasks for context
 */
function getTaskStats(tasks: Task[]): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const overdue = tasks.filter((t) => {
    if (t.status === "done" || t.status === "cancelled") return false
    if (!t.due_date) return false
    return new Date(t.due_date) < today
  }).length

  const dueToday = tasks.filter((t) => {
    if (t.status === "done" || t.status === "cancelled") return false
    if (!t.due_date) return false
    const due = new Date(t.due_date)
    return (
      due.getFullYear() === today.getFullYear() &&
      due.getMonth() === today.getMonth() &&
      due.getDate() === today.getDate()
    )
  }).length

  const inProgress = tasks.filter((t) => t.status === "in_progress").length

  const parts: string[] = []
  if (overdue > 0) parts.push(`⚠️ ${overdue} overdue`)
  if (dueToday > 0) parts.push(`📅 ${dueToday} due today`)
  if (inProgress > 0) parts.push(`🔄 ${inProgress} in progress`)

  return parts.length > 0 ? parts.join(" | ") : "All tasks on track"
}

/**
 * Build a minimal context for quick responses (fewer tokens)
 */
export function buildMinimalSystemPrompt(context: ChatContext): string {
  return buildSystemPrompt(context, {
    maxTaskTokens: 500,
    maxNoteTokens: 250,
    includeCompleted: false,
  })
}

/**
 * Build an expanded context for detailed analysis
 */
export function buildDetailedSystemPrompt(context: ChatContext): string {
  return buildSystemPrompt(context, {
    maxTaskTokens: 4000,
    maxNoteTokens: 2000,
    includeCompleted: true,
  })
}
