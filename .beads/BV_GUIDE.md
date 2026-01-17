# Beads Viewer (bv) - AI Agent Guide

## Overview

`bv` is a graph-aware TUI for visualizing and analyzing Beads issues. Instead of parsing `.beads/issues.jsonl` manually or hallucinating graph traversal, use `bv` robot commands for deterministic, dependency-aware outputs with precomputed metrics (PageRank, betweenness, critical path, cycles).

**⚠️ CRITICAL: Use ONLY `--robot-*` flags when scripting. Bare `bv` launches an interactive TUI that blocks your session.**

---

## Quick Start

```bash
# Interactive mode (human use)
bv                    # Launch TUI
bv --recipe ready-to-work  # Apply recipe filter

# Robot mode (AI agents / scripting)
bv --robot-triage     # THE MEGA-COMMAND: start here
bv --robot-next       # Minimal: just the top pick + claim command
bv --robot-insights   # Full graph metrics
bv --robot-plan       # Parallel execution tracks
```

---

## The Workflow: Start With Triage

**`bv --robot-triage` is your single entry point.** It returns everything you need in one call:
- `quick_ref`: at-a-glance counts + top 3 picks
- `recommendations`: ranked actionable items with scores, reasons, unblock info
- `quick_wins`: low-effort high-impact items
- `blockers_to_clear`: items that unblock the most downstream work
- `project_health`: status/type/priority distributions, graph metrics
- `commands`: copy-paste shell commands for next steps

```bash
bv --robot-triage        # THE MEGA-COMMAND: start here
bv --robot-next          # Minimal: just the single top pick + claim command
```

---

## Robot Commands Reference

### Planning
| Command | Returns |
|---------|---------|
| `--robot-plan` | Parallel execution tracks with `unblocks` lists |
| `--robot-priority` | Priority misalignment detection with confidence |

### Graph Analysis
| Command | Returns |
|---------|---------|
| `--robot-insights` | Full metrics: PageRank, betweenness, HITS, eigenvector, critical path, cycles |
| `--robot-graph [--graph-format=json\|dot\|mermaid]` | Dependency graph export |

### Change Tracking
| Command | Returns |
|---------|---------|
| `--robot-diff --diff-since <ref>` | Changes since ref: new/closed/modified issues, cycles introduced/resolved |

### Other
| Command | Returns |
|---------|---------|
| `--robot-suggest` | Hygiene: duplicates, missing deps, label suggestions, cycle breaks |
| `--robot-alerts` | Stale issues, blocking cascades, priority mismatches |
| `--robot-forecast <id\|all>` | ETA predictions with dependency-aware scheduling |

---

## Understanding Robot Output

**All robot JSON includes:**
- `data_hash` — Fingerprint of source issues.jsonl (verify consistency across calls)
- `status` — Per-metric state: `computed|approx|timeout|skipped` + elapsed ms
- `as_of` / `as_of_commit` — Present when using `--as-of`; contains ref and resolved SHA

**Two-phase analysis:**
- **Phase 1 (instant):** degree, topo sort, density — always available immediately
- **Phase 2 (async, 500ms timeout):** PageRank, betweenness, HITS, eigenvector, cycles — check `status` flags

**For large graphs (>500 nodes):** Some metrics may be approximated or skipped. Always check `status`.

---

## jq Quick Reference

```bash
bv --robot-triage | jq '.quick_ref'                        # At-a-glance summary
bv --robot-triage | jq '.recommendations[0]'               # Top recommendation
bv --robot-plan | jq '.plan.summary.highest_impact'        # Best unblock target
bv --robot-insights | jq '.status'                         # Check metric readiness
bv --robot-insights | jq '.Cycles'                         # Circular deps (must fix!)
```

---

## Example: AI Agent Workflow

```bash
#!/bin/bash
# agent-workflow.sh - Autonomous task selection

# 1. Get triage recommendations
TRIAGE=$(bv --robot-triage)

# 2. Extract highest-impact task
TASK=$(echo "$TRIAGE" | jq -r '.recommendations[0].id')
REASON=$(echo "$TRIAGE" | jq -r '.recommendations[0].reason')

# 3. Check if it unblocks other work
UNBLOCKS=$(echo "$TRIAGE" | jq -r '.recommendations[0].unblocks | length')

echo "Working on: $TASK"
echo "Reason: $REASON"
echo "Unblocks: $UNBLOCKS tasks"

# 4. Claim the task
bd update "$TASK" --status in_progress
```

---

## Interactive TUI Shortcuts

When using `bv` interactively (human mode):

| Key | Action |
|-----|--------|
| `?` | Show help |
| `` ` `` | Interactive tutorial |
| `j/k` | Navigate up/down |
| `b` | Kanban board view |
| `g` | Graph visualization |
| `i` | Insights dashboard |
| `E` | Tree view (parent-child hierarchy) |
| `/` | Search |
| `o` | Filter: Open only |
| `r` | Filter: Ready (no blockers) |
| `'` | Recipe picker |
| `q` | Quit |

---

## Recipes

Pre-configured view filters stored in `.bv/recipes.yaml`:

```bash
bv --recipe ready-to-work      # Tasks ready to start
bv --recipe high-priority      # P0/P1 critical items
bv --recipe blocked-analysis   # Blocked items with dependencies
bv --recipe recent-activity    # Updated in last 7 days
bv --recipe sprint-planning    # High-impact actionable items
```

---

## Performance Notes

- Phase 1 instant, Phase 2 async (500ms timeout)
- Prefer `--robot-plan` over `--robot-insights` when speed matters
- Results cached by data hash (repeat calls are fast)

Use `bv` instead of parsing issues.jsonl—it computes PageRank, critical paths, cycles, and parallel tracks deterministically.

---

## Configuration

Config files in `.bv/`:
- **`config.yaml`** - UI preferences, analysis settings, experimental features
- **`recipes.yaml`** - Custom view filters
- **`README.md`** - Detailed documentation for humans

---

## Common Patterns

### Find next task to work on
```bash
bv --robot-next
```

### Check project health
```bash
bv --robot-insights | jq '{
  issues: .Stats.NodeCount,
  dependencies: .Stats.EdgeCount,
  cycles: (.Cycles // [] | length),
  density: .ClusterDensity
}'
```

### Detect circular dependencies
```bash
bv --robot-insights | jq '.Cycles'
```

### Get execution plan with unblock counts
```bash
bv --robot-plan | jq '.plan.tracks[].items[] | {
  id: .id,
  unblocks: (.unblocks // [] | length)
}'
```

### Check priority misalignments
```bash
bv --robot-priority | jq '.recommendations[] | select(.confidence > 0.6)'
```

### Export dependency graph
```bash
bv --robot-graph --graph-format=mermaid > graph.md
```

---

## Troubleshooting

### Slow on large projects
```bash
BV_SKIP_PHASE2=1 bv --robot-plan  # Skip expensive metrics
```

### Live reload not working
```bash
BV_FORCE_POLLING=1 bv  # Force polling mode
```

### Check what metrics are available
```bash
bv --robot-insights | jq '.status'
```

---

## Full Documentation

For comprehensive documentation including architecture, algorithms, and advanced features:
https://github.com/Dicklesworthstone/beads_viewer
