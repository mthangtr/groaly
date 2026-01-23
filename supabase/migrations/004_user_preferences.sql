-- Add user preferences columns to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS focus_reminders BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS daily_planning_reminder BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS compact_mode BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS show_quotes BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS llm_model TEXT DEFAULT 'anthropic/claude-haiku-4.5',
ADD COLUMN IF NOT EXISTS pomodoro_work_minutes INTEGER DEFAULT 25,
ADD COLUMN IF NOT EXISTS pomodoro_short_break_minutes INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS pomodoro_long_break_minutes INTEGER DEFAULT 15,
ADD COLUMN IF NOT EXISTS pomodoro_cycles_before_long_break INTEGER DEFAULT 4;

-- Add comment to explain the preferences
COMMENT ON COLUMN public.users.llm_model IS 'Default LLM model for AI features';
COMMENT ON COLUMN public.users.pomodoro_work_minutes IS 'Duration of focus/work sessions';
COMMENT ON COLUMN public.users.pomodoro_short_break_minutes IS 'Duration of short breaks between work sessions';
COMMENT ON COLUMN public.users.pomodoro_long_break_minutes IS 'Duration of long breaks after multiple cycles';
COMMENT ON COLUMN public.users.pomodoro_cycles_before_long_break IS 'Number of work cycles before a long break';
