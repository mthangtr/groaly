/**
 * AI Task Suggestion Algorithm
 *
 * Provides intelligent task suggestions based on:
 * - Priority and due dates
 * - Dependency status (blocked tasks)
 * - Time estimation and available working hours
 * - Energy level matching (optional)
 */

import type { Task } from "@/types/task"

// Extended task metadata types
type TaskMetadata = {
  estimated_time_minutes?: number
  energy_level?: "low" | "medium" | "high"
  blocked_by?: string[] // Task IDs that must be completed first
}

// Workload indicator levels
export type WorkloadLevel = "light" | "balanced" | "heavy"

// Suggestion insights
export type SuggestionInsights = {
  workload: WorkloadLevel
  total_minutes: number
  blocked_count: number
  urgent_count: number
  overdue_count: number
}

// Full suggestion response
export type SuggestionsResponse = {
  suggestions: Task[]
  insights: SuggestionInsights
}

// Options for the suggestion algorithm
export type SuggestionOptions = {
  working_hours?: number // Default 8 hours
  max_suggestions?: number // Default 3
  consider_energy?: boolean // Default false
  time_of_day?: "morning" | "afternoon" | "evening" // For energy matching
}

const DEFAULT_OPTIONS: Required<SuggestionOptions> = {
  working_hours: 8,
  max_suggestions: 3,
  consider_energy: false,
  time_of_day: "morning",
}

/**
 * Safely extract metadata from a task
 */
function getTaskMetadata(task: Task): TaskMetadata {
  if (!task.metadata || typeof task.metadata !== "object" || Array.isArray(task.metadata)) {
    return {}
  }
  return task.metadata as TaskMetadata
}

/**
 * Get estimated time for a task in minutes (default: 30 minutes)
 */
function getEstimatedMinutes(task: Task): number {
  const metadata = getTaskMetadata(task)
  return metadata.estimated_time_minutes ?? 30
}

/**
 * Get energy level for a task (default: medium)
 */
function getEnergyLevel(task: Task): "low" | "medium" | "high" {
  const metadata = getTaskMetadata(task)
  return metadata.energy_level ?? "medium"
}

/**
 * Check if a task is blocked by incomplete dependencies
 */
function isTaskBlocked(task: Task, allTasks: Task[]): boolean {
  const metadata = getTaskMetadata(task)
  const blockedBy = metadata.blocked_by

  if (!blockedBy || blockedBy.length === 0) {
    return false
  }

  // Create a set of completed task IDs for quick lookup
  const completedTaskIds = new Set(
    allTasks
      .filter((t) => t.status === "done" || t.status === "cancelled")
      .map((t) => t.id)
  )

  // Task is blocked if any dependency is not completed
  return blockedBy.some((depId) => !completedTaskIds.has(depId))
}

/**
 * Check if a task is due today or overdue
 */
function isDueOrOverdue(task: Task, today: string): boolean {
  if (!task.due_date) return false
  return task.due_date <= today
}

/**
 * Check if a task is overdue
 */
function isOverdue(task: Task, today: string): boolean {
  if (!task.due_date) return false
  return task.due_date < today
}

/**
 * Check if a task is high priority (0 = urgent, 1 = high)
 */
function isHighPriority(task: Task): boolean {
  return task.priority !== null && task.priority <= 1
}

/**
 * Check if a task is urgent (priority 0)
 */
function isUrgent(task: Task): boolean {
  return task.priority === 0
}

/**
 * Filter tasks that are candidates for today
 * Criteria: status=todo, (due today/overdue OR high priority), not blocked
 */
function filterCandidates(tasks: Task[], today: string): {
  candidates: Task[]
  blockedCount: number
} {
  let blockedCount = 0

  const candidates = tasks.filter((task) => {
    // Must be todo status
    if (task.status !== "todo") {
      return false
    }

    // Check if blocked
    if (isTaskBlocked(task, tasks)) {
      blockedCount++
      return false
    }

    // Include if: due today/overdue OR high priority
    return isDueOrOverdue(task, today) || isHighPriority(task)
  })

  return { candidates, blockedCount }
}

/**
 * Score a task for prioritization
 * Higher score = higher priority for today
 *
 * Scoring factors:
 * - Priority: 0 (urgent) = 40, 1 (high) = 30, 2 (medium) = 20, 3 (low) = 10
 * - Overdue: +25 points
 * - Due today: +15 points
 * - Shorter estimated time: bonus (60 - minutes/2, max 30)
 */
function scoreTask(task: Task, today: string): number {
  let score = 0

  // Priority score (inverse: lower number = higher priority)
  const priority = task.priority ?? 2
  score += (3 - priority) * 10 + 10 // 0→40, 1→30, 2→20, 3→10

  // Due date urgency
  if (isOverdue(task, today)) {
    score += 25
  } else if (task.due_date === today) {
    score += 15
  }

  // Favor shorter tasks (quicker wins)
  const estimatedMinutes = getEstimatedMinutes(task)
  const timeBonus = Math.max(0, 30 - Math.floor(estimatedMinutes / 4))
  score += timeBonus

  return score
}

/**
 * Sort candidates by score and then by secondary criteria
 * Primary: score DESC
 * Secondary: due_date ASC (earlier due dates first)
 * Tertiary: estimated_time ASC (shorter tasks first)
 */
function sortCandidates(candidates: Task[], today: string): Task[] {
  return [...candidates].sort((a, b) => {
    // Primary: score
    const scoreA = scoreTask(a, today)
    const scoreB = scoreTask(b, today)
    if (scoreA !== scoreB) return scoreB - scoreA

    // Secondary: due date (earlier first, nulls last)
    if (a.due_date !== b.due_date) {
      if (!a.due_date) return 1
      if (!b.due_date) return -1
      return a.due_date.localeCompare(b.due_date)
    }

    // Tertiary: estimated time (shorter first)
    return getEstimatedMinutes(a) - getEstimatedMinutes(b)
  })
}

/**
 * Balance suggestions to fit within working hours
 */
function balanceByTime(
  sorted: Task[],
  maxMinutes: number,
  maxCount: number
): Task[] {
  const result: Task[] = []
  let totalMinutes = 0

  for (const task of sorted) {
    if (result.length >= maxCount) break

    const taskMinutes = getEstimatedMinutes(task)

    // Add task if it fits or if we have no suggestions yet
    if (totalMinutes + taskMinutes <= maxMinutes || result.length === 0) {
      result.push(task)
      totalMinutes += taskMinutes
    }
  }

  return result
}

/**
 * Optionally reorder by energy level for time of day
 * Morning: high energy tasks first
 * Afternoon: balanced
 * Evening: low energy tasks first
 */
function adjustForEnergy(
  tasks: Task[],
  timeOfDay: "morning" | "afternoon" | "evening"
): Task[] {
  if (timeOfDay === "afternoon") {
    return tasks // No adjustment for afternoon
  }

  const energyOrder: Record<string, Record<"low" | "medium" | "high", number>> = {
    morning: { high: 0, medium: 1, low: 2 },
    evening: { low: 0, medium: 1, high: 2 },
  }

  const order = energyOrder[timeOfDay]

  return [...tasks].sort((a, b) => {
    const energyA = getEnergyLevel(a)
    const energyB = getEnergyLevel(b)
    return order[energyA] - order[energyB]
  })
}

/**
 * Calculate workload level based on total estimated time
 */
function calculateWorkload(totalMinutes: number): WorkloadLevel {
  const hours = totalMinutes / 60
  if (hours < 4) return "light"
  if (hours <= 8) return "balanced"
  return "heavy"
}

/**
 * Calculate insights from tasks
 */
function calculateInsights(
  suggestions: Task[],
  allCandidates: Task[],
  blockedCount: number,
  today: string
): SuggestionInsights {
  const totalMinutes = suggestions.reduce(
    (sum, task) => sum + getEstimatedMinutes(task),
    0
  )

  const urgentCount = allCandidates.filter(isUrgent).length
  const overdueCount = allCandidates.filter((t) => isOverdue(t, today)).length

  return {
    workload: calculateWorkload(totalMinutes),
    total_minutes: totalMinutes,
    blocked_count: blockedCount,
    urgent_count: urgentCount,
    overdue_count: overdueCount,
  }
}

/**
 * Main suggestion algorithm
 *
 * 1. Filter: due today/overdue/high priority, status=todo
 * 2. Remove blocked tasks (dependencies not complete)
 * 3. Sort: score DESC (priority + urgency + time bonus)
 * 4. Balance: sum(estimated_time) <= working_hours
 * 5. Optional: Adjust for energy level based on time of day
 */
export function generateSuggestions(
  tasks: Task[],
  options: SuggestionOptions = {}
): SuggestionsResponse {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const today = new Date().toISOString().split("T")[0]

  // Step 1 & 2: Filter candidates and track blocked
  const { candidates, blockedCount } = filterCandidates(tasks, today)

  // Step 3: Sort by score
  const sorted = sortCandidates(candidates, today)

  // Step 4: Balance by time
  const maxMinutes = opts.working_hours * 60
  const balanced = balanceByTime(sorted, maxMinutes, opts.max_suggestions)

  // Step 5: Optional energy adjustment
  const suggestions = opts.consider_energy
    ? adjustForEnergy(balanced, opts.time_of_day)
    : balanced

  // Calculate insights
  const insights = calculateInsights(suggestions, candidates, blockedCount, today)

  return { suggestions, insights }
}

// Re-export types for convenience
export type { Task }
