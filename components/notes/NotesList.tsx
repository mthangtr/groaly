"use client"

import * as React from "react"
import { Search, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NoteCard } from "./NoteCard"
import type { Note } from "@/types/note"

type NotesListProps = {
  notes: Note[]
  selectedNoteId?: string
  onSearch: (query: string) => void
  searchQuery: string
  onDelete?: (id: string) => void
  onDuplicate?: (note: Note) => void
  isLoading?: boolean
}

export function NotesList({
  notes,
  selectedNoteId,
  onSearch,
  searchQuery,
  onDelete,
  onDuplicate,
  isLoading,
}: NotesListProps) {
  return (
    <div className="flex w-80 flex-col border-r">
      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="h-8 pl-8 text-sm"
          />
        </div>
      </div>

      {/* Notes */}
      <ScrollArea className="flex-1">
        <div className="space-y-0.5 p-2">
          {isLoading ? (
            // Loading skeleton
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex flex-col gap-1 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="size-4 rounded bg-muted animate-pulse" />
                    <div className="h-4 w-32 rounded bg-muted animate-pulse" />
                  </div>
                  <div className="h-3 w-48 rounded bg-muted animate-pulse ml-6" />
                  <div className="h-2 w-20 rounded bg-muted animate-pulse ml-6 mt-1" />
                </div>
              ))}
            </div>
          ) : notes.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="size-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                {searchQuery ? "No notes found" : "No notes yet"}
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                {searchQuery
                  ? "Try a different search term"
                  : "Create your first note to get started"}
              </p>
            </div>
          ) : (
            // Notes list
            notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                isSelected={note.id === selectedNoteId}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
