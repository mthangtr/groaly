import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type {
  NoteResponse,
  NoteUpdateInput,
  NoteErrorResponse,
} from "@/types/note"

type RouteParams = {
  params: Promise<{ id: string }>
}

/**
 * GET /api/notes/[id]
 * Get a single note by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<NoteResponse | NoteErrorResponse>> {
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
        { error: "Invalid note ID format" },
        { status: 400 }
      )
    }

    const { data: note, error } = await supabase
      .from("notes")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Note not found" },
          { status: 404 }
        )
      }
      console.error("Error fetching note:", error)
      return NextResponse.json(
        { error: "Failed to fetch note", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ note })
  } catch (error) {
    console.error("Unexpected error in GET /api/notes/[id]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/notes/[id]
 * Update a note by ID
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<NoteResponse | NoteErrorResponse>> {
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
        { error: "Invalid note ID format" },
        { status: 400 }
      )
    }

    // Parse request body
    let body: NoteUpdateInput
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

    // Build update object
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (body.title !== undefined) updateData.title = body.title.trim()
    if (body.content !== undefined) updateData.content = body.content
    if (body.metadata !== undefined) updateData.metadata = body.metadata

    // First check if note exists and belongs to user
    const { data: existingNote, error: fetchError } = await supabase
      .from("notes")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !existingNote) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      )
    }

    // Update note
    const { data: note, error } = await supabase
      .from("notes")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating note:", error)
      return NextResponse.json(
        { error: "Failed to update note", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ note })
  } catch (error) {
    console.error("Unexpected error in PATCH /api/notes/[id]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/notes/[id]
 * Delete a note by ID (hard delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<{ success: true } | NoteErrorResponse>> {
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
        { error: "Invalid note ID format" },
        { status: 400 }
      )
    }

    // First check if note exists and belongs to user
    const { data: existingNote, error: fetchError } = await supabase
      .from("notes")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !existingNote) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      )
    }

    // Hard delete the note
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)

    if (error) {
      console.error("Error deleting note:", error)
      return NextResponse.json(
        { error: "Failed to delete note", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error in DELETE /api/notes/[id]:", error)
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
