# Discovery Report: dumtasking MVP Implementation

**Date:** 2026-01-18  
**Feature:** Full MVP implementation from planning artifacts  
**Status:** Discovery Complete

## Architecture Snapshot

### Current Project Structure

```
dumtasking/
├── app/                          # Next.js 16 App Router
│   ├── layout.tsx                # Root layout (Inter font, metadata)
│   ├── page.tsx                  # Currently shows ComponentExample
│   └── globals.css               # Tailwind imports
├── components/
│   ├── ui/                       # shadcn/ui components (14+ installed)
│   │   ├── alert-dialog.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── combobox.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── field.tsx
│   │   ├── input-group.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   └── textarea.tsx
│   ├── component-example.tsx     # Demo file showing component usage
│   └── example.tsx               # Example wrapper component
├── lib/
│   └── utils.ts                  # cn() utility for className merging
├── _bmad/                        # BMAD framework artifacts (not for production)
├── _bmad-output/
│   └── planning-artifacts/       # ✅ Complete planning documents
│       ├── product-brief-dumtasking-2026-01-17.md
│       ├── prd.md                # 2303 lines - Complete PRD
│       ├── architecture.md       # 2463 lines - Complete architecture
│       └── ux-design-specification.md  # 1897 lines - Complete UX spec
├── docs/
│   ├── brainstorm.md             # Original requirements
│   └── workflow-setup/           # Beads workflow guides
└── history/mvp/                  # This discovery report location

```

### Key Existing Patterns

**✅ Already Established:**

1. **shadcn/ui Setup**
   - Preset: mira style, zinc theme, lucide icons, Inter font
   - 14+ components already installed (button, card, input, select, etc.)
   - Pattern: Use `cn()` for className merging
   - Pattern: `data-slot` attributes for component parts
   - Pattern: `React.ComponentProps<"element">` for extending native elements

2. **TypeScript Configuration**
   - Strict mode enabled
   - ES2017 target
   - Path alias: `@/*` maps to project root
   - jsx: react-jsx (React 19 automatic runtime)

3. **Component Structure Examples**
   - See `components/component-example.tsx` for full usage patterns
   - Client components use `"use client"` directive
   - Server components are default (no directive needed)
   - Forms use Field/FieldGroup/FieldLabel composition

4. **Styling Approach**
   - Tailwind CSS 4 (PostCSS-based)
   - Custom CSS variables in globals.css
   - Utility-first with cva for variants
   - Dark mode via `.dark` class

### Relevant Packages & Dependencies

**Current Stack (from package.json):**
```json
{
  "dependencies": {
    "@base-ui/react": "^1.1.0",           // Base UI primitives
    "class-variance-authority": "^0.7.1",  // cva for variants
    "clsx": "^2.1.1",                      // Conditional classes
    "lucide-react": "^0.562.0",            // Icon library
    "next": "16.1.3",                      // Next.js framework
    "react": "19.2.3",                     // React 19
    "react-dom": "19.2.3",
    "tailwind-merge": "^3.4.0",            // className merging
    "tw-animate-css": "^1.4.0"             // Animations
  }
}
```

**Missing Dependencies (Required by PRD/Architecture):**
- `@supabase/supabase-js` - Database & auth client
- `@supabase/ssr` - SSR helpers for Next.js
- `ai` (Vercel AI SDK) - AI streaming & tool calling
- `@tiptap/react` + extensions - Rich text editor for notes
- `@dnd-kit/core` + sortable - Drag-and-drop for Kanban
- `@tanstack/react-table` - Table view component
- `date-fns` or `dayjs` - Date manipulation
- `sonner` - Toast notifications
- `zustand` - Client state management
- `zod` - Schema validation

### Entry Points

**Current:** `app/page.tsx` → renders `<ComponentExample />`

**Target (from PRD/Architecture):**
- `/` → Dashboard (authenticated landing page)
- `/(auth)/login` → Magic link login
- `/(dashboard)/notes` → Notes list/editor
- `/(dashboard)/kanban` → Kanban board view
- `/(dashboard)/calendar` → Calendar view
- `/(dashboard)/table` → Table/database view
- `/(dashboard)/focus/[taskId]` → Focus Mode
- `/api/auth/callback` → Supabase auth callback
- `/api/ai/extract-tasks` → AI task extraction
- `/api/ai/chat` → Streaming chat
- `/api/tasks/*` → Task CRUD
- `/api/notes/*` → Note CRUD

## Existing Patterns & Reusable Code

### Pattern 1: Client Component with State

**Reference:** `components/component-example.tsx` FormExample
```tsx
"use client"  // MUST be first line

function FormExample() {
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    push: true,
  })
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
        <CardDescription>Description</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="id">Label</FieldLabel>
              <Input id="id" placeholder="..." required />
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
```

**Reusable for:** Note editor, task forms, settings panels

### Pattern 2: Dropdown Menu Actions

**Reference:** `components/component-example.tsx` CardAction
```tsx
<CardAction>
  <DropdownMenu>
    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
      <MoreVerticalIcon />
      <span className="sr-only">More options</span>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem>
        <FileIcon />
        New File
        <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</CardAction>
```

**Reusable for:** Task card actions, note actions, calendar event menus

### Pattern 3: Select/Combobox Forms

**Reference:** `components/component-example.tsx` framework selection
```tsx
<Combobox items={frameworks}>
  <ComboboxInput
    id="framework"
    placeholder="Select a framework"
    required
  />
  <ComboboxContent>
    <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
    <ComboboxList>
      {(item) => (
        <ComboboxItem key={item} value={item}>
          {item}
        </ComboboxItem>
      )}
    </ComboboxList>
  </ComboboxContent>
</Combobox>
```

**Reusable for:** Goal selection, priority dropdowns, tag selection

### Pattern 4: Layout with Font Variables

**Reference:** `app/layout.tsx`
```tsx
const inter = Inter({subsets:['latin'],variable:'--font-sans'})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

**Note:** Root layout needs Auth provider, theme provider additions

### Naming Conventions (from AGENTS.md)

- **Components:** PascalCase (`TaskCard`, `NoteEditor`)
- **Files:** PascalCase for components (`TaskCard.tsx`), kebab-case for utilities
- **Props:** camelCase (`taskId`, `isCompleted`)
- **Functions:** camelCase (`handleTaskUpdate`, `fetchNotes`)
- **Types:** PascalCase (`TaskProps`, `NoteData`)

## Technical Constraints

### Node.js & Runtime

- **Target:** ES2017 (from tsconfig)
- **Node Version:** Assumed v20+ (Next.js 16 requirement)
- **Package Manager:** bun (per AGENTS.md)

### Build Requirements

- **Framework:** Next.js 16.1.3 App Router
- **TypeScript:** Strict mode enabled
- **Tailwind CSS:** v4 (PostCSS-based, not v3)
- **React:** v19 (automatic jsx runtime)

### API Constraints (from PRD/Architecture)

**Performance Targets:**
- Page load: <2s First Contentful Paint
- AI task extraction: <5s for typical note
- AI chat response: <2s first token (streaming)
- Realtime sync: <1s latency

**AI Cost Constraints:**
- Budget: $50/month maximum
- Strategy: Claude Haiku for extraction, Gemini Flash for chat
- Fallback: If primary model fails, switch to backup

**Database Constraints (Supabase):**
- Free tier: 500MB database
- Row Level Security (RLS) required for all tables
- Realtime: Max 100 concurrent connections

### Security Requirements

- **Auth:** Supabase Auth with magic links (no passwords)
- **API Keys:** Server-side only (API routes, not client)
- **RLS:** All database tables must have RLS policies
- **CORS:** Restrict to deployed domains

### Browser Compatibility

- **Primary:** Chrome, Edge, Firefox (latest 2 versions)
- **Progressive Web App:** Service Worker for offline mode
- **Desktop-First:** Optimized for desktop, mobile-responsive secondary

## External References

### Library Documentation

**Must Review Before Implementation:**

1. **Supabase**
   - [Next.js Integration Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
   - [Realtime Subscriptions](https://supabase.com/docs/guides/realtime)
   - [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

2. **Vercel AI SDK**
   - [Streaming Responses](https://sdk.vercel.ai/docs/guides/streaming)
   - [Tool Calling](https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling)
   - [Structured Output](https://sdk.vercel.ai/docs/ai-sdk-core/structured-outputs)

3. **Tiptap Editor**
   - [React Installation](https://tiptap.dev/docs/editor/getting-started/install/react)
   - [Markdown Extension](https://tiptap.dev/docs/editor/extensions/functionality/markdown)

4. **dnd-kit (Drag and Drop)**
   - [Sortable Preset](https://docs.dndkit.com/presets/sortable)
   - [Next.js Integration](https://docs.dndkit.com/introduction/getting-started#nextjs)

### Similar Projects (for patterns)

- **Linear** - Kanban + keyboard shortcuts patterns
- **Notion** - Rich text editor patterns
- **Motion** - AI task scheduling patterns
- **TickTick** - Calendar integration patterns

### shadcn/ui Patterns

- **Official Examples:** https://ui.shadcn.com/examples
- **Form Patterns:** https://ui.shadcn.com/examples/forms
- **Dashboard Layout:** https://ui.shadcn.com/examples/dashboard

## Gap Analysis Summary

### What We Have ✅

1. ✅ Next.js 16 project initialized with App Router
2. ✅ shadcn/ui design system configured (mira/zinc)
3. ✅ 14+ base UI components installed
4. ✅ TypeScript strict mode configured
5. ✅ Tailwind CSS 4 configured
6. ✅ Component patterns documented (example.tsx)
7. ✅ Complete planning artifacts (PRD, Architecture, UX Spec)

### What We Need 🔨

1. **Database Layer**
   - ❌ Supabase client setup
   - ❌ Database schema (SQL migrations)
   - ❌ RLS policies
   - ❌ Realtime subscriptions setup

2. **Authentication**
   - ❌ Supabase Auth setup
   - ❌ SSR authentication helpers
   - ❌ Login/callback pages
   - ❌ Auth middleware

3. **AI Integration**
   - ❌ Vercel AI SDK installation
   - ❌ OpenRouter API setup
   - ❌ Task extraction API route
   - ❌ Chat API route (streaming)
   - ❌ Structured output schemas (Zod)

4. **Core Features**
   - ❌ Note editor (Tiptap)
   - ❌ Kanban board (dnd-kit)
   - ❌ Calendar view
   - ❌ Table view (TanStack Table)
   - ❌ Focus Mode
   - ❌ AI Chat Widget

5. **State Management**
   - ❌ Zustand stores (tasks, notes, goals)
   - ❌ Optimistic UI patterns
   - ❌ Realtime sync engine

6. **Additional Dependencies**
   - ❌ Install ~15 missing npm packages
   - ❌ Configure environment variables
   - ❌ Set up ESLint/Prettier rules

## Risk Assessment Preview

**Expected HIGH Risk Items** (will verify in Synthesis phase):
- Supabase Realtime integration (new external dep)
- AI streaming with tool calling (complex API interaction)
- Tiptap rich text editor setup (external lib + complex state)
- dnd-kit Kanban with Realtime sync (state management complexity)

**Expected LOW Risk Items:**
- shadcn/ui component additions (pattern exists)
- API route structure (standard Next.js pattern)
- Database schema (straightforward SQL)

## Next Steps

1. → **Phase 2: Synthesis** - Feed this report to Oracle for gap analysis
2. → **Risk Classification** - Determine which components need spikes
3. → **Phase 3: Verification** - Create spikes for HIGH risk items
4. → **Phase 4: Decomposition** - Break into beads with dependencies
