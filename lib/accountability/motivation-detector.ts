import { philosophicalQuotes } from "@/lib/constants/quotes"

export type EveningCheckWindow = {
  startHour: number
  endHour: number
}

export const DEFAULT_EVENING_WINDOW: EveningCheckWindow = {
  startHour: 18,
  endHour: 22,
}

export function isEveningTime(
  timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone,
  window: EveningCheckWindow = DEFAULT_EVENING_WINDOW
): boolean {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: false,
    timeZone: timezone,
  })

  const hour = parseInt(formatter.format(now), 10)
  return hour >= window.startHour && hour < window.endHour
}

export function getRandomQuote(): (typeof philosophicalQuotes)[number] {
  const index = Math.floor(Math.random() * philosophicalQuotes.length)
  return philosophicalQuotes[index]
}

export type TaskAction = "defer_tomorrow" | "defer_weekend" | "cancel" | "mark_done"

export type TaskActionLog = {
  taskId: string
  taskTitle: string
  action: TaskAction
  reason?: string
  timestamp: string
}

export type EveningCheckResponse = {
  actions: TaskActionLog[]
  reflection?: string
  feeling?: "stressed" | "tired" | "neutral" | "hopeful" | "accomplished"
  timestamp: string
}

export function getCompassionateMessage(action: TaskAction): string {
  const messages: Record<TaskAction, string> = {
    defer_tomorrow: "No problem! Tomorrow is a fresh start.",
    defer_weekend: "Good call. The weekend will give you more breathing room.",
    cancel: "It happens. Knowing what to let go of is a skill.",
    mark_done: "Great job getting it done!",
  }
  return messages[action]
}

export function getNextWeekend(): Date {
  const now = new Date()
  const day = now.getDay()
  const daysUntilSaturday = day === 0 ? 6 : 6 - day
  const saturday = new Date(now)
  saturday.setDate(now.getDate() + daysUntilSaturday)
  saturday.setHours(9, 0, 0, 0)
  return saturday
}

export function getTomorrow(): Date {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(9, 0, 0, 0)
  return tomorrow
}

export function formatActionForLog(
  taskId: string,
  taskTitle: string,
  action: TaskAction,
  reason?: string
): TaskActionLog {
  return {
    taskId,
    taskTitle,
    action,
    reason,
    timestamp: new Date().toISOString(),
  }
}
