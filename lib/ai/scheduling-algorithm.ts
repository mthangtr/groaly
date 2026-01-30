/**
 * AI Week Scheduling Algorithm
 *
 * Implements "Optimize my week" feature that automatically schedules tasks
 * across the week based on:
 * - Task priorities (high priority → morning slots)
 * - Dependencies (can't schedule before blockers complete)
 * - Working hours (respects user preferences)
 * - Energy levels (high energy tasks → morning)
 * - Even distribution across days
 */

import type { Task } from "@/types/task"

// User preferences for scheduling
export type SchedulingPreferences = {
  working_hours_start: string // "09:00:00"
  working_hours_end: string // "18:00:00"
  energy_preference?: "morning" | "evening" | "balanced"
  timezone?: string
}

// A scheduled task with timestamp
export type ScheduledTask = {
  task_id: string
  scheduled_at: string // ISO timestamp
}

// Response from optimize week algorithm
export type OptimizeWeekResponse = {
  optimized_schedule: ScheduledTask[]
  reasoning: string
  stats: {
    total_scheduled: number
    unscheduled_count: number
    average_tasks_per_day: number
  }
}

// Options for the scheduling algorithm
export type SchedulingOptions = {
  week_start: string // ISO date string (YYYY-MM-DD)
  preferences: SchedulingPreferences
  preserve_existing?: boolean // Keep existing scheduled_at if possible
}

// Extended task metadata
type TaskMetadata = {
  estimated_time_minutes?: number
  energy_level?: "low" | "medium" | "high"
  blocked_by?: string[] // Task IDs that must be completed first
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
 * Filter tasks that are schedulable
 * Criteria: status=todo or in_progress, not blocked
 */
function filterSchedulableTasks(tasks: Task[]): {
  schedulable: Task[]
  blocked: Task[]
} {
  const schedulable: Task[] = []
  const blocked: Task[] = []

  for (const task of tasks) {
    // Must be todo or in_progress
    if (task.status !== "todo" && task.status !== "in_progress") {
      continue
    }

    // Check if blocked
    if (isTaskBlocked(task, tasks)) {
      blocked.push(task)
    } else {
      schedulable.push(task)
    }
  }

  return { schedulable, blocked }
}

/**
 * Score a task for scheduling priority
 * Higher score = should be scheduled earlier
 *
 * Scoring factors:
 * - Priority: 0 (urgent) = 50, 1 (high) = 40, 2 (medium) = 30, 3 (low) = 20
 * - Has due date: +20
 * - Due this week: +15
 * - Overdue: +30
 */
function scoreTaskForScheduling(task: Task, weekStart: Date, weekEnd: Date): number {
  let score = 0

  // Priority score (inverse: lower number = higher priority)
  const priority = task.priority ?? 2
  score += (3 - priority) * 10 + 20 // 0→50, 1→40, 2→30, 3→20

  if (task.due_date) {
    const dueDate = new Date(task.due_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Overdue
    if (dueDate < today) {
      score += 30
    }
    // Due this week
    else if (dueDate >= weekStart && dueDate <= weekEnd) {
      score += 15
    }
    // Has due date
    else {
      score += 20
    }
  }

  return score
}

/**
 * Sort tasks by priority for scheduling
 * Primary: score DESC
 * Secondary: due_date ASC (earlier first)
 * Tertiary: created_at ASC (older first)
 */
function sortTasksForScheduling(
  tasks: Task[],
  weekStart: Date,
  weekEnd: Date
): Task[] {
  return [...tasks].sort((a, b) => {
    // Primary: score
    const scoreA = scoreTaskForScheduling(a, weekStart, weekEnd)
    const scoreB = scoreTaskForScheduling(b, weekStart, weekEnd)
    if (scoreA !== scoreB) return scoreB - scoreA

    // Secondary: due date (earlier first, nulls last)
    if (a.due_date !== b.due_date) {
      if (!a.due_date) return 1
      if (!b.due_date) return -1
      return a.due_date.localeCompare(b.due_date)
    }

    // Tertiary: created_at (older first, nulls last)
    if (!a.created_at) return 1
    if (!b.created_at) return -1
    return a.created_at.localeCompare(b.created_at)
  })
}

/**
 * Generate time slots for a day (extended hours beyond working hours)
 * Returns array of ISO timestamps for slot starts
 * 
 * IMPORTANT: Working hours are now SOFT CONSTRAINT (preferred, not enforced).
 * We generate slots from 6 AM to 11 PM, but mark which are within working hours.
 */
function generateDaySlots(
  date: Date,
  workStart: string,
  workEnd: string,
  slotDurationMinutes: number = 60
): Date[] {
  const slots: Date[] = []

  // Generate extended slots: 6 AM to 11 PM (17 hours)
  // This allows tasks outside working hours if needed
  const dayStart = new Date(date)
  dayStart.setHours(6, 0, 0, 0)

  const dayEnd = new Date(date)
  dayEnd.setHours(23, 0, 0, 0)

  // Generate slots
  let current = new Date(dayStart)
  while (current < dayEnd) {
    slots.push(new Date(current))
    current = new Date(current.getTime() + slotDurationMinutes * 60 * 1000)
  }

  return slots
}

/**
 * Check if a time slot is within user's working hours (soft constraint)
 * Returns bonus score if within working hours, 0 otherwise
 */
function getWorkingHoursBonus(
  slotTime: Date,
  workStart: string,
  workEnd: string
): number {
  const [startHour, startMin] = workStart.split(":").map(Number)
  const [endHour, endMin] = workEnd.split(":").map(Number)

  const slotHour = slotTime.getHours()
  const slotMin = slotTime.getMinutes()

  const slotMinutes = slotHour * 60 + slotMin
  const startMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin

  // Within working hours: +5 bonus
  if (slotMinutes >= startMinutes && slotMinutes < endMinutes) {
    return 5
  }

  // Outside working hours: no penalty, just no bonus
  return 0
}

/**
 * Calculate how well a task fits in a time slot based on energy
 * Returns a score (higher = better fit)
 */
function calculateEnergyFit(
  task: Task,
  slotTime: Date,
  energyPreference: "morning" | "evening" | "balanced"
): number {
  const taskEnergy = getEnergyLevel(task)
  const hour = slotTime.getHours()

  // Morning (before 12pm)
  const isMorning = hour < 12
  // Afternoon (12pm - 5pm)
  const isAfternoon = hour >= 12 && hour < 17
  // Evening (after 5pm)
  const isEvening = hour >= 17

  // High energy tasks prefer morning
  if (taskEnergy === "high") {
    if (isMorning) return 10
    if (isAfternoon) return 5
    return 0
  }

  // Low energy tasks prefer evening
  if (taskEnergy === "low") {
    if (isEvening) return 10
    if (isAfternoon) return 5
    return 0
  }

  // Medium energy tasks - consider user preference
  if (energyPreference === "morning" && isMorning) return 8
  if (energyPreference === "evening" && isEvening) return 8

  // Balanced - afternoon is fine
  if (isAfternoon) return 7

  return 5
}

/**
 * Generate week dates from start date (Monday - Sunday)
 */
function generateWeekDates(weekStart: string): Date[] {
  const dates: Date[] = []
  const start = new Date(weekStart)

  for (let i = 0; i < 7; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    dates.push(date)
  }

  return dates
}

/**
 * Main scheduling algorithm
 *
 * Algorithm:
 * 1. Filter schedulable tasks (not blocked, status=todo/in_progress)
 * 2. Sort by priority/urgency
 * 3. Generate available time slots for the week
 * 4. For each task (in priority order):
 *    - Find best available slot considering:
 *      * Energy level matching
 *      * Even distribution across days
 *    - Assign task to slot
 * 5. Return schedule with reasoning
 */
export function optimizeWeek(
  tasks: Task[],
  options: SchedulingOptions
): OptimizeWeekResponse {
  const { week_start, preferences } = options
  const { working_hours_start, working_hours_end, energy_preference = "balanced" } = preferences

  // Generate week dates
  const weekDates = generateWeekDates(week_start)
  const weekStart = weekDates[0]
  const weekEnd = weekDates[6]

  // Step 1: Filter schedulable tasks
  const { schedulable, blocked } = filterSchedulableTasks(tasks)

  // Step 2: Sort by priority
  const sortedTasks = sortTasksForScheduling(schedulable, weekStart, weekEnd)

  // Step 3: Generate available slots for the week
  type SlotInfo = {
    time: Date
    dayIndex: number
    assigned: boolean
  }

  const allSlots: SlotInfo[] = []
  for (let dayIndex = 0; dayIndex < weekDates.length; dayIndex++) {
    const daySlots = generateDaySlots(
      weekDates[dayIndex],
      working_hours_start,
      working_hours_end
    )
    for (const slot of daySlots) {
      allSlots.push({ time: slot, dayIndex, assigned: false })
    }
  }

  // Track tasks per day for even distribution
  const tasksPerDay = new Array(7).fill(0)

  // Step 4: Assign tasks to slots
  const schedule: ScheduledTask[] = []
  const unscheduled: Task[] = []

  for (const task of sortedTasks) {
    // Find best slot for this task
    let bestSlot: SlotInfo | null = null
    let bestScore = -Infinity

    for (const slot of allSlots) {
      if (slot.assigned) continue

      // Calculate fitness score
      let score = 0

      // Energy fit (high weight)
      score += calculateEnergyFit(task, slot.time, energy_preference)

      // Working hours bonus (soft constraint - prefer but don't enforce)
      score += getWorkingHoursBonus(slot.time, working_hours_start, working_hours_end)

      // Prefer days with fewer tasks (even distribution)
      const dayTaskCount = tasksPerDay[slot.dayIndex]
      score -= dayTaskCount * 2

      // Prefer earlier in the week for high priority
      if (task.priority !== null && task.priority <= 1) {
        score += (7 - slot.dayIndex) * 3
      }

      if (score > bestScore) {
        bestScore = score
        bestSlot = slot
      }
    }

    if (bestSlot) {
      // Assign task to slot
      schedule.push({
        task_id: task.id,
        scheduled_at: bestSlot.time.toISOString(),
      })
      bestSlot.assigned = true
      tasksPerDay[bestSlot.dayIndex]++
    } else {
      unscheduled.push(task)
    }
  }

  // Generate reasoning
  const reasoning = generateReasoning(
    schedule.length,
    unscheduled.length,
    blocked.length,
    tasksPerDay
  )

  // Calculate stats
  const stats = {
    total_scheduled: schedule.length,
    unscheduled_count: unscheduled.length,
    average_tasks_per_day: schedule.length / 7,
  }

  return {
    optimized_schedule: schedule,
    reasoning,
    stats,
  }
}

/**
 * Generate human-readable reasoning for the schedule
 */
function generateReasoning(
  scheduledCount: number,
  unscheduledCount: number,
  blockedCount: number,
  tasksPerDay: number[]
): string {
  const parts: string[] = []

  parts.push(`Scheduled ${scheduledCount} task${scheduledCount !== 1 ? "s" : ""} across the week.`)

  if (unscheduledCount > 0) {
    parts.push(
      `${unscheduledCount} task${unscheduledCount !== 1 ? "s" : ""} couldn't be scheduled due to time constraints.`
    )
  }

  if (blockedCount > 0) {
    parts.push(
      `${blockedCount} task${blockedCount !== 1 ? "s" : ""} ${blockedCount === 1 ? "is" : "are"} blocked by dependencies.`
    )
  }

  // Find most loaded days
  const maxTasks = Math.max(...tasksPerDay)

  if (maxTasks > 0) {
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const busiestDays = tasksPerDay
      .map((count, index) => (count === maxTasks ? dayNames[index] : null))
      .filter(Boolean)

    if (busiestDays.length > 0) {
      parts.push(
        `Busiest day${busiestDays.length > 1 ? "s" : ""}: ${busiestDays.join(", ")} (${maxTasks} task${maxTasks !== 1 ? "s" : ""}).`
      )
    }
  }

  parts.push(
    "Tasks were distributed based on priority, energy levels, and dependencies for optimal productivity."
  )

  return parts.join(" ")
}
