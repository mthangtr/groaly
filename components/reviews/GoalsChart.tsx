"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

type GoalsChartProps = {
  tagsDistribution: Record<string, number>
}

const COLORS = [
  "#3b82f6", // blue-500
  "#10b981", // green-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#06b6d4", // cyan-500
  "#f97316", // orange-500
]

export function GoalsChart({ tagsDistribution }: GoalsChartProps) {
  // Convert tags distribution to chart data
  const data = Object.entries(tagsDistribution)
    .sort(([, a], [, b]) => b - a) // Sort by count descending
    .slice(0, 8) // Take top 8
    .map(([tag, count]) => ({
      name: tag,
      value: count,
    }))

  // Calculate total for percentage
  const total = data.reduce((sum, item) => sum + item.value, 0)

  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-muted-foreground">No tags data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => {
            const percentage = ((value / total) * 100).toFixed(1)
            return `${name} ${percentage}%`
          }}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number | undefined) => {
            if (value === undefined) return ["0 tasks (0%)", "Count"]
            const percentage = ((value / total) * 100).toFixed(1)
            return [`${value} tasks (${percentage}%)`, "Count"]
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
