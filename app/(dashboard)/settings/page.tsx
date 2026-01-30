"use client"

import * as React from "react"
import { LogOut, User, Bell, Palette } from "lucide-react"

import { cn } from "@/lib/utils"
import { SidebarTrigger } from "@/components/ui/sidebar"

type SettingsSection = {
  id: string
  title: string
  icon: React.ElementType
}

const sections: SettingsSection[] = [
  { id: "profile", title: "Profile", icon: User },
  { id: "notifications", title: "Notifications", icon: Bell },
  { id: "appearance", title: "Appearance", icon: Palette },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = React.useState("profile")

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
            {activeSection === "profile" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Profile</h2>
                <p className="text-sm text-muted-foreground">
                  Manage your profile settings
                </p>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Notifications</h2>
                <p className="text-sm text-muted-foreground">
                  Configure notification preferences
                </p>
              </div>
            )}

            {activeSection === "appearance" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Appearance</h2>
                <p className="text-sm text-muted-foreground">
                  Customize the app appearance
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
