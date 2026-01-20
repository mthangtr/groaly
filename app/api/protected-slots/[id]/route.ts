import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type {
  ProtectedSlotResponse,
  ProtectedSlotUpdateInput,
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
  excludeId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("protected_slots")
    .select("id")
    .eq("user_id", userId)
    .neq("id", excludeId)
    .lt("start_time", endTime)
    .gt("end_time", startTime)

  return (data?.length ?? 0) > 0
}

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(
  _request: NextRequest,
  context: RouteParams
): Promise<NextResponse<ProtectedSlotResponse | ProtectedSlotErrorResponse>> {
  try {
    const { id } = await context.params
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { data: slot, error } = await supabase
      .from("protected_slots")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (error || !slot) {
      return NextResponse.json(
        { error: "Protected slot not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ slot: addDuration(slot) })
  } catch (error) {
    console.error("Unexpected error in GET /api/protected-slots/[id]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteParams
): Promise<NextResponse<ProtectedSlotResponse | ProtectedSlotErrorResponse>> {
  try {
    const { id } = await context.params
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { data: existingSlot, error: fetchError } = await supabase
      .from("protected_slots")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !existingSlot) {
      return NextResponse.json(
        { error: "Protected slot not found" },
        { status: 404 }
      )
    }

    let body: ProtectedSlotUpdateInput
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      )
    }

    if (body.title !== undefined && (typeof body.title !== "string" || body.title.trim() === "")) {
      return NextResponse.json(
        { error: "Validation error", details: "Title must be a non-empty string" },
        { status: 400 }
      )
    }

    const newStartTime = body.start_time ?? existingSlot.start_time
    const newEndTime = body.end_time ?? existingSlot.end_time

    if (body.start_time || body.end_time) {
      const startDate = new Date(newStartTime)
      const endDate = new Date(newEndTime)

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

      const hasOverlap = await checkOverlappingSlots(supabase, user.id, newStartTime, newEndTime, id)
      if (hasOverlap) {
        return NextResponse.json(
          { error: "Validation error", details: "This time slot overlaps with an existing protected slot" },
          { status: 409 }
        )
      }
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (body.title !== undefined) updateData.title = body.title.trim()
    if (body.start_time !== undefined) updateData.start_time = body.start_time
    if (body.end_time !== undefined) updateData.end_time = body.end_time
    if (body.is_recurring !== undefined) updateData.is_recurring = body.is_recurring
    if (body.recurrence_rule !== undefined) updateData.recurrence_rule = body.recurrence_rule

    const { data: slot, error } = await supabase
      .from("protected_slots")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating protected slot:", error)
      return NextResponse.json(
        { error: "Failed to update protected slot", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ slot: addDuration(slot) })
  } catch (error) {
    console.error("Unexpected error in PATCH /api/protected-slots/[id]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteParams
): Promise<NextResponse<{ success: boolean } | ProtectedSlotErrorResponse>> {
  try {
    const { id } = await context.params
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { data: existingSlot, error: fetchError } = await supabase
      .from("protected_slots")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !existingSlot) {
      return NextResponse.json(
        { error: "Protected slot not found" },
        { status: 404 }
      )
    }

    const { error } = await supabase
      .from("protected_slots")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)

    if (error) {
      console.error("Error deleting protected slot:", error)
      return NextResponse.json(
        { error: "Failed to delete protected slot", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error in DELETE /api/protected-slots/[id]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
