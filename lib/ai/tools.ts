/**
 * AI Tool definitions for the chat API
 *
 * These tools allow the AI assistant to interact with user's tasks and notes.
 * Each tool has a Zod schema for parameters and a stub handler.
 */
import { tool } from "ai"
import { z } from "zod"
import type { SupabaseClient } from "@supabase/supabase-js"

import type { Task } from "@/types/task"
import type { Note } from "@/types/note"

// ============================================================================
// Tool Result Types
// ============================================================================

export type CreateTaskResult = {
  success: boolean
  task?: {
    id: string
    title: string
    priority: number
    due_date?: string
    tags?: string[]
  }
  error?: string
}

export type ExtractTasksResult = {
  success: boolean
  tasks?: Array<{
    title: string
    priority: number
    due_date?: string
    tags?: string[]
  }>
  error?: string
}

export type UpdateTaskResult = {
  success: boolean
  task?: Task
  error?: string
}

export type SearchTasksResult = {
  success: boolean
  tasks?: Task[]
  count?: number
  error?: string
}

export type RescheduleResult = {
  success: boolean
  updated_count?: number
  tasks?: Array<{ id: string; new_due_date: string }>
  error?: string
}

export type SummaryResult = {
  success: boolean
  summary?: {
    total_tasks: number
    completed: number
    in_progress: number
    overdue: number
    upcoming: number
    by_priority: Record<string, number>
  }
  error?: string
}

export type OptimizeResult = {
  success: boolean
  suggestions?: Array<{
    task_id: string
    recommended_date: string
    reason: string
  }>
  error?: string
}

export type BlockersResult = {
  success: boolean
  blockers?: Array<{
    task_id: string
    title: string
    blocked_by: string[]
    reason: string
  }>
  error?: string
}

export type NextTaskResult = {
  success: boolean
  task?: Task
  reasoning?: string
  error?: string
}

// ============================================================================
// Tool Execution Context
// ============================================================================

export type ToolContext = {
  userId: string
  tasks: Task[]
  notes: Note[]
  supabase: SupabaseClient
}

// Global context holder - set before tool execution
let _toolContext: ToolContext | null = null

export function setToolContext(context: ToolContext): void {
  _toolContext = context
}

export function clearToolContext(): void {
  _toolContext = null
}

function getToolContext(): ToolContext | null {
  return _toolContext
}

// ============================================================================
// Tool Creator Function
// ============================================================================

/**
 * Creates the chat tools with access to the tool context
 */
export function createChatTools() {
  return {
    /**
     * Create a new task from conversation
     * Used when user asks the AI to create/add a task directly
     */
    create_task: tool({
      description:
        "Create a new task from the conversation. Use when the user asks to add, create, or remind them about something.",
      inputSchema: z.object({
        title: z.string().min(1).describe("The task title"),
        description: z.string().optional().describe("Optional task description"),
        priority: z
          .number()
          .int()
          .min(0)
          .max(3)
          .optional()
          .describe("Priority (0=urgent, 1=high, 2=medium, 3=low). Default: 2"),
        due_date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional()
          .describe("Due date in YYYY-MM-DD format"),
        tags: z.array(z.string()).optional().describe("Optional tags for the task"),
      }),
      execute: async ({
        title,
        description,
        priority,
        due_date,
        tags,
      }): Promise<CreateTaskResult> => {
        const ctx = getToolContext()
        if (!ctx) {
          return { success: false, error: "No context provided" }
        }

        const { data, error } = await ctx.supabase
          .from("tasks")
          .insert({
            user_id: ctx.userId,
            title,
            description: description ?? null,
            priority: priority ?? 2,
            due_date: due_date ?? null,
            tags: tags ?? [],
            status: "todo",
          })
          .select()
          .single()

        if (error) {
          console.error("Failed to create task:", error)
          return { success: false, error: error.message }
        }

        return {
          success: true,
          task: {
            id: data.id,
            title: data.title,
            priority: data.priority,
            due_date: data.due_date,
            tags: data.tags,
          },
        }
      },
    }),

    /**
     * Extract tasks from a note
     * Analyzes note content and identifies actionable tasks
     */
    extract_tasks: tool({
      description:
        "Extract actionable tasks from a specific note. Analyzes the note content to identify todos, action items, and commitments.",
      inputSchema: z.object({
        note_id: z.string().uuid().describe("The UUID of the note to extract tasks from"),
      }),
      execute: async ({ note_id }): Promise<ExtractTasksResult> => {
        const ctx = getToolContext()
        if (!ctx) {
          return { success: false, error: "No context provided" }
        }

        const note = ctx.notes.find((n) => n.id === note_id)
        if (!note) {
          return { success: false, error: `Note ${note_id} not found` }
        }

        // Stub: In production, this would call the AI extraction service
        return {
          success: true,
          tasks: [
            {
              title: `[Extracted from "${note.title}"] Review and action items`,
              priority: 2,
              tags: ["extracted"],
            },
          ],
        }
      },
    }),

    /**
     * Update a task's properties
     * Allows modifying status, priority, due date, or other fields
     */
    update_task: tool({
      description:
        "Update a task's properties like status, priority, due date, title, or description.",
      inputSchema: z.object({
        task_id: z.string().uuid().describe("The UUID of the task to update"),
        updates: z
          .object({
            title: z.string().optional().describe("New title for the task"),
            description: z.string().optional().describe("New description"),
            status: z
              .enum(["todo", "in_progress", "done", "cancelled"])
              .optional()
              .describe("New status"),
            priority: z
              .number()
              .int()
              .min(0)
              .max(3)
              .optional()
              .describe("New priority (0=urgent, 1=high, 2=medium, 3=low)"),
            due_date: z
              .string()
              .regex(/^\d{4}-\d{2}-\d{2}$/)
              .optional()
              .describe("New due date in YYYY-MM-DD format"),
            tags: z.array(z.string()).optional().describe("New tags array"),
          })
          .describe("The fields to update"),
      }),
      execute: async ({ task_id, updates }): Promise<UpdateTaskResult> => {
        const ctx = getToolContext()
        if (!ctx) {
          return { success: false, error: "No context provided" }
        }

        const task = ctx.tasks.find((t) => t.id === task_id)
        if (!task) {
          return { success: false, error: `Task ${task_id} not found` }
        }

        const updatePayload: Record<string, unknown> = {}
        if (updates.title !== undefined) updatePayload.title = updates.title
        if (updates.description !== undefined) updatePayload.description = updates.description
        if (updates.status !== undefined) updatePayload.status = updates.status
        if (updates.priority !== undefined) updatePayload.priority = updates.priority
        if (updates.due_date !== undefined) updatePayload.due_date = updates.due_date
        if (updates.tags !== undefined) updatePayload.tags = updates.tags

        const { data, error } = await ctx.supabase
          .from("tasks")
          .update(updatePayload)
          .eq("id", task_id)
          .eq("user_id", ctx.userId)
          .select()
          .single()

        if (error) {
          console.error("Failed to update task:", error)
          return { success: false, error: error.message }
        }

        return { success: true, task: data as Task }
      },
    }),

    /**
     * Search tasks by query
     * Full-text search across task titles, descriptions, and tags
     */
    search_tasks: tool({
      description:
        "Search for tasks by keyword. Searches across task titles, descriptions, and tags.",
      inputSchema: z.object({
        query: z.string().min(1).describe("Search query to find tasks"),
        status: z
          .enum(["todo", "in_progress", "done", "cancelled"])
          .optional()
          .describe("Filter by status"),
        priority: z
          .number()
          .int()
          .min(0)
          .max(3)
          .optional()
          .describe("Filter by priority"),
        limit: z
          .number()
          .int()
          .min(1)
          .max(50)
          .optional()
          .describe("Maximum results to return (default: 10)"),
      }),
      execute: async ({ query, status, priority, limit }): Promise<SearchTasksResult> => {
        const ctx = getToolContext()
        if (!ctx) {
          return { success: false, error: "No context provided" }
        }

        const queryLower = query.toLowerCase()
        let results = ctx.tasks.filter((task) => {
          const titleMatch = task.title.toLowerCase().includes(queryLower)
          const descMatch = task.description?.toLowerCase().includes(queryLower) ?? false
          const tagMatch = task.tags?.some((t) => t.toLowerCase().includes(queryLower)) ?? false
          return titleMatch || descMatch || tagMatch
        })

        // Apply filters
        if (status) {
          results = results.filter((t) => t.status === status)
        }
        if (priority !== undefined) {
          results = results.filter((t) => t.priority === priority)
        }

        // Limit results
        const effectiveLimit = limit ?? 10
        results = results.slice(0, effectiveLimit)

        return {
          success: true,
          tasks: results,
          count: results.length,
        }
      },
    }),

    /**
     * Reschedule multiple tasks
     * Move tasks to new due dates, useful for batch rescheduling
     */
    reschedule_tasks: tool({
      description:
        "Reschedule one or more tasks to new due dates. Useful for batch rescheduling when plans change.",
      inputSchema: z.object({
        task_ids: z.array(z.string().uuid()).min(1).describe("Array of task UUIDs to reschedule"),
        new_dates: z
          .array(
            z.object({
              task_id: z.string().uuid(),
              due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
            })
          )
          .describe("Array of task IDs paired with their new due dates"),
      }),
      execute: async ({ task_ids, new_dates }): Promise<RescheduleResult> => {
        const ctx = getToolContext()
        if (!ctx) {
          return { success: false, error: "No context provided" }
        }

        const dateMap = new Map(new_dates.map((d) => [d.task_id, d.due_date]))
        const updates: Array<{ id: string; new_due_date: string }> = []
        const errors: string[] = []

        for (const taskId of task_ids) {
          const task = ctx.tasks.find((t) => t.id === taskId)
          if (!task) {
            errors.push(`Task ${taskId} not found`)
            continue
          }

          const newDate = dateMap.get(taskId)
          if (!newDate) {
            errors.push(`No date provided for task ${taskId}`)
            continue
          }

          const { error } = await ctx.supabase
            .from("tasks")
            .update({ due_date: newDate })
            .eq("id", taskId)
            .eq("user_id", ctx.userId)

          if (error) {
            console.error(`Failed to reschedule task ${taskId}:`, error)
            errors.push(`Failed to update ${taskId}: ${error.message}`)
          } else {
            updates.push({ id: taskId, new_due_date: newDate })
          }
        }

        if (updates.length === 0 && errors.length > 0) {
          return { success: false, error: errors.join("; ") }
        }

        return {
          success: true,
          updated_count: updates.length,
          tasks: updates,
        }
      },
    }),

    /**
     * Generate a summary of tasks
     * Provides analytics for a date range
     */
    generate_summary: tool({
      description:
        "Generate a summary of tasks for a date range. Shows completion stats, overdue items, and priority breakdown.",
      inputSchema: z.object({
        start_date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .describe("Start date in YYYY-MM-DD format"),
        end_date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .describe("End date in YYYY-MM-DD format"),
      }),
      execute: async ({ start_date, end_date }): Promise<SummaryResult> => {
        const ctx = getToolContext()
        if (!ctx) {
          return { success: false, error: "No context provided" }
        }

        const start = new Date(start_date)
        const end = new Date(end_date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Filter tasks in date range
        const tasksInRange = ctx.tasks.filter((task) => {
          if (!task.due_date) return false
          const dueDate = new Date(task.due_date)
          return dueDate >= start && dueDate <= end
        })

        const completed = tasksInRange.filter((t) => t.status === "done").length
        const inProgress = tasksInRange.filter((t) => t.status === "in_progress").length
        const overdue = tasksInRange.filter((t) => {
          if (t.status === "done" || t.status === "cancelled") return false
          const dueDate = new Date(t.due_date!)
          return dueDate < today
        }).length
        const upcoming = tasksInRange.filter((t) => {
          if (t.status === "done" || t.status === "cancelled") return false
          const dueDate = new Date(t.due_date!)
          return dueDate >= today
        }).length

        const byPriority: Record<string, number> = {
          urgent: tasksInRange.filter((t) => t.priority === 0).length,
          high: tasksInRange.filter((t) => t.priority === 1).length,
          medium: tasksInRange.filter((t) => t.priority === 2).length,
          low: tasksInRange.filter((t) => t.priority === 3).length,
        }

        return {
          success: true,
          summary: {
            total_tasks: tasksInRange.length,
            completed,
            in_progress: inProgress,
            overdue,
            upcoming,
            by_priority: byPriority,
          },
        }
      },
    }),

    /**
     * Optimize schedule for a date range
     * Suggests better dates for tasks based on workload distribution
     */
    optimize_schedule: tool({
      description:
        "Analyze tasks in a date range and suggest optimal rescheduling to balance workload.",
      inputSchema: z.object({
        start_date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .describe("Start date in YYYY-MM-DD format"),
        end_date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .describe("End date in YYYY-MM-DD format"),
        max_tasks_per_day: z
          .number()
          .int()
          .min(1)
          .max(20)
          .optional()
          .describe("Maximum tasks to schedule per day (default: 5)"),
      }),
      execute: async ({ start_date, end_date, max_tasks_per_day }): Promise<OptimizeResult> => {
        const ctx = getToolContext()
        if (!ctx) {
          return { success: false, error: "No context provided" }
        }

        const effectiveMax = max_tasks_per_day ?? 5

        // Get incomplete tasks with due dates in range
        const tasksInRange = ctx.tasks.filter((task) => {
          if (!task.due_date) return false
          if (task.status === "done" || task.status === "cancelled") return false
          const dueDate = new Date(task.due_date)
          return dueDate >= new Date(start_date) && dueDate <= new Date(end_date)
        })

        // Count tasks per day
        const tasksByDay = new Map<string, number>()
        for (const task of tasksInRange) {
          const date = task.due_date!
          tasksByDay.set(date, (tasksByDay.get(date) ?? 0) + 1)
        }

        // Find overloaded days and suggest redistributions
        const suggestions: Array<{ task_id: string; recommended_date: string; reason: string }> = []

        for (const task of tasksInRange) {
          const currentDate = task.due_date!
          const tasksOnDay = tasksByDay.get(currentDate) ?? 0

          if (tasksOnDay > effectiveMax) {
            // Find a less busy day (stub: just suggest next day)
            const nextDay = new Date(currentDate)
            nextDay.setDate(nextDay.getDate() + 1)
            const nextDayStr = nextDay.toISOString().split("T")[0]

            suggestions.push({
              task_id: task.id,
              recommended_date: nextDayStr,
              reason: `${currentDate} has ${tasksOnDay} tasks (over limit of ${effectiveMax})`,
            })
          }
        }

        return {
          success: true,
          suggestions,
        }
      },
    }),

    /**
     * Find blocking tasks
     * Identifies tasks that are blocked or blocking other tasks
     */
    find_blockers: tool({
      description:
        "Find tasks that are blocking progress. Identifies overdue tasks, stuck items, and dependency chains.",
      inputSchema: z.object({
        include_overdue: z
          .boolean()
          .optional()
          .describe("Include overdue tasks (default: true)"),
        include_stuck: z
          .boolean()
          .optional()
          .describe("Include tasks stuck in progress for too long (default: true)"),
        days_stuck_threshold: z
          .number()
          .int()
          .min(1)
          .optional()
          .describe("Days in progress before considered stuck (default: 3)"),
      }),
      execute: async ({
        include_overdue,
        include_stuck,
        days_stuck_threshold,
      }): Promise<BlockersResult> => {
        const ctx = getToolContext()
        if (!ctx) {
          return { success: false, error: "No context provided" }
        }

        const effectiveIncludeOverdue = include_overdue ?? true
        const effectiveIncludeStuck = include_stuck ?? true
        const effectiveThreshold = days_stuck_threshold ?? 3

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const blockers: Array<{
          task_id: string
          title: string
          blocked_by: string[]
          reason: string
        }> = []

        for (const task of ctx.tasks) {
          if (task.status === "done" || task.status === "cancelled") continue

          const reasons: string[] = []
          const blockedBy: string[] = []

          // Check if overdue
          if (effectiveIncludeOverdue && task.due_date) {
            const dueDate = new Date(task.due_date)
            if (dueDate < today) {
              const daysOverdue = Math.floor(
                (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
              )
              reasons.push(`Overdue by ${daysOverdue} day(s)`)
            }
          }

          // Check if stuck in progress
          if (effectiveIncludeStuck && task.status === "in_progress" && task.updated_at) {
            const lastUpdate = new Date(task.updated_at)
            const daysSinceUpdate = Math.floor(
              (today.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)
            )
            if (daysSinceUpdate >= effectiveThreshold) {
              reasons.push(`In progress for ${daysSinceUpdate} days without updates`)
            }
          }

          if (reasons.length > 0) {
            blockers.push({
              task_id: task.id,
              title: task.title,
              blocked_by: blockedBy,
              reason: reasons.join("; "),
            })
          }
        }

        return {
          success: true,
          blockers,
        }
      },
    }),

    /**
     * Suggest next task to work on
     * Recommends the best task based on time available and energy level
     */
    suggest_next_task: tool({
      description:
        "Suggest the best task to work on now based on available time, energy level, and priorities.",
      inputSchema: z.object({
        available_minutes: z
          .number()
          .int()
          .min(5)
          .max(480)
          .describe("Minutes available to work (5-480)"),
        energy_level: z
          .enum(["low", "medium", "high"])
          .describe("Current energy level affects task complexity recommendation"),
      }),
      execute: async ({ available_minutes, energy_level }): Promise<NextTaskResult> => {
        const ctx = getToolContext()
        if (!ctx) {
          return { success: false, error: "No context provided" }
        }

        // Suppress unused variable warning - available_minutes will be used in production
        void available_minutes

        // Get incomplete tasks
        const incompleteTasks = ctx.tasks.filter(
          (t) => t.status !== "done" && t.status !== "cancelled"
        )

        if (incompleteTasks.length === 0) {
          return {
            success: true,
            task: undefined,
            reasoning: "No incomplete tasks found. You're all caught up!",
          }
        }

        // Score tasks based on multiple factors
        const scoredTasks = incompleteTasks.map((task) => {
          let score = 0

          // Priority boost (higher priority = higher score)
          const priority = task.priority ?? 2
          score += (3 - priority) * 10 // 0=30, 1=20, 2=10, 3=0

          // Due date urgency
          if (task.due_date) {
            const dueDate = new Date(task.due_date)
            const now = new Date()
            const daysUntilDue = Math.floor(
              (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            )
            if (daysUntilDue < 0) score += 50 // Overdue - highest priority
            else if (daysUntilDue === 0) score += 30 // Due today
            else if (daysUntilDue <= 3) score += 15 // Due soon
          }

          // Energy match (stub: assume high energy tasks have priority 0-1)
          if (energy_level === "high" && priority <= 1) score += 5
          if (energy_level === "low" && priority >= 2) score += 5

          return { task, score }
        })

        // Sort by score descending
        scoredTasks.sort((a, b) => b.score - a.score)

        const bestTask = scoredTasks[0]?.task

        const reasoning = bestTask
          ? `Recommended "${bestTask.title}" because: ` +
            [
              bestTask.priority === 0
                ? "urgent priority"
                : bestTask.priority === 1
                  ? "high priority"
                  : null,
              bestTask.due_date ? `due ${bestTask.due_date}` : null,
              `matches ${energy_level} energy level`,
            ]
              .filter(Boolean)
              .join(", ")
          : "No suitable task found"

        return {
          success: true,
          task: bestTask,
          reasoning,
        }
      },
    }),
  }
}

// ============================================================================
// Tool Names Type
// ============================================================================

export type ChatToolName = keyof ReturnType<typeof createChatTools>
