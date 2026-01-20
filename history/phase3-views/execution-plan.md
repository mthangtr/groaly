# Execution Plan: Phase 3 - Views & Interactions

## Epic
- **ID**: dumtasking-17z
- **Title**: Phase 3: Views & Interactions
- **Description**: Weeks 7-9: Realtime, Kanban, Calendar, Table, Focus Mode

## Tracks Overview

Four parallel tracks with independent file scopes:

| Track | Agent | Beads (in order) | File Scope |
|-------|-------|------------------|------------|
| 1 | BlueLake | dumtasking-amw → dumtasking-bd2 → dumtasking-twa | `hooks/useRealtimeSubscription.ts`, `lib/supabase/realtime.ts`, `components/views/Kanban*.tsx`, `components/views/Calendar*.tsx` |
| 2 | GreenCastle | dumtasking-00w → dumtasking-89p → dumtasking-7mj | `app/(dashboard)/table/**`, `components/views/TableView.tsx` |
| 3 | RedStone | dumtasking-zdc → dumtasking-2yv → dumtasking-oxy → dumtasking-9g0 | `app/(dashboard)/focus/**`, `components/focus/**`, `app/api/focus-sessions/**` |
| 4 | PurpleBear | dumtasking-0or → dumtasking-2cr → dumtasking-2gu | `stores/**`, `app/api/protected-slots/**`, `components/accountability/**` |

## Shared Resources (READ-ONLY)
- `lib/supabase/client.ts` - Supabase browser client
- `lib/supabase/server.ts` - Supabase server client
- `lib/utils.ts` - Utility functions (cn, etc.)
- `types/` - Shared TypeScript types

## Track Details

### Track 1: Realtime & Drag-Drop Views (BlueLake)
**Risk**: MEDIUM - Realtime subscriptions, drag-drop state management

**Beads**:
1. `dumtasking-amw`: Supabase Realtime Subscription Hook
   - Create `useRealtimeSubscription<T>()` hook
   - Optimistic UI helpers
   - Subscription cleanup
   
2. `dumtasking-bd2`: Kanban Drag-and-Drop Integration
   - Install @dnd-kit/core, @dnd-kit/sortable
   - Drag tasks between columns
   - Realtime sync integration
   - Touch support

3. `dumtasking-twa`: Calendar Drag-and-Drop Integration
   - Drag tasks to reschedule
   - Visual density indicators
   - Realtime sync

**Dependencies to Install**:
```bash
bun add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### Track 2: Table View (GreenCastle)
**Risk**: MEDIUM - Complex table state management

**Beads**:
1. `dumtasking-00w`: Table View with TanStack Table
   - TanStack Table v8 integration
   - Inline editing (title, status, priority, due date)
   - Sortable columns, filters, pagination
   
2. `dumtasking-89p`: Table Bulk Actions
   - Multi-select rows
   - Bulk status change, priority change, delete
   
3. `dumtasking-7mj`: Table Export Functionality
   - CSV export
   - JSON export

**Dependencies to Install**:
```bash
bun add @tanstack/react-table
```

### Track 3: Focus Mode (RedStone)
**Risk**: MEDIUM - Browser APIs (PiP, Fullscreen, Notifications)

**Beads**:
1. `dumtasking-zdc`: Focus Mode PiP Timer
   - Picture-in-Picture floating timer
   - Fullscreen API integration
   - Pomodoro timer (25/5/15)
   - Start/Pause/Reset controls
   
2. `dumtasking-2yv`: Focus Mode Ambient Audio Player
   - White noise, rain, coffee shop sounds
   - Volume control
   - Audio preloading
   
3. `dumtasking-oxy`: Focus Celebration Animation
   - Confetti on task completion
   - Sound effects
   
4. `dumtasking-9g0`: Focus Sessions API
   - POST/GET/PATCH focus sessions
   - Session statistics

### Track 4: State & Protected Slots (PurpleBear)
**Risk**: MEDIUM - State management patterns

**Beads**:
1. `dumtasking-0or`: State: Setup Zustand Store & Supabase Realtime
   - UI store (sidebar, modals, filters)
   - Notes store with optimistic updates
   - Tasks store with optimistic updates

2. `dumtasking-2cr`: Protected Slots CRUD API
   - Create protected time slots
   - Recurring slots (days, time range)
   - Types: Protected / Focus Only
   
3. `dumtasking-2gu`: Compassionate Accountability Flow
   - Evening motivation handling
   - Defer/Weekend/Cancel options

**Dependencies to Install**:
```bash
bun add zustand
```

## Cross-Track Dependencies

- Track 1 (BlueLake) beads `dumtasking-bd2` and `dumtasking-twa` depend on `dumtasking-amw`
- Tracks 2, 3, 4 are fully independent and can run in parallel from the start
- Track 1 starts with `dumtasking-amw` then parallelizes Kanban/Calendar

## Orchestrator
- **Name**: GoldFox
- **Epic Thread**: dumtasking-17z

## Notes

1. **Realtime Hook First**: BlueLake must complete `dumtasking-amw` before Kanban/Calendar drag-drop
2. **Package Installation**: Each track needs specific npm packages - install at bead start
3. **Mock Data Migration**: Replace `mockTasks` with real API calls after Realtime hook ready
4. **Focus Mode Polyfills**: PiP API not supported in all browsers - add fallback
