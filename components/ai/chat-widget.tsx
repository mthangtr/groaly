"use client"

import * as React from "react"
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Loader2,
  ChevronDown,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const quickActions = [
  { label: "/plan-week", description: "Plan your week" },
  { label: "/whats-next", description: "Get next task suggestion" },
  { label: "/optimize", description: "Optimize today's schedule" },
  { label: "/balance", description: "Check goal balance" },
]

const STORAGE_KEY = "dumtasking-chat-history"

// Load messages from localStorage
function loadMessages(): Message[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed.map((msg: Message) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }))
    }
  } catch {
    console.error("Failed to load chat history")
  }
  return []
}

// Save messages to localStorage
function saveMessages(messages: Message[]) {
  if (typeof window === "undefined") return
  try {
    // Only save last 50 messages to avoid storage limits
    const toSave = messages.slice(-50)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  } catch {
    console.error("Failed to save chat history")
  }
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isMinimized, setIsMinimized] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [streamingContent, setStreamingContent] = React.useState("")
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const abortControllerRef = React.useRef<AbortController | null>(null)

  // Load messages on mount
  React.useEffect(() => {
    const loaded = loadMessages()
    if (loaded.length > 0) {
      setMessages(loaded)
    } else {
      // Add initial greeting if no history
      setMessages([
        {
          id: "init",
          role: "assistant",
          content:
            "Hey! I'm your AI assistant. I can help you plan tasks, optimize your schedule, and keep your goals balanced. What would you like to do?",
          timestamp: new Date(),
        },
      ])
    }
  }, [])

  // Save messages when they change
  React.useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages)
    }
  }, [messages])

  // Auto scroll to bottom
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, streamingContent])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setStreamingContent("")

    // Create abort controller for this request
    abortControllerRef.current = new AbortController()

    try {
      // Build messages for API in correct format
      const apiMessages = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          contextMode: "default",
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("No response body")
      }

      const decoder = new TextDecoder()
      let accumulated = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        accumulated += chunk
        setStreamingContent(accumulated)
      }

      // Add completed assistant message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: accumulated || "I couldn't generate a response. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setStreamingContent("")
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        // Request was aborted, don't show error
        return
      }

      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Sorry, I encountered an error. Please check your connection and try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setStreamingContent("")
      abortControllerRef.current = null
    }
  }

  const handleQuickAction = (action: string) => {
    setInput(action)
  }

  const handleClearHistory = () => {
    setMessages([
      {
        id: "init",
        role: "assistant",
        content: "Chat history cleared. How can I help you today?",
        timestamp: new Date(),
      },
    ])
    localStorage.removeItem(STORAGE_KEY)
  }

  // Cancel streaming on close
  const handleClose = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        size="icon"
        className="fixed bottom-6 right-6 size-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
      >
        <MessageCircle className="size-6" />
      </Button>
    )
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 w-96 rounded-2xl border bg-background shadow-2xl transition-all z-50 overflow-hidden",
        isMinimized ? "h-14" : "h-[500px]"
      )}
    >
      {/* Header */}
      <div
        className="flex h-14 items-center justify-between px-4 border-b bg-muted/30 cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 dark:from-zinc-100 dark:to-zinc-200">
            <Sparkles className="size-4 text-zinc-100 dark:text-zinc-900" />
          </div>
          <div>
            <p className="text-sm font-medium">AI Assistant</p>
            <p className="text-[10px] text-muted-foreground">
              {isLoading ? "Thinking..." : "Always here to help"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={(e) => {
              e.stopPropagation()
              setIsMinimized(!isMinimized)
            }}
          >
            <ChevronDown
              className={cn(
                "size-4 transition-transform",
                isMinimized && "rotate-180"
              )}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={(e) => {
              e.stopPropagation()
              handleClose()
            }}
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <ScrollArea className="flex-1 h-[352px]" ref={scrollRef}>
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap",
                      message.role === "user"
                        ? "bg-foreground text-background rounded-br-md"
                        : "bg-muted rounded-bl-md"
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {/* Streaming message */}
              {streamingContent && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] bg-muted rounded-2xl rounded-bl-md px-4 py-2.5 text-sm whitespace-pre-wrap">
                    {streamingContent}
                    <span className="inline-block w-1.5 h-4 ml-1 bg-foreground/50 animate-pulse" />
                  </div>
                </div>
              )}
              {isLoading && !streamingContent && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2.5">
                    <Loader2 className="size-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-1.5">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action.label)}
                    className="px-2.5 py-1 rounded-full border text-xs hover:bg-muted transition-colors"
                    title={action.description}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clear history button */}
          {messages.length > 5 && (
            <div className="px-4 pb-2">
              <button
                onClick={handleClearHistory}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear history
              </button>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                className="size-8 rounded-full"
                disabled={!input.trim() || isLoading}
              >
                <Send className="size-4" />
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
