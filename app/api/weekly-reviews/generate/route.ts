import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  generateWeeklyInsights,
  calculateWeeklyStats,
} from "@/lib/ai/weekly-review"

type ErrorResponse = {
  error: string
  details?: string
}

type GenerateWeeklyReviewRequest = {
  week_start: string // YYYY-MM-DD (Monday)
}

type GenerateWeeklyReviewResponse = {
  review: {
    id: string
    user_id: string
    week_start: string
    reflection: string
    achievements: string[]
    next_week_goals: string[]
    energy_level: string | null
    created_at: string
    updated_at: string
  }
  insights: {
    completion_summary: string
    productivity_patterns: string[]
    bottlenecks: string[]
    suggestions: string[]
  }
  stats: {
    total_tasks: number
    completed_tasks: number
    completion_rate: number
    total_focus_minutes: number
    focus_sessions_count: number
  }
}

/**
 * POST /api/weekly-reviews/generate
 *
 * Auto-generate weekly review with AI insights
 *
 * Request body:
 * {
 *   week_start: "2026-01-27" // Must be Monday
 * }
 *
 * Response:
 * {
 *   review: WeeklyReview, // Saved review with AI-generated content
 *   insights: {
 *     completion_summary: string,
 *     productivity_patterns: string[],
 *     bottlenecks: string[],
 *     suggestions: string[]
 *   },
 *   stats: WeeklyStats
 * }
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<GenerateWeeklyReviewResponse | ErrorResponse>> {
  try {
    const supabase = await createClient()

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const body = (await request.json()) as GenerateWeeklyReviewRequest

    if (!body.week_start) {
      return NextResponse.json(
        { error: "Missing required field: week_start" },
        { status: 400 }
      )
    }

    // Validate week_start format and is Monday
    const weekStartDate = new Date(body.week_start)
    if (isNaN(weekStartDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid week_start date format. Expected YYYY-MM-DD" },
        { status: 400 }
      )
    }

    if (weekStartDate.getDay() !== 1) {
      return NextResponse.json(
        { error: "week_start must be a Monday" },
        { status: 400 }
      )
    }

    // Calculate week end (Sunday)
    const weekEndDate = new Date(weekStartDate)
    weekEndDate.setDate(weekEndDate.getDate() + 7)
    const weekEnd = weekEndDate.toISOString().split("T")[0]

    // Fetch all tasks for the week (created or updated during the week)
    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .or(
        `created_at.gte.${body.week_start},created_at.lt.${weekEnd},updated_at.gte.${body.week_start},updated_at.lt.${weekEnd}`
      )

    if (tasksError) {
      console.error("Error fetching tasks:", tasksError)
      return NextResponse.json(
        { error: "Failed to fetch tasks", details: tasksError.message },
        { status: 500 }
      )
    }

    // Fetch focus sessions for the week
    const { data: focusSessions, error: sessionsError } = await supabase
      .from("focus_sessions")
      .select("duration_minutes")
      .eq("user_id", user.id)
      .gte("start_time", body.week_start)
      .lt("start_time", weekEnd)

    if (sessionsError) {
      console.error("Error fetching focus sessions:", sessionsError)
      // Non-critical, continue with empty array
    }

    // Check if we have any data for the week
    if (!tasks || tasks.length === 0) {
      return NextResponse.json(
        {
          error:
            "No task data found for this week. Cannot generate review for an empty week.",
        },
        { status: 400 }
      )
    }

    // Calculate statistics
    const stats = calculateWeeklyStats(tasks, focusSessions || [])

    // Generate AI insights
    const insights = await generateWeeklyInsights(stats, tasks)

    // Create reflection text from insights
    const reflection = `${insights.completion_summary}

## Productivity Patterns
${insights.productivity_patterns.map((p) => `- ${p}`).join("\n")}

## Bottlenecks
${insights.bottlenecks.length > 0 ? insights.bottlenecks.map((b) => `- ${b}`).join("\n") : "No major bottlenecks identified."}

## Suggestions for Next Week
${insights.suggestions.map((s) => `- ${s}`).join("\n")}`

    // Save review to database
    const { data: review, error: saveError } = await supabase
      .from("weekly_reviews")
      .upsert(
        {
          user_id: user.id,
          week_start: body.week_start,
          reflection,
          achievements: insights.achievements,
          next_week_goals: insights.suggestions,
          energy_level: null, // Can be set manually later
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,week_start",
        }
      )
      .select()
      .single()

    if (saveError) {
      console.error("Error saving weekly review:", saveError)
      return NextResponse.json(
        { error: "Failed to save review", details: saveError.message },
        { status: 500 }
      )
    }

    // Return response
    return NextResponse.json({
      review,
      insights: {
        completion_summary: insights.completion_summary,
        productivity_patterns: insights.productivity_patterns,
        bottlenecks: insights.bottlenecks,
        suggestions: insights.suggestions,
      },
      stats: {
        total_tasks: stats.total_tasks,
        completed_tasks: stats.completed_tasks,
        completion_rate: stats.completion_rate,
        total_focus_minutes: stats.total_focus_minutes,
        focus_sessions_count: stats.focus_sessions_count,
        tags_distribution: stats.tags_distribution,
      },
    })
  } catch (error) {
    console.error("Unexpected error in POST /api/weekly-reviews/generate:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
