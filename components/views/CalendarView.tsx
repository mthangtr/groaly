"use client"

import * as React from "react"
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core"
import { useDraggable, useDroppable } from "@dnd-kit/core"
import {
  addDays,
  format,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isToday,
  parseISO,
} from "date-fns"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Play,
  GripVertical,
} from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Task } from "@/types/task"

type CalendarViewProps = {
  tasks: Task[]
  onTaskReschedule: (taskId: string, newDate: string) => Promise<void>
  onAddTask?: (date: Date) => void
}

const priorityColors: Record<number, string> = {
  0: "bg-zinc-400",
  1: "bg-yellow-500",
  2: "bg-orange-500",
  3: "bg-red-500",
}

function getTasksForDate(tasks: Task[], date: Date): Task[] {
  return tasks.filter((task) => {
    if (task.due_date) {
      try {
        return isSameDay(parseISO(task.due_date), date)
      } catch {
        return false
      }
    }
    return false
  })
}

function getDayDensity(tasks: Task[]): "low" | "medium" | "high" {
  const totalMinutes = tasks.reduce((sum, task) => {
    return sum + (((task.metadata as { estimated_minutes?: number } | null)?.estimated_minutes) || 30)
  }, 0)
  const hours = totalMinutes / 60
  if (hours > 8) return "high"
  if (hours >= 6) return "medium"
  return "low"
}

function DraggableTask({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "group flex items-center gap-1.5 rounded-md border bg-card p-2 text-xs transition-all hover:shadow-sm hover:border-foreground/20 cursor-grab active:cursor-grabbing",
        task.status === "done" && "opacity-50",
        isDragging && "opacity-50 shadow-lg ring-2 ring-primary rotate-2 scale-105"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="touch-none focus:outline-none"
        aria-label="Drag to reschedule"
      >
        <GripVertical className="size-3 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
      <div
        className={cn(
          "size-1.5 rounded-full shrink-0",
          priorityColors[task.priority ?? 0]
        )}
      />
      <span className="flex-1 truncate font-medium">{task.title}</span>
      {task.status !== "done" && (
        <Link href={`/focus/${task.id}`}>
          <Button
            size="icon"
            variant="ghost"
            className="size-5 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Play className="size-3" />
          </Button>
        </Link>
      )}
    </div>
  )
}

function TaskOverlay({ task }: { task: Task }) {
  return (
    <div className="flex items-center gap-1.5 rounded-md border bg-card p-2 text-xs shadow-lg ring-2 ring-primary rotate-3 scale-105">
      <div
        className={cn(
          "size-1.5 rounded-full shrink-0",
          priorityColors[task.priority ?? 0]
        )}
      />
      <span className="font-medium">{task.title}</span>
    </div>
  )
}

function DayColumn({
  date,
  tasks,
  isDropTarget,
  onAddTask,
}: {
  date: Date
  tasks: Task[]
  isDropTarget: boolean
  onAddTask?: () => void
}) {
  const today = isToday(date)
  const dayTasks = getTasksForDate(tasks, date)
  const density = getDayDensity(dayTasks)
  const dateStr = format(date, "yyyy-MM-dd")

  const { setNodeRef, isOver } = useDroppable({
    id: dateStr,
    data: { date },
  })

  const isHighlighted = isDropTarget || isOver

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col border-r last:border-r-0 min-w-[140px] flex-1 transition-all duration-200",
        today && "bg-muted/30",
        isHighlighted && "bg-primary/10 ring-2 ring-inset ring-primary/30 scale-[1.02]"
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center justify-center p-3 border-b relative",
          today && "bg-foreground text-background"
        )}
      >
        {dayTasks.length > 0 && (
          <div
            className={cn(
              "absolute top-1 right-1 size-2 rounded-full",
              density === "low" && "bg-green-500",
              density === "medium" && "bg-yellow-500",
              density === "high" && "bg-red-500"
            )}
            title={`${density} density`}
          />
        )}
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {today ? (
            <span className={cn(today && "text-background/70")}>Today</span>
          ) : (
            format(date, "EEE")
          )}
        </span>
        <span
          className={cn(
            "text-xl font-semibold tabular-nums",
            today && "text-background"
          )}
        >
          {format(date, "d")}
        </span>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1.5 min-h-[100px]">
          {dayTasks.map((task) => (
            <DraggableTask key={task.id} task={task} />
          ))}
          {dayTasks.length === 0 && (
            <div
              className={cn(
                "flex items-center justify-center h-16 text-xs text-muted-foreground border border-dashed rounded-md transition-all duration-200",
                isHighlighted && "border-primary/50 bg-primary/5 border-solid scale-105"
              )}
            >
              {isHighlighted ? "Drop here" : "No tasks"}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-2 border-t">
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-9 text-sm text-muted-foreground"
          onClick={onAddTask}
        >
          <Plus className="size-3 mr-1" />
          Add
        </Button>
      </div>
    </div>
  )
}

export function CalendarView({
  tasks,
  onTaskReschedule,
  onAddTask,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [activeTask, setActiveTask] = React.useState<Task | null>(null)
  const [overId, setOverId] = React.useState<string | null>(null)

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    })
  )

  const goToPrevWeek = () => setCurrentDate(addDays(currentDate, -7))
  const goToNextWeek = () => setCurrentDate(addDays(currentDate, 7))
  const goToToday = () => setCurrentDate(new Date())

  const handleDragStart = (event: DragStartEvent) => {
    const task = event.active.data.current?.task as Task | undefined
    if (task) setActiveTask(task)
  }

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over?.id as string || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)
    setOverId(null)

    if (!over) return

    const taskId = active.id as string
    const newDate = over.id as string

    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    const currentDueDate = task.due_date
    if (currentDueDate === newDate) return

    await onTaskReschedule(taskId, newDate)
  }

  const handleDragCancel = () => {
    setActiveTask(null)
    setOverId(null)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-4 px-4 py-2 border-b">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-8" onClick={goToPrevWeek}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={goToToday} className="text-xs">
            Today
          </Button>
          <Button variant="ghost" size="icon" className="size-8" onClick={goToNextWeek}>
            <ChevronRight className="size-4" />
          </Button>
        </div>

        <span className="text-sm text-muted-foreground">
          {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
        </span>

        <div className="flex-1" />

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="size-2 rounded-full bg-green-500" />
            <span>&lt;6h</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="size-2 rounded-full bg-yellow-500" />
            <span>6-8h</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="size-2 rounded-full bg-red-500" />
            <span>&gt;8h</span>
          </div>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex flex-1 overflow-hidden">
          <div className="flex flex-1 border-t">
            {weekDays.map((date) => (
              <DayColumn
                key={date.toISOString()}
                date={date}
                tasks={tasks}
                isDropTarget={overId === format(date, "yyyy-MM-dd")}
                onAddTask={() => onAddTask?.(date)}
              />
            ))}
          </div>
        </div>

        <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
          {activeTask ? <TaskOverlay task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
