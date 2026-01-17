# MCP Agent Mail - Coordination Guide

> **TL;DR**: Prevents file conflicts when multiple agents work in parallel. Reserve files → announce work → collaborate → release.

## What is Agent Mail?

A mail-like coordination layer for coding agents that provides:
- **File reservations**: Advisory locks to prevent edit conflicts
- **Messaging**: Thread-based communication with inbox/outbox
- **Audit trail**: Everything stored in Git (human-readable Markdown)

Server: `http://127.0.0.1:8765/mcp/`

---

## Quick Reference

### Essential Workflow

```typescript
// 1. Register identity (once per project)
register_agent(
  project_key: "D:\\Workspace\\projects\\dumtasking",
  program: "opencode",
  model: "gpt-5-mini",
  name: "AliceAgent"  // Optional - auto-generated if omitted
)

// 2. Reserve files BEFORE editing
file_reservation_paths(
  project_key: "D:\\Workspace\\projects\\dumtasking",
  agent_name: "AliceAgent",
  paths: ["src/components/**/*.tsx"],
  ttl_seconds: 3600,
  exclusive: true,  // Block others from editing
  reason: "dt-123: Implementing dark mode"
)

// 3. Announce your work
send_message(
  project_key: "D:\\Workspace\\projects\\dumtasking",
  sender_name: "AliceAgent",
  to: ["BobAgent"],
  thread_id: "dt-123",  // Match Beads issue ID
  subject: "[dt-123] Starting dark mode implementation",
  body_md: "Working on components: Button, Card, Dialog",
  ack_required: true
)

// 4. Work on your task...

// 5. Release when done
release_file_reservations(
  project_key: "D:\\Workspace\\projects\\dumtasking",
  agent_name: "AliceAgent",
  paths: ["src/components/**/*.tsx"]
)

send_message(
  thread_id: "dt-123",
  subject: "[dt-123] Completed",
  body_md: "All components updated. Ready for review."
)
```

---

## Integration with Beads

### Mapping Convention

| Beads | Agent Mail | Git Commit |
|-------|-----------|------------|
| Issue ID: `dt-123` | `thread_id: "dt-123"` | `"feat: dark mode (dt-123)"` |
| Task status | Message thread | File reservations |
| Dependencies | ACK-required messages | Reserved paths |

### Standard Flow

```bash
# 1. Pick work from Beads
bd ready --json  # → dt-123 is highest priority
bd update dt-123 --status in_progress

# 2. Reserve files (Agent Mail)
file_reservation_paths(
  paths: ["src/**"],
  reason: "dt-123"  # ← Include issue ID
)

# 3. Announce (Agent Mail)
send_message(
  thread_id: "dt-123",  # ← Match issue ID
  subject: "[dt-123] Start: <title>"
)

# 4. Work and commit
git commit -m "feat: implement feature (dt-123)"  # ← Include issue ID

# 5. Complete (Beads + Agent Mail)
bd close dt-123 --reason "Completed"
release_file_reservations(paths: ["src/**"])
send_message(thread_id: "dt-123", subject: "[dt-123] Completed")
```

---

## Common Patterns

### Check Inbox Before Starting Work

```typescript
fetch_inbox(
  project_key: "D:\\Workspace\\projects\\dumtasking",
  agent_name: "AliceAgent",
  urgent_only: true,
  limit: 10
)
// Check for: file reservation conflicts, blocked tasks, urgent requests
```

### Handle Reservation Conflicts

```typescript
// You try to reserve
file_reservation_paths(paths: ["src/auth/**"])

// Server returns:
{
  granted: ["src/auth/**"],
  conflicts: [
    {
      agent: "BobAgent",
      pattern: "src/auth/login.tsx",
      expires_at: "2026-01-18T03:45:00Z",
      reason: "dt-456: Fixing auth bug"
    }
  ]
}

// Action: Pick a different task or wait for expiry
```

### Cross-Agent Communication

```typescript
// Agent A notifies Agent B about API changes
send_message(
  sender_name: "BackendAgent",
  to: ["FrontendAgent"],
  thread_id: "dt-789",
  subject: "[dt-789] API endpoint /users updated",
  body_md: `
## Breaking Change
- \`POST /users\` now requires \`email\` field
- Old: \`{ name: string }\`
- New: \`{ name: string, email: string }\`
  `,
  ack_required: true  // Frontend must acknowledge
)
```

---

## Macros for Speed

### `macro_start_session` - Onboarding in One Call

```typescript
macro_start_session(
  human_key: "D:\\Workspace\\projects\\dumtasking",
  program: "opencode",
  model: "gpt-5-mini",
  agent_name: "AliceAgent",
  file_reservation_paths: ["src/features/**"],
  file_reservation_reason: "dt-123",
  inbox_limit: 10
)
// → Combines: ensure_project + register_agent + file_reservation + fetch_inbox
```

### `macro_file_reservation_cycle` - Reserve → Work → Release

```typescript
macro_file_reservation_cycle(
  project_key: "D:\\Workspace\\projects\\dumtasking",
  agent_name: "AliceAgent",
  paths: ["src/components/**"],
  ttl_seconds: 1800,
  exclusive: true,
  reason: "dt-123",
  auto_release: true  // Auto-release after macro completes
)
// Use this for quick edits with automatic cleanup
```

---

## Troubleshooting

### "from_agent not registered"
**Fix**: Call `register_agent` first with correct `project_key`

### "FILE_RESERVATION_CONFLICT"
**Fix**: Check conflicts, adjust paths, or wait for expiry

### Inbox empty but messages exist
**Fix**: Verify `agent_name` exact match (case-sensitive)

### Server not responding
**Fix**: Check server is running:
```bash
curl http://127.0.0.1:8765/health/liveness
# Restart if needed:
cd ~/mcp_agent_mail && bash scripts/run_server_with_token.sh
```

---

## Advanced: Resources (Fast Reads)

Instead of tools, use resources for non-mutating reads:

```typescript
// Read inbox (no side effects)
resource://inbox/AliceAgent?project=D:\Workspace\projects\dumtasking&limit=20

// View thread
resource://thread/dt-123?project=D:\Workspace\projects\dumtasking&include_bodies=true

// Check file reservations
resource://file_reservations/project-slug?active_only=true
```

---

## Environment Variables

Set in your shell for pre-commit guard:

```bash
export AGENT_NAME="AliceAgent"
export AGENT_MAIL_PROJECT="D:\\Workspace\\projects\\dumtasking"
```

The pre-commit hook will block commits that conflict with other agents' exclusive reservations.

---

## Project Key Format

Always use **absolute path** to project root:

```typescript
// ✅ Correct
project_key: "D:\\Workspace\\projects\\dumtasking"

// ❌ Wrong
project_key: "./dumtasking"
project_key: "dumtasking"
```

Slugs are derived automatically (e.g., `dumtasking-a1b2c3d4`)

---

## Further Reading

- Full README: `~/mcp_agent_mail/README.md`
- Tool schemas: `resource://tooling/schemas`
- Workflow playbooks: `resource://tooling/directory`
