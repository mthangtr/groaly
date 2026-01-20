"use client"

import * as React from "react"
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const POMODORO_DURATION = 25 * 60
const SHORT_BREAK = 5 * 60
const LONG_BREAK = 15 * 60
const POMODOROS_BEFORE_LONG_BREAK = 4

type TimerPhase = "focus" | "short-break" | "long-break"

type PomodoroTimerProps = {
  focusDuration?: number
  shortBreakDuration?: number
  longBreakDuration?: number
  onPhaseComplete?: (phase: TimerPhase, pomodorosCompleted: number) => void
  onTick?: (timeRemaining: number, phase: TimerPhase) => void
  className?: string
}

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

export function PomodoroTimer({
  focusDuration = POMODORO_DURATION,
  shortBreakDuration = SHORT_BREAK,
  longBreakDuration = LONG_BREAK,
  onPhaseComplete,
  onTick,
  className,
}: PomodoroTimerProps) {
  const [isRunning, setIsRunning] = React.useState(false)
  const [phase, setPhase] = React.useState<TimerPhase>("focus")
  const [timeRemaining, setTimeRemaining] = React.useState(focusDuration)
  const [pomodorosCompleted, setPomodorosCompleted] = React.useState(0)

  const totalDuration = React.useMemo(() => {
    switch (phase) {
      case "focus":
        return focusDuration
      case "short-break":
        return shortBreakDuration
      case "long-break":
        return longBreakDuration
    }
  }, [phase, focusDuration, shortBreakDuration, longBreakDuration])

  const progress = ((totalDuration - timeRemaining) / totalDuration) * 100
  const circumference = 2 * Math.PI * 120
  const strokeDashoffset = circumference - (progress / 100) * circumference

  React.useEffect(() => {
    requestNotificationPermission()
  }, [])

  const handlePhaseComplete = React.useCallback(() => {
    if (phase === "focus") {
      const newCount = pomodorosCompleted + 1
      setPomodorosCompleted(newCount)
      onPhaseComplete?.("focus", newCount)

      sendNotification("Focus Session Complete!", "Time for a break.")

      if (newCount % POMODOROS_BEFORE_LONG_BREAK === 0) {
        setPhase("long-break")
        setTimeRemaining(longBreakDuration)
      } else {
        setPhase("short-break")
        setTimeRemaining(shortBreakDuration)
      }
    } else {
      onPhaseComplete?.(phase, pomodorosCompleted)
      sendNotification("Break Over!", "Ready to focus again?")
      setPhase("focus")
      setTimeRemaining(focusDuration)
    }
  }, [phase, pomodorosCompleted, onPhaseComplete, focusDuration, shortBreakDuration, longBreakDuration])

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1
          onTick?.(newTime, phase)
          return newTime
        })
      }, 1000)
    } else if (timeRemaining === 0 && isRunning) {
      setIsRunning(false)
      handlePhaseComplete()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeRemaining, phase, onTick, handlePhaseComplete])

  function toggleTimer() {
    setIsRunning(!isRunning)
  }

  function resetTimer() {
    setIsRunning(false)
    setTimeRemaining(totalDuration)
  }

  function skipPhase() {
    setIsRunning(false)
    handlePhaseComplete()
  }

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <div className="relative">
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
              "text-6xl font-mono font-bold tracking-tighter tabular-nums",
              phase === "focus" ? "text-white" : "text-green-400"
            )}
          >
            {formatTime(timeRemaining)}
          </span>
          <span className="text-sm text-zinc-500 mt-1">
            {getPhaseLabel(phase)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
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
          <span className="sr-only">Skip phase</span>
        </Button>
      </div>

      <div className="flex items-center gap-2">
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
          {pomodorosCompleted} pomodoros completed
        </span>
      </div>
    </div>
  )
}

export type { TimerPhase, PomodoroTimerProps }
