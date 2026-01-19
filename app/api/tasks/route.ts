import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type {
  TasksListResponse,
  TaskResponse,
  TaskCreateInput,
  TaskErrorResponse,
  TaskStatus,
  TaskPriority,
} from "@/types/task"

/**
 * GET /api/tasks
 * List tasks with optional filtering
 * 
 * Query params:
 * - status: Filter by task status (todo, in_progress, done, cancelled)
 * - priority: Filter by priority level (0-3)
 * - due_date: Filter by exact due date (YYYY-MM-DD)
 * - due_before: Filter tasks due before this date
 * - due_after: Filter tasks due after this date
 * - tags: Filter by tags (comma-separated, any match)
 */
export async function GET(request: NextRequest): Promise<NextResponse<TasksListResponse | TaskErrorResponse>> {
  try {
    const supabase = await createClient()
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status") as TaskStatus | null
    const priorityParam = searchParams.get("priority")
    const dueDate = searchParams.get("due_date")
    const dueBefore = searchParams.get("due_before")
    const dueAfter = searchParams.get("due_after")
    const tagsParam = searchParams.get("tags")

    // Validate status if provided
    if (status && !["todo", "in_progress", "done", "cancelled"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status", details: "Status must be one of: todo, in_progress, done, cancelled" },
        { status: 400 }
      )
    }

    // Validate and parse priority if provided
    let priority: TaskPriority | null = null
    if (priorityParam !== null) {
      const parsedPriority = parseInt(priorityParam, 10)
      if (isNaN(parsedPriority) || parsedPriority < 0 || parsedPriority > 3) {
        return NextResponse.json(
          { error: "Invalid priority", details: "Priority must be a number between 0 and 3" },
          { status: 400 }
        )
      }
      priority = parsedPriority as TaskPriority
    }

    // Build query
    let query = supabase
      .from("tasks")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    // Apply filters
    if (status) {
      query = query.eq("status", status)
    }

    if (priority !== null) {
      query = query.eq("priority", priority)
    }

    if (dueDate) {
      query = query.eq("due_date", dueDate)
    }

    if (dueBefore) {
      query = query.lt("due_date", dueBefore)
    }

    if (dueAfter) {
      query = query.gt("due_date", dueAfter)
    }

    if (tagsParam) {
      const tags = tagsParam.split(",").map(t => t.trim()).filter(Boolean)
      if (tags.length > 0) {
        // Filter tasks that contain any of the specified tags
        query = query.overlaps("tags", tags)
      }
    }

    const { data: tasks, count, error } = await query

    if (error) {
      console.error("Error fetching tasks:", error)
      return NextResponse.json(
        { error: "Failed to fetch tasks", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      tasks: tasks ?? [],
      count: count ?? 0,
    })
  } catch (error) {
    console.error("Unexpected error in GET /api/tasks:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/tasks
 * Create a new task
 */
export async function POST(request: NextRequest): Promise<NextResponse<TaskResponse | TaskErrorResponse>> {
  try {
    const supabase = await createClient()
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Parse request body
    let body: TaskCreateInput
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!body.title || typeof body.title !== "string" || body.title.trim() === "") {
      return NextResponse.json(
        { error: "Validation error", details: "Title is required and must be a non-empty string" },
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

    // Create task
    const { data: task, error } = await supabase
      .from("tasks")
      .insert({
        user_id: user.id,
        title: body.title.trim(),
        description: body.description ?? null,
        status: body.status ?? "todo",
        priority: body.priority ?? 0,
        due_date: body.due_date ?? null,
        tags: body.tags ?? [],
        metadata: body.metadata ?? {},
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating task:", error)
      return NextResponse.json(
        { error: "Failed to create task", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { task },
      { status: 201 }
    )
  } catch (error) {
    console.error("Unexpected error in POST /api/tasks:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
