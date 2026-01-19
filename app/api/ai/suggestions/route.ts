import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  generateSuggestions,
  type SuggestionsResponse,
  type SuggestionOptions,
} from "@/lib/ai/suggestion-algorithm"

type ErrorResponse = {
  error: string
  details?: string
}

/**
 * GET /api/ai/suggestions
 *
 * Returns AI-powered task suggestions for today based on:
 * - Priority and due dates
 * - Dependency status (blocked tasks)
 * - Time estimation and available working hours
 *
 * Query params:
 * - working_hours: Max hours to work (default: 8)
 * - max_suggestions: Number of tasks to suggest (default: 3)
 * - consider_energy: Enable energy-based ordering (default: false)
 * - time_of_day: morning | afternoon | evening (default: auto-detected)
 *
 * Response:
 * {
 *   suggestions: Task[],
 *   insights: {
 *     workload: "light" | "balanced" | "heavy",
 *     total_minutes: number,
 *     blocked_count: number,
 *     urgent_count: number,
 *     overdue_count: number
 *   }
 * }
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<SuggestionsResponse | ErrorResponse>> {
  try {
    const supabase = await createClient()

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const options = parseOptions(searchParams)

    // Fetch all user tasks (we need all to check dependencies)
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

    // Generate suggestions
    const result = generateSuggestions(tasks ?? [], options)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Unexpected error in GET /api/ai/suggestions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * Parse and validate query parameters
 */
function parseOptions(searchParams: URLSearchParams): SuggestionOptions {
  const options: SuggestionOptions = {}

  // working_hours
  const workingHoursParam = searchParams.get("working_hours")
  if (workingHoursParam) {
    const hours = parseFloat(workingHoursParam)
    if (!isNaN(hours) && hours > 0 && hours <= 24) {
      options.working_hours = hours
    }
  }

  // max_suggestions
  const maxSuggestionsParam = searchParams.get("max_suggestions")
  if (maxSuggestionsParam) {
    const max = parseInt(maxSuggestionsParam, 10)
    if (!isNaN(max) && max > 0 && max <= 10) {
      options.max_suggestions = max
    }
  }

  // consider_energy
  const considerEnergyParam = searchParams.get("consider_energy")
  if (considerEnergyParam === "true" || considerEnergyParam === "1") {
    options.consider_energy = true
  }

  // time_of_day (auto-detect if not provided and energy is considered)
  const timeOfDayParam = searchParams.get("time_of_day")
  if (timeOfDayParam && ["morning", "afternoon", "evening"].includes(timeOfDayParam)) {
    options.time_of_day = timeOfDayParam as "morning" | "afternoon" | "evening"
  } else if (options.consider_energy) {
    options.time_of_day = detectTimeOfDay()
  }

  return options
}

/**
 * Auto-detect time of day based on current hour
 */
function detectTimeOfDay(): "morning" | "afternoon" | "evening" {
  const hour = new Date().getHours()
  if (hour < 12) return "morning"
  if (hour < 17) return "afternoon"
  return "evening"
}
