# Weekly Review Cron Edge Function

Auto-generates weekly reviews for all active users every Sunday at 8 PM.

## Setup

### 1. Deploy Edge Function

```bash
supabase functions deploy weekly-review-cron --no-verify-jwt
```

Note: `--no-verify-jwt` is required because this is called by Supabase's scheduler, not by users.

### 2. Set Environment Variables

In Supabase Dashboard → Edge Functions → weekly-review-cron → Settings:

```bash
CRON_SECRET=<generate-secure-random-string>
APP_URL=https://your-app.vercel.app
```

### 3. Create Cron Schedule

In Supabase Dashboard → Database → Cron Jobs (pg_cron):

```sql
-- Schedule every Sunday at 8 PM UTC
SELECT cron.schedule(
  'weekly-review-generation',
  '0 20 * * 0',
  $$
  SELECT
    net.http_post(
      url := 'https://your-project.supabase.co/functions/v1/weekly-review-cron',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer YOUR_CRON_SECRET'
      ),
      body := '{}'::jsonb
    ) as request_id;
  $$
);
```

Replace:
- `your-project.supabase.co` with your Supabase project URL
- `YOUR_CRON_SECRET` with the value from step 2

### 4. Verify Schedule

```sql
-- List all cron jobs
SELECT * FROM cron.job;

-- View cron job runs
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
```

## How It Works

1. **Triggered**: Every Sunday at 8 PM UTC by pg_cron
2. **Authenticates**: Verifies CRON_SECRET to prevent unauthorized calls
3. **Fetches Users**: Gets all users who have tasks
4. **Generates Reviews**: For each user with tasks in the past week:
   - Calls `/api/weekly-reviews/generate` with service role auth
   - Stores generated review in database
5. **Reports**: Returns summary of success/skipped/failed reviews

## Manual Testing

```bash
# Local testing (requires Supabase CLI)
supabase functions serve weekly-review-cron

# Test call
curl -X POST http://localhost:54321/functions/v1/weekly-review-cron \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

## Monitoring

Check Edge Function logs in Supabase Dashboard:

- **Success**: `✓ Generated review for user@example.com`
- **Skipped**: `Skipping user user@example.com - no tasks this week`
- **Errors**: Check `errors` array in response

## Future Enhancements

- [ ] Support user timezone preferences (currently UTC-based)
- [ ] Send email notification with review summary
- [ ] Add retry logic for failed generations
- [ ] Configure custom schedule per user
- [ ] Skip users who manually generated review this week
