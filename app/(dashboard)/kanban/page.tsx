"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { KanbanBoard } from "@/components/views/KanbanBoard"
import { TaskDetailModal } from "@/components/tasks"
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription"
import type { Task, TaskStatus } from "@/types/task"

export default function KanbanPage() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null)
  const [modalOpen, setModalOpen] = React.useState(false)

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
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks")
        if (!res.ok) {
          throw new Error("Failed to fetch tasks")
        }
        const data = await res.json()
        setTasks(data.tasks || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load tasks")
      } finally {
        setIsLoading(false)
      }
    }
    fetchTasks()
  }, [setTasks])

  const handleTaskMove = async (taskId: string, newStatus: TaskStatus) => {
    const previousTask = tasks.find((t) => t.id === taskId)
    if (!previousTask) return

    optimisticUpdate(taskId, { status: newStatus } as Partial<Task>)

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        throw new Error("Failed to update task")
      }
    } catch {
      rollback(taskId)
    }
  }

  const handleAddTask = (status: TaskStatus) => {
    console.log("Add task with status:", status)
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setTimeout(() => setSelectedTask(null), 200)
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
          <h1 className="text-sm font-medium">Kanban Board</h1>
          <span className="text-xs text-muted-foreground">
            {isLoading ? "Loading..." : `${activeTasks.length} tasks`}
          </span>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          Add Task
        </Button>
      </header>

      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-sm text-muted-foreground">Loading tasks...</div>
          </div>
        ) : (
          <KanbanBoard
            tasks={activeTasks}
            onTaskMove={handleTaskMove}
            onAddTask={handleAddTask}
            onTaskClick={handleTaskClick}
          />
        )}
      </div>

      <TaskDetailModal
        task={selectedTask}
        open={modalOpen}
        onOpenChange={handleModalClose}
        onTaskClick={handleTaskClick}
      />
    </div>
  )
}
