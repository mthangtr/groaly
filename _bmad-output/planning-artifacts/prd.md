---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
workflowStatus: complete
completedDate: 2026-01-17
inputDocuments:
  - '_bmad-output/planning-artifacts/product-brief-dumtasking-2026-01-17.md'
  - 'docs/brainstorm.md'
  - 'README.md'
  - 'package.json'
workflowType: 'prd'
briefCount: 1
researchCount: 0
brainstormingCount: 1
projectDocsCount: 2
date: 2026-01-17
author: mthangtr
project_name: dumtasking
classification:
  projectType: web_app
  domain: general_productivity
  complexity: medium_high
  projectContext: greenfield
  innovationLevel: high
  techStack:
    framework: Next.js 16.1.3
    deployment: Vercel
    database: Supabase PostgreSQL
    ai: Vercel AI SDK + OpenRouter
    ui: shadcn/ui (mira style, zinc theme)
---

# Product Requirements Document - dumtasking

**Author:** mthangtr
**Date:** 2026-01-17

## Success Criteria

### User Success

**Core Success Definition:**  
Users consistently make progress on all their major life goals without neglect, overwhelm, or burnout, while maintaining the flexibility to adapt when context changes.

**Success Attributes:**
1. **Consistency:** All 3+ major goals receive attention regularly (no 2-month neglect)
2. **Completion:** Tasks and goals are completed, not just planned
3. **Adaptability:** When urgent tasks emerge, the system reorganizes seamlessly while maintaining long-term goal progress
4. **Sustainability:** Productivity is maintained without guilt loops or burnout

**Key Success Moments:**
- **Aha Moment:** "Wow, it balanced all my goals automatically—I don't have to think about orchestration!"
- **Relief Moment:** Evening motivation drops don't spiral into guilt → abandonment
- **Empowerment Moment:** "I finally have a companion that understands I'm not one person with one goal"

### Business Success

**Phase 1: Personal Validation (Months 1-3)**

**Primary Objective:** Prove dumtasking solves the multi-goal orchestration problem for mthangtr personally.

**Success Criteria:**
1. Personal Adoption: 5+ days/week usage for 3 consecutive months
2. Goal Neglect Eliminated: Japanese N3 receives minimum 15 min daily (no more 2-month gaps)
3. Developer Joy: Building and using dumtasking is energizing, not draining
4. Workflow Integration: Replaces previous fragmented workflow (external AI + Notion/iPhone reminders)
5. Measurable Impact: Completion rate >70%, all 3 goals show progress monthly

**Phase 2: Code Quality & Portfolio Value (Months 3-6)**

**Objective:** dumtasking becomes a portfolio-worthy project demonstrating full-stack + AI integration expertise.

**Success Criteria:**
1. Code Quality: Clean, maintainable codebase - proud to show in interviews/portfolio
2. Architecture: Demonstrates mastery of Next.js 16.1.3, Supabase, Vercel AI SDK, Realtime systems
3. AI Integration: Showcases advanced LLM usage (structured output, tool calling, context management)
4. Performance: <2s page loads, <1s realtime sync, <5s AI task extraction

**Phase 3: Optional Commercial Exploration (Month 6+)**

**Objective:** If personal use is wildly successful, explore sharing with similar users.

**Threshold Criteria:**
1. Word of Mouth: 5+ people ask "What tool are you using?" unprompted
2. Beta Interest: 10 users willing to try beta version
3. Cost Efficiency: Monthly operating cost <$50 (sustainable at personal scale)
4. Differentiation Validated: Beta users say "this is different from [Motion/Todoist/etc.]"

### Technical Success

**Performance Targets:**
- **Page Load Performance:**
  - Initial page load: <2 seconds (First Contentful Paint)
  - Subsequent navigation: <500ms (client-side routing)
  - Time to Interactive: <3 seconds
- **AI Response Times:**
  - AI task extraction: <5 seconds for typical note (200-500 words)
  - AI Chat Assistant: <2 seconds first token (streaming), <10 seconds full response
  - Daily Suggestions generation: <3 seconds
  - Calendar auto-balance: <3 seconds to redistribute full week
- **Realtime Sync:**
  - Cross-view sync latency: <1 second
  - Conflict resolution: <2 seconds
  - Optimistic UI updates: Immediate (0ms perceived latency)
- **View Performance:**
  - Kanban drag-and-drop response: <100ms
  - Calendar re-render after task move: <1 second
  - Table view load time: <1 second for 1000+ tasks (virtualized)
  - Focus Mode entry: <500ms (fullscreen + PiP timer activation)

**Reliability & Uptime:**
- **System Availability:** 99.5%+ uptime (excluding planned maintenance)
- **Data Durability:** 99.99% (Supabase PostgreSQL guarantees)
- **Error Rate:** <0.5% of user actions result in errors
- **Recovery:**
  - Automatic retry for failed API calls (max 3 retries with exponential backoff)
  - Graceful degradation when offline (queue operations locally)
  - Session recovery: Resume interrupted workflows within 5 minutes

**Code Quality:**
- **Testing Coverage:**
  - Unit tests: 70%+ coverage for critical business logic
  - Integration tests: All API routes and database operations
  - E2E tests: Core user flows (auth, note creation, task extraction, Focus Mode)
- **Code Standards:**
  - TypeScript strict mode enabled
  - ESLint + Prettier configured and enforced
  - No console errors or warnings in production
  - Accessibility: WCAG 2.1 Level AA compliance
- **Documentation:**
  - README with setup instructions and architecture overview
  - API documentation for Vercel AI SDK tool functions
  - Database schema documentation
  - Component documentation for complex UI components

**Security:**
- **Authentication:** Supabase Auth with magic links (no password storage)
- **Authorization:** Row-level security policies on all database tables
- **Data Protection:**
  - All data encrypted at rest (Supabase default)
  - All data encrypted in transit (HTTPS/TLS)
  - User API keys encrypted in database (AES-256)
- **Rate Limiting:**
  - AI Chat: 50 messages/hour per user
  - API requests: 100 requests/minute per user
  - Task extraction: 20 operations/hour per user
- **Privacy:**
  - GDPR compliance: User data export (JSON) and account deletion
  - No third-party analytics without user consent
  - Optional analytics toggle in settings

**Scalability:**
- **Database:**
  - Supabase free tier: Up to 500MB storage, 2GB bandwidth
  - Upgrade path: Pro tier ($25/month) supports 8GB storage, 100GB bandwidth
  - Indexed queries: All frequent queries use proper indexes (<50ms query time)
- **AI Cost Management:**
  - Response caching: 24-hour cache for similar queries
  - Embedding caching: Regenerate only when task content changes
  - Weekly review caching: No regeneration on re-opens
- **Target Scale:**
  - Initial: 1 user (personal validation)
  - 3 months: 1-5 users (personal + close beta)
  - 6 months: 10-50 users (limited beta)
  - 12 months: 100-1000 users (public beta, if commercialized)

**Cost Efficiency:**
- **Monthly Operating Costs (Personal Use):**
  - Vercel Hobby: $0 (within free tier limits)
  - Supabase Free: $0 (within 500MB limit)
  - OpenRouter AI: ~$20-30/month (estimated for 1 active user)
  - Total: <$50/month target
- **Cost per User (if scaled):**
  - AI costs: $5-10/user/month (usage-based)
  - Infrastructure: $0.50-1/user/month (Vercel + Supabase Pro tier amortized)
  - Target: <$15/user/month total operating cost

**Developer Experience:**
- **Development Velocity:** Ship features without sacrificing quality
- **Debugging:** Clear error messages, logging, and monitoring
- **Hot Reload:** <1 second for code changes during development
- **Build Time:** <2 minutes for production build

### Measurable Outcomes

**3-Month Success Checkpoint (Critical Go/No-Go Decision):**

**Primary Success Metrics (Must achieve 6+ to continue):**
1. ✅ Multi-Goal Consistency: No goal receives <10% time allocation for >2 consecutive weeks
2. ✅ Task Completion Rate: 70%+ sustained over 12 weeks
3. ✅ Adaptive Re-Organization: 80%+ of urgent tasks handled without derailing other goals
4. ✅ Daily Engagement: App opened 5+ days/week for 10+ consecutive weeks
5. ✅ Focus Mode Adoption: 3+ sessions/week with 85%+ completion rate
6. ✅ AI Trust: 70%+ of AI-generated plans accepted with minor or no edits
7. ✅ Goal Distribution Balance: Actual time allocation matches intended priorities within ±10% variance
8. ✅ Insight Engagement: 70%+ of weekly reviews read within 48 hours, 50%+ result in action
9. ✅ Compassionate Accountability: Evening motivation drops handled without guilt spirals

**Technical Health Metrics:**
10. ✅ System Reliability: 99.5%+ uptime
11. ✅ Performance: 95%+ of actions complete <2 seconds
12. ✅ Cost Efficiency: <$50/month operating costs

**Behavioral Impact:**
13. ✅ Japanese N3 Progress: Consistent 15 min daily maintained (no 2-month gaps)
14. ✅ Workflow Replacement: Old fragmented workflow feels painful compared to dumtasking
15. ✅ "Can't Go Back" Test: User can't imagine returning to old workflow

**Qualitative Validation:**
16. ✅ Developer Joy: Building/using dumtasking is energizing, not draining
17. ✅ Portfolio Value: Code quality is demonstrable in interviews
18. ✅ Self-Reported Impact: "dumtasking solved my orchestration problem"

**Decision Framework:**
- ✅ **GO (Continue Development):** 14+ criteria met → Refine & expand to beta
- 🟡 **PIVOT (Adjust Strategy):** 8-13 criteria met → Identify what's not working, iterate
- ❌ **STOP (Fundamental Rethink):** <8 criteria met → Core assumptions may be wrong

**Ultimate Test:** "Would I pay $20/month for this if someone else built it?"

**The North Star Metric:**  
*"Multi-goal individuals consistently make progress on all major life goals without neglect, overwhelm, or burnout."*

If this metric is achieved, everything else (completion rates, engagement, commercial success) will follow naturally.

---

## Product Scope

### MVP - Minimum Viable Product (Full-Feature Approach)

**Philosophy:** dumtasking MVP is a complete, production-ready application designed for personal use validation, not a minimal proof-of-concept.

**Strategy:** Build complete → Validate personally (3 months) → Refine → Optionally expand

**Development Timeline:** 12-14 weeks

---

#### Feature Prioritization (Dependency-Optimized Order)

Features are organized to enable incremental development and testing without blocking dependencies:

**Phase 1: Foundation Layer (Weeks 1-3)**

*Core infrastructure that everything else depends on*

**1. User Authentication & Profile Setup**
- Supabase Auth with magic links
- Profile setup: Name, timezone (auto-detected), working hours (default 9-6 PM)
- User preferences storage
- **Test:** Login flow, profile creation, preferences persistence

**2. Database Schema & Architecture**
- Supabase PostgreSQL with tables: `users`, `notes`, `tasks`, `protected_slots`, `chat_messages`, `weekly_reviews`, `focus_sessions`
- pgvector extension for embeddings
- Row-level security policies
- Database migrations
- **Test:** Data persistence, security policies, migrations

**3. Rich Text Note Storage & Editor**
- Tiptap-based rich text editor (bold, italic, lists, headings)
- Auto-save every 2 seconds (debounced)
- Markdown shortcuts support
- Notes list view with search and filter
- Character/word count, responsive design, paste support
- **Test:** Note creation, auto-save, search, formatting

**4. Settings & Customization**
- Profile settings, AI preferences (LLM model selection)
- API Keys (BYOK), Privacy controls
- Protected Slots configuration, Pomodoro preferences
- **Test:** Settings persistence, UI preferences

---

**Phase 2: AI Intelligence Layer (Weeks 4-6)**

*AI capabilities that transform notes into tasks*

**5. AI Agents Task Extraction & Orchestration**
- Multiple entry points: "Plan this" button, floating bubble, slash commands
- Vercel AI SDK + OpenRouter (Claude 3.7 Sonnet, Gemini 2.0 Flash)
- Structured output via Zod schemas
- AI logic: Smart prioritization, workload balancing, dependency detection
- **Test:** Note→tasks extraction, priority assignment, dependency detection

**6. AI Chat Assistant (Conversational Task Manager)**
- Floating chat widget (bottom-right, expandable)
- Context-aware with tool calling functions
- Quick action commands: `/plan-week`, `/optimize-today`, `/whats-next`, etc.
- Streaming responses, message history persistence
- **Test:** Conversational interactions, tool execution, context awareness

**7. Smart Daily Suggestions (Morning Dashboard)**
- AI-curated top 3 tasks based on priority, blockers, time, energy
- Quick insights, suggested schedule, one-click actions
- Adaptive suggestions throughout the day
- **Test:** Task recommendations, priority logic, adaptability

---

**Phase 3: Views & Interactions Layer (Weeks 7-9)**

*Visual interfaces for task management*

**8. Realtime Sync Across Views**
- Supabase Realtime subscriptions on `notes` and `tasks` tables
- Changes broadcast within 500ms
- Optimistic UI updates, conflict resolution
- **Test:** Cross-device sync, conflict handling, latency
- **Why First:** All views depend on sync working correctly

**9. Realtime Kanban Board**
- Three columns: To Do / In Progress / Done
- Drag-and-drop with dnd-kit, Supabase Realtime sync
- Task cards with priority badges, time estimates
- Quick filters, bulk actions
- **Test:** Drag-and-drop, visual updates, realtime sync

**10. AI-Powered Calendar View**
- FullCalendar or custom component (week/month views)
- Tasks auto-assigned based on AI logic
- Drag-and-drop reschedule, visual density indicators
- "Optimize my week" button
- **Test:** Auto-scheduling, visual layout, workload balance

**11. Table/Database View (All Tasks Hub)**
- TanStack Table v8 - Notion-style database
- Sortable columns, multi-select filters, full-text search
- Bulk actions, inline editing, column customization
- Virtual scrolling for >100 tasks
- **Test:** Filtering, sorting, bulk operations, performance

---

**Phase 4: Advanced AI & Execution (Weeks 10-12)**

*Advanced intelligence and execution features*

**12. Knowledge Graph / Related Tasks**
- AI-generated embeddings (OpenAI text-embedding-3-small)
- pgvector similarity search
- Auto-linking, Related Tasks panel
- **Test:** Task connections, similarity search, dependency graph

**13. Defend Focus Time / Protected Slots**
- Protected slots UI and logic
- AI scheduling respects protected slots
- Auto-schedule breaks, calendar visualization
- **Test:** Slot protection, break scheduling, compliance tracking

**14. Focus Mode / Blitz Mode (Execution Layer)**
- Fullscreen API, minimalist UI
- PiP Floating Timer (Picture-in-Picture API)
- Pomodoro Timer (25/5 customizable)
- Ambient sounds, distraction prevention
- Task completion celebrations
- **Test:** Fullscreen mode, PiP timer, Pomodoro flow, celebrations

**15. Compassionate Accountability Layer**
- Evening motivation drop handling
- Philosophical quotes for reflection
- Behavior logging, compassionate suggestions
- Task importance field
- **Test:** Quote resonance, behavior tracking, emotional response

**16. Weekly AI Review (Retrospective & Planning)**
- Auto-generated every Sunday evening
- Report sections: completion rate, goal distribution, patterns, bottlenecks
- Interactive suggestions
- **Test:** Report generation, insights accuracy, suggestion adoption

**17. Time Tracking (Optional, Background)**
- Settings toggle (default OFF)
- Automatic tracking, compare estimated vs actual
- AI learning from history, weekly review integration
- **Test:** Background tracking, estimate accuracy, learning

---

**Phase 5: Polish & Production Readiness (Weeks 13-14)**

*Continuous improvements and deployment*

**18. UI/UX Polish**
- shadcn/ui components (mira style, zinc theme)
- Animations, loading states, error handling, toast notifications
- Responsive design, accessibility (WCAG 2.1 AA)
- **Test:** User experience, accessibility, responsiveness

**19. Performance Optimization**
- Caching: AI responses, task embeddings, weekly reviews
- Virtual scrolling, debounced auto-save
- Edge functions, rate limiting
- Optimistic UI, code splitting, lazy loading
- **Test:** Load times, caching effectiveness, rate limits

**20. PWA Setup (Offline Mode)**
- Service worker for offline functionality
- Offline draft notes with sync queue
- Install prompt, background sync
- **Test:** Offline editing, sync queue, PWA installation

---

### Growth Features (Post-MVP)

**Deferred to Phase 2 (After 3-Month Personal Validation):**

- Visual graph view (network diagram for dependencies)
- Advanced analytics dashboard (beyond weekly review)
- Multi-language support (Vietnamese, Thai, etc.)
- Mobile native apps (React Native, if PWA insufficient)
- API for integrations (Zapier, Make.com)
- Advanced export capabilities (PDF reports, CSV)
- Custom themes (dark mode enhancements, color schemes)

---

### Vision (Future)

**Post-Personal Validation (6+ Months, if commercialized):**

- Multi-user collaboration features
- Team workspaces and task sharing
- Voice input and speech-to-text
- Image/PDF OCR for note capture
- External calendar sync (two-way)
- Meeting notes templates and recording
- Browser extension for quick capture
- Custom LLM fine-tuning
- Advanced workflow automation

**Expansion threshold:** Only pursue if Phase 1 & 2 objectives fully met and 100+ unprompted requests for access.

---

## User Journeys

### Journey 1: First-Time User - From Chaos to Clarity

**Persona:** mthangtr - 25-year-old developer juggling 3 major life goals (dev growth, startup, Japanese learning)

**Opening Scene - The Overwhelm:**

It's Monday morning, 8:30 AM. mthangtr opens his laptop to start the workday. He has 47 unread notes scattered across iPhone Notes and random text files. His mind races with tasks: "Finish Java training module, call Client A about pricing, prepare marketing deck, review N3 vocabulary..." He feels paralyzed—where to even start?

He opens Gmail, then habitually types "dumtasking" in the browser. This is his first visit after hearing about it from a developer community.

**Rising Action - The Discovery:**

**Landing Page (9:00 AM):**
- Hero message resonates: "Dump your notes, AI Agents handle the rest"
- Click "Get Started" → Supabase magic link sent to email
- Checks email, clicks link → redirected to app

**Profile Setup (9:02 AM):**
- Welcome modal: "Welcome! Let's set up your workspace"
- Auto-detected timezone: Asia/Ho_Chi_Minh ✓
- Working hours suggested: 9 AM - 6 PM (accepts default)
- Enters name: mthangtr
- Clicks "Start Organizing"

**First Note Dump (9:05 AM):**
- Clean dashboard appears with rich text editor placeholder: "Type or paste your notes here..."
- mthangtr thinks: "Let me just dump everything from today's mind chaos"
- Types frantically for 3 minutes:

```
Today's urgent stuff:
- Call Client A about pricing - they need response by EOD
- Finish Java Stream API training module (been postponing for 2 weeks)
- Prepare marketing deck for investor meeting Thursday
- N3 vocabulary review - Chapter 8 grammar points
- Fix bug in startup dashboard (users reported)
- Weekly planning for all 3 goals - don't know how to balance them
```

- Auto-save indicator appears (subtle checkmark) - he notices and feels relieved: "It saved automatically"

**The Magic Moment (9:08 AM):**
- Green glowing button appears: "Plan this" ✨
- Hovers → tooltip: "AI will extract tasks from your note and create a balanced schedule"
- Hesitates... clicks
- Modal appears: "AI will extract tasks from your note. Continue?" (estimated cost: $0.02)
- Thinks: "Why not? Let's see what happens"
- Clicks "Continue"

**Loading (9:08:15 AM):**
- Elegant loading animation: "Analyzing your note with AI..."
- Progress indicators: "Extracting tasks... Detecting priorities... Balancing workload..."
- 4 seconds later → Preview modal slides in

**Climax - The Aha Moment (9:08:20 AM):**

AI preview shows 6 extracted tasks with intelligent analysis:

```
Task 1: Call Client A about pricing
Priority: HIGH (urgent keyword detected)
Estimated: 30 minutes
Due: Today by 6 PM
Dependencies: None
Suggested: Today 10:00 AM (morning energy, high-priority)

Task 2: Fix bug in startup dashboard
Priority: HIGH (users impacted)
Estimated: 2 hours
Due: Today
Dependencies: None
Suggested: Today 2:00 PM (after client call)

Task 3: Prepare marketing deck for investor meeting
Priority: HIGH (deadline Thursday)
Estimated: 3 hours
Due: Wednesday (day before meeting)
Dependencies: None
Suggested: Tuesday 9:00 AM (complex task → morning focus time)

Task 4: Finish Java Stream API training module
Priority: MEDIUM (learning goal)
Estimated: 1.5 hours
Due: This week
Dependencies: None
Suggested: Wednesday 4:00 PM (dev learning time)

Task 5: N3 vocabulary review - Chapter 8
Priority: MEDIUM (consistent learning)
Estimated: 30 minutes
Due: Today (daily habit)
Dependencies: None
Suggested: Today 5:30 PM (light task for end of day)

Task 6: Weekly planning for all 3 goals
Priority: LOW (meta-planning, AI handles this now)
Status: COMPLETED BY AI ✓
Note: AI has balanced your 3 goals automatically across this week
```

**AI Insight Panel shows:**
- "🎯 Goal Distribution This Week: Startup 60%, Dev Learning 25%, Japanese 15%"
- "⚡ Your most productive time: Tuesday/Thursday mornings → complex tasks scheduled then"
- "🧘 Evening task: Only light Japanese review (respecting energy levels)"

**mthangtr's Internal Reaction:**
- Eyes widen: "Wait... it actually understood ALL of this?"
- Scrolls through tasks: "It caught the urgency in Client A... it scheduled complex tasks in mornings... it even removed the 'weekly planning' task because IT DID THE PLANNING FOR ME"
- Notices goal distribution: "Wow, I don't have to think about orchestration anymore—AI did it for me"
- **This is the aha moment**

**Resolution - The New Reality (9:10 AM):**

- Clicks "Add to Workspace" → Tasks inserted into system
- Dashboard transforms:
  - Kanban tab lights up → 6 tasks in "To Do" column
  - Calendar tab shows weekly view with color-coded tasks
  - Smart Daily Suggestions appears: "Good morning mthangtr! Here's your focus for today:" with top 3 tasks

- mthangtr clicks "Start [Call Client A]" → enters Focus Mode
  - Fullscreen activates, PiP timer starts
  - 30 minutes later: Completes call, celebration animation 🎉
  - Returns to dashboard → task auto-moved to "Done"

**End of First Day (6:30 PM):**
- mthangtr has completed 3/5 tasks today (Client call ✓, Bug fix ✓, N3 review ✓)
- Evening motivation drop hits → sees remaining tasks
- **Compassionate Accountability appears:**
  - Modal: "Evening energy low? You've done great today (3 tasks completed). Options:"
    - Defer "Marketing deck" to tomorrow morning ✓
    - Keep "Java training" for tomorrow
  - Philosophical quote: "Con kiến cố gắng hết sức nhưng không thể làm lay cây đại thụ, nhưng nó muốn làm gì với cây đại thụ, đó chính là thái độ của nó."
  - Feels understood, not judged → clicks "Defer to tomorrow"

**New Habit Formed:**
- Next morning, opens laptop → Gmail + Slack + **dumtasking** (becomes part of ritual)
- No more 47 scattered notes → one place to dump, AI orchestrates everything

**Emotional Journey:**
- Start: Overwhelmed, paralyzed, chaotic
- Middle: Curious, skeptical, trying it out
- Climax: Shocked, delighted, "This is magic!"
- End: Relieved, empowered, "I can trust this system"

---

### Journey 2: Daily Workflow - Multi-Goal Balance in Action

**Persona:** mthangtr - 2 weeks into using dumtasking

**Morning Ritual (7:45 AM - The Hook):**

mthangtr arrives at office, opens laptop. Muscle memory kicks in:
1. Chrome opens → Gmail tab
2. Slack tab
3. **dumtasking tab** (now part of the ritual, like checking email)

**Dashboard Smart Suggestions (7:46 AM):**

```
Good morning mthangtr! Here's your balanced focus for today:

🔥 High Priority (2 tasks, 4 hours):
  1. Prepare investor deck final slides (3h) - DUE TODAY
     → "Start Focus Session" button
  2. Client B demo call (1h) - 2 PM scheduled
     → Calendar reminder set

📚 Dev Learning (1 task, 1 hour):
  3. Java Generics training module (1h) - consistent progress
     → Suggested: 4-5 PM (learning time slot)

🇯🇵 Japanese (15 min quick win):
  4. N3 Grammar: causative-passive forms (15 min)
     → Suggested: 5:45 PM (light end-of-day task)

⚡ Insight: "You're on track! All 3 goals represented today. Startup 65%, Dev 20%, Japanese 15% this week."

✅ Yesterday: 3 tasks completed - great job! 💪
```

**mthangtr's Reaction:**
- "Perfect. It already figured out what I should do. No thinking needed."
- Clicks "Start [Investor deck]" → enters Focus Mode immediately

**Execution During Day:**

**9:00 AM - Focus Mode ON:**
- Fullscreen activated, PiP timer floating (25 min Pomodoro)
- Minimalist interface: just the deck task and timer
- Ambient rain sounds playing (his preference)
- Tab title changes: "🔴 Focus Mode - 23:45 remaining"
- Works uninterrupted

**9:25 AM - Pomodoro Break:**
- Timer ends → soft audio cue
- Modal: "Work session complete! Take a 5-minute break?" [Continue Working] [Take Break]
- Clicks "Take Break" → stretches, gets coffee
- PiP timer shows "5:00 break" counting down

**9:30 AM - Back to Focus:**
- Break ends → auto-resumes next Pomodoro
- Continues working on deck

**11:00 AM - URGENT INTERRUPTION:**
- Boss Slack message: "Client C contract needs review ASAP - legal wants it by 2 PM today"
- mthangtr panics: "This will blow up my whole day..."

**Adaptive Response (11:02 AM):**
- Exits Focus Mode → marks "Investor deck" as 60% done
- Dumps new note in dumtasking:
  ```
  URGENT: Review Client C contract for legal team
  - Due: Today 2 PM
  - Need to read 15-page contract
  - Write summary with legal concerns
  - Email legal team with review
  ```
- AI Chat Assistant pops up: "I noticed an urgent task. Want me to reorganize your day?"
- mthangtr: "Yes, please reorganize"

**AI Auto-Reorganization (11:03 AM):**
- AI analyzes current schedule + new urgent task
- **Calendar view updates in real-time:**
  - Client C contract review → 11:00 AM - 1:00 PM (2h, moved to NOW)
  - Client B demo call → 2:00 PM (unchanged, conflict avoided)
  - Investor deck (remaining 40%) → moved to tomorrow 9 AM
  - Java training → moved to tomorrow 4 PM
  - Japanese review → kept today 5:45 PM (light task, preserved)

- **AI Insight notification:**
  - "✅ Reorganized your day. Urgent task fits without losing long-term goals."
  - "📊 Goal balance this week still maintained: Startup 62%, Dev 22%, Japanese 16%"
  - "💡 Investor deck moved to tomorrow morning (your most productive time)"

**mthangtr's Reaction:**
- "Wow... it reorganized everything instantly. AND it didn't forget my Japanese review."
- "This is the 'adaptive orchestration' I needed"
- Feels relieved, not stressed

**Rest of Day Execution:**
- 11:00 AM - 1:00 PM: Contract review (completed ✓)
- 2:00 PM - 3:00 PM: Client B demo (completed ✓)
- 5:45 PM - 6:00 PM: Japanese N3 review (completed ✓)

**Evening (6:30 PM):**
- 3/3 tasks completed today (including urgent task)
- Investor deck preserved for tomorrow morning
- No goals neglected despite urgent interruption
- **Success: Adaptability without losing balance**

---

### Journey 3: Evening Motivation Drop - Compassionate Accountability

**Persona:** Sarah - Career switcher balancing marketing job + coding learning

**Scenario Setup (7:30 PM - Wednesday Evening):**

Sarah returns home after exhausting 10-hour workday. Marketing campaign launched today, she's mentally drained. Opens dumtasking to check evening tasks:

**Planned Tasks Remaining:**
1. JavaScript Arrays & Objects tutorial (1.5 hours) - scheduled 7:30-9:00 PM
2. Build portfolio project feature: user login form (2 hours) - scheduled 9:00-11:00 PM

**Sarah's Internal State:**
- Stares at screen: "I have zero energy for coding..."
- Guilt creeps in: "I said I'd do this. If I keep skipping, when will I ever switch careers?"
- Considers closing laptop and watching Netflix
- **This is the critical moment where most task managers fail**

**dumtasking's Compassionate Response (7:32 PM):**

Modal appears (gentle animation, not intrusive):

```
Evening Reflection

I noticed you've been working for 10 hours today. Your energy might be low.

You have 2 coding tasks planned for tonight (3.5 hours total).

What feels right for you right now?

[Options - No Judgment]

1. ✅ Do a lighter version (30 min tutorial only, skip project work)
2. 📅 Defer to tomorrow morning (6:30-7:30 AM - fresh energy)
3. 📅 Move to weekend (Saturday 9-11 AM learning block)
4. ❌ Cancel for now (life happens, we'll adapt)

[Why is this task important to you?]
Tap to add personal motivation for future reflection
```

**Sarah's Response (7:33 PM):**
- Reads options: "Wait... it's giving me choices without making me feel guilty?"
- Thinks: "Tomorrow morning is better. I'm a morning person for learning."
- Clicks "Defer to tomorrow morning 6:30-7:30 AM"

**Philosophical Reflection Appears (7:34 PM):**

```
"Vì sợ mình không phải là ngọc, nên tôi không dám khổ công mài giũa; 
lại vì có chút tin mình là ngọc, nên tôi không cam lòng đứng lẫn với đá sỏi."

[Moment for reflection]

Progress isn't about forcing yourself when empty.
It's about choosing the right time to grow.

Tomorrow morning, you'll have the energy you need. 🌅

[Action Logged - No Shame, Just Data]
```

**Sarah's Emotional Reaction:**
- Feels understood: "It knows I'm tired..."
- No guilt: "It's not scolding me for deferring"
- Motivated: "That quote... it's right. I DO believe I'm capable, so I should prepare properly."
- Closes laptop peacefully, gets good sleep

**Next Morning (6:30 AM - Thursday):**

Sarah wakes up refreshed. Opens dumtasking:

```
Good morning Sarah! ☀️

Yesterday you chose to defer coding to this morning - smart choice! 
Fresh energy for learning is key.

Your focus for today:

🌅 Morning Power Hour (6:30-7:30 AM):
  → JavaScript Arrays & Objects tutorial (1h) 
  → "Start Focus Session" - perfect morning brain time

💼 Work (9 AM - 6 PM):
  → Marketing follow-ups (tracked in work calendar)

🌙 Evening (7-9 PM):
  → Portfolio project: user login form (2h)
  → You deferred this from yesterday - ready now?

Goal balance this week: Job 60%, Learning 30%, Projects 10% ✓
```

**Sarah's Reaction:**
- "Perfect. Let me do the tutorial now while fresh."
- Clicks "Start Focus Session" → completes tutorial in 50 minutes
- Feels accomplished before work even starts
- **Evening project work** feels achievable now (not stacked with tutorial)

**Week-End Pattern Recognition (Sunday Evening):**

dumtasking generates weekly review:

```
Weekly Review - Week of Jan 13

Evening Task Pattern Detected:

📊 You deferred 4 evening coding tasks this week
✅ You completed all of them the next morning instead
⚡ Your morning completion rate: 95%
🌙 Your evening completion rate: 40%

💡 Insight: You're a morning learner!

Suggestion: Should I auto-schedule coding tasks in mornings (6:30-7:30 AM) 
instead of evenings (7-9 PM)?

[Yes, optimize my schedule] [No, keep as is]
```

**Sarah clicks "Yes, optimize":**
- AI adjusts all future learning tasks to morning slots
- Evening time preserved for lighter tasks or rest
- **Behavioral learning without judgment**

**Outcome - Sustainable Progress:**
- 3 months later: Sarah has completed 60% of coding bootcamp
- No guilt spirals from skipping evening tasks
- Consistent morning learning habit formed
- Career switch on track

---

### Journey 4: Weekly Review - Growth Through Reflection

**Persona:** mthangtr - 4 weeks into using dumtasking

**Trigger:** Sunday evening, 8:00 PM (automated weekly review generation)

**Notification Appears:**

```
🎉 Your Weekly Review is Ready!

Week of Jan 13-19 - Let's reflect on your progress.

[View Full Review]
```

**mthangtr clicks - Review Opens (8:02 PM):**

```
Weekly Review - Week of Jan 13-19

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMPLETION OVERVIEW

✅ You completed 23/30 tasks this week (77%)
📈 +18 tasks vs. last month's weekly average
🎯 Goal balance: Startup 70%, Dev 18%, Japanese 12%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TOP ACHIEVEMENTS 🎉

1. ✨ Investor deck completed 2 days ahead of schedule
2. ✨ Shipped startup dashboard bug fix (users happy!)
3. ✨ 7-day streak: Japanese N3 review (15 min daily) - NEW RECORD!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PATTERN RECOGNITION 🧠

⚠️ Bottleneck Detected:
"Java training" blocked 2 other dev tasks this week.
You postponed it 3 times (Mon, Wed, Fri).

💡 Insight: Complex learning tasks scheduled in afternoons (low energy time).

📊 Your Most Productive Times:
- Tuesday morning: 95% completion rate
- Thursday morning: 90% completion rate
- Friday afternoon: 45% completion rate (low energy)

Suggestion: Move complex learning tasks to Tue/Thu mornings?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GOAL DISTRIBUTION ANALYSIS 📊

[Pie Chart Visualization]
- Startup: 70% (21 hours) ← Higher than target 60%
- Dev Learning: 18% (5.4 hours) ← Lower than target 25%
- Japanese: 12% (3.6 hours) ← Lower than target 15%

⚠️ Goal Neglect Warning:
Dev Learning received <20% attention this week.
If this continues 2 more weeks, goal neglect threshold reached.

Japanese: Consistent but below target. Consider 20 min daily instead of 15?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMPASSIONATE ACCOUNTABILITY 💭

Evening Tasks Skipped: 5 times this week
Your typical pattern: Skip → Defer → Complete next morning

You're learning your energy rhythms. That's progress! 🌟

Quote for reflection:
"Tuần này đã có mấy buổi tối bạn đã bỏ rồi, vậy còn mục tiêu cuối cùng 
của bạn bao giờ mới hoàn thành được? Mỗi bước đi nhỏ và kiên trì đều 
dẫn đến sự tiến bộ..."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEXT WEEK SUGGESTIONS 💡

1. Rebalance Goals:
   → Startup 60% (18h), Dev 25% (7.5h), Japanese 15% (4.5h)
   → "Auto-apply this balance?" [Yes] [Customize]

2. Optimize Schedule:
   → Move Java training to Tue/Thu mornings (high energy)
   → Move Japanese to 20 min daily (instead of 15)
   → Keep evening slots for light tasks only

3. Focus on Shipping:
   → You have 3 dev tasks at 60-80% completion
   → Prioritize finishing over starting new ones?

[Apply All Suggestions] [Customize] [Discuss with AI]
```

**mthangtr's Reaction (8:08 PM):**

- Scrolls through review slowly
- **Celebrates:** "23 tasks! And 7-day Japanese streak—I've NEVER done that before!"
- **Reflects on bottleneck:** "True... I keep postponing Java training because it's hard, and afternoons I'm tired."
- **Confronts imbalance:** "70% startup... yeah, I'm obsessed with product launch. But dev and Japanese are suffering."
- **Reads philosophical quote:** Pauses. Thinks. "5 evenings skipped... if I keep doing this, will I reach N3 this year? Will I get better at Java?"
- **Feels accountability without guilt:** "It's not scolding me. It's just showing me reality."

**Action Taken (8:12 PM):**

Clicks "Discuss with AI" → Chat Assistant opens:

```
mthangtr: "I want to rebalance but I'm worried about startup progress. 
We're launching in 6 weeks."

AI: "I understand. Launch is critical. How about this:

For next 6 weeks (pre-launch):
- Startup 65% (prioritize launch)
- Dev 20% (maintain skills, not grow aggressively)  
- Japanese 15% (protect daily habit, don't let it die)

After launch (week 7+):
- Startup 50% (maintenance mode)
- Dev 30% (aggressive growth)
- Japanese 20% (accelerate to N3)

This way, startup gets the attention it needs NOW, but other goals 
don't disappear for 2 months like before. Sound good?"

mthangtr: "Yes! That's exactly what I need. Apply that plan."

AI: "✅ Plan applied. Your schedule for next week is ready. 
I'll remind you in 6 weeks to shift to post-launch balance."
```

**mthangtr's Emotional State:**
- Feels seen: "It understood my startup urgency"
- Feels relieved: "I won't neglect Japanese for 2 months again"
- Feels empowered: "I'm making intentional choices, not reactive chaos"
- Closes laptop feeling good about the week ahead

**3 Months Later - The Transformation:**

Weekly review shows:
- Startup: Launched successfully ✓
- Dev: Consistent progress, no 2-month gaps ✓
- Japanese: 40% to N3 completion ✓
- **No goal neglected >2 weeks in entire 3-month period**

mthangtr's reflection: "I finally have a companion that understands I'm not one person with one goal—I'm three people trying to coexist. dumtasking orchestrates that chaos into sustainable progress."

---

### Journey 5: Edge Case - Recovery from Abandonment

**Persona:** Alex - Indie hacker with multiple side projects

**Scenario:** Alex stopped using dumtasking for 3 weeks due to burnout

**Re-Entry Point (Monday morning, 9:00 AM):**

Alex opens dumtasking for the first time in 21 days. Feeling guilty and anxious.

**Smart Re-Engagement (9:00 AM):**

Dashboard doesn't show overwhelming overdue tasks. Instead:

```
Welcome back, Alex! 👋

I noticed you've been away for 3 weeks. That's okay—life happens.

Let's catch up together. No judgment, just planning.

[Quick Reflection]

What happened during your break?
○ Burnout - needed time off
○ Life got busy - other priorities  
○ Lost motivation - felt overwhelmed
○ Other: _____________

[Tell me so I can help you restart better]
```

**Alex selects "Burnout - needed time off":**

**AI Response:**

```
Thank you for sharing that honestly.

Burnout is real. Taking time off was the right call.

Here's what I found while you were away:

OVERDUE TASKS: 18 tasks
BUT—let's be real: Some of these are no longer relevant.

Let's clean up together:

[AI Triage Suggestions]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROBABLY OUTDATED (6 tasks):
→ "Write blog post about Nov 2025 trends" (3 weeks old)
   [Archive] [Keep] [Make current]

STILL RELEVANT (8 tasks):
→ "Project A: Fix authentication bug" (HIGH priority)
   [Move to today] [Move to this week] [Reassess]

LOW PRIORITY / CAN WAIT (4 tasks):
→ "Research new React animation library"
   [Defer 2 weeks] [Archive] [Keep]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Auto-Triage with AI] [I'll review manually]
```

**Alex clicks "Auto-Triage with AI":**

- AI archives 6 outdated tasks
- Moves 3 critical tasks to this week
- Defers 5 low-priority tasks to 2 weeks out
- Keeps 4 mid-priority tasks for next week

**Fresh Start Dashboard (9:03 AM):**

```
Your Fresh Start Plan 🌱

This Week - Gentle Re-Entry:
- 3 critical tasks only (12 hours total)
- No new projects - focus on finishing what matters
- Protected rest time: No tasks after 6 PM

Goal: Rebuild momentum without burning out again.

Ready to start?
```

**Alex's Reaction:**
- "It didn't shame me for disappearing"
- "It helped me clean up the mess without overwhelm"
- "Gentle re-entry... that's exactly what I need"
- Clicks "Start" → Eases back into productivity

**Outcome:**
- Week 1: 3/3 critical tasks completed
- Week 2: Confidence restored, adds more tasks
- Week 3: Back to normal flow
- **No guilt spiral, sustainable re-engagement**

---

### Journey Requirements Summary

These user journeys reveal comprehensive capability needs across the entire product lifecycle:

#### **Onboarding & First-Time Experience**
- Magic link authentication flow
- Profile setup with timezone auto-detection
- Empty state with clear value proposition
- Rich text note editor with zero-friction input
- "Plan this" button with AI extraction
- Real-time AI processing feedback (loading states)
- Task preview with editable results before committing
- Immediate value delivery (tasks appear in Kanban/Calendar)
- Aha moment orchestration (visual goal distribution)

#### **Daily Workflow & Execution**
- Morning ritual dashboard with Smart Daily Suggestions
- AI-curated top tasks with priority/time/dependency logic
- One-click Focus Mode entry from suggestions
- Fullscreen Focus Mode with PiP floating timer
- Pomodoro timer with customizable intervals
- Ambient sound selection for focus
- Task completion celebrations (animations, sound effects)
- Real-time status updates across all views (Kanban, Calendar, Table)

#### **Adaptive Intelligence**
- Real-time urgent task detection from user input
- Conversational AI reorganization ("Want me to reorganize your day?")
- Automatic schedule reshuffling maintaining goal balance
- Visual calendar updates showing redistributed tasks
- Smart conflict avoidance (don't overlap meetings/calls)
- Goal distribution preservation during disruptions
- Notification system for reorganization insights

#### **Evening & Emotional Support**
- Time-of-day awareness (detect evening low-energy states)
- Compassionate accountability modal (non-judgmental options)
- Multiple defer/reschedule options (tomorrow, weekend, cancel)
- Philosophical quote system for reflection
- "Why is this important?" field for personal motivation tracking
- Behavior logging without shame-based language
- Energy level detection and task suggestion adaptation

#### **Insight & Growth Loop**
- Automated weekly review generation (Sunday 8 PM)
- Completion rate analysis with historical comparison
- Goal distribution visualization (pie charts, time breakdowns)
- Pattern recognition (bottlenecks, productive times, skip behaviors)
- Behavioral learning (morning vs evening performance)
- Compassionate accountability metrics (skip patterns without judgment)
- Interactive suggestions with one-click acceptance
- Conversational refinement through AI Chat Assistant
- Long-term goal tracking (3-month, 6-month milestones)

#### **Re-Engagement & Recovery**
- Absence detection (days since last use)
- Welcome back flow without guilt-inducing language
- Triage system for overdue tasks (outdated, relevant, low-priority)
- AI-assisted cleanup (archive, defer, keep)
- Gentle re-entry scheduling (reduced task load first week)
- Burnout prevention (protected rest time)
- Gradual momentum rebuilding

#### **Cross-Cutting Capabilities**
- **Realtime sync:** All changes propagate <1 second across views
- **Context awareness:** AI knows user's working hours, energy patterns, goal priorities
- **Multi-goal orchestration:** Automatic balancing of 3+ life goals
- **Natural language processing:** Understands urgency, dependencies, importance from note text
- **Structured AI output:** Zod schemas for reliable task extraction
- **Optimistic UI:** Immediate feedback, background persistence
- **Error recovery:** Graceful handling of API failures, offline queue
- **Accessibility:** Keyboard navigation, screen reader support throughout

#### **View-Specific Requirements**
- **Kanban:** Drag-and-drop, realtime updates, priority color-coding, bulk actions
- **Calendar:** Week/month views, time block visualization, density indicators, drag reschedule
- **Table:** Sortable columns, advanced filters, inline editing, virtual scrolling
- **Settings:** Profile, AI preferences, protected slots, Pomodoro config, BYOK

#### **Security & Privacy**
- Row-level security on all database tables
- Encrypted API key storage for BYOK
- Rate limiting (50 AI messages/hour, 100 API requests/min)
- GDPR compliance (data export, account deletion)
- Optional analytics with user control

This journey-driven approach ensures every feature serves real user needs in authentic contexts, not just theoretical requirements.

---

## Innovation & Novel Patterns

### Core Innovation: "Vibe Tasking" Philosophy

dumtasking introduces **"Vibe Tasking"** - a novel approach to personal productivity inspired by the "Vibe Coding" movement. Just as Vibe Coding uses AI to handle development heavy-lifting so developers can focus on creativity, Vibe Tasking uses AI to handle planning, scheduling, and organizing so users can focus on execution and personal growth.

**What Makes It Novel:**
- AI becomes the orchestrator, not just an assistant
- User dumps notes → AI handles ALL orchestration overhead
- Eliminates planning friction that kills productivity habits
- Zero cognitive load for multi-goal balance

### Unique Differentiator: Compassionate Accountability

**First productivity tool to combine emotional intelligence with accountability:**

**Innovation Elements:**
1. **Philosophical Depth:** Vietnamese philosophy quotes that prompt self-reflection, not guilt
2. **Emotional Intelligence:** Understands evening motivation drops, responds with compassion
3. **Behavior Pattern Learning:** Tracks patterns to provide context-aware support (morning vs evening energy)
4. **"Why is this important?" Fields:** Maintains purpose and motivation, not just completion
5. **Non-Judgmental Options:** Defer, move, cancel - with understanding, not shame

**What Makes It Unique:**
- No existing tool treats productivity as a human emotional journey
- Balances empathy (for light tasks) with push (for important goals)
- "Thương hoặc kiểm điểm bản thân" layer - compassionate self-examination
- First tool to integrate philosophical reflection into task management

### Novel Capability: Multi-Goal Orchestration

**Problem No Tool Solves:** "Focus vào 1 cái thì bỏ qua 2 cái" (focus on one goal, neglect others)

**Innovation:**
- AI automatically balances 3+ simultaneous life goals
- Goal distribution insights (Startup 70%, Dev 18%, Japanese 12%)
- Prevents goal neglect (no goal <10% attention for >2 weeks)
- Adaptive rebalancing based on life context (launch sprint → post-launch shift)

**What Makes It Unique:**
- First tool designed for multi-goal individuals (multiple simultaneous identities)
- AI orchestrates balance, user doesn't manually plan distribution
- Tracks and alerts on goal neglect patterns
- Conversational rebalancing with AI ("I want to focus on startup for 6 weeks, but don't let Japanese die")

### Technology Innovation: AI Agents with Personal Context

**Advanced AI Integration:**
- Claude 3.7 Sonnet / Gemini 2.0 Flash via Vercel AI SDK
- Structured output (Zod schemas) for reliable task extraction
- Tool calling for conversational task management
- Embeddings + pgvector for knowledge graph
- Personal learning (working hours, energy patterns, completion history, skip behaviors)

**What Makes It Advanced:**
- AI learns user's behavioral patterns over time
- Context-aware suggestions adapt to time of day, energy level, workload
- Streaming responses for real-time interaction
- Full conversation history for context preservation

### Validation Approach

**Phase 1: Personal Validation (3 Months)**
- mthangtr uses dumtasking as primary productivity system
- Measure: Goal neglect eliminated (Japanese 15min daily, no 2-month gaps)
- Measure: 70%+ task completion rate sustained
- Measure: All 3 goals show progress monthly
- Success criteria: "Can't imagine going back to old workflow"

**Phase 2: Code Quality & Portfolio (Months 3-6)**
- Demonstrate full-stack + AI integration expertise
- Clean, maintainable codebase worthy of portfolio showcase
- Performance targets met (<2s loads, <5s AI extraction)

**Phase 3: Optional Beta (Month 6+)**
- Only if personal validation wildly successful
- 10 beta users (similar multi-goal individuals)
- Validate: "This is different from Motion/Todoist/Reclaim"

### Risk Mitigation

**Innovation Risk 1: AI Orchestration May Not Be Trusted**
- Mitigation: Always show AI reasoning ("Why is this task scheduled here?")
- Fallback: Manual override on all AI suggestions
- Measure: 70%+ AI plan acceptance rate as success threshold

**Innovation Risk 2: Philosophical Quotes May Not Resonate**
- Mitigation: Make quotes optional (toggle in settings)
- Fallback: Simple compassionate text without philosophy
- Measure: User engagement with reflection prompts

**Innovation Risk 3: Multi-Goal Balance Algorithm Complexity**
- Mitigation: Start with simple heuristics (time-based distribution)
- Fallback: User sets manual percentages if AI fails
- Iteration: Learn from 3-month personal use, refine algorithm

**Innovation Risk 4: "Vibe Tasking" Concept Too Abstract**
- Mitigation: Concrete value demonstration in first 5 minutes (Journey 1)
- Fallback: Frame as "AI task manager" if philosophy doesn't land
- Measure: Aha moment in onboarding ("Wow, it balanced my goals automatically")

**Technical Innovation Risk: 2026 LLMs Not Reliable Enough**
- Assumption: Claude 3.7 / Gemini 2.0 achieve <10% error rate for task extraction
- Mitigation: Structured output with Zod schemas, preview before committing
- Fallback: User edits AI suggestions before accepting
- Contingency: If error rate >20%, add more manual task entry options

---

## Web Application Specific Requirements

### Project-Type Overview

dumtasking is a **Single Page Application (SPA)** built with **Next.js 16.1.3** using the App Router architecture with React Server Components and Server Actions. The application is designed as a **Progressive Web App (PWA)** with desktop-first optimization and mobile-responsive secondary support.

**Architecture Approach:**
- **SPA with SSR:** Leverages Next.js App Router for optimal performance and SEO
- **Client-side state management:** React hooks + optimistic UI for instant feedback
- **Server-side rendering:** Initial page loads for better performance and SEO potential
- **Progressive enhancement:** Core functionality works without JavaScript, enhanced with client-side interactivity

### Browser Support Matrix

**Primary Support (Desktop-First):**
- **Chrome/Edge:** Latest 2 versions (primary development target)
- **Firefox:** Latest 2 versions
- **Safari:** Latest 2 versions (macOS)
- **Minimum Resolution:** 1366x768 (optimized for 1920x1080)

**Secondary Support (Mobile-Responsive):**
- **iOS Safari:** 15+
- **Android Chrome:** 100+
- **Tablets:** iPad (Safari), Android tablets (Chrome)
- **Minimum Mobile Width:** 375px (iPhone SE)

**Not Supported:**
- Internet Explorer (deprecated)
- Legacy browsers without ES2020 support
- Browsers without WebAssembly support

**Browser Feature Requirements:**
- **Service Workers:** Required for PWA and offline mode
- **IndexedDB:** Required for offline data storage
- **Fullscreen API:** Required for Focus Mode
- **Picture-in-Picture API:** Required for floating timer
- **Page Visibility API:** Required for attention tracking
- **Notifications API:** Required for break reminders (optional, graceful degradation)
- **Web Audio API:** Required for ambient sounds (optional)

### Responsive Design Strategy

**Breakpoint System:**
```
Mobile: 375px - 767px (portrait phones)
Tablet: 768px - 1023px (tablets, landscape phones)
Desktop: 1024px+ (primary target)
Large Desktop: 1920px+ (optimized experience)
```

**Layout Adaptation:**
- **Desktop (1024px+):** 
  - Multi-column layouts (sidebar + main content + floating chat)
  - Full Kanban board with 3-4 columns visible
  - Calendar week view as default
  - Table view with all columns
  - Rich toolbar and quick actions

- **Tablet (768px-1023px):**
  - Collapsible sidebar
  - Kanban with 2-3 columns, horizontal scroll
  - Calendar optimized for tablet viewing
  - Table view with column hiding
  - Touch-optimized drag-and-drop

- **Mobile (375px-767px):**
  - Bottom navigation bar
  - Kanban single column, swipe between columns
  - Calendar day view default, swipe between days
  - Table view with minimal columns, tap to expand
  - Floating Action Button (FAB) for quick actions
  - Focus Mode optimized for small screens

**Component Responsiveness:**
- shadcn/ui components are responsive by default
- Custom components follow mobile-first CSS approach
- Touch targets minimum 44x44px (WCAG guidelines)
- Font scaling with viewport units for readability

### Performance Targets

**Page Load Performance:**
- **First Contentful Paint (FCP):** <1.5 seconds
- **Largest Contentful Paint (LCP):** <2.5 seconds (Core Web Vital)
- **Time to Interactive (TTI):** <3 seconds
- **First Input Delay (FID):** <100ms (Core Web Vital)
- **Cumulative Layout Shift (CLS):** <0.1 (Core Web Vital)

**Runtime Performance:**
- **Subsequent page navigation:** <500ms (client-side routing)
- **AI task extraction:** <5 seconds for 200-500 word notes
- **AI Chat first token:** <2 seconds (streaming)
- **Realtime sync latency:** <1 second across all views
- **Kanban drag-and-drop:** <100ms response time
- **Calendar re-render:** <1 second after task move
- **Table view load:** <1 second for 1000+ tasks (virtualized)
- **Focus Mode entry:** <500ms (fullscreen + PiP activation)

**Optimization Strategies:**
- **Code Splitting:** Route-based + component-based lazy loading
- **Image Optimization:** Next.js Image component with WebP format
- **Caching:** 
  - AI responses: 24-hour cache for similar queries
  - Task embeddings: Cache until content changes
  - Static assets: CDN caching via Vercel Edge Network
- **Virtual Scrolling:** react-virtual for lists >100 items
- **Debounced Operations:** Auto-save, search, filters (1 second delay)
- **Optimistic UI:** Immediate updates, background persistence
- **Edge Functions:** AI calls from Vercel Edge for low latency
- **Bundle Size:** <500KB initial JavaScript bundle (target)

**Performance Monitoring:**
- Vercel Analytics for Core Web Vitals
- Sentry for error tracking and performance monitoring
- PostHog for user interaction analytics (optional, user-controlled)

### SEO Strategy

**SEO Approach: Minimal (Personal Tool, Not Discovery-Driven)**

dumtasking is a **logged-in application** focused on personal productivity, not a public content site requiring organic search traffic. SEO is de-prioritized in MVP.

**Basic SEO Implementation:**
- **Meta Tags:** Title, description, Open Graph for link sharing
- **Structured Data:** None (not needed for app)
- **Sitemap:** Basic sitemap for authenticated routes
- **robots.txt:** Allow indexing of marketing/landing page only, disallow app routes

**Landing Page SEO (Optional Post-MVP):**
- If commercialized: Marketing landing page with SEO optimization
- Blog for content marketing (if needed)
- Documentation site (if public beta)

**Current Priority: Performance > SEO**
- Focus on app performance, not search rankings
- Target users come from word-of-mouth, direct links, communities

### Accessibility Level

**Target: WCAG 2.1 Level AA Compliance**

**Keyboard Navigation:**
- All interactive elements accessible via keyboard
- Logical tab order throughout application
- Focus indicators clearly visible (shadcn/ui default)
- Keyboard shortcuts for common actions:
  - `Ctrl/Cmd + K`: Open AI Chat
  - `Ctrl/Cmd + N`: New note
  - `Ctrl/Cmd + /`: Command palette
  - `Escape`: Close modals, exit Focus Mode
  - `Tab / Shift+Tab`: Navigate elements
  - `Space / Enter`: Activate buttons
  - Arrow keys: Navigate Kanban cards, Calendar dates

**Screen Reader Support:**
- Semantic HTML5 elements throughout
- ARIA labels for dynamic content
- ARIA live regions for realtime updates
- Alt text for all images/icons
- Descriptive link text (no "click here")

**Visual Accessibility:**
- Color contrast ratio: 4.5:1 minimum (WCAG AA)
- Priority color coding with additional indicators (not color-only)
- Text sizing: 16px base, scalable to 200% without breaking layout
- Focus indicators: 2px solid outline with high contrast
- Dark mode support (via shadcn/ui theming)

**Motion & Animation:**
- Respect `prefers-reduced-motion` media query
- Disable animations for users who prefer reduced motion
- Provide toggle in Settings for animation preferences

**Form Accessibility:**
- All form inputs have associated labels
- Error messages clearly linked to fields
- Required fields marked with ARIA required
- Form validation with clear error feedback

**Touch Target Size:**
- Minimum 44x44px for all interactive elements
- Adequate spacing between touch targets (8px minimum)

**Testing:**
- Automated accessibility testing with axe-core
- Manual testing with keyboard-only navigation
- Screen reader testing (NVDA on Windows, VoiceOver on macOS)

### Real-Time Capabilities

**Supabase Realtime Architecture:**

**Realtime Channels:**
- `notes` table: Subscribe to changes for note editor sync
- `tasks` table: Subscribe to changes for Kanban, Calendar, Table sync
- `chat_messages` table: Subscribe for AI Chat history sync

**Sync Strategy:**
- **Latency Target:** <1 second from action to all connected clients
- **Conflict Resolution:** Last-write-wins with timestamp, notify users of conflicts
- **Optimistic UI:** Local updates immediate, server confirmation background
- **Reconnection:** Automatic reconnect with exponential backoff
- **Offline Queue:** Changes queued locally when offline, synced on reconnect

**Realtime Use Cases:**
- **Cross-device sync:** User edits note on desktop → syncs to mobile instantly
- **View consistency:** Task moved on Kanban → Calendar updates automatically
- **AI Chat sync:** Messages persist across sessions and devices
- **Collaborative potential (future):** Foundation for multi-user features if needed

**Scalability:**
- Supabase Realtime supports 500+ concurrent connections per database
- Channels scoped per user (only subscribe to own data)
- Minimal bandwidth usage (only deltas transmitted)

### PWA Capabilities

**Progressive Web App Implementation:**

**Service Worker Features:**
- Offline note editing with sync queue
- Asset caching for fast load times
- Background sync for queued operations
- Push notifications for break reminders (optional)

**Installation:**
- Install prompt for desktop (Chrome, Edge)
- Add to Home Screen for mobile (iOS, Android)
- Standalone window mode (no browser chrome)
- App icon and splash screen

**Offline Mode:**
- Notes editor works fully offline
- Task list cached and viewable offline
- Modifications queued until online
- AI features require connection (graceful degradation)

**Manifest Configuration:**
```json
{
  "name": "dumtasking",
  "short_name": "dumtasking",
  "description": "AI-powered personal productivity companion",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#18181b",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Technology Stack Summary

**Frontend:**
- **Framework:** Next.js 16.1.3 (App Router, RSC, Server Actions)
- **Language:** TypeScript (strict mode)
- **UI Library:** React 19.2.3
- **UI Components:** shadcn/ui (mira style, zinc theme, lucide icons)
- **Styling:** Tailwind CSS 4
- **Rich Text:** Tiptap (extensible editor)
- **Drag-and-Drop:** dnd-kit (accessible, performant)
- **Calendar:** FullCalendar or custom (TBD during implementation)
- **Table:** TanStack Table v8 (virtualization support)
- **Virtual Scrolling:** react-virtual
- **Charts:** Recharts (for weekly review visualizations)

**Backend & Infrastructure:**
- **Database:** Supabase PostgreSQL
- **Authentication:** Supabase Auth (magic links)
- **Realtime:** Supabase Realtime (WebSocket)
- **Storage:** Supabase Storage (audio files, max 10MB)
- **Hosting:** Vercel (serverless, edge functions)
- **CDN:** Vercel Edge Network

**AI Services:**
- **LLM:** Vercel AI SDK v6+ with OpenRouter
- **Models:** Claude 3.7 Sonnet (primary), Gemini 2.0 Flash (cost-effective)
- **Embeddings:** OpenAI text-embedding-3-small (via OpenRouter)
- **Vector Search:** Supabase pgvector extension

**Development Tools:**
- **Package Manager:** Bun (fast, modern)
- **Linting:** ESLint 9
- **Formatting:** Prettier (integrated with ESLint)
- **Testing:** Vitest (unit), Playwright (E2E)
- **CI/CD:** GitHub Actions + Vercel auto-deploy

**Monitoring & Analytics:**
- **Error Tracking:** Sentry
- **Analytics:** PostHog (privacy-friendly, optional)
- **Performance:** Vercel Analytics

### Implementation Considerations

**Development Approach:**
- **Incremental feature delivery:** Follow 4-phase roadmap (Foundation → AI → Views → Execution)
- **Feature flags:** Use environment variables for gradual feature rollout
- **Database migrations:** Supabase migration files, version controlled
- **API versioning:** Not needed for personal tool, direct schema evolution acceptable

**Security Best Practices:**
- Row-level security policies on all Supabase tables
- Input validation with Zod schemas on both client and server
- CSRF protection via Next.js built-in mechanisms
- Rate limiting on AI endpoints (50 messages/hour, 100 API requests/min)
- API key encryption for BYOK feature (AES-256)
- HTTPS/TLS for all connections (Vercel default)

**Deployment Strategy:**
- **Environments:** Development (local), Preview (Vercel branches), Production (main)
- **Database:** Separate Supabase projects per environment
- **Secrets Management:** Vercel environment variables
- **Rollback:** Git revert + Vercel instant rollback
- **Zero-downtime:** Vercel handles automatically

**Browser API Feature Detection:**
- Fullscreen API: Graceful fallback to maximized window
- Picture-in-Picture: Fallback to regular timer display
- Notifications: Optional feature, works without
- Service Worker: Essential for PWA, show install prompt only if supported

**Performance Budget:**
- Initial JavaScript bundle: <500KB
- Total page weight: <2MB
- API response time: <200ms (p95)
- AI response time: <5 seconds (task extraction)
- Realtime sync: <1 second latency

---

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach: Full-Feature Personal Validation**

dumtasking MVP is a **complete, production-ready application** designed for personal use validation, not a minimal proof-of-concept. This approach serves three strategic objectives:

1. **Personal Productivity Solution:** Full feature set to solve mthangtr's real workflow needs (not a toy)
2. **Coding Agent Capability Test:** Validates AI-assisted development with substantial, real-world scope
3. **Portfolio Showcase:** Demonstrates full-stack + AI integration expertise with production-quality code

**Strategy:** Build complete → Validate personally (3 months) → Refine → Optionally expand

This approach prioritizes personal value and learning over premature market testing.

**Resource Requirements:**
- **Team Size:** Solo developer (mthangtr)
- **Timeline:** 12-14 weeks development + 3 months personal validation
- **Skills Required:** 
  - Full-stack development (Next.js, React, TypeScript)
  - Database design (PostgreSQL, Supabase)
  - AI integration (Vercel AI SDK, LLM APIs)
  - UI/UX implementation (shadcn/ui, Tailwind)
  - Realtime systems (Supabase Realtime, WebSockets)
- **Infrastructure:** Vercel (hosting), Supabase (database/auth), OpenRouter (AI)
- **Budget:** <$50/month operating costs during personal validation

### MVP Feature Set (Phase 1: Weeks 1-12)

**Core User Journeys Supported:**

All 5 user journeys from Journey Mapping section are supported in MVP:
1. ✅ First-Time User - From Chaos to Clarity (onboarding)
2. ✅ Daily Workflow - Multi-Goal Balance (daily execution)
3. ✅ Evening Motivation Drop - Compassionate Accountability (emotional support)
4. ✅ Weekly Review - Growth Through Reflection (insights)
5. ✅ Edge Case - Recovery from Abandonment (re-engagement)

**Must-Have Capabilities (All 20 Features Included):**

The MVP includes all features necessary to solve the multi-goal orchestration problem comprehensively. Features are prioritized by dependency logic for incremental development:

**Phase 1: Foundation Layer (Weeks 1-3)**
1. ✅ User Authentication & Profile Setup
2. ✅ Database Schema & Architecture
3. ✅ Rich Text Note Storage & Editor
4. ✅ Settings & Customization

**Phase 2: AI Intelligence Layer (Weeks 4-6)**
5. ✅ AI Agents Task Extraction & Orchestration
6. ✅ AI Chat Assistant (Conversational Task Manager)
7. ✅ Smart Daily Suggestions (Morning Dashboard)

**Phase 3: Views & Interactions Layer (Weeks 7-9)**
8. ✅ Realtime Sync Across Views (implemented first - all views depend on this)
9. ✅ Realtime Kanban Board
10. ✅ AI-Powered Calendar View
11. ✅ Table/Database View (All Tasks Hub)

**Phase 4: Advanced AI & Execution (Weeks 10-12)**
12. ✅ Knowledge Graph / Related Tasks
13. ✅ Defend Focus Time / Protected Slots
14. ✅ Focus Mode / Blitz Mode (Execution Layer)
15. ✅ Compassionate Accountability Layer
16. ✅ Weekly AI Review (Retrospective & Planning)
17. ✅ Time Tracking (Optional, Background)

**Phase 5: Polish & Production Readiness (Weeks 13-14)**
18. ✅ UI/UX Polish
19. ✅ Performance Optimization
20. ✅ PWA Setup (Offline Mode)

**Why Full-Feature MVP:**
- **Personal need:** All features required to solve real orchestration problem
- **No premature optimization:** Build what's needed, validate with real use
- **Portfolio value:** Demonstrates comprehensive full-stack + AI capabilities
- **Coding agent test:** Validates AI-assisted development at meaningful scale

### Post-MVP Features (Phase 2: Months 4-6)

**Deferred to Post-Personal Validation:**

Features explicitly excluded from MVP to maintain focus on core orchestration problem:

**Code Quality & Refinement:**
- Comprehensive test coverage (70%+ unit, full E2E for core flows)
- Technical documentation (architecture, API, components)
- Code refactoring and technical debt reduction
- Security audit and penetration testing
- Performance profiling and optimization beyond targets
- Accessibility audit with real users

**Optional Enhancements:**
- Visual graph view (network diagram for task dependencies)
- Advanced analytics dashboard (beyond weekly review insights)
- Custom dashboards and widgets
- Advanced filtering and saved views
- Keyboard shortcuts customization
- Custom themes beyond dark/light

**Integration & Export:**
- CSV/JSON export with custom field selection
- PDF report generation for weekly/monthly reviews
- iCal export for calendar sync (read-only)
- API documentation for potential future integrations

### Long-Term Vision (Phase 3: Month 7+, If Commercialized)

**Expansion Features (Only if Phase 1 & 2 Validation Successful):**

**Multi-User & Collaboration (Not Personal-First):**
- Team workspaces and task sharing
- Real-time co-editing of notes
- Project collaboration features
- Permission systems and access control
- Activity feeds and notifications

**Advanced Input Methods:**
- Voice input and speech-to-text
- Image/PDF OCR for note capture
- Meeting notes recording and transcription
- Email-to-note capture
- Browser extension for quick capture

**External Integrations:**
- Two-way calendar sync (Google Calendar, Outlook)
- Project management tool integrations (Jira, Asana, Trello)
- Communication tool integrations (Slack, Teams)
- Zapier/Make.com API for custom automation
- Meeting notes templates and recording

**Platform Expansion:**
- Mobile native apps (React Native for iOS/Android)
- Desktop native apps (Electron for Windows/Mac/Linux)
- Apple Watch / Android Wear complications
- Smart home integrations (voice assistants)

**Advanced AI Features:**
- Custom LLM fine-tuning on user's personal data
- Predictive task estimation (learn from history)
- Auto-generated task descriptions from context
- Voice-based AI interaction
- Advanced pattern recognition and productivity coaching

**Monetization & Commercial Features:**
- Payment processing and subscription management
- Usage-based pricing tiers
- Team billing and invoicing
- White-label options for enterprises
- Affiliate and referral programs

**Expansion Threshold:**
- Only pursue if Phase 1 & 2 objectives fully met
- Minimum 100+ unprompted requests for access
- Validated: "This is different from Motion/Todoist/Reclaim"
- Sustainable business model proven at small scale

### Scope Boundaries - Explicitly Out of Scope

**Never Planned (Contradicts Core Philosophy):**
- ❌ Gamification and achievement badges (productivity is not a game)
- ❌ Social features and public profiles (personal-first tool)
- ❌ Time tracking with productivity scoring (creates guilt, not growth)
- ❌ Leaderboards or competitive elements (contradicts compassionate accountability)
- ❌ Always-on surveillance or excessive tracking (respects user agency)

**Out of Scope for MVP (Too Complex, Low ROI):**
- ❌ Custom workflow automation (IFTTT-style rules)
- ❌ Advanced dependency graphs (visual network diagrams)
- ❌ Multi-language support beyond English (Vietnamese quotes OK)
- ❌ Offline AI (too complex, requires on-device LLM)
- ❌ Custom LLM fine-tuning (rely on OpenRouter's best models)
- ❌ Meeting notes templates (not core orchestration problem)

### Risk Mitigation Strategy

**Technical Risks:**

**Risk 1: AI Reliability (<90% Accuracy)**
- **Mitigation:** Zod schemas for structured output, preview before committing
- **Fallback:** Manual task entry and editing always available
- **Validation:** Track extraction accuracy during personal use, iterate prompts
- **Contingency:** If <70% accuracy, add more manual controls and reduce AI automation

**Risk 2: Realtime Sync Complexity**
- **Mitigation:** Start with Supabase Realtime (proven solution), optimistic UI
- **Fallback:** Polling fallback if WebSocket connection fails
- **Validation:** Test on multiple devices, monitor sync latency
- **Contingency:** Manual refresh button if realtime fails consistently

**Risk 3: Performance at Scale (>1000 Tasks)**
- **Mitigation:** Virtual scrolling, pagination, indexed queries
- **Fallback:** Pagination with server-side filtering
- **Validation:** Performance testing with synthetic data
- **Contingency:** Archive old tasks if database grows too large

**Risk 4: Browser API Support (Fullscreen, PiP)**
- **Mitigation:** Feature detection, graceful degradation
- **Fallback:** Maximized window instead of fullscreen, regular timer instead of PiP
- **Validation:** Test on all target browsers before launch
- **Contingency:** Focus Mode works without advanced browser APIs

**Market Risks:**

**Risk 1: "Vibe Tasking" Philosophy Doesn't Resonate**
- **Mitigation:** Clear value demonstration in first 5 minutes (aha moment)
- **Fallback:** Frame as "AI task manager" if philosophy too abstract
- **Validation:** 3-month personal use + 10 beta users feedback
- **Contingency:** Pivot messaging to concrete features vs philosophy

**Risk 2: Users Don't Trust AI Orchestration**
- **Mitigation:** Always show AI reasoning, allow manual override
- **Fallback:** More manual controls, AI as assistant not orchestrator
- **Validation:** AI plan acceptance rate (target 70%+)
- **Contingency:** Hybrid mode where AI suggests, user approves all changes

**Risk 3: Compassionate Accountability Feels Patronizing**
- **Mitigation:** Make philosophical quotes optional (toggle in settings)
- **Fallback:** Simple compassionate text without deep philosophy
- **Validation:** User engagement with reflection prompts
- **Contingency:** Remove quotes if <30% engagement rate

**Resource Risks:**

**Risk 1: Development Takes Longer Than 14 Weeks**
- **Mitigation:** Dependency-optimized feature order, incremental delivery
- **Fallback:** Cut Time Tracking (Feature 17) and PWA (Feature 20) if needed
- **Validation:** Weekly progress tracking against roadmap
- **Contingency:** Extend timeline to 16-18 weeks, defer polish phase

**Risk 2: Operating Costs Exceed $50/Month**
- **Mitigation:** AI response caching, rate limiting, Vercel/Supabase free tiers
- **Fallback:** More aggressive caching, reduce AI calls
- **Validation:** Monitor costs weekly during development
- **Contingency:** Require BYOK for OpenRouter if costs too high

**Risk 3: Solo Developer Burnout**
- **Mitigation:** Realistic timeline (14 weeks, not 4 weeks), full-feature approach
- **Fallback:** Take breaks, extend timeline if needed
- **Validation:** Track hours worked, maintain work-life balance
- **Contingency:** Reduce scope if burnout imminent (cut Features 16-17, defer 19-20)

### MVP Success Criteria (3-Month Checkpoint)

**Go/No-Go Decision Framework:**

After 3 months of personal use, evaluate against 18 success criteria:

**Primary Success Metrics (Must achieve 14+ to GO):**
1. Multi-Goal Consistency: No goal <10% attention for >2 weeks
2. Task Completion Rate: 70%+ sustained
3. Adaptive Re-Organization: 80%+ urgent tasks handled without derailing goals
4. Daily Engagement: 5+ days/week for 10+ consecutive weeks
5. Focus Mode Adoption: 3+ sessions/week, 85%+ completion
6. AI Trust: 70%+ plans accepted with minor/no edits
7. Goal Distribution Balance: Actual within ±10% of intended
8. Insight Engagement: 70%+ reviews read within 48h, 50%+ action
9. Compassionate Accountability: Evening drops handled without guilt
10. System Reliability: 99.5%+ uptime
11. Performance: 95%+ actions <2 seconds
12. Cost Efficiency: <$50/month
13. Japanese N3 Progress: 15min daily maintained (no 2-month gaps)
14. Workflow Replacement: Old workflow feels painful
15. "Can't Go Back" Test: Can't imagine returning to old workflow
16. Developer Joy: Building/using is energizing, not draining
17. Portfolio Value: Code quality demonstrable
18. Self-Reported Impact: "dumtasking solved my orchestration problem"

**Decision Thresholds:**
- ✅ **GO (14+ met):** Continue to beta expansion, refine product
- 🟡 **PIVOT (8-13 met):** Identify what's not working, iterate heavily
- ❌ **STOP (<8 met):** Core assumptions wrong, fundamental rethink required

**Ultimate Test:** "Would I pay $20/month for this if someone else built it?"

**North Star Metric:** "Multi-goal individuals consistently make progress on all major life goals without neglect, overwhelm, or burnout."

---

## Functional Requirements

*This section defines THE CAPABILITY CONTRACT for the entire product. Every feature must trace back to these requirements.*

### Note Management & Capture

- **FR1:** Users can create notes with rich text formatting
- **FR2:** Users can edit existing notes with automatic saving
- **FR3:** Users can organize notes with search and filtering capabilities
- **FR4:** Users can paste content from external sources into notes
- **FR5:** Users can view character and word counts for notes
- **FR6:** Users can access notes across multiple devices with synchronized state

### AI-Powered Task Extraction & Orchestration

- **FR7:** Users can trigger AI analysis of notes to extract actionable tasks
- **FR8:** Users can review AI-extracted tasks before committing them to the system
- **FR9:** AI can identify task priorities based on note content and keywords
- **FR10:** AI can estimate time requirements for extracted tasks
- **FR11:** AI can detect dependencies between tasks
- **FR12:** AI can suggest optimal scheduling dates based on workload and priorities
- **FR13:** AI can balance workload distribution across multiple life goals
- **FR14:** AI can preserve context by linking tasks back to source notes
- **FR15:** AI can break down large tasks into subtasks

### AI Chat & Conversational Interface

- **FR16:** Users can interact with an AI assistant through natural language conversation
- **FR17:** Users can execute quick commands for common task management operations
- **FR18:** Users can ask AI to explain scheduling decisions and task priorities
- **FR19:** Users can request AI to reorganize schedules based on changing priorities
- **FR20:** Users can query for specific tasks or task-related information
- **FR21:** AI can proactively suggest actions based on task states and patterns
- **FR22:** AI chat can access full context including notes, tasks, calendar, and user preferences

### Task Visualization & Management

- **FR23:** Users can view tasks in a Kanban board layout with customizable columns
- **FR24:** Users can drag and drop tasks to change their status or priority
- **FR25:** Users can view tasks in a calendar layout with time block visualization
- **FR26:** Users can manually reschedule tasks by dragging them to different dates
- **FR27:** Users can view all tasks in a sortable and filterable table format
- **FR28:** Users can perform bulk operations on multiple selected tasks
- **FR29:** Users can edit task properties inline within any view
- **FR30:** Users can filter tasks by status, priority, date range, tags, and dependencies
- **FR31:** Users can save custom filter combinations for quick access
- **FR32:** Users can export task data in standard formats

### Smart Daily Planning

- **FR33:** Users can see AI-curated daily task recommendations upon app launch
- **FR34:** Users can view quick insights about overdue, blocked, and completed tasks
- **FR35:** Users can start suggested tasks with one-click action
- **FR36:** AI can provide adaptive suggestions based on time of day and available hours
- **FR37:** AI can identify and surface "quick win" tasks for motivation

### Multi-Goal Orchestration

- **FR38:** Users can define multiple life goals with target time allocations
- **FR39:** Users can view goal distribution analytics showing actual vs intended balance
- **FR40:** Users can receive alerts when goals are being neglected
- **FR41:** AI can automatically rebalance task schedules to maintain goal distribution
- **FR42:** Users can adjust goal priorities through conversational interface with AI

### Focus Mode & Execution Support

- **FR43:** Users can enter a distraction-free focus mode for task execution
- **FR44:** Users can utilize an integrated Pomodoro timer during focus sessions
- **FR45:** Users can access a floating timer that persists across applications
- **FR46:** Users can play ambient sounds during focus sessions
- **FR47:** Users can track focus session duration and completion status
- **FR48:** Users can see celebration feedback upon task completion

### Protected Time & Scheduling Intelligence

- **FR49:** Users can define protected time slots for specific activities
- **FR50:** AI respects protected slots when auto-scheduling tasks
- **FR51:** AI can automatically schedule break times based on work duration
- **FR52:** Users can configure working hours and energy level preferences
- **FR53:** AI can optimize task placement based on complexity and energy patterns
- **FR54:** Users can visualize workload density across their calendar

### Knowledge Graph & Task Connections

- **FR55:** System can automatically detect relationships between tasks
- **FR56:** Users can view related tasks based on semantic similarity
- **FR57:** Users can see dependency chains showing task blockers
- **FR58:** AI can suggest potential dependencies when creating tasks
- **FR59:** Users can view all tasks originating from the same note

### Behavioral Learning & Insights

- **FR60:** System can track task completion patterns and skip behaviors
- **FR61:** System can identify user's most productive times and energy patterns
- **FR62:** System can learn scheduling preferences from user behavior
- **FR63:** Users can receive weekly AI-generated performance reviews
- **FR64:** Users can view completion rates, goal distribution, and pattern insights
- **FR65:** Users can interact with insights through conversational AI refinement

### Compassionate Accountability

- **FR66:** Users can defer, reschedule, or cancel tasks with non-judgmental options
- **FR67:** Users can view philosophical quotes for personal reflection
- **FR68:** Users can add "why is this important" motivations to tasks
- **FR69:** Users can receive compassionate suggestions based on behavioral patterns
- **FR70:** System logs behavioral patterns without guilt-inducing language

### Time Tracking (Optional)

- **FR71:** Users can optionally enable automatic time tracking for tasks
- **FR72:** Users can compare estimated time vs actual time spent
- **FR73:** AI can learn from time tracking data to improve future estimates
- **FR74:** Users can manually adjust tracked time when needed
- **FR75:** Users can view time tracking insights in weekly reviews

### Realtime Synchronization

- **FR76:** Changes to notes and tasks propagate to all connected devices in real-time
- **FR77:** System can handle simultaneous edits with conflict resolution
- **FR78:** System provides visual feedback when synchronization occurs
- **FR79:** System queues changes when offline and syncs upon reconnection

### User Configuration & Preferences

- **FR80:** Users can configure profile information including timezone and working hours
- **FR81:** Users can select preferred AI models for task processing
- **FR82:** Users can provide custom API keys for AI services
- **FR83:** Users can customize Pomodoro timer intervals
- **FR84:** Users can toggle features like time tracking and analytics
- **FR85:** Users can adjust UI preferences including theme and density
- **FR86:** Users can control accessibility settings including motion preferences

### Authentication & Security

- **FR87:** Users can authenticate via email-based magic links
- **FR88:** Users can manage active sessions across devices
- **FR89:** System enforces row-level security for all user data
- **FR90:** System encrypts user-provided API keys
- **FR91:** Users can rate-limit their own AI usage to control costs

### Data Management & Privacy

- **FR92:** Users can export all their data in standard formats
- **FR93:** Users can delete their account and all associated data
- **FR94:** Users can control analytics and tracking preferences
- **FR95:** System respects user privacy preferences throughout all features

### PWA & Offline Capabilities

- **FR96:** Users can install the application as a Progressive Web App
- **FR97:** Users can edit notes while offline with queued synchronization
- **FR98:** Users can view cached tasks and calendar data while offline
- **FR99:** System gracefully degrades AI features when offline

---

## Non-Functional Requirements

*These requirements specify HOW WELL the system must perform. Only relevant quality attributes for dumtasking are documented below.*

### Performance

**Response Time Requirements:**
- **NFR-P1:** User-facing actions must complete within 2 seconds for 95th percentile
- **NFR-P2:** Initial page load (First Contentful Paint) must occur within 1.5 seconds
- **NFR-P3:** Largest Contentful Paint must occur within 2.5 seconds (Core Web Vital)
- **NFR-P4:** First Input Delay must be under 100ms (Core Web Vital)
- **NFR-P5:** Cumulative Layout Shift must be under 0.1 (Core Web Vital)
- **NFR-P6:** Client-side page navigation must complete within 500ms

**AI Operation Performance:**
- **NFR-P7:** AI task extraction must complete within 5 seconds for typical notes (200-500 words)
- **NFR-P8:** AI Chat first token must stream within 2 seconds of request
- **NFR-P9:** AI Chat complete response must stream within 10 seconds
- **NFR-P10:** Daily suggestions generation must complete within 3 seconds
- **NFR-P11:** Calendar auto-balance operation must complete within 3 seconds for full week

**Realtime Synchronization Performance:**
- **NFR-P12:** Realtime sync latency must be under 1 second across all views
- **NFR-P13:** Conflict resolution must complete within 2 seconds
- **NFR-P14:** Optimistic UI updates must provide immediate (0ms perceived) feedback

**View-Specific Performance:**
- **NFR-P15:** Kanban drag-and-drop response time must be under 100ms
- **NFR-P16:** Calendar re-render after task move must complete within 1 second
- **NFR-P17:** Table view must load within 1 second for 1000+ tasks using virtualization
- **NFR-P18:** Focus Mode entry must complete within 500ms (fullscreen + PiP activation)

**Bundle Size:**
- **NFR-P19:** Initial JavaScript bundle size must be under 500KB
- **NFR-P20:** Total page weight must be under 2MB

### Security

**Authentication & Authorization:**
- **NFR-S1:** System must enforce authentication via Supabase Auth with magic links
- **NFR-S2:** System must implement row-level security policies on all database tables
- **NFR-S3:** System must prevent unauthorized access to user data across all API endpoints
- **NFR-S4:** System must validate user sessions on every protected request

**Data Protection:**
- **NFR-S5:** All data must be encrypted at rest (Supabase default AES-256)
- **NFR-S6:** All data transmission must be encrypted in transit (HTTPS/TLS 1.3+)
- **NFR-S7:** User-provided API keys must be encrypted in database using AES-256
- **NFR-S8:** System must never log or expose sensitive credentials in error messages

**Rate Limiting & Abuse Prevention:**
- **NFR-S9:** System must enforce rate limit of 50 AI Chat messages per hour per user
- **NFR-S10:** System must enforce rate limit of 100 API requests per minute per user
- **NFR-S11:** System must enforce rate limit of 20 task extraction operations per hour per user
- **NFR-S12:** System must implement CSRF protection on all state-changing operations

**Input Validation:**
- **NFR-S13:** System must validate all user inputs using Zod schemas on both client and server
- **NFR-S14:** System must sanitize all user-generated content before rendering
- **NFR-S15:** System must prevent SQL injection through parameterized queries only

**Privacy:**
- **NFR-S16:** System must comply with GDPR requirements for data export and deletion
- **NFR-S17:** System must respect user analytics preferences (opt-in/opt-out)
- **NFR-S18:** System must never share user data with third parties without explicit consent

### Reliability & Availability

**Uptime Requirements:**
- **NFR-R1:** System must maintain 99.5%+ uptime excluding scheduled maintenance
- **NFR-R2:** Database must provide 99.99% data durability guarantee (Supabase SLA)
- **NFR-R3:** Error rate must be below 0.5% of all user actions
- **NFR-R4:** System must automatically retry failed operations with exponential backoff (max 3 retries)

**Data Integrity:**
- **NFR-R5:** System must ensure eventual consistency for realtime sync within 1 second
- **NFR-R6:** System must detect and resolve conflicts using last-write-wins with timestamp
- **NFR-R7:** System must notify users of data conflicts when resolution occurs
- **NFR-R8:** System must preserve data integrity during concurrent edit scenarios

**Recovery & Resilience:**
- **NFR-R9:** System must resume interrupted Focus Mode sessions if crash occurs within 5 minutes
- **NFR-R10:** System must queue operations locally when offline and sync upon reconnection
- **NFR-R11:** System must gracefully degrade AI features when offline without blocking core functionality
- **NFR-R12:** System must provide automatic retry for failed API calls with exponential backoff

**Error Handling:**
- **NFR-R13:** System must provide clear, actionable error messages to users
- **NFR-R14:** System must log all errors to monitoring system (Sentry) for investigation
- **NFR-R15:** System must never expose internal system details in user-facing errors

### Scalability

**User Growth Support:**
- **NFR-SC1:** System must support initial scale of 1 user (personal validation phase)
- **NFR-SC2:** System must scale to 10 users within Supabase free tier limits
- **NFR-SC3:** System must support 100-1000 users with Supabase Pro tier ($25/month)
- **NFR-SC4:** Database queries must use proper indexes to maintain <50ms query time at scale

**Cost Efficiency:**
- **NFR-SC5:** System must maintain operating costs under $50/month for personal use (1 user)
- **NFR-SC6:** System must maintain operating costs under $15/user/month if scaled to 100+ users
- **NFR-SC7:** System must implement AI response caching (24-hour TTL) to reduce API costs
- **NFR-SC8:** System must implement task embedding caching (regenerate only on content changes)
- **NFR-SC9:** System must implement weekly review caching (no regeneration on re-opens)

**Data Management:**
- **NFR-SC10:** System must support virtual scrolling for lists exceeding 100 items
- **NFR-SC11:** System must support pagination or archival for tasks exceeding 10,000 per user
- **NFR-SC12:** Database must maintain indexed queries under 50ms for all frequent operations

**Infrastructure Limits:**
- **NFR-SC13:** System must operate within Vercel Hobby tier limits for personal use
- **NFR-SC14:** System must operate within Supabase free tier (500MB storage, 2GB bandwidth) for initial phase
- **NFR-SC15:** System must gracefully handle exceeding tier limits with clear upgrade prompts

### Accessibility

**WCAG 2.1 Level AA Compliance:**
- **NFR-A1:** System must provide keyboard navigation for all interactive elements
- **NFR-A2:** System must maintain logical tab order throughout application
- **NFR-A3:** System must provide clearly visible focus indicators (2px solid outline, high contrast)
- **NFR-A4:** System must support common keyboard shortcuts (Ctrl/Cmd+K, Ctrl/Cmd+N, Escape, etc.)

**Screen Reader Support:**
- **NFR-A5:** System must use semantic HTML5 elements throughout
- **NFR-A6:** System must provide ARIA labels for all dynamic content
- **NFR-A7:** System must implement ARIA live regions for realtime updates
- **NFR-A8:** System must provide alt text for all images and icons
- **NFR-A9:** System must use descriptive link text (avoid "click here")

**Visual Accessibility:**
- **NFR-A10:** System must maintain color contrast ratio of 4.5:1 minimum (WCAG AA)
- **NFR-A11:** System must provide additional indicators beyond color for priority coding
- **NFR-A12:** System must support text scaling up to 200% without layout breaking
- **NFR-A13:** System must provide dark mode support via shadcn/ui theming

**Motion & Animation:**
- **NFR-A14:** System must respect prefers-reduced-motion media query
- **NFR-A15:** System must disable animations for users who prefer reduced motion
- **NFR-A16:** System must provide Settings toggle for animation preferences

**Touch Accessibility:**
- **NFR-A17:** System must provide minimum 44x44px touch targets for all interactive elements
- **NFR-A18:** System must maintain minimum 8px spacing between adjacent touch targets

**Form Accessibility:**
- **NFR-A19:** All form inputs must have associated labels (visible or ARIA)
- **NFR-A20:** Error messages must be clearly linked to their respective form fields
- **NFR-A21:** Required fields must be marked with ARIA required attribute
- **NFR-A22:** Form validation errors must provide clear, actionable feedback

### Usability

**Learnability:**
- **NFR-U1:** First-time users must achieve "aha moment" (AI orchestration understanding) within 5 minutes
- **NFR-U2:** System must provide contextual help and tooltips for key features
- **NFR-U3:** System must use consistent UI patterns across all views (shadcn/ui components)
- **NFR-U4:** System must provide clear visual feedback for all user actions

**Efficiency:**
- **NFR-U5:** Frequent actions must be accessible within 2 clicks or keystrokes
- **NFR-U6:** System must support auto-save with 2-second debounce (no manual save needed)
- **NFR-U7:** System must support inline editing to minimize modal transitions
- **NFR-U8:** System must support bulk operations to reduce repetitive actions

**Error Prevention:**
- **NFR-U9:** System must require confirmation for destructive actions (delete all tasks, account deletion)
- **NFR-U10:** System must provide undo capability for critical operations
- **NFR-U11:** System must warn users before AI operations that consume significant credits
- **NFR-U12:** System must prevent circular task dependencies with validation and warnings

**Satisfaction:**
- **NFR-U13:** System must provide celebration feedback (animations, sounds) for task completions
- **NFR-U14:** System must use compassionate, non-judgmental language throughout
- **NFR-U15:** System must respect user agency (all AI suggestions can be overridden)
- **NFR-U16:** System must maintain consistent visual aesthetic (shadcn/ui mira style, zinc theme)

### Browser Compatibility

**Primary Browser Support (Desktop):**
- **NFR-B1:** System must fully support Chrome/Edge latest 2 versions
- **NFR-B2:** System must fully support Firefox latest 2 versions
- **NFR-B3:** System must fully support Safari latest 2 versions (macOS)
- **NFR-B4:** System must be optimized for 1920x1080 and 1366x768 resolutions

**Secondary Browser Support (Mobile):**
- **NFR-B5:** System must support iOS Safari 15+
- **NFR-B6:** System must support Android Chrome 100+
- **NFR-B7:** System must support tablets (iPad Safari, Android tablets Chrome)
- **NFR-B8:** System must support minimum mobile width of 375px (iPhone SE)

**Browser Feature Requirements:**
- **NFR-B9:** System requires Service Workers for PWA and offline mode
- **NFR-B10:** System requires IndexedDB for offline data storage
- **NFR-B11:** System requires Fullscreen API for Focus Mode (graceful fallback to maximized window)
- **NFR-B12:** System requires Picture-in-Picture API for floating timer (graceful fallback to regular timer)
- **NFR-B13:** System requires Page Visibility API for attention tracking
- **NFR-B14:** System requires Notifications API for break reminders (optional, graceful degradation)
- **NFR-B15:** System requires Web Audio API for ambient sounds (optional feature)

**Not Supported:**
- **NFR-B16:** System explicitly does not support Internet Explorer (deprecated)
- **NFR-B17:** System explicitly does not support browsers without ES2020 support
- **NFR-B18:** System explicitly does not support browsers without WebAssembly support

### Offline Capabilities

**PWA Requirements:**
- **NFR-O1:** System must provide installable Progressive Web App for desktop and mobile
- **NFR-O2:** System must support offline note editing with local queuing
- **NFR-O3:** System must cache task list and calendar data for offline viewing
- **NFR-O4:** System must queue all changes locally when offline and sync upon reconnection
- **NFR-O5:** System must provide clear offline/online status indicators
- **NFR-O6:** System must gracefully disable AI features when offline (require connection)

**Service Worker:**
- **NFR-O7:** System must implement service worker for asset caching
- **NFR-O8:** System must implement background sync for queued operations
- **NFR-O9:** System must provide install prompt for supported browsers
- **NFR-O10:** System must support standalone window mode (no browser chrome)

### Monitoring & Observability

**Performance Monitoring:**
- **NFR-M1:** System must track Core Web Vitals via Vercel Analytics
- **NFR-M2:** System must monitor API response times and error rates
- **NFR-M3:** System must monitor realtime sync latency and failure rates
- **NFR-M4:** System must alert on performance degradation (>20% slower than targets)

**Error Tracking:**
- **NFR-M5:** System must log all errors to Sentry for investigation
- **NFR-M6:** System must track error patterns and frequency
- **NFR-M7:** System must provide error context (user actions, browser info, timestamps)
- **NFR-M8:** System must alert on error rate spikes (>1% of requests)

**Analytics (Optional, User-Controlled):**
- **NFR-M9:** System must support PostHog for user interaction analytics (opt-in)
- **NFR-M10:** System must track feature adoption rates (Kanban, Calendar, Table, Focus Mode)
- **NFR-M11:** System must track AI plan acceptance rates
- **NFR-M12:** System must respect user privacy preferences for analytics (toggle in Settings)

