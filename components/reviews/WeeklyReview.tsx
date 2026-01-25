"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertTriangle,
  Target,
  Lightbulb,
  CalendarIcon,
} from "lucide-react"
import { GoalsChart } from "./GoalsChart"

type WeeklyReviewData = {
  review: {
    id: string
    user_id: string
    week_start: string
    reflection: string | null
    achievements: string[] | null
    next_week_goals: string[] | null
    energy_level: "low" | "medium" | "high" | null
    created_at: string
    updated_at: string
  }
  insights?: {
    completion_summary: string
    productivity_patterns: string[]
    bottlenecks: string[]
    suggestions: string[]
  }
  stats?: {
    total_tasks: number
    completed_tasks: number
    completion_rate: number
    total_focus_minutes: number
    focus_sessions_count: number
    tags_distribution?: Record<string, number>
  }
}

type WeeklyReviewProps = {
  data: WeeklyReviewData
  onApplySuggestion?: (suggestion: string) => void
}

export function WeeklyReview({ data, onApplySuggestion }: WeeklyReviewProps) {
  const { review, insights, stats } = data

  // Format week display
  const weekStart = new Date(review.week_start)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const completionRate = stats?.completion_rate ?? 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Weekly Review</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>
              {formatDate(weekStart)} - {formatDate(weekEnd)}
            </span>
          </div>
        </div>
        {review.energy_level && (
          <Badge
            variant={
              review.energy_level === "high"
                ? "default"
                : review.energy_level === "medium"
                  ? "secondary"
                  : "outline"
            }
          >
            Energy: {review.energy_level}
          </Badge>
        )}
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-500/10 p-2">
                <CheckCircle2 className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{completionRate.toFixed(1)}%</p>
              </div>
            </div>
            <Progress value={completionRate} className="mt-3" />
            <p className="mt-2 text-xs text-muted-foreground">
              {stats.completed_tasks} of {stats.total_tasks} tasks completed
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-500/10 p-2">
                <Clock className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Focus Time</p>
                <p className="text-2xl font-bold">
                  {Math.floor(stats.total_focus_minutes / 60)}h{" "}
                  {stats.total_focus_minutes % 60}m
                </p>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {stats.focus_sessions_count} sessions
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-500/10 p-2">
                <Target className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tasks</p>
                <p className="text-2xl font-bold">{stats.total_tasks}</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Total this week</p>
          </Card>
        </div>
      )}

      {/* Goals Distribution Chart */}
      {stats?.tags_distribution && Object.keys(stats.tags_distribution).length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Goals Distribution</h3>
          <GoalsChart tagsDistribution={stats.tags_distribution} />
        </Card>
      )}

      {/* Insights Section */}
      {insights && (
        <>
          {/* Completion Summary */}
          {insights.completion_summary && (
            <Card className="p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-500/10 p-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Week Summary</h3>
                  <p className="text-sm text-muted-foreground">
                    {insights.completion_summary}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Productivity Patterns */}
          {insights.productivity_patterns.length > 0 && (
            <Card className="p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-500/10 p-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-3 font-semibold">Productivity Patterns</h3>
                  <ul className="space-y-2">
                    {insights.productivity_patterns.map((pattern, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500" />
                        <span>{pattern}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}

          {/* Bottlenecks */}
          {insights.bottlenecks.length > 0 && (
            <Card className="p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-amber-500/10 p-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-3 font-semibold">Bottlenecks</h3>
                  <ul className="space-y-2">
                    {insights.bottlenecks.map((bottleneck, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                        <span>{bottleneck}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}

          {/* AI Suggestions */}
          {insights.suggestions.length > 0 && (
            <Card className="p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-purple-500/10 p-2">
                  <Lightbulb className="h-5 w-5 text-purple-500" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-3 font-semibold">AI Suggestions</h3>
                  <ul className="space-y-3">
                    {insights.suggestions.map((suggestion, idx) => (
                      <li
                        key={idx}
                        className="flex items-start justify-between gap-3 rounded-lg border p-3"
                      >
                        <span className="flex-1 text-sm">{suggestion}</span>
                        {onApplySuggestion && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onApplySuggestion(suggestion)}
                          >
                            Apply
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Achievements */}
      {review.achievements && review.achievements.length > 0 && (
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-green-500/10 p-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="mb-3 font-semibold">Achievements</h3>
              <ul className="space-y-2">
                {review.achievements.map((achievement, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Reflection */}
      {review.reflection && (
        <Card className="p-6">
          <h3 className="mb-3 font-semibold">Reflection</h3>
          <div className="prose prose-sm max-w-none text-sm text-muted-foreground">
            {review.reflection.split("\n").map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
