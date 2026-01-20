import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { ensureUserExists } from "@/lib/supabase/ensure-user"
import type {
  ProtectedSlotsListResponse,
  ProtectedSlotResponse,
  ProtectedSlotCreateInput,
  ProtectedSlotErrorResponse,
  ProtectedSlotWithDuration,
  ProtectedSlot,
} from "@/types/protected-slot"

function calculateDurationMinutes(startTime: string, endTime: string): number {
  const start = new Date(startTime)
  const end = new Date(endTime)
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60))
}

function addDuration(slot: ProtectedSlot): ProtectedSlotWithDuration {
  return {
    ...slot,
    duration_minutes: calculateDurationMinutes(slot.start_time, slot.end_time),
  }
}

async function checkOverlappingSlots(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  startTime: string,
  endTime: string,
  excludeId?: string
): Promise<boolean> {
  let query = supabase
    .from("protected_slots")
    .select("id")
    .eq("user_id", userId)
    .lt("start_time", endTime)
    .gt("end_time", startTime)

  if (excludeId) {
    query = query.neq("id", excludeId)
  }

  const { data } = await query
  return (data?.length ?? 0) > 0
}

export async function GET(): Promise<NextResponse<ProtectedSlotsListResponse | ProtectedSlotErrorResponse>> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { data: slots, count, error } = await supabase
      .from("protected_slots")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("start_time", { ascending: true })

    if (error) {
      console.error("Error fetching protected slots:", error)
      return NextResponse.json(
        { error: "Failed to fetch protected slots", details: error.message },
        { status: 500 }
      )
    }

    const slotsWithDuration = (slots ?? []).map(addDuration)

    return NextResponse.json({
      slots: slotsWithDuration,
      count: count ?? 0,
    })
  } catch (error) {
    console.error("Unexpected error in GET /api/protected-slots:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ProtectedSlotResponse | ProtectedSlotErrorResponse>> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await ensureUserExists(supabase, user.id, user.email)

    let body: ProtectedSlotCreateInput
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      )
    }

    if (!body.title || typeof body.title !== "string" || body.title.trim() === "") {
      return NextResponse.json(
        { error: "Validation error", details: "Title is required and must be a non-empty string" },
        { status: 400 }
      )
    }

    if (!body.start_time || !body.end_time) {
      return NextResponse.json(
        { error: "Validation error", details: "start_time and end_time are required" },
        { status: 400 }
      )
    }

    const startDate = new Date(body.start_time)
    const endDate = new Date(body.end_time)

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: "Validation error", details: "Invalid date format for start_time or end_time" },
        { status: 400 }
      )
    }

    if (startDate >= endDate) {
      return NextResponse.json(
        { error: "Validation error", details: "start_time must be before end_time" },
        { status: 400 }
      )
    }

    const hasOverlap = await checkOverlappingSlots(supabase, user.id, body.start_time, body.end_time)
    if (hasOverlap) {
      return NextResponse.json(
        { error: "Validation error", details: "This time slot overlaps with an existing protected slot" },
        { status: 409 }
      )
    }

    const { data: slot, error } = await supabase
      .from("protected_slots")
      .insert({
        user_id: user.id,
        title: body.title.trim(),
        start_time: body.start_time,
        end_time: body.end_time,
        is_recurring: body.is_recurring ?? false,
        recurrence_rule: body.recurrence_rule ?? null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating protected slot:", error)
      return NextResponse.json(
        { error: "Failed to create protected slot", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { slot: addDuration(slot) },
      { status: 201 }
    )
  } catch (error) {
    console.error("Unexpected error in POST /api/protected-slots:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
