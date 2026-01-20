"use client"

import * as React from "react"
import confetti from "canvas-confetti"
import { Trophy, CheckCircle2, Play, ArrowLeft, Clock, Coffee, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type FocusCelebrationProps = {
  isOpen: boolean
  pomodorosCompleted: number
  totalFocusMinutes: number
  breaksTaken: number
  isPersonalBest?: boolean
  onClose: () => void
  onMarkDone?: () => void
  onContinue?: () => void
  onReturn?: () => void
  className?: string
}

function playSuccessSound() {
  if (typeof window === "undefined") return

  try {
    const audioContext = new AudioContext()

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.type = "sine"
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime)
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1)
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2)

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.5)
  } catch {
    // Ignore audio errors
  }
}

function triggerConfetti() {
  const duration = 3000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  const interval = window.setInterval(function () {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    })
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    })
  }, 250)
}

export function FocusCelebration({
  isOpen,
  pomodorosCompleted,
  totalFocusMinutes,
  breaksTaken,
  isPersonalBest = false,
  onClose,
  onMarkDone,
  onContinue,
  onReturn,
  className,
}: FocusCelebrationProps) {
  const hasTriggered = React.useRef(false)

  React.useEffect(() => {
    if (isOpen && !hasTriggered.current) {
      hasTriggered.current = true
      triggerConfetti()
      playSuccessSound()
    }

    if (!isOpen) {
      hasTriggered.current = false
    }
  }, [isOpen])

  if (!isOpen) return null

  const stats = [
    {
      icon: Clock,
      label: "Focus Time",
      value: `${totalFocusMinutes} min`,
    },
    {
      icon: Trophy,
      label: "Pomodoros",
      value: pomodorosCompleted.toString(),
    },
    {
      icon: Coffee,
      label: "Breaks",
      value: breaksTaken.toString(),
    },
  ]

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm",
        className
      )}
    >
      <div className="relative max-w-md w-full mx-4 rounded-2xl bg-zinc-900 border border-zinc-800 p-8 text-center">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <div className="relative">
            <div className="size-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Trophy className="size-12 text-white" />
            </div>
            {isPersonalBest && (
              <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-green-500 text-[10px] font-bold text-white flex items-center gap-1">
                <Sparkles className="size-3" />
                NEW BEST
              </div>
            )}
          </div>
        </div>

        <div className="pt-14 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">
              {pomodorosCompleted >= 4
                ? "Amazing Focus Session!"
                : "Great Work!"}
            </h2>
            <p className="text-zinc-400">
              {pomodorosCompleted >= 4
                ? "You've completed a full Pomodoro cycle!"
                : "You're making excellent progress!"}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg bg-zinc-800/50 p-3 space-y-1"
              >
                <stat.icon className="size-5 mx-auto text-zinc-400" />
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {onMarkDone && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-green-400 mb-3">
                Ready to mark your task as done?
              </p>
              <Button
                onClick={onMarkDone}
                className="w-full bg-green-600 hover:bg-green-500 text-white"
              >
                <CheckCircle2 className="size-4 mr-2" />
                Mark Task as Done
              </Button>
            </div>
          )}

          <div className="flex gap-3">
            {onContinue && (
              <Button
                onClick={onContinue}
                variant="outline"
                className="flex-1"
              >
                <Play className="size-4 mr-2" />
                Continue
              </Button>
            )}
            {onReturn && (
              <Button onClick={onReturn} variant="ghost" className="flex-1">
                <ArrowLeft className="size-4 mr-2" />
                Return
              </Button>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}

export { triggerConfetti, playSuccessSound }
export type { FocusCelebrationProps }
