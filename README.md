# Groaly

**Groaly** (Goal + Reality) is an AI-powered personal productivity companion that transforms chaotic notes into balanced, actionable task orchestration. Rather than forcing users into rigid task management systems, Groaly meets you where you are—in your notes—and intelligently organizes the rest.

*Dump your notes, AI handles the rest.*

## The Problem

Knowledge workers juggling multiple life goals—a startup, learning new skills, personal projects, health routines—face a common set of frustrations:

**Goal Neglect.** When you focus intensely on one goal, others quietly disappear for weeks or months. That language learning app gathers dust. The side project stalls. You only remember when guilt strikes.

**Planning Friction.** Setting up and maintaining task systems is tedious. The overhead kills the habit before it forms. You spend more time organizing than doing.

**No Orchestration.** Existing tools don't auto-balance multiple goals. You're left manually shuffling priorities, often poorly, often reactively.

**Guilt Loops.** Evening motivation drops. Tasks pile up. Traditional productivity tools amplify guilt rather than offering compassion, leading to tool abandonment.

**Context Fragmentation.** Notes in one app, tasks in another, calendar in a third. Context is lost. The original "why" behind a task vanishes.

## The Solution

Groaly introduces **Vibe Tasking**—the productivity equivalent of vibe coding. Just as AI handles the heavy lifting of implementation in code, Groaly handles the heavy lifting of planning, scheduling, and organizing. You focus on thinking, doing, and growing.

### How It Works

1. **Write freely.** Capture thoughts, ideas, meeting notes, or random brain dumps in the rich text editor. No structure required.

2. **Let AI extract.** Click "Plan this" and Groaly's AI identifies actionable tasks, assigns priorities, estimates effort, suggests deadlines, and connects tasks to your goals.

3. **Execute with focus.** Work through tasks in the Kanban board, calendar, or table view. When you need deep work, enter Focus Mode with a Pomodoro timer, ambient sounds, and distraction-free fullscreen.

4. **Converse naturally.** The AI chat assistant understands context. Ask it to reschedule your week, find blockers, suggest what to work on next, or generate productivity insights.

5. **Review and adapt.** Weekly AI-generated reviews surface patterns, celebrate wins, and gently highlight areas for improvement—without judgment.

## Core Features

### Intelligent Task Extraction
The AI reads your notes and extracts tasks with context preserved. It understands priority, estimates effort, suggests scheduling, and links tasks back to their source. No manual copying or reformatting.

### Multi-Goal Orchestration
Groaly automatically balances work across your different life goals. The AI ensures your startup gets attention, but so does your health, your learning, and your relationships. Nothing falls through the cracks.

### Multiple Views for Different Mindsets
- **Kanban Board** for visual thinkers who like dragging cards across columns
- **Calendar View** for time-blockers who think in schedules
- **Table View** for power users who want filters, sorting, and bulk actions
- **Notes View** for capturing and browsing your raw thinking

### Focus Mode
When it's time to execute, Focus Mode eliminates distractions. A fullscreen Pomodoro timer keeps you on track. Picture-in-Picture mode lets the timer float while you work elsewhere. Ambient sounds—rain, coffee shop, white noise—set the mood. Celebrations with confetti reward completed sessions.

### AI Chat Assistant
A floating chat widget provides a conversational interface to your entire productivity system. Create tasks, search your backlog, reschedule batches of work, find blocking dependencies, or ask for a summary of your week. The AI has tools for all of it.

### Smart Daily Suggestions
Each morning, Groaly surfaces a curated list of what to work on today based on deadlines, priorities, goal balance, and your historical patterns.

### Weekly Reviews
AI-generated weekly insights show you what you accomplished, where you spent your time, which goals got attention, and where you might adjust. The tone is encouraging, never shaming.

### Compassionate Accountability
When motivation drops, Groaly doesn't guilt-trip. It offers philosophical quotes, suggests lighter alternatives, and remembers that productivity serves life—not the other way around.

### Related Tasks Discovery
Every task shows contextually related items—other tasks from the same note, the same goal, or with overlapping tags. Connections surface naturally.

### Offline Support
Built as a Progressive Web App, Groaly works offline. Your notes and tasks sync when connectivity returns.

## Technical Foundation

Groaly is built on a modern, robust stack:

- **Framework:** Next.js 16 with the App Router and React 19
- **Language:** TypeScript in strict mode throughout
- **Styling:** Tailwind CSS 4 with shadcn/ui components
- **Backend:** Supabase for authentication, PostgreSQL database, and real-time sync
- **AI:** Vercel AI SDK with OpenRouter for model flexibility (Claude, Gemini, and others)
- **Rich Text:** Tiptap editor with Markdown support and code highlighting
- **Drag and Drop:** dnd-kit for smooth Kanban interactions
- **Data Tables:** TanStack Table for powerful filtering and sorting
- **Charts:** Recharts for progress visualization
- **Offline:** Service workers and IndexedDB for PWA functionality

## Getting Started

### Prerequisites

- Node.js 20 or later (Bun recommended)
- A Supabase project
- An OpenRouter API key for AI features

### Environment Setup

1. Clone the repository and install dependencies:
   ```bash
   bun install
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

3. Configure the required environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key
   - `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (server-side only)
   - `OPENROUTER_API_KEY` — Your OpenRouter API key
   - `ENCRYPTION_KEY` — A 32-byte hex string for encrypting sensitive data

   Generate an encryption key with:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. See `docs/SETUP.md` for detailed configuration instructions.

### Development

Start the development server:
```bash
bun dev
```

Open http://localhost:3000 in your browser.

### Production Build

```bash
bun build
bun start
```

### Code Quality

```bash
bun lint          # Run ESLint
bun lint --fix    # Auto-fix issues
bunx tsc --noEmit # Type check
```

## Project Structure

```
app/                  # Next.js App Router pages and API routes
  (auth)/             # Authentication pages
  (dashboard)/        # Main application views
  api/                # Backend API endpoints
components/
  ui/                 # shadcn/ui primitives
  ai/                 # AI chat and suggestions
  focus/              # Focus mode and Pomodoro
  notes/              # Note editor and list
  tasks/              # Task modals and related tasks
  views/              # Kanban, calendar, table views
  reviews/            # Weekly review components
lib/
  ai/                 # AI client, tools, and scheduling logic
  supabase/           # Database clients and realtime subscriptions
  crypto/             # Encryption utilities
  tiptap/             # Editor configuration
hooks/                # Custom React hooks
stores/               # Zustand state management
types/                # TypeScript definitions
```

## Documentation

- **AGENTS.md** — Development guidelines and code conventions
- **docs/SETUP.md** — Complete environment setup guide

## Philosophy

Groaly believes that productivity tools should adapt to humans, not the other way around. The goal is not to turn you into a task-completing machine, but to help you live a balanced life where the things that matter to you—all of them—get the attention they deserve.

We call this Vibe Tasking: you bring the intention and effort, AI handles the organization and orchestration. The result is less friction, less guilt, and more progress on what actually matters.
