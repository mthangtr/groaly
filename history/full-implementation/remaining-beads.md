# Remaining Beads Creation Plan

**Progress**: 17/43 beads created  
**Remaining**: 26 beads

---

## Created So Far ✅

### Spike Epic + Spikes (7 total)
- ✅ dumtasking-q4r - Epic: AI Integration Validation
- ✅ dumtasking-x5n - Spike: OpenRouter + Claude
- ✅ dumtasking-7tc - Spike: Zod Structured Output
- ✅ dumtasking-t2j - Spike: Error Handling
- ✅ dumtasking-cje - Spike: Streaming Chat
- ✅ dumtasking-mfl - Spike: Tool Calling
- ✅ dumtasking-39x - Spike: Context Injection

### Phase 1: Foundation (6 total)
- ✅ dumtasking-1h3 - Root Middleware
- ✅ dumtasking-6ud - Environment Config
- ✅ dumtasking-92i - Notes CRUD API (existing, modified)
- ✅ dumtasking-3dz - Tasks CRUD API (existing, modified)
- ✅ dumtasking-t54 - Settings Profile API
- ✅ dumtasking-9w0 - DB Migration 003

### Phase 2: AI Intelligence (5 total)
- ✅ dumtasking-65q - AI Task Extraction API
- ✅ dumtasking-76f - AI Task Extraction Integration
- ✅ dumtasking-xdg - AI Chat API
- ✅ dumtasking-lze - AI Suggestions API
- ✅ dumtasking-tpx - Daily Suggestions Integration

### Phase 3A: Rich Text & Realtime (4 total - 1 remaining)
- ✅ dumtasking-25c - Tiptap Integration (existing, modified)
- ✅ dumtasking-179 - Note Editor Integration (existing, modified)
- ✅ dumtasking-amw - Realtime Subscription Hook
- ⏳ Optimistic UI Pattern Implementation

---

## Beads To Create (26 remaining)

### Phase 3A: Rich Text & Realtime (1 bead)
**1. Optimistic UI Pattern Implementation**
- File scope: All pages (notes, tasks, kanban, calendar, table)
- Apply optimistic updates to all CRUD operations
- Rollback on error with toast notification

### Phase 3B: Interactive Views (6 beads)
**2. Kanban Drag-and-Drop Integration**
- dnd-kit for kanban board
- Status updates via drag-and-drop
- Real-time sync

**3. Calendar Drag-and-Drop Integration**
- Task reschedule via drag
- Time block editing
- Density visualization

**4. Calendar AI Scheduling**
- "Optimize my week" button
- AI rebalancing algorithm
- Conflict resolution

**5. Table Inline Editing with TanStack**
- TanStack Table v8
- Inline cell editing
- Column customization

**6. Table Bulk Actions**
- Multi-select rows
- Bulk status update
- Bulk delete with confirmation

**7. Table Export Functionality**
- CSV export
- JSON export
- Date range filter

### Phase 4A: Focus & Execution (4 beads)
**8. Focus Mode PiP Timer**
- Picture-in-Picture API
- Floating timer stays on top
- Fullscreen mode

**9. Focus Mode Ambient Audio**
- Audio player component
- Sound options: white noise, rain, coffee shop, forest, ocean
- Volume control

**10. Focus Sessions API**
- POST /api/focus-sessions
- Session persistence
- History tracking

**11. Focus Celebration**
- Confetti animation
- Success sound
- Task completion flow

### Phase 4B: Advanced Features (4 beads)
**12. Protected Slots CRUD**
- API endpoints for protected slots
- Recurring slot support
- Calendar visualization

**13. Protected Slots Recurrence Logic**
- RRULE parsing
- Recurrence editor UI
- AI scheduling respects slots

**14. Related Tasks API**
- /api/tasks/related/[id]
- Relatedness scoring algorithm
- Response with reasoning

**15. Related Tasks Panel Component**
- Side panel UI
- Click to open related task
- Visual connection indicators

### Phase 4C: Reviews & Accountability (3 beads)
**16. Compassionate Accountability Flow**
- Evening motivation drop detection
- Defer/Move/Cancel options
- Philosophical quotes display

**17. Weekly Review API**
- Auto-generation (Supabase Edge Function or cron)
- AI summary with Claude
- Goals distribution calculation

**18. Weekly Review UI**
- Charts with Recharts
- Interactive suggestions
- Click to apply suggestions

### Phase 5: Polish & PWA (5 beads)
**19. Error Boundary Integration**
- Global ErrorBoundary component
- Route-level error boundaries
- Error reporting

**20. Loading States & Suspense**
- Suspense boundaries for all pages
- Loading skeletons
- Progressive loading

**21. Toast Notifications Integration**
- Sonner toast for all mutations
- Success/Error/Info variants
- Undo functionality

**22. PWA Configuration**
- next-pwa setup
- Service Worker
- Manifest.json

**23. Offline Mode**
- IndexedDB sync queue
- Offline note editing
- Background sync

---

## Dependencies Summary

### Critical Path
```
Spike Epic → AI Intelligence → Views → Advanced → Polish
```

### Parallel Tracks Possible
- **Track A**: Views (Kanban, Calendar, Table) - Independent
- **Track B**: Focus Mode - Independent  
- **Track C**: Advanced Features - Semi-independent
- **Track D**: Polish - Depends on all above

---

## Next Actions

**Option 1**: I continue creating all 26 beads now ⏱️ ~20 minutes  
**Option 2**: You review what's created so far, then I continue ⏱️ Review time  
**Option 3**: Create phase-by-phase as work progresses ⏱️ On-demand

**Recommendation**: Option 1 for complete upfront planning and proper dependency graph.

What would you like me to do?
