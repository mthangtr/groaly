# Agent Instructions

## Engineering Principles

**Core Values:**
- **AVOID OVER-ENGINEERING**: Simple > clever. Don't add abstractions until needed (YAGNI)
- **FIX ROOT CAUSE**: No patches/workarounds. Fix properly at source, refactor if needed
- **READABILITY > CLEVERNESS**: Code read 10x more than written. Descriptive names, clear logic
- **MAINTAINABILITY FIRST**: Consistent patterns, DRY but don't over-abstract

**Decision checklist:** Is it readable? Simple? Fixes root cause? Maintainable?
If any "no" → reconsider approach.

## Issue Tracking

This project uses **bd (beads)** for issue tracking.
Run `bd prime` for workflow context, or install hooks (`bd hooks install`) for auto-injection.

**Quick reference:**
- `bd ready` - Find unblocked work
- `bd create "Title" --type task --priority 2` - Create issue
- `bd close <id>` - Complete work
- `bd sync` - Sync with git (run at session end)

For full workflow details: `bd prime`

## Code Navigation & Analysis

This project uses **GKG (Global Knowledge Graph)** for intelligent code navigation and analysis.
The GKG server must be running (`gkg server start`) to use these tools.

### When to Use GKG

**ALWAYS use GKG tools when:**
- Understanding unfamiliar code or exploring the codebase
- Finding where a function/class is defined
- Analyzing dependencies and imports
- Finding all usages/references of a symbol
- Planning refactoring or impact analysis
- Understanding code structure before making changes

**Prefer GKG over manual file search when:**
- You need to find definitions across multiple files
- You want to see all callers of a function
- You need to understand module relationships
- You're analyzing import patterns

### Available GKG Tools

1. **`mcp_gkg_list_projects`** - List indexed projects (use first to verify project is indexed)
2. **`mcp_gkg_search_codebase_definitions`** - Find functions, classes, methods by name
3. **`mcp_gkg_get_definition`** - Go to definition for a symbol on a specific line
4. **`mcp_gkg_get_references`** - Find all usages of a definition (impact analysis)
5. **`mcp_gkg_read_definitions`** - Read complete code bodies of multiple definitions
6. **`mcp_gkg_repo_map`** - Generate API-style map of repository structure
7. **`mcp_gkg_import_usage`** - Analyze import patterns and dependencies
8. **`mcp_gkg_index_project`** - Re-index after major changes

### Best Practices

**Workflow Integration:**
```
1. Start → Use `list_projects` to verify project is indexed
2. Explore → Use `search_codebase_definitions` to find relevant code
3. Understand → Use `read_definitions` to see implementation
4. Analyze → Use `get_references` to see usage patterns
5. Plan → Use impact analysis before refactoring
```

**Example Usage:**
```typescript
// Before modifying a component, find all its usages:
// 1. Search for the component definition
// 2. Get all references to understand impact
// 3. Read related definitions for context
// 4. Make informed changes
```

**Performance Tips:**
- Use `repo_map` with depth=1-2 for large repos
- Group multiple definitions in single `read_definitions` call
- Use pagination for large result sets
- Re-index only after substantial file changes

**When NOT to Use:**
- Simple file viewing (use `view_file` instead)
- Reading single files (use `view_file_outline` first)
- Searching for text patterns (use `grep_search`)

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
