---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7]
inputDocuments:
  - "_bmad-output/planning-artifacts/product-brief-dumtasking-2026-01-17.md"
  - "_bmad-output/planning-artifacts/prd.md"
  - "docs/brainstorm.md"
designPhilosophy:
  style: "modern minimalist"
  inspiration: "Vercel, shadcn, Supabase"
  principles:
    - "Clean and ghost-like"
    - "Minimal noise, maximum clarity"
    - "Users understand intuitively without excessive text"
    - "Focus on cleanliness"
techStack:
  framework: "Next.js 16.1.3"
  uiLibrary: "shadcn/ui"
  preset:
    style: "mira"
    baseColor: "zinc"
    theme: "zinc"
    iconLibrary: "lucide"
    font: "inter"
    menuAccent: "subtle"
    menuColor: "default"
    radius: "default"
---

# UX Design Specification dumtasking

**Author:** mthangtr
**Date:** 2026-01-17

---

## Design Philosophy

### Core Design Vision

**Modern Minimalist Design** - Inspired by Vercel, shadcn, and Supabase aesthetics.

**Key Principles:**
- **Clean & Ghost-like:** Interfaces that feel effortless and invisible
- **Minimal Noise:** Remove unnecessary elements, focus on what matters
- **Intuitive Clarity:** Users understand functionality without excessive text or labels
- **Cleanliness First:** Every pixel serves a purpose, whitespace is intentional

**Not Extreme Minimal:** 
- We embrace minimalism but maintain warmth and usability
- Subtle animations and micro-interactions enhance understanding
- Color and contrast guide attention without overwhelming
- Typography hierarchy communicates structure naturally

### Technical Foundation

**shadcn/ui Configuration:**
```bash
bunx --bun shadcn@latest create --preset "https://ui.shadcn.com/init?base=base&style=mira&baseColor=zinc&theme=zinc&iconLibrary=lucide&font=inter&menuAccent=subtle&menuColor=default&radius=default&template=next" --template next
```

**Design System:**
- **Style:** mira (subtle, refined)
- **Base Color:** zinc (neutral, professional)
- **Theme:** zinc (consistent monochrome palette)
- **Icons:** lucide (clean, minimal line icons)
- **Typography:** Inter (modern, readable)
- **Menu Style:** subtle accents, default colors
- **Radius:** default (balanced rounded corners)

---

## Executive Summary

### Project Vision

**dumtasking** is an AI-powered personal productivity companion that transforms chaotic notes into balanced, actionable task orchestration through conversational AI and compassionate accountability. Built on the "Vibe Tasking" philosophy—where AI handles planning overhead so users focus on execution and growth—dumtasking solves the critical gap: "Planning works, but planning friction kills the habit."

**Core Innovation:** Zero-friction planning (dump notes → instant AI plan) + integrated execution (Focus Mode) + philosophical insights (compassionate accountability) = sustainable productivity without guilt or burnout.

**Design Philosophy:** Modern minimalist aesthetic inspired by Vercel, shadcn, and Supabase—clean, ghost-like interfaces where every pixel serves a purpose, users understand functionality intuitively, and cleanliness enables focus.

### Target Users

**Primary User: Multi-Goal Individuals**

dumtasking is designed for people managing 2-5 major life goals simultaneously—developers building startups while learning new skills, career switchers balancing current jobs with future aspirations, indie hackers juggling multiple projects.

**Key User Characteristics:**
- High ambition with limited time and energy
- Experience "goal neglect" (focus on one goal causes others to disappear for weeks/months)
- Capable of self-discipline but overwhelmed by orchestration complexity
- Prefer AI assistance integrated seamlessly, not bolt-on features
- Web-first workflow (productivity tools are part of daily work ritual like email)

**Primary Persona - mthangtr (Multi-Goal Builder):**
- 25, Fresher Developer + Startup Founder + Japanese N3 Learner
- Pain: "Focus vào 1 cái thì bỏ qua 2 cái" → 2 months neglecting Japanese when focused on startup
- Need: AI orchestrator that balances all 3 goals automatically without manual planning
- Success: No goal neglected >2 weeks, consistent 15min daily Japanese despite being lowest priority

**User Journey Critical Moments:**
1. **Aha Moment (Morning):** "Wow, it balanced all my goals automatically—I don't have to think about orchestration!"
2. **Relief Moment (Evening):** Compassionate options when motivation drops, no guilt spirals
3. **Empowerment Moment (Weekly Review):** "I finally have a companion that understands I'm not one person with one goal"

### Key Design Challenges

**1. Complexity vs. Simplicity Balance**
- **Challenge:** 20 features in MVP (Notes, AI Extraction, 3 views, Focus Mode, Chat, etc.) risk overwhelming users despite minimalist aesthetic
- **UX Approach:** Progressive disclosure—show essential features first, reveal advanced capabilities contextually as users engage deeper
- **Design Strategy:** Clean dashboard with clear information hierarchy, subtle feature discovery through AI suggestions

**2. AI Trust & Transparency**
- **Challenge:** Users must trust AI orchestration (target: 70%+ acceptance of AI-generated plans)
- **UX Approach:** Always show AI reasoning ("Why is this task scheduled here?"), enable manual override on all suggestions
- **Design Strategy:** Preview modals before committing AI changes, clear visual indicators of AI-generated vs user-created content

**3. Multi-View Mental Model Consistency**
- **Challenge:** Kanban / Calendar / Table / Focus Mode must feel like one coherent system, not fragmented tools
- **UX Approach:** Unified visual language across views, realtime sync emphasizes single source of truth
- **Design Strategy:** Consistent card design, shared color coding, smooth transitions between views

**4. Emotional Intelligence Without Patronization**
- **Challenge:** Compassionate accountability must feel supportive, not condescending or cheesy
- **UX Approach:** Strategic placement of philosophical quotes (Vietnamese + English), non-judgmental language, user control (can toggle off)
- **Design Strategy:** Subtle typography, thoughtful timing (evening reflection moments), cultural authenticity

**5. Desktop-First Responsive Design**
- **Challenge:** Optimize for 1920x1080 desktop while maintaining usable mobile experience (375px+)
- **UX Approach:** Desktop-primary layouts with graceful mobile adaptation, not mobile-first constraints
- **Design Strategy:** Touch-optimized interactions on mobile, keyboard shortcuts on desktop, adaptive view switching

### Design Opportunities

**1. Modern Minimalist Aesthetic as Competitive Advantage**
- **Opportunity:** Vercel/shadcn/Supabase aesthetic signals trust, professionalism, and modernity—stands out from cluttered competitors (Notion, Todoist)
- **Implementation:** shadcn/ui mira style + zinc theme + Inter font + subtle animations + generous whitespace
- **Differentiation:** "Ghost-like" interfaces feel effortless, reducing cognitive load while competitors overwhelm with options

**2. Conversational AI as Primary Interface**
- **Opportunity:** Chat-first control feels natural and magical—users describe needs in plain language, AI executes
- **Implementation:** Floating chat widget (bottom-right), streaming responses, tool calling, quick action buttons (/plan-week, /whats-next)
- **Differentiation:** Only productivity tool where conversation > forms/buttons as primary interaction model

**3. Focus Mode as Execution Centerpiece**
- **Opportunity:** Planning-only tools fail at execution—dumtasking bridges the gap with immersive Focus Mode
- **Implementation:** Fullscreen + PiP floating timer + Pomodoro + ambient sounds + celebration animations
- **Differentiation:** Blitzit-inspired execution layer integrated with planning, not separate app

**4. Philosophical Depth & Cultural Authenticity**
- **Opportunity:** Vietnamese philosophical quotes add cultural richness and prompt genuine self-reflection
- **Implementation:** Strategic placement in evening motivation drop flows, weekly reviews, task importance fields
- **Differentiation:** Only tool treating productivity as human journey with emotional/behavioral dimensions

**5. Smart Daily Suggestions Eliminate Decision Paralysis**
- **Opportunity:** "What should I work on today?" answered by AI eliminates morning overwhelm
- **Implementation:** Morning dashboard with AI-curated top 3 tasks, one-click "Start" actions, quick insights (overdue, blocked, wins)
- **Differentiation:** Motion/Reclaim-style suggestions but with multi-goal orchestration context

**6. Multi-Goal Orchestration as Core Capability**
- **Opportunity:** No existing tool solves "focus on 1, neglect 2" problem systematically
- **Implementation:** Goal distribution analytics (Startup 70%, Dev 18%, Japanese 12%), automatic rebalancing, neglect alerts
- **Differentiation:** First tool designed for multi-goal individuals with AI-driven balance maintenance

---

## Core User Experience

### Defining Experience

**dumtasking's core experience is built around the principle of "Zero Cognitive Overhead Orchestration":**

**Primary User Loop:**
1. **Capture:** User dumps chaotic notes into rich text editor (Tiptap, auto-save)
2. **Orchestrate:** User triggers AI ("Plan this" button or AI Chat command) → AI extracts tasks with priorities, dependencies, schedules, and multi-goal balance
3. **Visualize:** Tasks appear across unified views (Kanban / Calendar / Table) with realtime sync
4. **Execute:** User enters Focus Mode (one-click) → immersive execution with Pomodoro + celebrations
5. **Reflect:** Weekly AI Review provides insights, patterns, and compassionate accountability

**The ONE Critical Interaction:**
The "Plan this" button (or `/plan` command in AI Chat) is the pivotal moment where chaos transforms into orchestration. This must feel:
- **Fast:** <5 seconds for typical notes (200-500 words)
- **Accurate:** 85%+ task extraction acceptance without edits
- **Transparent:** Preview modal shows reasoning, allows editing before commit
- **Magical:** Users think "Wow, it understood everything and balanced my goals automatically"

**What Makes It Effortless:**
- **No manual organization:** AI handles priorities, dependencies, scheduling automatically
- **No context switching:** Notes → Tasks → Execution in one unified interface
- **No decision paralysis:** Morning dashboard answers "What should I work on today?"
- **No guilt loops:** Compassionate accountability when motivation drops

### Platform Strategy

**Primary Platform: Desktop-First Web Application**

**Target Specifications:**
- **Optimal Resolution:** 1920x1080 (primary design target)
- **Minimum Desktop:** 1366x768 (fully functional)
- **Mobile Responsive:** 375px+ (secondary support, graceful degradation)
- **Browser Support:** Chrome/Edge/Firefox/Safari (latest 2 versions)

**Progressive Web App (PWA) Capabilities:**
- **Installable:** Desktop icon, standalone window mode
- **Offline Functionality:** 
  - Note editing with local queue
  - Cached task viewing
  - Sync when reconnected
- **Service Worker:** Asset caching, background sync

**Input Methods:**
- **Desktop Primary:** Keyboard + Mouse
  - Keyboard shortcuts (Ctrl/Cmd+K for Chat, Ctrl/Cmd+N for new note, Escape for modals)
  - Drag-and-drop (Kanban, Calendar reschedule)
  - Hover states, tooltips
- **Mobile Secondary:** Touch
  - Long-press for drag-and-drop
  - Swipe gestures between views
  - Touch-optimized targets (44x44px minimum)

**Browser API Requirements:**
- **Fullscreen API:** Focus Mode distraction-free environment
- **Picture-in-Picture API:** Floating timer across applications
- **Page Visibility API:** Attention tracking, idle detection
- **Notifications API:** Break reminders (optional, with permission)
- **Web Audio API:** Ambient sounds in Focus Mode
- **Service Workers:** PWA offline capabilities

**Platform Constraints:**
- **No native mobile apps:** PWA sufficient for MVP
- **No voice input:** Text-first interface, keyboard/touch only
- **No browser extensions:** Bookmark/tab access sufficient
- **Internet required for AI:** Graceful degradation when offline

### Effortless Interactions

**Interactions That Must Feel Completely Natural:**

**1. Auto-Save (Invisible Persistence)**
- **What:** Notes auto-save every 2 seconds (debounced)
- **Why Effortless:** Users never think about "Did I save?", just type and trust
- **Design:** Subtle checkmark indicator, no disruptive save dialogs

**2. AI Task Extraction (Instant Orchestration)**
- **What:** Messy notes → structured tasks in <5 seconds
- **Why Effortless:** Zero manual form-filling, AI infers priorities/dependencies/schedules
- **Design:** Green glowing "Plan this" button, elegant loading states, preview modal

**3. Realtime Sync (Seamless Consistency)**
- **What:** Changes propagate across all views within 1 second
- **Why Effortless:** Edit in Kanban → Calendar updates automatically, no refresh needed
- **Design:** Subtle pulse animation on sync, optimistic UI updates

**4. Smart Daily Suggestions (Eliminating Decision Paralysis)**
- **What:** Morning dashboard shows AI-curated top 3 tasks based on priority, blockers, time, energy
- **Why Effortless:** Users don't decide "what to work on", they just start the suggested task
- **Design:** Morning greeting + top 3 cards + one-click "Start" buttons

**5. One-Click Focus Mode (Frictionless Execution)**
- **What:** From any view → click "Start" → instant fullscreen Focus Mode with timer
- **Why Effortless:** No setup, no configuration, just immediate immersive execution
- **Design:** Prominent "Start" buttons, <500ms activation, smooth fullscreen transition

**6. Automatic Goal Balancing (Multi-Goal Orchestration)**
- **What:** AI maintains 3+ goal distribution (e.g., Startup 60%, Dev 25%, Japanese 15%) without manual planning
- **Why Effortless:** Users dump notes about any goal, AI ensures none are neglected
- **Design:** Goal distribution visualization (pie chart), automatic rebalancing, neglect alerts

**7. Conversational AI Control (Natural Language Commands)**
- **What:** Floating chat widget with quick actions (/plan-week, /whats-next, /optimize-today)
- **Why Effortless:** Natural language > complex menus, AI understands intent and executes
- **Design:** Always-accessible chat icon (bottom-right), streaming responses, actionable buttons

### Critical Success Moments

**Make-or-Break Interactions That Determine Product Success:**

**1. First Aha Moment (5-Minute Onboarding)**
- **When:** First-time user dumps note → clicks "Plan this" → sees AI-extracted tasks
- **Success Criteria:** 
  - Tasks appear in <5 seconds
  - Priorities feel accurate (85%+ acceptance)
  - User sees goal distribution: "Wow, it balanced all my goals automatically!"
- **If Failed:** User thinks "This is just another AI toy, not reliable"
- **Design Priority:** Fast loading, transparent reasoning, editable preview, clear visual hierarchy

**2. Morning Ritual Adoption (Daily Engagement)**
- **When:** User opens app at work start → sees Smart Daily Suggestions
- **Success Criteria:**
  - Top 3 tasks feel relevant and actionable
  - One-click "Start" leads directly to Focus Mode
  - User incorporates dumtasking into "Gmail + Slack + dumtasking" tab ritual
- **If Failed:** User forgets to use app, returns to fragmented workflow
- **Design Priority:** Personalized greeting, clear task hierarchy, frictionless Focus Mode entry

**3. Evening Compassionate Accountability (Retention Moment)**
- **When:** User has low energy, sees remaining tasks, considers skipping
- **Success Criteria:**
  - Non-judgmental defer/reschedule options appear
  - Philosophical quote prompts reflection without guilt
  - User feels understood: "It knows I'm tired, not judging me"
- **If Failed:** User experiences guilt loop, abandons tool like previous attempts
- **Design Priority:** Empathetic tone, cultural authenticity (Vietnamese quotes), gentle animations

**4. Focus Mode Completion (Execution Validation)**
- **When:** User completes task in Focus Mode
- **Success Criteria:**
  - Celebration animation feels rewarding (confetti, sound, checkmark)
  - Task auto-moves to "Done" across all views
  - User wants to continue: "Ready for next task?"
- **If Failed:** Execution feels empty, no dopamine reward for completion
- **Design Priority:** Delightful celebrations, seamless view updates, momentum continuation

**5. Weekly Review Engagement (Long-Term Value)**
- **When:** Sunday evening, user sees Weekly AI Review notification
- **Success Criteria:**
  - 70%+ open within 48 hours
  - Insights feel actionable (completion rate, goal distribution, patterns)
  - 50%+ accept at least one AI suggestion
- **If Failed:** User doesn't reflect or improve, productivity stagnates
- **Design Priority:** Timely delivery, visual data (charts), interactive suggestions, conversational refinement

**6. Multi-Goal Balance Realization (Unique Value Proof)**
- **When:** User reviews weekly/monthly goal distribution analytics
- **Success Criteria:**
  - No goal neglected >2 weeks (prevented "2-month Japanese gap")
  - User sees: "Startup 70%, Dev 18%, Japanese 12%" and understands it's balanced
  - User trusts AI: "I don't have to manually orchestrate anymore"
- **If Failed:** User reverts to manual planning, loses faith in AI orchestration
- **Design Priority:** Clear goal distribution visualization, automatic rebalancing, neglect alerts with suggestions

### Experience Principles

**Guiding Principles for All UX Decisions:**

**1. Zero Cognitive Overhead**
- **Principle:** Users dump thoughts, AI handles organization. Interfaces "disappear" (ghost-like aesthetic).
- **Application:** 
  - No manual form-filling for tasks (AI extracts from notes)
  - No manual priority-setting (AI infers from keywords)
  - No manual scheduling (AI auto-assigns based on workload/energy)
  - Progressive disclosure: show essential features first, reveal advanced contextually
- **Design Implications:** Minimal UI chrome, generous whitespace, auto-save everything, single-action flows

**2. Conversational Control**
- **Principle:** AI Chat Assistant is primary control center. Natural language > buttons/forms for complex operations.
- **Application:**
  - Quick action buttons (/plan-week, /whats-next, /optimize-today) for common needs
  - Freeform chat for complex requests ("Move all high-priority tasks to next week")
  - Tool calling: AI can execute functions (extract_tasks, reschedule_tasks, optimize_schedule)
- **Design Implications:** Floating chat widget always accessible, streaming responses feel alive, actionable buttons in AI replies

**3. Transparent AI Intelligence**
- **Principle:** Always show why AI made decisions. Build trust through explanation, not black-box magic.
- **Application:**
  - Tooltips explain scheduling: "Scheduled morning (complex task + high energy time)"
  - Preview modals before committing AI changes
  - Clear visual indicators: AI-generated (badge) vs user-created
  - Manual override always available (drag to reschedule, edit inline)
- **Design Implications:** Reasoning tooltips, preview flows, AI confidence indicators, undo capabilities

**4. Multi-View Coherence**
- **Principle:** Notes / Kanban / Calendar / Table / Focus Mode = one unified system. Realtime sync emphasizes single source of truth.
- **Application:**
  - Consistent visual language: colors (priority red/yellow/gray), card design, typography
  - Smooth transitions between views (no jarring context switches)
  - Shared components (task cards, status badges, priority indicators)
  - Realtime updates: change in one view → instantly reflects in all others
- **Design Implications:** Unified design tokens (shadcn/ui zinc theme), transition animations, optimistic UI updates

**5. Execution-First Mindset**
- **Principle:** Planning tools fail at execution—we integrate both. Focus Mode is centerpiece, not afterthought.
- **Application:**
  - One-click Focus Mode entry from any view or AI suggestion
  - Immersive fullscreen environment eliminates distractions
  - Pomodoro timer + PiP floating timer works across apps
  - Celebration animations reward completion
- **Design Implications:** Prominent "Start" buttons everywhere, <500ms Focus Mode activation, distraction-free UI, dopamine-driven celebrations

**6. Compassionate Accountability**
- **Principle:** Treat productivity as human journey, not mechanical checklist. Evening drops handled with empathy + philosophical depth.
- **Application:**
  - Non-judgmental language: "defer" not "failed", "reschedule" not "missed deadline"
  - Vietnamese philosophical quotes prompt reflection (e.g., "Vì sợ mình không phải là ngọc...")
  - Behavior logging without shame: patterns shown as insights, not judgments
  - "Why is this important?" fields maintain purpose + motivation
- **Design Implications:** Subtle typography for quotes, strategic placement (evening flows, weekly reviews), gentle animations, cultural authenticity

---

## Desired Emotional Response

### Primary Emotional Goals

**dumtasking is designed to evoke four primary emotional responses that differentiate it from mechanical productivity tools:**

**1. Empowerment + Relief (Core Emotional Foundation)**
- **Target Feeling:** "A weight has been lifted—I finally have a companion that orchestrates my chaos"
- **Manifestation:** Users feel empowered to handle multiple life goals without manual orchestration burden
- **Key Moments:** 
  - Morning: "I know exactly what to work on today" (clarity replaces decision paralysis)
  - Post-AI extraction: "Wow, it balanced all my goals automatically!" (relief from cognitive overhead)
  - Weekly review: "I'm making real progress across all goals" (sustained empowerment)

**2. Trust + Confidence (Building AI Acceptance)**
- **Target Feeling:** "I trust this AI understands my context and makes smart decisions for me"
- **Manifestation:** Users confidently accept 70%+ of AI-generated plans without extensive editing
- **Key Moments:**
  - AI extraction preview: "It understood dependencies and priorities correctly"
  - Transparent reasoning: "I see WHY it scheduled this task here—makes sense"
  - Consistent accuracy: "After 2 weeks, I trust its suggestions more than my own planning"

**3. Compassion + Understanding (Unique Differentiator)**
- **Target Feeling:** "This tool understands I'm human—it supports me without judging when motivation drops"
- **Manifestation:** Users feel compassionate accountability, not guilt when skipping tasks
- **Key Moments:**
  - Evening motivation drop: "It knows I'm tired, offering options without making me feel bad"
  - Vietnamese philosophical quote: "This quote makes me reflect on my journey, not just my tasks"
  - Weekly pattern insights: "It's showing me reality with empathy, not criticism"

**4. Accomplishment + Subtle Joy (Execution Rewards)**
- **Target Feeling:** "I completed something meaningful, and the system celebrates with me"
- **Manifestation:** Dopamine rewards for completion through delightful micro-interactions
- **Key Moments:**
  - Focus Mode completion: Confetti animation + sound effect = genuine joy
  - Weekly summary: "23 tasks completed—18 more than last month!" = pride in progress
  - Goal balance visualization: Seeing all 3 goals progressing = quiet satisfaction

### Emotional Journey Mapping

**Discovery Phase (First 5 Minutes)**

**Initial State:** Curiosity + Skepticism
- "Can AI really organize my chaotic notes?"
- "Is this just another productivity tool that I'll abandon?"

**Aha Moment Transition:** Wonder → Delight
- User dumps note → clicks "Plan this" → sees structured tasks with reasoning
- **Emotional Peak:** "It actually understood everything and balanced my goals automatically!"
- **Design Support:** Fast loading (<5s), accurate extraction (85%+), editable preview

**Post-Aha:** Confidence + Engagement
- "If it can do this with one note, imagine with all my notes..."
- Users immediately explore other features (Kanban, Calendar, Focus Mode)

---

**Daily Usage Cycle (Sustainable Emotional Pattern)**

**Morning Ritual (7:30-9:00 AM):**
- **Emotion:** Confidence + Clarity
- **Experience:** Opens app → sees Smart Daily Suggestions → knows exactly what to do
- **Design Support:** Personalized greeting, AI-curated top 3 tasks, one-click "Start" buttons
- **Desired Response:** "I don't have to decide what to work on—I just start"

**During Work (9 AM-6 PM):**
- **Emotion:** Flow + Control
- **Experience:** Enters Focus Mode → immersive execution → completion celebration
- **Design Support:** Fullscreen environment, PiP timer, Pomodoro rhythm, ambient sounds
- **Desired Response:** "I'm in the zone, distractions eliminated"

**Evening Reflection (6-8 PM):**
- **Emotion:** Understanding + Relief (NOT Guilt)
- **Experience:** Sees remaining tasks, low energy → compassionate accountability appears
- **Design Support:** Non-judgmental defer options, philosophical quotes, behavior logging
- **Desired Response:** "It understands I'm tired, not judging me—I can defer without guilt"

**Weekly Review (Sunday 8 PM):**
- **Emotion:** Self-Awareness + Growth
- **Experience:** Reads AI-generated insights → sees patterns → adjusts strategy
- **Design Support:** Visual data (charts), actionable suggestions, conversational refinement
- **Desired Response:** "I'm learning about myself through these insights, improving over time"

---

**Long-Term Engagement (3+ Months)**

**Multi-Goal Balance Realization:**
- **Emotion:** Empowerment + Pride
- **Experience:** Reviews goal distribution → no goal neglected >2 weeks
- **Design Support:** Goal analytics (Startup 70%, Dev 18%, Japanese 12%), automatic rebalancing
- **Desired Response:** "I finally solved 'focus on 1, neglect 2'—all my goals are progressing"

**Trust Deepening:**
- **Emotion:** Confidence → Reliance
- **Experience:** After weeks of accurate AI orchestration, users stop second-guessing
- **Design Support:** Consistent accuracy, transparent reasoning, learning from user behavior
- **Desired Response:** "I trust this AI more than my manual planning—it knows my patterns better"

### Micro-Emotions

**Critical Micro-Emotional States That Determine Success:**

**1. Confidence vs. Confusion (AI Interaction)**
- **Desired:** Confidence that AI decisions are accurate and well-reasoned
- **Avoided:** Confusion about why AI made certain choices
- **Design Solution:** 
  - Reasoning tooltips on every AI decision
  - Preview modals before committing changes
  - "Why is this scheduled here?" always answerable

**2. Trust vs. Skepticism (AI Acceptance)**
- **Desired:** Trust built through transparency and consistent accuracy
- **Avoided:** Skepticism from black-box AI or frequent mistakes
- **Design Solution:**
  - Show confidence scores for AI decisions
  - Manual override always available
  - Learn from user corrections over time

**3. Accomplishment vs. Frustration (Task Completion)**
- **Desired:** Genuine sense of accomplishment with dopamine reward
- **Avoided:** Frustration from incomplete tasks or lack of recognition
- **Design Solution:**
  - Celebration animations (confetti, sound, checkmark)
  - Progress insights ("23 tasks this week!")
  - Momentum continuation ("Ready for next task?")

**4. Understanding vs. Judgment (Compassionate Accountability)**
- **Desired:** Feeling understood and supported when motivation drops
- **Avoided:** Judgment or guilt when skipping tasks
- **Design Solution:**
  - Non-judgmental language ("defer" not "failed")
  - Vietnamese philosophical quotes for reflection
  - Behavior patterns shown as insights, not criticism

**5. Control vs. Helplessness (User Agency)**
- **Desired:** Sense of control—users can override AI anytime
- **Avoided:** Helplessness or feeling trapped by AI decisions
- **Design Solution:**
  - Drag-and-drop reschedule
  - Inline editing everywhere
  - AI suggestions are suggestions, not mandates

**6. Flow vs. Distraction (Focus Mode)**
- **Desired:** Deep work flow state, distractions eliminated
- **Avoided:** Constant interruptions breaking concentration
- **Design Solution:**
  - Fullscreen immersive environment
  - PiP timer works across apps
  - Gentle break reminders, not harsh interruptions

**7. Clarity vs. Overwhelm (Feature Complexity)**
- **Desired:** Clarity about what to do despite 20 features
- **Avoided:** Overwhelm from too many options or complex UI
- **Design Solution:**
  - Progressive disclosure (show essential first)
  - Ghost-like aesthetic (interfaces disappear)
  - AI guides feature discovery contextually

### Design Implications

**Emotional Goal → UX Design Approach:**

**1. Empowerment + Relief → Zero Cognitive Overhead Design**
- **Implication:** Eliminate all manual organization work
- **Tactics:**
  - Auto-save (2-second debounce, no save buttons)
  - AI extracts tasks from notes (no form-filling)
  - AI assigns priorities and schedules automatically
  - Smart Daily Suggestions eliminate decision-making
- **Visual Language:** Minimal UI chrome, generous whitespace, ghost-like aesthetic

**2. Trust + Confidence → Transparent AI Intelligence**
- **Implication:** Always show reasoning, never hide AI logic
- **Tactics:**
  - Reasoning tooltips on every AI decision
  - Preview modals before committing changes
  - AI-generated badges vs user-created indicators
  - Manual override always one click away
- **Visual Language:** Subtle AI indicators, clear reasoning text, edit affordances everywhere

**3. Compassion + Understanding → Compassionate Accountability Design**
- **Implication:** Support users emotionally during motivation drops
- **Tactics:**
  - Non-judgmental defer/reschedule options
  - Vietnamese philosophical quotes at strategic moments
  - "Why is this important?" fields maintain purpose
  - Behavior patterns shown as insights, not judgments
- **Visual Language:** Subtle typography for quotes, gentle animations, empathetic tone in all copy

**4. Accomplishment + Joy → Celebration Micro-Moments**
- **Implication:** Reward completion with dopamine hits
- **Tactics:**
  - Confetti animations on task completion
  - Sound effects (optional, toggle in settings)
  - Progress insights in weekly reviews
  - Momentum continuation prompts ("Ready for next?")
- **Visual Language:** Delightful animations, vibrant celebration colors, positive reinforcement copy

**5. Flow + Focus → Immersive Focus Mode Design**
- **Implication:** Eliminate all distractions during execution
- **Tactics:**
  - Fullscreen API for immersive environment
  - PiP floating timer works across applications
  - Pomodoro timer with break reminders
  - Ambient sounds (white noise, rain, coffee shop)
- **Visual Language:** Dark backgrounds, minimal UI, large timer, centered task content

**6. Clarity + Confidence → Smart Daily Suggestions Design**
- **Implication:** Answer "What should I work on?" instantly
- **Tactics:**
  - Morning dashboard with personalized greeting
  - AI-curated top 3 tasks based on priority/blockers/time/energy
  - One-click "Start" buttons lead directly to Focus Mode
  - Quick insights (overdue, blocked, yesterday's wins)
- **Visual Language:** Clear task hierarchy, prominent Start buttons, visual priority indicators

### Emotional Design Principles

**Guiding Principles for Emotional Experience:**

**1. Compassionate Intelligence**
- **Principle:** AI should feel like a supportive companion, not a robotic task master
- **Application:** Empathetic language, cultural depth (Vietnamese quotes), non-judgmental tone
- **Measure:** Users feel understood when motivation drops, not criticized

**2. Transparent Trust-Building**
- **Principle:** Build trust through explanation and consistency, not black-box magic
- **Application:** Show reasoning, preview changes, enable override, learn from corrections
- **Measure:** 70%+ AI plan acceptance rate, users say "I trust the AI" in surveys

**3. Joyful Accomplishment**
- **Principle:** Celebrate wins with genuine delight, not just checkbox ticking
- **Application:** Confetti animations, sound effects, progress insights, momentum prompts
- **Measure:** Users complete more tasks in Focus Mode (75%+ vs 60% baseline)

**4. Ghost-Like Simplicity**
- **Principle:** Interfaces should disappear, allowing users to focus on work not UI
- **Application:** Minimal chrome, generous whitespace, progressive disclosure, auto-everything
- **Measure:** Users describe UI as "effortless" and "invisible" in feedback

**5. Empowered Control**
- **Principle:** Users should always feel in control, never trapped by AI decisions
- **Application:** Manual override everywhere, drag-and-drop, inline editing, suggestions not mandates
- **Measure:** Users customize/override AI suggestions but still rely on them

**6. Flow-State Facilitation**
- **Principle:** Design should enable deep work flow, not interrupt it
- **Application:** Fullscreen Focus Mode, PiP timer, Pomodoro rhythm, gentle break reminders
- **Measure:** Average focus session >35 minutes (vs 25-minute standard)

---

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

**Design Aesthetic & Philosophy:**

**1. Vercel (Modern Minimalist Foundation)**
- **Core Strength:** Ghost-like interfaces where UI disappears, content shines
- **Key Patterns:**
  - Generous whitespace reduces cognitive load
  - Monochrome zinc palette (professional, timeless)
  - Subtle micro-animations without distraction
  - Typography hierarchy through Inter font
- **Adaptation for dumtasking:** Foundation for entire design system - shadcn/ui mira style + zinc theme

**2. shadcn/ui (Component Excellence)**
- **Core Strength:** Beautiful, accessible components out-of-the-box
- **Key Patterns:**
  - Radix UI primitives (accessibility built-in)
  - Consistent design tokens
  - Customizable without complexity
- **Adaptation for dumtasking:** All UI components sourced from shadcn/ui, maintaining visual consistency

**3. Supabase (Developer-Friendly Elegance)**
- **Core Strength:** Technical complexity presented simply
- **Key Patterns:**
  - Clean dashboard layouts
  - Clear information hierarchy
  - Approachable technical interfaces
- **Adaptation for dumtasking:** Inspiration for Settings UI, technical features presented clearly

---

**Smart Scheduling & AI Intelligence:**

**4. Motion.ai (Intelligent Task Orchestration)**
- **Core Strength:** AI-powered scheduling with workload optimization
- **Key Patterns:**
  - Smart daily suggestions: "What should I work on today?"
  - Auto-balance workload across days
  - Visual density indicators (Green/Yellow/Red)
  - Calendar auto-scheduling based on priority + time + energy
- **Adaptation for dumtasking:**
  - Morning dashboard with AI-curated top 3 tasks
  - "Optimize my week" button for automatic rebalancing
  - Workload density visualization on calendar
  - Smart warnings when overload detected

**5. Reclaim.ai (Protect Deep Work Time)**
- **Core Strength:** Defend focus time from meeting overload
- **Key Patterns:**
  - Protected time slots (recurring, labeled)
  - Auto-schedule breaks based on work duration
  - Compliance tracking (% of protected time respected)
- **Adaptation for dumtasking:**
  - Protected Slots configuration in Settings
  - AI respects protected time when scheduling
  - Auto-insert 15-min breaks after 2h work
  - Visual protected slots on calendar (green borders)

---

**Execution & Focus:**

**6. Blitzit (Focus Mode Centerpiece)**
- **Core Strength:** Execution layer, not just planning
- **Key Patterns:**
  - Fullscreen immersive Focus Mode
  - PiP floating timer works across apps
  - Pomodoro timer (25/5) integrated
  - Celebration animations on completion (dopamine rewards)
  - Blitzy AI assistant for conversational control
- **Adaptation for dumtasking:**
  - Fullscreen API for distraction-free execution
  - PiP timer persists when user switches apps
  - Pomodoro rhythm with break reminders
  - Confetti + sound effects for task completion
  - AI Chat Assistant as unified control center

---

**Power User Capabilities:**

**7. Notion (Database View Flexibility)**
- **Core Strength:** Multiple view types, one data model
- **Key Patterns:**
  - Table view with sortable/filterable columns
  - Inline editing (click any cell → edit directly)
  - Column customization (show/hide, reorder, resize)
  - Consistent data across Table / Board / Calendar views
- **Adaptation for dumtasking:**
  - TanStack Table v8 for power user view
  - Inline editing with debounced auto-save
  - Column visibility/order customization
  - Unified data model across Kanban/Calendar/Table

**8. Linear (Speed & Keyboard-First)**
- **Core Strength:** Fastest project management tool, keyboard-driven
- **Key Patterns:**
  - Command Palette (Cmd+K): universal search + action
  - Instant page loads, no spinners
  - Keyboard shortcuts for everything
  - Intelligent defaults (auto-assigns based on context)
  - Smooth state transition animations
- **Adaptation for dumtasking:**
  - Ctrl/Cmd+K opens AI Chat (command palette)
  - Keyboard shortcuts for common actions (N for new note, F for focus mode)
  - Optimistic UI updates with smooth animations
  - AI intelligent defaults (auto-priority, auto-schedule)

---

**Innovative Interaction Patterns:**

**9. Arc Browser (Context Management)**
- **Core Strength:** Tab management through spaces and organization
- **Key Patterns:**
  - Spaces/Profiles for different contexts (Work, Personal, Projects)
  - Command Bar with fuzzy search
  - Auto-archives inactive tabs (Today vs. Favorites)
  - Minimal chrome - UI disappears when not needed
- **Adaptation for dumtasking:**
  - Fuzzy search in AI Chat for tasks/notes
  - Today / This Week / Backlog separation in Kanban
  - Ghost-like UI - chrome only when needed
  - Potential: "Goal Spaces" for multi-goal views (future consideration)

**10. Google Calendar / Notion Calendar (Visual Scheduling)**
- **Core Strength:** Time blocking with visual density feedback
- **Key Patterns:**
  - Tasks as visual blocks on timeline (not just all-day events)
  - Drag-and-drop reschedule across days
  - Color-coding for task categories/priorities
  - Multiple views (Day / Week / Month / Agenda)
  - Notion Calendar: "Find time" suggests optimal slots
- **Adaptation for dumtasking:**
  - Week view primary, day view for mobile
  - Time block visualization (tasks show duration visually)
  - Drag-and-drop reschedule with conflict detection
  - Color-coding by priority (red/yellow/gray)
  - AI "Optimize my week" = smart scheduling

---

### Transferable UX Patterns

**Organized by UX Domain:**

**1. Command & Control Patterns**

**Pattern: Slash Commands as Prompt Templates (Cursor-style)**
- **Source:** Cursor, Slack, Notion
- **Implementation:** AI Chat input with "/" autocomplete
- **Examples:**
  - `/plan` → "Extract tasks from current note"
  - `/plan-week` → "Plan my entire week from all unprocessed notes"
  - `/whats-next` → "What should I work on next?"
  - `/optimize-today` → "Optimize today's schedule"
- **Why It Works:** Faster than typing full sentences, discoverable through autocomplete
- **Adaptation:** Primary control method in AI Chat Assistant

**Pattern: Command Palette (Cmd/Cmd+K)**
- **Source:** Linear, VS Code, Raycast
- **Implementation:** Universal search + action interface
- **Why It Works:** Keyboard-first, finds anything, executes any action
- **Adaptation:** Ctrl/Cmd+K opens AI Chat with command palette

**Pattern: Quick Action Buttons (Visual Prompts)**
- **Source:** ChatGPT suggested prompts, Notion AI
- **Implementation:** Buttons above chat input for common commands
- **Why It Works:** Visual alternative to slash commands for discovery
- **Adaptation:** "/plan-week", "/whats-next", etc. as clickable buttons

---

**2. AI Intelligence & Trust Patterns**

**Pattern: Preview Before Commit**
- **Source:** Motion.ai schedule changes, Grammarly suggestions
- **Implementation:** Modal shows AI-extracted tasks before inserting
- **Why It Works:** Builds trust, allows editing, reduces AI mistakes
- **Adaptation:** "Plan this" → preview modal → user edits → confirm

**Pattern: Transparent Reasoning**
- **Source:** Perplexity citations, Motion scheduling reasons
- **Implementation:** Tooltips explain "Why scheduled here?"
- **Why It Works:** Users understand AI logic, trust increases
- **Adaptation:** Every AI decision has reasoning tooltip

**Pattern: Confidence Indicators**
- **Source:** Grammarly accuracy scores, GitHub Copilot suggestions
- **Implementation:** AI shows confidence level (High/Medium/Low)
- **Why It Works:** Users know when to trust vs verify
- **Adaptation:** AI task extraction shows confidence per task

---

**3. Visual Scheduling Patterns**

**Pattern: Time Block Visualization**
- **Source:** Google Calendar, Notion Calendar
- **Implementation:** Tasks show as blocks with duration on timeline
- **Why It Works:** Visual density immediately apparent
- **Adaptation:** dumtasking Calendar shows task duration as blocks

**Pattern: Workload Density Indicators**
- **Source:** Motion.ai color-coded days
- **Implementation:** Green (<6h), Yellow (6-8h), Red (>8h overload)
- **Why It Works:** Prevents over-scheduling at a glance
- **Adaptation:** Calendar days color-coded by workload density

**Pattern: Drag-and-Drop Reschedule**
- **Source:** Google Calendar, Notion Calendar, Linear
- **Implementation:** Drag task to different day/time → auto-updates
- **Why It Works:** Direct manipulation feels natural
- **Adaptation:** Kanban cards and Calendar tasks draggable

---

**4. Focus & Execution Patterns**

**Pattern: Immersive Fullscreen Mode**
- **Source:** Blitzit, Notion Focus Mode
- **Implementation:** Fullscreen API eliminates distractions
- **Why It Works:** Reduces context switching, deep work state
- **Adaptation:** Focus Mode one-click from any view

**Pattern: PiP Floating Timer**
- **Source:** Blitzit PiP timer
- **Implementation:** Picture-in-Picture API for cross-app timer
- **Why It Works:** Timer visible even when switching apps
- **Adaptation:** dumtasking PiP timer works during coding/browsing

**Pattern: Celebration Micro-Moments**
- **Source:** Blitzit confetti, Duolingo celebrations
- **Implementation:** Confetti animation + sound on completion
- **Why It Works:** Dopamine reward, positive reinforcement
- **Adaptation:** Task completion in Focus Mode triggers celebration

---

**5. Power User Patterns**

**Pattern: Inline Editing**
- **Source:** Notion, Linear, Airtable
- **Implementation:** Click any field → edit directly (no modal)
- **Why It Works:** Reduces friction, feels immediate
- **Adaptation:** Table view, Kanban cards, Calendar tasks all inline-editable

**Pattern: Column Customization**
- **Source:** Notion databases, Airtable
- **Implementation:** Show/hide columns, reorder, resize
- **Why It Works:** Users control information density
- **Adaptation:** Table view column customization saved per user

**Pattern: Keyboard Shortcuts**
- **Source:** Linear (Cmd+K, I for new issue), VS Code
- **Implementation:** Common actions have shortcuts
- **Why It Works:** Power users gain speed
- **Adaptation:** N=new note, F=focus mode, K=command palette, Esc=exit

---

### Anti-Patterns to Avoid

**Patterns That Create Friction:**

**1. Setup Friction (Notion's Weakness)**
- **Anti-Pattern:** Requires extensive configuration before value delivery
- **Why Harmful:** Users abandon before seeing benefits
- **dumtasking Avoidance:** Zero setup - dump note → immediate AI orchestration

**2. Manual Form-Filling (Todoist, Traditional Task Managers)**
- **Anti-Pattern:** Every task requires manual fields (priority, date, project, tags)
- **Why Harmful:** Cognitive overhead kills planning habit
- **dumtasking Avoidance:** AI infers all metadata from notes automatically

**3. Black-Box AI (Early AI tools)**
- **Anti-Pattern:** AI makes decisions without explanation
- **Why Harmful:** Users don't trust, feel helpless
- **dumtasking Avoidance:** Always show reasoning, enable manual override

**4. Overwhelming Feature Visibility (Jira, Microsoft Project)**
- **Anti-Pattern:** All features visible at once, cluttered UI
- **Why Harmful:** Decision paralysis, cognitive overload
- **dumtasking Avoidance:** Progressive disclosure, ghost-like aesthetic

**5. Guilt-Inducing Language (Habitica, Streaks apps)**
- **Anti-Pattern:** "You failed", "Streak broken", red X marks
- **Why Harmful:** Creates guilt loops, users abandon tool
- **dumtasking Avoidance:** Compassionate accountability, non-judgmental defer options

**6. Forced Gamification (Many habit trackers)**
- **Anti-Pattern:** Points, badges, levels feel childish for professionals
- **Why Harmful:** Doesn't resonate with target users (25-45 professionals)
- **dumtasking Avoidance:** Subtle celebrations (confetti), not badges/points

**7. Slow Performance (Asana, Monday.com loading times)**
- **Anti-Pattern:** 3-5 second page loads, spinners everywhere
- **Why Harmful:** Breaks flow, feels sluggish
- **dumtasking Avoidance:** <2s page loads, optimistic UI, instant feedback

**8. Mobile-First Compromise (Many web apps)**
- **Anti-Pattern:** Desktop experience constrained by mobile limitations
- **Why Harmful:** Power users on desktop feel handicapped
- **dumtasking Avoidance:** Desktop-first design, mobile responsive secondary

---

### Design Inspiration Strategy

**What to Adopt (Use As-Is):**

1. **Vercel's Ghost-Like Aesthetic**
   - Reason: Aligns perfectly with minimalist philosophy
   - Implementation: shadcn/ui mira + zinc theme foundation

2. **Linear's Keyboard-First Approach**
   - Reason: Power users want speed
   - Implementation: Shortcuts for all common actions, Cmd+K command palette

3. **Google Calendar's Time Block Visualization**
   - Reason: Users need to see workload density
   - Implementation: Tasks as visual blocks, not all-day events

4. **Blitzit's Focus Mode Design**
   - Reason: Execution layer is centerpiece
   - Implementation: Fullscreen + PiP timer + Pomodoro + celebrations

---

**What to Adapt (Modify for dumtasking):**

1. **Motion's Smart Scheduling → Multi-Goal Orchestration**
   - Modification: Add goal distribution tracking (Startup 70%, Dev 18%, Japanese 12%)
   - Reason: dumtasking solves "focus on 1, neglect 2" uniquely

2. **Cursor's Slash Commands → Prompt Templates**
   - Modification: Domain-specific commands (/plan-week, /whats-next, /optimize-today)
   - Reason: Productivity-focused prompts, not code-focused

3. **Arc's Spaces → Goal Spaces (Future)**
   - Modification: Separate views per life goal (Startup / Dev / Japanese)
   - Reason: Helps visualize multi-goal balance (post-MVP consideration)

4. **Notion's Database Views → Simplified Power User View**
   - Modification: Table view without full Notion complexity
   - Reason: Power users want flexibility, but not Notion's learning curve

---

**What to Avoid (Conflicts with Goals):**

1. **Notion's Setup Complexity**
   - Reason: Conflicts with "zero cognitive overhead" principle
   - Alternative: AI handles all organization automatically

2. **Todoist's Manual Task Creation**
   - Reason: Conflicts with "dump notes → AI orchestrates" flow
   - Alternative: AI extraction from notes is primary method

3. **Jira's Feature Overload**
   - Reason: Conflicts with ghost-like simplicity
   - Alternative: Progressive disclosure, hide advanced features initially

4. **Habitica's Gamification**
   - Reason: Doesn't resonate with professional target users
   - Alternative: Subtle celebrations, philosophical depth instead

5. **Mobile-First Constraints**
   - Reason: Desktop is primary platform
   - Alternative: Desktop-optimized, mobile responsive secondary

---

## Design System Foundation

### Design System Choice

**Selected System: shadcn/ui with Mira Style + Zinc Theme**

dumtasking uses **shadcn/ui** as the foundational design system, configured with specific presets to achieve the desired modern minimalist aesthetic.

**Configuration Command:**
```bash
bunx --bun shadcn@latest create --preset "https://ui.shadcn.com/init?base=base&style=mira&baseColor=zinc&theme=zinc&iconLibrary=lucide&font=inter&menuAccent=subtle&menuColor=default&radius=default&template=next" --template next
```

**Design System Specifications:**
- **Framework:** shadcn/ui (Radix UI primitives + Tailwind CSS)
- **Style Variant:** mira (subtle, refined aesthetic layer)
- **Color Palette:** zinc (neutral, professional monochrome)
- **Icon Library:** lucide (clean, minimal line icons)
- **Typography:** Inter (modern, readable sans-serif)
- **Component Radius:** default (balanced rounded corners)
- **Menu Styling:** subtle accents with default color treatments

**Design System Category:**
shadcn/ui is a **themeable component collection** rather than a traditional component library. Components are copied into the project as source code, providing full ownership and customization freedom while maintaining consistency and accessibility standards.

### Rationale for Selection

**1. Perfect Aesthetic Alignment**
- **Modern Minimalist:** shadcn/ui's mira style + zinc theme embodies the "ghost-like" aesthetic desired
- **Vercel/Supabase Inspiration:** These products use similar design foundations—shadcn/ui achieves comparable elegance
- **Clean & Professional:** Zinc monochrome palette reduces visual noise, focuses attention on content
- **Subtle Interactions:** Mira style provides refined micro-interactions without distraction

**2. Technical Excellence**
- **Accessibility First:** Built on Radix UI primitives with WCAG 2.1 AA compliance out-of-the-box
  - Keyboard navigation native to all components
  - Screen reader support through semantic HTML + ARIA
  - Focus management and trapped focus patterns
  - Touch target sizing (44x44px minimum)
- **Performance Optimized:** No component library dependency bloat—only components used are included
- **Next.js Native:** Perfect integration with Next.js 16.1.3 App Router and Server Components
- **TypeScript Native:** Full type safety across all components

**3. Developer Flexibility & Control**
- **Code Ownership:** Components copied into `components/ui/` as source—full modification freedom
- **No Lock-In:** Not dependent on npm package versions or breaking changes
- **Customization Without Fighting:** Tailwind CSS makes component tweaks natural
- **Progressive Enhancement:** Can modify any component for unique dumtasking needs

**4. Speed & Consistency**
- **Pre-Built Components:** All essential UI primitives ready (Button, Input, Dialog, Dropdown, Table, etc.)
- **Design Tokens:** Consistent spacing, colors, typography through Tailwind config
- **CLI Workflow:** `npx shadcn@latest add [component]` adds components as needed
- **Proven Patterns:** Radix UI provides battle-tested interaction patterns

**5. Ecosystem Alignment**
- **Tailwind CSS:** Industry-standard utility-first CSS (rapid development, minimal bundle size)
- **Lucide Icons:** 1000+ consistent, minimal line icons
- **Inter Font:** Modern sans-serif optimized for screens (readability + elegance)
- **Community Support:** Large ecosystem, extensive documentation, active development

### Implementation Approach

**Phase 1: Foundation Setup (Already Complete)**

✅ **Initial Configuration:**
- Project initialized with shadcn/ui preset via setup command
- Base components available in `components/ui/`
- Tailwind config established with zinc theme
- Design tokens defined (colors, spacing, typography, radius)

**Phase 2: Core Component Addition (As Needed)**

**Essential Components for dumtasking MVP:**
- **Forms & Inputs:**
  - `Button` (primary, secondary, ghost, destructive variants)
  - `Input` (text, email, password)
  - `Textarea` (rich text editor wrapper)
  - `Select` / `Combobox` (dropdowns, autocomplete)
  - `Label` (form labels with accessibility)
  - `Field` (form field composition)
  
- **Navigation & Layout:**
  - `Separator` (dividers)
  - `Dropdown Menu` (context menus, action menus)
  - `Dialog` / `Alert Dialog` (modals, confirmations)
  - `Card` (content containers)
  
- **Data Display:**
  - `Badge` (priority indicators, status labels)
  - `Table` (foundation for power user Table view—will extend with TanStack Table)
  
- **Feedback:**
  - `Toast` (notifications, success/error messages)
  - Loading states (skeletons, spinners)

**Installation Command:**
```bash
# Add components as needed
npx shadcn@latest add button input textarea select label dropdown-menu dialog card badge separator
```

**Phase 3: Custom Component Development**

**Components Requiring Custom Build (Beyond shadcn/ui):**

1. **Rich Text Editor (Tiptap Integration)**
   - Base: shadcn/ui Input styling
   - Extension: Tiptap editor with toolbar
   - Custom: Markdown shortcuts, auto-save indicator

2. **Kanban Board (dnd-kit Integration)**
   - Base: shadcn/ui Card for task cards
   - Extension: dnd-kit drag-and-drop
   - Custom: Realtime sync indicators, swimlanes

3. **Calendar View (FullCalendar or Custom)**
   - Base: shadcn/ui Card + Button styling
   - Extension: FullCalendar or custom time-grid component
   - Custom: Time block visualization, density indicators, AI scheduling overlays

4. **Focus Mode UI**
   - Base: Fullscreen container with minimal chrome
   - Extension: PiP timer (Picture-in-Picture API)
   - Custom: Pomodoro controls, celebration animations, ambient sound controls

5. **AI Chat Assistant Widget**
   - Base: shadcn/ui Dialog as floating widget foundation
   - Extension: Streaming message display, markdown rendering
   - Custom: Slash command autocomplete, quick action buttons, tool calling UI

6. **Smart Daily Suggestions Dashboard**
   - Base: shadcn/ui Card + Button
   - Extension: Custom layout for morning greeting + top 3 tasks
   - Custom: One-click "Start" actions, quick insights, goal distribution visualization

**Phase 4: Design Token Refinement**

**Tailwind Config Customization:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Zinc theme (already configured)
        // Add custom colors for specific needs:
        priority: {
          high: 'hsl(var(--destructive))', // Red
          medium: 'hsl(var(--warning))',    // Yellow  
          low: 'hsl(var(--muted))',         // Gray
        },
        focus: {
          active: 'hsl(var(--primary))',    // Active focus indicator
        },
      },
      animation: {
        // Custom animations for celebrations, sync indicators
        'confetti': 'confetti 1s ease-out',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
      },
    },
  },
};
```

**Typography Scale (Inter Font):**
- Headings: 2xl (32px), xl (24px), lg (20px), base (16px)
- Body: base (16px) for readable content
- Small: sm (14px) for metadata, badges
- Tiny: xs (12px) for timestamps, auxiliary info

**Spacing & Layout:**
- Container max-width: 1920px (desktop optimal)
- Padding: 4 (1rem), 6 (1.5rem), 8 (2rem) for generous whitespace
- Gap: 4 (1rem) for component spacing

### Customization Strategy

**1. Component Customization Approach**

**Level 1: Styling Tweaks (Tailwind Classes)**
- Use Tailwind utility classes for minor adjustments
- Example: `<Button className="hover:scale-105 transition-transform">`
- No modification to source components needed

**Level 2: Variant Extensions**
- Extend shadcn/ui components with new variants
- Example: Add "ghost-primary" button variant
- Modify component file directly (we own the code)

**Level 3: Composition Patterns**
- Build higher-order components from shadcn/ui primitives
- Example: TaskCard = Card + Badge + Button + Dropdown
- Maintains consistency while adding domain logic

**Level 4: Custom Components**
- Build entirely new components for unique needs
- Use shadcn/ui design tokens for consistency
- Example: KanbanBoard, CalendarView, FocusMode UI

**2. Maintaining Consistency**

**Design Token System:**
- All custom components reference Tailwind config tokens
- Never hardcode colors, spacing, or typography
- Ensure custom components match shadcn/ui aesthetic

**Component Guidelines:**
- Follow Radix UI accessibility patterns
- Maintain keyboard navigation support
- Use consistent prop naming conventions
- Document custom components similar to shadcn/ui docs

**3. Accessibility Preservation**

**Non-Negotiable Standards:**
- WCAG 2.1 Level AA compliance throughout
- Keyboard navigation for all custom components
- Screen reader testing for complex interactions
- Color contrast ratios maintained (4.5:1 minimum)

**Custom Component Checklist:**
- [ ] Semantic HTML structure
- [ ] ARIA labels and roles where needed
- [ ] Keyboard focus management
- [ ] Touch target sizing (44x44px min)
- [ ] Color-blind friendly (not color-only indicators)

**4. Performance Optimization**

**Bundle Size Management:**
- Only add shadcn/ui components when needed (not full library upfront)
- Tree-shake unused Tailwind classes (automatic in production)
- Lazy load heavy custom components (Calendar, Table)
- Code-split by route (Next.js automatic)

**Rendering Optimization:**
- Use React Server Components where possible
- Client components only for interactivity
- Virtualization for large lists (Table view, Kanban with 100+ tasks)
- Debounce expensive operations (search, filters)

**5. Evolution Strategy**

**Component Library Growth:**
- Start with MVP components (core 15-20 shadcn/ui components)
- Add shadcn/ui components as features require (`npx shadcn@latest add [component]`)
- Build custom components for unique dumtasking needs
- Document custom components in Storybook (post-MVP)

**Design System Maintenance:**
- Track shadcn/ui updates (new components, improvements)
- Update custom components to match evolved patterns
- Maintain design token consistency as system grows
- Version control component changes

---

## Core Defining Experience

### Defining Experience: Conversational AI Control

**"Chat with AI to orchestrate everything - Natural language + slash commands that actually execute"**

dumtasking's defining experience is **conversational AI control** - users interact with an intelligent AI assistant through natural language and slash commands to orchestrate their entire productivity workflow. Unlike traditional AI chats that only suggest actions, dumtasking's AI Chat Assistant **executes** commands, making it feel like having a personal assistant who actually gets things done.

**What Users Will Say:**
> "Tôi chỉ cần chat với AI như ChatGPT, nhưng nó thực sự làm việc luôn. Type `/plan-week` → AI plan cả tuần. Ask 'what should I work on?' → AI suggest tasks ngay. Không cần click buttons nhiều, chỉ nói với AI là xong."

**The "Aha" Moment:**
> "Wait, I can just TELL the AI what I need and it does everything? This feels like having a personal assistant!"

**Core Interaction Comparison:**
- **Traditional Task Managers:** Click buttons → fill forms → manual organization
- **AI Chat Tools (ChatGPT):** Ask questions → get suggestions → copy-paste elsewhere
- **dumtasking:** Chat with AI → AI executes immediately → orchestration done

**If We Get ONE Thing Right:**
AI Chat must understand natural language + slash commands, respond fast (<2s first token streaming), and **actually execute actions** (not just suggest) - add tasks, reschedule, optimize schedule, launch Focus Mode.

### User Mental Model

**Current Problem-Solving Approach:**
1. Capture tasks in notes across multiple apps
2. Open ChatGPT/Claude: "How should I organize these?"
3. Copy-paste AI response to Todoist/Notion/Reminders
4. Manually set priorities, dates, dependencies
5. Spend 2 hours planning → lose motivation → abandon

**Mental Model Users Bring:**
- **From ChatGPT Usage:** "AI can understand my messy notes and give smart advice"
- **Expected Friction:** "But I'll have to copy-paste and manually implement suggestions"
- **Form-Filling Assumption:** "I'll need to fill out task forms like every other tool"
- **Tool Fragmentation:** "Planning (Notion) and execution (separate app) are always separate"

**dumtasking Transforms the Model:**

**New Expectation: "AI Does Everything in One Place"**
- No copy-paste between tools → AI executes in the same interface
- No manual form-filling → AI extracts metadata from conversation
- No separate planning/execution → Chat → Kanban → Focus Mode in one flow

**New Belief: "AI Knows My Multi-Goal Context"**
- Not generic ChatGPT → AI remembers I have Startup + Dev + Japanese goals
- Scheduling considers goal distribution (Startup 60%, Dev 25%, Japanese 15%)
- AI proactively prevents goal neglect: "You haven't touched Japanese in 2 weeks"

**New Behavior: "Conversation-First Control"**
- Natural language: "Plan my week from all notes"
- Slash commands: `/plan-week`, `/whats-next`, `/optimize-today`
- Quick questions: "What should I work on?" → Instant suggestion + [Start] button
- Multi-turn refinement: "Move that to tomorrow" → AI adjusts immediately

**Where Users Might Get Confused:**

**1. Trust Barrier: "Can AI really DO things, not just suggest?"**
- **Solution:** First conversation explicitly shows tool execution
  - AI: "I'll add these tasks to your Kanban..." [Progress indicator] → "✅ Done! 6 tasks added"
  - Show immediate results in other views (Kanban updates visibly)

**2. Control Concern: "What if AI messes up?"**
- **Solution:** Preview before commit for major actions
  - Example: `/plan-week` → Shows full plan → [Confirm] or [Adjust] buttons
  - Always allow override: "Actually, move that to Thursday" → AI adjusts

**3. Command Discovery: "How do I know what AI can do?"**
- **Solution:** Autocomplete + suggested prompts
  - Type `/` → Autocomplete shows all commands
  - After AI response: Suggested follow-ups appear ("Want me to optimize today?")
  - Help command: `/help` or "What can you do?" → Shows capabilities

**4. Multi-Goal Complexity: "How does AI know to balance goals?"**
- **Solution:** Visual goal distribution + proactive alerts
  - AI shows: "Balanced across 3 goals: Startup 60%, Dev 25%, Japanese 15%" 
  - Pie chart visualization embedded in chat responses
  - Proactive: "Japanese goal has <10% this week. Want to rebalance?"

### Success Criteria

**Users Say "This Just Works" When:**

**1. Response Speed: Feels Immediate**
- **AI first token:** <2 seconds (streaming starts fast)
- **Full response streaming:** 5-10 seconds for complex operations
- **Tool execution:** Immediate visual feedback ("✓ Extracted 6 tasks")
- **Why Critical:** Slow responses break conversation flow, feel robotic

**2. Understanding: AI Gets Intent**
- **Natural language success rate:** 85%+ of requests interpreted correctly
- **Slash command execution:** 95%+ success (commands are explicit)
- **Context awareness:** AI remembers previous messages in conversation
- **Why Critical:** Users abandon if they have to rephrase multiple times

**3. Execution: AI Actually Does Things**
- **Action completion:** Commands result in database changes, not just suggestions
- **Immediate reflection:** Changes visible in Kanban/Calendar/Table within 1 second
- **Multi-step workflows:** `/plan-week` executes 5+ operations automatically
- **Why Critical:** This is the differentiator—execution, not just advice

**4. Conversational Flow: Feels Natural**
- **Multi-turn coherence:** AI remembers context across 5+ messages
- **Follow-up handling:** "Move that to tomorrow" → AI knows what "that" refers to
- **Refinement loop:** User can iterate: "Actually, make it high priority" → AI adjusts
- **Why Critical:** Conversation > forms is the core value proposition

**5. Transparency: Explainable AI**
- **Reasoning available:** Hover over any AI decision → tooltip explains "Why"
- **Ask why:** User can ask "Why did you schedule this here?" → AI explains
- **Confidence indicators:** "I'm 95% confident" vs "Not sure, please review"
- **Why Critical:** Trust requires understanding AI logic

**Users Feel Smart/Accomplished When:**

**Vague Question → Perfect Answer:**
- User: "What's next?"
- AI: "Based on your context: 'Prepare investor deck' (2h left, high priority, no blockers). You have 3 hours until next meeting—perfect fit. [Start Focus Mode]"
- **Feeling:** "It knows exactly what I need right now"

**Slash Command = Instant Workflow:**
- User types: `/plan-week`
- AI: [5 seconds later] "✅ Planned your week: 12 tasks across 3 goals, balanced workload"
- **Feeling:** "I just saved 2 hours of manual planning"

**AI Understands Multi-Goal Context:**
- AI proactively: "You've focused 80% on Startup this week. Japanese needs attention—15min today?"
- **Feeling:** "It actually understands I'm juggling multiple life goals, not just tasks"

**Feedback Mechanisms:**

**During AI Processing:**
- **Typing indicator:** "AI is thinking..." (3 animated dots)
- **Progress feedback:** "Analyzing 4 notes... Extracting tasks... Balancing workload..."
- **Streaming text:** Words appear in real-time (shows progress, feels alive)

**After AI Execution:**
- **Confirmation messages:** "✅ Done! 6 tasks added: 3 Startup, 2 Dev, 1 Japanese"
- **Visual updates:** Kanban/Calendar/Table update in background (visible if in split view)
- **Actionable buttons:** [View in Kanban] [Start Focus Mode] appear in chat

**On Success:**
- **Celebration (subtle):** Checkmark animation + positive language
- **Next steps:** Suggested prompts: "Want me to optimize today?" or "Need anything else?"

**On Error:**
- **Clear explanation:** "I couldn't find any tasks in that note. Try adding action words like 'need to', 'must', 'complete'."
- **Recovery options:** [Try Again] [Edit Note] [Ask for Help]

### Novel UX Patterns

**What Makes dumtasking's Core Experience Novel:**

**1. Conversational AI with Tool Execution (Novel in Productivity)**

**What's Different:**
- **Most AI chats (ChatGPT, Claude):** Provide advice → User implements manually
- **Some productivity tools (Motion AI):** AI suggests schedules → User confirms/rejects
- **dumtasking:** AI executes immediately through tool calling → Changes happen in real-time

**Why Novel:**
- First productivity tool where chat is primary control interface, not supplementary
- AI doesn't just suggest "you should schedule X for Monday"—it schedules X for Monday
- Conversation replaces button clicks and form-filling as primary interaction model

**User Education Strategy:**
- **First conversation:** Explicitly show execution
  - AI: "I'll add these to your Kanban... [Progress] → ✅ Added!"
  - Immediate visual proof in Kanban view
- **Onboarding flow:** Walk through `/plan` command → See tasks appear → "I did that, not just suggested"
- **Help command:** `/help` explains "I can execute commands, not just answer questions"

**Familiar Metaphor:**
- "Like Cursor's AI for coding, but for productivity—I don't just suggest, I implement"
- "Like having a personal assistant who actually does tasks, not just reminds you"

**2. Slash Commands as Prompt Templates + Tool Calling (Emerging Pattern)**

**What's Different:**
- **Cursor/Slack:** Slash commands trigger pre-built actions
- **Notion:** Type `/table` → Creates table block
- **dumtasking:** Type `/plan-week` → Fills prompt template → AI executes multi-step workflow with tool calling

**Why This Approach:**
- **Speed:** Slash commands faster than typing full sentences
- **Discovery:** Autocomplete shows what's possible
- **Flexibility:** Natural language ALSO works—commands are shortcuts, not requirements
- **Power:** Commands trigger complex workflows (plan week, optimize schedule, find blockers)

**Implementation Pattern:**
```
User types: /plan-week

[Autocomplete shows: /plan-week, /plan-today, /plan [note]]

User selects /plan-week →

AI receives: "Plan my entire week from all unprocessed notes, balance across my 3 goals (Startup, Dev, Japanese), respect my working hours (9 AM - 6 PM), and optimize for my energy patterns (complex tasks in mornings)."

AI executes: extract_tasks_from_notes() → optimize_schedule() → balance_goals() → insert_to_calendar()

AI responds: [Streaming] "✅ Planned your week: 12 tasks across 3 goals..."
```

**User Education:**
- **Type `/` anywhere:** Autocomplete appears with full command list
- **Quick action buttons:** Visual alternatives above chat input (click instead of typing)
- **Natural language fallback:** "Plan my week" also works—commands are optional

**3. Multi-Goal Orchestration (Completely Novel)**

**What's Different:**
- **All existing tools:** Single-project focus or flat task lists
- **dumtasking:** AI actively balances 3+ simultaneous life goals

**Why Novel:**
- No tool solves "focus on 1 goal, neglect 2 others" systematically
- AI doesn't just organize tasks—it ensures goal distribution (Startup 60%, Dev 25%, Japanese 15%)
- Proactive neglect alerts: "Japanese <10% this week—want to rebalance?"

**User Education:**
- **Goal distribution visualization:** Pie chart in AI responses shows balance
- **Proactive AI messages:** "I noticed Japanese hasn't been touched in 2 weeks. Add 15min today?"
- **Weekly review:** AI explicitly shows goal distribution trends

**Familiar Metaphor:**
- "Like a project manager who ensures you don't neglect any important area of your life"
- "Portfolio diversification, but for your life goals"

**4. Compassionate Accountability in Conversation (Novel)**

**What's Different:**
- **Traditional tools:** "Task overdue!" (guilt-inducing)
- **dumtasking:** "You deferred 3 evening tasks this week. Your energy is higher in mornings—want me to reschedule future tasks there?"

**Why Novel:**
- AI understands emotional context (evening motivation drops)
- Vietnamese philosophical quotes add cultural depth
- Non-judgmental language: "defer" not "failed"

**User Education:**
- First evening defer: AI explains "I'm here to help, not judge. Choose what works for you."
- Quote introduction: "Here's a reflection that helped me understand your journey..."
- Settings toggle: Can disable quotes if they don't resonate

**Established Patterns We Use (Not Novel, But Well-Executed):**

**1. Floating Chat Widget**
- **Proven:** Intercom, Drift, customer support chats
- **Our Twist:** Not support—it's primary control interface
- **Implementation:** Bottom-right, expandable, always accessible

**2. Preview Before Commit**
- **Proven:** GitHub code review, Motion schedule changes, Grammarly suggestions
- **Our Twist:** Preview shows AI reasoning, not just changes
- **Implementation:** Modal with editable preview + reasoning tooltips

**3. Streaming Responses**
- **Proven:** ChatGPT, Claude, Perplexity
- **Our Twist:** Streaming + tool execution (not just text)
- **Implementation:** Vercel AI SDK streaming with real-time tool calling

### Experience Mechanics

**Step-by-Step Flow: Conversational AI Orchestration**

**1. Initiation: How Users Start the Conversation**

**Primary Entry Points:**

**A. Floating AI Chat Widget (Always Visible)**
- **Location:** Bottom-right corner, similar to customer support chats
- **Visual:** Minimal icon (sparkle/chat bubble) with subtle pulse animation
- **States:**
  - Minimized: Small icon (40x40px)
  - Expanded: 400x600px panel (desktop), full-screen modal (mobile)
- **First-time hint:** Badge on icon: "Try /plan or ask me anything"

**B. Keyboard Shortcut (Power Users)**
- **Shortcut:** `Ctrl/Cmd+K` opens chat immediately
- **Inspiration:** Linear command palette, VS Code command palette
- **Behavior:** Opens chat with input focused, ready to type
- **Discovery:** Tooltip on hover shows shortcut

**C. Contextual Triggers (Proactive AI)**
- **After saving note:** Chat pulses + message preview: "I can help plan this note..."
- **Multiple unprocessed notes:** Proactive message: "I noticed 3 notes without tasks. Want me to plan them?"
- **Evening motivation drop:** "You have 4 tasks left today. What would help?"

**Invitation Design Elements:**

**Visual Cues:**
- **Icon animation:** Gentle pulse when AI has proactive suggestion
- **Badge:** Small number badge shows "unread" AI suggestions
- **Color:** Accent color (from zinc theme) makes it noticeable but not intrusive

**Onboarding (First-Time User):**
- **Step 1:** Animated arrow points to chat icon: "Start here—tell me what you need"
- **Step 2:** Example prompts appear in chat: "Try: `/plan` or ask 'What should I work on?'"
- **Step 3:** First command execution shows: "I just did that for you! ✅"

**2. Interaction: What Users Do and System Response**

**Interaction Pattern A: Natural Language Conversation**

**User Action:**
```
User clicks chat widget → Opens expanded panel
User types: "I just dumped a note about client work, can you extract tasks?"
User presses Enter
```

**System Response:**

**Phase 1: Processing (< 1 second)**
- **Immediate:** Message appears in chat as "User" bubble
- **AI typing indicator:** "AI is thinking..." with 3 animated dots
- **Behind the scenes:** AI analyzes context (current note, user's notes list, calendar state)

**Phase 2: Streaming Response (2-10 seconds)**
```
AI (text streams word-by-word):
"I'll extract tasks from your most recent note titled 'Client A Meeting Notes'.

[Inline preview appears as AI continues typing]

Found 4 tasks:
1. ✓ Call Client A about pricing (High priority, 30min, Today 10 AM)
   → Why: 'ASAP' keyword detected, scheduled in morning slot
   
2. ✓ Prepare proposal deck (High priority, 3h, Tomorrow 9 AM)
   → Why: Complex task, your most productive time
   
3. Review contract terms (Medium, 1h, Wednesday)
   
4. Follow-up email (Low, 15min, Friday)

[Add All Tasks] [Edit] [Explain Decisions] buttons appear
```

**Phase 3: User Response Options:**
- **Option 1:** Click [Add All Tasks] → Tasks inserted → Confirmation toast
- **Option 2:** Click [Edit] → Inline editing mode → Adjust priorities/dates → Confirm
- **Option 3:** Continue conversation: "Move the deck to Monday morning" → AI adjusts

**Interaction Pattern B: Slash Commands (Fast Workflow)**

**User Action:**
```
User opens chat (Cmd+K)
User types: /plan
[Autocomplete appears instantly]
```

**Autocomplete Interface:**
```
┌─────────────────────────────────────────┐
│ /plan                                   │ ← User typing
├─────────────────────────────────────────┤
│ 📝 /plan                                │ ← Matched commands
│    Extract tasks from current note      │    (fuzzy search)
│                                         │
│ 📅 /plan-week                           │
│    Plan entire week from all notes      │
│                                         │
│ 📆 /plan-today                          │
│    Plan just today from notes           │
│                                         │
│ 🎯 /plan [note-title]                  │
│    Plan specific note                   │
└─────────────────────────────────────────┘
```

**User selects `/plan-week` (arrow keys or click) → Presses Enter**

**System Response:**

**Behind the Scenes (Invisible to User):**
- Command expands to full prompt: "Plan my entire week from all unprocessed notes, balance across my 3 goals (Startup 60%, Dev 25%, Japanese 15%), respect working hours, optimize for energy patterns"
- AI receives context: All notes, current calendar, goal preferences, completion history

**Streaming Response:**
```
AI (streaming, 5-10 seconds):
"Planning your week from all unprocessed notes...

✓ Analyzed 4 notes (2 Startup, 1 Dev, 1 Japanese)
✓ Extracted 12 tasks
✓ Detected 3 dependencies
✓ Balanced workload across goals

Your Week:
📅 Monday (5h, Green ✓)
  • [Startup] Client A call (30min, 10 AM)
  • [Startup] Investor deck (3h, 2-5 PM)
  • [Japanese] N3 Review (15min, 5:45 PM)

📅 Tuesday (6h, Yellow ⚠)
  • [Dev] Java training (2h, 9-11 AM) ← Complex task, morning energy
  • [Startup] Marketing deck (3h, 2-5 PM)
  • [Japanese] Grammar practice (20min, 5:40 PM)
  
...

Goal Distribution: Startup 60% ✓ | Dev 25% ✓ | Japanese 15% ✓

[Add to Calendar] [Adjust Balance] [Optimize More]
```

**Interaction Pattern C: Quick Questions (Daily Use)**

**User Action:**
```
User opens chat (Cmd+K)
User types: "What should I work on next?"
```

**System Response (Fast, <3 seconds):**
```
AI (streaming):
"Based on your current context:

🎯 Recommended: 'Prepare investor deck' (Startup goal)
   • Priority: High
   • Time needed: 2 hours remaining (60% done)
   • Due: Tomorrow 9 AM
   • No blockers
   
Why this task:
✓ You have 3 hours until next meeting—perfect fit
✓ Your most productive time is now (Tuesday morning)
✓ Finishing today prevents tomorrow's overload

[Start Focus Mode] [Show Alternatives] [Defer to Tomorrow]
```

**User clicks [Start Focus Mode]:**
- **Immediate:** Fullscreen transition animation (500ms)
- **Focus Mode activates:** Task title + Pomodoro timer
- **PiP timer launches:** Floating timer appears
- **Chat minimizes:** But accessible via icon if needed

**3. Feedback: How Users Know They're Succeeding**

**Real-Time Feedback During Conversation:**

**A. Typing Indicators (Immediate)**
- **User message sent:** Checkmark appears (message received)
- **AI processing:** "AI is thinking..." + 3 animated dots
- **Tool calling:** Progress text updates: "Extracting tasks... Detecting priorities... Optimizing schedule..."

**B. Streaming Response (Progressive)**
- **Words appear in real-time:** Not all-at-once (feels alive, not robotic)
- **Partial results visible:** Task list builds as AI streams
- **Progress indicators:** "✓ Analyzed 4 notes" appears before task list

**C. Visual Confirmation (After Execution)**
```
AI: "✅ Done! Added 6 tasks:
     • 3 Startup tasks
     • 2 Dev tasks  
     • 1 Japanese task
     
You can see them in Kanban, Calendar, or Table views."

[View in Kanban →] button appears
```

**Cross-View Feedback (Real-time Sync):**
- **If user has Kanban open in split view:** Tasks appear immediately as AI adds them
- **Toast notification (if chat is full-screen):** "6 tasks added" slides in briefly
- **Badge on view tabs:** Kanban tab shows "+6" badge momentarily

**Transparency Feedback (Build Trust):**

**Reasoning Tooltips:**
- **Hover over any AI decision:** Tooltip appears
  - Example: Hover over "Tomorrow 9 AM" → "Complex task + your most productive time"
- **Click "Why?" link:** AI explains in chat
  ```
  User: "Why did you schedule the deck for tomorrow morning?"
  AI: "Three reasons:
       1. It's a complex task (3h estimate)
       2. Tomorrow 9 AM is your most productive time (based on history)
       3. Scheduling now prevents overload on Monday (already 5h scheduled)"
  ```

**Confidence Indicators:**
- **High confidence (>90%):** Green checkmark + "I'm confident this is correct"
- **Medium confidence (70-90%):** Yellow indicator + "Please review this one"
- **Low confidence (<70%):** Red indicator + "Not sure, please adjust"

**Error Handling & Recovery:**

**Scenario 1: No Tasks Found**
```
User: "/plan"
AI: "I didn't find any actionable tasks in this note. 

To help me extract tasks, try adding action words:
• 'Need to...'
• 'Must complete...'  
• 'Call...', 'Prepare...', 'Review...'

Want me to check a different note? [Browse Notes]"
```

**Scenario 2: API Failure**
```
AI: "⚠️ I couldn't connect to process that request (network error).

[Retry] [Try Offline Mode] [Report Issue]"
```

**Scenario 3: Ambiguous Request**
```
User: "Reschedule everything"
AI: "I want to help, but 'everything' is unclear. Did you mean:
     • All tasks today? (4 tasks)
     • All pending tasks? (12 tasks)
     • All tasks this week? (18 tasks)
     
Please clarify and I'll reschedule immediately."
```

**4. Completion: How Users Know They're Done**

**Conversation Ending Patterns:**

**Pattern A: Explicit Completion**
```
AI: "✅ All set! Your week is planned with 12 tasks balanced across 3 goals.

Next steps:
• View in Calendar to see your week visually
• Start today's first task in Focus Mode  
• Adjust anytime by asking me

[View Calendar] [Start Day] [Close Chat]"
```

**User clicks [Close Chat] or clicks elsewhere:**
- Chat minimizes with smooth animation
- Badge appears if AI has follow-up suggestions
- Conversation history persists (not lost)

**Pattern B: Multi-Turn Refinement**
```
User: "/plan-week"
AI: [Shows week plan]

User: "Move all dev tasks to mornings"
AI: "✓ Rescheduled 4 dev tasks to morning slots"

User: "Perfect, thanks"
AI: "You're welcome! Let me know if you need anything else. 😊"

[User closes chat or continues working]
```

**Pattern C: Transitioning to Action**
```
User: "What's my most urgent task?"
AI: "Call Client A - due in 3 hours [Start Now]"

User clicks [Start Now]:
→ Focus Mode activates (fullscreen)
→ Chat auto-minimizes
→ User is now executing, not planning
```

**Post-Conversation States:**

**Chat Minimized:**
- **Icon state:** Returns to default (no badge if no new suggestions)
- **History preserved:** User can reopen and see full conversation
- **Context maintained:** Next conversation remembers previous context

**Follow-Up Suggestions (Proactive AI):**
```
[2 hours later, after user completes 2 tasks]

Chat badge appears with "2"

User opens chat:
AI: "Great progress! You completed 2 tasks today.

You have 3 tasks left (2h total). Want me to:
• Optimize rest of your day?
• Suggest what to work on next?
• Review tomorrow's plan?

[Optimize Day] [What's Next] [I'm Good]"
```

**End-of-Day Check-In:**
```
[6 PM, user still has 2 pending tasks]

Chat notification:
AI: "You have 2 tasks remaining. Your energy is probably low by now.

Options:
• Defer both to tomorrow morning (recommended)
• Keep 1 light task for tonight (Japanese review - 15min)
• Mark as done if you finished them elsewhere

What works for you?"
```

**Continuous Conversation Loop:**
- **No hard "end":** Conversation is ongoing relationship
- **Context persists:** AI remembers multi-day conversations
- **Always accessible:** Cmd+K reopens instantly
- **Proactive when helpful:** AI initiates when it can add value, but isn't annoying

---

**[C] Continue** - Save content này vào document và move to visual foundation step
