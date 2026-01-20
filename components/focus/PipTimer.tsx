"use client"

import * as React from "react"
import { PictureInPicture2, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type PipTimerProps = {
  timeRemaining: number
  isRunning: boolean
  phase: "focus" | "short-break" | "long-break"
  className?: string
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export function PipTimer({
  timeRemaining,
  isRunning,
  phase,
  className,
}: PipTimerProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [isPipActive, setIsPipActive] = React.useState(false)
  const [isPipSupported, setIsPipSupported] = React.useState(false)
  const animationFrameRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    setIsPipSupported(
      typeof document !== "undefined" &&
        "pictureInPictureEnabled" in document &&
        document.pictureInPictureEnabled
    )
  }, [])

  const drawTimerCanvas = React.useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - 20

    ctx.fillStyle = "#09090b"
    ctx.fillRect(0, 0, width, height)

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.strokeStyle = "#27272a"
    ctx.lineWidth = 8
    ctx.stroke()

    const totalDuration =
      phase === "focus"
        ? 25 * 60
        : phase === "short-break"
          ? 5 * 60
          : 15 * 60
    const progress = (totalDuration - timeRemaining) / totalDuration
    const startAngle = -Math.PI / 2
    const endAngle = startAngle + 2 * Math.PI * progress

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.strokeStyle = phase === "focus" ? "#ffffff" : "#4ade80"
    ctx.lineWidth = 8
    ctx.lineCap = "round"
    ctx.stroke()

    ctx.font = "bold 48px monospace"
    ctx.fillStyle = phase === "focus" ? "#ffffff" : "#4ade80"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(formatTime(timeRemaining), centerX, centerY)

    const phaseLabel =
      phase === "focus"
        ? "Focus"
        : phase === "short-break"
          ? "Break"
          : "Long Break"
    ctx.font = "14px sans-serif"
    ctx.fillStyle = "#71717a"
    ctx.fillText(phaseLabel, centerX, centerY + 35)

    if (isRunning) {
      ctx.fillStyle = "#4ade80"
    } else {
      ctx.fillStyle = "#ef4444"
    }
    ctx.beginPath()
    ctx.arc(centerX, centerY + 60, 6, 0, 2 * Math.PI)
    ctx.fill()
  }, [timeRemaining, isRunning, phase])

  React.useEffect(() => {
    if (!isPipActive) return

    const animate = () => {
      drawTimerCanvas()
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isPipActive, drawTimerCanvas])

  async function enterPip() {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video || !isPipSupported) return

    try {
      drawTimerCanvas()

      const stream = canvas.captureStream(30)
      video.srcObject = stream
      await video.play()

      await video.requestPictureInPicture()
      setIsPipActive(true)
    } catch (error) {
      console.error("Failed to enter PiP:", error)
    }
  }

  async function exitPip() {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
      }
      setIsPipActive(false)
    } catch (error) {
      console.error("Failed to exit PiP:", error)
    }
  }

  React.useEffect(() => {
    function handlePipExit() {
      setIsPipActive(false)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }

    const video = videoRef.current
    video?.addEventListener("leavepictureinpicture", handlePipExit)

    return () => {
      video?.removeEventListener("leavepictureinpicture", handlePipExit)
    }
  }, [])

  React.useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  if (!isPipSupported) {
    return null
  }

  return (
    <div className={cn("relative", className)}>
      <canvas
        ref={canvasRef}
        width={300}
        height={200}
        className="hidden"
      />
      <video
        ref={videoRef}
        className="hidden"
        muted
        playsInline
      />

      <Button
        variant="ghost"
        size="icon"
        className="size-8 text-zinc-400 hover:text-white"
        onClick={isPipActive ? exitPip : enterPip}
      >
        {isPipActive ? (
          <X className="size-4" />
        ) : (
          <PictureInPicture2 className="size-4" />
        )}
        <span className="sr-only">
          {isPipActive ? "Exit Picture-in-Picture" : "Enter Picture-in-Picture"}
        </span>
      </Button>
    </div>
  )
}

export type { PipTimerProps }
