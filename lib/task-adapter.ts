import type { Task as DbTask } from "@/types/task"
import type { Task as ViewTask } from "@/lib/mock-data"

const PRIORITY_MAP: Record<number, ViewTask["priority"]> = {
  0: "low",
  1: "medium",
  2: "high",
  3: "urgent",
}

const PRIORITY_REVERSE_MAP: Record<ViewTask["priority"], number> = {
  low: 0,
  medium: 1,
  high: 2,
  urgent: 3,
}

export function dbTaskToViewTask(task: DbTask): ViewTask {
  return {
    id: task.id,
    title: task.title,
    description: task.description ?? undefined,
    status: (task.status as ViewTask["status"]) ?? "todo",
    priority: PRIORITY_MAP[task.priority ?? 1] ?? "medium",
    tags: task.tags ?? [],
    due_date: task.due_date ?? undefined,
    created_at: task.created_at ?? new Date().toISOString(),
  }
}

export function viewTaskToDbUpdates(
  updates: Partial<ViewTask>
): Partial<DbTask> {
  const result: Partial<DbTask> = {}

  if (updates.title !== undefined) result.title = updates.title
  if (updates.description !== undefined)
    result.description = updates.description ?? null
  if (updates.status !== undefined) result.status = updates.status
  if (updates.priority !== undefined)
    result.priority = PRIORITY_REVERSE_MAP[updates.priority]
  if (updates.tags !== undefined) result.tags = updates.tags
  if (updates.due_date !== undefined)
    result.due_date = updates.due_date ?? null

  return result
}

export function dbTasksToViewTasks(tasks: DbTask[]): ViewTask[] {
  return tasks.map(dbTaskToViewTask)
}
