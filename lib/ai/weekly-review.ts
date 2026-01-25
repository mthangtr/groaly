/**
 * AI-powered weekly review generation
 */
import { generateStructuredOutput } from "./structured-output"
import { withRetry } from "./retry"
import {
  WeeklyInsightsSchema,
  WEEKLY_INSIGHTS_SCHEMA_DESCRIPTION,
  type WeeklyInsights,
  type WeeklyStats,
} from "./schemas"
import { MODELS } from "./openrouter"

/**
 * System prompt for weekly review generation
 */
const WEEKLY_REVIEW_SYSTEM_PROMPT = `You are a productivity coach analyzing a week's work to provide insights and recommendations.

Your job is to:
1. **Summarize completion**: Give a clear, encouraging summary of task completion rate
2. **Identify patterns**: Find meaningful patterns in productivity (time of day, task types, etc.)
3. **Spot bottlenecks**: Identify key challenges or blockers that slowed progress
4. **Celebrate achievements**: Highlight notable accomplishments and wins
5. **Provide actionable suggestions**: Give specific, actionable recommendations for next week

Guidelines:
- Be encouraging but honest - celebrate wins and acknowledge challenges
- Focus on actionable insights, not just data summary
- Use specific examples from the data when possible
- Keep language positive and motivational
- Prioritize quality over quantity - better to have 3 great insights than 5 mediocre ones`

/**
 * Format stats and tasks for AI analysis
 */
function buildWeeklyReviewContext(
  stats: WeeklyStats,
  tasks: Array<{
    id: string
    title: string
    status: string
    priority: number
    created_at: string
    updated_at: string
    tags: string[]
    due_date?: string
    scheduled_at?: string
  }>
): string {
  // Sort tasks by priority and status
  const completedTasks = tasks.filter((t) => t.status === "done")
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress")
  const todoTasks = tasks.filter((t) => t.status === "todo")

  // Format top tags
  const topTags = Object.entries(stats.tags_distribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tag, count]) => `${tag} (${count})`)
    .join(", ")

  return `# Week Overview

## Statistics
- Total tasks: ${stats.total_tasks}
- Completed: ${stats.completed_tasks} (${stats.completion_rate.toFixed(1)}%)
- In progress: ${stats.in_progress_tasks}
- Todo: ${todoTasks.length}
- Focus time: ${Math.floor(stats.total_focus_minutes / 60)}h ${stats.total_focus_minutes % 60}m (${stats.focus_sessions_count} sessions)

## Priority Distribution
- Urgent (P0): ${stats.priority_distribution.urgent}
- High (P1): ${stats.priority_distribution.high}
- Medium (P2): ${stats.priority_distribution.medium}
- Low (P3): ${stats.priority_distribution.low}

## Top Tags
${topTags || "No tags"}

## Completed Tasks (${completedTasks.length})
${completedTasks
  .slice(0, 10)
  .map(
    (t) =>
      `- [P${t.priority}] ${t.title}${t.tags.length > 0 ? ` [${t.tags.join(", ")}]` : ""}`
  )
  .join("\n")}
${completedTasks.length > 10 ? `... and ${completedTasks.length - 10} more` : ""}

## In Progress Tasks (${inProgressTasks.length})
${inProgressTasks
  .slice(0, 5)
  .map(
    (t) =>
      `- [P${t.priority}] ${t.title}${t.tags.length > 0 ? ` [${t.tags.join(", ")}]` : ""}`
  )
  .join("\n")}
${inProgressTasks.length > 5 ? `... and ${inProgressTasks.length - 5} more` : ""}

## Incomplete Todo Tasks (${todoTasks.length})
${todoTasks
  .slice(0, 5)
  .map(
    (t) =>
      `- [P${t.priority}] ${t.title}${t.tags.length > 0 ? ` [${t.tags.join(", ")}]` : ""}`
  )
  .join("\n")}
${todoTasks.length > 5 ? `... and ${todoTasks.length - 5} more` : ""}`
}

/**
 * Generate weekly insights using AI
 */
export async function generateWeeklyInsights(
  stats: WeeklyStats,
  tasks: Array<{
    id: string
    title: string
    status: string
    priority: number
    created_at: string
    updated_at: string
    tags: string[]
    due_date?: string
    scheduled_at?: string
  }>
): Promise<WeeklyInsights> {
  const context = buildWeeklyReviewContext(stats, tasks)

  return withRetry(
    async () => {
      return generateStructuredOutput({
        schema: WeeklyInsightsSchema,
        schemaDescription: WEEKLY_INSIGHTS_SCHEMA_DESCRIPTION,
        system: WEEKLY_REVIEW_SYSTEM_PROMPT,
        prompt: `Analyze the following week's work and provide insights:\n\n${context}`,
        model: MODELS.balanced, // Use Claude Sonnet for quality insights
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
 * Calculate weekly statistics from tasks and focus sessions
 */
export function calculateWeeklyStats(
  tasks: Array<{
    status: string
    priority: number
    tags: string[]
  }>,
  focusSessions: Array<{
    duration_minutes: number | null
  }>
): WeeklyStats {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === "done").length
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length

  // Calculate completion rate
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  // Calculate focus time
  const totalFocusMinutes = focusSessions.reduce(
    (sum, session) => sum + (session.duration_minutes || 0),
    0
  )

  // Priority distribution
  const priorityDistribution = {
    urgent: tasks.filter((t) => t.priority === 0).length,
    high: tasks.filter((t) => t.priority === 1).length,
    medium: tasks.filter((t) => t.priority === 2).length,
    low: tasks.filter((t) => t.priority === 3).length,
  }

  // Tags distribution
  const tagsDistribution: Record<string, number> = {}
  tasks.forEach((task) => {
    task.tags.forEach((tag) => {
      tagsDistribution[tag] = (tagsDistribution[tag] || 0) + 1
    })
  })

  return {
    total_tasks: totalTasks,
    completed_tasks: completedTasks,
    in_progress_tasks: inProgressTasks,
    completion_rate: completionRate,
    total_focus_minutes: totalFocusMinutes,
    focus_sessions_count: focusSessions.length,
    priority_distribution: priorityDistribution,
    tags_distribution: tagsDistribution,
  }
}
