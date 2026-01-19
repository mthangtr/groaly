# Discovery Report: Full Feature Implementation

**Generated**: 2026-01-19  
**Purpose**: Complete gap analysis between current codebase and SYSTEM_SPEC requirements

---

## Executive Summary

**Current State**: Foundation phase ~70% complete
- ✅ Database schema (7 tables with RLS)
- ✅ Auth system (Supabase magic links)
- ✅ UI scaffolding (27 shadcn/ui components, 15 pages)
- ✅ Component patterns established
- ❌ Backend API integration (0%)
- ❌ AI features (0%)
- ❌ Rich text editor (0%)
- ❌ Real-time sync (0%)

**UI/UX Status**: 100% designed and scaffolded with mock data
**Implementation Gap**: Backend integration + AI features

---

## 1. Architecture Snapshot

### App Structure (Next.js 16 App Router)
```
app/
├── (auth)/login, callback        # ✅ Magic link auth working
├── (dashboard)/                  # ✅ Protected route group
│   ├── notes/[id]               # ✅ UI only (no Tiptap)
│   ├── kanban/                  # ✅ UI only (no dnd)
│   ├── calendar/                # ✅ UI only (no drag)
│   ├── table/                   # ✅ UI only (mock data)
│   ├── focus/[taskId]/          # ✅ Pomodoro UI (no persistence)
│   └── settings/                # ✅ Form UI (no save)
└── api/                         # ❌ Only auth callback exists
```

### Components (29 total)
- **UI (27)**: shadcn/ui base-mira components ✅
- **Layout (1)**: AppSidebar with goals visualization ✅
- **AI (1)**: ChatWidget UI shell ✅
- **Missing**: NoteEditor (Tiptap), RelatedTasksPanel, FocusCelebration

### Database Schema ✅
**7 tables fully defined:**
- users (extends auth.users)
- notes (title + content TEXT, no JSONB yet)
- tasks (comprehensive fields matching spec)
- protected_slots
- chat_messages
- weekly_reviews
- focus_sessions

**Migrations**: 2 applied (schema + RLS policies)

---

## 2. Existing Patterns (Reusable)

### Auth Pattern ✅
- **Server Client**: `lib/supabase/server.ts` (SSR-ready)
- **Browser Client**: `lib/supabase/client.ts`
- **Middleware Pattern**: Exists in `lib/supabase/middleware.ts` (not wired to root yet)
- **Context**: `AuthContext` + `useAuth` hook
- **Flow**: Magic link → `/auth/callback` → session storage

### Component Pattern ✅
```typescript
"use client" // Explicit for client features
import * as React from "react" // Namespace import
import { cva, VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const variants = cva("base", { variants: {...} })
function Component({ className, ...props }: Props) {
  return <div className={cn(variants({...}), className)} {...props} />
}
```

### API Pattern 🚧 (Template only)
```typescript
// app/api/*/route.ts
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('table').select()
  if (error) return NextResponse.json({ error }, { status: 400 })
  return NextResponse.json({ data })
}
```

### Styling Pattern ✅
- Tailwind 4 with CSS variables (OKLCH colors)
- `cn()` utility for className merging
- CVA for component variants
- `data-slot` attributes for sub-components
- No custom CSS files

---

## 3. Technical Constraints

### Stack
- **Runtime**: Bun 1.3.6 (Node v24.8.0 compatible)
- **Framework**: Next.js 16.1.3 + React 19.2.3
- **TypeScript**: v5 strict mode
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **AI**: OpenRouter API key required

### Dependencies (19 total)
**Installed:**
- UI: @base-ui/react, shadcn, lucide-react, sonner
- Styling: tailwindcss 4, class-variance-authority, clsx
- Backend: @supabase/supabase-js, @supabase/ssr
- Utils: date-fns, next-themes

**Missing (from spec):**
- Rich text: tiptap, @tiptap/react, @tiptap/starter-kit
- Drag-drop: @dnd-kit/core, @dnd-kit/sortable
- Table: @tanstack/react-table
- Calendar: fullcalendar or custom
- AI: ai (Vercel AI SDK), @openrouter/ai-sdk-provider
- Validation: zod
- State: zustand (optional - using Context now)
- PWA: next-pwa (Phase 5)

### Environment Variables
```bash
# ✅ Configured
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

# ❌ Not yet added
OPENROUTER_API_KEY
ENCRYPTION_KEY (for BYOK feature)
```

---

## 4. Gap Analysis by Feature (SYSTEM_SPEC)

### Feature 1: Rich Text Note Editor 🔴 (0%)
**Spec**: Tiptap with auto-save, markdown shortcuts, search
**Have**: Basic textarea, mock notes list
**Need**:
- Install Tiptap + extensions
- Create NoteEditor component
- Implement auto-save (debounced)
- Update DB schema: `content TEXT` → `content JSONB`
- Add trigger: `content_text` for full-text search
- Search implementation

**Risk**: MEDIUM (well-documented library)

---

### Feature 2: AI Task Extraction 🔴 (0%)
**Spec**: Button → Claude API → Structured tasks with Zod
**Have**: "Plan this" button (non-functional), chat UI shell
**Need**:
- Install: ai, @openrouter/ai-sdk-provider, zod
- API route: `/api/ai/extract-tasks`
- Structured output schema with Zod
- Task creation flow
- Error handling + retry logic

**Risk**: HIGH (external API integration, new to codebase)

---

### Feature 3: AI Chat Assistant 🔴 (0%)
**Spec**: Streaming chat with tool calling (8 commands)
**Have**: ChatWidget UI with mock responses
**Need**:
- API route: `/api/ai/chat` (streaming)
- Vercel AI SDK integration
- Tool definitions (extract_tasks, update_task, search_tasks, etc.)
- Message persistence (chat_messages table)
- Context injection (user tasks, notes, calendar)

**Risk**: HIGH (complex tool calling, streaming)

---

### Feature 4: Smart Daily Suggestions 🔴 (0%)
**Spec**: Morning dashboard with top 3 prioritized tasks
**Have**: DailySuggestions UI component (mock data)
**Need**:
- API route: `/api/ai/suggestions`
- Selection algorithm:
  - Filter: due today/overdue/high priority
  - Remove blocked (dependencies)
  - Sort: priority → due date → time
  - Balance: sum(time) <= working hours
- Database queries with proper filtering

**Risk**: LOW (pure logic, no external API)

---

### Feature 5: Realtime Kanban Board 🟡 (30%)
**Spec**: dnd-kit with Supabase Realtime sync
**Have**: Kanban UI layout, columns, task cards
**Need**:
- Install: @dnd-kit/core, @dnd-kit/sortable
- Drag-and-drop handlers
- Supabase Realtime subscription
- Optimistic UI updates
- Conflict resolution

**Risk**: MEDIUM (Realtime subscriptions, drag-drop state)

---

### Feature 6: AI-Powered Calendar View 🟡 (40%)
**Spec**: FullCalendar with AI scheduling, drag-drop
**Have**: Weekly calendar UI shell
**Need**:
- Install FullCalendar or build custom
- AI scheduling algorithm
- Drag-drop reschedule
- Density visualization (colors)
- "Optimize my week" button → AI rebalancing

**Risk**: MEDIUM (Calendar library integration, AI logic)

---

### Feature 7: Table/Database View 🟡 (50%)
**Spec**: TanStack Table with inline edit, filters, export
**Have**: Table UI with sorting/filtering (mock data)
**Need**:
- Install @tanstack/react-table
- Inline editing (cell edit mode)
- Multi-select filters
- Bulk actions
- CSV/JSON export
- Virtual scrolling for >100 tasks

**Risk**: MEDIUM (Complex table state, inline editing)

---

### Feature 8: Focus Mode / Blitz Mode 🟡 (60%)
**Spec**: Fullscreen + PiP timer + ambient sounds + celebration
**Have**: Pomodoro timer UI, basic layout
**Need**:
- Fullscreen API integration
- PiP (Picture-in-Picture) timer
- Ambient sound player (audio files)
- Session persistence (focus_sessions table)
- Completion celebration (confetti library)
- Distraction prevention (notifications API)

**Risk**: MEDIUM (Browser APIs, audio management)

---

### Feature 9: Protected Slots 🔴 (0%)
**Spec**: Recurring slots, AI respects them
**Have**: protected_slots table, settings UI mockup
**Need**:
- CRUD for protected slots
- Recurrence logic (RRULE parsing)
- Calendar visualization (borders, stripes)
- AI scheduling constraint integration

**Risk**: LOW (CRUD logic, CSS styling)

---

### Feature 10: Compassionate Accountability 🔴 (0%)
**Spec**: Evening motivation handling, philosophical quotes
**Have**: Quote data in mock-data.ts
**Need**:
- Evening detection (time-based trigger)
- Task defer/move/cancel flow
- Quote randomizer
- Behavior logging (for patterns)
- Optional: Notifications API

**Risk**: LOW (UI flow, simple logic)

---

### Feature 11: Weekly AI Review 🔴 (0%)
**Spec**: Auto-generated Sunday 8 PM, charts, suggestions
**Have**: weekly_reviews table
**Need**:
- Cron job or Edge Function trigger
- AI summary generation
- Chart.js or Recharts for visualization
- Interactive suggestions (click to apply)

**Risk**: MEDIUM (Scheduled jobs, chart library)

---

### Feature 12: Related Tasks 🔴 (0%)
**Spec**: Simple rule-based scoring (no embeddings)
**Have**: Algorithm in SYSTEM_SPEC (not implemented)
**Need**:
- API route: `/api/tasks/related/[id]`
- Relatedness scoring function
- RelatedTasksPanel component

**Risk**: LOW (pure logic)

---

### Feature 13: Settings & Customization 🟡 (70%)
**Spec**: Profile, AI preferences, BYOK, privacy
**Have**: Multi-section settings UI
**Need**:
- Profile update API
- API key encryption (AES-256-GCM)
- Protected slots configuration
- Data export (JSON)
- Account deletion flow

**Risk**: LOW (CRUD + encryption library)

---

### Feature 14: PWA / Offline Mode 🔴 (0%)
**Spec**: Service Worker, offline editing, install prompt
**Have**: Nothing
**Need**:
- next-pwa setup
- Service Worker configuration
- IndexedDB for offline queue
- Background sync

**Risk**: MEDIUM (Service Worker complexity)

---

## 5. Missing Infrastructure

### Root Middleware ❌
- File: `middleware.ts` (doesn't exist)
- Pattern exists in `lib/supabase/middleware.ts`
- Need to wire up for server-side auth protection

### API Routes ❌
**Need to create:**
- `/api/tasks` (GET, POST)
- `/api/tasks/[id]` (GET, PATCH, DELETE)
- `/api/tasks/related/[id]`
- `/api/notes` (GET, POST)
- `/api/notes/[id]` (GET, PATCH, DELETE)
- `/api/ai/extract-tasks` (POST)
- `/api/ai/chat` (POST - streaming)
- `/api/ai/suggestions` (GET)
- `/api/ai/optimize-week` (POST)
- `/api/focus-sessions` (POST, GET)
- `/api/weekly-reviews` (GET, POST)
- `/api/protected-slots` (CRUD)

### Error Handling ❌
- No ErrorBoundary component
- No global error handling
- No retry logic

### Loading States ❌
- No Suspense boundaries
- No loading skeletons
- Using LoadingSpinner component (exists but not integrated)

### Testing ❌
- No test framework
- No test files
- Vitest recommended

---

## 6. Dependencies to Install

### Priority 1 (Core Features)
```bash
bun add ai @openrouter/ai-sdk-provider zod
bun add @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
bun add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
bun add @tanstack/react-table
```

### Priority 2 (Enhanced Features)
```bash
bun add canvas-confetti  # Focus celebration
bun add recharts         # Weekly review charts
bun add idb              # Offline storage
```

### Priority 3 (PWA - Phase 5)
```bash
bun add next-pwa workbox-webpack-plugin
```

---

## 7. Database Migrations Needed

### Migration 003: Note Content JSONB
```sql
ALTER TABLE notes 
  ALTER COLUMN content TYPE JSONB USING content::JSONB;

-- Add full-text search column
ALTER TABLE notes ADD COLUMN content_text TEXT;

-- Trigger to keep content_text in sync
CREATE OR REPLACE FUNCTION update_note_content_text()
RETURNS TRIGGER AS $$
BEGIN
  NEW.content_text := NEW.content::TEXT;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_note_content_text_trigger
  BEFORE INSERT OR UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_note_content_text();
```

### Migration 004: Task Dependencies Array
```sql
-- Already defined in schema, verify it exists
-- dependencies UUID[]
```

---

## 8. External References

### Tiptap Documentation
- Getting started: https://tiptap.dev/docs/editor/getting-started
- React integration: https://tiptap.dev/docs/editor/api/extensions
- Auto-save: https://tiptap.dev/docs/guides/save-document

### Vercel AI SDK
- OpenRouter provider: https://sdk.vercel.ai/providers/openrouter
- Streaming: https://sdk.vercel.ai/docs/ai-sdk-ui/streaming
- Tool calling: https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling

### dnd-kit
- React: https://docs.dndkit.com/introduction/getting-started
- Sortable: https://docs.dndkit.com/presets/sortable

### TanStack Table
- React: https://tanstack.com/table/latest/docs/framework/react/react-table

---

## 9. Coding Patterns to Follow

### API Route Pattern
```typescript
import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { data, error } = await supabase
      .from('table')
      .select('*')
      .eq('user_id', user.id)
    
    if (error) throw error
    
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
```

### Supabase Query Pattern
```typescript
// In pages or API routes
const supabase = await createClient()

// Always filter by user_id (RLS handles this but be explicit)
const { data, error } = await supabase
  .from('tasks')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false })
```

### Realtime Subscription Pattern
```typescript
"use client"

React.useEffect(() => {
  const supabase = createClient()
  
  const channel = supabase
    .channel('tasks-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'tasks',
      filter: `user_id=eq.${user.id}`
    }, (payload) => {
      // Update local state
    })
    .subscribe()
  
  return () => {
    supabase.removeChannel(channel)
  }
}, [user.id])
```

---

## 10. Summary

### Strengths ✅
- **Solid foundation**: DB schema, auth, UI scaffolding complete
- **Established patterns**: Component, styling, auth patterns ready to reuse
- **Type safety**: Strict TypeScript, generated DB types
- **Modern stack**: Next.js 16, React 19, Tailwind 4

### Critical Gaps 🔴
- **No backend integration**: 0 API routes for core features
- **No AI features**: 0% of AI functionality implemented
- **No rich text editing**: Tiptap not integrated
- **No real-time sync**: Supabase Realtime not used
- **Missing dependencies**: 9+ libraries need to be installed

### Recommended Approach
1. **Phase 1**: Install dependencies + create API routes (1 week)
2. **Phase 2**: Integrate Tiptap + AI extraction (1 week)
3. **Phase 3**: Implement views (Kanban, Calendar, Table) (1.5 weeks)
4. **Phase 4**: Focus Mode + advanced features (1.5 weeks)
5. **Phase 5**: Polish + PWA (1 week)

**Total estimated**: 6 weeks to full MVP with all features

---

**Next Step**: Create approach document with risk assessment and execution strategy.
