/**
 * Context injection utilities for AI prompts
 */

import type { Task } from "@/types/task"
import type { Note } from "@/types/note"

const PRIORITY_LABELS = ["🔴 Urgent", "🟠 High", "🟡 Medium", "🟢 Low"]

export function formatTasksContext(tasks: Task[]): string {
  if (tasks.length === 0) return "No tasks found."

  return tasks
    .map((task) => {
      const priority = PRIORITY_LABELS[task.priority ?? 2] || "Unknown"
      const due = task.due_date ? `Due: ${task.due_date}` : "No due date"
      const status =
        task.status === "done"
          ? "✅"
          : task.status === "in_progress"
            ? "🔄"
            : "⬜"
      return `${status} [${priority}] ${task.title} (${due})`
    })
    .join("\n")
}

export function formatNotesContext(
  notes: Pick<Note, "title" | "content">[],
  maxPreviewLength = 100
): string {
  if (notes.length === 0) return "No notes found."

  return notes
    .map((note) => {
      const content =
        typeof note.content === "string" ? note.content : JSON.stringify(note.content)
      const preview =
        content.length > maxPreviewLength
          ? content.slice(0, maxPreviewLength) + "..."
          : content
      return `📝 ${note.title}\n   ${preview}`
    })
    .join("\n\n")
}

export function buildUserContext({
  tasks = [],
  notes = [],
}: {
  tasks?: Task[]
  notes?: Pick<Note, "title" | "content">[]
}): string {
  const sections: string[] = []

  if (tasks.length > 0) {
    sections.push(`## Your Tasks\n${formatTasksContext(tasks)}`)
  }

  if (notes.length > 0) {
    sections.push(`## Your Notes\n${formatNotesContext(notes)}`)
  }

  return sections.join("\n\n")
}

/**
 * Estimate token count (rough: 1 token ≈ 4 chars)
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

/**
 * Truncate tasks to fit within token budget, prioritizing by priority
 */
export function truncateTasksToFit(
  tasks: Task[],
  maxTokens: number
): Task[] {
  const sorted = [...tasks].sort((a, b) => (a.priority ?? 2) - (b.priority ?? 2))

  const tokenBudget = maxTokens * 4 // Convert to chars
  let charCount = 0

  return sorted.filter((task) => {
    const taskStr = `${task.title} (${task.due_date ?? "no date"})`
    if (charCount + taskStr.length + 50 < tokenBudget) {
      charCount += taskStr.length + 50
      return true
    }
    return false
  })
}
