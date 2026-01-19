# Execution Plan: Phase 1 - Foundation

**Generated**: 2026-01-19  
**Epic**: Phase 1: Foundation (Weeks 1-3)  
**Total Tasks**: 16  
**Ready to Start**: 1 (dumtasking-p70)

---

## Critical Path

```
p70 → yhp → dua → 92i → 179
 │      │     └─→ 3dz → 74c
 │      │     └─→ 7k8 → be0 (HIGH RISK)
 │      │     └─→ 5bj
 │      ├─→ v69 → jxf
 │      └─→ 0or
 ├─→ 2ln ──→ 92i, 7k8
 ├─→ 25c ──→ 179
 └─→ d29
```

**Longest Path**: 5 steps (p70 → yhp → dua → 92i → 179)  
**Estimated Duration**: 2-3 weeks

---

## Parallel Tracks

After `dumtasking-p70` (Project Setup) completes, work can split into **4 parallel tracks**:

### Track 1: BlueLake - Infrastructure & Auth
**File Scope**: `lib/supabase/**`, `supabase/**`, `app/(auth)/**`, `contexts/**`, `middleware.ts`

| Order | Bead | Title | Risk |
|-------|------|-------|------|
| 1 | `dumtasking-yhp` | Setup Supabase Project & Environment Variables | LOW |
| 2 | `dumtasking-dua` | Database Schema: Create Core Tables Migration | MEDIUM |
| 3 | `dumtasking-5bj` | Database Security: Implement RLS Policies | MEDIUM |
| 4 | `dumtasking-v69` | Auth: Implement Supabase Magic Link Authentication | LOW |
| 5 | `dumtasking-jxf` | Auth: Create Auth Context & Protected Routes | LOW |

### Track 2: GreenCastle - Dashboard & Layout
**File Scope**: `app/(dashboard)/layout.tsx`, `components/layout/**`, `components/common/**`

| Order | Bead | Title | Risk |
|-------|------|-------|------|
| 1 | `dumtasking-2ln` | Layout: Create Dashboard Shell with Sidebar & Header | LOW |
| 2 | `dumtasking-d29` | UI: Create Common Components | LOW |

### Track 3: RedStone - Notes Feature
**File Scope**: `app/(dashboard)/notes/**`, `app/api/notes/**`, `components/notes/**`, `lib/tiptap/**`

| Order | Bead | Title | Risk |
|-------|------|-------|------|
| 1 | `dumtasking-25c` | Notes: Implement Tiptap Rich Text Editor | MEDIUM |
| 2 | `dumtasking-92i` | Notes: Create Notes List & CRUD API | LOW |
| 3 | `dumtasking-179` | Notes: Create Note Detail Page with Editor | LOW |

**Note**: Track 3 waits for Track 1 (dua) and Track 2 (2ln) before 92i can start.

### Track 4: PurpleBear - Tasks & Settings
**File Scope**: `app/api/tasks/**`, `app/(dashboard)/settings/**`, `components/tasks/**`, `components/settings/**`, `lib/crypto/**`

| Order | Bead | Title | Risk |
|-------|------|-------|------|
| 1 | `dumtasking-3dz` | Tasks: Create Tasks CRUD API | LOW |
| 2 | `dumtasking-74c` | Tasks: Create TaskCard & TaskModal Components | LOW |
| 3 | `dumtasking-7k8` | Settings: Create Settings Page with Profile Section | LOW |
| 4 | `dumtasking-be0` | Settings: Implement BYOK API Keys with Encryption | **HIGH** |

**Note**: Track 4 waits for Track 1 (dua) and Track 2 (2ln).

### Standalone: State Management
**File Scope**: `stores/**`, `hooks/useRealtimeSync.ts`

| Bead | Title | Risk |
|------|-------|------|
| `dumtasking-0or` | State: Setup Zustand Store & Supabase Realtime | MEDIUM |

Can start after Track 1's `yhp` completes.

---

## Cross-Track Dependencies

```
Track 1 (BlueLake)     Track 2 (GreenCastle)     Track 3 (RedStone)     Track 4 (PurpleBear)
       │                       │                        │                       │
      yhp                     2ln                      25c                      │
       │                       │                        │                       │
      dua ─────────────────────┼────────────────────────┼───────────────────────┤
       │                       │                        │                       │
       │                       └────────────────────────┼───────────────────── 92i
       │                       │                        │                       │
       │                       └────────────────────────┼───────────────────── 7k8
       │                                               │                       │
      5bj                                             179                     3dz
       │                                                                       │
      v69                                                                    74c
       │                                                                       │
      jxf                                                                   be0 (SPIKE)
```

---

## Risk Items

### HIGH Risk - Requires Spike

**`dumtasking-be0`: BYOK API Keys with Encryption**

Before starting this task, create a spike:

```bash
bd create "Spike: Validate AES-256-GCM encryption in Edge Runtime" -t task -p 0
```

**Questions to answer:**
1. Does `crypto.subtle` work in Vercel Edge Functions?
2. Can we derive a key from ENCRYPTION_KEY env var securely?
3. What's the correct IV handling for GCM mode?

**Time-box**: 30 minutes  
**Output**: `.spikes/byok-encryption/` with working prototype

### MEDIUM Risk - Monitor Closely

- `dumtasking-dua` - Schema decisions affect everything downstream
- `dumtasking-25c` - Tiptap SSR issues common
- `dumtasking-0or` - Realtime subscription cleanup

---

## Execution Order (Single Developer)

If working solo, follow this order for optimal flow:

1. **Week 1: Foundation**
   - `p70` → `yhp` → `dua` → `5bj` (Infrastructure)
   - `v69` → `jxf` (Auth)
   - `2ln` → `d29` (Layout)

2. **Week 2: Notes Feature**
   - `25c` → `92i` → `179` (Notes complete)
   - `0or` (Realtime sync)

3. **Week 3: Tasks & Settings**
   - `3dz` → `74c` (Tasks)
   - `7k8` (Settings)
   - **SPIKE** for BYOK encryption
   - `be0` (BYOK - only after spike validates approach)

---

## Success Metrics

Phase 1 is complete when:

- [ ] User can sign up/login with magic link
- [ ] User can create, edit, delete notes with rich text
- [ ] User can view tasks (CRUD API working)
- [ ] Dashboard layout responsive on mobile/desktop
- [ ] Settings page allows profile editing
- [ ] Realtime sync working (changes reflect across tabs)
- [ ] All beads closed with `bd close`

---

## Commands Reference

```bash
# Start working
bd ready                    # See available work
bd update <id> --status=in_progress

# Complete work  
bd close <id> --reason="<what was done>"

# Check progress
bd stats
bv --robot-plan            # Updated execution view

# Sync at session end
bd sync && git push
```
