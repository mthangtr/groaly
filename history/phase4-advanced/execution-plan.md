# Execution Plan: Phase 4 Advanced & Execution

Epic: dumtasking-l7i
Generated: 2026-01-25

## Tracks

| Track | Agent       | Beads (in order)                              | File Scope                         |
| ----- | ----------- | --------------------------------------------- | ---------------------------------- |
| 1     | BlueLake    | dumtasking-9el → dumtasking-aml               | `app/api/**`, `lib/ai/**`          |
| 2     | GreenCastle | dumtasking-tun                                | `components/views/**`, `lib/**`    |
| 3     | RedStone    | dumtasking-4jy                                | `app/api/weekly-reviews/**`, `supabase/functions/**` |
| 4     | PurpleBear  | dumtasking-be0                                | `components/settings/**`, `lib/crypto/**`, `app/api/user/**` |
| 5     | SilverPine  | dumtasking-7ot                                | `next.config.ts`, `public/**`      |

## Track Details

### Track 1: BlueLake - Related Tasks + Calendar AI Scheduling

**File scope**: `app/api/**`, `lib/ai/**`
**Beads**:

1. `dumtasking-9el`: Related Tasks API (rule-based scoring)
2. `dumtasking-aml`: Optimize Week scheduling algorithm + API

### Track 2: GreenCastle - Protected Slots Recurrence & Visualization

**File scope**: `components/views/**`, `lib/**`
**Beads**:

1. `dumtasking-tun`: Protected slots recurrence, UI, visualization

### Track 3: RedStone - Weekly Review API + Cron

**File scope**: `app/api/weekly-reviews/**`, `supabase/functions/**`
**Beads**:

1. `dumtasking-4jy`: Weekly review generation API + cron job

### Track 4: PurpleBear - BYOK API Keys (Encrypted)

**File scope**: `components/settings/**`, `lib/crypto/**`, `app/api/user/**`
**Beads**:

1. `dumtasking-be0`: API keys input + AES-GCM encryption flow

### Track 5: SilverPine - PWA Setup

**File scope**: `next.config.ts`, `public/**`
**Beads**:

1. `dumtasking-7ot`: PWA config + service worker + manifest

## Cross-Track Dependencies

- Track 5 is optional (P3) and can run after P2 tasks if needed.
- Other tracks are independent for Phase 4 delivery.

## Key Learnings

- Related tasks logic uses rule-based scoring per SYSTEM_SPEC Feature 12.
- Protected slots recurrence requires RRULE parsing and calendar styling.
