"use client"

import { create } from "zustand"
import { toast } from "sonner"
import type { Note, NoteCreateInput, NoteUpdateInput } from "@/types/note"

type NotesState = {
  notes: Note[]
  isLoading: boolean
  error: string | null
}

type NotesActions = {
  setNotes: (notes: Note[]) => void
  addNote: (note: Note) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  removeNote: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  createNoteOptimistic: (input: NoteCreateInput, userId: string) => Promise<Note | null>
  updateNoteOptimistic: (id: string, input: NoteUpdateInput) => Promise<Note | null>
  deleteNoteOptimistic: (id: string) => Promise<boolean>
  fetchNotes: () => Promise<void>
}

export const useNotesStore = create<NotesState & NotesActions>((set, get) => ({
  notes: [],
  isLoading: false,
  error: null,

  setNotes: (notes) => set({ notes }),

  addNote: (note) =>
    set((state) => ({
      notes: [note, ...state.notes.filter((n) => n.id !== note.id)],
    })),

  updateNote: (id, updates) =>
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    })),

  removeNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  fetchNotes: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/notes")
      if (!response.ok) {
        throw new Error("Failed to fetch notes")
      }
      const data = await response.json()
      set({ notes: data.notes, isLoading: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch notes"
      set({ error: message, isLoading: false })
      toast.error(message)
    }
  },

  createNoteOptimistic: async (input, userId) => {
    const tempId = `temp-${Date.now()}`
    const optimisticNote: Note = {
      id: tempId,
      title: input.title,
      content: input.content,
      metadata: input.metadata ?? null,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    get().addNote(optimisticNote)

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        throw new Error("Failed to create note")
      }

      const data = await response.json()
      const realNote = data.note as Note

      set((state) => ({
        notes: state.notes.map((n) => (n.id === tempId ? realNote : n)),
      }))

      toast.success("Note created")
      return realNote
    } catch (err) {
      get().removeNote(tempId)
      const message = err instanceof Error ? err.message : "Failed to create note"
      toast.error(message)
      return null
    }
  },

  updateNoteOptimistic: async (id, input) => {
    const { notes } = get()
    const originalNote = notes.find((n) => n.id === id)
    if (!originalNote) return null

    get().updateNote(id, {
      ...input,
      updated_at: new Date().toISOString(),
    })

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        throw new Error("Failed to update note")
      }

      const data = await response.json()
      const updatedNote = data.note as Note

      get().updateNote(id, updatedNote)
      toast.success("Note updated")
      return updatedNote
    } catch (err) {
      get().updateNote(id, originalNote)
      const message = err instanceof Error ? err.message : "Failed to update note"
      toast.error(message)
      return null
    }
  },

  deleteNoteOptimistic: async (id) => {
    const { notes } = get()
    const originalNote = notes.find((n) => n.id === id)
    if (!originalNote) return false

    get().removeNote(id)

    // Track if undo was triggered
    let undoTriggered = false

    // Show toast with undo action
    toast.success("Note deleted", {
      duration: 5000,
      action: {
        label: "Undo",
        onClick: () => {
          undoTriggered = true
          get().addNote(originalNote)
          toast.info("Note restored")
        },
      },
    })

    // Wait a bit to allow undo before making the API call
    await new Promise((resolve) => setTimeout(resolve, 5000))

    // If undo was triggered, don't delete from backend
    if (undoTriggered) return false

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete note")
      }

      return true
    } catch (err) {
      get().addNote(originalNote)
      const message = err instanceof Error ? err.message : "Failed to delete note"
      toast.error(message)
      return false
    }
  },
}))
