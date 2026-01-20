import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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

type FocusSessionResponse = {
  session: FocusSession
}

type ErrorResponse = {
  error: string
  details?: string
}

type UpdateSessionInput = {
  ended_at?: string
  completed?: boolean
  notes?: string
  duration_minutes?: number
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<FocusSessionResponse | ErrorResponse>> {
  try {
    const { id } = await params
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: existingSession } = await supabase
      .from("focus_sessions")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (!existingSession) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      )
    }

    let body: UpdateSessionInput
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    const updates: Partial<FocusSession> = {}

    if (body.ended_at) {
      updates.end_time = body.ended_at
    } else if (body.completed) {
      updates.end_time = new Date().toISOString()
    }

    if (body.notes !== undefined) {
      updates.notes = body.notes
    }

    if (body.duration_minutes !== undefined) {
      updates.duration_minutes = body.duration_minutes
    } else if (updates.end_time && existingSession.start_time) {
      const startTime = new Date(existingSession.start_time).getTime()
      const endTime = new Date(updates.end_time).getTime()
      updates.duration_minutes = Math.round((endTime - startTime) / 60000)
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      )
    }

    const { data: session, error } = await supabase
      .from("focus_sessions")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating focus session:", error)
      return NextResponse.json(
        { error: "Failed to update session", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ session })
  } catch (error) {
    console.error("Unexpected error in PATCH /api/focus-sessions/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<FocusSessionResponse | ErrorResponse>> {
  try {
    const { id } = await params
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: session, error } = await supabase
      .from("focus_sessions")
      .select("*, tasks(id, title, status)")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (error || !session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ session })
  } catch (error) {
    console.error("Unexpected error in GET /api/focus-sessions/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
