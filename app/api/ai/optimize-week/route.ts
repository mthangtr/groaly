import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  optimizeWeek,
  type OptimizeWeekResponse,
  type SchedulingOptions,
  type SchedulingPreferences,
} from "@/lib/ai/scheduling-algorithm"

type ErrorResponse = {
  error: string
  details?: string
}

type OptimizeWeekRequest = {
  week_start: string // ISO date (YYYY-MM-DD)
  preserve_existing?: boolean
  energy_preference?: "morning" | "evening" | "balanced"
}

/**
 * POST /api/ai/optimize-week
 *
 * Auto-balance tasks across the week based on:
 * - Task priorities (high priority → earlier in week)
 * - Dependencies (can't schedule before blockers)
 * - Working hours (soft constraint - prefer but don't enforce)
 * - Energy levels (high energy → morning slots)
 * - Protected slots (hard constraint - never schedule)
 * - Even distribution (avoid overloading single day)
 *
 * Request body:
 * {
 *   week_start: "2026-01-27", // Monday
 *   preserve_existing?: false, // Keep existing scheduled_at if possible
 *   energy_preference?: "morning" | "evening" | "balanced"
 * }
 *
 * Response:
 * {
 *   optimized_schedule: Array<{ task_id, scheduled_at }>,
 *   reasoning: string,
 *   stats: {
 *     total_scheduled: number,
 *     unscheduled_count: number,
 *     average_tasks_per_day: number,
 *     protected_slots_respected: number
 *   }
 * }
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<OptimizeWeekResponse | ErrorResponse>> {
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
    const body = (await request.json()) as OptimizeWeekRequest

    if (!body.week_start) {
      return NextResponse.json(
        { error: "Missing required field: week_start" },
        { status: 400 }
      )
    }

    // Validate week_start is a valid date (Monday)
    const weekStartDate = new Date(body.week_start)
    if (isNaN(weekStartDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid week_start date format. Expected YYYY-MM-DD" },
        { status: 400 }
      )
    }

    // Check if week_start is Monday (day 1)
    if (weekStartDate.getDay() !== 1) {
      return NextResponse.json(
        { error: "week_start must be a Monday" },
        { status: 400 }
      )
    }

    // Fetch user preferences (working hours)
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("working_hours_start, working_hours_end, timezone, preferences")
      .eq("id", user.id)
      .single()

    if (userError) {
      console.error("Error fetching user data:", userError)
      return NextResponse.json(
        { error: "Failed to fetch user preferences", details: userError.message },
        { status: 500 }
      )
    }

    // Fetch all tasks (need all to check dependencies + filter schedulable)
    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)

    if (tasksError) {
      console.error("Error fetching tasks:", tasksError)
      return NextResponse.json(
        { error: "Failed to fetch tasks", details: tasksError.message },
        { status: 500 }
      )
    }

    // Fetch protected slots for the week
    const weekEnd = new Date(weekStartDate)
    weekEnd.setDate(weekEnd.getDate() + 7)

    const { data: protectedSlots, error: slotsError } = await supabase
      .from("protected_slots")
      .select("*")
      .eq("user_id", user.id)
      .gte("start_time", body.week_start)
      .lt("start_time", weekEnd.toISOString().split("T")[0])

    if (slotsError) {
      console.error("Error fetching protected slots:", slotsError)
      // Non-critical error, continue with empty array
    }

    // Build scheduling preferences
    const preferences: SchedulingPreferences = {
      working_hours_start: userData.working_hours_start || "09:00:00",
      working_hours_end: userData.working_hours_end || "18:00:00",
      energy_preference: body.energy_preference || "balanced",
      timezone: userData.timezone || "UTC",
    }

    // Build scheduling options
    const options: SchedulingOptions = {
      week_start: body.week_start,
      preferences,
      protected_slots: protectedSlots || [],
      preserve_existing: body.preserve_existing ?? false,
    }

    // Run optimization algorithm
    const result = optimizeWeek(tasks || [], options)

    // Update tasks in database with new scheduled_at
    if (result.optimized_schedule.length > 0) {
      // Batch update using transaction
      const updates = result.optimized_schedule.map((scheduled) => ({
        id: scheduled.task_id,
        scheduled_at: scheduled.scheduled_at,
      }))

      // Update each task (Supabase doesn't have native batch update, so we use Promise.all)
      const updatePromises = updates.map((update) =>
        supabase
          .from("tasks")
          .update({ scheduled_at: update.scheduled_at })
          .eq("id", update.id)
          .eq("user_id", user.id) // Security: ensure user owns the task
      )

      const updateResults = await Promise.all(updatePromises)

      // Check for errors
      const updateErrors = updateResults.filter((result) => result.error)
      if (updateErrors.length > 0) {
        console.error("Error updating tasks:", updateErrors)
        return NextResponse.json(
          {
            error: "Failed to update some tasks",
            details: updateErrors.map((r) => r.error?.message).join(", "),
          },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Unexpected error in POST /api/ai/optimize-week:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
