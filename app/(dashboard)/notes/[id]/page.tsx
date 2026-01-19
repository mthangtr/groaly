"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Clock,
  MoreHorizontal,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { mockNotes, mockTasks } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function NoteEditorPage() {
  const params = useParams()
  const noteId = params.id as string
  const note = mockNotes.find((n) => n.id === noteId)
  const linkedTasks = mockTasks.filter((t) => t.note_id === noteId)

  const [isSaved, setIsSaved] = React.useState(true)

  if (!note) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <p className="text-muted-foreground">Note not found</p>
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
              Unsaved changes
            </span>
          )}
          <Button variant="outline" size="sm" className="gap-1.5">
            <Sparkles className="size-3.5" />
            Plan this
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
              <DropdownMenuItem className="text-destructive">
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
              defaultValue={note.title}
              onChange={() => setIsSaved(false)}
              className="w-full bg-transparent text-2xl font-semibold tracking-tight outline-none placeholder:text-muted-foreground/50"
              placeholder="Untitled"
            />

            {/* Meta */}
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              <span>
                Created{" "}
                {formatDistanceToNow(new Date(note.created_at), {
                  addSuffix: true,
                })}
              </span>
              <span>·</span>
              <span>
                Updated{" "}
                {formatDistanceToNow(new Date(note.updated_at), {
                  addSuffix: true,
                })}
              </span>
            </div>

            {/* Content Editor (placeholder for Tiptap) */}
            <div
              className="mt-8 min-h-[400px] prose prose-zinc dark:prose-invert prose-sm max-w-none"
              contentEditable
              suppressContentEditableWarning
              onInput={() => setIsSaved(false)}
            >
              <p>{note.content_preview}</p>
              <p className="text-muted-foreground">
                Start typing to add more content... (Rich text editor will be
                integrated here with Tiptap)
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar - Linked Tasks */}
        {linkedTasks.length > 0 && (
          <div className="w-72 border-l overflow-auto">
            <div className="p-4">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Linked Tasks ({linkedTasks.length})
              </h3>
              <div className="space-y-2">
                {linkedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-lg border p-3 space-y-2 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={cn(
                          "size-2 rounded-full shrink-0 mt-1.5",
                          task.priority === "urgent" && "bg-red-500",
                          task.priority === "high" && "bg-orange-500",
                          task.priority === "medium" && "bg-yellow-500",
                          task.priority === "low" && "bg-zinc-400"
                        )}
                      />
                      <span className="text-sm font-medium line-clamp-2">
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 pl-4">
                      <Badge variant="outline" className="text-[10px] h-5">
                        {task.status.replace("_", " ")}
                      </Badge>
                      {task.goal && (
                        <Badge variant="secondary" className="text-[10px] h-5">
                          {task.goal}
                        </Badge>
                      )}
                    </div>
                    <div className="pl-4">
                      <Button size="sm" variant="ghost" className="h-7 text-xs">
                        Start Focus
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
