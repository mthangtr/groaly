"use client"

import * as React from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Play,
  CheckCircle2,
  Circle,
  Clock,
  Loader2,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { mockTasks, type Task } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"

const statusIcons = {
  todo: Circle,
  in_progress: Loader2,
  done: CheckCircle2,
  cancelled: Circle,
}

const priorityColors = {
  urgent: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-zinc-400",
}

function TaskRow({ task }: { task: Task }) {
  const StatusIcon = statusIcons[task.status]

  return (
    <tr className="group border-b transition-colors hover:bg-muted/50">
      {/* Checkbox */}
      <td className="w-10 p-3">
        <Checkbox checked={task.status === "done"} />
      </td>

      {/* Priority */}
      <td className="w-10 p-3">
        <div
          className={cn("size-2.5 rounded-full", priorityColors[task.priority])}
          title={task.priority}
        />
      </td>

      {/* Title */}
      <td className="p-3">
        <div className="flex items-center gap-2">
          <StatusIcon
            className={cn(
              "size-4 shrink-0",
              task.status === "done" && "text-green-500",
              task.status === "in_progress" && "text-blue-500 animate-spin",
              task.status === "todo" && "text-muted-foreground"
            )}
          />
          <span
            className={cn(
              "font-medium",
              task.status === "done" && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </span>
        </div>
      </td>

      {/* Goal */}
      <td className="p-3">
        {task.goal && (
          <Badge variant="secondary" className="text-xs">
            {task.goal}
          </Badge>
        )}
      </td>

      {/* Status */}
      <td className="p-3">
        <Badge variant="outline" className="text-xs capitalize">
          {task.status.replace("_", " ")}
        </Badge>
      </td>

      {/* Time */}
      <td className="p-3">
        {task.estimated_time_minutes && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" />
            {task.estimated_time_minutes}m
          </span>
        )}
      </td>

      {/* Due date */}
      <td className="p-3 text-xs text-muted-foreground">
        {task.due_date
          ? formatDistanceToNow(new Date(task.due_date), { addSuffix: true })
          : "-"}
      </td>

      {/* Actions */}
      <td className="w-24 p-3">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {task.status !== "done" && (
            <Link href={`/focus/${task.id}`}>
              <Button size="icon" variant="ghost" className="size-7">
                <Play className="size-3.5" />
              </Button>
            </Link>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={(props) => (
                <Button {...props} size="icon" variant="ghost" className="size-7">
                  <MoreHorizontal className="size-3.5" />
                </Button>
              )}
            />
            <DropdownMenuContent align="end" sideOffset={4}>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  )
}

export default function TablePage() {
  const [search, setSearch] = React.useState("")

  const filteredTasks = mockTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.goal?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex h-dvh flex-col">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-sm font-medium">All Tasks</h1>
          <span className="text-xs text-muted-foreground">
            {mockTasks.length} tasks
          </span>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 text-sm"
          />
        </div>

        <Button variant="outline" size="sm" className="gap-1.5">
          <Filter className="size-3.5" />
          Filter
        </Button>

        <Button size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          Add Task
        </Button>
      </header>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-background border-b">
            <tr className="text-xs text-muted-foreground">
              <th className="w-10 p-3"></th>
              <th className="w-10 p-3 text-left">
                <Button variant="ghost" size="sm" className="h-6 -ml-2 text-xs gap-1">
                  Priority
                  <ArrowUpDown className="size-3" />
                </Button>
              </th>
              <th className="p-3 text-left">
                <Button variant="ghost" size="sm" className="h-6 -ml-2 text-xs gap-1">
                  Task
                  <ArrowUpDown className="size-3" />
                </Button>
              </th>
              <th className="p-3 text-left">Goal</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Due</th>
              <th className="w-24 p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </tbody>
        </table>

        {filteredTasks.length === 0 && (
          <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
            No tasks found
          </div>
        )}
      </div>
    </div>
  )
}
