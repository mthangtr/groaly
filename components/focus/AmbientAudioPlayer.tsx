"use client"

import * as React from "react"
import { Volume2, VolumeX, Music, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type SoundType = "none" | "white-noise" | "rain" | "coffee-shop" | "forest" | "ocean"

type SoundOption = {
  id: SoundType
  label: string
  icon: string
}

const SOUND_OPTIONS: SoundOption[] = [
  { id: "none", label: "None", icon: "🔇" },
  { id: "white-noise", label: "White Noise", icon: "📻" },
  { id: "rain", label: "Rain", icon: "🌧️" },
  { id: "coffee-shop", label: "Coffee Shop", icon: "☕" },
  { id: "forest", label: "Forest", icon: "🌲" },
  { id: "ocean", label: "Ocean Waves", icon: "🌊" },
]

const STORAGE_KEY = "focus-ambient-sound"
const VOLUME_STORAGE_KEY = "focus-ambient-volume"

function createNoiseGenerator(
  audioContext: AudioContext,
  type: SoundType
): AudioNode | null {
  if (type === "none") return null

  const bufferSize = 2 * audioContext.sampleRate
  const noiseBuffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate)

  for (let channel = 0; channel < 2; channel++) {
    const nowBuffering = noiseBuffer.getChannelData(channel)
    for (let i = 0; i < bufferSize; i++) {
      let noise = Math.random() * 2 - 1

      switch (type) {
        case "white-noise":
          break
        case "rain":
          noise *= 0.3
          if (Math.random() < 0.001) {
            noise *= 3
          }
          break
        case "coffee-shop":
          noise *= 0.2
          if (Math.random() < 0.0005) {
            noise *= 2
          }
          break
        case "forest":
          noise *= 0.15 * (1 + Math.sin(i / 5000) * 0.3)
          break
        case "ocean":
          noise *= 0.25 * (1 + Math.sin(i / 8000) * 0.5)
          break
      }

      nowBuffering[i] = noise
    }
  }

  const whiteNoise = audioContext.createBufferSource()
  whiteNoise.buffer = noiseBuffer
  whiteNoise.loop = true

  const filter = audioContext.createBiquadFilter()
  filter.type = "lowpass"

  switch (type) {
    case "white-noise":
      filter.frequency.value = 8000
      break
    case "rain":
      filter.frequency.value = 3000
      break
    case "coffee-shop":
      filter.frequency.value = 4000
      break
    case "forest":
      filter.frequency.value = 2000
      break
    case "ocean":
      filter.frequency.value = 1500
      break
  }

  whiteNoise.connect(filter)

  return filter
}

type AmbientAudioPlayerProps = {
  className?: string
}

export function AmbientAudioPlayer({ className }: AmbientAudioPlayerProps) {
  const [soundType, setSoundType] = React.useState<SoundType>("none")
  const [volume, setVolume] = React.useState(0.3)
  const [isMuted, setIsMuted] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const [isPlaying, setIsPlaying] = React.useState(false)

  const audioContextRef = React.useRef<AudioContext | null>(null)
  const gainNodeRef = React.useRef<GainNode | null>(null)
  const sourceNodeRef = React.useRef<AudioBufferSourceNode | null>(null)
  const filterNodeRef = React.useRef<BiquadFilterNode | null>(null)

  React.useEffect(() => {
    const savedSound = localStorage.getItem(STORAGE_KEY) as SoundType | null
    const savedVolume = localStorage.getItem(VOLUME_STORAGE_KEY)

    if (savedSound && SOUND_OPTIONS.some((s) => s.id === savedSound)) {
      setSoundType(savedSound)
    }
    if (savedVolume) {
      setVolume(parseFloat(savedVolume))
    }
  }, [])

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, soundType)
  }, [soundType])

  React.useEffect(() => {
    localStorage.setItem(VOLUME_STORAGE_KEY, volume.toString())
  }, [volume])

  const startAudio = React.useCallback(async () => {
    if (soundType === "none") return

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext()
      }

      const ctx = audioContextRef.current

      if (ctx.state === "suspended") {
        await ctx.resume()
      }

      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop()
        sourceNodeRef.current.disconnect()
      }

      if (!gainNodeRef.current) {
        gainNodeRef.current = ctx.createGain()
        gainNodeRef.current.connect(ctx.destination)
      }

      const filterNode = createNoiseGenerator(ctx, soundType)
      if (filterNode) {
        filterNode.connect(gainNodeRef.current)
        filterNodeRef.current = filterNode as BiquadFilterNode

        const bufferSource = (filterNode as BiquadFilterNode).numberOfInputs
          ? null
          : (filterNode as unknown as AudioBufferSourceNode)

        if (!bufferSource) {
          const bufferSize = 2 * ctx.sampleRate
          const noiseBuffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate)

          for (let channel = 0; channel < 2; channel++) {
            const nowBuffering = noiseBuffer.getChannelData(channel)
            for (let i = 0; i < bufferSize; i++) {
              let noise = Math.random() * 2 - 1

              switch (soundType) {
                case "rain":
                  noise *= 0.3
                  if (Math.random() < 0.001) noise *= 3
                  break
                case "coffee-shop":
                  noise *= 0.2
                  if (Math.random() < 0.0005) noise *= 2
                  break
                case "forest":
                  noise *= 0.15 * (1 + Math.sin(i / 5000) * 0.3)
                  break
                case "ocean":
                  noise *= 0.25 * (1 + Math.sin(i / 8000) * 0.5)
                  break
                default:
                  break
              }

              nowBuffering[i] = noise
            }
          }

          const source = ctx.createBufferSource()
          source.buffer = noiseBuffer
          source.loop = true
          source.connect(filterNode)
          source.start()
          sourceNodeRef.current = source
        }

        setIsPlaying(true)
      }
    } catch (error) {
      console.error("Failed to start audio:", error)
    }
  }, [soundType])

  const stopAudio = React.useCallback(() => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop()
        sourceNodeRef.current.disconnect()
      } catch {
        // Ignore errors
      }
      sourceNodeRef.current = null
    }
    setIsPlaying(false)
  }, [])

  React.useEffect(() => {
    if (soundType !== "none" && !isMuted) {
      startAudio()
    } else {
      stopAudio()
    }

    return () => {
      stopAudio()
    }
  }, [soundType, isMuted, startAudio, stopAudio])

  React.useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  React.useEffect(() => {
    return () => {
      stopAudio()
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
    }
  }, [stopAudio])

  function handleSoundChange(newSound: SoundType) {
    stopAudio()
    setSoundType(newSound)
    setIsOpen(false)
  }

  function toggleMute() {
    setIsMuted(!isMuted)
  }

  const selectedSound = SOUND_OPTIONS.find((s) => s.id === soundType)

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-zinc-400 hover:text-white"
          onClick={toggleMute}
        >
          {isMuted || soundType === "none" ? (
            <VolumeX className="size-4" />
          ) : (
            <Volume2 className="size-4" />
          )}
          <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-zinc-400 hover:text-white gap-1"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Music className="size-3.5" />
          <span className="text-xs">{selectedSound?.label}</span>
          <ChevronDown
            className={cn(
              "size-3 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </Button>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-64 rounded-lg border border-zinc-800 bg-zinc-900 p-3 shadow-xl">
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-zinc-400">
                  Ambient Sound
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {SOUND_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleSoundChange(option.id)}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors",
                        soundType === option.id
                          ? "bg-zinc-700 text-white"
                          : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      )}
                    >
                      <span>{option.icon}</span>
                      <span className="text-xs">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {soundType !== "none" && (
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-zinc-400">Volume</p>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1.5 rounded-full bg-zinc-700 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500">
                    <span>0%</span>
                    <span>{Math.round(volume * 100)}%</span>
                  </div>
                </div>
              )}

              {isPlaying && (
                <div className="flex items-center gap-1.5 text-xs text-green-400">
                  <div className="size-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span>Playing</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export type { AmbientAudioPlayerProps, SoundType }
