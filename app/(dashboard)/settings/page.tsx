"use client"

import * as React from "react"
import {
  LogOut,
  CalendarClock,
  Key,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ProtectedSlotsSection } from "@/components/settings/ProtectedSlotsSection"
import { ApiKeysSection } from "@/components/settings/ApiKeysSection"
import type {
  ProtectedSlotWithDuration,
  ProtectedSlotCreateInput,
} from "@/types/protected-slot"

type SettingsSection = {
  id: string
  title: string
  icon: React.ElementType
}

const sections: SettingsSection[] = [
  { id: "api-keys", title: "API Keys", icon: Key },
  { id: "protected-slots", title: "Protected Slots", icon: CalendarClock },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = React.useState("api-keys")
  const [protectedSlots, setProtectedSlots] = React.useState<ProtectedSlotWithDuration[]>([])
  const [loadingSlots, setLoadingSlots] = React.useState(false)

  // Fetch protected slots
  React.useEffect(() => {
    if (activeSection === "protected-slots") {
      fetchProtectedSlots()
    }
  }, [activeSection])

  const fetchProtectedSlots = async () => {
    setLoadingSlots(true)
    try {
      const response = await fetch("/api/protected-slots")
      if (response.ok) {
        const data = await response.json()
        setProtectedSlots(data.slots ?? [])
      }
    } catch (error) {
      console.error("Failed to fetch protected slots:", error)
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleCreateSlot = async (input: ProtectedSlotCreateInput) => {
    const response = await fetch("/api/protected-slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.details || error.error)
    }
    await fetchProtectedSlots()
  }

  const handleUpdateSlot = async (id: string, input: Partial<ProtectedSlotCreateInput>) => {
    const response = await fetch(`/api/protected-slots/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.details || error.error)
    }
    await fetchProtectedSlots()
  }

  const handleDeleteSlot = async (id: string) => {
    const response = await fetch(`/api/protected-slots/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.details || error.error)
    }
    await fetchProtectedSlots()
  }

  return (
    <div className="flex h-dvh flex-col">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-sm font-medium">Settings</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Settings Nav */}
        <nav className="w-56 border-r overflow-auto p-4">
          <div className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  activeSection === section.id
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <section.icon className="size-4" />
                {section.title}
              </button>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t">
            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors">
              <LogOut className="size-4" />
              Log out
            </button>
          </div>
        </nav>

        {/* Settings Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-2xl">
            {/* API Keys Section */}
            {activeSection === "api-keys" && <ApiKeysSection />}

            {/* Protected Slots Section */}
            {activeSection === "protected-slots" && (
              <div className="space-y-8">
                {loadingSlots ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <ProtectedSlotsSection
                    slots={protectedSlots}
                    onCreateSlot={handleCreateSlot}
                    onUpdateSlot={handleUpdateSlot}
                    onDeleteSlot={handleDeleteSlot}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
