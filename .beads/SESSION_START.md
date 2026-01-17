# Session Start Checklist

Run this checklist at the beginning of every coding session.

## 1. Sync with Remote

```bash
# Pull latest changes
git pull --rebase

# Import any remote issue updates
bd sync --import-only
```

## 2. Review Available Work

```bash
# See all issues ready to work (no blockers)
bd ready

# Check current session context
bd prime

# View project statistics
bd stats
```

## 3. Choose and Claim Work

```bash
# View issue details
bd show <issue-id>

# Claim the issue (mark as in progress)
bd update <issue-id> --status in_progress

# Optional: Assign to yourself
bd update <issue-id> --assignee <your-name>
```

## 4. Set Context

```bash
# Review dependencies
bd show <issue-id>  # See "Blocks" and "Blocked by" sections

# Check related work
bd list --status=in_progress  # See what else is active
```

## Quick Commands Reference

```bash
bd ready                           # Find available work
bd show <id>                       # View issue details
bd update <id> --status <status>   # Update status
bd list --status=in_progress       # See active work
bd sync                            # Sync with git
```

---

**Ready to start? Mark your issue as in_progress and begin coding!**
