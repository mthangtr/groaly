"use client"

import * as React from "react"
import {
  User,
  Bell,
  Palette,
  Globe,
  Shield,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
  Monitor,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { mockUser, mockGoals } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
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
  { id: "language", title: "Language", icon: Globe },
  { id: "privacy", title: "Privacy", icon: Shield },
  { id: "help", title: "Help & Support", icon: HelpCircle },
]

function SettingRow({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b last:border-b-0">
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = React.useState("profile")
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">("system")

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
            {/* Profile Section */}
            {activeSection === "profile" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-semibold">Profile</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your account settings
                  </p>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-4 p-4 rounded-lg border">
                  <Avatar className="size-16">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xl font-medium">
                      {mockUser.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium">{mockUser.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {mockUser.email}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>

                {/* Goals */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Your Goals</h3>
                    <Button variant="outline" size="sm">
                      Manage Goals
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {mockGoals.map((goal) => (
                      <div
                        key={goal.id}
                        className="flex items-center gap-3 p-3 rounded-lg border"
                      >
                        <div
                          className="size-3 rounded-full"
                          style={{ backgroundColor: goal.color }}
                        />
                        <span className="flex-1 font-medium text-sm">
                          {goal.name}
                        </span>
                        <span className="text-sm text-muted-foreground tabular-nums">
                          {goal.percentage}%
                        </span>
                        <Progress
                          value={goal.percentage}
                          className="w-24 h-1.5"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === "notifications" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-semibold">Notifications</h2>
                  <p className="text-sm text-muted-foreground">
                    Configure how you receive notifications
                  </p>
                </div>

                <div className="rounded-lg border divide-y">
                  <SettingRow
                    label="Push Notifications"
                    description="Receive notifications on your device"
                  >
                    <Switch defaultChecked />
                  </SettingRow>
                  <SettingRow
                    label="Email Notifications"
                    description="Receive weekly summary emails"
                  >
                    <Switch defaultChecked />
                  </SettingRow>
                  <SettingRow
                    label="Focus Mode Reminders"
                    description="Get reminded to take breaks"
                  >
                    <Switch defaultChecked />
                  </SettingRow>
                  <SettingRow
                    label="Daily Planning Reminder"
                    description="Morning reminder to plan your day"
                  >
                    <Switch />
                  </SettingRow>
                </div>
              </div>
            )}

            {/* Appearance Section */}
            {activeSection === "appearance" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-semibold">Appearance</h2>
                  <p className="text-sm text-muted-foreground">
                    Customize how dumtasking looks
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Theme</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "light", label: "Light", icon: Sun },
                      { id: "dark", label: "Dark", icon: Moon },
                      { id: "system", label: "System", icon: Monitor },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setTheme(option.id as typeof theme)}
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors",
                          theme === option.id
                            ? "border-foreground bg-muted"
                            : "hover:bg-muted/50"
                        )}
                      >
                        <option.icon className="size-5" />
                        <span className="text-sm">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border divide-y">
                  <SettingRow
                    label="Compact Mode"
                    description="Show more content with smaller elements"
                  >
                    <Switch />
                  </SettingRow>
                  <SettingRow
                    label="Show Philosophical Quotes"
                    description="Display motivational quotes throughout the app"
                  >
                    <Switch defaultChecked />
                  </SettingRow>
                </div>
              </div>
            )}

            {/* Language Section */}
            {activeSection === "language" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-semibold">Language & Region</h2>
                  <p className="text-sm text-muted-foreground">
                    Set your language and timezone preferences
                  </p>
                </div>

                <div className="rounded-lg border divide-y">
                  <SettingRow label="Language" description="English">
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </SettingRow>
                  <SettingRow
                    label="Timezone"
                    description={mockUser.timezone}
                  >
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </SettingRow>
                  <SettingRow
                    label="Date Format"
                    description="MM/DD/YYYY"
                  >
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </SettingRow>
                </div>
              </div>
            )}

            {/* Privacy Section */}
            {activeSection === "privacy" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-semibold">Privacy & Security</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your privacy settings
                  </p>
                </div>

                <div className="rounded-lg border divide-y">
                  <SettingRow
                    label="Data Analytics"
                    description="Help improve dumtasking with anonymous usage data"
                  >
                    <Switch defaultChecked />
                  </SettingRow>
                  <SettingRow
                    label="AI Training"
                    description="Allow your data to improve AI suggestions"
                  >
                    <Switch />
                  </SettingRow>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-destructive">
                    Danger Zone
                  </h3>
                  <div className="rounded-lg border border-destructive/30 p-4 space-y-3">
                    <p className="text-sm">
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </p>
                    <Button variant="outline" className="text-destructive">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Help Section */}
            {activeSection === "help" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-semibold">Help & Support</h2>
                  <p className="text-sm text-muted-foreground">
                    Get help with dumtasking
                  </p>
                </div>

                <div className="grid gap-4">
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <p className="font-medium">Documentation</p>
                      <p className="text-xs text-muted-foreground">
                        Learn how to use dumtasking
                      </p>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <p className="font-medium">Contact Support</p>
                      <p className="text-xs text-muted-foreground">
                        Get help from our team
                      </p>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <p className="font-medium">Keyboard Shortcuts</p>
                      <p className="text-xs text-muted-foreground">
                        View all available shortcuts
                      </p>
                    </div>
                  </Button>
                </div>

                <div className="text-center text-xs text-muted-foreground pt-4">
                  <p>dumtasking v1.0.0</p>
                  <p>Made with care by mthangtr</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
