"use client"

import * as React from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import {
  Plus,
  Search,
  FileText,
  CheckSquare,
  MoreHorizontal,
  Sparkles,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { mockNotes, getDailySuggestions, philosophicalQuotes } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function NotesPage() {
  const [search, setSearch] = React.useState("")
  const suggestions = getDailySuggestions()
  const todayQuote = philosophicalQuotes[0]

  const filteredNotes = mockNotes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content_preview.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex h-dvh flex-col">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-sm font-medium">Notes</h1>
          <span className="text-xs text-muted-foreground">
            {mockNotes.length} notes
          </span>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          New Note
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Notes List */}
        <div className="flex w-80 flex-col border-r">
          {/* Search */}
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 text-sm"
              />
            </div>
          </div>

          {/* Notes */}
          <ScrollArea className="flex-1">
            <div className="space-y-0.5 p-2">
              {filteredNotes.map((note, index) => (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className={cn(
                    "group flex flex-col gap-1 rounded-lg p-3 transition-colors hover:bg-muted/50",
                    index === 0 && "bg-muted/50"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 shrink-0 text-muted-foreground" />
                      <span className="font-medium text-sm line-clamp-1">
                        {note.title}
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                        render={(props) => (
                          <button
                            {...props}
                            className="rounded p-0.5 hover:bg-muted"
                            onClick={(e) => e.preventDefault()}
                          >
                            <MoreHorizontal className="size-3.5 text-muted-foreground" />
                          </button>
                        )}
                      />
                      <DropdownMenuContent align="end" sideOffset={4}>
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 pl-6">
                    {note.content_preview}
                  </p>
                  <div className="flex items-center gap-3 pl-6 text-[10px] text-muted-foreground">
                    <span>
                      {formatDistanceToNow(new Date(note.updated_at), {
                        addSuffix: true,
                      })}
                    </span>
                    {note.has_tasks && (
                      <span className="flex items-center gap-0.5">
                        <CheckSquare className="size-3" />
                        {note.task_count}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content - Welcome / Empty State */}
        <div className="flex flex-1 flex-col items-center justify-center p-8">
          <div className="max-w-md text-center space-y-6">
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
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Today&apos;s Suggestions
              </h3>
              <div className="space-y-2">
                {suggestions.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50"
                  >
                    <div
                      className={cn(
                        "size-2 rounded-full shrink-0",
                        task.priority === "urgent" && "bg-red-500",
                        task.priority === "high" && "bg-orange-500",
                        task.priority === "medium" && "bg-yellow-500",
                        task.priority === "low" && "bg-zinc-400"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.goal}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="shrink-0">
                      Start
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action */}
            <p className="text-xs text-muted-foreground">
              Select a note or{" "}
              <button className="text-foreground underline underline-offset-2 hover:no-underline">
                create a new one
              </button>{" "}
              to get started
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
