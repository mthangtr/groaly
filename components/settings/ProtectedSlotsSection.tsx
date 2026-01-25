"use client"

import * as React from "react"
import { Plus, Trash2, Coffee, Lock, Users, CalendarClock } from "lucide-react"
import { format, parseISO } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  generateRRuleString,
  parseRRuleString,
  getRecurrenceDescription,
  validateRecurrenceConfig,
  type RecurrenceConfig,
  type RecurrenceFrequency,
} from "@/lib/recurrence"
import type {
  ProtectedSlotWithDuration,
  ProtectedSlotCreateInput,
} from "@/types/protected-slot"

type ProtectedSlotsSectionProps = {
  slots: ProtectedSlotWithDuration[]
  onCreateSlot: (input: ProtectedSlotCreateInput) => Promise<void>
  onUpdateSlot: (id: string, input: Partial<ProtectedSlotCreateInput>) => Promise<void>
  onDeleteSlot: (id: string) => Promise<void>
}

const SLOT_ICONS = {
  coffee: Coffee,
  lock: Lock,
  users: Users,
  calendar: CalendarClock,
}

type SlotIconType = keyof typeof SLOT_ICONS

const DAY_OPTIONS = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
]

function RecurrenceEditor({
  config,
  onChange,
}: {
  config: RecurrenceConfig
  onChange: (config: RecurrenceConfig) => void
}) {
  const handleFrequencyChange = (frequency: RecurrenceFrequency) => {
    const newConfig: RecurrenceConfig = { ...config, frequency }
    // Reset byweekday if not weekly
    if (frequency !== "weekly") {
      delete newConfig.byweekday
    }
    onChange(newConfig)
  }

  const handleDayToggle = (day: number) => {
    const currentDays = config.byweekday ?? []
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day].sort()
    onChange({ ...config, byweekday: newDays })
  }

  const handleEndTypeChange = (endType: "never" | "date" | "count") => {
    const newConfig = { ...config }
    if (endType === "never") {
      delete newConfig.until
      delete newConfig.count
    } else if (endType === "date") {
      delete newConfig.count
      if (!newConfig.until) {
        const futureDate = new Date()
        futureDate.setDate(futureDate.getDate() + 30)
        newConfig.until = futureDate
      }
    } else if (endType === "count") {
      delete newConfig.until
      if (!newConfig.count) {
        newConfig.count = 10
      }
    }
    onChange(newConfig)
  }

  const endType = config.until ? "date" : config.count ? "count" : "never"

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Repeat</Label>
        <div className="flex gap-2">
          {(["daily", "weekly", "monthly"] as RecurrenceFrequency[]).map((freq) => (
            <Button
              key={freq}
              type="button"
              variant={config.frequency === freq ? "default" : "outline"}
              size="sm"
              onClick={() => handleFrequencyChange(freq)}
            >
              {freq.charAt(0).toUpperCase() + freq.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {config.frequency === "weekly" && (
        <div className="space-y-2">
          <Label>Days of week</Label>
          <div className="flex gap-1">
            {DAY_OPTIONS.map((day) => (
              <Button
                key={day.value}
                type="button"
                variant={config.byweekday?.includes(day.value) ? "default" : "outline"}
                size="sm"
                onClick={() => handleDayToggle(day.value)}
                className="flex-1"
              >
                {day.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>End</Label>
        <div className="flex gap-2">
          {["never", "date", "count"].map((type) => (
            <Button
              key={type}
              type="button"
              variant={endType === type ? "default" : "outline"}
              size="sm"
              onClick={() => handleEndTypeChange(type as "never" | "date" | "count")}
            >
              {type === "never" ? "Never" : type === "date" ? "On Date" : "After"}
            </Button>
          ))}
        </div>

        {endType === "date" && (
          <Input
            type="date"
            value={config.until ? format(config.until, "yyyy-MM-dd") : ""}
            onChange={(e) => {
              const newDate = e.target.value ? parseISO(e.target.value) : undefined
              onChange({ ...config, until: newDate })
            }}
          />
        )}

        {endType === "count" && (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              value={config.count ?? 10}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10)
                onChange({ ...config, count: value > 0 ? value : 1 })
              }}
              className="w-24"
            />
            <span className="text-sm text-muted-foreground">occurrences</span>
          </div>
        )}
      </div>

      <div className="rounded-lg border bg-muted/50 p-3">
        <p className="text-sm text-muted-foreground">
          {getRecurrenceDescription(config)}
        </p>
      </div>
    </div>
  )
}

function SlotDialog({
  slot,
  open,
  onOpenChange,
  onSave,
}: {
  slot?: ProtectedSlotWithDuration
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (input: ProtectedSlotCreateInput) => Promise<void>
}) {
  const [title, setTitle] = React.useState("")
  const [startTime, setStartTime] = React.useState("")
  const [endTime, setEndTime] = React.useState("")
  const [isRecurring, setIsRecurring] = React.useState(false)
  const [recurrenceConfig, setRecurrenceConfig] = React.useState<RecurrenceConfig>({
    frequency: "daily",
  })
  const [error, setError] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    if (slot) {
      setTitle(slot.title)
      setStartTime(slot.start_time)
      setEndTime(slot.end_time)
      setIsRecurring(slot.is_recurring ?? false)
      if (slot.recurrence_rule) {
        const config = parseRRuleString(slot.recurrence_rule)
        if (config) setRecurrenceConfig(config)
      }
    } else {
      // Reset for new slot
      setTitle("")
      setStartTime("")
      setEndTime("")
      setIsRecurring(false)
      setRecurrenceConfig({ frequency: "daily" })
    }
    setError(null)
  }, [slot, open])

  const handleSave = async () => {
    setError(null)

    if (!title.trim()) {
      setError("Title is required")
      return
    }

    if (!startTime || !endTime) {
      setError("Start and end time are required")
      return
    }

    const start = new Date(startTime)
    const end = new Date(endTime)

    if (start >= end) {
      setError("Start time must be before end time")
      return
    }

    let recurrenceRule: string | null = null
    if (isRecurring) {
      const validationError = validateRecurrenceConfig(recurrenceConfig)
      if (validationError) {
        setError(validationError)
        return
      }
      recurrenceRule = generateRRuleString(recurrenceConfig)
    }

    setSaving(true)
    try {
      await onSave({
        title: title.trim(),
        start_time: startTime,
        end_time: endTime,
        is_recurring: isRecurring,
        recurrence_rule: recurrenceRule,
      })
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save slot")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" showCloseButton={false}>
        <DialogTitle>
          {slot ? "Edit Protected Slot" : "New Protected Slot"}
        </DialogTitle>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Morning Coffee, Lunch Break"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start">Start Time</Label>
              <Input
                id="start"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">End Time</Label>
              <Input
                id="end"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Recurring</p>
              <p className="text-xs text-muted-foreground">
                Repeat this slot automatically
              </p>
            </div>
            <Switch checked={isRecurring} onCheckedChange={setIsRecurring} />
          </div>

          {isRecurring && (
            <RecurrenceEditor
              config={recurrenceConfig}
              onChange={setRecurrenceConfig}
            />
          )}

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <DialogClose render={<Button type="button" variant="outline" disabled={saving} />}>
            Cancel
          </DialogClose>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function SlotCard({
  slot,
  onEdit,
  onDelete,
}: {
  slot: ProtectedSlotWithDuration
  onEdit: () => void
  onDelete: () => void
}) {
  const icon = "lock" as SlotIconType
  const Icon = SLOT_ICONS[icon]

  return (
    <div className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
      <div className="rounded-full bg-primary/10 p-2">
        <Icon className="size-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{slot.title}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            {format(parseISO(slot.start_time), "MMM d, h:mm a")} -{" "}
            {format(parseISO(slot.end_time), "h:mm a")}
          </span>
          <span>•</span>
          <span>{slot.duration_minutes} min</span>
        </div>
        {slot.is_recurring && slot.recurrence_rule && (
          <div className="mt-1">
            <Badge variant="secondary" className="text-xs">
              {getRecurrenceDescription(
                parseRRuleString(slot.recurrence_rule) ?? { frequency: "daily" }
              )}
            </Badge>
          </div>
        )}
      </div>
      <div className="flex gap-1">
        <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
          Edit
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export function ProtectedSlotsSection({
  slots,
  onCreateSlot,
  onUpdateSlot,
  onDeleteSlot,
}: ProtectedSlotsSectionProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingSlot, setEditingSlot] = React.useState<ProtectedSlotWithDuration | undefined>()

  const handleCreateNew = () => {
    setEditingSlot(undefined)
    setDialogOpen(true)
  }

  const handleEdit = (slot: ProtectedSlotWithDuration) => {
    setEditingSlot(slot)
    setDialogOpen(true)
  }

  const handleSave = async (input: ProtectedSlotCreateInput) => {
    if (editingSlot) {
      await onUpdateSlot(editingSlot.id, input)
    } else {
      await onCreateSlot(input)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">Protected Time Slots</h2>
        <p className="text-sm text-muted-foreground">
          Block time for breaks, meetings, and focus sessions
        </p>
      </div>

      <div className="space-y-3">
        {slots.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <CalendarClock className="size-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No protected slots yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Create slots to protect time from AI scheduling
            </p>
          </div>
        ) : (
          slots.map((slot) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              onEdit={() => handleEdit(slot)}
              onDelete={() => onDeleteSlot(slot.id)}
            />
          ))
        )}
      </div>

      <Button onClick={handleCreateNew} className="w-full">
        <Plus className="size-4 mr-2" />
        Add Protected Slot
      </Button>

      <SlotDialog
        slot={editingSlot}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
      />
    </div>
  )
}
