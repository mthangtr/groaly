"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { WeeklyReview } from "@/components/reviews/WeeklyReview"
import { CalendarIcon, RefreshCw, Download } from "lucide-react"
import { toast } from "sonner"

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

export default function ReviewsPage() {
  const [reviews, setReviews] = React.useState<
    WeeklyReviewData["review"][]
  >([])
  const [selectedWeek, setSelectedWeek] = React.useState<string>("")
  const [currentReview, setCurrentReview] = React.useState<WeeklyReviewData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [generating, setGenerating] = React.useState(false)

  // Get Monday of current week
  const getMondayOfWeek = (date: Date) => {
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
    const monday = new Date(date.setDate(diff))
    return monday.toISOString().split("T")[0]
  }

  // Fetch reviews list
  const fetchReviews = React.useCallback(async () => {
    try {
      const response = await fetch("/api/weekly-reviews?limit=20")
      if (!response.ok) throw new Error("Failed to fetch reviews")
      const data = await response.json()
      setReviews(data.reviews)
      
      // Auto-select latest review
      if (data.reviews.length > 0 && !selectedWeek) {
        setSelectedWeek(data.reviews[0].week_start)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
      toast.error("Failed to load reviews")
    } finally {
      setLoading(false)
    }
  }, [selectedWeek])

  // Fetch detailed review for selected week
  const fetchDetailedReview = React.useCallback(async (weekStart: string) => {
    try {
      setLoading(true)
      
      // Check if review has insights (generated review)
      // For now, fetch basic review and try to regenerate if no insights
      const response = await fetch(`/api/weekly-reviews?week_start=${weekStart}`)
      if (!response.ok) throw new Error("Failed to fetch review")
      const data = await response.json()
      
      if (data.reviews.length > 0) {
        // Check if we have reflection (AI-generated)
        const hasInsights = data.reviews[0].reflection && data.reviews[0].reflection.includes("## Productivity Patterns")
        
        if (hasInsights) {
          // Parse insights from reflection
          const reflection = data.reviews[0].reflection || ""
          const sections = reflection.split("##").map((s: string) => s.trim())
          
          const insights = {
            completion_summary: sections[0] || "",
            productivity_patterns: sections
              .find((s: string) => s.startsWith("Productivity Patterns"))
              ?.split("\n")
              .slice(1)
              .filter((line: string) => line.trim().startsWith("-"))
              .map((line: string) => line.replace(/^-\s*/, "")) || [],
            bottlenecks: sections
              .find((s: string) => s.startsWith("Bottlenecks"))
              ?.split("\n")
              .slice(1)
              .filter((line: string) => line.trim().startsWith("-"))
              .map((line: string) => line.replace(/^-\s*/, "")) || [],
            suggestions: data.reviews[0].next_week_goals || [],
          }
          
          setCurrentReview({
            review: data.reviews[0],
            insights,
          })
        } else {
          // Basic review without insights
          setCurrentReview({
            review: data.reviews[0],
          })
        }
      }
    } catch (error) {
      console.error("Error fetching detailed review:", error)
      toast.error("Failed to load review details")
    } finally {
      setLoading(false)
    }
  }, [])

  // Generate new review
  const generateReview = async () => {
    try {
      setGenerating(true)
      const weekStart = getMondayOfWeek(new Date())
      
      const response = await fetch("/api/weekly-reviews/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ week_start: weekStart }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to generate review")
      }
      
      const data = await response.json()
      
      // Add tags_distribution to stats
      const reviewData: WeeklyReviewData = {
        review: data.review,
        insights: data.insights,
        stats: data.stats,
      }
      
      setCurrentReview(reviewData)
      setSelectedWeek(weekStart)
      
      // Refresh reviews list
      await fetchReviews()
      
      toast.success("Weekly review generated successfully!")
    } catch (error) {
      console.error("Error generating review:", error)
      toast.error(error instanceof Error ? error.message : "Failed to generate review")
    } finally {
      setGenerating(false)
    }
  }

  // Handle suggestion application
  const handleApplySuggestion = (suggestion: string) => {
    // TODO: Implement suggestion application logic
    // For now, just show a toast
    toast.info("Suggestion applied: " + suggestion)
  }

  // Initial load
  React.useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  // Load detailed review when week changes
  React.useEffect(() => {
    if (selectedWeek) {
      fetchDetailedReview(selectedWeek)
    }
  }, [selectedWeek, fetchDetailedReview])

  if (loading && !currentReview) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-col">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-sm font-medium">Weekly Reviews</h1>
          <span className="text-xs text-muted-foreground">
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {reviews.length > 0 && (
            <Select value={selectedWeek} onValueChange={(value) => setSelectedWeek(value || "")}>
              <SelectTrigger className="h-8 w-[200px]">
                <CalendarIcon className="mr-2 size-3.5" />
                <SelectValue placeholder="Select week" />
              </SelectTrigger>
              <SelectContent>
                {reviews.map((review) => {
                  const date = new Date(review.week_start)
                  const endDate = new Date(date)
                  endDate.setDate(endDate.getDate() + 6)
                  return (
                    <SelectItem key={review.id} value={review.week_start}>
                      {date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      -{" "}
                      {endDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          )}
          {currentReview && (
            <Button variant="outline" size="sm" disabled>
              <Download className="size-3.5" />
              Export
            </Button>
          )}
          <Button
            size="sm"
            className="gap-1.5"
            onClick={generateReview}
            disabled={generating}
          >
            <RefreshCw className={`size-3.5 ${generating ? "animate-spin" : ""}`} />
            {generating ? "Generating..." : "Generate"}
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {currentReview ? (
          <div className="mx-auto max-w-4xl p-6">
            <WeeklyReview
              data={currentReview}
              onApplySuggestion={handleApplySuggestion}
            />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <CalendarIcon className="mb-4 size-12 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-semibold">No reviews yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Generate your first weekly review to get AI-powered insights
            </p>
            <Button onClick={generateReview} disabled={generating} className="gap-1.5">
              <RefreshCw className={`size-3.5 ${generating ? "animate-spin" : ""}`} />
              {generating ? "Generating..." : "Generate Review"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
