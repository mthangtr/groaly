# Agent Instructions

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started.

## Engineering Principles

**Core Values:**
- **AVOID OVER-ENGINEERING**: Simple > clever. Don't add abstractions until needed (YAGNI)
- **FIX ROOT CAUSE**: No patches/workarounds. Fix properly at source, refactor if needed
- **READABILITY > CLEVERNESS**: Code read 10x more than written. Descriptive names, clear logic
- **MAINTAINABILITY FIRST**: Consistent patterns, DRY but don't over-abstract

**Decision checklist:** Is it readable? Simple? Fixes root cause? Maintainable?
If any "no" → reconsider approach.

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
// 1. Type imports → 2. React/core → 3. Third-party → 4. Local (@/ alias)
import type { Metadata } from "next"
import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
```

### Component Patterns

**Server Components (default):**
```typescript
export default function Page() {
  return <div>Server Component</div>
}
```

**Client Components:**
```typescript
"use client"  // MUST be first line

export function Interactive() {
  const [state, setState] = React.useState(false)
  return <button onClick={() => setState(!state)}>Toggle</button>
}
```

**Component Structure:**
```typescript
interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: "default" | "outline"
}

export function Button({ variant = "default", className, ...props }: ButtonProps) {
  return <button className={cn(baseStyles, className)} {...props} />
}
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
- **Handle async errors** explicitly with try/catch
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

## Beads Workflow (bd/bv)

This project uses **bd** for issue tracking and **bv** for graph analysis. Issues are in `.beads/` and tracked in git.

### Essential bd Commands

```bash
# Find and work on tasks
bd ready              # Show issues ready to work (no blockers)
bd show <id>          # Full issue details with dependencies
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git

# Create and manage
bd create "Task title" -t task -p 1  # Create task (P0-P4)
bd dep add <issue> <depends-on>      # Add dependency
```

### Beads Viewer (bv) - Graph Analysis

**⚠️ For AI: Use ONLY `--robot-*` flags. Bare `bv` launches TUI.**

```bash
# Find next task (MEGA-COMMAND)
bv --robot-triage        # Complete triage with recommendations
bv --robot-next          # Top pick + claim command

# Analysis
bv --robot-plan          # Execution plan with parallel tracks
bv --robot-insights      # Graph metrics (PageRank, cycles)
```

**Quick patterns:**
```bash
bv --robot-triage | jq '.recommendations[0]'  # Highest-impact task
bv --robot-insights | jq '.Cycles'             # Check circular deps
```

**Full docs:** `.beads/BV_GUIDE.md` and `.beads/BD_GUIDE.md`

### Workflow Pattern

1. **Start**: `bd ready` or `bv --robot-next` → find work
2. **Claim**: `bd update <id> --status in_progress`
3. **Work**: Implement the task
4. **Complete**: `bd close <id>`
5. **Sync**: `bd sync` at session end

### Key Concepts

- **Dependencies**: `bd ready` shows only unblocked work
- **Priority**: P0=critical, P1=high, P2=medium, P3=low, P4=backlog
- **Types**: task, bug, feature, epic, question, docs
- **Hooks**: `bd hooks install` for auto-sync (pre-commit, post-merge, etc.)

### Commit Convention

**ALWAYS include issue ID:**
```bash
git commit -m "Fix validation bug (dt-a1b2c3)"
```
This enables `bd doctor` to detect orphaned issues.

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
