# Execution Plan: Phase 2 AI Intelligence

## Epic
- **ID**: dumtasking-b81
- **Title**: Phase 2: AI Intelligence
- **Description**: Weeks 4-6: AI Task Extraction, Chat, Suggestions - Core AI features

## Tracks Overview

Three parallel tracks with independent file scopes:

| Track | Agent | Bead(s) | File Scope |
|-------|-------|---------|------------|
| 1 | BlueLake | dumtasking-lze | `app/api/ai/suggestions/**`, `lib/ai/suggestion-algorithm.ts` |
| 2 | GreenCastle | dumtasking-65q | `app/api/ai/extract-tasks/**`, `lib/ai/schemas.ts`, `lib/ai/client.ts` |
| 3 | RedStone | dumtasking-xdg | `app/api/ai/chat/**`, `lib/ai/tools.ts`, `lib/ai/context-builder.ts` |

## Shared Resources (READ-ONLY)
- `lib/ai/openrouter.ts` - OpenRouter client (from spikes)
- `lib/ai/retry.ts` - Retry logic (from spikes)
- `lib/ai/structured-output.ts` - Zod structured output (from spikes)
- `lib/ai/context.ts` - Context utilities (from spikes)
- `.spikes/ai-integration/**` - Reference implementations

## Track Details

### Track 1: AI Suggestions API (BlueLake)
**Bead**: dumtasking-lze (IN_PROGRESS)
**Risk**: LOW - Pure logic algorithm, no external API dependency

**Deliverables**:
- `app/api/ai/suggestions/route.ts` - GET endpoint
- `lib/ai/suggestion-algorithm.ts` - Core algorithm

**Acceptance Criteria**:
- GET /api/ai/suggestions returns top 3 tasks
- Algorithm: filter, remove blocked, sort, balance workload
- Response: { suggestions: Task[], insights: {...} }
- Workload indicator: light/balanced/heavy
- Energy level consideration

### Track 2: AI Task Extraction API (GreenCastle)
**Bead**: dumtasking-65q
**Risk**: MEDIUM - External API integration

**Deliverables**:
- `app/api/ai/extract-tasks/route.ts` - POST endpoint
- `lib/ai/schemas.ts` - Zod schemas for Task extraction
- `lib/ai/client.ts` - High-level AI client wrapper

**Acceptance Criteria**:
- POST /api/ai/extract-tasks accepts { note_id, content }
- Claude 3.7 Sonnet via OpenRouter
- Zod schema validation for Task[]
- Response: { tasks: Task[], reasoning: string }
- Error handling + exponential backoff retry

### Track 3: AI Chat API with Streaming (RedStone)
**Bead**: dumtasking-xdg
**Risk**: MEDIUM - Streaming + tool calling complexity

**Deliverables**:
- `app/api/ai/chat/route.ts` - POST endpoint with streaming
- `lib/ai/tools.ts` - Tool definitions (8 tools)
- `lib/ai/context-builder.ts` - Context injection

**Acceptance Criteria**:
- POST /api/ai/chat with streaming response
- 8 tools implemented
- Context injection: user tasks, notes, calendar
- Message persistence to chat_messages table
- Error handling for stream interruptions

## Cross-Track Dependencies
None - all tracks are independent after spikes completed.

## Orchestrator
- **Name**: GoldFox
- **Epic Thread**: dumtasking-b81
