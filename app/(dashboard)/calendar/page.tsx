"use client"

import * as React from "react"
import {
  addDays,
  format,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isToday,
} from "date-fns"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Play,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { mockTasks, type Task } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarTrigger } from "@/components/ui/sidebar"

function getTasksForDate(tasks: Task[], date: Date): Task[] {
  return tasks.filter((task) => {
    if (task.scheduled_at) {
      return isSameDay(new Date(task.scheduled_at), date)
    }
    if (task.due_date) {
      return isSameDay(new Date(task.due_date), date)
    }
    return false
  })
}

function TaskItem({ task }: { task: Task }) {
  return (
    <div
      className={cn(
        "group flex items-center gap-2 rounded-md border p-2 text-xs transition-all hover:shadow-sm",
        task.status === "done" && "opacity-50"
      )}
    >
      <div
        className={cn(
          "size-1.5 rounded-full shrink-0",
          task.priority === "urgent" && "bg-red-500",
          task.priority === "high" && "bg-orange-500",
          task.priority === "medium" && "bg-yellow-500",
          task.priority === "low" && "bg-zinc-400"
        )}
      />
      <span className="flex-1 truncate font-medium">{task.title}</span>
      {task.estimated_time_minutes && (
        <span className="flex items-center gap-0.5 text-muted-foreground">
          <Clock className="size-3" />
          {task.estimated_time_minutes}m
        </span>
      )}
      {task.status !== "done" && (
        <Button
          size="icon"
          variant="ghost"
          className="size-5 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Play className="size-3" />
        </Button>
      )}
    </div>
  )
}

function DayColumn({ date, tasks }: { date: Date; tasks: Task[] }) {
  const today = isToday(date)
  const dayTasks = getTasksForDate(tasks, date)

  return (
    <div
      className={cn(
        "flex flex-col border-r last:border-r-0 min-w-[140px] flex-1",
        today && "bg-muted/30"
      )}
    >
      {/* Day Header */}
      <div
        className={cn(
          "flex flex-col items-center justify-center p-3 border-b",
          today && "bg-foreground text-background"
        )}
      >
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

      {/* Tasks */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1.5">
          {dayTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
          {dayTasks.length === 0 && (
            <div className="flex items-center justify-center h-16 text-xs text-muted-foreground">
              No tasks
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Add button */}
      <div className="p-2 border-t">
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-7 text-xs text-muted-foreground"
        >
          <Plus className="size-3 mr-1" />
          Add
        </Button>
      </div>
    </div>
  )
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const goToPrevWeek = () => setCurrentDate(addDays(currentDate, -7))
  const goToNextWeek = () => setCurrentDate(addDays(currentDate, 7))
  const goToToday = () => setCurrentDate(new Date())

  return (
    <div className="flex h-dvh flex-col">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-4">
          <h1 className="text-sm font-medium">Calendar</h1>

          {/* Navigation */}
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

          {/* Current week range */}
          <span className="text-sm text-muted-foreground">
            {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
          </span>
        </div>

        <Button size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          Add Task
        </Button>
      </header>

      {/* Calendar Grid */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 border-t">
          {weekDays.map((date) => (
            <DayColumn key={date.toISOString()} date={date} tasks={mockTasks} />
          ))}
        </div>
      </div>
    </div>
  )
}
