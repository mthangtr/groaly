"use client"

import * as React from "react"
import Link from "next/link"
import { Plus, GripVertical, MoreHorizontal, Clock, Play } from "lucide-react"

import { cn } from "@/lib/utils"
import { mockTasks, getTasksByStatus, type Task } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"

type KanbanColumn = {
  id: Task["status"]
  title: string
  color: string
}

const columns: KanbanColumn[] = [
  { id: "todo", title: "To Do", color: "bg-zinc-500" },
  { id: "in_progress", title: "In Progress", color: "bg-blue-500" },
  { id: "done", title: "Done", color: "bg-green-500" },
]

function TaskCard({ task }: { task: Task }) {
  return (
    <div className="group rounded-lg border bg-card p-3 shadow-sm transition-all hover:shadow-md hover:border-foreground/20">
      <div className="flex items-start gap-2">
        <GripVertical className="size-4 shrink-0 text-muted-foreground/50 opacity-0 group-hover:opacity-100 cursor-grab transition-opacity mt-0.5" />
        <div className="flex-1 min-w-0 space-y-2">
          {/* Title */}
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium leading-tight">{task.title}</p>
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
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Move to...</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Tags & Meta */}
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Priority */}
            <div
              className={cn(
                "size-2 rounded-full",
                task.priority === "urgent" && "bg-red-500",
                task.priority === "high" && "bg-orange-500",
                task.priority === "medium" && "bg-yellow-500",
                task.priority === "low" && "bg-zinc-400"
              )}
            />

            {/* Goal */}
            {task.goal && (
              <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                {task.goal}
              </Badge>
            )}

            {/* Time estimate */}
            {task.estimated_time_minutes && (
              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <Clock className="size-3" />
                {task.estimated_time_minutes}m
              </span>
            )}
          </div>

          {/* Focus button */}
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

function KanbanColumn({
  column,
  tasks,
}: {
  column: KanbanColumn
  tasks: Task[]
}) {
  return (
    <div className="flex flex-col w-80 shrink-0">
      {/* Column Header */}
      <div className="flex items-center gap-2 p-3 border-b">
        <div className={cn("size-2 rounded-full", column.color)} />
        <h3 className="font-medium text-sm">{column.title}</h3>
        <Badge variant="outline" className="ml-auto text-xs h-5">
          {tasks.length}
        </Badge>
        <Button variant="ghost" size="icon" className="size-7">
          <Plus className="size-4" />
        </Button>
      </div>

      {/* Tasks */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {tasks.length === 0 && (
            <div className="flex items-center justify-center h-24 text-xs text-muted-foreground border border-dashed rounded-lg">
              No tasks
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

export default function KanbanPage() {
  return (
    <div className="flex h-dvh flex-col">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-sm font-medium">Kanban Board</h1>
          <span className="text-xs text-muted-foreground">
            {mockTasks.length} tasks
          </span>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          Add Task
        </Button>
      </header>

      {/* Kanban Board */}
      <div className="flex-1 overflow-auto">
        <div className="flex h-full gap-4 p-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={getTasksByStatus(column.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
