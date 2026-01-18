# Session End Checklist (MANDATORY)

⚠️ **CRITICAL:** Work is NOT complete until `git push` succeeds. Follow ALL steps below.

## 1. File Remaining Work

Create issues for anything that needs follow-up:

```bash
# Create follow-up tasks
bd create --title="Task title" --description="Details" --type=task --priority=2

# Create bugs found during development
bd create --title="Bug: description" --description="Details" --type=bug --priority=1

# Add dependencies if needed
bd dep add <child-issue> <parent-issue>  # child depends on parent
```

## 2. Run Quality Gates (if code changed)

```bash
# Run tests
npm test
# or
go test ./...
# or
pytest

# Run linters
npm run lint
# or
golangci-lint run ./...

# Run build
npm run build
# or
go build ./...
```

**If quality gates fail:** File P0 issues for blockers.

## 3. Update Issue Status

```bash
# Close completed issues (can close multiple at once)
bd close <id1> <id2> <id3> --reason="Completed and tested"

# Update in-progress issues with notes
bd update <id> --notes="Progress: implemented X, next: Y"

# Update blocked issues
bd update <id> --status=blocked --notes="Blocked by: reason"
```

## 4. PUSH TO REMOTE (MANDATORY) 🚨

**This step is NON-NEGOTIABLE. Execute ALL commands:**

```bash
# Step 1: Pull remote changes
git pull --rebase

# Step 2: If conflicts in .beads/issues.jsonl, resolve:
#   Option A (accept remote): git checkout --theirs .beads/issues.jsonl && bd sync --import-only
#   Option B (manual merge): resolve conflicts, then bd sync --import-only

# Step 3: Sync beads database (exports to JSONL, commits)
bd sync

# Step 4: MANDATORY - Push everything
git push

# Step 5: VERIFY push succeeded
git status  # MUST show "Your branch is up to date with 'origin/main'"
```

### ⛔ CRITICAL RULES

- ❌ Work is NOT complete until `git push` succeeds
- ❌ NEVER stop before pushing - that leaves work stranded locally
- ❌ NEVER say "ready to push when you are" - YOU must push
- ✅ If `git push` fails, resolve and retry until it succeeds

## 5. Clean Up Git State

```bash
# Clear old stashes
git stash clear

# Prune deleted remote branches
git remote prune origin
```

## 6. Verify Clean State

```bash
# Check git status
git status  # Should show "nothing to commit, working tree clean"

# Check beads health
bd doctor

# Verify all issues synced
bd list --status=in_progress
```

## 7. Hand Off to Next Session

```bash
# Choose next work
bd ready

# View recommended next issue
bd show <next-issue-id>
```

### Provide User Context

Give the user a summary for next session:

**Template:**
```
## Session Summary

### Completed:
- [✓] Issue dt-xyz: <title>
- [✓] Issue dt-abc: <title>

### Created for Follow-up:
- [ ] Issue dt-123: <title> (P2, task)
- [ ] Issue dt-456: <title> (P1, bug)

### Quality Gates:
- [✓] Tests passing
- [✓] Linters clean
- [✓] Build successful

### Git Status:
- [✓] All changes committed
- [✓] All changes pushed to origin/main
- [✓] Working tree clean

### Recommended Next Work:
Issue dt-789: <title>
Context: <brief description of what needs to be done>

**Prompt for next session:**
"Continue work on dt-789: <title>. <Brief context about current state and next steps>."
```

---

## ✅ Session Complete

**Plane has landed successfully when:**
- ✓ All remaining work filed as issues
- ✓ Quality gates passed (or P0 issues filed)
- ✓ Issues updated/closed
- ✓ `git push` succeeded
- ✓ Working tree clean
- ✓ Handoff context provided

**🎉 You can now safely end the session.**
