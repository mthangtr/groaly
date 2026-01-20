import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { ensureUserExists } from "@/lib/supabase/ensure-user"

type FocusSession = {
  id: string
  user_id: string
  task_id: string | null
  start_time: string
  end_time: string | null
  duration_minutes: number | null
  notes: string | null
  created_at: string
}

type FocusSessionWithTask = FocusSession & {
  tasks?: {
    id: string
    title: string
    status: string
  } | null
}

type FocusSessionsListResponse = {
  sessions: FocusSessionWithTask[]
  count: number
  stats?: {
    total_minutes: number
    total_sessions: number
    completed_sessions: number
    average_duration: number
  }
}

type FocusSessionResponse = {
  session: FocusSession
}

type ErrorResponse = {
  error: string
  details?: string
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<FocusSessionsListResponse | ErrorResponse>> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const taskId = searchParams.get("task_id")
    const dateFrom = searchParams.get("date_from")
    const dateTo = searchParams.get("date_to")
    const includeStats = searchParams.get("include_stats") === "true"

    let query = supabase
      .from("focus_sessions")
      .select("*, tasks(id, title, status)", { count: "exact" })
      .eq("user_id", user.id)
      .order("start_time", { ascending: false })

    if (taskId) {
      query = query.eq("task_id", taskId)
    }

    if (dateFrom) {
      query = query.gte("start_time", dateFrom)
    }

    if (dateTo) {
      query = query.lte("start_time", dateTo)
    }

    const { data: sessions, count, error } = await query

    if (error) {
      console.error("Error fetching focus sessions:", error)
      return NextResponse.json(
        { error: "Failed to fetch sessions", details: error.message },
        { status: 500 }
      )
    }

    const response: FocusSessionsListResponse = {
      sessions: sessions ?? [],
      count: count ?? 0,
    }

    if (includeStats && sessions) {
      const completedSessions = sessions.filter((s) => s.end_time !== null)
      const totalMinutes = sessions.reduce(
        (sum, s) => sum + (s.duration_minutes ?? 0),
        0
      )

      response.stats = {
        total_minutes: totalMinutes,
        total_sessions: sessions.length,
        completed_sessions: completedSessions.length,
        average_duration:
          completedSessions.length > 0
            ? Math.round(totalMinutes / completedSessions.length)
            : 0,
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Unexpected error in GET /api/focus-sessions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

type CreateSessionInput = {
  task_id?: string
  duration_minutes?: number
  started_at?: string
  notes?: string
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<FocusSessionResponse | ErrorResponse>> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await ensureUserExists(supabase, user.id, user.email)

    let body: CreateSessionInput
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    if (body.task_id) {
      const { data: task } = await supabase
        .from("tasks")
        .select("id")
        .eq("id", body.task_id)
        .eq("user_id", user.id)
        .single()

      if (!task) {
        return NextResponse.json(
          { error: "Task not found", details: "The specified task does not exist" },
          { status: 404 }
        )
      }
    }

    const { data: session, error } = await supabase
      .from("focus_sessions")
      .insert({
        user_id: user.id,
        task_id: body.task_id ?? null,
        start_time: body.started_at ?? new Date().toISOString(),
        duration_minutes: body.duration_minutes ?? null,
        notes: body.notes ?? null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating focus session:", error)
      return NextResponse.json(
        { error: "Failed to create session", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ session }, { status: 201 })
  } catch (error) {
    console.error("Unexpected error in POST /api/focus-sessions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
