"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Volume2,
  Maximize2,
  Target,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { mockTasks, philosophicalQuotes } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const POMODORO_DURATION = 25 * 60 // 25 minutes in seconds
const SHORT_BREAK = 5 * 60 // 5 minutes
const LONG_BREAK = 15 * 60 // 15 minutes

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export default function FocusModePage() {
  const params = useParams()
  const taskId = params.taskId as string
  const task = mockTasks.find((t) => t.id === taskId)

  const [isRunning, setIsRunning] = React.useState(false)
  const [timeRemaining, setTimeRemaining] = React.useState(POMODORO_DURATION)
  const [pomodorosCompleted, setPomodorosCompleted] = React.useState(0)
  const [isBreak, setIsBreak] = React.useState(false)

  const progress = ((POMODORO_DURATION - timeRemaining) / POMODORO_DURATION) * 100
  const quote = philosophicalQuotes[pomodorosCompleted % philosophicalQuotes.length]

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)
    } else if (timeRemaining === 0) {
      // Timer completed
      if (!isBreak) {
        setPomodorosCompleted((prev) => prev + 1)
        const breakDuration =
          (pomodorosCompleted + 1) % 4 === 0 ? LONG_BREAK : SHORT_BREAK
        setTimeRemaining(breakDuration)
        setIsBreak(true)
      } else {
        setTimeRemaining(POMODORO_DURATION)
        setIsBreak(false)
      }
      setIsRunning(false)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeRemaining, isBreak, pomodorosCompleted])

  const toggleTimer = () => setIsRunning(!isRunning)
  const resetTimer = () => {
    setIsRunning(false)
    setTimeRemaining(isBreak ? SHORT_BREAK : POMODORO_DURATION)
  }

  if (!task) {
    return (
      <div className="flex h-dvh items-center justify-center bg-zinc-950 text-white">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Task not found</p>
          <Link href="/kanban">
            <Button variant="outline">Go back</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-col bg-zinc-950 text-white">
      {/* Minimal Header */}
      <header className="flex h-12 shrink-0 items-center justify-between px-4">
        <Link
          href="/kanban"
          className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="size-4" />
          <span className="text-sm">Exit Focus</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-zinc-400 hover:text-white"
          >
            <Volume2 className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-zinc-400 hover:text-white"
          >
            <Maximize2 className="size-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <div className="max-w-lg w-full text-center space-y-12">
          {/* Task Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div
                className={cn(
                  "size-2.5 rounded-full",
                  task.priority === "urgent" && "bg-red-500",
                  task.priority === "high" && "bg-orange-500",
                  task.priority === "medium" && "bg-yellow-500",
                  task.priority === "low" && "bg-zinc-400"
                )}
              />
              {task.goal && (
                <Badge
                  variant="secondary"
                  className="bg-zinc-800 text-zinc-300 text-xs"
                >
                  {task.goal}
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {task.title}
            </h1>
            {task.description && (
              <p className="text-zinc-400">{task.description}</p>
            )}
          </div>

          {/* Timer */}
          <div className="space-y-6">
            {/* Time Display */}
            <div className="relative">
              <div
                className={cn(
                  "text-8xl font-mono font-bold tracking-tighter tabular-nums transition-colors",
                  isBreak ? "text-green-400" : "text-white"
                )}
              >
                {formatTime(timeRemaining)}
              </div>
              <p className="text-sm text-zinc-500 mt-2">
                {isBreak ? "Break Time" : "Focus Session"}
              </p>
            </div>

            {/* Progress */}
            <Progress
              value={isBreak ? 0 : progress}
              className="h-1 bg-zinc-800"
            />

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="size-12 rounded-full text-zinc-400 hover:text-white"
                onClick={resetTimer}
              >
                <RotateCcw className="size-5" />
              </Button>

              <Button
                size="icon"
                className={cn(
                  "size-16 rounded-full transition-all",
                  isRunning
                    ? "bg-zinc-700 hover:bg-zinc-600"
                    : "bg-white text-zinc-950 hover:bg-zinc-200"
                )}
                onClick={toggleTimer}
              >
                {isRunning ? (
                  <Pause className="size-6" />
                ) : (
                  <Play className="size-6 ml-0.5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="size-12 rounded-full text-zinc-400 hover:text-white"
              >
                <CheckCircle2 className="size-5" />
              </Button>
            </div>

            {/* Pomodoro count */}
            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "size-3 rounded-full transition-colors",
                    i < pomodorosCompleted % 4
                      ? "bg-green-500"
                      : "bg-zinc-800"
                  )}
                />
              ))}
              <span className="ml-2 text-xs text-zinc-500">
                {pomodorosCompleted} pomodoros today
              </span>
            </div>
          </div>

          {/* Philosophical Quote */}
          <div className="space-y-2 pt-8 border-t border-zinc-800">
            <Target className="mx-auto size-4 text-zinc-600" />
            <blockquote className="text-sm italic text-zinc-500">
              &ldquo;{quote.vi}&rdquo;
            </blockquote>
            <p className="text-xs text-zinc-600">{quote.en}</p>
          </div>
        </div>
      </div>

      {/* Footer - Next Task Suggestion */}
      <footer className="flex h-16 shrink-0 items-center justify-center border-t border-zinc-800 px-4">
        <div className="flex items-center gap-3 text-sm text-zinc-500">
          <span>Next up:</span>
          <span className="text-zinc-300">Complete Java Spring Boot module</span>
          <ChevronRight className="size-4" />
        </div>
      </footer>
    </div>
  )
}
