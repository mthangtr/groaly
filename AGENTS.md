# Agent Instructions

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started.

## Session Workflow

- **Start session**: See `.beads/SESSION_START.md` for checklist
- **End session**: See `.beads/SESSION_END.md` for mandatory steps
- **Workflow context**: Run `bd prime` for detailed instructions

## Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git
```

## Commit Message Convention

**ALWAYS include issue ID in commit messages:**

```bash
git commit -m "Fix validation bug (dt-a1b2c3)"
git commit -m "Add retry logic (dt-xyz456)"
git commit -m "Update documentation (dt-abc789)"
```

This enables `bd doctor` to detect orphaned issues (committed code but unclosed issue).

## Dependencies & Parallel Work

```bash
# Create parent task
bd create --title="Feature: User auth" --type=feature --priority=1

# Create dependent tasks
bd create --title="Auth API" --type=task --priority=2
bd create --title="Auth UI" --type=task --priority=2

# Set dependencies (child depends on parent)
bd dep add dt-ui dt-api    # UI depends on API
bd dep add dt-api dt-auth  # API depends on Feature

# Check what's ready (automatically filters blocked tasks)
bd ready

# View dependencies
bd show dt-ui  # Shows "Blocked by: dt-api"
```

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds

