import type { Database, Json } from "./database"

// Base task type from database schema
export type Task = Database["public"]["Tables"]["tasks"]["Row"]
export type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"]
export type TaskUpdate = Database["public"]["Tables"]["tasks"]["Update"]

// Task status enum values
export const TASK_STATUSES = ["todo", "in_progress", "done", "cancelled"] as const
export type TaskStatus = (typeof TASK_STATUSES)[number]

// Task priority levels (0-3)
export const TASK_PRIORITIES = [0, 1, 2, 3] as const
export type TaskPriority = (typeof TASK_PRIORITIES)[number]

// API request/response types
export type TasksListResponse = {
  tasks: Task[]
  count: number
}

export type TaskResponse = {
  task: Task
}

export type TaskCreateInput = {
  title: string
  description?: string | null
  status?: TaskStatus
  priority?: TaskPriority
  due_date?: string | null
  tags?: string[]
  metadata?: Json
}

export type TaskUpdateInput = Partial<TaskCreateInput>

export type TasksFilterParams = {
  status?: TaskStatus
  priority?: TaskPriority
  due_date?: string // Filter by specific due date
  due_before?: string // Filter tasks due before this date
  due_after?: string // Filter tasks due after this date
  tags?: string[] // Filter by tags (any match)
}

// Error response type
export type TaskErrorResponse = {
  error: string
  details?: string
}

// View task type with string priority (for UI components)
export type ViewTask = {
  id: string
  title: string
  description?: string
  status: "todo" | "in_progress" | "done" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  goal?: string
  tags: string[]
  estimated_time_minutes?: number
  energy_level?: "low" | "medium" | "high"
  scheduled_at?: string
  due_date?: string
  completed_at?: string
  note_id?: string
  created_at: string
}
