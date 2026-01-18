# Approach: dumtasking MVP Implementation

## Executive Summary

**Strategy:** Database-First approach with parallel vertical tracks after foundation. Build complete MVP features (not minimal proofs), validate personally (3 months), then refine based on real usage. Supabase provides backend-as-a-service eliminating infrastructure complexity. HIGH risk components (Supabase Realtime sync, Vercel AI streaming, Tiptap editor, dnd-kit Kanban) require 7-hour spike phase before decomposition.

**Phasing:** Foundation (2-3 days) → Core Features in 3 parallel tracks (5-7 days) → Polish & PWA (2-3 days) = 12-14 weeks target.

**Key Risks:** 4 HIGH-risk components requiring validation spikes; 4 MEDIUM-risk components needing interface sketches; majority LOW-risk using established Next.js/React patterns.

---

## Gap Analysis

### Phase 1: Foundation (Priority)

| Component | Have | Need | Gap | Files Affected |
|-----------|------|------|-----|----------------|
| **Auth System** | None | Magic link auth, profile setup, session mgmt | Full Supabase Auth integration | `app/(auth)/login/page.tsx`<br>`app/(auth)/callback/page.tsx`<br>`app/api/auth/callback/route.ts`<br>`lib/supabase/client.ts`<br>`lib/supabase/server.ts` |
| **Database Schema** | None | 7 tables with RLS, indexes, pgvector setup | Complete PostgreSQL schema + migrations | `supabase/migrations/*.sql`<br>`lib/types/database.ts` |
| **Root Layout** | Basic layout with Inter font | Auth provider, theme provider, toast provider | Add providers, update metadata | `app/layout.tsx`<br>`app/providers/AppProviders.tsx` |
| **Navigation** | None | Sidebar with view switcher, header | Dashboard layout components | `components/layout/Sidebar.tsx`<br>`components/layout/Header.tsx`<br>`app/(dashboard)/layout.tsx` |
| **State Management** | None | Zustand stores for UI state, Realtime hooks | Create stores + hooks | `lib/stores/ui-store.ts`<br>`hooks/useRealtimeTasks.ts`<br>`hooks/useRealtimeNotes.ts` |
| **Dependencies** | 11 packages | +12 new packages (Supabase, AI SDK, Tiptap, etc.) | Install missing deps | `package.json` |

### Phase 2: Core Features - Track A (Notes System)

| Component | Have | Need | Gap | Files Affected |
|-----------|------|------|-----|----------------|
| **Rich Text Editor** | Basic textarea example | Tiptap editor with markdown, auto-save | Full Tiptap integration | `components/notes/NoteEditor.tsx`<br>`lib/tiptap/extensions.ts`<br>`hooks/useAutoSave.ts` |
| **Notes List View** | None | Search, filter, cards, create/edit | Complete list interface | `app/(dashboard)/notes/page.tsx`<br>`components/notes/NotesList.tsx`<br>`components/notes/NoteCard.tsx` |
| **Notes API** | None | CRUD endpoints for notes | Full API implementation | `app/api/notes/route.ts`<br>`app/api/notes/[id]/route.ts` |

### Phase 2: Core Features - Track B (Task Management)

| Component | Have | Need | Gap | Files Affected |
|-----------|------|------|-----|----------------|
| **Kanban Board** | None | 3-column board, dnd-kit, realtime sync | Full Kanban implementation | `app/(dashboard)/kanban/page.tsx`<br>`components/views/KanbanBoard.tsx`<br>`components/views/KanbanColumn.tsx` |
| **Calendar View** | None | Week/month views, drag reschedule, density | FullCalendar integration or custom | `app/(dashboard)/calendar/page.tsx`<br>`components/views/CalendarView.tsx` |
| **Table View** | None | TanStack Table, filters, sort, virtual scroll | Complete table interface | `app/(dashboard)/table/page.tsx`<br>`components/views/TableView.tsx` |
| **Task Components** | Card example exists | Task card, modal, filters, quick actions | Adapt + extend patterns | `components/tasks/TaskCard.tsx`<br>`components/tasks/TaskModal.tsx`<br>`components/tasks/TaskFilters.tsx` |
| **Tasks API** | None | CRUD + related tasks endpoints | Full API implementation | `app/api/tasks/route.ts`<br>`app/api/tasks/[id]/route.ts`<br>`app/api/tasks/related/[id]/route.ts` |

### Phase 2: Core Features - Track C (AI Integration)

| Component | Have | Need | Gap | Files Affected |
|-----------|------|------|-----|----------------|
| **AI Provider Setup** | None | OpenRouter + Vercel AI SDK config | Provider configuration | `lib/ai/provider.ts`<br>`lib/ai/prompts.ts` |
| **Task Extraction** | None | Structured extraction via Zod schemas | Full extraction logic | `app/api/ai/extract-tasks/route.ts`<br>`components/ai/ExtractTasksButton.tsx` |
| **AI Chat Assistant** | None | Streaming chat with tool calling | Full chat implementation | `app/api/ai/chat/route.ts`<br>`components/ai/ChatWidget.tsx`<br>`components/ai/ChatMessage.tsx`<br>`components/ai/ChatInput.tsx` |
| **Daily Suggestions** | None | AI-curated top 3 tasks, morning dashboard | Suggestion logic | `app/api/ai/suggestions/route.ts`<br>`components/ai/SuggestionPanel.tsx` |

### Phase 3: Execution & Polish

| Component | Have | Need | Gap | Files Affected |
|-----------|------|------|-----|----------------|
| **Focus Mode** | None | Fullscreen, PiP timer, Pomodoro, celebrations | Complete focus system | `app/(dashboard)/focus/[taskId]/page.tsx`<br>`components/focus/FocusMode.tsx`<br>`components/focus/PipTimer.tsx`<br>`components/focus/PomodoroTimer.tsx`<br>`components/focus/FocusCelebration.tsx` |
| **Weekly Review** | None | Auto-generation, insights, interactive suggestions | Review generation system | `app/api/ai/weekly-review/route.ts`<br>`components/ai/WeeklyReview.tsx` |
| **Settings Pages** | None | Profile, AI prefs, protected slots, Pomodoro | Settings UI | `app/(dashboard)/settings/page.tsx`<br>`components/settings/ProfileSettings.tsx`<br>`components/settings/AISettings.tsx`<br>`components/settings/ProtectedSlots.tsx` |
| **PWA Setup** | None | Service worker, offline mode, install prompt | PWA implementation | `public/service-worker.js`<br>`app/manifest.json`<br>`lib/pwa/offline-queue.ts` |
| **UI Polish** | 14+ shadcn components | Animations, loading states, error handling | Add polish layers | `components/common/LoadingSpinner.tsx`<br>`components/common/Toast.tsx`<br>`components/common/ErrorBoundary.tsx` |

---

## Recommended Approach

### Phase 1: Foundation (~2-3 days)

**Goal:** Establish infrastructure so all other features can build on solid ground.

#### Day 1: Backend Foundation
1. **Supabase Project Setup**
   - Create Supabase project (CLI: `supabase init`)
   - Install dependencies: `bun add @supabase/supabase-js @supabase/ssr`
   - Configure environment variables (`.env.local`)
   - Set up client/server Supabase instances

2. **Database Schema Migration**
   - Create migration files for all 7 tables
   - Enable RLS policies on all tables
   - Create indexes for performance
   - Set up pgvector extension (for future use, nullable column)
   - Test: Verify tables exist, RLS enforced, migrations idempotent

3. **Authentication Flow**
   - Magic link login page (`app/(auth)/login/page.tsx`)
   - Auth callback handler (`app/api/auth/callback/route.ts`)
   - Session middleware (check auth on dashboard routes)
   - Test: Login flow, redirect to dashboard, logout

#### Day 2: Frontend Foundation
4. **Root Layout & Providers**
   - Add AppProviders wrapper (Auth, Theme, Toast)
   - Update `app/layout.tsx` with providers
   - Configure metadata for SEO
   - Test: User session persists, theme switching works

5. **Dashboard Layout & Navigation**
   - Create Sidebar component (Notes, Kanban, Calendar, Table, Focus, Settings)
   - Create Header component (search, notifications placeholder)
   - Dashboard layout (`app/(dashboard)/layout.tsx`)
   - Test: Navigation between views, active state highlighting

#### Day 3: State Management & Dependencies
6. **State Management Setup**
   - Install Zustand: `bun add zustand`
   - Create UI store (modals, filters, sidebar state)
   - Create Realtime hooks (useRealtimeTasks, useRealtimeNotes)
   - Test: State updates, Realtime subscriptions

7. **Install Remaining Dependencies**
   - AI: `bun add ai @openrouter/ai-sdk-provider zod`
   - Rich Text: `bun add @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder`
   - DnD: `bun add @dnd-kit/core @dnd-kit/sortable`
   - Table: `bun add @tanstack/react-table`
   - Utilities: `bun add date-fns sonner`

---

### Phase 2: Core Features (~5-7 days)

**Strategy:** Run 3 parallel tracks after foundation. Track C (AI) depends on A & B data.

#### Track A: Notes System (~2 days)

8. **Rich Text Editor (Day 4)**
   - Set up Tiptap with extensions (bold, italic, lists, headings, placeholder)
   - Implement markdown shortcuts (e.g., `#` for heading, `*` for bullet)
   - Auto-save hook with 2-second debounce
   - Character/word count indicator
   - Test: Formatting works, auto-save triggers, markdown shortcuts

9. **Notes List & API (Day 5)**
   - Notes list page with search and filter
   - Note card component with preview
   - API routes: `GET/POST /api/notes`, `GET/PATCH/DELETE /api/notes/[id]`
   - Full-text search using PostgreSQL `to_tsvector`
   - Test: CRUD operations, search accuracy, realtime sync

#### Track B: Task Views (~3 days)

10. **Kanban Board (Day 4-5)**
    - Three columns: To Do, In Progress, Done
    - dnd-kit drag-and-drop integration
    - Task card component (reusable across views)
    - Realtime sync on status changes
    - Quick actions dropdown (edit, delete, schedule)
    - Test: Drag-drop updates status, realtime propagates to other views

11. **Calendar View (Day 5-6)**
    - Decision: FullCalendar vs custom component (see Alternative Approaches)
    - Week/month view toggle
    - Drag-to-reschedule task scheduling
    - Visual density indicators (overloaded days highlighted)
    - "Optimize my week" button (calls AI API)
    - Test: Visual layout, drag reschedule, density calculation

12. **Table View (Day 6-7)**
    - TanStack Table v8 with column definitions
    - Sortable columns (priority, due date, status, goal)
    - Multi-select filters (status, priority, goal, tags)
    - Inline editing for quick updates
    - Virtual scrolling for >100 tasks
    - Test: Filtering, sorting, performance with 1000+ tasks

13. **Tasks API (Day 4)**
    - API routes: `GET/POST /api/tasks`, `GET/PATCH/DELETE /api/tasks/[id]`
    - Related tasks endpoint: `GET /api/tasks/related/[id]` (simple rule-based logic)
    - Batch create endpoint for AI extraction
    - Test: CRUD operations, related tasks accuracy

#### Track C: AI Integration (~3 days, starts after Track A/B data available)

14. **AI Provider & Task Extraction (Day 6-7)**
    - Configure OpenRouter with Claude/Gemini models
    - Define Zod schemas for structured task output
    - Implement extraction prompt with user context (working hours, goals, existing tasks)
    - "Plan this" button in note editor
    - Preview modal with editable results before commit
    - Test: Extraction accuracy (85%+ acceptance target), preview editing, batch insert

15. **AI Chat Assistant (Day 7-8)**
    - Streaming chat API: `POST /api/ai/chat`
    - Tool calling functions: `getPendingTasks()`, `analyzeworkload()`, `suggestNextAction()`
    - Floating chat widget (bottom-right, expandable)
    - Message history persistence in `chat_messages` table
    - Quick action buttons: `/plan-week`, `/whats-next`, `/optimize-today`
    - Test: Conversational responses, tool execution, streaming works

16. **Daily Suggestions (Day 8)**
    - Morning dashboard panel with AI-curated top 3 tasks
    - Logic: Priority + blockers + time available + energy level
    - Quick insights: overdue count, blocked tasks, yesterday's wins
    - One-click "Start" buttons launching Focus Mode
    - Test: Suggestion relevance, morning greeting personalization

---

### Phase 3: Execution & Polish (~2-3 days)

17. **Focus Mode (Day 9-10)**
    - Fullscreen page: `app/(dashboard)/focus/[taskId]/page.tsx`
    - Minimalist UI: task title, description, timer only
    - PiP floating timer using Picture-in-Picture API
    - Pomodoro timer (25/5 customizable in settings)
    - Ambient sounds (white noise, rain, coffee shop)
    - Completion celebration: confetti animation, sound effect
    - Test: Fullscreen activation, PiP works, Pomodoro cycle, celebrations

18. **Weekly Review (Day 10)**
    - Auto-generate every Sunday 8 PM (cron job or manual trigger)
    - Report sections: completion rate, goal distribution (pie chart), patterns, bottlenecks
    - Compassionate accountability metrics (evening skip patterns)
    - Interactive suggestions with one-click accept
    - Test: Report generation time (<3s), insights accuracy, actionable suggestions

19. **Settings Pages (Day 11)**
    - Profile settings: name, timezone, working hours
    - AI preferences: model selection, daily suggestions toggle
    - Protected slots: calendar-like interface for focus blocks
    - Pomodoro preferences: duration, break length
    - BYOK: encrypted API key storage (optional)
    - Test: Settings persistence, UI validation

20. **UI/UX Polish (Day 11-12)**
    - Loading skeletons for all async operations
    - Error boundaries with user-friendly messages
    - Toast notifications (sonner) for success/error states
    - Page transitions using Next.js navigation
    - Responsive design testing (1920x1080 desktop, 375px+ mobile)
    - Accessibility audit: keyboard nav, screen reader labels, ARIA attributes
    - Test: No console errors, smooth animations, mobile usable

21. **PWA Setup (Day 12-13)**
    - Service worker for offline note editing
    - Sync queue for operations when offline
    - Install prompt for desktop/mobile
    - App manifest with icons and theme colors
    - Test: Offline editing, sync on reconnect, install flow

22. **Performance Optimization (Day 13-14)**
    - Implement AI response caching (24-hour TTL)
    - Task embedding caching (regenerate only when content changes)
    - Code splitting and lazy loading for heavy components
    - Debounced auto-save (2s)
    - Rate limiting middleware (50 AI msgs/hour, 100 API reqs/min)
    - Test: <2s page loads, <5s AI extraction, <1s realtime sync

---

## Alternative Approaches

### Option A: Database-First (Recommended ✅)

**Process:** Foundation (DB + Auth) → Build features incrementally → Integrate as you go

**Pros:**
- Solid data foundation prevents rework
- Clear contracts between frontend/backend
- Easier to test business logic independently
- Data model validated early (from PRD)
- Parallel track development possible after foundation

**Cons:**
- Delays visual progress slightly (no UI until Day 4)
- Requires discipline to avoid premature optimization
- Backend-heavy developers may over-engineer

**Best for:** This project (stable data model from PRD, solo developer, backend experience)

**Why Chosen:** Data model is well-defined in architecture doc. Building on solid DB foundation reduces risk of schema migrations mid-development.

---

### Option B: UI-First

**Process:** Mock data → Build all views → Integrate backend later

**Pros:**
- Fast visual progress (demo-ready quickly)
- Early user feedback on UI/UX
- Frontend devs can work independently
- Easier to iterate on design

**Cons:**
- High rework risk when backend doesn't match mocks
- Delayed discovery of data model issues
- Harder to test realtime sync without backend
- Can lead to "UI looks good, doesn't work" trap

**Best for:** Projects with uncertain data models, design-heavy apps, teams with separate FE/BE devs

**Why NOT Chosen:** Data model is stable, solo developer context switching is expensive, realtime sync requires backend early.

---

### Option C: Vertical Slices

**Process:** Complete one feature end-to-end (DB → API → UI) before starting next

**Pros:**
- Each feature fully functional quickly
- Early validation of architecture patterns
- Clear milestones (Feature X is DONE)
- Reduces WIP (work in progress)

**Cons:**
- Context switching overhead (DB → API → UI → repeat)
- Pattern inconsistencies if learned lessons aren't retroactively applied
- Harder to parallelize work
- Foundation setup repeated per feature (less DRY)

**Best for:** Teams with multiple developers, microservices architecture, features with independent lifecycles

**Why NOT Chosen:** Solo developer wants to batch similar work (all DB migrations together, all APIs together). Foundation setup is shared across features, so database-first is more efficient.

---

### Option D: MVP-Lite (Deferred Features)

**Process:** Build minimal subset first, validate, then add features

**Pros:**
- Fastest time-to-validation
- Avoids building unused features
- Tight feedback loops

**Cons:**
- Incomplete user experience (can't validate full workflow)
- Feature interdependencies make "lite" scope unclear
- For personal validation, incomplete = not representative

**Why NOT Chosen:** User journeys require complete features (AI extraction depends on notes, Focus Mode depends on task views, weekly review depends on history). "Lite" MVP can't validate multi-goal orchestration thesis.

---

## Risk Map

### HIGH Risk Components (Require Spikes)

| Component | Risk | Reason | Spike Question | Spike Tasks | Est. Time |
|-----------|------|--------|----------------|-------------|-----------|
| **Supabase Realtime Sync** | HIGH | First time using Supabase Realtime with optimistic UI. State management complexity, potential race conditions between optimistic update and Realtime broadcast. | Can we handle optimistic UI + conflict resolution reliably? How do we prevent duplicate updates when optimistic change triggers Realtime broadcast? | 1. Set up minimal Supabase project with `tasks` table<br>2. Implement basic Realtime subscription<br>3. Test optimistic update + broadcast sequence<br>4. Simulate race condition (2 clients edit same task)<br>5. Document conflict resolution pattern | 2h |
| **Vercel AI Streaming + Tools** | HIGH | Complex API: streaming responses + tool calling combo not tested yet. Error handling for partial streams unclear. Does streaming work reliably with tool calling? | Does streaming work with tool calling? How to handle errors mid-stream? Can we show tool execution progress in real-time? | 1. Create test API route with Vercel AI SDK<br>2. Implement streaming response<br>3. Add tool calling function<br>4. Test: Stream interruption, error mid-generation<br>5. Measure latency (first token, full response) | 2h |
| **Tiptap Rich Text Editor** | HIGH | External lib with complex state management. Markdown shortcuts + auto-save interaction unknown. How do we serialize Tiptap JSON to PostgreSQL JSONB and back without data loss? | Can we integrate markdown shortcuts + auto-save without conflicts? How to persist Tiptap JSON reliably to Supabase? | 1. Set up Tiptap with starter kit<br>2. Add markdown shortcuts extension<br>3. Implement auto-save with debounce<br>4. Test: Rapid typing + auto-save collision<br>5. Verify serialization round-trip (Tiptap JSON → DB → Tiptap) | 1.5h |
| **dnd-kit Kanban + Realtime** | HIGH | State management complexity: drag-drop during realtime updates from another client. What happens if user drags task while another user deletes it? Potential race conditions. | How to handle drag-drop during realtime updates? What's the UX when task disappears mid-drag? | 1. Set up dnd-kit with 3 columns<br>2. Simulate realtime update during drag<br>3. Test: Task deleted by other user mid-drag<br>4. Test: Same task dragged by 2 users simultaneously<br>5. Document UX decision (pessimistic lock vs optimistic with rollback) | 1.5h |

**Total Spike Time:** ~7 hours (1 full day)

**Spike Validation Criteria:**
- **Pass:** Pattern documented, code samples work, edge cases handled → Proceed to implementation
- **Pivot:** Pattern works with modifications (e.g., disable Realtime during drag) → Adjust approach doc
- **Fail:** Fundamental blocker (e.g., Vercel AI doesn't support streaming + tools) → Find alternative or descope

---

### MEDIUM Risk Components (Interface Sketch Required)

| Component | Risk | Reason | Verification Steps |
|-----------|------|--------|-------------------|
| **Zustand Stores** | MEDIUM | Not used in current codebase, but standard React pattern. Risk: Over-engineering state management. | 1. Review Zustand docs<br>2. Sketch store interface for UI state (modals, filters)<br>3. Compare with React Context approach<br>4. Type-check with TypeScript strict mode<br>5. Proceed if interface is clear |
| **TanStack Table** | MEDIUM | External lib, well-documented but complex API. Risk: Column definitions + virtual scrolling integration. | 1. Review TanStack Table v8 docs<br>2. Plan column definitions (priority, status, goal, etc.)<br>3. Test virtual scrolling with mock 1000-row dataset<br>4. Verify Realtime sync + table re-render performance<br>5. Proceed if API is understood |
| **Calendar View (FullCalendar vs Custom)** | MEDIUM | Decision point: Use FullCalendar (external lib, heavier bundle) vs custom component (more work, lighter). | 1. Review FullCalendar React docs<br>2. Check bundle size impact (~100KB)<br>3. Prototype simple week view with date-fns<br>4. Compare dev time: FullCalendar (1 day) vs custom (2-3 days)<br>5. Decide based on MVP timeline pressure |
| **Service Worker (PWA)** | MEDIUM | Not critical for MVP Phase 1, can defer. Risk: Complexity of offline sync queue. | 1. Review Next.js PWA setup guide<br>2. Sketch offline queue logic (store ops locally, sync on reconnect)<br>3. Decide: MVP Phase 1 or Phase 2?<br>4. If Phase 2 → Document and skip for now |

---

### LOW Risk Components (Proceed with Confidence)

| Component | Risk | Reason |
|-----------|------|--------|
| **shadcn/ui additions** | LOW | 14+ components already installed, pattern established. CLI-managed, zero custom styling needed. |
| **API Routes structure** | LOW | Standard Next.js App Router pattern. `route.ts` files with GET/POST/PATCH/DELETE exports. |
| **Database schema** | LOW | Straightforward SQL from architecture doc. PostgreSQL features (RLS, indexes, JSONB) are well-documented. |
| **Supabase Auth (magic links)** | LOW | Standard Supabase pattern, well-documented. Magic links simpler than password auth (no bcrypt, no reset flow). |
| **Basic layouts/navigation** | LOW | Standard Next.js App Router layouts. Sidebar component uses existing Card/Button patterns. |
| **Toast notifications (sonner)** | LOW | Drop-in library, 5-minute setup. Used widely in shadcn/ui examples. |
| **Form components** | LOW | Existing Field/FieldGroup/FieldLabel pattern from component-example.tsx. Just adapt for task/note forms. |
| **Loading/Error states** | LOW | Standard React patterns: `<Suspense>`, Error Boundaries. Next.js App Router has built-in `loading.tsx` and `error.tsx`. |

---

## Dependencies & Sequencing

### Critical Path

**Linear dependencies that cannot be parallelized:**

1. **Supabase Setup** → Database Schema → Auth
   - *Why:* Auth needs user table, all features need database

2. **Auth** → API Routes → Data Fetching
   - *Why:* API routes need user ID from auth session, data fetching needs API

3. **Data Fetching** → Notes Editor → Task Extraction
   - *Why:* Can't extract tasks without note data structure

4. **Task Extraction** → Task Views (Kanban/Calendar/Table)
   - *Why:* Views need tasks to exist in database

5. **All of above** → AI Chat Assistant
   - *Why:* Chat needs to query tasks and notes for tool calling

6. **All of above** → Focus Mode
   - *Why:* Focus Mode needs task data to load

7. **All of above** → Weekly Review
   - *Why:* Review needs historical task/focus session data

---

### Parallel Tracks (After Foundation Complete)

**These can run simultaneously after Day 3:**

#### Track A: Notes System (Days 4-5)
- Rich Text Editor (Tiptap)
- Notes List View
- Notes API
- Auto-save hook

**Blocked by:** Nothing (foundation complete)
**Blocks:** Task Extraction (needs note data structure)

---

#### Track B: Task Views (Days 4-7)
- Kanban Board
- Calendar View
- Table View
- Task Card component
- Tasks API

**Blocked by:** Nothing (foundation complete)
**Blocks:** AI Chat Assistant (needs task data for tool calling)

---

#### Track C: AI Integration (Days 6-8)
- AI Provider setup
- Task Extraction (needs Track A complete)
- AI Chat Assistant (needs Track A & B complete)
- Daily Suggestions (needs Track B complete)

**Blocked by:** Track A (notes data) and Track B (tasks data)
**Blocks:** Weekly Review, Focus Mode (indirectly, they need AI-extracted tasks)

---

### Sequencing Rationale

**Why Database-First?**
- Schema changes are expensive later (migrations, RLS policy updates)
- All features depend on data contracts being stable
- Supabase Realtime requires tables to exist

**Why Track A/B Parallel?**
- Notes and Tasks are independent data models
- No API dependencies between them (until AI extraction)
- Maximizes solo developer efficiency (batch similar work)

**Why Track C Last?**
- AI integration needs data from A & B to be meaningful
- Tool calling functions query notes and tasks tables
- Can't test "Plan this" button without notes to plan

**Why Focus Mode & Weekly Review at End?**
- Focus Mode is execution layer, needs task views working first
- Weekly Review analyzes historical data, needs everything else running
- Both are "polish" features that enhance core workflow

---

## Key Decisions

### Decision 1: Supabase vs Self-Hosted Postgres

**Chosen:** Supabase ✅

**Reason:**
- Realtime + Auth + Storage in one service (faster MVP delivery)
- Serverless architecture (zero ops, auto-scaling)
- RLS policies eliminate backend authorization code
- Free tier sufficient for personal validation (500MB storage, 2GB bandwidth)

**Tradeoff:**
- **Vendor lock-in:** Supabase-specific features (Realtime, RLS patterns)
- **Free tier limits:** 500MB storage = ~50,000 notes/tasks (more than enough for personal use)
- **Migration complexity:** If we outgrow Supabase, migration requires abstraction layer

**Alternatives Considered:**
- **Self-hosted Postgres:** More control, no vendor lock-in, but requires infrastructure setup (Docker, hosting, backups)
- **PlanetScale:** MySQL-based, great DX, but no Realtime (would need separate solution)

**Mitigation:** Abstract Supabase client behind internal API layer (e.g., `lib/db/tasks.ts`) so migration is possible if needed.

---

### Decision 2: Tiptap vs Lexical vs Plain Textarea

**Chosen:** Tiptap ✅

**Reason:**
- React integration is first-class (hooks-based API)
- Markdown support built-in (shortcuts like `#` for heading)
- Extensible architecture (can add custom nodes/marks later)
- Proven in production (used by GitLab, Substack, etc.)

**Tradeoff:**
- **Larger bundle size:** ~80KB (vs plain textarea at 0KB)
- **Learning curve:** ProseMirror-based architecture is complex
- **State management:** Requires careful handling of editor state + auto-save

**Alternatives Considered:**
- **Lexical (Meta):** Modern, React-friendly, but newer (less ecosystem maturity)
- **Plain Textarea:** Simplest, but no rich text or markdown shortcuts (fails user journey requirement)

**Spike Required:** Verify markdown shortcuts + auto-save don't conflict (see HIGH risk components).

---

### Decision 3: dnd-kit vs react-beautiful-dnd

**Chosen:** dnd-kit ✅

**Reason:**
- Better performance (uses CSS transforms, not cloned DOM nodes)
- React 19 compatibility (react-beautiful-dnd not actively maintained)
- Smaller bundle size (~40KB vs ~60KB)
- Flexible API (sensors, modifiers, collision detection)

**Tradeoff:**
- **Less opinionated:** More setup code needed (sensors, strategies)
- **Newer library:** Smaller ecosystem vs react-beautiful-dnd's maturity

**Alternatives Considered:**
- **react-beautiful-dnd:** More examples, easier setup, but React 19 compatibility uncertain
- **Custom drag-and-drop:** Full control, but high dev time (not worth it for MVP)

**Spike Required:** Verify drag-drop + Realtime sync patterns work (see HIGH risk components).

---

### Decision 4: Vercel AI SDK vs Direct API Calls

**Chosen:** Vercel AI SDK ✅

**Reason:**
- Streaming + tool calling built-in (handles complexity)
- Unified API across providers (OpenRouter, OpenAI, Anthropic)
- Type-safe structured output with Zod schemas
- React hooks for UI integration (`useChat`, `useCompletion`)

**Tradeoff:**
- **Abstraction layer:** Less control over raw API (e.g., can't access response headers easily)
- **Bundle size:** ~30KB client-side (for `useChat` hook)

**Alternatives Considered:**
- **Direct fetch() to OpenRouter:** Full control, lighter bundle, but manual streaming + tool calling implementation
- **LangChain:** More features (chains, agents), but overkill for MVP and heavier bundle

**Spike Required:** Verify streaming + tool calling work together reliably (see HIGH risk components).

---

### Decision 5: FullCalendar vs Custom Calendar

**Chosen:** TBD (Decision during implementation) ⏳

**Context:** Two viable approaches for Calendar View

**Option A: FullCalendar (External Lib)**
- **Pros:** Feature-complete (drag-drop, multiple views, recurring events), battle-tested, 1 day implementation
- **Cons:** ~100KB bundle size, license cost if commercialized ($297/year), less customization flexibility

**Option B: Custom Component**
- **Pros:** Full control, lighter bundle (~20KB with date-fns), no licensing cost, tailored to dumtasking aesthetics
- **Cons:** 2-3 days implementation time, need to handle edge cases (DST, timezones), more testing needed

**Decision Criteria:**
- **MVP Timeline Pressure:** If behind schedule → FullCalendar (faster)
- **Bundle Size Concern:** If performance metrics show slow page loads → Custom (lighter)
- **Commercialization Intent:** If planning to sell → Custom (avoid licensing cost)

**Recommendation:** Start with custom using date-fns. If complexity exceeds 2 days, pivot to FullCalendar.

---

### Decision 6: OpenRouter Multi-Model vs Single Provider

**Chosen:** OpenRouter with Claude + Gemini ✅

**Reason:**
- Model flexibility (Claude for quality, Gemini for speed)
- Single API key (no managing multiple provider keys)
- Automatic fallback (if Claude hits rate limit, fallback to Gemini)
- Cost optimization (route cheap tasks to Gemini, complex to Claude)

**Tradeoff:**
- **Proxy latency:** Extra ~50-100ms vs direct API calls
- **Provider-specific features:** Can't access Anthropic-only features (e.g., prompt caching)

**Alternatives Considered:**
- **Direct Anthropic API:** Lower latency, prompt caching, but single-vendor lock-in
- **Direct OpenAI API:** GPT-4 is good but expensive, no open-source models

**Model Routing Strategy:**
- **Task Extraction:** Claude 3.7 Sonnet (structured output quality critical)
- **Chat Assistant:** Gemini 2.0 Flash (speed important, conversational quality sufficient)
- **Weekly Review:** Claude 3.7 Sonnet (analysis depth important)

---

## Next Steps

### Immediate Actions (Before Implementation)

1. **Validate Approach Document**
   - Share with stakeholders (if any) or review personally
   - Confirm phasing makes sense (Foundation → Features → Polish)
   - Verify no critical features missing from gap analysis

2. **Run Spikes for HIGH Risk Components (Day 0, 7 hours)**
   - **Spike 1:** Supabase Realtime + Optimistic UI (2h)
   - **Spike 2:** Vercel AI Streaming + Tool Calling (2h)
   - **Spike 3:** Tiptap + Auto-save Integration (1.5h)
   - **Spike 4:** dnd-kit + Realtime Sync (1.5h)

3. **Update Approach Based on Spike Results**
   - Document learnings from each spike
   - Adjust implementation approach if patterns differ from assumptions
   - Identify any showstoppers (e.g., Vercel AI doesn't support streaming + tools)

---

### Phase 3: Verification (After Spikes Complete)

**Goal:** Validate HIGH-risk patterns work before decomposing into beads.

**Outputs:**
- Working code samples for each HIGH-risk component
- Documentation of edge cases and handling strategies
- Decision: Proceed, Pivot, or Fail for each component

**Validation Criteria (Must Pass All):**
- ✅ Realtime sync works with optimistic UI (no duplicate updates)
- ✅ AI streaming + tool calling produces consistent results
- ✅ Tiptap auto-save doesn't conflict with rapid typing
- ✅ dnd-kit drag-drop handles realtime updates gracefully

**If Any Spike Fails:**
- **Realtime sync fails:** Fallback to polling (every 5s)
- **AI streaming + tools fails:** Use non-streaming with tools, or streaming without tools
- **Tiptap fails:** Use plain textarea with simpler auto-save
- **dnd-kit fails:** Use pessimistic UI (disable drag during remote updates)

---

### Phase 4: Decomposition (After Spikes Pass)

**Goal:** Break approach into beads (atomic work units) for orchestrator.

**Process:**
1. Use spike learnings to inform bead granularity
2. Create beads for each component in gap analysis
3. Define dependencies between beads (e.g., "AI Extraction" depends on "Notes API")
4. Assign priorities (P0 for critical path, P1-P2 for parallel tracks)
5. Estimate time per bead (aim for 2-4 hour beads)

**Bead Structure (Draft):**
- `dt-001`: Supabase project setup + schema migration
- `dt-002`: Auth flow (login, callback, session)
- `dt-003`: Root layout + providers
- `dt-004`: Dashboard layout + navigation
- ... (continue for all 22+ components in approach)

**Tools:**
- Use `bd create` to generate beads
- Use `bd dep add` to link dependencies
- Use `bv --robot-plan` to validate sequencing

---

### Phase 5: Validation (After Beads Created)

**Goal:** Ensure bead graph is valid and executable.

**Checks:**
1. **No Circular Dependencies**
   - Run: `bv --robot-insights | jq '.Cycles'`
   - Expected: Empty array
   - If cycles exist: Fix with `bd dep remove`

2. **Critical Path Identified**
   - Run: `bv --robot-plan`
   - Expected: Clear sequential track (Foundation → Features → Polish)
   - Verify: No bead blocks entire graph unnecessarily

3. **Parallel Tracks Exploited**
   - Run: `bv --robot-plan`
   - Expected: Track A (Notes), Track B (Tasks), Track C (AI) visible
   - Verify: No false dependencies forcing sequential work

4. **Priorities Assigned**
   - Run: `bd ready`
   - Expected: P0 beads appear first (Foundation)
   - Verify: P1-P2 beads are parallelizable

---

### Phase 6: Track Planning (After Validation Pass)

**Goal:** Generate execution plan for orchestrator to assign to workers.

**Process:**
1. Run: `bv --robot-plan` to get recommended track assignments
2. Create orchestrator thread (e.g., `AM thread dt-mvp-orchestration`)
3. Spawn workers for each track (e.g., Worker A: Notes, Worker B: Tasks, Worker C: AI)
4. Workers report progress to orchestrator thread
5. Orchestrator monitors blockers and re-assigns if needed

**Execution Model:**
- **Sequential Foundation:** Single worker completes Phase 1 (Days 1-3)
- **Parallel Features:** 3 workers on Tracks A/B/C (Days 4-8)
- **Sequential Polish:** Single worker completes Phase 3 (Days 9-14)

---

### Success Metrics

**Spike Phase (Day 0):**
- ✅ All 4 HIGH-risk components validated or fallback identified
- ✅ Code samples working in isolated test projects
- ✅ Edge cases documented with handling strategies

**Implementation Phase (Days 1-14):**
- ✅ All 22 components from gap analysis implemented
- ✅ No P0 beads blocked by unresolved dependencies
- ✅ Code quality: TypeScript strict mode passes, no console errors
- ✅ Test coverage: Critical paths have E2E tests

**Validation Phase (Month 1-3):**
- ✅ Personal adoption: 5+ days/week usage
- ✅ Multi-goal balance: No goal neglected >2 weeks
- ✅ Completion rate: 70%+ sustained
- ✅ AI trust: 70%+ of AI suggestions accepted with minor edits
- ✅ Cost efficiency: <$50/month operating costs

---

## Summary

**Total Components:** 60+ (across all phases)

**Risk Breakdown:**
- **HIGH Risk:** 4 components (Realtime sync, AI streaming, Tiptap, dnd-kit) → 7 hours of spikes
- **MEDIUM Risk:** 4 components (Zustand, TanStack Table, Calendar decision, PWA) → Interface sketches
- **LOW Risk:** 52+ components (shadcn/ui, API routes, standard Next.js patterns) → Proceed directly

**Recommended Spike Topics (Must Complete Before Decomposition):**
1. Supabase Realtime + Optimistic UI conflict resolution
2. Vercel AI SDK streaming + tool calling reliability
3. Tiptap rich text editor + auto-save integration
4. dnd-kit drag-and-drop + realtime sync coordination

**Timeline:**
- **Spike Phase:** 1 day (7 hours)
- **Implementation:** 12-14 weeks (Foundation 2-3 days, Features 5-7 days, Polish 2-3 days)
- **Total:** ~14 weeks from spikes to MVP complete

**Critical Success Factors:**
1. Spikes must validate HIGH-risk patterns (or identify fallbacks)
2. Database schema must be stable before feature work starts
3. Parallel tracks (A/B/C) must be exploited after foundation
4. Personal validation (3 months) determines MVP success, not technical completion

**Next Immediate Action:** Run HIGH-risk spikes (7 hours) and update this document with findings before creating beads.
