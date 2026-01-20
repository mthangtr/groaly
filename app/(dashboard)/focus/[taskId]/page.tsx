"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  X,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  ChevronRight,
  Target,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { mockTasks, philosophicalQuotes } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  PipTimer,
  FullscreenToggle,
  AmbientAudioPlayer,
  FocusCelebration,
  type TimerPhase,
} from "@/components/focus"

const POMODORO_DURATION = 25 * 60
const SHORT_BREAK = 5 * 60
const LONG_BREAK = 15 * 60
const POMODOROS_BEFORE_LONG_BREAK = 4

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

function getPhaseLabel(phase: TimerPhase): string {
  switch (phase) {
    case "focus":
      return "Focus Session"
    case "short-break":
      return "Short Break"
    case "long-break":
      return "Long Break"
  }
}

function getTotalDuration(phase: TimerPhase): number {
  switch (phase) {
    case "focus":
      return POMODORO_DURATION
    case "short-break":
      return SHORT_BREAK
    case "long-break":
      return LONG_BREAK
  }
}

function requestNotificationPermission() {
  if (typeof window !== "undefined" && "Notification" in window) {
    if (Notification.permission === "default") {
      Notification.requestPermission()
    }
  }
}

function sendNotification(title: string, body: string) {
  if (typeof window !== "undefined" && "Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification(title, { body, icon: "/favicon.ico" })
    }
  }
}

export default function FocusModePage() {
  const params = useParams()
  const taskId = params.taskId as string
  const task = mockTasks.find((t) => t.id === taskId)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const [isRunning, setIsRunning] = React.useState(false)
  const [phase, setPhase] = React.useState<TimerPhase>("focus")
  const [timeRemaining, setTimeRemaining] = React.useState(POMODORO_DURATION)
  const [pomodorosCompleted, setPomodorosCompleted] = React.useState(0)
  const [breaksTaken, setBreaksTaken] = React.useState(0)
  const [showCelebration, setShowCelebration] = React.useState(false)

  const totalDuration = getTotalDuration(phase)
  const progress = ((totalDuration - timeRemaining) / totalDuration) * 100
  const circumference = 2 * Math.PI * 120
  const strokeDashoffset = circumference - (progress / 100) * circumference
  const quote = philosophicalQuotes[pomodorosCompleted % philosophicalQuotes.length]

  React.useEffect(() => {
    requestNotificationPermission()
  }, [])

  const handlePhaseComplete = React.useCallback(() => {
    if (phase === "focus") {
      const newCount = pomodorosCompleted + 1
      setPomodorosCompleted(newCount)
      sendNotification("Focus Session Complete!", "Time for a break.")

      if (newCount % POMODOROS_BEFORE_LONG_BREAK === 0) {
        setPhase("long-break")
        setTimeRemaining(LONG_BREAK)
        setShowCelebration(true)
      } else {
        setPhase("short-break")
        setTimeRemaining(SHORT_BREAK)
      }
    } else {
      setBreaksTaken((prev) => prev + 1)
      sendNotification("Break Over!", "Ready to focus again?")
      setPhase("focus")
      setTimeRemaining(POMODORO_DURATION)
    }
  }, [phase, pomodorosCompleted])

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)
    } else if (timeRemaining === 0 && isRunning) {
      setIsRunning(false)
      handlePhaseComplete()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeRemaining, handlePhaseComplete])

  const toggleTimer = () => setIsRunning(!isRunning)

  const resetTimer = () => {
    setIsRunning(false)
    setTimeRemaining(totalDuration)
  }

  const skipPhase = () => {
    setIsRunning(false)
    handlePhaseComplete()
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
    <div
      ref={containerRef}
      className="flex h-dvh flex-col bg-zinc-950 text-white"
    >
      <header className="flex h-12 shrink-0 items-center justify-between px-4">
        <Link
          href="/kanban"
          className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="size-4" />
          <span className="text-sm">Exit Focus</span>
        </Link>

        <div className="flex items-center gap-2">
          <AmbientAudioPlayer />
          <PipTimer
            timeRemaining={timeRemaining}
            isRunning={isRunning}
            phase={phase}
          />
          <FullscreenToggle targetRef={containerRef} />
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <div className="max-w-lg w-full text-center space-y-12">
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

          <div className="space-y-6">
            <div className="relative flex items-center justify-center">
              <svg
                className="transform -rotate-90"
                width="280"
                height="280"
                viewBox="0 0 280 280"
              >
                <circle
                  cx="140"
                  cy="140"
                  r="120"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-zinc-800"
                />
                <circle
                  cx="140"
                  cy="140"
                  r="120"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className={cn(
                    "transition-all duration-1000",
                    phase === "focus" ? "text-white" : "text-green-400"
                  )}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className={cn(
                    "text-7xl font-mono font-bold tracking-tighter tabular-nums",
                    phase === "focus" ? "text-white" : "text-green-400"
                  )}
                >
                  {formatTime(timeRemaining)}
                </span>
                <span className="text-sm text-zinc-500 mt-2">
                  {getPhaseLabel(phase)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="size-12 rounded-full text-zinc-400 hover:text-white"
                onClick={resetTimer}
              >
                <RotateCcw className="size-5" />
                <span className="sr-only">Reset timer</span>
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
                <span className="sr-only">{isRunning ? "Pause" : "Start"}</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="size-12 rounded-full text-zinc-400 hover:text-white"
                onClick={skipPhase}
              >
                <SkipForward className="size-5" />
                <span className="sr-only">Skip to next phase</span>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: POMODOROS_BEFORE_LONG_BREAK }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "size-3 rounded-full transition-colors",
                    i < pomodorosCompleted % POMODOROS_BEFORE_LONG_BREAK
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

          <div className="space-y-2 pt-8 border-t border-zinc-800">
            <Target className="mx-auto size-4 text-zinc-600" />
            <blockquote className="text-sm italic text-zinc-500">
              &ldquo;{quote.vi}&rdquo;
            </blockquote>
            <p className="text-xs text-zinc-600">{quote.en}</p>
          </div>
        </div>
      </div>

      <footer className="flex h-16 shrink-0 items-center justify-center border-t border-zinc-800 px-4">
        <div className="flex items-center gap-3 text-sm text-zinc-500">
          <span>Next up:</span>
          <span className="text-zinc-300">Complete Java Spring Boot module</span>
          <ChevronRight className="size-4" />
        </div>
      </footer>

      <FocusCelebration
        isOpen={showCelebration}
        pomodorosCompleted={pomodorosCompleted}
        totalFocusMinutes={pomodorosCompleted * 25}
        breaksTaken={breaksTaken}
        isPersonalBest={pomodorosCompleted >= 4 && pomodorosCompleted % 4 === 0}
        onClose={() => setShowCelebration(false)}
        onMarkDone={() => {
          setShowCelebration(false)
        }}
        onContinue={() => {
          setShowCelebration(false)
          setIsRunning(true)
        }}
        onReturn={() => {
          setShowCelebration(false)
        }}
      />
    </div>
  )
}
