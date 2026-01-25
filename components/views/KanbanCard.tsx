"use client"

import * as React from "react"
import Link from "next/link"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, MoreHorizontal, Clock, Play } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Task } from "@/types/task"

export type KanbanTask = Task

const priorityColors: Record<number, string> = {
  0: "bg-zinc-400",
  1: "bg-yellow-500",
  2: "bg-orange-500",
  3: "bg-red-500",
}

type KanbanCardProps = {
  task: KanbanTask
  onEdit?: (task: KanbanTask) => void
  onDelete?: (taskId: string) => void
  onClick?: (task: KanbanTask) => void
}

export function KanbanCard({ task, onEdit, onDelete, onClick }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group rounded-lg border bg-card p-3 shadow-sm transition-all hover:shadow-md hover:border-foreground/20",
        isDragging && "opacity-50 shadow-lg ring-2 ring-primary rotate-2 scale-105"
      )}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="touch-none focus:outline-none"
          aria-label="Drag to reorder"
        >
          <GripVertical
            className={cn(
              "size-4 shrink-0 text-muted-foreground/50 cursor-grab transition-opacity mt-0.5",
              isDragging ? "opacity-100 cursor-grabbing" : "opacity-0 group-hover:opacity-100"
            )}
          />
        </button>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <button
              onClick={() => onClick?.(task)}
              className="text-sm font-medium leading-tight text-left hover:underline"
            >
              {task.title}
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                render={(props) => (
                  <button
                    {...props}
                    className="rounded p-0.5 hover:bg-muted shrink-0"
                  >
                    <MoreHorizontal className="size-3.5 text-muted-foreground" />
                  </button>
                )}
              />
              <DropdownMenuContent align="end" sideOffset={4}>
                <DropdownMenuItem onSelect={() => onEdit?.(task)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>Move to...</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onSelect={() => onDelete?.(task.id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-1.5">
            <div
              className={cn(
                "size-2 rounded-full",
                priorityColors[task.priority ?? 0]
              )}
            />

            {task.tags && task.tags.length > 0 && (
              <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                {task.tags[0]}
              </Badge>
            )}

            {task.due_date && (
              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <Clock className="size-3" />
                {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}
          </div>

          {task.status !== "done" && (
            <Link href={`/focus/${task.id}`}>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Play className="size-3" />
                Focus
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
