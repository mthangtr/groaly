# Approach: Full Feature Implementation

**Based on**: Discovery Report + SYSTEM_SPEC analysis  
**Generated**: 2026-01-19  
**Objective**: Complete dumtasking MVP with 14 features (100% UI/UX implementation)

---

## 1. Gap Analysis Summary

| Component | Have | Need | Risk | Priority |
|-----------|------|------|------|----------|
| **Backend API** | 1 auth route | 15+ CRUD routes | LOW | P0 |
| **AI Integration** | UI shell | Claude + streaming | HIGH | P0 |
| **Rich Text Editor** | Textarea | Tiptap integration | MEDIUM | P0 |
| **Realtime Sync** | Mock data | Supabase Realtime | MEDIUM | P1 |
| **Drag-and-Drop** | Static UI | dnd-kit | MEDIUM | P1 |
| **Table View** | Mock table | TanStack Table | MEDIUM | P1 |
| **Calendar** | Static grid | FullCalendar/custom | MEDIUM | P1 |
| **Focus Mode** | Timer UI | PiP + audio + persist | MEDIUM | P2 |
| **Protected Slots** | DB table | CRUD + recurrence | LOW | P2 |
| **Weekly Review** | DB table | AI summary + charts | MEDIUM | P2 |
| **Related Tasks** | Algorithm spec | Implementation | LOW | P2 |
| **Compassionate UX** | Quotes data | Flow + logging | LOW | P2 |
| **Settings** | UI forms | Profile CRUD + BYOK | LOW | P1 |
| **PWA** | Nothing | Service Worker | MEDIUM | P3 |

---

## 2. Recommended Approach

### Strategy: Feature-Based Vertical Slices

**Why**: Each feature = E2E implementation (DB → API → UI → AI)
- Allows parallel work across features
- Each slice is shippable (testable, usable)
- Reduces integration risk

### Alternative Approaches (Rejected)

1. **Layer-Based** (All APIs → All UI → All AI)
   - ❌ Delays integration testing
   - ❌ Harder to parallelize
   - ❌ Risk accumulates at end

2. **Phase-Based** (Phase 1 → Phase 2 → ...)
   - ❌ Ignores existing UI scaffolding
   - ❌ Duplicates work (UI already done)
   - ✅ Good for waterfall, bad for iterative

3. **Feature-Based Vertical Slices** ✅
   - ✅ E2E implementation per feature
   - ✅ Parallel tracks possible
   - ✅ Early validation
   - ✅ Leverages existing UI

---

## 3. Risk Assessment & Mitigation

### HIGH RISK Items (Require Spikes)

#### 1. AI Task Extraction
**Risk Factors**:
- External API dependency (OpenRouter/Claude)
- Structured output with Zod (new pattern)
- Error handling + retry logic
- Token consumption management

**Mitigation**:
- **Spike 1**: Test OpenRouter + Claude API with simple prompt
- **Spike 2**: Validate Zod structured output schema
- **Spike 3**: Test error handling and streaming

**Spike Definition**:
```markdown
## Spike: OpenRouter + Claude Integration

**Time-box**: 1 hour
**Location**: `.spikes/ai-extraction/`

### Questions
1. Can we call Claude via OpenRouter with Vercel AI SDK?
2. Does structured output work with Zod schemas?
3. How to handle rate limits and errors?

### Success Criteria
- [ ] Working API call to Claude
- [ ] Structured JSON response parsed with Zod
- [ ] Error handling tested (invalid API key, rate limit)
- [ ] Code in `.spikes/ai-extraction/test.ts`

### Result
Close with: `bd close <id> --reason "YES: <approach>" or "NO: <blocker>"`
```

#### 2. AI Chat with Tool Calling
**Risk Factors**:
- Streaming responses (chunked JSON)
- Tool calling (8 functions)
- Context management (user data injection)
- Message persistence + history

**Mitigation**:
- **Spike 4**: Test streaming chat with Vercel AI SDK
- **Spike 5**: Validate tool calling with mock functions
- **Spike 6**: Test context injection (passing user tasks/notes)

**Dependencies**: Complete after AI Extraction spike

---

### MEDIUM RISK Items (Interface Sketches)

#### 3. Supabase Realtime Sync
**Risk Factors**:
- Real-time subscriptions (postgres_changes)
- Optimistic UI updates
- Conflict resolution (concurrent edits)

**Mitigation**:
- Sketch interface for subscription handling
- Test optimistic update pattern with mock data
- Review Supabase Realtime docs

#### 4. Tiptap Integration
**Risk Factors**:
- Rich text editor state management
- Auto-save debouncing
- Content format (JSONB vs HTML)

**Mitigation**:
- Follow Tiptap React guide exactly
- Use existing examples from Tiptap docs
- Test auto-save with debounce hook

#### 5. Drag-and-Drop (dnd-kit)
**Risk Factors**:
- Complex state updates (reorder + status change)
- Touch support
- Accessibility

**Mitigation**:
- Use dnd-kit sortable preset
- Follow official examples for Kanban
- Test on mobile viewport

#### 6. TanStack Table
**Risk Factors**:
- Inline editing state
- Bulk actions across pages
- Virtual scrolling performance

**Mitigation**:
- Use official React Table v8 examples
- Implement simple version first (no virtualization)
- Add features incrementally

---

### LOW RISK Items (Proceed Immediately)

#### 7. CRUD API Routes
**Why Low Risk**:
- Pattern established in codebase
- Standard Supabase queries
- RLS handles authorization

**Approach**: Follow existing auth callback pattern

#### 8. Protected Slots CRUD
**Why Low Risk**:
- Standard CRUD operations
- RRULE library for recurrence (well-documented)

#### 9. Related Tasks Algorithm
**Why Low Risk**:
- Pure logic (no external deps)
- Algorithm provided in SYSTEM_SPEC
- Single API route

#### 10. Settings & Profile
**Why Low Risk**:
- Standard form handling
- Supabase auth.update() for profile
- Encryption library for BYOK (crypto-js)

---

## 4. Implementation Strategy: Phased Feature Delivery

### Phase 1: Foundation & Core Data (Priority 0 - Week 1)

**Goal**: Replace mock data with real Supabase queries

**Features**:
1. **Root Middleware** - Wire up auth protection
2. **Notes CRUD API** - Create/Read/Update/Delete
3. **Tasks CRUD API** - Full CRUD + filters
4. **Settings Backend** - Profile update, preferences

**Dependencies to Install**:
```bash
bun add zod                    # Schema validation
bun add crypto-js              # Encryption for BYOK
```

**Deliverables**:
- `/api/notes`, `/api/notes/[id]`
- `/api/tasks`, `/api/tasks/[id]`
- `/api/settings/profile`, `/api/settings/preferences`
- `middleware.ts` in root
- All pages use real data (remove `lib/mock-data.ts` imports)

**Risk**: LOW  
**Parallel Tracks**: Notes API, Tasks API, Settings API (independent)

---

### Phase 2: AI Intelligence (Priority 0 - Week 2)

**Goal**: Implement AI features (extraction, chat, suggestions)

**Prerequisites**: Complete Spikes 1-6

**Features**:
4. **AI Task Extraction** - Note → Claude → Tasks
5. **AI Chat Assistant** - Streaming + tool calling
6. **Smart Daily Suggestions** - Algorithm + AI ranking

**Dependencies to Install**:
```bash
bun add ai                              # Vercel AI SDK
bun add @openrouter/ai-sdk-provider     # OpenRouter
```

**Deliverables**:
- `/api/ai/extract-tasks` (POST)
- `/api/ai/chat` (POST - streaming)
- `/api/ai/suggestions` (GET)
- ChatWidget integration (real AI responses)
- "Plan this" button functional
- Daily suggestions algorithm

**Learnings from Spikes**:
- Embed spike code references in bead descriptions
- Use validated Zod schemas from spikes
- Apply error handling patterns from spikes

**Risk**: HIGH → MEDIUM (after spikes)  
**Sequential**: AI Extraction → AI Chat → Suggestions

---

### Phase 3: Rich Text & Realtime (Priority 0-1 - Week 3)

**Goal**: Upgrade notes editor and enable real-time sync

**Features**:
7. **Tiptap Integration** - Rich text editor
8. **Supabase Realtime** - Cross-view sync

**Dependencies to Install**:
```bash
bun add @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
bun add @tiptap/extension-link @tiptap/extension-code-block-lowlight
```

**Database Migration**:
```sql
-- Migration 003: Note Content JSONB
ALTER TABLE notes ALTER COLUMN content TYPE JSONB USING content::JSONB;
ALTER TABLE notes ADD COLUMN content_text TEXT;
-- Add trigger for full-text search
```

**Deliverables**:
- `NoteEditor.tsx` component (Tiptap)
- Auto-save every 2 seconds (debounced)
- Markdown shortcuts support
- Full-text search on `content_text`
- Realtime subscription hook (`useRealtimeSubscription`)
- Optimistic UI for all mutations

**Risk**: MEDIUM  
**Sequential**: Tiptap first → Realtime second (integration)

---

### Phase 4: Interactive Views (Priority 1 - Week 4-5)

**Goal**: Complete Kanban, Calendar, Table with interactivity

**Features**:
9. **Kanban Board** - Drag-and-drop + Realtime
10. **Calendar View** - Drag-and-drop + AI scheduling
11. **Table View** - Inline edit + bulk actions

**Dependencies to Install**:
```bash
bun add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
bun add @tanstack/react-table
bun add fullcalendar           # OR build custom calendar
```

**Deliverables**:
- Kanban drag-and-drop (status updates)
- Calendar drag-and-drop (reschedule)
- "Optimize my week" AI rebalancing
- Table inline editing
- Bulk actions (status, delete)
- CSV/JSON export

**Risk**: MEDIUM  
**Parallel Tracks**: Kanban, Calendar, Table (independent)

---

### Phase 5: Execution & Advanced Features (Priority 2 - Week 6)

**Goal**: Focus Mode, accountability, reviews

**Features**:
12. **Focus Mode** - PiP timer + ambient sounds + celebration
13. **Protected Slots** - CRUD + visualization
14. **Related Tasks** - Algorithm implementation
15. **Compassionate Accountability** - Evening flow
16. **Weekly Review** - AI summary + charts

**Dependencies to Install**:
```bash
bun add canvas-confetti        # Celebration
bun add recharts               # Charts for weekly review
bun add rrule                  # Recurrence rules
```

**Deliverables**:
- Fullscreen API + PiP timer
- Ambient sound player (audio files)
- Session persistence (`focus_sessions`)
- Protected slots CRUD + recurrence
- Related tasks panel (`/api/tasks/related/[id]`)
- Evening motivation flow
- Weekly review auto-generation
- Chart visualization (goals distribution)

**Risk**: LOW-MEDIUM  
**Parallel Tracks**: 
- Track A: Focus Mode + Sessions
- Track B: Protected Slots + Related Tasks
- Track C: Accountability + Weekly Review

---

### Phase 6: Polish & PWA (Priority 3 - Week 7)

**Goal**: Production readiness

**Features**:
17. **Error Boundaries** - React error handling
18. **Loading States** - Suspense boundaries + skeletons
19. **Toast Notifications** - Sonner integration
20. **PWA** - Service Worker + offline mode

**Dependencies to Install**:
```bash
bun add next-pwa workbox-webpack-plugin
bun add idb                    # IndexedDB for offline queue
```

**Deliverables**:
- ErrorBoundary component (global + route-level)
- Loading skeletons for all pages
- Toast notifications for all mutations
- Service Worker configuration
- Offline note editing + sync queue
- Install prompt (desktop + mobile)

**Risk**: MEDIUM (Service Worker)  
**Sequential**: Error handling → Loading → PWA

---

## 5. Dependency Management Strategy

### Install Order (by Phase)

**Phase 1** (Foundation):
```bash
bun add zod crypto-js
```

**Phase 2** (AI):
```bash
bun add ai @openrouter/ai-sdk-provider
```

**Phase 3** (Rich Text):
```bash
bun add @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
```

**Phase 4** (Views):
```bash
bun add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
bun add @tanstack/react-table
# Decide: fullcalendar vs custom calendar
```

**Phase 5** (Advanced):
```bash
bun add canvas-confetti recharts rrule
```

**Phase 6** (PWA):
```bash
bun add next-pwa workbox-webpack-plugin idb
```

**Total New Dependencies**: ~15 packages

---

## 6. Testing Strategy

### Manual Testing (MVP)
- Test each feature E2E after implementation
- Use Supabase dashboard to verify data
- Test on Chrome + Firefox + Safari
- Mobile testing on iOS + Android (PWA)

### Automated Testing (Post-MVP)
- **Unit Tests**: Vitest for utilities, algorithms
- **Component Tests**: Vitest + Testing Library
- **E2E Tests**: Playwright for critical flows

**Not in scope for initial beads planning** (add later)

---

## 7. Database Migration Plan

### Migration 003: Note Content JSONB
```sql
ALTER TABLE notes 
  ALTER COLUMN content TYPE JSONB USING content::JSONB;

ALTER TABLE notes ADD COLUMN content_text TEXT;

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

CREATE INDEX idx_notes_content_text_fts 
  ON notes USING gin(to_tsvector('english', content_text));
```

### Migration 004: Task Importance Field
```sql
ALTER TABLE tasks ADD COLUMN importance_reason TEXT;
```

### Migration 005: Focus Session Tracking
```sql
-- Already exists in schema, verify columns:
-- task_id, duration_minutes, start_time, end_time, notes
```

---

## 8. Coding Standards (Enforce in Beads)

### Component Pattern
```typescript
"use client" // If interactive
import * as React from "react"
import { cn } from "@/lib/utils"

export function Component({ className, ...props }: Props) {
  return <div className={cn("base-styles", className)} {...props} />
}
```

### API Pattern
```typescript
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    
    // Query with user_id filter
    const { data, error } = await supabase
      .from('table')
      .select('*')
      .eq('user_id', user.id)
    
    if (error) throw error
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    )
  }
}
```

### Realtime Pattern
```typescript
React.useEffect(() => {
  const channel = supabase
    .channel('changes')
    .on('postgres_changes', { ... }, (payload) => {
      // Optimistic UI update
    })
    .subscribe()
  
  return () => supabase.removeChannel(channel)
}, [dependencies])
```

---

## 9. Success Metrics

### Per Feature
- ✅ UI matches design (existing scaffolding)
- ✅ Backend integration working (real data)
- ✅ Error handling (try/catch + user feedback)
- ✅ Loading states (spinners + skeletons)
- ✅ Type-safe (no `any`, strict TypeScript)
- ✅ Responsive (mobile + desktop)

### Overall MVP
- ✅ All 14 features functional
- ✅ No console errors
- ✅ Performance targets met (see SYSTEM_SPEC §11)
- ✅ Security: RLS policies tested
- ✅ AI integration working (real Claude responses)

---

## 10. Risk Mitigation Summary

| Risk Level | Count | Mitigation Strategy |
|------------|-------|---------------------|
| HIGH | 2 | Spikes required (6 spikes total) |
| MEDIUM | 7 | Interface sketches + docs review |
| LOW | 5 | Follow established patterns |

**Total Spikes**: 6 (AI focus - critical path)  
**Estimated Spike Time**: 4-6 hours  
**Spike Deadline**: Before Phase 2 starts

---

## 11. Parallel Execution Potential

### Maximum Parallelism (4 concurrent tracks)

**Phase 1** (Week 1):
- Track 1: Notes API
- Track 2: Tasks API
- Track 3: Settings API
- Track 4: Root Middleware

**Phase 2** (Week 2):
- Sequential (AI features depend on each other)

**Phase 4** (Week 4-5):
- Track 1: Kanban
- Track 2: Calendar
- Track 3: Table

**Phase 5** (Week 6):
- Track 1: Focus Mode
- Track 2: Protected Slots + Related Tasks
- Track 3: Accountability + Reviews

---

## 12. Next Steps

1. **Create Spikes** for HIGH risk items (AI extraction, AI chat)
2. **Execute Spikes** using MULTI_AGENT_WORKFLOW
3. **Aggregate Learnings** and embed in beads
4. **Decompose Features** into beads using file-beads skill
5. **Validate Graph** with `bv` analysis
6. **Generate Execution Plan** with track assignments

---

**Recommended First Action**: Create 6 spike beads under epic "AI Integration Validation"

**Estimated Total Time**: 6-7 weeks to MVP (all 14 features complete)

**Confidence Level**: HIGH (UI done, patterns established, risks identified)
