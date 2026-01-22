"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { NoteEditor } from "@/components/notes/NoteEditor"
import type { Note } from "@/types/note"
import type { ExtractTasksResponse } from "@/lib/ai/schemas"
import type { JSONContent } from "@tiptap/react"

// Helper function to extract plain text from Tiptap JSON
function extractTextFromJSON(json: JSONContent): string {
  if (!json) return ""

  let text = ""

  if (json.type === "text" && json.text) {
    text += json.text
  }

  if (json.content && Array.isArray(json.content)) {
    for (const node of json.content) {
      text += extractTextFromJSON(node)
      // Add newline after block elements
      if (node.type === "paragraph" || node.type === "heading") {
        text += "\n"
      }
    }
  }

  return text
}

export default function NoteEditorPage() {
  const params = useParams()
  const router = useRouter()
  const noteId = params.id as string

  const [note, setNote] = React.useState<Note | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [isSaved, setIsSaved] = React.useState(true)
  const [title, setTitle] = React.useState("")
  const [content, setContent] = React.useState<JSONContent>({})
  const [isExtracting, setIsExtracting] = React.useState(false)

  // Fetch note on mount
  React.useEffect(() => {
    async function fetchNote() {
      try {
        const res = await fetch(`/api/notes/${noteId}`)
        if (!res.ok) {
          if (res.status === 404) {
            setError("Note not found")
          } else {
            setError("Failed to load note")
          }
          return
        }
        const data = await res.json()
        setNote(data.note)
        setTitle(data.note.title)
        setContent(data.note.content)
      } catch (err) {
        console.error("Error fetching note:", err)
        setError("Failed to load note")
      } finally {
        setIsLoading(false)
      }
    }

    fetchNote()
  }, [noteId])

  // Auto-save debounced
  React.useEffect(() => {
    if (!note || isSaved) return

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/notes/${noteId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content }),
        })

        if (res.ok) {
          setIsSaved(true)
          const data = await res.json()
          setNote(data.note)
        }
      } catch (err) {
        console.error("Error saving note:", err)
      }
    }, 2000)

    return () => clearTimeout(timeout)
  }, [note, noteId, title, content, isSaved])

  // Handle "Plan this" - extract tasks from note using AI
  const handlePlanThis = React.useCallback(async () => {
    const contentText = extractTextFromJSON(content)

    if (isExtracting || !contentText.trim()) {
      if (!contentText.trim()) {
        toast.warning("Nothing to plan", {
          description: "Add some content to your note first.",
        })
      }
      return
    }

    setIsExtracting(true)
    const toastId = toast.loading("Analyzing your note with AI...")

    try {
      // Step 1: Extract tasks using AI
      const extractRes = await fetch("/api/ai/extract-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note_id: noteId, content: contentText }),
      })

      if (!extractRes.ok) {
        const errorData = await extractRes.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to extract tasks (${extractRes.status})`)
      }

      const { tasks, reasoning } = (await extractRes.json()) as ExtractTasksResponse

      if (tasks.length === 0) {
        toast.info("No tasks found", {
          id: toastId,
          description: "AI couldn't identify any actionable tasks in this note.",
        })
        return
      }

      // Step 2: Create tasks in database
      let createdCount = 0
      const failedTasks: string[] = []

      for (const task of tasks) {
        try {
          const createRes = await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: task.title,
              description: task.description,
              priority: task.priority,
              due_date: task.due_date,
              tags: task.tags,
              metadata: {
                source_note_id: noteId,
                estimated_minutes: task.estimated_minutes,
                ai_extracted: true,
              },
            }),
          })

          if (createRes.ok) {
            createdCount++
          } else {
            failedTasks.push(task.title)
          }
        } catch {
          failedTasks.push(task.title)
        }
      }

      if (createdCount > 0) {
        toast.success(`Created ${createdCount} task${createdCount > 1 ? "s" : ""}`, {
          id: toastId,
          description: reasoning,
          action: {
            label: "View tasks",
            onClick: () => router.push("/kanban"),
          },
        })
      }

      if (failedTasks.length > 0) {
        toast.warning(`${failedTasks.length} task(s) failed to create`, {
          description: failedTasks.slice(0, 3).join(", ") + (failedTasks.length > 3 ? "..." : ""),
        })
      }
    } catch (err) {
      console.error("Error in Plan this:", err)
      toast.error("Failed to extract tasks", {
        id: toastId,
        description: err instanceof Error ? err.message : "Please try again later.",
      })
    } finally {
      setIsExtracting(false)
    }
  }, [content, isExtracting, noteId, router])

  // Keyboard shortcut: Cmd/Ctrl+Shift+P for "Plan this"
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "p") {
        e.preventDefault()
        handlePlanThis()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handlePlanThis])

  if (isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !note) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">{error || "Note not found"}</p>
          <Button variant="outline" size="sm" onClick={() => router.push("/notes")}>
            Back to Notes
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-col">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Link
          href="/notes"
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span className="text-sm">Notes</span>
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          {isSaved ? (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle2 className="size-3" />
              Saved
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-yellow-600">
              <Clock className="size-3" />
              Saving...
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={handlePlanThis}
            disabled={isExtracting}
            title="Extract tasks from note (Ctrl+Shift+P)"
          >
            {isExtracting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Sparkles className="size-3.5" />
            )}
            {isExtracting ? "Planning..." : "Plan this"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={(props) => (
                <Button {...props} variant="ghost" size="icon" className="size-8">
                  <MoreHorizontal className="size-4" />
                </Button>
              )}
            />
            <DropdownMenuContent align="end" sideOffset={4}>
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuItem>Share</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={async () => {
                  if (confirm("Are you sure you want to delete this note?")) {
                    await fetch(`/api/notes/${noteId}`, { method: "DELETE" })
                    router.push("/notes")
                  }
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Editor Area */}
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-3xl p-8">
            {/* Title */}
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setIsSaved(false)
              }}
              className="w-full bg-transparent text-2xl font-semibold tracking-tight outline-none placeholder:text-muted-foreground/50"
              placeholder="Untitled"
            />

            {/* Meta */}
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              {note.created_at && (
                <>
                  <span>
                    Created{" "}
                    {formatDistanceToNow(new Date(note.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                  <span>·</span>
                </>
              )}
              {note.updated_at && (
                <span>
                  Updated{" "}
                  {formatDistanceToNow(new Date(note.updated_at), {
                    addSuffix: true,
                  })}
                </span>
              )}
            </div>

            {/* Content Editor */}
            <div className="mt-8">
              <NoteEditor
                content={content}
                onChange={(newContent) => {
                  setContent(newContent)
                  setIsSaved(false)
                }}
                placeholder="Start typing your note..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
