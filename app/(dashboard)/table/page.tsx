"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { TableView } from "@/components/views/TableView"
import { useTasksStore } from "@/stores/tasks-store"
import { useTasksContext } from "@/contexts/tasks-context"
import { dbTasksToViewTasks, viewTaskToDbUpdates } from "@/lib/task-adapter"
import type { ViewTask } from "@/types/task"

export default function TablePage() {
  const { isLoading, error } = useTasksContext()
  const { tasks, updateTaskOptimistic, deleteTaskOptimistic } = useTasksStore()

  const viewTasks = React.useMemo(
    () => dbTasksToViewTasks(tasks.filter((t) => t.status !== "cancelled")),
    [tasks]
  )

  const handleTaskUpdate = React.useCallback(
    async (taskId: string, updates: Partial<ViewTask>) => {
      const dbUpdates = viewTaskToDbUpdates(updates)
      await updateTaskOptimistic(taskId, dbUpdates)
    },
    [updateTaskOptimistic]
  )

  const handleTaskDelete = React.useCallback(
    async (taskIds: string[]) => {
      await Promise.all(taskIds.map((id) => deleteTaskOptimistic(id)))
    },
    [deleteTaskOptimistic]
  )

  const handleBulkUpdate = React.useCallback(
    async (taskIds: string[], updates: Partial<ViewTask>) => {
      const dbUpdates = viewTaskToDbUpdates(updates)
      await Promise.all(taskIds.map((id) => updateTaskOptimistic(id, dbUpdates)))
    },
    [updateTaskOptimistic]
  )

  if (error) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-sm font-medium">All Tasks</h1>
          <span className="text-xs text-muted-foreground">
            {isLoading ? "Loading..." : `${viewTasks.length} tasks`}
          </span>
        </div>

        <Button size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          Add Task
        </Button>
      </header>

      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-sm text-muted-foreground">Loading tasks...</div>
          </div>
        ) : (
          <TableView
            tasks={viewTasks}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            onBulkUpdate={handleBulkUpdate}
          />
        )}
      </div>
    </div>
  )
}
