"use client"

import * as React from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"

import { KanbanColumn, type KanbanColumnConfig } from "./KanbanColumn"
import { KanbanCard, type KanbanTask } from "./KanbanCard"
import type { TaskStatus } from "@/types/task"

const COLUMNS: KanbanColumnConfig[] = [
  { id: "todo", title: "To Do", color: "bg-zinc-500" },
  { id: "in_progress", title: "In Progress", color: "bg-blue-500" },
  { id: "done", title: "Done", color: "bg-green-500" },
]

type KanbanBoardProps = {
  tasks: KanbanTask[]
  onTaskMove: (taskId: string, newStatus: TaskStatus) => Promise<void>
  onAddTask?: (status: TaskStatus) => void
}

export function KanbanBoard({ tasks, onTaskMove, onAddTask }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = React.useState<KanbanTask | null>(null)
  const [overId, setOverId] = React.useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const tasksByStatus = React.useMemo(() => {
    const grouped: Record<TaskStatus, KanbanTask[]> = {
      todo: [],
      in_progress: [],
      done: [],
      cancelled: [],
    }
    tasks.forEach((task) => {
      const status = task.status as TaskStatus || "todo"
      if (grouped[status]) {
        grouped[status].push(task)
      }
    })
    return grouped
  }, [tasks])

  const findColumn = (id: string): TaskStatus | null => {
    if (COLUMNS.some((col) => col.id === id)) {
      return id as TaskStatus
    }
    const task = tasks.find((t) => t.id === id)
    return (task?.status as TaskStatus) || null
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find((t) => t.id === active.id)
    if (task) {
      setActiveTask(task)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event
    setOverId(over?.id as string || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)
    setOverId(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeColumn = findColumn(activeId)
    const overColumn = findColumn(overId)

    if (!activeColumn || !overColumn) return

    if (activeColumn !== overColumn) {
      await onTaskMove(activeId, overColumn)
    }
  }

  const handleDragCancel = () => {
    setActiveTask(null)
    setOverId(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex h-full gap-4 p-4">
        {COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={tasksByStatus[column.id] || []}
            isDragOver={overId === column.id}
            onAddTask={() => onAddTask?.(column.id)}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
        {activeTask ? <KanbanCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
