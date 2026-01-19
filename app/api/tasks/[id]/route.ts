import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type {
  TaskResponse,
  TaskUpdateInput,
  TaskErrorResponse,
} from "@/types/task"

type RouteParams = {
  params: Promise<{ id: string }>
}

/**
 * GET /api/tasks/[id]
 * Get a single task by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<TaskResponse | TaskErrorResponse>> {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Validate UUID format
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: "Invalid task ID format" },
        { status: 400 }
      )
    }

    const { data: task, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Task not found" },
          { status: 404 }
        )
      }
      console.error("Error fetching task:", error)
      return NextResponse.json(
        { error: "Failed to fetch task", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error("Unexpected error in GET /api/tasks/[id]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/tasks/[id]
 * Update a task by ID
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<TaskResponse | TaskErrorResponse>> {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Validate UUID format
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: "Invalid task ID format" },
        { status: 400 }
      )
    }

    // Parse request body
    let body: TaskUpdateInput
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      )
    }

    // Validate that there's at least one field to update
    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "Validation error", details: "At least one field must be provided for update" },
        { status: 400 }
      )
    }

    // Validate title if provided
    if (body.title !== undefined && (typeof body.title !== "string" || body.title.trim() === "")) {
      return NextResponse.json(
        { error: "Validation error", details: "Title must be a non-empty string" },
        { status: 400 }
      )
    }

    // Validate status if provided
    if (body.status && !["todo", "in_progress", "done", "cancelled"].includes(body.status)) {
      return NextResponse.json(
        { error: "Validation error", details: "Status must be one of: todo, in_progress, done, cancelled" },
        { status: 400 }
      )
    }

    // Validate priority if provided
    if (body.priority !== undefined && (body.priority < 0 || body.priority > 3)) {
      return NextResponse.json(
        { error: "Validation error", details: "Priority must be between 0 and 3" },
        { status: 400 }
      )
    }

    // Validate due_date format if provided
    if (body.due_date && isNaN(Date.parse(body.due_date))) {
      return NextResponse.json(
        { error: "Validation error", details: "Invalid due_date format" },
        { status: 400 }
      )
    }

    // Build update object
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (body.title !== undefined) updateData.title = body.title.trim()
    if (body.description !== undefined) updateData.description = body.description
    if (body.status !== undefined) updateData.status = body.status
    if (body.priority !== undefined) updateData.priority = body.priority
    if (body.due_date !== undefined) updateData.due_date = body.due_date
    if (body.tags !== undefined) updateData.tags = body.tags
    if (body.metadata !== undefined) updateData.metadata = body.metadata

    // First check if task exists and belongs to user
    const { data: existingTask, error: fetchError } = await supabase
      .from("tasks")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !existingTask) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      )
    }

    // Update task
    const { data: task, error } = await supabase
      .from("tasks")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating task:", error)
      return NextResponse.json(
        { error: "Failed to update task", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error("Unexpected error in PATCH /api/tasks/[id]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/tasks/[id]
 * Delete a task by ID
 * 
 * Query params:
 * - hard: If "true", permanently deletes the task. Otherwise, soft-deletes (sets status to 'cancelled')
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<{ success: true; deleted: "soft" | "hard" } | TaskErrorResponse>> {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Validate UUID format
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: "Invalid task ID format" },
        { status: 400 }
      )
    }

    // Check for hard delete flag
    const hardDelete = request.nextUrl.searchParams.get("hard") === "true"

    // First check if task exists and belongs to user
    const { data: existingTask, error: fetchError } = await supabase
      .from("tasks")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !existingTask) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      )
    }

    if (hardDelete) {
      // Hard delete - permanently remove the task
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)

      if (error) {
        console.error("Error deleting task:", error)
        return NextResponse.json(
          { error: "Failed to delete task", details: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, deleted: "hard" })
    } else {
      // Soft delete - set status to 'cancelled'
      const { error } = await supabase
        .from("tasks")
        .update({ 
          status: "cancelled",
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .eq("user_id", user.id)

      if (error) {
        console.error("Error soft-deleting task:", error)
        return NextResponse.json(
          { error: "Failed to cancel task", details: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, deleted: "soft" })
    }
  } catch (error) {
    console.error("Unexpected error in DELETE /api/tasks/[id]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * Validate UUID format
 */
function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}
