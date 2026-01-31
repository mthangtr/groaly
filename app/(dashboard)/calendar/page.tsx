"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { CalendarView } from "@/components/views/CalendarView"
import { OptimizeWeekButton } from "@/components/views/OptimizeWeekButton"
import { useTasksStore } from "@/stores/tasks-store"
import { useTasksContext } from "@/contexts/tasks-context"

export default function CalendarPage() {
  const { isLoading, error } = useTasksContext()
  const { tasks, updateTaskOptimistic, fetchTasks } = useTasksStore()

  const handleTaskReschedule = async (taskId: string, newDate: string) => {
    await updateTaskOptimistic(taskId, { due_date: newDate })
  }

  const handleAddTask = (date: Date) => {
    console.log("Add task for date:", date)
  }

  const handleOptimized = () => {
    fetchTasks()
  }

  const getMondayOfCurrentWeek = () => {
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(today.setDate(diff))
    return monday.toISOString().split("T")[0]
  }

  const activeTasks = React.useMemo(
    () => tasks.filter((t) => t.status !== "cancelled"),
    [tasks]
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
          <h1 className="text-sm font-medium">Calendar</h1>
          <span className="text-xs text-muted-foreground">
            {isLoading ? "Loading..." : `${activeTasks.length} tasks`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <OptimizeWeekButton
            weekStart={getMondayOfCurrentWeek()}
            onOptimized={handleOptimized}
          />
          <Button size="sm" className="gap-1.5">
            <Plus className="size-3.5" />
            Add Task
          </Button>
        </div>
      </header>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading tasks...</div>
        </div>
      ) : (
        <CalendarView
          tasks={activeTasks}
          onTaskReschedule={handleTaskReschedule}
          onAddTask={handleAddTask}
        />
      )}
    </div>
  )
}
