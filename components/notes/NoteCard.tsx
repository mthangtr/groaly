"use client"

import * as React from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { FileText, MoreHorizontal, Trash2, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Note } from "@/types/note"

type NoteCardProps = {
  note: Note
  isSelected?: boolean
  onDelete?: (id: string) => void
  onDuplicate?: (note: Note) => void
}

/**
 * Generate a preview from note content
 * Strips markdown and truncates to reasonable length
 */
function getContentPreview(content: unknown, maxLength = 150): string {
  // Ensure content is a string - handle Json type from database
  if (!content) return ""

  const contentStr = typeof content === "string"
    ? content
    : JSON.stringify(content)

  // Strip common markdown syntax
  const stripped = contentStr
    .replace(/#{1,6}\s/g, "") // Headers
    .replace(/\*\*([^*]+)\*\*/g, "$1") // Bold
    .replace(/\*([^*]+)\*/g, "$1") // Italic
    .replace(/`([^`]+)`/g, "$1") // Inline code
    .replace(/```[\s\S]*?```/g, "") // Code blocks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Links
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "") // Images
    .replace(/^\s*[-*+]\s/gm, "") // List items
    .replace(/^\s*\d+\.\s/gm, "") // Numbered lists
    .replace(/\n+/g, " ") // Newlines to spaces
    .trim()

  return stripped.length > maxLength
    ? stripped.slice(0, maxLength) + "..."
    : stripped
}

export function NoteCard({ note, isSelected, onDelete, onDuplicate }: NoteCardProps) {
  const preview = getContentPreview(note.content)

  const handleDelete = () => {
    onDelete?.(note.id)
  }

  const handleDuplicate = () => {
    onDuplicate?.(note)
  }

  return (
    <Link
      href={`/notes/${note.id}`}
      className={cn(
        "group flex flex-col gap-1 rounded-lg p-3 transition-colors hover:bg-muted/50",
        isSelected && "bg-muted/50"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="size-4 shrink-0 text-muted-foreground" />
          <span className="font-medium text-sm line-clamp-1">
            {note.title}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity shrink-0"
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
            <DropdownMenuItem onSelect={handleDuplicate}>
              <Copy className="size-3.5 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onSelect={handleDelete}>
              <Trash2 className="size-3.5 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {preview && (
        <p className="text-xs text-muted-foreground line-clamp-2 pl-6">
          {preview}
        </p>
      )}
      {(note.updated_at || note.created_at) && (
        <div className="flex items-center gap-3 pl-6 text-[10px] text-muted-foreground">
          <span>
            {formatDistanceToNow(new Date(note.updated_at ?? note.created_at!), {
              addSuffix: true,
            })}
          </span>
        </div>
      )}
    </Link>
  )
}
