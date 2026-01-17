# Agent Instructions

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started.

## Engineering Principles

### Code Quality Philosophy

**AVOID OVER-ENGINEERING** - Keep solutions simple and pragmatic:
- Write code that is easy to read and understand first
- Don't add abstractions until you need them (YAGNI - You Aren't Gonna Need It)
- Prefer straightforward solutions over clever ones
- If unsure between simple and complex, choose simple

**NO PATCHES - FIX THE ROOT CAUSE**:
- NEVER apply band-aid fixes or workarounds
- If you find a bug, fix it properly at the source
- If a fix requires significant refactoring, do the refactoring
- Prefer comprehensive solutions over quick hacks
- Think: "What's the RIGHT way to solve this?" not "What's the FAST way?"

**READABILITY > CLEVERNESS**:
- Code is read 10x more than it's written - optimize for readers
- Use descriptive variable names (`userAuthToken` not `uat`)
- Break complex logic into well-named functions
- Add comments for "why", not "what" (code should be self-documenting)
- Prefer explicit over implicit

**MAINTAINABILITY FIRST**:
- Future developers (including you) will thank you
- Consistent patterns across the codebase
- Don't repeat yourself (DRY), but don't over-abstract
- Make changes easy, then make the easy change

### Decision Making

When facing a choice, ask:
1. **Is it readable?** Can someone understand this in 6 months?
2. **Is it simple?** Am I adding unnecessary complexity?
3. **Does it fix the root cause?** Or am I just patching symptoms?
4. **Is it maintainable?** Will this be easy to change later?

**If the answer is "no" to any of these, reconsider your approach.**

## Project Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 with shadcn/ui (base-mira style)
- **UI Library**: @base-ui/react components with class-variance-authority
- **Icons**: lucide-react
- **Package Manager**: bun

## Build, Lint, and Test Commands

```bash
# Development
bun dev                  # Start dev server at localhost:3000

# Production
bun build                # Build for production
bun start                # Start production server

# Dependencies
bun install              # Install dependencies
bun add <package>        # Add new package
bun remove <package>     # Remove package

# Code Quality
bun lint                 # Run ESLint on all files
bun lint --fix           # Auto-fix ESLint issues
bun lint path/to/file.tsx  # Lint specific file

# Type Checking
bunx tsc --noEmit        # Run TypeScript type checks without emitting files
```

**Note**: No test runner configured yet. When adding tests, prefer Vitest for unit tests and Playwright for E2E.

## Code Style Guidelines

### File Organization

```
app/                 # Next.js app router pages (Server Components by default)
  layout.tsx         # Root layout with metadata
  page.tsx           # Page components
  globals.css        # Global styles and Tailwind imports
components/          # Reusable components
  ui/                # shadcn/ui components (managed by CLI)
  *.tsx              # Feature components
lib/                 # Utility functions and shared logic
  utils.ts           # cn() helper for className merging
public/              # Static assets
```

### Import Conventions

```typescript
// 1. Type imports first (if using type-only imports)
import type { Metadata } from "next"

// 2. React and core libraries
import * as React from "react"

// 3. Third-party libraries (grouped)
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDownIcon } from "lucide-react"

// 4. Local imports using @ alias (defined in tsconfig.json)
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
```

### Component Patterns

**Server Components (default in App Router):**
```typescript
// No "use client" directive needed
export default function Page() {
  return <div>Server Component</div>
}
```

**Client Components:**
```typescript
"use client"  // MUST be first line (before imports)

import * as React from "react"

export function InteractiveComponent() {
  const [state, setState] = React.useState(false)
  return <button onClick={() => setState(!state)}>Toggle</button>
}
```

**Component Structure:**
```typescript
// 1. Props interface
interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: "default" | "outline"
  size?: "sm" | "md" | "lg"
}

// 2. Component definition (named exports for reusable UI, default for pages)
export function Button({ variant = "default", size = "md", className, ...props }: ButtonProps) {
  return <button className={cn(baseStyles, className)} {...props} />
}

// 3. Use descriptive prop names, provide defaults, spread remaining props
```

### TypeScript Conventions

- **Strict mode enabled** - No implicit any, strict null checks
- **Prefer type over interface** for props (consistency with cva patterns)
- **Use React.ComponentProps** for extending native elements:
  ```typescript
  React.ComponentProps<"button">  // Gets all button props
  React.ComponentProps<"div"> & { size?: "sm" | "lg" }
  ```
- **Explicit return types** for exported functions (optional for inline/simple functions)
- **Use const assertions** for readonly arrays:
  ```typescript
  const items = ["a", "b", "c"] as const
  ```

### Styling Conventions

- **Use Tailwind utility classes** - no custom CSS unless absolutely necessary
- **Use cn() helper** from `@/lib/utils` to merge class names:
  ```typescript
  className={cn("base-classes", conditionalClass && "conditional", className)}
  ```
- **Use cva** for component variants:
  ```typescript
  const buttonVariants = cva("base-styles", {
    variants: { variant: { default: "...", outline: "..." } },
    defaultVariants: { variant: "default" }
  })
  ```
- **data-slot attributes** - Use for component parts (e.g., `data-slot="button"`)
- **Dark mode** - Use Tailwind's `dark:` prefix (dark mode handled by `.dark` class on root)

### Naming Conventions

- **Components**: PascalCase (`Button`, `AlertDialog`, `CardHeader`)
- **Files**: kebab-case for utilities (`lib/utils.ts`), PascalCase for components (`Button.tsx`)
- **Props**: camelCase (`variant`, `className`, `isDisabled`)
- **Functions**: camelCase (`cn`, `formatDate`, `handleClick`)
- **Constants**: UPPER_SNAKE_CASE for true constants, camelCase for config objects
- **Types/Interfaces**: PascalCase with descriptive names (`ButtonProps`, `UserData`)

### Error Handling

- **Use Error boundaries** for React error handling (add when needed)
- **Validate props** with TypeScript types, not runtime checks (prefer type safety)
- **Handle async errors** explicitly:
  ```typescript
  try {
    const data = await fetchData()
  } catch (error) {
    console.error("Failed to fetch:", error)
    // Handle gracefully
  }
  ```
- **Server Components** - Can throw errors, will be caught by nearest error.tsx boundary

### Accessibility

- **Use semantic HTML** (`<button>`, `<nav>`, `<main>`, etc.)
- **Include aria labels** for icon-only buttons:
  ```typescript
  <Button variant="ghost" size="icon">
    <Icon />
    <span className="sr-only">Descriptive text</span>
  </Button>
  ```
- **Use Base UI primitives** - They handle accessibility (focus, keyboard nav, ARIA)

## Session Workflow

- **Start session**: See `.beads/SESSION_START.md` for checklist
- **End session**: See `.beads/SESSION_END.md` for mandatory steps
- **Workflow context**: Run `bd prime` for detailed instructions

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git
```

## Using Beads Viewer (bv)

`bv` is a **graph-aware analysis tool** for Beads issues. It provides:
- Deterministic graph metrics (PageRank, betweenness, critical path, cycles)
- Task prioritization and execution planning
- Dependency visualization and analytics

**⚠️ For AI agents: Use ONLY `--robot-*` flags. Bare `bv` launches interactive TUI.**

### Essential Commands

```bash
# Find next task (THE MEGA-COMMAND)
bv --robot-triage        # Complete triage with recommendations
bv --robot-next          # Just the top pick + claim command

# Analyze dependencies
bv --robot-plan          # Execution plan with parallel tracks
bv --robot-insights      # Graph metrics (PageRank, cycles, etc.)
```

### Common Patterns

```bash
# Get highest-impact task
bv --robot-triage | jq '.recommendations[0]'

# Check for circular dependencies
bv --robot-insights | jq '.Cycles'

# Priority recommendations
bv --robot-priority | jq '.recommendations[] | select(.confidence > 0.6)'
```

### Full Documentation

**For complete reference including all commands, jq recipes, and troubleshooting:**
→ See `.beads/BV_GUIDE.md`

**Quick tips:**
- Use `--robot-plan` for "what to work on next"
- Use `--robot-insights` for project health checks
- Results are cached by data hash (fast repeat calls)
- Phase 2 metrics (PageRank, etc.) have 500ms timeout—check `.status` field

### Commit Message Convention

**ALWAYS include issue ID in commit messages:**

```bash
git commit -m "Fix validation bug (dt-a1b2c3)"
git commit -m "Add retry logic (dt-xyz456)"
git commit -m "Update documentation (dt-abc789)"
```

This enables `bd doctor` to detect orphaned issues (committed code but unclosed issue).

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed):
   ```bash
   bun build            # Must succeed
   bun lint             # Must pass (or use --fix)
   bunx tsc --noEmit    # No type errors
   ```
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


<!-- bv-agent-instructions-v1 -->

---

## Beads Workflow Integration

This project uses [beads_viewer](https://github.com/Dicklesworthstone/beads_viewer) for issue tracking. Issues are stored in `.beads/` and tracked in git.

### Essential Commands

```bash
# View issues (launches TUI - avoid in automated sessions)
bv

# CLI commands for agents (use these instead)
bd ready              # Show issues ready to work (no blockers)
bd list --status=open # All open issues
bd show <id>          # Full issue details with dependencies
bd create --title="..." --type=task --priority=2
bd update <id> --status=in_progress
bd close <id> --reason="Completed"
bd close <id1> <id2>  # Close multiple issues at once
bd sync               # Commit and push changes
```

### Workflow Pattern

1. **Start**: Run `bd ready` to find actionable work
2. **Claim**: Use `bd update <id> --status=in_progress`
3. **Work**: Implement the task
4. **Complete**: Use `bd close <id>`
5. **Sync**: Always run `bd sync` at session end

### Key Concepts

- **Dependencies**: Issues can block other issues. `bd ready` shows only unblocked work.
- **Priority**: P0=critical, P1=high, P2=medium, P3=low, P4=backlog (use numbers, not words)
- **Types**: task, bug, feature, epic, question, docs
- **Blocking**: `bd dep add <issue> <depends-on>` to add dependencies

### Session Protocol

**Before ending any session, run this checklist:**

```bash
git status              # Check what changed
git add <files>         # Stage code changes
bd sync                 # Commit beads changes
git commit -m "..."     # Commit code
bd sync                 # Commit any new beads changes
git push                # Push to remote
```

### Best Practices

- Check `bd ready` at session start to find available work
- Update status as you work (in_progress → closed)
- Create new issues with `bd create` when you discover tasks
- Use descriptive titles and set appropriate priority/type
- Always `bd sync` before ending session

<!-- end-bv-agent-instructions -->
