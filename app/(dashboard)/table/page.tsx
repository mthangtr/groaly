"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import { mockTasks, type Task } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { TableView } from "@/components/views/TableView"

export default function TablePage() {
  const [tasks, setTasks] = React.useState<Task[]>(mockTasks)

  const handleTaskUpdate = React.useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    )
  }, [])

  const handleTaskDelete = React.useCallback((taskIds: string[]) => {
    setTasks((prev) => prev.filter((task) => !taskIds.includes(task.id)))
  }, [])

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-sm font-medium">All Tasks</h1>
          <span className="text-xs text-muted-foreground">
            {tasks.length} tasks
          </span>
        </div>

        <Button size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          Add Task
        </Button>
      </header>

      <div className="flex-1 overflow-hidden">
        <TableView
          tasks={tasks}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
        />
      </div>
    </div>
  )
}
