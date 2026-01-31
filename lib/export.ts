import type { ViewTask } from "@/types/task"

type ExportFormat = "csv" | "json"

type ExportOptions = {
  format: ExportFormat
  dateFrom?: string
  dateTo?: string
}

function escapeCSVField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

function getFilename(format: ExportFormat): string {
  const date = formatDate(new Date())
  return `tasks-${date}.${format}`
}

function filterByDateRange(
  tasks: ViewTask[],
  dateFrom?: string,
  dateTo?: string
): ViewTask[] {
  if (!dateFrom && !dateTo) return tasks

  return tasks.filter((task) => {
    const taskDate = task.created_at ? new Date(task.created_at) : null
    if (!taskDate) return false

    if (dateFrom && taskDate < new Date(dateFrom)) return false
    if (dateTo && taskDate > new Date(dateTo + "T23:59:59")) return false

    return true
  })
}

function tasksToCSV(tasks: ViewTask[]): string {
  const headers = [
    "ID",
    "Title",
    "Description",
    "Status",
    "Priority",
    "Goal",
    "Tags",
    "Due Date",
    "Estimated Time (min)",
    "Energy Level",
    "Scheduled At",
    "Completed At",
    "Created At",
  ]

  const rows = tasks.map((task) => [
    task.id,
    task.title,
    task.description || "",
    task.status,
    task.priority,
    task.goal || "",
    (task.tags || []).join("; "),
    task.due_date || "",
    task.estimated_time_minutes?.toString() || "",
    task.energy_level || "",
    task.scheduled_at || "",
    task.completed_at || "",
    task.created_at,
  ])

  const csvContent = [
    headers.map(escapeCSVField).join(","),
    ...rows.map((row) => row.map(escapeCSVField).join(",")),
  ].join("\n")

  return csvContent
}

function tasksToJSON(tasks: ViewTask[]): string {
  return JSON.stringify(tasks, null, 2)
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportTasks(tasks: ViewTask[], options: ExportOptions): void {
  const { format, dateFrom, dateTo } = options

  const filteredTasks = filterByDateRange(tasks, dateFrom, dateTo)

  const filename = getFilename(format)

  if (format === "csv") {
    const content = tasksToCSV(filteredTasks)
    downloadFile(content, filename, "text/csv;charset=utf-8;")
  } else {
    const content = tasksToJSON(filteredTasks)
    downloadFile(content, filename, "application/json")
  }
}

export type { ExportFormat, ExportOptions }
