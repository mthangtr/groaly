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
}

export function KanbanColumn({
  column,
  tasks,
  isDragOver = false,
  onAddTask,
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
        "flex flex-col w-80 shrink-0 rounded-lg transition-colors",
        isHighlighted && "bg-muted/50 ring-2 ring-primary/20"
      )}
    >
      <div className="flex items-center gap-2 p-3 border-b">
        <div className={cn("size-2 rounded-full", column.color)} />
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
              <KanbanCard key={task.id} task={task} />
            ))}
            {tasks.length === 0 && (
              <div
                className={cn(
                  "flex items-center justify-center h-24 text-xs text-muted-foreground border border-dashed rounded-lg transition-colors",
                  isHighlighted && "border-primary/50 bg-primary/5"
                )}
              >
                {isHighlighted ? "Drop here" : "No tasks"}
              </div>
            )}
          </div>
        </SortableContext>
      </ScrollArea>
    </div>
  )
}
