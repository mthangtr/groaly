import { NextRequest, NextResponse } from "next/server"

import { buildRelatednessReasoning, getRelatedTasks } from "@/lib/ai/relatedness-algorithm"
import { createClient } from "@/lib/supabase/server"
import type { Task, TaskErrorResponse } from "@/types/task"

type RelatedTasksResponse = {
  related_tasks: Task[]
  reasoning: string
}

type RouteParams = {
  params: Promise<{ id: string }>
}

/**
 * GET /api/tasks/related/[id]
 * Returns related tasks using rule-based scoring.
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<RelatedTasksResponse | TaskErrorResponse>> {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isValidUUID(id)) {
      return NextResponse.json({ error: "Invalid task ID format" }, { status: 400 })
    }

    const { data: tasks, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)

    if (error) {
      console.error("Error fetching tasks for relatedness:", error)
      return NextResponse.json(
        { error: "Failed to fetch tasks", details: error.message },
        { status: 500 }
      )
    }

    const targetTask = tasks?.find((task) => task.id === id)
    if (!targetTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const related = getRelatedTasks(targetTask, tasks ?? [], 5)
    const reasoning = buildRelatednessReasoning(related)

    return NextResponse.json({
      related_tasks: related.map((item) => item.task),
      reasoning,
    })
  } catch (error) {
    console.error("Unexpected error in GET /api/tasks/related/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}
