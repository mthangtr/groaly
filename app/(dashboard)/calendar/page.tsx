"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { CalendarView } from "@/components/views/CalendarView"
import { OptimizeWeekButton } from "@/components/views/OptimizeWeekButton"
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription"
import type { Task } from "@/types/task"
import type { ProtectedSlotWithDuration } from "@/types/protected-slot"

export default function CalendarPage() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [refreshKey, setRefreshKey] = React.useState(0)
  const [protectedSlots, setProtectedSlots] = React.useState<ProtectedSlotWithDuration[]>([])

  const {
    data: tasks,
    setData: setTasks,
    optimisticUpdate,
    rollback,
  } = useRealtimeSubscription<Task>({
    table: "tasks",
    initialData: [],
    enabled: true,
  })

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, slotsRes] = await Promise.all([
          fetch("/api/tasks"),
          fetch("/api/protected-slots"),
        ])
        
        if (!tasksRes.ok) {
          throw new Error("Failed to fetch tasks")
        }
        
        const tasksData = await tasksRes.json()
        setTasks(tasksData.tasks || [])
        
        if (slotsRes.ok) {
          const slotsData = await slotsRes.json()
          setProtectedSlots(slotsData.slots || [])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [setTasks, refreshKey])

  const handleTaskReschedule = async (taskId: string, newDate: string) => {
    const previousTask = tasks.find((t) => t.id === taskId)
    if (!previousTask) return

    optimisticUpdate(taskId, { due_date: newDate } as Partial<Task>)

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ due_date: newDate }),
      })

      if (!res.ok) {
        throw new Error("Failed to reschedule task")
      }
    } catch {
      rollback(taskId)
    }
  }

  const handleAddTask = (date: Date) => {
    console.log("Add task for date:", date)
  }

  const handleOptimized = () => {
    // Refresh tasks after optimization
    setRefreshKey((prev) => prev + 1)
  }

  // Get Monday of current week for optimize button
  const getMondayOfCurrentWeek = () => {
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1) // Adjust if Sunday
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
          protectedSlots={protectedSlots}
          onTaskReschedule={handleTaskReschedule}
          onAddTask={handleAddTask}
        />
      )}
    </div>
  )
}
