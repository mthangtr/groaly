# Agent Instructions

## Engineering Principles

- **Simple > Clever**: Avoid over-engineering. No abstractions until needed (YAGNI)
- **Fix Root Cause**: No patches/workarounds. Refactor if needed
- **Readability First**: Descriptive names, clear logic. Code is read 10x more than written
- **Maintainability**: Consistent patterns, DRY but don't over-abstract

## Issue Tracking

This project uses **bd (beads)** for issue tracking.
Run `bd prime` for workflow context, or install hooks (`bd hooks install`) for auto-injection.

**Quick reference:**
- `bd ready` - Find unblocked work
- `bd create "Title" --type task --priority 2` - Create issue
- `bd close <id>` - Complete work
- `bd sync` - Sync with git (run at session end)

## Project Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 with shadcn/ui (base-mira style)
- **UI Library**: @base-ui/react with class-variance-authority
- **Backend**: Supabase (auth, database, realtime)
- **Validation**: Zod
- **Icons**: lucide-react
- **Package Manager**: bun

## Build, Lint, and Test Commands

```bash
# Development
bun dev                    # Start dev server at localhost:3000

# Production
bun build                  # Build for production
bun start                  # Start production server

# Code Quality
bun lint                   # Run ESLint on all files
bun lint --fix             # Auto-fix ESLint issues
bun lint path/to/file.tsx  # Lint specific file

# Type Checking
bunx tsc --noEmit          # Type check without emitting

# Dependencies
bun install                # Install dependencies
bun add <package>          # Add new package
```

**Testing**: No test runner configured. When adding tests, use Vitest for unit tests:
```bash
bunx vitest run                    # Run all tests
bunx vitest run path/to/file.test  # Run single test file
bunx vitest --watch                # Watch mode
```

## File Organization

```
app/                 # Next.js app router (Server Components by default)
  api/               # API routes (route.ts files)
  layout.tsx         # Root layout
  page.tsx           # Page components
components/
  ui/                # shadcn/ui components (managed by CLI)
  *.tsx              # Feature components
lib/
  supabase/          # Supabase client utilities
  ai/                # AI/LLM utilities
  utils.ts           # cn() helper for className merging
hooks/               # Custom React hooks
types/               # TypeScript type definitions
stores/              # State management
```

## Code Style Guidelines

### Import Order
```typescript
// 1. Type imports -> 2. React/Next -> 3. Third-party -> 4. Local (@/ alias)
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

**Component Props:**
```typescript
type ButtonProps = React.ComponentProps<"button"> & {
  variant?: "default" | "outline"
}

export function Button({ variant = "default", className, ...props }: ButtonProps) {
  return <button className={cn(baseStyles, className)} {...props} />
}
```

### TypeScript Conventions

- **Strict mode** - No implicit any, strict null checks
- **Prefer `type` over `interface`** for props (consistency with cva)
- **Use `React.ComponentProps<"element">`** for extending native elements
- **Use const assertions** for readonly arrays: `["a", "b"] as const`
- **Explicit return types** for exported API functions

### Styling

- **Use Tailwind utility classes** - no custom CSS unless necessary
- **Use `cn()` helper** to merge class names:
  ```typescript
  className={cn("base-classes", condition && "conditional", className)}
  ```
- **Use `cva`** for component variants
- **Use `data-slot` attributes** for component parts
- **Dark mode**: Use `dark:` prefix (handled by `.dark` class on root)

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `Button`, `CardHeader` |
| Files (components) | kebab-case | `button.tsx`, `card-header.tsx` |
| Files (utils) | kebab-case | `utils.ts`, `ensure-user.ts` |
| Props/Variables | camelCase | `variant`, `isDisabled` |
| Types | PascalCase | `ButtonProps`, `TaskStatus` |
| Constants | UPPER_SNAKE_CASE | `TASK_STATUSES` |

### Error Handling

- **API Routes**: Return typed error responses with appropriate status codes
- **Server Components**: Throw errors, caught by nearest `error.tsx` boundary
- **Client Components**: Use Error boundaries when needed
- **Async operations**: Explicit try/catch with `console.error` for logging

### API Route Pattern
```typescript
export async function GET(request: NextRequest): Promise<NextResponse<DataResponse | ErrorResponse>> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    // ... logic
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
```

## Supabase Patterns

- **Server**: Use `createClient()` from `@/lib/supabase/server`
- **Client**: Use `createClient()` from `@/lib/supabase/client`
- **Always check auth**: `await supabase.auth.getUser()` before database operations
- **Use `ensureUserExists()`** before creating records with user_id foreign keys

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