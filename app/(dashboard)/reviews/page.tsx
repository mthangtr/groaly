"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
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
  }, [reviews])

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
      <div className="flex h-[400px] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="container max-w-5xl space-y-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Weekly Reviews</h1>
          <p className="text-sm text-muted-foreground">
            AI-powered insights about your productivity
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={generateReview}
            disabled={generating}
          >
            {generating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Review
              </>
            )}
          </Button>
          {currentReview && (
            <Button variant="outline" size="sm" disabled>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          )}
        </div>
      </div>

      {/* Week Selector */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-5 w-5 text-muted-foreground" />
          <Select value={selectedWeek} onValueChange={(value) => setSelectedWeek(value || "")}>
            <SelectTrigger className="w-[250px]">
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
                      year: "numeric",
                    })}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Review Content */}
      {currentReview ? (
        <WeeklyReview
          data={currentReview}
          onApplySuggestion={handleApplySuggestion}
        />
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <CalendarIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="mb-2 text-lg font-semibold">No reviews yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Generate your first weekly review to get AI-powered insights
          </p>
          <Button onClick={generateReview} disabled={generating}>
            {generating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Review
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
