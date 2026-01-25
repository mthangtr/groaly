# Weekly Review API Documentation

## Overview

The Weekly Review API provides AI-powered weekly insights and manual review management for task productivity analysis.

## Endpoints

### 1. Generate Weekly Review

Auto-generate a weekly review with AI insights based on tasks and focus sessions.

**Endpoint:** `POST /api/weekly-reviews/generate`

**Authentication:** Required

**Request Body:**
```json
{
  "week_start": "2026-01-20"  // YYYY-MM-DD format, must be Monday
}
```

**Response (200 OK):**
```json
{
  "review": {
    "id": "uuid",
    "user_id": "uuid",
    "week_start": "2026-01-20",
    "reflection": "Auto-generated reflection text with AI insights",
    "achievements": ["Achievement 1", "Achievement 2"],
    "next_week_goals": ["Goal 1", "Goal 2"],
    "energy_level": null,
    "created_at": "2026-01-25T10:00:00Z",
    "updated_at": "2026-01-25T10:00:00Z"
  },
  "insights": {
    "completion_summary": "Brief summary of task completion rate",
    "productivity_patterns": ["Pattern 1", "Pattern 2"],
    "bottlenecks": ["Bottleneck 1"],
    "suggestions": ["Suggestion 1", "Suggestion 2"]
  },
  "stats": {
    "total_tasks": 12,
    "completed_tasks": 7,
    "completion_rate": 58.3,
    "total_focus_minutes": 750,
    "focus_sessions_count": 6
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid week_start or no data for the week
- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: AI generation or database error

---

### 2. Get Weekly Reviews

Fetch past weekly reviews for the authenticated user.

**Endpoint:** `GET /api/weekly-reviews`

**Authentication:** Required

**Query Parameters:**
- `limit` (optional): Number of reviews to return (default: 10, max: 50)
- `offset` (optional): Pagination offset (default: 0)
- `week_start` (optional): Filter by specific week (YYYY-MM-DD format)

**Response (200 OK):**
```json
{
  "reviews": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "week_start": "2026-01-20",
      "reflection": "Review text",
      "achievements": ["Achievement 1"],
      "next_week_goals": ["Goal 1"],
      "energy_level": "high",
      "created_at": "2026-01-25T10:00:00Z",
      "updated_at": "2026-01-25T10:00:00Z"
    }
  ],
  "total": 5,
  "limit": 10,
  "offset": 0
}
```

**Error Responses:**
- `400 Bad Request`: Invalid query parameters
- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Database error

---

### 3. Create/Update Manual Review

Create a new weekly review or update an existing one manually.

**Endpoint:** `POST /api/weekly-reviews`

**Authentication:** Required

**Request Body:**
```json
{
  "week_start": "2026-01-20",     // Required, YYYY-MM-DD format, must be Monday
  "reflection": "My weekly reflection",  // Optional
  "achievements": ["Completed project A"],  // Optional
  "next_week_goals": ["Start project B"],   // Optional
  "energy_level": "high"  // Optional: "low", "medium", or "high"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "week_start": "2026-01-20",
  "reflection": "My weekly reflection",
  "achievements": ["Completed project A"],
  "next_week_goals": ["Start project B"],
  "energy_level": "high",
  "created_at": "2026-01-25T10:00:00Z",
  "updated_at": "2026-01-25T10:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: Missing week_start, invalid format, or not Monday
- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Database error

---

## Database Schema

### `weekly_reviews` table

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PRIMARY KEY |
| user_id | uuid | FOREIGN KEY → users.id, NOT NULL |
| week_start | date | NOT NULL |
| reflection | text | NULLABLE |
| achievements | text[] | NULLABLE |
| next_week_goals | text[] | NULLABLE |
| energy_level | text | NULLABLE, CHECK(low/medium/high) |
| created_at | timestamptz | DEFAULT now() |
| updated_at | timestamptz | DEFAULT now() |

**Unique Constraint:** `(user_id, week_start)` - prevents duplicate reviews for same week

**Indexes:**
- `idx_weekly_reviews_user_id` - query by user
- `idx_weekly_reviews_week_start` - query by week
- `idx_weekly_reviews_user_week` - combined index for common queries

---

## AI Insights Generation

The `/generate` endpoint uses Claude Sonnet 4 to analyze:

1. **Task Statistics**: Total, completed, in-progress, completion rate
2. **Priority Distribution**: Urgent/High/Medium/Low task breakdown
3. **Focus Time**: Total minutes and session count
4. **Tags Distribution**: Most common task categories
5. **Task Details**: Titles, statuses, priorities for context

**AI Output:**
- **Completion Summary**: Brief overview of week's productivity
- **Productivity Patterns**: Identified work patterns and trends
- **Bottlenecks**: Challenges or blockers observed
- **Achievements**: Notable accomplishments and wins
- **Suggestions**: Actionable recommendations for next week

---

## Example Usage

### Generate Review for This Week

```typescript
const response = await fetch('/api/weekly-reviews/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    week_start: '2026-01-20',
  }),
})

const { review, insights, stats } = await response.json()
console.log(insights.completion_summary)
console.log(insights.suggestions)
```

### Get Past Reviews

```typescript
const response = await fetch('/api/weekly-reviews?limit=5')
const { reviews, total } = await response.json()

reviews.forEach(review => {
  console.log(`Week ${review.week_start}: ${review.achievements?.length || 0} achievements`)
})
```

### Update Energy Level

```typescript
await fetch('/api/weekly-reviews', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    week_start: '2026-01-20',
    energy_level: 'high',
  }),
})
```

---

## Notes

- Week start date **must be Monday** (validation enforced)
- Reviews are **unique per user per week** (upsert behavior)
- AI generation requires at least 1 task in the week
- Focus sessions are **optional** (will use 0 if none found)
- Manual updates preserve AI-generated content (upsert merges fields)
- All endpoints require user authentication via Supabase session cookies
