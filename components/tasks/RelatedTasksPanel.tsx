"use client"

import * as React from "react"
import { Network, RefreshCw, Info } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { Task } from "@/types/task"
import { cn } from "@/lib/utils"

type RelatedTasksResponse = {
  related_tasks: Task[]
  reasoning: string
}

type RelatedTasksPanelProps = {
  taskId: string
  onTaskClick?: (task: Task) => void
  className?: string
}

const priorityColors: Record<number, string> = {
  0: "bg-red-500",
  1: "bg-orange-500",
  2: "bg-yellow-500",
  3: "bg-zinc-400",
}

const statusLabels: Record<string, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
  cancelled: "Cancelled",
}

export function RelatedTasksPanel({
  taskId,
  onTaskClick,
  className,
}: RelatedTasksPanelProps) {
  const [data, setData] = React.useState<RelatedTasksResponse | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const fetchRelatedTasks = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/tasks/related/${taskId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch related tasks")
      }
      const result: RelatedTasksResponse = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [taskId])

  React.useEffect(() => {
    fetchRelatedTasks()
  }, [fetchRelatedTasks])

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Network className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Related Tasks</h3>
          {data && data.reasoning && (
            <Tooltip>
              <TooltipTrigger className="text-muted-foreground hover:text-foreground transition-colors">
                <Info className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm whitespace-pre-wrap">
                <p className="text-xs">{data.reasoning}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={fetchRelatedTasks}
          disabled={loading}
          className="h-7 px-2"
        >
          <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
        </Button>
      </div>

      {loading && (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
          {error}
        </div>
      )}

      {!loading && !error && data && data.related_tasks.length === 0 && (
        <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 p-4 text-center text-xs text-muted-foreground">
          No related tasks found
        </div>
      )}

      {!loading && !error && data && data.related_tasks.length > 0 && (
        <div className="space-y-2">
          {data.related_tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => onTaskClick?.(task)}
              className="group relative w-full rounded-lg border bg-card p-3 text-left transition-all hover:shadow-md hover:border-foreground/20"
            >
              <div className="flex items-start gap-2">
                <div
                  className={cn(
                    "size-2 rounded-full shrink-0 mt-1.5",
                    priorityColors[task.priority ?? 0]
                  )}
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-medium leading-tight line-clamp-2">
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {task.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                      {statusLabels[task.status ?? "todo"]}
                    </Badge>
                    {task.tags && task.tags.length > 0 && (
                      <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                        {task.tags[0]}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
