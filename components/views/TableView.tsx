"use client"

import * as React from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
  type FilterFn,
} from "@tanstack/react-table"
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Play,
  CheckCircle2,
  Circle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  EyeOff,
  X,
  Download,
  FileSpreadsheet,
  FileJson,
} from "lucide-react"

import { cn } from "@/lib/utils"
import type { ViewTask } from "@/types/task"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { BulkActionsToolbar } from "@/components/views/BulkActionsToolbar"
import { exportTasks, type ExportFormat } from "@/lib/export"

const statusIcons = {
  todo: Circle,
  in_progress: Loader2,
  done: CheckCircle2,
  cancelled: Circle,
}

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

const priorityColors: Record<string, string> = {
  urgent: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-zinc-400",
}

type EditingCell = {
  rowId: string
  columnId: string
} | null

type TableViewProps = {
  tasks: ViewTask[]
  onTaskUpdate?: (taskId: string, updates: Partial<ViewTask>) => void
  onTaskDelete?: (taskIds: string[]) => void
  onBulkUpdate?: (taskIds: string[], updates: Partial<ViewTask>) => void
}

const globalFilterFn: FilterFn<ViewTask> = (row, _columnId, filterValue) => {
  const search = filterValue.toLowerCase()
  const title = row.original.title?.toLowerCase() ?? ""
  const description = row.original.description?.toLowerCase() ?? ""
  return title.includes(search) || description.includes(search)
}

function EditableCell({
  value,
  row,
  column,
  editingCell,
  onStartEdit,
  onEndEdit,
  onUpdate,
}: {
  value: string
  row: { id: string; original: ViewTask }
  column: { id: string }
  editingCell: EditingCell
  onStartEdit: (rowId: string, columnId: string) => void
  onEndEdit: () => void
  onUpdate: (taskId: string, updates: Partial<ViewTask>) => void
}) {
  const [editValue, setEditValue] = React.useState(value)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const isEditing = editingCell?.rowId === row.id && editingCell?.columnId === column.id

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  React.useEffect(() => {
    setEditValue(value)
  }, [value])

  const handleSave = () => {
    if (editValue !== value) {
      onUpdate(row.original.id, { title: editValue })
    }
    onEndEdit()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave()
    } else if (e.key === "Escape") {
      setEditValue(value)
      onEndEdit()
    }
  }

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="h-8 text-sm -my-1"
      />
    )
  }

  return (
    <span
      className="cursor-pointer hover:bg-muted/50 px-2 py-1 rounded transition-colors -mx-2"
      onClick={() => onStartEdit(row.id, column.id)}
    >
      {value}
    </span>
  )
}

function StatusSelect({
  value,
  onValueChange,
}: {
  value: ViewTask["status"]
  onValueChange: (value: ViewTask["status"]) => void
}) {
  const StatusIcon = statusIcons[value]

  return (
    <Select value={value} onValueChange={(v) => v && onValueChange(v)}>
      <SelectTrigger className="h-9 w-[130px]">
        <SelectValue>
          <div className="flex items-center gap-2">
            <StatusIcon
              className={cn(
                "size-3.5",
                value === "done" && "text-green-500",
                value === "in_progress" && "text-blue-500 animate-spin",
                value === "todo" && "text-muted-foreground"
              )}
            />
            <span className="capitalize text-sm">{value.replace("_", " ")}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => {
          const Icon = statusIcons[option.value]
          return (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <Icon
                  className={cn(
                    "size-3.5",
                    option.value === "done" && "text-green-500",
                    option.value === "in_progress" && "text-blue-500",
                    option.value === "todo" && "text-muted-foreground"
                  )}
                />
                {option.label}
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}

function PrioritySelect({
  value,
  onValueChange,
}: {
  value: ViewTask["priority"]
  onValueChange: (value: ViewTask["priority"]) => void
}) {
  return (
    <Select value={value} onValueChange={(v) => v && onValueChange(v)}>
      <SelectTrigger className="h-9 w-[100px]">
        <SelectValue>
          <div className="flex items-center gap-2">
            <div className={cn("size-2.5 rounded-full", priorityColors[value])} />
            <span className="capitalize text-sm">{value}</span>
          </div>
        </SelectValue>
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
  )
}

function DatePickerCell({
  value,
  onChange,
}: {
  value: string | undefined
  onChange: (date: string | null) => void
}) {
  const [inputValue, setInputValue] = React.useState(value || "")

  React.useEffect(() => {
    setInputValue(value || "")
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange(newValue || null)
  }

  return (
    <div className="flex items-center gap-1">
      <Input
        type="date"
        value={inputValue}
        onChange={handleChange}
        className="h-9 text-sm w-[130px]"
      />
      {inputValue && (
        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          onClick={() => {
            setInputValue("")
            onChange(null)
          }}
        >
          <X className="size-3" />
        </Button>
      )}
    </div>
  )
}

function ExportButton({
  tasks,
  onExport,
}: {
  tasks: ViewTask[]
  onExport: (format: ExportFormat, dateFrom?: string, dateTo?: string) => void
}) {
  const [dateFrom, setDateFrom] = React.useState("")
  const [dateTo, setDateTo] = React.useState("")

  const handleExport = (format: ExportFormat) => {
    onExport(format, dateFrom || undefined, dateTo || undefined)
  }

  return (
    <Popover>
      <PopoverTrigger
        render={(props) => (
          <Button {...props} variant="outline" size="sm" className="gap-1.5">
            <Download className="size-3.5" />
            Export
          </Button>
        )}
      />
      <PopoverContent align="end" className="w-56 p-3">
        <div className="space-y-3">
          <div className="text-xs font-medium">Export Options</div>

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Date range (optional)</div>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-9 text-sm"
                placeholder="From"
              />
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-9 text-sm"
                placeholder="To"
              />
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""} in current view
          </div>

          <div className="flex flex-col gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="justify-start gap-2"
              onClick={() => handleExport("csv")}
            >
              <FileSpreadsheet className="size-3.5" />
              Export as CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="justify-start gap-2"
              onClick={() => handleExport("json")}
            >
              <FileJson className="size-3.5" />
              Export as JSON
            </Button>
          </div>

          {(dateFrom || dateTo) && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                setDateFrom("")
                setDateTo("")
              }}
            >
              Clear date filter
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function ColumnVisibilityToggle({
  table,
}: {
  table: ReturnType<typeof useReactTable<ViewTask>>
}) {
  return (
    <Popover>
      <PopoverTrigger
        render={(props) => (
          <Button {...props} variant="outline" size="sm" className="gap-1.5">
            <Eye className="size-3.5" />
            Columns
          </Button>
        )}
      />
      <PopoverContent align="end" className="w-48 p-2">
        <div className="space-y-1">
          {table.getAllLeafColumns().map((column) => {
            if (column.id === "select" || column.id === "actions") return null
            return (
              <div
                key={column.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer"
                onClick={() => column.toggleVisibility(!column.getIsVisible())}
              >
                {column.getIsVisible() ? (
                  <Eye className="size-3.5 text-muted-foreground" />
                ) : (
                  <EyeOff className="size-3.5 text-muted-foreground" />
                )}
                <span className="text-xs capitalize">
                  {column.id.replace("_", " ")}
                </span>
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function MultiSelectFilter({
  title,
  options,
  selectedValues,
  onSelectionChange,
}: {
  title: string
  options: readonly { value: string; label: string; color?: string }[]
  selectedValues: string[]
  onSelectionChange: (values: string[]) => void
}) {
  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      onSelectionChange(selectedValues.filter((v) => v !== value))
    } else {
      onSelectionChange([...selectedValues, value])
    }
  }

  return (
    <Popover>
      <PopoverTrigger
        render={(props) => (
          <Button {...props} variant="outline" size="sm" className="gap-1.5">
            {title}
            {selectedValues.length > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 text-xs">
                {selectedValues.length}
              </Badge>
            )}
          </Button>
        )}
      />
      <PopoverContent align="start" className="w-48 p-2">
        <div className="space-y-1">
          {options.map((option) => (
            <div
              key={option.value}
              className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer"
              onClick={() => toggleValue(option.value)}
            >
              <Checkbox checked={selectedValues.includes(option.value)} />
              {option.color && (
                <div className={cn("size-2.5 rounded-full", option.color)} />
              )}
              <span className="text-xs">{option.label}</span>
            </div>
          ))}
        </div>
        {selectedValues.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2 text-xs"
            onClick={() => onSelectionChange([])}
          >
            Clear all
          </Button>
        )}
      </PopoverContent>
    </Popover>
  )
}

function SortableHeader({
  column,
  children,
}: {
  column: { getIsSorted: () => false | "asc" | "desc"; toggleSorting: (desc?: boolean) => void }
  children: React.ReactNode
}) {
  const sorted = column.getIsSorted()

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-6 -ml-2 text-xs gap-1"
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {children}
      {sorted === "asc" ? (
        <ArrowUp className="size-3" />
      ) : sorted === "desc" ? (
        <ArrowDown className="size-3" />
      ) : (
        <ArrowUpDown className="size-3 opacity-50" />
      )}
    </Button>
  )
}

export function TableView({ tasks, onTaskUpdate, onTaskDelete, onBulkUpdate }: TableViewProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [editingCell, setEditingCell] = React.useState<EditingCell>(null)
  const [statusFilter, setStatusFilter] = React.useState<string[]>([])
  const [priorityFilter, setPriorityFilter] = React.useState<string[]>([])
  const [goalFilter, setGoalFilter] = React.useState<string[]>([])

  const handleTaskUpdate = React.useCallback(
    (taskId: string, updates: Partial<ViewTask>) => {
      onTaskUpdate?.(taskId, updates)
    },
    [onTaskUpdate]
  )

  const uniqueGoals = React.useMemo(() => {
    const goals = new Set(tasks.map((t) => t.goal).filter(Boolean))
    return Array.from(goals).map((g) => ({ value: g!, label: g! }))
  }, [tasks])

  const filteredTasks = React.useMemo(() => {
    let result = tasks

    if (statusFilter.length > 0) {
      result = result.filter((t) => statusFilter.includes(t.status))
    }
    if (priorityFilter.length > 0) {
      result = result.filter((t) => priorityFilter.includes(t.priority))
    }
    if (goalFilter.length > 0) {
      result = result.filter((t) => t.goal && goalFilter.includes(t.goal))
    }

    return result
  }, [tasks, statusFilter, priorityFilter, goalFilter])

  const selectedRowIds = React.useMemo(() => {
    return Object.keys(rowSelection).filter((key) => rowSelection[key])
  }, [rowSelection])

  const selectedTaskIds = React.useMemo(() => {
    return selectedRowIds.map((rowId) => {
      const row = filteredTasks[parseInt(rowId)]
      return row?.id
    }).filter(Boolean) as string[]
  }, [selectedRowIds, filteredTasks])

  const handleBulkStatusChange = React.useCallback(
    (status: ViewTask["status"]) => {
      onBulkUpdate?.(selectedTaskIds, { status })
    },
    [onBulkUpdate, selectedTaskIds]
  )

  const handleBulkPriorityChange = React.useCallback(
    (priority: ViewTask["priority"]) => {
      onBulkUpdate?.(selectedTaskIds, { priority })
    },
    [onBulkUpdate, selectedTaskIds]
  )

  const handleBulkReschedule = React.useCallback(
    (date: string | null) => {
      onBulkUpdate?.(selectedTaskIds, { due_date: date ?? undefined })
    },
    [onBulkUpdate, selectedTaskIds]
  )

  const handleBulkDelete = React.useCallback(() => {
    onTaskDelete?.(selectedTaskIds)
    setRowSelection({})
  }, [onTaskDelete, selectedTaskIds])

  const handleClearSelection = React.useCallback(() => {
    setRowSelection({})
  }, [])

  const handleExport = React.useCallback(
    (format: ExportFormat, dateFrom?: string, dateTo?: string) => {
      exportTasks(filteredTasks, { format, dateFrom, dateTo })
    },
    [filteredTasks]
  )

  const columns = React.useMemo<ColumnDef<ViewTask>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
      },
      {
        accessorKey: "title",
        header: ({ column }) => <SortableHeader column={column}>Title</SortableHeader>,
        cell: ({ row, column }) => {
          const StatusIcon = statusIcons[row.original.status]
          return (
            <div className="flex items-center gap-2">
              <StatusIcon
                className={cn(
                  "size-4 shrink-0",
                  row.original.status === "done" && "text-green-500",
                  row.original.status === "in_progress" && "text-blue-500 animate-spin",
                  row.original.status === "todo" && "text-muted-foreground"
                )}
              />
              <EditableCell
                value={row.original.title}
                row={row}
                column={column}
                editingCell={editingCell}
                onStartEdit={(rowId, columnId) => setEditingCell({ rowId, columnId })}
                onEndEdit={() => setEditingCell(null)}
                onUpdate={handleTaskUpdate}
              />
            </div>
          )
        },
        size: 300,
      },
      {
        accessorKey: "status",
        header: ({ column }) => <SortableHeader column={column}>Status</SortableHeader>,
        cell: ({ row }) => (
          <StatusSelect
            value={row.original.status}
            onValueChange={(value) =>
              handleTaskUpdate(row.original.id, { status: value })
            }
          />
        ),
        size: 150,
      },
      {
        accessorKey: "priority",
        header: ({ column }) => <SortableHeader column={column}>Priority</SortableHeader>,
        cell: ({ row }) => (
          <PrioritySelect
            value={row.original.priority}
            onValueChange={(value) =>
              handleTaskUpdate(row.original.id, { priority: value })
            }
          />
        ),
        sortingFn: (rowA, rowB) => {
          const order = { urgent: 0, high: 1, medium: 2, low: 3 }
          return order[rowA.original.priority] - order[rowB.original.priority]
        },
        size: 120,
      },
      {
        accessorKey: "due_date",
        header: ({ column }) => <SortableHeader column={column}>Due Date</SortableHeader>,
        cell: ({ row }) => (
          <DatePickerCell
            value={row.original.due_date?.split("T")[0]}
            onChange={(date) =>
              handleTaskUpdate(row.original.id, { due_date: date ?? undefined })
            }
          />
        ),
        size: 160,
      },
      {
        accessorKey: "estimated_time_minutes",
        header: ({ column }) => <SortableHeader column={column}>Est. Time</SortableHeader>,
        cell: ({ row }) =>
          row.original.estimated_time_minutes ? (
            <span className="text-xs text-muted-foreground">
              {row.original.estimated_time_minutes}m
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          ),
        size: 100,
      },
      {
        accessorKey: "goal",
        header: ({ column }) => <SortableHeader column={column}>Goal</SortableHeader>,
        cell: ({ row }) =>
          row.original.goal ? (
            <Badge variant="secondary" className="text-xs">
              {row.original.goal}
            </Badge>
          ) : null,
        size: 120,
      },
      {
        accessorKey: "tags",
        header: "Tags",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.tags?.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {(row.original.tags?.length ?? 0) > 2 && (
              <Badge variant="outline" className="text-xs">
                +{row.original.tags!.length - 2}
              </Badge>
            )}
          </div>
        ),
        enableSorting: false,
        size: 150,
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => <SortableHeader column={column}>Created</SortableHeader>,
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(row.original.created_at), { addSuffix: true })}
          </span>
        ),
        size: 120,
      },
      {
        accessorKey: "completed_at",
        header: ({ column }) => <SortableHeader column={column}>Completed</SortableHeader>,
        cell: ({ row }) =>
          row.original.completed_at ? (
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(row.original.completed_at), { addSuffix: true })}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          ),
        size: 120,
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {row.original.status !== "done" && (
              <Link href={`/focus/${row.original.id}`}>
                <Button size="icon" variant="ghost" className="size-7">
                  <Play className="size-3.5" />
                </Button>
              </Link>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={(props) => (
                  <Button {...props} size="icon" variant="ghost" className="size-7">
                    <MoreHorizontal className="size-3.5" />
                  </Button>
                )}
              />
              <DropdownMenuContent align="end" sideOffset={4}>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onSelect={() => onTaskDelete?.([row.original.id])}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
        size: 80,
        enableHiding: false,
      },
    ],
    [editingCell, handleTaskUpdate, onTaskDelete]
  )

  const table = useReactTable({
    data: filteredTasks,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
  })

  const selectedCount = Object.keys(rowSelection).length

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-3 border-b flex-wrap bg-muted/30">
        <Input
          placeholder="Search tasks..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="h-9 w-64"
        />

        <MultiSelectFilter
          title="Status"
          options={statusOptions}
          selectedValues={statusFilter}
          onSelectionChange={setStatusFilter}
        />

        <MultiSelectFilter
          title="Priority"
          options={priorityOptions}
          selectedValues={priorityFilter}
          onSelectionChange={setPriorityFilter}
        />

        {uniqueGoals.length > 0 && (
          <MultiSelectFilter
            title="Goal"
            options={uniqueGoals}
            selectedValues={goalFilter}
            onSelectionChange={setGoalFilter}
          />
        )}

        <div className="flex-1" />

        <ExportButton tasks={filteredTasks} onExport={handleExport} />
        <ColumnVisibilityToggle table={table} />
      </div>

      {selectedCount > 0 && (
        <BulkActionsToolbar
          selectedCount={selectedCount}
          selectedIds={selectedTaskIds}
          onBulkStatusChange={handleBulkStatusChange}
          onBulkPriorityChange={handleBulkPriorityChange}
          onBulkReschedule={handleBulkReschedule}
          onBulkDelete={handleBulkDelete}
          onClearSelection={handleClearSelection}
        />
      )}

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-background border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="text-xs text-muted-foreground">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-3 text-left font-normal"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  "group border-b transition-all duration-150 hover:bg-muted/50",
                  row.getIsSelected() && "bg-muted/50 ring-1 ring-inset ring-primary/20"
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {table.getRowModel().rows.length === 0 && (
          <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
            No tasks found
          </div>
        )}
      </div>

      <div className="flex items-center justify-between p-2 border-t text-xs text-muted-foreground">
        <div>
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
          -{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          of {table.getFilteredRowModel().rows.length} tasks
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="size-3.5" />
          </Button>
          <span className="px-2">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
