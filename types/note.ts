import type { Database, Json } from "./database"

// Base note type from database schema
export type Note = Database["public"]["Tables"]["notes"]["Row"]
export type NoteInsert = Database["public"]["Tables"]["notes"]["Insert"]
export type NoteUpdate = Database["public"]["Tables"]["notes"]["Update"]

// API request/response types
export type NotesListResponse = {
  notes: Note[]
  count: number
}

export type NoteResponse = {
  note: Note
}

export type NoteCreateInput = {
  title: string
  content: Json
  metadata?: Json
}

export type NoteUpdateInput = Partial<NoteCreateInput>

// Error response type
export type NoteErrorResponse = {
  error: string
  details?: string
}
