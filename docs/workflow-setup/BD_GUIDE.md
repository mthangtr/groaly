# Beads (bd) - Complete Reference Guide

> **Comprehensive documentation for understanding and using Beads issue tracking system**

---

## Table of Contents

1. [Understanding the Problem](#understanding-the-problem)
2. [Why Not Just Use Markdown?](#why-not-just-use-markdown)
3. [Core Concepts](#core-concepts)
4. [ID Format and Prefix Management](#id-format-and-prefix-management)
5. [Advanced Features](#advanced-features)
6. [Beads UI](#beads-ui)
7. [Development Guidelines](#development-guidelines)
8. [Release Management](#release-management)

---

## Understanding the Problem

### What is AI Agent Amnesia?

AI coding agents (like Claude, Cursor, Aider) have a fundamental limitation: **limited context window**.

```
┌─────────────────────────────────────────────────────────┐
│                   CONTEXT WINDOW                         │
│                   (AI's memory)                          │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ System prompt + Conversation + Code + Files...    │   │
│  │                                                    │   │
│  │ Limit: ~100k-200k tokens                          │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  When full → COMPACT (compress) or CLEAR               │
│  → Loses conversation history                           │
│  → Agent forgets what it was doing                      │
└─────────────────────────────────────────────────────────┘
```

**The core problem:**
- AI Agent only "remembers" what's in the context window
- Context window has limits
- When compact/clear happens → information is lost
- New session = Agent knows nothing about previous session

### Real-World Example

```
You: "Build Authentication feature for me"

AI Agent: "OK, I will:
1. Create database schema
2. Write Login API
3. Add JWT middleware
4. Create Logout endpoint"

[... Agent completes step 1, 2 ...]

[Context window full → Compact/Clear]

AI Agent: "Hello! How can I help you?"

You: "??? You were building Authentication!"

AI Agent: "I don't remember... Can you explain again?"
```

This is **Agent Amnesia** - the core problem Beads solves.

---

## Why Not Just Use Markdown?

Many people ask: **"We already use Markdown (tasks.md, TODO.md) for task tracking. Why do we need Beads?"**

This is an **excellent question** that deserves a detailed answer.

### Problem 1: Markdown is Implicit - Agent Must Infer

```markdown
# tasks.md
- [ ] Login API (depends on: Setup database)
```

Agent reads text but must **infer meaning**:
- What does "depends on" mean? Complete block? Just related?
- Is "Setup database" done? Must search the file
- Which task has higher priority? Not clear

```
Agent reads file and infers:
"Hmm, Login API depends on Setup database...
 Let me find Setup database in the file...
 Found in TODO section, no [x] mark...
 So it's probably not done...
 I shouldn't work on Login API..."
```

**Problem:** 
- Inference = **Costs tokens** (must "think")
- Inference = **Can be wrong** (might misunderstand format)

### Beads Comparison:

```bash
$ bd ready --json
[{"id":"bd-1","title":"Setup database","priority":1}]
```

**Explicit - Clear:** 
- Only ready tasks returned
- Agent **doesn't need to infer**
- Ask → Get precise answer

---

### Problem 2: Markdown Has No "Query" - Must Read Entire File

```
┌─────────────────────────────────────────────────────────┐
│                   MARKDOWN APPROACH                      │
│                                                          │
│   tasks.md has 500 lines                                │
│   ┌──────────────────────────────────────────────────┐  │
│   │ # Epic 1                                          │  │
│   │ - [ ] Task 1.1                                    │  │
│   │ - [ ] Task 1.2 (depends on 1.1)                  │  │
│   │ - [x] Task 1.3                                    │  │
│   │ # Epic 2                                          │  │
│   │ - [ ] Task 2.1                                    │  │
│   │ ... (hundreds of lines more)                     │  │
│   └──────────────────────────────────────────────────┘  │
│                                                          │
│   Agent wants "what can I work on?"                     │
│                                                          │
│   Must: LOAD ENTIRE FILE into context                   │
│         → 500 lines ≈ 2000 tokens                       │
│         → Parse text, find patterns [ ] and [x]         │
│         → Analyze "depends on"                          │
│         → Infer which tasks are ready                   │
│         → EVERY TIME costs this much!                   │
└─────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────┐
│                    BEADS APPROACH                        │
│                                                          │
│   Agent wants "what can I work on?"                     │
│                                                          │
│   $ bd ready --json                                     │
│   ┌──────────────────────────────────────────────────┐  │
│   │ [{"id":"bd-1","title":"Setup database","p":1}]   │  │
│   └──────────────────────────────────────────────────┘  │
│                                                          │
│   Agent receives: ONLY NECESSARY DATA                    │
│                   → 1 ready task ≈ 50 tokens            │
│                   → Already filtered                     │
│                   → Already sorted by priority           │
│                   → No inference needed                  │
└─────────────────────────────────────────────────────────┘
```

**Core issue:** Markdown doesn't scale. Large project = large file = costs context every read.

---

### Problem 3: Markdown Doesn't Track "In-Progress State"

This is the **MOST CRITICAL PROBLEM**!

**Markdown only has 2 states:**
```markdown
- [ ] Task not started (TODO)
- [x] Task completed (DONE)
```

**Missing:**
- "50% complete"
- "Waiting for review"
- "Blocked by other task"
- "Who is working on this"

**Consequence when compact happens mid-work:**

```
Session in progress:
├── Agent reads tasks.md
├── Agent sees: - [ ] Setup database (not started)
├── Agent STARTS working on Setup database
├── Agent completes 50% (schema done, creating migrations)
│
└── COMPACT HAPPENS (mid-work!)
    │
    ▼
    Agent loses conversation
    Agent reads tasks.md again
    Agent sees: - [ ] Setup database (still no [x]!)
    
    Agent thinks: "This task not started. Let me begin..."
    
    → STARTS OVER FROM BEGINNING! 😱
    → Old code might get overwritten!
```

### Beads Comparison:

```bash
# BEFORE compact - Agent records progress
$ bd update bd-1 --status in_progress
$ bd update bd-1 --notes "
  COMPLETED: Database schema designed, tables created
  IN PROGRESS: Creating migration files
  NEXT: Run migrations on dev server
  FILES: src/db/schema.sql, migrations/001_init.sql
"

[COMPACT HAPPENS]

# AFTER compact - Agent queries again
$ bd show bd-1

Status: in_progress  ← Knows it's partially done!
Notes: "COMPLETED: schema... IN PROGRESS: migrations..."

Agent: "Ah, I'm creating migration files. schema.sql is done.
        Continue with migrations..."

→ CONTINUES FROM CORRECT SPOT! ✅
```

---

### Problem 4: Markdown Easily Conflicts with Multiple Editors

```
Alice and Bob both edit tasks.md:

Alice's version:
- [x] Setup database        ← Alice marks done
- [ ] Login API

Bob's version (same time):
- [ ] Setup database
- [x] Login API             ← Bob marks done

Git merge:
<<<<<<< Alice
- [x] Setup database
- [ ] Login API
=======
- [ ] Setup database  
- [x] Login API
>>>>>>> Bob

→ CONFLICT! Must resolve manually
```

### Beads Comparison:

```bash
# Alice creates task
$ bd create "Setup database"    # → bd-a1b2 (hash)

# Bob creates task (same time)
$ bd create "Login API"         # → bd-c3d4 (different hash)

# Git merge: No conflict!
# Each task is separate line in JSONL
# IDs are hashes, never collide
```

---

### Summary: Markdown vs Beads for Task Management

| Aspect | Markdown (tasks.md) | Beads |
|--------|---------------------|-------|
| **Getting "ready tasks"** | Read entire file, parse, infer | `bd ready` → get exact tasks |
| **Context cost** | Entire file (2000+ tokens possible) | Only needed data (~50-100 tokens) |
| **Dependencies** | Text description, agent interprets | Database enforced, auto-blocks |
| **State tracking** | Only TODO/DONE | open/in_progress/blocked/closed + notes |
| **Track mid-work progress** | ❌ Not possible | ✅ Detailed notes |
| **Multiple editors** | Easy conflicts | Hash IDs, auto-merge |
| **After compact** | Re-read entire file, might misunderstand | Query precise state |

---

### One-Sentence Summary

> **Markdown is a "task list" for reading and self-understanding.**
> **Beads is a "task management system" for querying and receiving answers.**
>
> With Markdown: Agent reads list → Infers "what can I do" → Might be wrong, costs tokens
>
> With Beads: Agent asks "what can I do?" → Receives exact tasks → Accurate, efficient

---

## Core Concepts

### What is Beads?

Beads = **Issue Tracker** (like Jira, Trello) but designed **for AI Agents**, not for humans.

> *"bd is a lightweight, git-based issue tracker designed for AI coding agents."*

### Key Advantages Over Jira/Trello

| Feature | Jira/Trello | Beads | Why Important? |
|---------|-------------|-------|----------------|
| **Interface** | Web UI for humans | CLI + JSON for agents | Agents can't use UI |
| **Query** | Mouse clicks | `bd ready --json` | Agents need structured output |
| **Storage** | Cloud server | Local Git | No internet needed, sync via git |
| **ID** | Sequential (PROJ-1, PROJ-2) | Hash (bd-a1b2) | Avoid conflicts with multiple agents |

### Smart Task Management Features

#### ✅ **1. Clear Priority System**

```bash
-p 0  # P0 - Critical (most urgent, do now)
-p 1  # P1 - High (important)
-p 2  # P2 - Medium (normal)
-p 3  # P3 - Low (can wait)
-p 4  # P4 - Backlog (when free)
```

**Why good?** Agent automatically knows what to do first:
```bash
$ bd ready --json
# Output: Returns tasks sorted P0 → P1 → P2...
# Agent automatically picks P0 first
```

#### ✅ **2. Dependencies - Logical Task Ordering**

This is **BRILLIANT**!

```
Example: Build Authentication feature

Task A: Setup database        ──┐
                                ├──→ Task C: Login API (needs A, B)
Task B: Config OAuth          ──┘           │
                                            ▼
                              Task D: Logout (needs C)
```

```bash
# Create tasks
bd create "Setup database" -p 1        # → bd-1
bd create "Config OAuth" -p 1          # → bd-2
bd create "Login API" -p 1             # → bd-3
bd create "Logout endpoint" -p 2       # → bd-4

# Set dependencies
bd dep add bd-3 bd-1   # Login depends on Database
bd dep add bd-3 bd-2   # Login depends on OAuth
bd dep add bd-4 bd-3   # Logout depends on Login

# Now ask: What tasks are ready?
$ bd ready
# Output: bd-1 (Setup database), bd-2 (Config OAuth)
# ✅ bd-3, bd-4 are BLOCKED - won't show in ready list!
```

**Why good?**
- Agent **CANNOT** work in wrong order
- Only unblocked tasks appear in `bd ready`
- When bd-1 and bd-2 close → bd-3 automatically becomes ready

#### ✅ **3. Auto-Ready Detection**

```bash
# Agent only needs to ask one question:
$ bd ready --json

# Beads automatically:
# - Filters open tasks
# - Removes blocked tasks
# - Sorts by priority
# - Returns "work that can be done now"
```

Agent doesn't need complex logic. Ask → Get work → Do it.

#### ✅ **4. Rich Status - Not Just TODO/DONE**

```bash
# States in Beads:
open         # Not started
in_progress  # Currently working
blocked      # Blocked by other task
closed       # Completed

# With detailed notes:
bd update bd-1 --status in_progress --notes "
COMPLETED: Schema design
IN PROGRESS: Writing migrations
NEXT: Run on dev server
"
```

#### ✅ **5. Discovered Work Tracking**

Working on task A, found bug B? Beads tracks it:

```bash
# Working on bd-10 (Add Payment)
# Discovered CORS bug

$ bd create "CORS bug" -t bug -p 0
# → bd-11

$ bd dep add bd-11 bd-10 --type discovered-from
# Records: "bd-11 discovered while working on bd-10"
```

**Why good?** 
- Don't lose track of emergent work
- Audit trail: know where bug came from
- Future agents can read history

#### ✅ **6. Hash-based ID - No Conflicts**

```
Jira: PROJ-1, PROJ-2, PROJ-3... (sequential)
      → 2 people create at once = CONFLICT!

Beads: bd-a1b2, bd-c3d4, bd-e5f6... (random hash)
       → 2 agents create at once = OK, different IDs!
```

#### ✅ **7. Hierarchical Structure - Epic/Task**

```bash
# Create Epic (large group)
bd create "Auth System" -t epic -p 1
# → bd-a3f8

# Create Sub-tasks (auto suffix)
bd create "Login UI" -p 1 --parent bd-a3f8      # → bd-a3f8.1
bd create "Backend API" -p 1 --parent bd-a3f8   # → bd-a3f8.2
bd create "Unit Tests" -p 2 --parent bd-a3f8    # → bd-a3f8.3

# When ALL children closed → Epic auto-closes!
```

#### ✅ **8. Git-Native - Auto Sync**

```bash
# Work on machine A
bd create "Fix bug" -p 1
git add .beads/
git commit -m "Add task"
git push

# Machine B (or different Agent)
git pull
bd ready  # Automatically sees new task!
```

---

## ID Format and Prefix Management

### The Problem: Bad IDs

When you run `bd init` **WITHOUT setting prefix**, Beads might create very long, ugly IDs:

```
❌ BAD IDs (no prefix):
Competitor-Video-Analysis-System-ey3
My-Super-Long-Project-Name-abc123

✅ GOOD IDs (short prefix):
cvs-ey3
myapp-a1b2
auth-c3d4
```

### ID Structure in Beads

```
<prefix>-<hash>

Examples:
┌────────┬───────┐
│ prefix │ hash  │
├────────┼───────┤
│ bd     │ a1b2  │  → bd-a1b2
│ myapp  │ c3d4  │  → myapp-c3d4
│ auth   │ e5f6  │  → auth-e5f6
└────────┴───────┘

With Epic and Sub-tasks:
┌────────┬───────┬─────────┐
│ prefix │ hash  │ suffix  │
├────────┼───────┼─────────┤
│ auth   │ a3f8  │         │  → auth-a3f8 (Epic)
│ auth   │ a3f8  │ .1      │  → auth-a3f8.1 (Sub-task 1)
│ auth   │ a3f8  │ .2      │  → auth-a3f8.2 (Sub-task 2)
└────────┴───────┴─────────┘
```

### Setting Prefix Correctly

#### For NEW projects:

```bash
# ✅ CORRECT - Set short prefix
bd init --prefix myapp
bd init --prefix cvs
bd init --prefix auth

# ❌ WRONG - No prefix (or too long)
bd init
bd init --prefix my-super-long-project-name
```

#### For existing database with bad prefix:

Use `bd rename-prefix` command:

```bash
# Step 1: Check current prefix
$ bd where
# Output: prefix: Competitor-Video-Analysis-System

# Step 2: Preview rename (doesn't change anything, just preview)
$ bd rename-prefix cvs- --dry-run

# Output:
# Would rename 5 issues:
#   Competitor-Video-Analysis-System-ey3 → cvs-ey3
#   Competitor-Video-Analysis-System-f4g → cvs-f4g
#   ...

# Step 3: Apply rename
$ bd rename-prefix cvs-

# Step 4: Verify
$ bd list
# Now shows: cvs-ey3, cvs-f4g, ...
```

### Prefix Naming Recommendations

| Project | Suggested Prefix | Example ID |
|---------|-----------------|-----------|
| Competitor Video System | `cvs-` | cvs-a1b2 |
| E-commerce App | `shop-` | shop-c3d4 |
| Authentication Service | `auth-` | auth-e5f6 |
| Mobile App | `app-` | app-g7h8 |
| API Backend | `api-` | api-i9j0 |

**Rules:**
- **Short:** 2-5 characters
- **Meaningful:** Easy to recognize project
- **Lowercase:** Easy to read, easy to type
- **Trailing dash:** `myapp-` (optional but clearer)

### Related Commands

| Command | Description |
|---------|-------------|
| `bd init --prefix <name>` | Set prefix during initialization |
| `bd rename-prefix <new>` | Rename prefix for ALL issues |
| `bd rename-prefix <new> --dry-run` | Preview rename (no changes) |
| `bd where` | Show database path and current prefix |
| `bd where --json` | Detailed JSON output |

### Important Notes

```
⚠️ CRITICAL:

1. SET PREFIX DURING INIT
   → Avoid having to rename later
   
2. IF YOU FORGOT TO SET PREFIX
   → Use bd rename-prefix to fix
   → This updates ALL issues in database
   
3. SYNC AFTER RENAME
   → Run bd sync after rename
   → Commit .beads/issues.jsonl to git
```

---

## Advanced Features

### Hooks and Auto-Sync

Beads uses hooks to automatically remind agents about workflow:

```
┌─────────────────────────────────────────────────────────┐
│                    CLAUDE CODE                           │
│                                                          │
│  Event: SessionStart (open Claude Code)                 │
│         ↓                                                │
│  Hook runs: bd prime                                    │
│         ↓                                                │
│  Output: ~1-2k tokens workflow guide                    │
│         ↓                                                │
│  Agent reads → Knows about Beads → Knows how to use     │
│                                                          │
│  Event: PreCompact (before compacting context)          │
│         ↓                                                │
│  Hook runs: bd sync                                     │
│         ↓                                                │
│  Save state → No data loss during compact               │
└─────────────────────────────────────────────────────────┘
```

### `bd prime` - Agent Guide

When running `bd prime`, it outputs text like:

```markdown
# Beads Workflow Context

## Core Rules
- Track strategic work in beads (multi-session, dependencies)
- Use `bd create` for issues
- Use `bd ready` to find work

## Essential Commands
- `bd ready --json` - See ready tasks
- `bd update <id> --status in_progress` - Claim task
- `bd close <id> --reason "Done"` - Complete task

## Session Close Protocol
1. Commit code
2. Update beads notes
3. bd sync
4. git push
```

**Purpose of `bd prime`:**
1. **Remind Agent:** "This project has Beads system"
2. **Teach Agent:** "These are basic commands"
3. **Guide Agent:** "Query Beads before working on tasks"

---

## Beads UI

### Problem: CLI Hard to Track for Humans

Beads is CLI-first, perfect for AI Agents, but for **humans**:

```
❌ Hard to visualize task overview
❌ No Board view like Trello/Jira
❌ Must type commands constantly to check status
```

### Solution: Beads UI

**Beads UI** is local web interface for Beads, created by community.

> *"Local UI for Beads — Collaborate on issues with your coding agent."*

**GitHub:** https://github.com/mantoni/beads-ui

### Key Features

| Feature | Description |
|---------|-------------|
| ✨ **Zero setup** | Just `bdui start` |
| 📺 **Live updates** | Auto-updates when database changes |
| 🔎 **Issues view** | Filter, search, inline edit |
| ⛰️ **Epics view** | See progress by Epic, expand rows |
| 🏂 **Board view** | Kanban board: Blocked / Ready / In Progress / Closed |
| ⌨️ **Keyboard navigation** | Navigate without mouse |

### Installation and Usage

```bash
# Install globally
npm i beads-ui -g

# Run in project with Beads
cd your-project
bdui start --open    # Auto-open browser
```

**Note:** Project must have `.beads/` (must have run `bd init`).

### Views in Beads UI

#### 📋 Issues View
See all issues list, filter by status, priority, search by title.

```
┌─────────────────────────────────────────────────────────┐
│  🔎 Search...                    [Status ▼] [Priority ▼]│
├─────────────────────────────────────────────────────────┤
│  ID       │ Title              │ Status    │ Priority  │
├───────────┼────────────────────┼───────────┼───────────┤
│  bd-a1b2  │ Setup database     │ ✅ closed │ P1        │
│  bd-c3d4  │ Login API          │ 🔄 prog   │ P1        │
│  bd-e5f6  │ JWT Middleware     │ 🟡 ready  │ P1        │
│  bd-g7h8  │ Logout endpoint    │ 🔴 blocked│ P2        │
└─────────────────────────────────────────────────────────┘
```

#### ⛰️ Epics View
See progress for each Epic, expand to see sub-tasks.

```
┌─────────────────────────────────────────────────────────┐
│  Epic                          │ Progress              │
├────────────────────────────────┼───────────────────────┤
│  ▶ bd-auth: Auth System        │ ████████░░ 75% (3/4)  │
│    ├── bd-auth.1: Setup OAuth  │ ✅ closed             │
│    ├── bd-auth.2: Login API    │ 🔄 in_progress        │
│    ├── bd-auth.3: JWT          │ 🟡 ready              │
│    └── bd-auth.4: Logout       │ 🔴 blocked            │
├────────────────────────────────┼───────────────────────┤
│  ▶ bd-pay: Payment System      │ ██░░░░░░░░ 20% (1/5)  │
└─────────────────────────────────────────────────────────┘
```

#### 🏂 Board View (Kanban)
Like Trello - drag and drop tasks between columns.

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   BLOCKED   │    READY    │ IN PROGRESS │   CLOSED    │
├─────────────┼─────────────┼─────────────┼─────────────┤
│             │             │             │             │
│ ┌─────────┐ │ ┌─────────┐ │ ┌─────────┐ │ ┌─────────┐ │
│ │ Logout  │ │ │ JWT     │ │ │ Login   │ │ │ OAuth   │ │
│ │ bd-g7h8 │ │ │ bd-e5f6 │ │ │ bd-c3d4 │ │ │ bd-a1b2 │ │
│ │ P2      │ │ │ P1      │ │ │ P1      │ │ │ P1      │ │
│ └─────────┘ │ └─────────┘ │ └─────────┘ │ └─────────┘ │
│             │             │             │             │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### Combined Workflow: CLI + UI

```
┌─────────────────────────────────────────────────────────┐
│                     HUMANS                               │
│                                                          │
│  Use Beads UI for:                                      │
│  • View overview (Board view)                           │
│  • Track progress (Epics view)                          │
│  • Quick inline edit                                    │
│                                                          │
└─────────────────────────────────────────────────────────┘
                          ↕ (sync via database)
┌─────────────────────────────────────────────────────────┐
│                     AI AGENT                             │
│                                                          │
│  Use CLI for:                                           │
│  • bd ready --json                                      │
│  • bd update --status                                   │
│  • bd close --reason                                    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Live sync:** When Agent updates via CLI → Beads UI auto-refreshes!

### Beads UI Commands

```bash
bdui start              # Start server (default port 3000)
bdui start --open       # Start and open browser
bdui start --port 8080  # Use different port
bdui stop               # Stop server
bdui --help             # See all options
```

### When to Use UI vs CLI?

| Situation | Use |
|-----------|-----|
| View project overview | 🖥️ **UI** - Board/Epics view |
| Create/edit many tasks quickly | 🖥️ **UI** - Inline edit |
| AI Agent working | ⌨️ **CLI** - `bd ready`, `bd update` |
| Scripting/Automation | ⌨️ **CLI** - `--json` output |
| Demo for team | 🖥️ **UI** - More visual |

---

## Development Guidelines

### Code Standards

- **Go version**: 1.24+
- **Linting**: `golangci-lint run ./...`
- **Testing**: All new features need tests (`go test -short ./...`)
- **Documentation**: Update relevant .md files

### Testing Workflow

**IMPORTANT:** Never pollute production database with test issues!

**For manual testing**, use `BEADS_DB` environment variable:

```bash
# Create test issues in isolated database
BEADS_DB=/tmp/test.db ./bd init --quiet --prefix test
BEADS_DB=/tmp/test.db ./bd create "Test issue" -p 1
```

**For automated tests**, use `t.TempDir()` in Go tests:

```go
func TestMyFeature(t *testing.T) {
    tmpDir := t.TempDir()
    testDB := filepath.Join(tmpDir, ".beads", "beads.db")
    s := newTestStore(t, testDB)
    // ... test code
}
```

### Before Committing

1. **Run tests**: `go test -short ./...`
2. **Run linter**: `golangci-lint run ./...`
3. **Update docs**: If behavior changed, update README.md or other docs
4. **Commit**: Issues auto-sync to `.beads/issues.jsonl`

### Git Workflow

**Auto-sync provides batching!** bd automatically:

- **Exports** to JSONL after CRUD operations (30-second debounce for batching)
- **Imports** from JSONL when it's newer than DB (e.g., after `git pull`)
- **Daemon commits/pushes** every 5 seconds (if `--auto-commit` / `--auto-push` enabled)

The 30-second debounce provides a **transaction window** for batch operations.

---

## Release Management

### Version Bump Script

**IMPORTANT**: When bumping version, use the script:

```bash
# Preview changes (shows diff, doesn't commit)
./scripts/bump-version.sh 0.9.3

# Auto-commit the version bump
./scripts/bump-version.sh 0.9.3 --commit
git push origin main
```

**What it does:**

- Updates ALL version files (CLI, plugin, MCP server, docs) in one command
- Validates semantic versioning format
- Shows diff preview
- Verifies all versions match after update
- Creates standardized commit message

**Files updated automatically:**

- `cmd/bd/version.go` - CLI version
- `claude-plugin/.claude-plugin/plugin.json` - Plugin version
- `.claude-plugin/marketplace.json` - Marketplace version
- `integrations/beads-mcp/pyproject.toml` - MCP server version
- `README.md` - Documentation version
- `PLUGIN.md` - Version requirements

### Release Process

**Automated (Recommended):**

```bash
# One command to do everything
./scripts/release.sh 0.9.3
```

This handles entire release workflow automatically.

**Manual (Step-by-Step):**

1. Bump version: `./scripts/bump-version.sh <version> --commit`
2. Update CHANGELOG.md with release notes
3. Run tests: `go test -short ./...`
4. Push version bump: `git push origin main`
5. Tag release: `git tag v<version> && git push origin v<version>`
6. Update Homebrew: `./scripts/update-homebrew.sh <version>`
7. Verify: `brew update && brew upgrade bd && bd version`

---

## Resources

- **GitHub (Beads)**: https://github.com/steveyegge/beads
- **GitHub (Beads UI)**: https://github.com/mantoni/beads-ui
- **FAQ**: https://github.com/steveyegge/beads/blob/main/docs/FAQ.md
- **QUICKSTART**: https://github.com/steveyegge/beads/blob/main/docs/QUICKSTART.md
- **ADVANCED**: https://github.com/steveyegge/beads/blob/main/docs/ADVANCED.md

---

*This guide is designed for comprehensive understanding of Beads.*
*Written based on official documentation from GitHub steveyegge/beads.*
