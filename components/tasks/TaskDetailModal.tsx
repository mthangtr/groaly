"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RelatedTasksPanel } from "@/components/tasks"
import type { Task } from "@/types/task"
import { cn } from "@/lib/utils"

type TaskDetailModalProps = {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskClick?: (task: Task) => void
}

const priorityColors: Record<number, string> = {
  0: "bg-red-500",
  1: "bg-orange-500",
  2: "bg-yellow-500",
  3: "bg-zinc-400",
}

const priorityLabels: Record<number, string> = {
  0: "Urgent",
  1: "High",
  2: "Medium",
  3: "Low",
}

const statusLabels: Record<string, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
  cancelled: "Cancelled",
}

export function TaskDetailModal({
  task,
  open,
  onOpenChange,
  onTaskClick,
}: TaskDetailModalProps) {
  if (!task) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-1.5">
              <DialogTitle className="text-lg leading-tight">
                {task.title}
              </DialogTitle>
              <DialogDescription className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-[10px] h-5 px-1.5 text-white",
                    priorityColors[task.priority ?? 0]
                  )}
                >
                  {priorityLabels[task.priority ?? 0]}
                </Badge>
                <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                  {statusLabels[task.status ?? "todo"]}
                </Badge>
                {task.due_date && (
                  <span className="text-xs text-muted-foreground">
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </span>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {task.description && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Description</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          )}

          {task.tags && task.tags.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          <RelatedTasksPanel taskId={task.id} onTaskClick={onTaskClick} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
