import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type {
  NotesListResponse,
  NoteResponse,
  NoteCreateInput,
  NoteErrorResponse,
} from "@/types/note"

/**
 * GET /api/notes
 * List user's notes with optional search filtering
 * 
 * Query params:
 * - search: Search in title and content (case-insensitive)
 */
export async function GET(request: NextRequest): Promise<NextResponse<NotesListResponse | NoteErrorResponse>> {
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
    const search = searchParams.get("search")

    // Build query - sorted by updated_at DESC
    let query = supabase
      .from("notes")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    // Apply search filter if provided
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`
      query = query.or(`title.ilike.${searchTerm},content.ilike.${searchTerm}`)
    }

    const { data: notes, count, error } = await query

    if (error) {
      console.error("Error fetching notes:", error)
      return NextResponse.json(
        { error: "Failed to fetch notes", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      notes: notes ?? [],
      count: count ?? 0,
    })
  } catch (error) {
    console.error("Unexpected error in GET /api/notes:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/notes
 * Create a new note
 */
export async function POST(request: NextRequest): Promise<NextResponse<NoteResponse | NoteErrorResponse>> {
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
    let body: NoteCreateInput
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

    // Content is required but can be empty string
    if (body.content === undefined || body.content === null) {
      return NextResponse.json(
        { error: "Validation error", details: "Content is required" },
        { status: 400 }
      )
    }

    // Create note
    const { data: note, error } = await supabase
      .from("notes")
      .insert({
        user_id: user.id,
        title: body.title.trim(),
        content: body.content,
        metadata: body.metadata ?? {},
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating note:", error)
      return NextResponse.json(
        { error: "Failed to create note", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { note },
      { status: 201 }
    )
  } catch (error) {
    console.error("Unexpected error in POST /api/notes:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
