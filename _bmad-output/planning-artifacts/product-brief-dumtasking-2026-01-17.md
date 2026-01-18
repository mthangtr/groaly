---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments: 
  - docs/brainstorm.md
date: 2026-01-17
author: mthangtr
---

# Product Brief: dumtasking

## Executive Summary

**dumtasking** is a personal AI-powered productivity companion that transforms the chaotic notes-to-tasks workflow into a seamless, emotionally intelligent system. Born from the insight that "planning works, but planning friction kills the habit," dumtasking eliminates the setup overhead that causes users to abandon task management systems while adding a unique layer of compassionate accountability that supports personal growth.

Unlike traditional task managers that treat productivity as a purely mechanical process, dumtasking understands the human emotional journey—the evening motivation drops, the guilt loops, and the need for both empathy and accountability. It's not just about getting things done; it's about growing as a person through consistent, sustainable productivity.

**Core Philosophy: "Vibe Tasking"**  
Just as "Vibe Coding" uses AI to handle the heavy lifting so developers can focus on creativity, "Vibe Tasking" uses AI to handle planning, scheduling, and organizing so users can focus on execution and growth. The AI becomes a personal assistant that knows your context, learns your patterns, and provides the right balance of support and challenge.

**Target Outcome:**  
Zero-friction planning (dump notes → instant AI plan) + integrated focus execution + philosophical insights that drive self-reflection and growth = sustainable productivity without guilt or burnout.

---

## Core Vision

### Problem Statement

Knowledge workers and personal productivity seekers face a critical workflow gap: they capture ideas and tasks in notes, but transforming those notes into actionable, well-scheduled plans requires significant manual effort across multiple tools and contexts.

**The Current Painful Workflow:**
1. Capture tasks in notes (iPhone Notes, random apps, paper)
2. Ask external AI (ChatGPT, Claude) how to organize and prioritize
3. Manually copy-paste results into Notion, Todoist, or iPhone Reminders
4. Lose motivation due to context switching, lack of AI context awareness, and setup friction
5. Experience guilt when tasks are skipped or incomplete
6. Abandon the planning habit, returning to reactive chaos

**The Real Pain:**
- **Planning friction kills habit**: Tools like Notion can work ("thực sự là bứt phá bản thân") but the time spent setting up structured task systems becomes the barrier to adoption
- **Evening motivation drop**: Users plan enthusiastically in the morning but lose drive by evening, creating a guilt loop
- **AI lacks personal context**: External AIs don't know working hours, energy patterns, or past completion behaviors
- **No integrated execution**: Planning tools lack focus modes; focus tools lack planning intelligence
- **Mechanical, not human**: Existing tools treat productivity as metrics and checkboxes, ignoring emotional and psychological dimensions

### Problem Impact

**Personal Cost:**
- 15-30 minutes lost daily to context switching and manual planning setup
- Consistent guilt and self-criticism when plans aren't followed
- Abandonment of planning systems that could genuinely help
- Reactive rather than proactive work habits
- Missed personal growth opportunities due to lack of self-reflection tools

**Broader Implications:**
- Personal productivity tools are becoming commoditized without addressing core human behavior patterns
- The gap between "knowing what to do" and "actually doing it" remains unsolved
- Emotional intelligence in productivity tools is virtually non-existent

### Why Existing Solutions Fall Short

**Notion**: Powerful but bloated
- Requires $20/month business plan for AI features
- No focus mode or execution layer
- Setup friction is high (manual database structures, properties, relations)
- Not designed for personal, rapid task capture

**Motion.ai / Reclaim.ai / Todoist + AI**: Auto-scheduling exists but lacks depth
- Generic AI scheduling without deep personal context
- No emotional intelligence layer (treat tasks mechanically)
- Expensive ($20-30/month)
- No philosophical or growth-oriented insights
- Focus on teams/enterprise, not personal journeys

**Blitzit**: Focus mode inspiration but incomplete
- Good execution layer (Focus Mode + Pomodoro)
- Weak planning and AI orchestration
- No insight or reflection capabilities

**iPhone Reminders / Simple Todo Apps**: Too basic
- No AI assistance
- No scheduling intelligence
- No insight or growth tracking

**Core Gap**: No tool combines zero-friction AI planning + integrated focus execution + emotionally intelligent insights + personal growth philosophy.

### Proposed Solution

**dumtasking** is a personal AI productivity companion that solves the entire workflow:

**1. Zero-Friction Planning Layer**
- Dump notes naturally (rich text editor with auto-save)
- Multiple AI planning entry points:
  - "Plan this" button on notes
  - Floating bubble to attach notes
  - Slash commands (/plan)
  - Quick prompt bubbles above chat input
- AI instantly generates actionable plan with tasks, priorities, dependencies, and schedules
- Conversational refinement: chat with AI to adjust plan based on current state
- Personal context awareness: AI learns working hours, energy patterns, task preferences, completion history

**2. Integrated Execution Layer**
- Focus Mode with PiP floating timer (Pomodoro integrated)
- Multiple view modes: Kanban, Calendar, Table (Notion-style database)
- Realtime sync across all views (Supabase Realtime)
- Smart Daily Suggestions: "What should I work on today?" with AI-curated recommendations
- Defend Focus Time: Protected slots with auto-scheduled breaks

**3. Compassionate Accountability Layer** *(Unique Differentiator)*

When tasks are skipped or motivation drops:
- **Options without judgment**: Defer to tomorrow, move to weekend, or cancel
- **Philosophical reflection**: Thoughtful quotes that prompt self-reflection:
  - "Vì sợ mình không phải là ngọc, nên tôi không dám khổ công mài giũa; lại vì có chút tin mình là ngọc, nên tôi không cam lòng đứng lẫn với đá sỏi."
  - "Con kiến cố gắng hết sức nhưng không thể làm lay cây đại thụ, nhưng nó muốn làm gì với cây đại thụ, đó chính là thái độ của nó. Vậy còn chúng ta..."
- **Behavior logging**: All actions recorded for pattern recognition
- **Task importance field**: "Why is this task important?" to maintain motivation
- **Pattern insights**: "Tuần này đã có mấy buổi tối bạn đã bỏ rồi, vậy còn mục tiêu cuối cùng của bạn bao giờ mới hoàn thành được? Mỗi bước đi nhỏ và kiên trì đều dẫn đến sự tiến bộ..."

**4. Growth-Oriented Insights**
- Daily, weekly, monthly, yearly reviews generated by AI
- Not just metrics—emotional and behavioral pattern analysis
- Suggestions for adjusting plans based on real behavior
- Chat with AI to discuss and refine strategies
- Celebrate wins with compassion, address failures with understanding and accountability

**Technical Foundation:**
- Next.js 15 + Supabase + Vercel (modern, scalable, affordable)
- OpenRouter for flexible LLM access (Claude 3.7 Sonnet, Gemini 2.0 Flash)
- Personal-first architecture (built for one user, can scale later)
- Full control over data and AI keys

### Key Differentiators

**1. "Vibe Tasking" Philosophy**  
The only tool designed around the principle that AI should handle planning overhead so users can focus on execution and growth. Not "AI-assisted task management" but "AI-driven personal productivity companion."

**2. Compassionate Accountability**  
First productivity tool to combine emotional intelligence with accountability:
- Understands evening motivation drops
- Responds with philosophical depth, not just reminders
- Tracks behavior patterns to provide context-aware support
- Balances empathy (for light tasks) with push (for important goals)

**3. Zero-Friction Planning**  
Eliminates the setup friction that kills planning habits:
- Natural note dumping → instant AI plan
- Multiple flexible entry points (button, bubble, slash commands, quick prompts)
- No manual database structuring or property configuration
- Conversational refinement instead of form-filling

**4. Integrated Execution + Insight Loop**  
Complete workflow in one app:
- Planning (AI-powered) → Execution (Focus Mode) → Reflection (Insights) → Growth (Pattern Learning)
- No context switching between 5+ apps
- Realtime sync across views (Notes, Kanban, Calendar, Table)

**5. Personal-First, Not Enterprise Bloat**  
Built for individual growth, not team collaboration:
- No unnecessary features for teams/sharing
- Optimized for personal context and learning
- Affordable (self-hosted option + BYOK for AI)
- Developer joy in building a tool you'll actually use daily

**6. Philosophical Depth**  
Only tool that treats productivity as a human journey:
- Quotes and reflections that prompt growth
- "Why is this important?" fields to maintain purpose
- Long-term goal tracking with emotional context
- Not just "what did you do?" but "how are you growing?"

**Why Now?**
- 2026 LLMs are reliable enough for structured task extraction (<10% error rate)
- Conversational AI interfaces are mature (Vercel AI SDK, streaming, tool calling)
- Personal productivity market is ready for emotional intelligence
- Developers want tools they control (BYOK, self-hosted options)
- "Vibe coding" mindset is expanding to other domains → "Vibe tasking" timing is perfect

---

## Target Users

### Primary User Profile: Multi-Goal Individuals

**dumtasking** is designed for individuals managing multiple significant life goals simultaneously—people who aren't just busy, but are actively building multiple aspects of their lives at once.

**Core Characteristics:**
- Juggling 2-5 major goals or identities simultaneously (developer + entrepreneur + learner, marketer + student + side projects, etc.)
- High ambition with limited time and energy
- Experience "goal neglect" - focusing on one goal causes others to disappear for weeks or months
- Capable of self-discipline but overwhelmed by orchestration complexity
- Prefer AI assistance over manual planning but need it integrated seamlessly
- Web-first workflow (productivity tools are part of daily work ritual like email)

**Problem Experience:**
- "Quá nhiều việc → không còn sức để làm các plan trong đầu"
- Context switching between goals without systematic balance
- Guilt loops when goals are neglected ("2 months without touching Japanese")
- Planning fatigue: Know what needs to be done but exhausted by organizing it

**Success Indicators:**
- No major goal neglected for extended periods
- Balanced progress across all life areas
- Sustainable productivity without burnout
- Self-compassion combined with accountability

---

### User Personas

#### Persona 1: mthangtr - The Multi-Goal Builder

**Profile:**
- Age: 25, Fresher Developer + Startup Founder
- Location: Vietnam
- Tech Savvy: High (builds own web apps)

**Three Simultaneous Identities:**
1. **Developer Growth:** Java training, coding skills, fresher → mid-level transition
2. **Startup Building:** Sales, marketing, customer conversations, product development  
3. **Japanese N3 Learner:** Language learning for future opportunities

**Typical Day:**
- **Morning:** Opens laptop at work → Gmail + dumtasking in browser tabs
- **Work Hours:** Switches between coding, customer calls, startup tasks
- **Evening:** Faces motivation drop, feels guilty about neglected goals
- **Weekly:** Reviews progress, realizes imbalanced focus (80% startup, 15% dev, 5% Japanese)

**Pain Points:**
- "Focus vào 1 cái thì bỏ qua 2 cái" - startup dominates, Java training and Japanese disappear
- 2 months without touching Japanese N3 - goal neglect causing anxiety
- Doesn't know how to orchestrate balance: "Không biết sắp xếp như nào"
- Overwhelm prevents execution of well-intentioned plans

**What mthangtr Needs from dumtasking:**
- **AI Orchestrator:** Automatically balances all 3 goals without manual planning
- **Compassionate Reminders:** "Startup đang tốt! Nhưng 2 tháng rồi chưa học tiếng Nhật - 15 phút hôm nay?"
- **Goal Distribution Insights:** "Startup 70%, Dev 20%, Japanese 10% this month → suggest rebalance?"
- **Philosophical Accountability:** Quotes that make him reflect without harsh judgment
- **Web-First Integration:** Always open alongside Gmail as part of work ritual

**Success Moment:**  
Opens dumtasking in the morning, sees balanced daily plan automatically generated with all 3 goals represented. Realizes: "Wow, I don't have to think about orchestration anymore—AI did it for me."

---

#### Persona 2: Sarah - The Career Switcher

**Profile:**
- Age: 28, Marketing Professional learning to code
- Goal: Transition from marketing to software development

**Three Simultaneous Identities:**
1. **Current Job:** Marketing manager responsibilities (pays the bills)
2. **Future Career:** Learning programming (bootcamp + online courses)
3. **Portfolio Projects:** Building side projects to prove skills

**Pain Points:**
- Work busy season → coding learning stops for weeks
- Side projects always "next week" but never start
- Guilt: "Khi nào mới switch được career nếu cứ thế này?"
- Plans weekend coding marathons but burns out

**What Sarah Needs:**
- Realistic scheduling: 30 min coding daily beats 8-hour weekend binges
- Compassionate accountability when work is overwhelming
- Long-term goal tracking: "You've made 40% progress on portfolio project in 2 months!"
- Energy-aware planning: Light learning tasks on busy work days, deep coding on weekends

---

#### Persona 3: Alex - The Indie Hacker

**Profile:**
- Age: 25, Solo Developer with multiple side projects
- Goals: Full-time job + 3 side projects + Content creation (blog/YouTube)

**Pain Points:**
- Jumps between projects → nothing ever ships
- Guilt about unfinished projects piling up
- Lack of focus: "Which project should I prioritize?"
- Burnout from trying to do everything simultaneously

**What Alex Needs:**
- **Project prioritization AI:** "Focus on Project A this month, defer B & C"
- **Shipping accountability:** "Project A: 80% done but stalled for 3 weeks—finish it?"
- **Context preservation:** When switching back to Project B, AI recalls where he left off
- **Insight-driven decisions:** "Projects with <50% completion take 3x longer—consider archiving?"

---

### User Journey: Web-First Daily Ritual

#### Morning - Work Start Ritual (The Hook Moment)

**Context:** User arrives at office or opens laptop to start workday

1. **Open tabs ritual:** Gmail + Slack + dumtasking (becomes part of daily routine like checking email)
2. **dumtasking Dashboard shows:**
   - "Good morning mthangtr! Here's your balanced focus for today:"
   - **Startup:** 2 tasks (4 hours) - meetings, customer calls
   - **Dev Learning:** 1 task (1 hour) - Java training module
   - **Japanese:** Quick review (15 min) - vocabulary flashcards
3. **Aha Moment:** "Wow, it balanced all my goals automatically—I don't have to think about orchestration!"

**Key Value:** Zero cognitive load for planning - AI handled the hard part of balancing multiple goals.

---

#### During Work Day - Capture & Execute

**Capture Mode:**
- Idea pops up during meeting → quickly dump note via floating bubble
- AI auto-categorizes: "This looks like a startup task—added to backlog"
- No context switching—stays in flow

**Execution Mode:**
- Between meetings, checks "What should I work on next?"
- AI suggests based on time available: "30 min until next meeting → perfect for Japanese flashcards"
- Clicks task → enters Focus Mode with Pomodoro timer

**Context Switching:**
- Moves from coding (dev goal) to customer call (startup goal)
- dumtasking tracks context switches for insights
- No manual status updates needed—AI infers from behavior

---

#### Evening - Motivation Drop (Critical Moment)

**Scenario:** 7 PM, sees task list, doesn't want to do anything, feels guilty

**dumtasking Response:**
1. **Non-judgmental options:**
   - Defer to tomorrow
   - Move to weekend
   - Cancel (with reason logging)

2. **Philosophical Reflection:**
   - Quote appears: "Vì sợ mình không phải là ngọc, nên tôi không dám khổ công mài giũa; lại vì có chút tin mình là ngọc, nên tôi không cam lòng đứng lẫn với đá sỏi."
   - Pause for self-reflection
   - Options remain available (no pressure)

3. **Behavior Logging:**
   - Action recorded for pattern analysis
   - No shame—just data for growth insights

4. **Compassionate Suggestion:**
   - "You skipped evening tasks 3 times this week. Consider scheduling important tasks in mornings when your energy is higher?"

**Outcome:** User feels understood, not judged. Chooses to defer tasks without guilt, knowing the system is learning and will suggest better scheduling.

---

#### Weekly/Monthly Review - Insight & Growth

**Sunday Evening Ritual:**

**AI-Generated Review Shows:**

1. **Goal Distribution Insight:**
   - "This month: Startup 80%, Dev Learning 15%, Japanese 5%"
   - Visualization: Pie chart showing imbalance
   - "Japanese: 2 months with <10% attention → goal neglect detected"

2. **Pattern Recognition:**
   - "Evening tasks skipped 12/20 times → schedule important work in mornings"
   - "Focus Mode sessions: 85% completion rate (excellent!)"
   - "Most productive: Tuesday/Thursday mornings"

3. **Rebalance Conversation:**
   - User chats with AI: "Tôi muốn focus startup nhưng không muốn bỏ tiếng Nhật hoàn toàn"
   - AI suggests: "How about: Startup 60%, Dev 25%, Japanese 15% next month?"
   - AI proposes specific schedule: "15 min Japanese daily + 1-hour session on weekends?"

4. **Philosophical Reflection:**
   - "Tuần này đã có mấy buổi tối bạn đã bỏ rồi, vậy còn mục tiêu cuối cùng của bạn bao giờ mới hoàn thành được? Mỗi bước đi nhỏ và kiên trì đều dẫn đến sự tiến bộ..."
   - Prompts self-reflection and commitment renewal

5. **Celebration:**
   - "You completed 23 tasks this week—18 more than last month!"
   - "Your consistency is building. Keep going! 💪"

**Outcome:** User sees clear data, feels accountable but supported, makes informed adjustments to next month's balance.

---

#### Long-Term - Sustainable Multi-Goal Progress

**3 Months In:**
- No goal neglected >2 weeks
- Japanese N3: Consistent 15 min daily = real progress
- Startup: Major milestones hit without burnout
- Dev skills: Steady growth from small daily practice

**Key Insight from dumtasking:**
- "Your goal balance: Startup 65%, Dev 20%, Japanese 15% over 3 months"
- "Japanese progress: 40% to N3 completion despite being lowest priority—consistency works!"
- "Completion rate increased from 60% → 78% with AI scheduling"

**User Reflection:**
"I finally have a companion that understands I'm not one person with one goal—I'm three people trying to coexist. dumtasking orchestrates that chaos into sustainable progress."

---

## Success Metrics

### User Success Definition

Success for dumtasking is measured by one core outcome: **users consistently make progress on all their major life goals without neglect, overwhelm, or burnout**, while maintaining the flexibility to adapt when context changes.

For our primary user (multi-goal individuals like mthangtr), success means:
- **Consistency:** All 3+ major goals receive attention regularly (no 2-month neglect)
- **Completion:** Tasks and goals are completed, not just planned
- **Adaptability:** When urgent tasks emerge (boss assigns rush work), the system reorganizes seamlessly while maintaining long-term goal progress
- **Sustainability:** Productivity is maintained without guilt loops or burnout
- **Execution:** Plans are followed through, not abandoned

---

### Primary Success Metrics

#### 1. Multi-Goal Consistency (Core Metric)
**Definition:** All major goals receive consistent attention without extended neglect.

**Measurement:**
- **Target:** No goal receives <10% time allocation for >2 consecutive weeks
- **Current Baseline:** 2 months (8 weeks) Japanese neglect when focused on startup
- **Success Indicator:** 90% reduction in neglect duration (8 weeks → <2 weeks maximum)

**Why This Matters:** Prevents the "focus on 1, lose 2" problem that causes guilt and goal abandonment.

---

#### 2. Task Completion Rate
**Definition:** Percentage of planned tasks completed within intended timeframe.

**Measurement:**
- **Target:** 70%+ completion rate
- **Industry Baseline:** ~40% for manual task managers
- **Success Indicator:** 75% improvement over baseline

**Why This Matters:** Plans mean nothing if not executed. High completion = AI scheduling is realistic and user is following through.

---

#### 3. Adaptive Re-Organization Success
**Definition:** When urgent/unexpected tasks emerge, system successfully reorganizes without derailing long-term goals.

**Measurement:**
- **Scenario:** Boss assigns urgent task → dumtasking reorganizes same-day schedule + adjusts week plan
- **Target:** 80%+ of urgent tasks handled without causing >1 day delay to other goals
- **Success Indicator:** Weekly goal progress maintained despite 2-3 urgent interruptions

**Why This Matters:** Real life is unpredictable. Success = handling chaos without losing sight of long-term goals.

---

#### 4. Daily Engagement & Ritual Adoption
**Definition:** dumtasking becomes part of daily work ritual (like opening Gmail).

**Measurement:**
- **Target:** App opened 5+ days per week
- **Usage Pattern:** Included in morning "open tabs" routine (Gmail + Slack + dumtasking)
- **Success Indicator:** 80%+ weeks with 5+ active days over 3-month period

**Why This Matters:** If not used daily, it's not solving the orchestration problem. Ritual = habit = sustained value.

---

#### 5. Focus Mode Adoption
**Definition:** Users leverage Focus Mode for deep work execution, not just planning.

**Measurement:**
- **Target:** 3+ Focus Mode sessions per week
- **Completion Rate in Focus Mode:** 85%+ (tasks started in Focus Mode are completed)
- **Success Indicator:** Focus Mode becomes preferred execution environment

**Why This Matters:** Bridges planning → execution gap. Focus Mode = users aren't just organizing, they're doing.

---

#### 6. AI Trust & Plan Acceptance
**Definition:** Users trust and follow AI-generated plans without extensive manual editing.

**Measurement:**
- **Target:** 70%+ of AI suggestions accepted as-is or with minor tweaks
- **Major Edits:** <20% of plans require significant reorganization
- **Success Indicator:** User treats AI as trusted orchestrator, not just suggestion engine

**Why This Matters:** Low acceptance = AI doesn't understand user context. High acceptance = "Vibe Tasking" philosophy working.

---

#### 7. Goal Distribution Balance
**Definition:** Time allocation across major goals matches user's intended priorities.

**Measurement:**
- **Example Target for mthangtr:** Startup 60%, Dev Learning 25%, Japanese 15%
- **Tolerance:** ±10% variance acceptable
- **Monthly Review:** User + AI discuss and adjust targets based on life context
- **Success Indicator:** Actual distribution matches intended within tolerance 80%+ of the time

**Why This Matters:** Not all goals are equal priority, but all must receive attention. Balance ≠ equal, balance = intentional allocation.

---

#### 8. Insight Engagement & Behavioral Learning
**Definition:** Users engage with weekly/monthly insights and act on AI suggestions.

**Measurement:**
- **Insight Read Rate:** 70%+ of generated insights opened within 48 hours
- **Action Rate:** 50%+ of AI suggestions result in schedule/goal adjustments
- **Pattern Recognition:** AI identifies ≥3 behavioral patterns (e.g., evening skip rate, productive hours) per user within 1 month
- **Success Indicator:** Insights drive meaningful behavior changes, not just data consumption

**Why This Matters:** Insights = the "thương hoặc kiểm điểm bản thân" layer. Must be actionable, not just informational.

---

#### 9. Compassionate Accountability Impact
**Definition:** When motivation drops or tasks are skipped, users feel supported rather than judged.

**Measurement:**
- **Philosophical Quote Resonance:** Qualitative feedback - do quotes prompt reflection?
- **Guilt Reduction:** User self-reports feeling less guilty when deferring/canceling tasks
- **Behavior Logging Acceptance:** Users willingly log skip reasons (indicates trust)
- **Success Indicator:** Evening motivation drops don't spiral into guilt → abandonment

**Why This Matters:** Unique differentiator. If this fails, dumtasking becomes another guilt-inducing task manager.

---

### Business Objectives

#### Phase 1: Personal Validation (Months 1-3)

**Objective:** Prove dumtasking solves the multi-goal orchestration problem for mthangtr personally.

**Success Criteria:**
1. **Personal Adoption:** mthangtr uses dumtasking 5+ days/week for 3 consecutive months
2. **Goal Neglect Eliminated:** Japanese N3 receives minimum 15 min daily (no more 2-month gaps)
3. **Developer Joy:** Building and using dumtasking is energizing, not draining
4. **Workflow Integration:** dumtasking replaces previous fragmented workflow (external AI + Notion/iPhone reminders)
5. **Measurable Impact:** Completion rate >70%, all 3 goals show progress monthly

**Business Validation:** If personal use fails or feels like "just another tool," pause and reassess before expanding.

---

#### Phase 2: Code Quality & Portfolio Value (Months 3-6)

**Objective:** dumtasking becomes a portfolio-worthy project demonstrating full-stack + AI integration expertise.

**Success Criteria:**
1. **Code Quality:** Clean, maintainable codebase - proud to show in interviews/portfolio
2. **Architecture:** Demonstrates mastery of Next.js 15, Supabase, Vercel AI SDK, Realtime systems
3. **AI Integration:** Showcases advanced LLM usage (structured output, tool calling, context management)
4. **Performance:** <2s page loads, <1s realtime sync, <5s AI task extraction

**Business Value:** Even if never commercialized, serves as powerful portfolio piece for developer career growth.

---

#### Phase 3: Optional Commercial Exploration (Month 6+)

**Objective:** If personal use is wildly successful, explore sharing with similar users.

**Success Criteria:**
1. **Word of Mouth:** 5+ people ask "What tool are you using?" unprompted
2. **Beta Interest:** 10 users willing to try beta version
3. **Cost Efficiency:** Monthly operating cost <$50 (sustainable at personal scale)
4. **Differentiation Validated:** Beta users say "this is different from [Motion/Todoist/etc.]"

**Commercial Threshold:** Only pursue if Phase 1 & 2 objectives fully met. Avoid premature scaling.

---

### Key Performance Indicators (KPIs)

#### Leading Indicators (Predict Success)

1. **First Week Retention:** 80%+ - User still using after 7 days
2. **AI Plan Acceptance Rate:** 70%+ - Early trust in AI orchestration
3. **Focus Mode Trial:** 3+ sessions in first 2 weeks - Execution layer adopted
4. **Morning Ritual Formation:** 10/14 days opening dumtasking with Gmail - Habit forming

#### Lagging Indicators (Confirm Success)

5. **3-Month Retention:** 90%+ - Sustained value, not novelty
6. **Goal Neglect Elimination:** 0 goals neglected >2 weeks in 3-month period
7. **Completion Rate:** 70%+ sustained over 12 weeks
8. **Self-Reported Impact:** "dumtasking solved my orchestration problem" (qualitative)

#### Health Metrics (Prevent Issues)

9. **AI Cost Per User:** <$10/month - Sustainable economics
10. **System Reliability:** 99.5%+ uptime - Users can rely on it
11. **Performance:** 95%+ of actions <2 seconds - No friction
12. **User Effort:** Average daily interaction <10 minutes - Low overhead, high value

---

### Success Thresholds & Decision Points

**3-Month Review (Critical Checkpoint):**

**Go/No-Go Decision:**
- ✅ **GO (Continue Development):** If 6+ of Primary Success Metrics met
- 🟡 **PIVOT (Adjust Strategy):** If 3-5 metrics met - identify what's not working
- ❌ **STOP (Fundamental Rethink):** If <3 metrics met - core assumptions may be wrong

**Key Questions at 3 Months:**
1. Is mthangtr using dumtasking daily without forcing himself?
2. Has goal neglect (Japanese) been eliminated?
3. Does AI orchestration feel like magic or burden?
4. Is completion rate meaningfully better than before?
5. Does the compassionate accountability layer resonate emotionally?

**Success = "I can't imagine going back to my old workflow"**

---

### Long-Term Success Vision (12 Months)

**Ultimate Success Indicators:**

1. **Sustained Multi-Goal Progress:**
   - Japanese N3: Passed or near completion
   - Startup: Meaningful milestones achieved
   - Dev Skills: Measurable growth (fresher → solid mid-level trajectory)

2. **Behavioral Transformation:**
   - Planning is effortless (AI orchestrates)
   - Execution is consistent (Focus Mode habit)
   - Reflection is insightful (weekly reviews drive growth)
   - Guilt is replaced with self-compassion + accountability

3. **Portfolio & Career Impact:**
   - dumtasking featured prominently in portfolio
   - Demonstrates full-stack + AI expertise
   - Opens doors to job opportunities or startup credibility

4. **Optional Commercial Validation:**
   - 100+ beta users if commercialized
   - 80%+ user satisfaction
   - Profitable or break-even operations
   - Word of mouth drives organic growth

**The North Star Metric:**  
"Multi-goal individuals consistently make progress on all major life goals without neglect, overwhelm, or burnout."

If this metric is achieved, everything else (completion rates, engagement, commercial success) will follow naturally.

---

## MVP Scope

### Scope Philosophy: Full-Feature Personal Validation

**dumtasking MVP is a complete, production-ready application** designed for personal use validation, not a minimal proof-of-concept. The scope includes all features necessary to solve the multi-goal orchestration problem comprehensively, serving as:

1. **Personal Productivity Solution:** Full feature set to solve mthangtr's real workflow needs (not a toy)
2. **Coding Agent Capability Test:** Validates AI-assisted development with substantial, real-world scope
3. **Portfolio Showcase:** Demonstrates full-stack + AI integration expertise with production-quality code

**MVP Strategy:** Build complete → Validate personally (3 months) → Refine → Optionally expand

This approach prioritizes personal value and learning over premature market testing.

---

### Core Features (All Included in MVP)

#### Phase 1: Core Foundation (Weeks 1-3)

**1. Rich Text Note Storage & Editor**
- Tiptap-based rich text editor with formatting (bold, italic, lists, headings)
- Auto-save every 2 seconds (debounced)
- Markdown shortcuts support
- Notes list view with search and filter
- Character/word count
- Responsive design (desktop-optimized, mobile-responsive)
- Paste support from any source

**Value:** Zero-friction brain dump - the input layer for all task orchestration.

---

**2. User Authentication & Profile Setup**
- Supabase Auth with magic links
- Profile setup: Name, timezone (auto-detected), working hours (default 9-6 PM)
- User preferences storage
- Settings page for customization

**Value:** Personalized experience with context awareness from day one.

---

**3. Database Schema & Architecture**
- Supabase PostgreSQL with tables: `users`, `notes`, `tasks`, `protected_slots`, `chat_messages`, `weekly_reviews`, `focus_sessions`
- pgvector extension for embeddings (Knowledge Graph)
- Row-level security policies
- Database migrations

**Value:** Robust, scalable foundation for all features.

---

#### Phase 2: AI Intelligence (Weeks 4-6)

**4. AI Agents Task Extraction & Orchestration**
- Multiple entry points: "Plan this" button, floating bubble, slash commands (/plan), quick prompt bubbles
- Vercel AI SDK + OpenRouter (Claude 3.7 Sonnet, Gemini 2.0 Flash)
- Structured output via Zod schemas: tasks with priorities, time estimates, dependencies, schedules
- Personal context integration: working hours, energy patterns, task preferences, completion history
- AI logic: Smart prioritization, workload balancing, dependency detection, time-aware scheduling

**Value:** The core "magic" - transforms notes into actionable, balanced plans instantly.

---

**5. AI Chat Assistant (Conversational Task Manager)**
- Floating chat widget (bottom-right, expandable)
- Context-aware: Access to all notes, tasks, calendar state, user preferences
- Quick action commands: `/plan-week`, `/optimize-today`, `/whats-next`, `/find-blockers`, `/prep-tomorrow`, `/summarize-week`
- Flexible chat interactions: Extract tasks, summarize work, smart queries, reschedule, explain, quick edits
- Tool calling: `extract_tasks()`, `update_task()`, `search_tasks()`, `reschedule_tasks()`, `generate_summary()`, `optimize_schedule()`, `find_blockers()`, `suggest_next_task()`
- Streaming responses via Vercel AI SDK
- Message history persistence

**Value:** Unified control center - "Vibe Tasking" interface where AI handles orchestration through conversation.

---

**6. Smart Daily Suggestions (Morning Dashboard)**
- Personalized morning greeting
- AI-curated top 3 tasks based on: due/overdue, high priority, no blockers, realistic time, energy match
- Quick insights: overdue tasks, blocked tasks, yesterday's wins
- Suggested schedule with time estimates
- One-click actions: "Start [Task]", "Reschedule overdue", "Show all tasks"
- Adaptive suggestions throughout the day

**Value:** Answers "What should I work on today?" - eliminates decision paralysis.

---

**7. Knowledge Graph / Related Tasks (Smart Connections)**
- AI-generated embeddings (OpenAI text-embedding-3-small)
- pgvector similarity search for related tasks
- Auto-linking: Explicit dependencies, semantic similarity, shared entities
- Related Tasks panel: Dependencies, dependent tasks, similar tasks, from same note
- Smart suggestions when creating tasks

**Value:** Context preservation and dependency intelligence - prevents missed connections.

---

**8. Defend Focus Time / Protected Slots**
- Settings UI for protected slots: title, days, time range, type, recurring pattern
- AI scheduling respects protected slots with manual override warnings
- Auto-schedule breaks: 15-min after 2h, 30-min lunch, 10-min stretch every 90min
- Calendar visualization: Protected slots (green), auto-breaks (light blue)
- Weekly overview: Protected hours tracked, compliance rate

**Value:** Reclaim.ai-style protection - prevents overwork and maintains sustainable productivity.

---

#### Phase 3: Views & Interactions (Weeks 7-9)

**9. Realtime Kanban Board**
- Three columns: To Do / In Progress / Done (customizable)
- Alternative view: Today / This Week / Backlog
- Drag-and-drop with dnd-kit
- Supabase Realtime sync (<1 second)
- Task cards: title, priority badge, time estimate
- Color-coding: red (high), yellow (medium), gray (low)
- Quick filters, bulk actions, card density toggle, swimlanes

**Value:** Visual task management with real-time sync across devices.

---

**10. AI-Powered Calendar View**
- FullCalendar or custom component (week view primary, month view optional)
- Tasks auto-assigned based on: priority, dependencies, estimated time, working hours, energy optimization
- Drag-and-drop to reschedule
- Visual density indicator: Green (<6h), Yellow (6-8h), Red (>8h)
- "Optimize my week" button - AI redistributes tasks
- Smart warnings for overload
- Time blocks visualization

**Value:** AI-optimized scheduling - balances workload automatically.

---

**11. Table/Database View (All Tasks Hub)**
- TanStack Table v8 - Notion-style database
- Columns (customizable): Title, Status, Priority, Due Date, Estimated Time, Source Note, Dependencies, Tags, Dates, Time Spent
- Sortable columns, multi-select filters, full-text search
- Bulk actions: Change status/priority, tags, reschedule, mark complete, delete
- Inline editing with debounced auto-save
- Column customization: show/hide, reorder, resize
- Virtual scrolling for >100 tasks
- CSV/JSON export

**Value:** Power user view for advanced task management and bulk operations.

---

**12. Realtime Sync Across Views**
- Supabase Realtime subscriptions on `notes` and `tasks` tables
- Changes broadcast within 500ms
- Optimistic UI updates
- Visual sync indicators
- Conflict resolution (last-write-wins with notification)

**Value:** Data consistency across all views without manual refreshes.

---

#### Phase 4: Execution & Polish (Weeks 10-12)

**13. Focus Mode / Blitz Mode (Execution Layer)**
- Entry points: Select task, AI Chat command, Daily Suggestions
- Fullscreen API - immersive, distraction-free
- Minimalist UI: Task content, Timer, Progress bar, dark background
- PiP Floating Timer (Picture-in-Picture API): 200x100px, stays on top, works across apps
- Pomodoro Timer: 25 min work / 5 min break (customizable), long break after 4 pomodoros
- Ambient sounds (optional): White Noise / Rain / Coffee Shop / Forest / Ocean
- Distraction prevention: Block notifications, tab title indicator, visibility tracking
- Task completion: Celebration animation, sound effect, summary, auto-move to Done

**Value:** Blitzit-style execution environment - helps complete tasks, not just plan them.

---

**14. Compassionate Accountability Layer**
- Evening motivation drop handling: Non-judgmental options (defer, move, cancel)
- Philosophical quotes for reflection
- Behavior logging for pattern analysis
- Compassionate suggestions based on patterns
- Task importance field: "Why is this important?"
- Pattern insights with emotional context

**Value:** Unique differentiator - emotional intelligence in productivity tool.

---

**15. Weekly AI Review (Retrospective & Planning)**
- Auto-generated every Sunday evening (8 PM user's timezone)
- Report sections: Completion rate, goal distribution, pattern recognition, bottlenecks, time analysis, overdue rollover, next week suggestions, productivity insights
- Delivered via in-app notification + optional email
- Accessible in Reviews archive (last 12 weeks)
- Interactive: Click suggestions to auto-apply

**Value:** Motion/Reflect-style retrospectives - drives continuous improvement.

---

**16. Time Tracking (Optional, Background)**
- Settings toggle: Enable/Disable (default OFF)
- Automatic tracking: Auto-start/pause/stop, background timer
- Compare estimated vs actual with color-coding
- AI learning from history (after 10+ tasks)
- Weekly review integration
- Privacy & control: Delete data, manual adjustments, opt-in only

**Value:** Non-intrusive insights to improve time estimates over time.

---

**17. Settings & Customization**
- Profile: Name, timezone, working hours, energy levels
- AI Preferences: Choose LLM model (Claude 3.7, Gemini 2.0)
- API Keys (Advanced): BYOK for OpenRouter/OpenAI
- Privacy: Toggle analytics, data export (JSON), account deletion
- Protected Slots, Pomodoro, Focus Mode preferences
- Time tracking toggle

**Value:** Tailored experience with full control over data and AI.

---

**18. UI/UX Polish**
- shadcn/ui components (mira style, zinc theme)
- Animations: Celebrations, drag-and-drop feedback, sync indicators
- Loading states, error handling, toast notifications
- Responsive design across devices
- Accessibility: Keyboard navigation, screen reader support

**Value:** Professional, polished user experience.

---

**19. Performance Optimization**
- Caching: AI responses (24h), task embeddings, weekly reviews
- Virtual scrolling for large lists (react-virtual)
- Debounced auto-save
- Edge functions for AI calls (Vercel)
- Rate limiting: 50 AI messages/hour, 100 API requests/min
- Optimistic UI, code splitting, lazy loading

**Value:** Fast, responsive app that scales with usage.

---

**20. PWA Setup (Offline Mode)**
- Service worker for offline functionality
- Offline draft notes with sync queue
- Install prompt for desktop/mobile
- Background sync when reconnected
- Cache strategies for static assets

**Value:** Works offline - productivity doesn't stop when internet drops.

---

### Out of Scope for Full-Feature MVP

The following are explicitly **not included** in the personal validation phase:

**Multi-User & Collaboration:**
- ❌ Team workspaces, task sharing, real-time co-editing, project collaboration, permissions

**Rationale:** Personal-first focus. Multi-user adds 3-5x complexity.

---

**Voice & Multi-Modal Input:**
- ❌ Voice note capture, speech-to-text, image/PDF OCR, audio recording

**Rationale:** Text-first is sufficient and more reliable.

---

**External Integrations:**
- ❌ Two-way calendar sync, meeting notes, email integration, Slack/Teams, Zapier/Make.com, browser extension

**Rationale:** dumtasking is single source of truth. External integrations add fragile dependencies.

---

**Advanced AI Features:**
- ❌ Custom LLM fine-tuning, voice-based AI, advanced NLP, predictive estimation, AI-generated descriptions

**Rationale:** OpenRouter's LLM routing is sufficient. Focus on reliable structured output.

---

**Complex Workflow Automation:**
- ❌ IFTTT-style rules, custom workflow builders, advanced dependency graphs, automated delegation

**Rationale:** Keep AI intelligence conversational, not rule-based.

---

**Advanced Analytics & Reporting:**
- ❌ Custom dashboards, advanced charting, BI tools export, historical trend analysis, predictive analytics

**Rationale:** Weekly AI review is sufficient for insights.

---

**Mobile Native Apps:**
- ❌ React Native iOS/Android, Flutter, platform-specific features

**Rationale:** PWA provides 90% of mobile experience.

---

**Monetization & Commercial Features:**
- ❌ Payment processing, subscription management, usage-based pricing, feature gating, team billing

**Rationale:** Personal use first. Commercial exploration only after 6+ months validation.

---

### MVP Success Criteria

The Full-Feature MVP is considered **successful** if it achieves the following within **3 months** of personal use:

#### User Adoption (Personal Validation)
1. ✅ Daily Ritual Formation: 5+ days/week for 12 consecutive weeks
2. ✅ Workflow Replacement: Fully replaces old fragmented workflow
3. ✅ Can't Go Back: Old workflow feels painful

#### Core Problem Solution
4. ✅ Goal Neglect Eliminated: No goal <10% attention for >2 weeks
5. ✅ Multi-Goal Balance: All 3 goals show monthly progress
6. ✅ Japanese N3 Progress: 15 min daily maintained

#### Feature Adoption
7. ✅ AI Trust: 70%+ plans accepted
8. ✅ Focus Mode Usage: 3+ sessions/week, 85%+ completion
9. ✅ Insight Engagement: 70%+ reviews read within 48h

#### Behavioral Impact
10. ✅ Completion Rate: 70%+ sustained
11. ✅ Compassionate Accountability: Evening drops handled without guilt
12. ✅ Adaptive Success: 80%+ urgent tasks handled without derailing goals

#### Technical & Performance
13. ✅ System Reliability: 99.5%+ uptime
14. ✅ Performance: 95%+ actions <2 seconds
15. ✅ Cost Efficiency: <$50/month

#### Qualitative Validation
16. ✅ Developer Joy: Building/using is energizing
17. ✅ Portfolio Value: Code quality demonstrable
18. ✅ Self-Reported Impact: "Solved my orchestration problem"

**Go/No-Go at 3 Months:**
- ✅ GO: 14+ criteria met → Refine & expand
- 🟡 PIVOT: 8-13 met → Adjust strategy
- ❌ STOP: <8 met → Fundamental rethink

**Ultimate Test:** "Would I pay $20/month for this if someone else built it?"

---

### Future Vision (Post-Personal Validation)

#### Phase 2: Code Quality & Open Source (Months 4-6)
- Comprehensive test coverage, documentation, refactoring, security audit
- Open source selected components

#### Phase 3: Controlled Beta (Months 7-12)
- 10 beta users, qualitative feedback, comparative metrics
- Onboarding flow, video tutorials

#### Phase 4: Commercial Exploration (Year 2)
- Freemium SaaS ($10/month) or Lifetime license ($149) or Portfolio/job opportunities
- Only if 100+ unprompted requests

#### Phase 5: Platform Ecosystem (Year 3+)
- API, plugin marketplace, white-label, multi-language, native apps
- Threshold: 5,000+ users, profitable

---

### Timeline & Roadmap

**Full-Feature MVP Development: 12-14 weeks**

- **Phase 1:** Core Foundation (Weeks 1-3)
- **Phase 2:** AI Intelligence (Weeks 4-6)
- **Phase 3:** Views & Interactions (Weeks 7-9)
- **Phase 4:** Execution & Polish (Weeks 10-12)
- **Phase 5:** Testing & Launch (Weeks 13-14)

**Post-Launch:** 3-month personal validation before expansion decisions.

---

### Development Philosophy

**"Build Complete, Validate Personally, Refine Ruthlessly, Expand Cautiously"**

This approach prioritizes:
1. **Personal Value:** Build what you need
2. **Learning:** Test AI-assisted development with real scope
3. **Quality:** Portfolio-grade code from day one
4. **Sustainability:** Avoid premature scaling
5. **Optionality:** Keep commercial expansion optional

**Success = A tool you use daily that solves your real problem.**  
Everything else is a bonus.

