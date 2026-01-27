# dumtasking - Complete System Specification

**Document Purpose:** Consolidated technical specification for AI agents to build dumtasking.  
**Consolidates:** Product Brief, PRD, UX Design, Architecture

---

## 1. Product Overview

### What is dumtasking?

An AI-powered personal productivity companion that transforms chaotic notes into balanced, actionable task orchestration through conversational AI.

**Tagline:** "Dump your notes, AI Agents handle the rest"

**Core Philosophy - "Vibe Tasking":**  
Just as "Vibe Coding" uses AI to handle development heavy-lifting, "Vibe Tasking" uses AI to handle planning, scheduling, and organizing so users can focus on execution and growth.

### Core Problem Solved

Knowledge workers juggling multiple life goals (e.g., startup + dev learning + Japanese) experience:
- **Goal neglect:** Focus on one goal → others disappear for weeks/months
- **Planning friction:** Setting up task systems kills the planning habit
- **No orchestration:** Existing tools don't auto-balance multiple goals
- **Guilt loops:** Evening motivation drops lead to guilt and tool abandonment

### Key Differentiators

1. **Zero-Friction Planning:** Dump notes → AI instantly creates prioritized, scheduled tasks
2. **Multi-Goal Orchestration:** AI auto-balances 3+ life goals (prevents neglect)
3. **Compassionate Accountability:** Non-judgmental evening options + philosophical quotes
4. **Integrated Execution:** Focus Mode with Pomodoro + PiP timer (not just planning)
5. **Conversational Control:** AI Chat as primary interface (not forms/buttons)

---

## 2. Target Users

### Primary Persona: Multi-Goal Individual

**Characteristics:**
- Juggling 2-5 major life goals simultaneously
- High ambition with limited time/energy
- Web-first workflow (productivity tools part of daily ritual like email)
- Prefer AI assistance over manual planning

**Example - mthangtr:**
- 25-year-old developer + startup founder + Japanese N3 learner
- Pain: "Focus vào 1 cái thì bỏ qua 2 cái" (2 months neglecting Japanese)
- Need: AI orchestrator that balances all 3 goals automatically

### User Journey Critical Moments

1. **Aha Moment (Morning):** "Wow, it balanced all my goals automatically!"
2. **Relief Moment (Evening):** Compassionate options when motivation drops, no guilt
3. **Empowerment Moment (Weekly Review):** "I finally have a companion that understands me"

---

## 3. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript | Modern React, Server Components |
| **UI Library** | shadcn/ui (mira style, zinc theme), Tailwind CSS 4 | Clean minimalist aesthetic |
| **Icons** | lucide-react | Clean line icons |
| **Backend** | Supabase (PostgreSQL, Auth, Realtime, Storage) | Serverless BaaS |
| **AI** | Vercel AI SDK + OpenRouter (Claude, Gemini) | Model flexibility, streaming |
| **Deployment** | Vercel (Edge Functions, CDN) | Global, auto-scaling |
| **Package Manager** | bun | Fast |

### shadcn/ui Configuration

```bash
bunx --bun shadcn@latest create --preset "https://ui.shadcn.com/init?base=base&style=mira&baseColor=zinc&theme=zinc&iconLibrary=lucide&font=inter&menuAccent=subtle&menuColor=default&radius=default&template=next" --template next
```

---

## 4. Design Philosophy

### Core Principles

- **Clean & Ghost-like:** Interfaces that feel effortless and invisible
- **Minimal Noise:** Remove unnecessary elements, focus on what matters
- **Intuitive Clarity:** Users understand functionality without excessive text
- **Cleanliness First:** Every pixel serves a purpose, whitespace is intentional

### Visual Design

- **Style:** mira (subtle, refined)
- **Color Palette:** zinc (neutral, professional monochrome)
- **Typography:** Inter font
- **Icons:** lucide (clean, minimal line icons)
- **Radius:** default (balanced rounded corners)

---

## 5. Database Schema

### Core Tables

#### `users`

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  working_hours JSONB DEFAULT '{"start": "09:00", "end": "18:00"}',
  preferences JSONB DEFAULT '{
    "llm_model": "claude-3.7-sonnet",
    "time_tracking_enabled": false,
    "pomodoro_duration": 25,
    "break_duration": 5,
    "daily_suggestions_enabled": true
  }',
  api_keys JSONB DEFAULT '{}', -- Encrypted BYOK keys
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `notes`

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Untitled Note',
  content JSONB NOT NULL, -- Tiptap JSON format
  content_text TEXT, -- Plain text for search (trigger-generated)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_updated_at ON notes(user_id, updated_at DESC);
CREATE INDEX idx_notes_content_text_fts ON notes USING gin(to_tsvector('english', content_text));
```

#### `tasks`

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  note_id UUID REFERENCES notes(id) ON DELETE SET NULL,
  
  -- Core Fields
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- AI-Generated Metadata
  goal TEXT, -- e.g., "Japanese N3", "dumtasking MVP"
  tags TEXT[],
  estimated_time_minutes INTEGER,
  energy_level TEXT CHECK (energy_level IN ('low', 'medium', 'high')),
  
  -- Scheduling
  scheduled_at TIMESTAMPTZ,
  due_date DATE,
  completed_at TIMESTAMPTZ,
  
  -- Dependencies
  dependencies UUID[], -- Task IDs that must complete first
  
  -- Future: Knowledge Graph
  embedding vector(1536), -- Nullable, future-ready
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status_priority ON tasks(user_id, status, priority DESC);
CREATE INDEX idx_tasks_scheduled_at ON tasks(user_id, scheduled_at) WHERE scheduled_at IS NOT NULL;
CREATE INDEX idx_tasks_goal ON tasks(user_id, goal) WHERE goal IS NOT NULL;
CREATE INDEX idx_tasks_tags ON tasks USING gin(tags);
```

#### `protected_slots`

```sql
CREATE TABLE protected_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_type TEXT DEFAULT 'focus' CHECK (slot_type IN ('focus', 'break', 'meeting', 'personal')),
  label TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `chat_messages`

```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  tool_calls JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `weekly_reviews`

```sql
CREATE TABLE weekly_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  completion_rate DECIMAL(5,2),
  goals_distribution JSONB,
  insights JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_weekly_reviews_user_week ON weekly_reviews(user_id, week_start);
```

#### `focus_sessions`

```sql
CREATE TABLE focus_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  duration_minutes INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);
```

### Row-Level Security

Enable RLS on all user-owned tables. Example:

```sql
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own tasks"
  ON tasks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
  ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE USING (auth.uid() = user_id);
```

---

## 6. Application Structure

### Next.js App Router Structure

```
app/
├── layout.tsx                    # Root layout: providers, fonts
├── page.tsx                      # Landing / Dashboard
├── globals.css                   # Tailwind + custom CSS
│
├── (auth)/
│   ├── login/page.tsx            # Magic link login
│   └── callback/page.tsx         # Auth callback
│
├── (dashboard)/
│   ├── layout.tsx                # Dashboard layout: sidebar, header, chat widget
│   ├── notes/
│   │   ├── page.tsx              # Notes list
│   │   └── [id]/page.tsx         # Note editor
│   ├── kanban/page.tsx           # Kanban board
│   ├── calendar/page.tsx         # Calendar view
│   ├── table/page.tsx            # Table/database view
│   ├── focus/[taskId]/page.tsx   # Focus Mode (fullscreen)
│   └── settings/page.tsx         # User settings
│
└── api/
    ├── auth/callback/route.ts
    ├── ai/
    │   ├── extract-tasks/route.ts
    │   ├── chat/route.ts
    │   ├── suggestions/route.ts
    │   └── optimize-week/route.ts
    ├── tasks/
    │   ├── route.ts              # GET/POST
    │   ├── [id]/route.ts         # GET/PATCH/DELETE
    │   └── related/[id]/route.ts
    └── notes/
        ├── route.ts
        └── [id]/route.ts
```

### Component Structure

```
components/
├── ui/                           # shadcn/ui primitives
│
├── layout/
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   └── DashboardLayout.tsx
│
├── notes/
│   ├── NoteEditor.tsx            # Tiptap rich text
│   ├── NotesList.tsx
│   ├── NoteCard.tsx
│   └── NoteToolbar.tsx
│
├── tasks/
│   ├── TaskCard.tsx
│   ├── TaskModal.tsx
│   ├── TaskFilters.tsx
│   ├── TaskQuickActions.tsx
│   └── RelatedTasksPanel.tsx
│
├── views/
│   ├── KanbanBoard.tsx           # dnd-kit
│   ├── KanbanColumn.tsx
│   ├── CalendarView.tsx          # FullCalendar or custom
│   ├── TableView.tsx             # TanStack Table
│   └── ViewSwitcher.tsx
│
├── ai/
│   ├── ChatWidget.tsx            # Floating bottom-right
│   ├── ChatMessage.tsx
│   ├── ChatInput.tsx
│   ├── SuggestionPanel.tsx
│   └── ExtractTasksButton.tsx
│
├── focus/
│   ├── FocusMode.tsx             # Fullscreen
│   ├── PipTimer.tsx              # Picture-in-Picture
│   ├── PomodoroTimer.tsx
│   └── FocusCelebration.tsx
│
└── common/
    ├── LoadingSpinner.tsx
    ├── ErrorBoundary.tsx
    └── ConfirmDialog.tsx
```

---

## 7. Features Specification

### Feature 1: Rich Text Note Editor

**Technology:** Tiptap

**Requirements:**
- Basic formatting: bold, italic, lists, headings
- Auto-save every 2 seconds (debounced)
- Markdown shortcuts support
- Notes list with search/filter
- Character/word count
- Responsive design
- Paste support from any source

**Implementation:**
- Store content as JSONB (Tiptap JSON format)
- Generate plain text for full-text search via trigger

---

### Feature 2: AI Task Extraction

**Entry Points:**
- "Plan this" button on notes
- AI Chat command `/plan`
- Slash commands

**AI Processing:**
- Vercel AI SDK + OpenRouter
- Primary: Claude 3.7 Sonnet (quality)
- Secondary: Gemini 2.0 Flash (speed)
- Structured output via Zod schemas

**Task Schema:**

```typescript
const TaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  goal: z.string().optional(),
  tags: z.array(z.string()).default([]),
  estimated_time_minutes: z.number(),
  energy_level: z.enum(['low', 'medium', 'high']),
  dependencies: z.array(z.string()).default([])
})
```

**AI Logic:**
- Smart prioritization (urgency + importance keywords)
- Workload balancing (max 8h/day, complex tasks → morning)
- Dependency detection (semantic understanding)
- Time-aware scheduling (respects working hours)

---

### Feature 3: AI Chat Assistant

**UI:** Floating widget (bottom-right, expandable 400x600px)

**Quick Action Commands:**
- `/plan-week` - Plan week from all unprocessed notes
- `/optimize-today` - Rebalance today's schedule
- `/whats-next` - Suggest next task
- `/find-blockers` - Find blocking dependencies
- `/prep-tomorrow` - Prepare tomorrow's schedule
- `/summarize-week` - Weekly progress summary

**Tool Calling Functions:**
- `extract_tasks(note_id)`
- `update_task(task_id, updates)`
- `search_tasks(query)`
- `reschedule_tasks(task_ids, new_dates)`
- `generate_summary(date_range)`
- `optimize_schedule(date_range)`
- `find_blockers()`
- `suggest_next_task(time, energy_level)`

**Implementation:**
- Streaming responses (Vercel AI SDK)
- Message history persisted
- Context-aware (access to notes, tasks, calendar, preferences)

---

### Feature 4: Smart Daily Suggestions

**Morning Dashboard Shows:**
- Personalized greeting
- Top 3 tasks (due/overdue, high priority, no blockers, realistic time)
- Quick insights (overdue count, blocked count, yesterday's wins)
- Suggested schedule with time estimates
- One-click "Start" buttons → Focus Mode

**Selection Algorithm:**
1. Filter: `status = 'todo' AND (due_date = today OR due_date < today OR priority = 'high')`
2. Remove blocked tasks (dependencies not complete)
3. Sort by: Priority → Due date → Estimated time
4. Balance: Select until sum(time) <= user's working hours

---

### Feature 5: Realtime Kanban Board

**Technology:** dnd-kit

**Columns:** To Do / In Progress / Done (or Today / This Week / Backlog)

**Features:**
- Drag-and-drop between columns
- Supabase Realtime sync (<1s)
- Task cards: title, priority badge, time estimate
- Color-coding: red (high), yellow (medium), gray (low)
- Quick filters, bulk actions
- Responsive touch support

---

### Feature 6: AI-Powered Calendar View

**Technology:** FullCalendar or custom

**Features:**
- Week view primary, month optional
- Tasks auto-assigned by AI (priority, dependencies, time, energy)
- Drag-and-drop to reschedule
- Visual density: Green (<6h), Yellow (6-8h), Red (>8h)
- "Optimize my week" button
- Time block visualization

---

### Feature 7: Table/Database View

**Technology:** TanStack Table v8

**Columns:**
- Title (inline editable)
- Status, Priority (inline dropdowns)
- Due Date (date picker)
- Estimated Time
- Source Note (link)
- Dependencies, Tags
- Created/Completed dates

**Features:**
- Sortable columns
- Multi-select filters
- Full-text search
- Bulk actions (status, priority, reschedule, delete)
- Column customization (show/hide, reorder)
- Virtual scrolling for >100 tasks
- CSV/JSON export

---

### Feature 8: Focus Mode / Blitz Mode

**Entry Points:**
- Task "Start" button
- AI Chat command
- Daily Suggestions

**Features:**
- Fullscreen API (immersive)
- PiP Floating Timer (Picture-in-Picture API, stays on top)
- Pomodoro Timer (25/5 customizable, long break after 4)
- Ambient sounds (white noise, rain, coffee shop, forest, ocean)
- Distraction prevention (block notifications, tab title indicator)
- Task completion celebration (confetti, sound)
- Session logging for insights

---

### Feature 9: Defend Focus Time / Protected Slots

**Configuration:**
- Recurring protected slots (days, time range)
- Types: Protected (no tasks) / Focus Only (only high-priority)
- AI scheduling respects protected slots
- Auto-schedule breaks (15min after 2h, 30min lunch)

**Calendar Visualization:**
- Protected slots: Green border, diagonal stripe
- Auto-breaks: Light blue, coffee/yoga icon

---

### Feature 10: Compassionate Accountability

**Evening Motivation Drop Handling:**
- Non-judgmental options: Defer, Move to weekend, Cancel
- Philosophical quotes for reflection (Vietnamese)
- Behavior logging (no shame, just data)
- Pattern-based suggestions

**Example Quotes:**
- "Vì sợ mình không phải là ngọc, nên tôi không dám khổ công mài giũa; lại vì có chút tin mình là ngọc, nên tôi không cam lòng đứng lẫn với đá sỏi."

**Task Importance Field:** "Why is this task important?" - maintains purpose

---

### Feature 11: Weekly AI Review

**Auto-generated:** Sunday 8 PM (user's timezone)

**Sections:**
- Completion rate (X/Y tasks, percentage)
- Goal distribution (pie chart: Startup 70%, Dev 18%, Japanese 12%)
- Pattern recognition (bottlenecks, productive times)
- Suggestions for next week
- Interactive: Click suggestions to auto-apply

---

### Feature 12: Related Tasks (Simple Logic - No Embeddings for MVP)

**Algorithm:**

```typescript
function calculateRelatednessScore(task1: Task, task2: Task): number {
  let score = 0;
  
  // Same note origin (strongest)
  if (task1.note_id && task1.note_id === task2.note_id) score += 10;
  
  // Same goal
  if (task1.goal && task1.goal === task2.goal) score += 8;
  
  // Common tags
  const commonTags = task1.tags?.filter(tag => task2.tags?.includes(tag)) || [];
  score += commonTags.length * 3;
  
  // Time proximity (same day/week)
  if (withinSameDay(task1.scheduled_at, task2.scheduled_at)) score += 5;
  else if (withinSameWeek(...)) score += 2;
  
  // Dependency relationship
  if (task1.dependencies?.includes(task2.id) || task2.dependencies?.includes(task1.id)) {
    score += 15;
  }
  
  return score;
}
```

---

### Feature 13: Settings & Customization

**Sections:**
- Profile: Name, timezone, working hours
- AI Preferences: LLM model (Claude, Gemini)
- API Keys (BYOK): OpenRouter/OpenAI keys (encrypted)
- Privacy: Toggle analytics, data export (JSON), account deletion
- Protected Slots configuration
- Pomodoro preferences
- Time tracking toggle (default OFF)

---

### Feature 14: PWA / Offline Mode

**Capabilities:**
- Service Worker for offline functionality
- Offline note editing with sync queue
- Install prompt for desktop/mobile
- Background sync when reconnected

---

## 8. API Specifications

### Tasks API

```typescript
// GET /api/tasks?status=todo&priority=high&goal=Japanese N3
Response: { tasks: Task[], count: number }

// POST /api/tasks
Body: { title, description?, priority, goal?, tags?, estimated_time_minutes?, scheduled_at? }
Response: { task: Task }

// PATCH /api/tasks/[id]
Body: Partial<Task>
Response: { task: Task }

// DELETE /api/tasks/[id]
Response: { success: boolean }

// GET /api/tasks/related/[id]
Response: { related_tasks: Task[], reasoning: string }
```

### Notes API

```typescript
// GET /api/notes
Response: { notes: Note[], count: number }

// POST /api/notes
Body: { title?, content: TiptapJSON }
Response: { note: Note }

// PATCH /api/notes/[id]
Body: { title?, content? }
Response: { note: Note }

// DELETE /api/notes/[id]
Response: { success: boolean }
```

### AI API

```typescript
// POST /api/ai/extract-tasks
Body: { note_id: string, content: string }
Response: { tasks: Task[], reasoning: string }

// POST /api/ai/chat (streaming)
Body: { messages: Message[] }
Response: ReadableStream

// GET /api/ai/suggestions
Response: {
  suggestions: Array<{ task: Task, reasoning: string }>,
  insights: { workload: 'light'|'balanced'|'heavy', blocked_tasks: number, urgent_tasks: number }
}

// POST /api/ai/optimize-week
Body: { week_start: string }
Response: { optimized_schedule: Array<{ task_id, scheduled_at }>, reasoning: string }
```

---

## 9. State Management

### Strategy

- **React Context:** User auth, global preferences
- **Zustand:** UI state (modals, filters, chat open/close)
- **Supabase Realtime:** Database sync across views

### Optimistic UI Pattern

1. Update UI immediately
2. Make API call in background
3. If fails, rollback + show error

---

## 10. Security

### Authentication

- Supabase Auth with magic links (passwordless)
- JWT tokens (7-day expiry)
- httpOnly cookies

### Authorization

- Row-Level Security on all tables
- `auth.uid() = user_id` filter on all queries

### API Key Security

- User BYOK keys encrypted with AES-256-GCM
- Encryption key from environment variable

### Rate Limiting

- AI Chat: 50 messages/hour per user
- Task Extraction: 20 operations/hour per user
- API requests: 100 requests/minute per user

---

## 11. Performance Targets

- **Page Load:** <2s First Contentful Paint
- **Navigation:** <500ms client-side
- **AI Task Extraction:** <5s
- **AI Chat:** <2s first token (streaming)
- **Realtime Sync:** <1s cross-view
- **Drag-and-drop:** <100ms response

---

## 12. Development Phases

### Phase 1: Foundation (Weeks 1-3)

1. User Authentication & Profile Setup
2. Database Schema & Migrations
3. Rich Text Note Editor
4. Settings & Customization

### Phase 2: AI Intelligence (Weeks 4-6)

5. AI Task Extraction
6. AI Chat Assistant
7. Smart Daily Suggestions

### Phase 3: Views & Interactions (Weeks 7-9)

8. Realtime Sync
9. Kanban Board
10. Calendar View
11. Table View

### Phase 4: Advanced & Execution (Weeks 10-12)

12. Related Tasks (simple logic)
13. Protected Slots
14. Focus Mode
15. Compassionate Accountability
16. Weekly AI Review
17. Time Tracking (optional)

### Phase 5: Polish (Weeks 13-14)

18. UI/UX Polish
19. Performance Optimization
20. PWA Setup

---

## 13. Out of Scope (MVP)

- Multi-user collaboration
- Voice input
- Image/PDF OCR
- Custom LLM fine-tuning
- External calendar sync (two-way)
- Browser extensions
- Mobile native apps (PWA sufficient)
- Embedding-based Knowledge Graph (deferred - using simple rule-based logic)

---

## 14. Key Libraries

| Purpose | Library |
|---------|---------|
| Rich Text Editor | tiptap |
| Drag and Drop | dnd-kit |
| Table | TanStack Table v8 |
| Calendar | FullCalendar (or custom) |
| Virtual Scrolling | @tanstack/react-virtual |
| AI SDK | ai (Vercel AI SDK) |
| OpenRouter | @openrouter/ai-sdk-provider |
| Schema Validation | zod |
| State Management | zustand |
| Supabase Client | @supabase/supabase-js |
| Toast Notifications | sonner |
| Date Handling | date-fns |
| IndexedDB | idb |

---

## 15. Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# AI
OPENROUTER_API_KEY=sk-or-v1-...

# Security
ENCRYPTION_KEY=32-byte-hex-string

---

*This document consolidates all planning artifacts into a single actionable specification for AI agents to build dumtasking.*
