"use client"

import * as React from "react"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useDroppable } from "@dnd-kit/core"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { KanbanCard, type KanbanTask } from "./KanbanCard"
import type { TaskStatus } from "@/types/task"

export type KanbanColumnConfig = {
  id: TaskStatus
  title: string
  color: string
}

type KanbanColumnProps = {
  column: KanbanColumnConfig
  tasks: KanbanTask[]
  isDragOver?: boolean
  onAddTask?: () => void
  onTaskClick?: (task: KanbanTask) => void
}

export function KanbanColumn({
  column,
  tasks,
  isDragOver = false,
  onAddTask,
  onTaskClick,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  const taskIds = React.useMemo(() => tasks.map((t) => t.id), [tasks])
  const isHighlighted = isDragOver || isOver

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col w-80 shrink-0 rounded-lg border bg-card transition-all duration-200",
        isHighlighted && "ring-2 ring-primary/30 scale-[1.02] shadow-md"
      )}
    >
      <div className="flex items-center gap-2 p-3 border-b bg-muted/30">
        <div className={cn("size-2 rounded-full transition-transform", column.color, isHighlighted && "scale-150")} />
        <h3 className="font-medium text-sm">{column.title}</h3>
        <Badge variant="outline" className="ml-auto text-xs h-5">
          {tasks.length}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={onAddTask}
        >
          <Plus className="size-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <div className="p-2 space-y-2 min-h-[100px]">
            {tasks.map((task) => (
              <KanbanCard key={task.id} task={task} onClick={onTaskClick} />
            ))}
            {tasks.length === 0 && (
              <div
                className={cn(
                  "flex flex-col items-center justify-center h-32 text-xs text-muted-foreground border-2 border-dashed rounded-lg transition-all duration-200",
                  isHighlighted ? "border-primary/50 bg-primary/5 scale-105" : "hover:border-muted-foreground/30"
                )}
              >
                <Plus className={cn("size-8 mb-2 transition-all", isHighlighted && "animate-bounce")} />
                <span>{isHighlighted ? "Drop here" : "No tasks yet"}</span>
                <span className="text-[10px] text-muted-foreground/60 mt-1">Drag tasks here or click + to add</span>
              </div>
            )}
          </div>
        </SortableContext>
      </ScrollArea>
    </div>
  )
}
