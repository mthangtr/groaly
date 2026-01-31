"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { KanbanBoard } from "@/components/views/KanbanBoard"
import { TaskDetailModal } from "@/components/tasks"
import { useTasksStore } from "@/stores/tasks-store"
import { useTasksContext } from "@/contexts/tasks-context"
import type { Task, TaskStatus } from "@/types/task"

export default function KanbanPage() {
  const { isLoading, error } = useTasksContext()
  const { tasks, updateTaskOptimistic } = useTasksStore()
  
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null)
  const [modalOpen, setModalOpen] = React.useState(false)

  const handleTaskMove = async (taskId: string, newStatus: TaskStatus) => {
    await updateTaskOptimistic(taskId, { status: newStatus })
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
