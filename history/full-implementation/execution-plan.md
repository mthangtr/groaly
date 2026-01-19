# Execution Plan: Full Feature Implementation

**Epic**: dumtasking MVP Complete Implementation  
**Generated**: 2026-01-19  
**Total Beads**: 43 (10 ready, 33 blocked)  
**Estimated Duration**: 6-7 weeks

---

## 1. Planning Summary

### Beads Created
- **Spike Epic + Spikes**: 1 epic + 6 tasks (P0)
- **Phase 1 - Foundation**: 6 beads (P1)
- **Phase 2 - AI Intelligence**: 5 beads (P1)
- **Phase 3A - Rich Text & Realtime**: 4 beads (P1)
- **Phase 3B - Interactive Views**: 6 beads (P2)
- **Phase 4A - Focus & Execution**: 4 beads (P2)
- **Phase 4B - Advanced Features**: 4 beads (P2)
- **Phase 4C - Reviews & Accountability**: 3 beads (P2)
- **Phase 5 - Polish & PWA**: 5 beads (P2-P3)

### Validation Results ✅
- **Cycles**: 0 (clean DAG)
- **Bottlenecks**: dumtasking-yq2 (Phase 1 - completed)
- **Articulation Points**: dumtasking-yq2 (already resolved)
- **Orphans**: dumtasking-tof (MVP epic - expected)

---

## 2. Execution Tracks

Based on `bv --robot-plan` analysis and file scope assignments, we have **5 parallel tracks**:

### Track 1: Foundation & Infrastructure (BlueLake)
**Priority**: P0-P1  
**File Scope**: Infrastructure files, migrations, middleware

**Beads** (in order):
1. `dumtasking-6ud` - Environment Configuration Documentation
2. `dumtasking-1h3` - Root Middleware: Wire Up Auth Protection
3. `dumtasking-9w0` - Database Migration 003: Note Content JSONB

**Estimated Time**: 1 week  
**Dependencies**: None (can start immediately)

---

### Track 2: Backend APIs (GreenCastle)
**Priority**: P1-P2  
**File Scope**: `app/api/**`

**Beads** (in order):
1. `dumtasking-92i` - Notes: Create Notes List & CRUD API
2. `dumtasking-3dz` - Tasks: Create Tasks CRUD API
3. `dumtasking-t54` - Settings Profile API
4. `dumtasking-2cr` - Protected Slots CRUD API
5. `dumtasking-9g0` - Focus Sessions API
6. `dumtasking-9el` - Related Tasks API

**Estimated Time**: 2 weeks  
**Dependencies**: None (parallel with Track 1)

---

### Track 3: AI Integration (RedStone)
**Priority**: P0-P1  
**File Scope**: `app/api/ai/**`, `lib/ai/**`, `.spikes/ai-integration/**`

**Beads** (in order):
1. **Spike Epic** - `dumtasking-q4r` (blocking Phase 2)
   - `dumtasking-x5n` - Spike: OpenRouter + Claude
   - `dumtasking-7tc` - Spike: Zod Structured Output
   - `dumtasking-t2j` - Spike: Error Handling
   - `dumtasking-cje` - Spike: Streaming Chat
   - `dumtasking-mfl` - Spike: Tool Calling
   - `dumtasking-39x` - Spike: Context Injection
2. `dumtasking-65q` - AI Task Extraction API
3. `dumtasking-76f` - AI Task Extraction Integration
4. `dumtasking-xdg` - AI Chat API with Streaming
5. `dumtasking-lze` - AI Suggestions API
6. `dumtasking-tpx` - Daily Suggestions Integration
7. `dumtasking-aml` - Calendar AI Scheduling Algorithm
8. `dumtasking-4jy` - Weekly Review API with AI Summary

**Estimated Time**: 3 weeks (1 week spikes + 2 weeks implementation)  
**Critical Path**: Must complete spikes before Phase 2  
**Dependencies**: Tasks API (dumtasking-3dz) for tool calling

---

### Track 4: Rich Text & Views (PurpleBear)
**Priority**: P1-P2  
**File Scope**: `app/(dashboard)/**`, `components/notes/**`, `components/views/**`

**Beads** (in order):
1. `dumtasking-25c` - Tiptap Integration
2. `dumtasking-179` - Note Editor Integration
3. `dumtasking-amw` - Supabase Realtime Subscription Hook
4. `dumtasking-bd2` - Kanban Drag-and-Drop Integration
5. `dumtasking-twa` - Calendar Drag-and-Drop Integration
6. `dumtasking-00w` - Table View with TanStack Table
7. `dumtasking-89p` - Table Bulk Actions
8. `dumtasking-7mj` - Table Export Functionality

**Estimated Time**: 2.5 weeks  
**Dependencies**:
- Tiptap depends on Migration 003 (dumtasking-9w0)
- Views depend on Realtime Hook

---

### Track 5: Advanced & Focus Features (YellowTiger)
**Priority**: P2  
**File Scope**: `components/focus/**`, `components/reviews/**`, `components/accountability/**`

**Beads** (in order):
1. `dumtasking-zdc` - Focus Mode PiP Timer
2. `dumtasking-2yv` - Focus Mode Ambient Audio Player
3. `dumtasking-oxy` - Focus Celebration Animation
4. `dumtasking-tun` - Protected Slots Recurrence & Visualization
5. `dumtasking-ugo` - Related Tasks Panel Component
6. `dumtasking-2gu` - Compassionate Accountability Flow
7. `dumtasking-7zs` - Weekly Review UI with Charts

**Estimated Time**: 2 weeks  
**Dependencies**:
- Focus features depend on Focus Sessions API
- Protected Slots depend on Protected Slots API + Calendar View
- Related Tasks Panel depends on Related Tasks API
- Accountability depends on Tasks API
- Weekly Review UI depends on Weekly Review API

---

### Track 6: Polish & PWA (SilverDragon)
**Priority**: P2-P3  
**File Scope**: Infrastructure, service workers, error boundaries

**Beads** (in order):
1. `dumtasking-d29` - UI: ErrorBoundary Integration
2. `dumtasking-gc6` - Loading States & Suspense Boundaries
3. `dumtasking-7uv` - Toast Notifications with Sonner
4. `dumtasking-7ot` - PWA Configuration & Service Worker
5. `dumtasking-629` - Offline Mode with IndexedDB Sync Queue

**Estimated Time**: 1.5 weeks  
**Dependencies**: All features should be complete before polish  
**Can Start**: Week 5-6

---

## 3. Cross-Track Dependencies

### Critical Path Sequence
```
Spikes (Track 3) 
  → AI Intelligence (Track 3) 
  → Views & Advanced Features (Track 4, 5) 
  → Polish (Track 6)
```

### Parallel Work Opportunities

**Week 1-2**: Maximum parallelism (4 tracks)
- Track 1: Foundation ✓
- Track 2: Backend APIs ✓
- Track 3: Spikes ✓
- Track 4: Tiptap (after Migration 003) ✓

**Week 3-4**: 3 tracks
- Track 2: Backend APIs (continued)
- Track 3: AI Implementation
- Track 4: Views (after Realtime Hook)

**Week 5-6**: 2 tracks
- Track 5: Advanced Features
- Track 6: Polish

**Week 7**: Final integration
- Track 6: PWA & Offline Mode

---

## 4. Priority Levels Explained

### P0 (Highest) - Critical Path Blockers
- Spike Epic: `dumtasking-q4r`
- All spike beads (validation before AI work)

### P1 (High) - Core Features
- Foundation (middleware, env, migration)
- Backend APIs (notes, tasks, settings)
- AI Integration (extraction, chat, suggestions)
- Rich Text & Realtime (Tiptap, subscriptions)

### P2 (Medium) - Enhanced Features
- Interactive Views (Kanban, Calendar, Table)
- Focus Mode (PiP, audio, celebration)
- Advanced Features (protected slots, related tasks, accountability)
- Weekly Reviews (API + UI)
- Error Handling & Loading States

### P3 (Low) - PWA & Offline
- Service Worker setup
- Offline mode with IndexedDB

---

## 5. Recommended Agent Assignment

### BlueLake (Track 1 - Foundation)
**Skillset**: Infrastructure, DevOps, configuration  
**Personality**: Meticulous, detail-oriented  
**Work Style**: Sequential, thorough documentation

### GreenCastle (Track 2 - Backend APIs)
**Skillset**: Backend, databases, Supabase  
**Personality**: Systematic, CRUD expert  
**Work Style**: Parallel, repetitive patterns

### RedStone (Track 3 - AI Integration)
**Skillset**: AI/ML, OpenRouter, streaming APIs  
**Personality**: Experimental, problem-solver  
**Work Style**: Spike-driven, iterative

### PurpleBear (Track 4 - Rich Text & Views)
**Skillset**: Frontend, React, UI libraries  
**Personality**: Visual, interaction-focused  
**Work Style**: Component-based, incremental

### YellowTiger (Track 5 - Advanced Features)
**Skillset**: Full-stack, feature integration  
**Personality**: User-centric, empathetic  
**Work Style**: Feature-complete, polished

### SilverDragon (Track 6 - Polish & PWA)
**Skillset**: Performance, PWA, error handling  
**Personality**: Quality-focused, edge-case hunter  
**Work Style**: Thorough testing, refinement

---

## 6. Dependency Install Schedule

### Week 1 (Foundation + Spikes)
```bash
bun add zod crypto-js ai @openrouter/ai-sdk-provider
```

### Week 2 (Rich Text)
```bash
bun add @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
```

### Week 3 (Views)
```bash
bun add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
bun add @tanstack/react-table
bun add fullcalendar @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
```

### Week 4 (Advanced Features)
```bash
bun add canvas-confetti recharts rrule
```

### Week 6 (PWA)
```bash
bun add next-pwa workbox-webpack-plugin idb
```

---

## 7. Success Metrics

### Per Track
- ✅ All beads in track completed
- ✅ No console errors
- ✅ Integration tests pass
- ✅ Type safety (no `any`)
- ✅ Responsive (mobile + desktop)

### Overall MVP
- ✅ All 14 features functional (per SYSTEM_SPEC)
- ✅ Performance targets met (<2s page load, <500ms nav)
- ✅ Security: RLS policies tested
- ✅ AI integration working (real responses)
- ✅ PWA installable

---

## 8. Orchestrator Instructions

### Starting Work

1. **Create agents** for each track (6 agents)
2. **Assign file scopes** to prevent conflicts
3. **Launch Track 1, 2, 3** in parallel (Week 1)
4. **Monitor spike completion** before allowing Phase 2 AI work
5. **Launch Track 4** after Migration 003 completes
6. **Launch Track 5** after dependencies from Track 2, 3, 4 complete
7. **Launch Track 6** in Week 5-6

### Monitoring Progress

```bash
# Check ready beads
bd ready

# Check blocked beads
bd list --status open | grep blocked

# Visualize critical path
bv --robot-insights | jq '.Bottlenecks[:5]'

# Check track progress
bd list --status open --priority P1
```

### Handling Blockers

- **Spike failures**: Adjust approach before Phase 2
- **API design changes**: Update dependent frontend beads
- **Integration issues**: Create ad-hoc spikes

---

## 9. Communication Protocol

### Agent Check-ins
- **Frequency**: End of each bead
- **Format**: `bd close <id> --reason "<summary>"`
- **Include**: What worked, what didn't, learnings for next bead

### Cross-Track Coordination
- **API Changes**: Notify Track 4 (frontend)
- **Spike Learnings**: Document in `.spikes/` for Track 3 reference
- **Blockers**: Tag orchestrator immediately

---

## 10. Next Steps

### Immediate Actions (Today)
1. ✅ Planning complete (this document)
2. ⏳ Review execution plan with user
3. ⏳ Get approval to proceed

### Week 1 Launch (After Approval)
1. Create 6 agent sessions (one per track)
2. Launch Track 1, 2, 3 in parallel
3. Monitor spike completion (Track 3)

### Ongoing
- Daily standups via bd status
- Weekly reviews via bv insights
- Adjust priorities based on learnings

---

## 11. Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Spike failures | HIGH | Iterate spikes until validated |
| API contract changes | MEDIUM | Version APIs, clear contracts |
| Library compatibility | MEDIUM | Test integrations early |
| Concurrent edit conflicts | MEDIUM | Optimistic UI + conflict resolution |
| Service Worker bugs | MEDIUM | Extensive testing, feature flags |

---

## 12. Handoff Checklist

Before considering work "done":

- [ ] All 43 beads closed
- [ ] `bd ready` returns empty
- [ ] `bv --robot-insights` shows no blockers
- [ ] All tests pass (manual for MVP)
- [ ] No console errors in production build
- [ ] Performance audits pass (Lighthouse)
- [ ] Security audit pass (RLS policies)
- [ ] Documentation updated (README, SETUP)
- [ ] Demo video recorded
- [ ] Deployed to production

---

**Status**: Ready to execute  
**Orchestrator**: Awaiting user approval to proceed

---

**Generated by**: OpenCode Planning Pipeline  
**Based on**: SYSTEM_SPEC v1.0, Discovery Report, Approach Document  
**Validated with**: bv --robot-insights, bv --robot-plan
