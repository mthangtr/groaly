"use client"

import * as React from "react"
import { Maximize2, Minimize2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type FullscreenToggleProps = {
  targetRef?: React.RefObject<HTMLElement | null>
  className?: string
}

export function FullscreenToggle({
  targetRef,
  className,
}: FullscreenToggleProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  React.useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        const target = targetRef?.current ?? document.documentElement
        await target.requestFullscreen()
      }
    } catch (error) {
      console.error("Fullscreen error:", error)
    }
  }

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isFullscreen])

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("size-8 text-zinc-400 hover:text-white", className)}
      onClick={toggleFullscreen}
    >
      {isFullscreen ? (
        <Minimize2 className="size-4" />
      ) : (
        <Maximize2 className="size-4" />
      )}
      <span className="sr-only">
        {isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      </span>
    </Button>
  )
}

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  React.useEffect(() => {
    function handleChange() {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleChange)
    }
  }, [])

  const enterFullscreen = React.useCallback(
    async (element?: HTMLElement | null) => {
      try {
        const target = element ?? document.documentElement
        await target.requestFullscreen()
      } catch (error) {
        console.error("Failed to enter fullscreen:", error)
      }
    },
    []
  )

  const exitFullscreen = React.useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      }
    } catch (error) {
      console.error("Failed to exit fullscreen:", error)
    }
  }, [])

  const toggleFullscreen = React.useCallback(
    async (element?: HTMLElement | null) => {
      if (isFullscreen) {
        await exitFullscreen()
      } else {
        await enterFullscreen(element)
      }
    },
    [isFullscreen, enterFullscreen, exitFullscreen]
  )

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  }
}

export type { FullscreenToggleProps }
