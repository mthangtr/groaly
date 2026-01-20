"use client"

import * as React from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  isEveningTime,
  getRandomQuote,
  getCompassionateMessage,
  getTomorrow,
  getNextWeekend,
  formatActionForLog,
  type TaskAction,
  type TaskActionLog,
  type EveningCheckResponse,
} from "@/lib/accountability/motivation-detector"
import type { Task } from "@/types/task"
import {
  CalendarIcon,
  CalendarDaysIcon,
  XCircleIcon,
  CheckCircleIcon,
  SparklesIcon,
} from "lucide-react"

type EveningCheckProps = {
  tasks: Task[]
  timezone?: string
  onComplete?: (response: EveningCheckResponse) => void
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => Promise<void>
  onTaskCancel?: (taskId: string) => Promise<void>
}

type Feeling = "stressed" | "tired" | "neutral" | "hopeful" | "accomplished"

const FEELINGS: { value: Feeling; label: string; emoji: string }[] = [
  { value: "stressed", label: "Stressed", emoji: "😰" },
  { value: "tired", label: "Tired", emoji: "😴" },
  { value: "neutral", label: "Neutral", emoji: "😐" },
  { value: "hopeful", label: "Hopeful", emoji: "🙂" },
  { value: "accomplished", label: "Accomplished", emoji: "🎉" },
]

export function EveningCheck({
  tasks,
  timezone,
  onComplete,
  onTaskUpdate,
  onTaskCancel,
}: EveningCheckProps) {
  const [open, setOpen] = React.useState(false)
  const [currentTaskIndex, setCurrentTaskIndex] = React.useState(0)
  const [actionLogs, setActionLogs] = React.useState<TaskActionLog[]>([])
  const [cancelReason, setCancelReason] = React.useState("")
  const [showCancelInput, setShowCancelInput] = React.useState(false)
  const [showReflection, setShowReflection] = React.useState(false)
  const [reflection, setReflection] = React.useState("")
  const [feeling, setFeeling] = React.useState<Feeling | undefined>()
  const [quote] = React.useState(() => getRandomQuote())

  const incompleteTasks = React.useMemo(
    () =>
      tasks.filter(
        (t) =>
          (t.status === "todo" || t.status === "in_progress") &&
          t.due_date &&
          new Date(t.due_date).toDateString() === new Date().toDateString()
      ),
    [tasks]
  )

  const currentTask = incompleteTasks[currentTaskIndex]
  const isLastTask = currentTaskIndex === incompleteTasks.length - 1

  React.useEffect(() => {
    if (incompleteTasks.length > 0 && isEveningTime(timezone)) {
      const hasShownToday = sessionStorage.getItem("evening-check-shown")
      if (!hasShownToday) {
        setOpen(true)
        sessionStorage.setItem("evening-check-shown", new Date().toDateString())
      }
    }
  }, [incompleteTasks.length, timezone])

  const handleAction = async (action: TaskAction) => {
    if (!currentTask) return

    if (action === "cancel" && !showCancelInput) {
      setShowCancelInput(true)
      return
    }

    const log = formatActionForLog(
      currentTask.id,
      currentTask.title,
      action,
      action === "cancel" ? cancelReason : undefined
    )

    setActionLogs((prev) => [...prev, log])

    try {
      if (action === "defer_tomorrow" && onTaskUpdate) {
        await onTaskUpdate(currentTask.id, {
          due_date: getTomorrow().toISOString().split("T")[0],
        })
      } else if (action === "defer_weekend" && onTaskUpdate) {
        await onTaskUpdate(currentTask.id, {
          due_date: getNextWeekend().toISOString().split("T")[0],
        })
      } else if (action === "cancel" && onTaskCancel) {
        await onTaskCancel(currentTask.id)
      } else if (action === "mark_done" && onTaskUpdate) {
        await onTaskUpdate(currentTask.id, { status: "done" })
      }

      toast.success(getCompassionateMessage(action))
    } catch {
      toast.error("Something went wrong. We'll try again later.")
    }

    setCancelReason("")
    setShowCancelInput(false)

    if (isLastTask) {
      setShowReflection(true)
    } else {
      setCurrentTaskIndex((prev) => prev + 1)
    }
  }

  const handleComplete = async () => {
    const response: EveningCheckResponse = {
      actions: actionLogs,
      reflection: reflection || undefined,
      feeling,
      timestamp: new Date().toISOString(),
    }

    onComplete?.(response)
    setOpen(false)
    setCurrentTaskIndex(0)
    setActionLogs([])
    setShowReflection(false)
    setReflection("")
    setFeeling(undefined)
  }

  const handleSkip = () => {
    setOpen(false)
  }

  if (incompleteTasks.length === 0) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SparklesIcon className="size-4 text-amber-500" />
            Evening Check-in
          </DialogTitle>
          <DialogDescription>
            {showReflection
              ? "How are you feeling about today?"
              : `Let's review your remaining tasks (${currentTaskIndex + 1}/${incompleteTasks.length})`}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 rounded-lg p-3 my-2">
          <p className="text-muted-foreground text-xs italic">
            &ldquo;{quote.en}&rdquo;
          </p>
          <p className="text-muted-foreground/70 text-[10px] mt-1">
            {quote.vi}
          </p>
        </div>

        {showReflection ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium mb-2 block">
                How are you feeling?
              </label>
              <div className="flex gap-2 flex-wrap">
                {FEELINGS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFeeling(f.value)}
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors",
                      feeling === f.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    <span>{f.emoji}</span>
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium mb-2 block">
                Any thoughts you want to capture? (optional)
              </label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Write anything on your mind..."
                className="bg-muted w-full rounded-md px-3 py-2 text-xs min-h-[80px] resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        ) : currentTask ? (
          <div className="space-y-4">
            <div className="border rounded-lg p-3">
              <h4 className="font-medium text-sm">{currentTask.title}</h4>
              {currentTask.description && (
                <p className="text-muted-foreground text-xs mt-1">
                  {currentTask.description}
                </p>
              )}
            </div>

            {showCancelInput && (
              <div>
                <label className="text-xs font-medium mb-1 block">
                  Quick note (optional)
                </label>
                <input
                  type="text"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Why are you letting this go?"
                  className="bg-muted w-full rounded-md px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction("defer_tomorrow")}
                className="flex items-center gap-1.5"
              >
                <CalendarIcon className="size-3" />
                Tomorrow
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction("defer_weekend")}
                className="flex items-center gap-1.5"
              >
                <CalendarDaysIcon className="size-3" />
                Weekend
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction("cancel")}
                className="flex items-center gap-1.5 text-destructive hover:text-destructive"
              >
                <XCircleIcon className="size-3" />
                {showCancelInput ? "Confirm Cancel" : "Cancel Task"}
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleAction("mark_done")}
                className="flex items-center gap-1.5"
              >
                <CheckCircleIcon className="size-3" />
                Done
              </Button>
            </div>
          </div>
        ) : null}

        <DialogFooter>
          {showReflection ? (
            <Button onClick={handleComplete}>Finish Check-in</Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              Skip for now
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
