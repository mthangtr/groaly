"use client"

import * as React from "react"
import { Trash2, Calendar, X } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { type Task } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const statusOptions = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
  { value: "cancelled", label: "Cancelled" },
] as const

const priorityOptions = [
  { value: "urgent", label: "Urgent", color: "bg-red-500" },
  { value: "high", label: "High", color: "bg-orange-500" },
  { value: "medium", label: "Medium", color: "bg-yellow-500" },
  { value: "low", label: "Low", color: "bg-zinc-400" },
] as const

type BulkActionsToolbarProps = {
  selectedCount: number
  selectedIds: string[]
  onBulkStatusChange: (status: Task["status"]) => void
  onBulkPriorityChange: (priority: Task["priority"]) => void
  onBulkReschedule: (date: string | null) => void
  onBulkDelete: () => void
  onClearSelection: () => void
}

export function BulkActionsToolbar({
  selectedCount,
  selectedIds,
  onBulkStatusChange,
  onBulkPriorityChange,
  onBulkReschedule,
  onClearSelection,
  onBulkDelete,
}: BulkActionsToolbarProps) {
  const [rescheduleDate, setRescheduleDate] = React.useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)

  const handleStatusChange = (status: string) => {
    onBulkStatusChange(status as Task["status"])
    toast.success(`Updated status for ${selectedCount} task${selectedCount > 1 ? "s" : ""}`)
  }

  const handlePriorityChange = (priority: string) => {
    onBulkPriorityChange(priority as Task["priority"])
    toast.success(`Updated priority for ${selectedCount} task${selectedCount > 1 ? "s" : ""}`)
  }

  const handleReschedule = () => {
    if (rescheduleDate) {
      onBulkReschedule(rescheduleDate)
      toast.success(`Rescheduled ${selectedCount} task${selectedCount > 1 ? "s" : ""}`)
      setRescheduleDate("")
    }
  }

  const handleClearDueDate = () => {
    onBulkReschedule(null)
    toast.success(`Cleared due date for ${selectedCount} task${selectedCount > 1 ? "s" : ""}`)
  }

  const handleDelete = () => {
    onBulkDelete()
    setDeleteDialogOpen(false)
    toast.success(`Deleted ${selectedCount} task${selectedCount > 1 ? "s" : ""}`)
  }

  if (selectedCount === 0) return null

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
          {selectedCount}
        </span>
        <span className="text-muted-foreground">
          task{selectedCount > 1 ? "s" : ""} selected
        </span>
      </div>

      <div className="h-4 w-px bg-border mx-2" />

      <Select onValueChange={handleStatusChange}>
        <SelectTrigger className="h-7 w-[130px]">
          <SelectValue placeholder="Set status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={handlePriorityChange}>
        <SelectTrigger className="h-7 w-[120px]">
          <SelectValue placeholder="Set priority" />
        </SelectTrigger>
        <SelectContent>
          {priorityOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <div className={cn("size-2.5 rounded-full", option.color)} />
                {option.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger
          render={(props) => (
            <Button {...props} variant="outline" size="sm" className="h-7 gap-1.5">
              <Calendar className="size-3.5" />
              Reschedule
            </Button>
          )}
        />
        <PopoverContent align="start" className="w-auto p-3">
          <div className="flex flex-col gap-2">
            <div className="text-xs font-medium">Set due date</div>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                className="h-7 text-xs w-[140px]"
              />
              <Button
                size="sm"
                className="h-7"
                onClick={handleReschedule}
                disabled={!rescheduleDate}
              >
                Apply
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs justify-start"
              onClick={handleClearDueDate}
            >
              Clear due date
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex-1" />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogTrigger
          render={(props) => (
            <Button
              {...props}
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          )}
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedCount} task{selectedCount > 1 ? "s" : ""}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The selected task{selectedCount > 1 ? "s" : ""} will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button
        variant="ghost"
        size="icon"
        className="size-7"
        onClick={onClearSelection}
      >
        <X className="size-3.5" />
      </Button>
    </div>
  )
}
