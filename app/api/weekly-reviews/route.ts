import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

type WeeklyReview = {
  id: string
  user_id: string
  week_start: string
  reflection: string | null
  achievements: string[] | null
  next_week_goals: string[] | null
  energy_level: "low" | "medium" | "high" | null
  created_at: string
  updated_at: string
}

type ErrorResponse = {
  error: string
  details?: string
}

/**
 * GET /api/weekly-reviews
 *
 * Fetch past weekly reviews for authenticated user
 *
 * Query params:
 * - limit: number (default 10, max 50)
 * - offset: number (default 0)
 * - week_start: string (optional - filter by specific week)
 *
 * Response:
 * {
 *   reviews: WeeklyReview[],
 *   total: number,
 *   limit: number,
 *   offset: number
 * }
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<{ reviews: WeeklyReview[]; total: number; limit: number; offset: number } | ErrorResponse>> {
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

    // Parse query params
    const searchParams = request.nextUrl.searchParams
    const limitParam = searchParams.get("limit")
    const offsetParam = searchParams.get("offset")
    const weekStart = searchParams.get("week_start")

    const limit = limitParam ? Math.min(parseInt(limitParam), 50) : 10
    const offset = offsetParam ? parseInt(offsetParam) : 0

    if (isNaN(limit) || isNaN(offset) || limit < 1 || offset < 0) {
      return NextResponse.json(
        { error: "Invalid limit or offset parameter" },
        { status: 400 }
      )
    }

    // Build query
    let query = supabase
      .from("weekly_reviews")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("week_start", { ascending: false })
      .range(offset, offset + limit - 1)

    // Filter by specific week if provided
    if (weekStart) {
      // Validate date format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(weekStart)) {
        return NextResponse.json(
          { error: "Invalid week_start format. Expected YYYY-MM-DD" },
          { status: 400 }
        )
      }
      query = query.eq("week_start", weekStart)
    }

    const { data: reviews, error: reviewsError, count } = await query

    if (reviewsError) {
      console.error("Error fetching weekly reviews:", reviewsError)
      return NextResponse.json(
        { error: "Failed to fetch reviews", details: reviewsError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      reviews: reviews || [],
      total: count || 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Unexpected error in GET /api/weekly-reviews:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/weekly-reviews
 *
 * Create or update manual weekly review
 *
 * Request body:
 * {
 *   week_start: string, // YYYY-MM-DD (must be Monday)
 *   reflection?: string,
 *   achievements?: string[],
 *   next_week_goals?: string[],
 *   energy_level?: "low" | "medium" | "high"
 * }
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<WeeklyReview | ErrorResponse>> {
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
    const body = await request.json()

    if (!body.week_start) {
      return NextResponse.json(
        { error: "Missing required field: week_start" },
        { status: 400 }
      )
    }

    // Validate week_start format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(body.week_start)) {
      return NextResponse.json(
        { error: "Invalid week_start format. Expected YYYY-MM-DD" },
        { status: 400 }
      )
    }

    // Validate week_start is Monday
    const weekStartDate = new Date(body.week_start)
    if (isNaN(weekStartDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid week_start date" },
        { status: 400 }
      )
    }

    if (weekStartDate.getDay() !== 1) {
      return NextResponse.json(
        { error: "week_start must be a Monday" },
        { status: 400 }
      )
    }

    // Validate energy_level if provided
    if (
      body.energy_level &&
      !["low", "medium", "high"].includes(body.energy_level)
    ) {
      return NextResponse.json(
        { error: "Invalid energy_level. Must be: low, medium, or high" },
        { status: 400 }
      )
    }

    // Upsert review (update if exists, insert if not)
    const { data: review, error: upsertError } = await supabase
      .from("weekly_reviews")
      .upsert(
        {
          user_id: user.id,
          week_start: body.week_start,
          reflection: body.reflection || null,
          achievements: body.achievements || null,
          next_week_goals: body.next_week_goals || null,
          energy_level: body.energy_level || null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,week_start",
        }
      )
      .select()
      .single()

    if (upsertError) {
      console.error("Error upserting weekly review:", upsertError)
      return NextResponse.json(
        { error: "Failed to save review", details: upsertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json(review)
  } catch (error) {
    console.error("Unexpected error in POST /api/weekly-reviews:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
