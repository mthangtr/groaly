# Agent Instructions

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