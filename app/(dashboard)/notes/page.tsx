"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, Sparkles, FileText, Loader2 } from "lucide-react"

import { philosophicalQuotes } from "@/lib/constants/quotes"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { NotesList } from "@/components/notes/NotesList"
import { DailySuggestions } from "@/components/ai/daily-suggestions"
import type { Note, NotesListResponse, NoteResponse } from "@/types/note"

export default function NotesPage() {
  const router = useRouter()
  const [notes, setNotes] = React.useState<Note[]>([])
  const [count, setCount] = React.useState(0)
  const [search, setSearch] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(true)
  const [isCreating, setIsCreating] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const todayQuote = philosophicalQuotes[0]

  // Fetch notes on mount and when search changes
  React.useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const params = new URLSearchParams()
        if (search.trim()) {
          params.set("search", search.trim())
        }

        const response = await fetch(`/api/notes?${params.toString()}`)

        if (!response.ok) {
          if (response.status === 401) {
            // User not authenticated, redirect to login
            router.push("/login")
            return
          }
          throw new Error("Failed to fetch notes")
        }

        const data: NotesListResponse = await response.json()
        setNotes(data.notes)
        setCount(data.count)
      } catch (err) {
        console.error("Error fetching notes:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    // Debounce search
    const timeoutId = setTimeout(fetchNotes, search ? 300 : 0)
    return () => clearTimeout(timeoutId)
  }, [search, router])

  // Create new note
  const handleCreateNote = async () => {
    try {
      setIsCreating(true)
      setError(null)

      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Untitled Note",
          content: "",
        }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login")
          return
        }
        throw new Error("Failed to create note")
      }

      const data: NoteResponse = await response.json()
      // Navigate to the new note
      router.push(`/notes/${data.note.id}`)
    } catch (err) {
      console.error("Error creating note:", err)
      setError(err instanceof Error ? err.message : "Failed to create note")
    } finally {
      setIsCreating(false)
    }
  }

  // Delete note
  const handleDeleteNote = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login")
          return
        }
        throw new Error("Failed to delete note")
      }

      // Remove from local state
      setNotes((prev) => prev.filter((note) => note.id !== id))
      setCount((prev) => prev - 1)
    } catch (err) {
      console.error("Error deleting note:", err)
      setError(err instanceof Error ? err.message : "Failed to delete note")
    }
  }

  // Duplicate note
  const handleDuplicateNote = async (note: Note) => {
    try {
      setError(null)

      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${note.title} (copy)`,
          content: note.content,
          metadata: note.metadata,
        }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login")
          return
        }
        throw new Error("Failed to duplicate note")
      }

      const data: NoteResponse = await response.json()
      // Add to beginning of list
      setNotes((prev) => [data.note, ...prev])
      setCount((prev) => prev + 1)
    } catch (err) {
      console.error("Error duplicating note:", err)
      setError(err instanceof Error ? err.message : "Failed to duplicate note")
    }
  }

  return (
    <div className="flex h-dvh flex-col">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-sm font-medium">Notes</h1>
          <span className="text-xs text-muted-foreground">
            {count} {count === 1 ? "note" : "notes"}
          </span>
        </div>
        <Button
          size="sm"
          className="gap-1.5"
          onClick={handleCreateNote}
          disabled={isCreating}
        >
          {isCreating ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Plus className="size-3.5" />
          )}
          New Note
        </Button>
      </header>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm px-4 py-2 border-b border-destructive/20">
          {error}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Notes List */}
        <NotesList
          notes={notes}
          searchQuery={search}
          onSearch={setSearch}
          onDelete={handleDeleteNote}
          onDuplicate={handleDuplicateNote}
          isLoading={isLoading}
        />

        {/* Main Content - Welcome / Empty State */}
        <div className="flex flex-1 flex-col items-center justify-center p-8">
          <div className="max-w-md text-center space-y-6">
            {/* Empty state for no notes */}
            {!isLoading && notes.length === 0 && !search ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-dashed p-8 bg-muted/30">
                  <FileText className="mx-auto size-10 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No notes yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create your first note to start organizing your thoughts
                  </p>
                  <Button onClick={handleCreateNote} disabled={isCreating}>
                    {isCreating ? (
                      <Loader2 className="size-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="size-4 mr-2" />
                    )}
                    Create Note
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Philosophical Quote */}
                <div className="space-y-2 rounded-lg border border-dashed p-6 bg-muted/30">
                  <Sparkles className="mx-auto size-5 text-muted-foreground/70" />
                  <blockquote className="text-sm italic text-muted-foreground">
                    &ldquo;{todayQuote.vi}&rdquo;
                  </blockquote>
                  <p className="text-xs text-muted-foreground/70">
                    {todayQuote.en}
                  </p>
                </div>

                {/* Daily Suggestions */}
                <DailySuggestions />

                {/* Quick Action */}
                <p className="text-xs text-muted-foreground">
                  Select a note or{" "}
                  <button
                    className="text-foreground underline underline-offset-2 hover:no-underline"
                    onClick={handleCreateNote}
                    disabled={isCreating}
                  >
                    create a new one
                  </button>{" "}
                  to get started
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
