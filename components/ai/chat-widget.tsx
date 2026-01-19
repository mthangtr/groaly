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

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hey! I'm your AI assistant. I can help you plan tasks, optimize your schedule, and keep your goals balanced. What would you like to do?",
    timestamp: new Date(),
  },
]

export function AIChatWidget() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isMinimized, setIsMinimized] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>(initialMessages)
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)

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

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(input),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleQuickAction = (action: string) => {
    setInput(action)
  }

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

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
            <p className="text-[10px] text-muted-foreground">Always here to help</p>
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
              setIsOpen(false)
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
                      "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                      message.role === "user"
                        ? "bg-foreground text-background rounded-br-md"
                        : "bg-muted rounded-bl-md"
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
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
                  >
                    {action.label}
                  </button>
                ))}
              </div>
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

// Mock AI responses
function getAIResponse(input: string): string {
  const lowerInput = input.toLowerCase()

  if (lowerInput.includes("/plan-week") || lowerInput.includes("plan week")) {
    return "I've analyzed your tasks and goals. Here's your optimized week:\n\n**Monday-Wednesday:** Focus on Startup tasks (pitch deck, customer calls)\n**Thursday:** Dev Learning block (Spring Boot module)\n**Friday:** Mixed day with Japanese practice + lighter tasks\n\nShall I create these time blocks in your calendar?"
  }

  if (lowerInput.includes("/whats-next") || lowerInput.includes("next task")) {
    return "Based on your current energy and priorities, I recommend:\n\n**Review customer feedback** (45 min, High priority)\n\nThis aligns with your Startup goal and you typically do analytical tasks well in the morning. Ready to start Focus Mode?"
  }

  if (lowerInput.includes("/optimize") || lowerInput.includes("optimize")) {
    return "Looking at today's schedule, I see some opportunities:\n\n1. Move the pitch deck work to morning (you're more creative then)\n2. Stack the quick tasks (emails, reviews) after lunch\n3. Save Japanese practice for evening wind-down\n\nWant me to apply these changes?"
  }

  if (lowerInput.includes("/balance") || lowerInput.includes("goal")) {
    return "Your current goal distribution:\n\n**Startup:** 65% (target: 60%)\n**Dev Learning:** 22% (target: 25%)\n**Japanese N3:** 13% (target: 15%)\n\nYou're slightly over-indexing on Startup. Consider adding a 15-min Japanese session today to balance things out."
  }

  return "I understand you want to " + input + ". Let me help you with that. Would you like me to create tasks, schedule time blocks, or suggest optimizations for this?"
}
