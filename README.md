This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Issue Tracking with Beads

This project uses **[Beads](https://github.com/steveyegge/beads)** for AI-native issue tracking.

```bash
bd ready              # See available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Start work
bd close <id>         # Complete work
```

**Documentation:**
- [AGENTS.md](AGENTS.md) - Full workflow guidelines
- [.beads/SESSION_START.md](.beads/SESSION_START.md) - Session start checklist
- [.beads/SESSION_END.md](.beads/SESSION_END.md) - Session end protocol (mandatory!)
- [.beads/TESTING.md](.beads/TESTING.md) - Test isolation practices

**Key Rules:**
- Always include issue ID in commits: `git commit -m "Fix bug (dt-xyz)"`
- Never end session without `git push` (see SESSION_END.md)
- Use `BEADS_DB=/tmp/test.db` for testing

## Environment Setup

Before running the application, you need to configure environment variables.

### Quick Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your credentials (see [docs/SETUP.md](docs/SETUP.md) for detailed instructions):
   - **Supabase**: Get your project URL and API keys from [Supabase Dashboard](https://app.supabase.com)
   - **OpenRouter**: Get your API key from [OpenRouter](https://openrouter.ai/keys)
   - **Encryption Key**: Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

3. See **[docs/SETUP.md](docs/SETUP.md)** for complete setup guide with step-by-step instructions.

### Required Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (public)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-only)
- `OPENROUTER_API_KEY` - OpenRouter API key for AI features
- `ENCRYPTION_KEY` - 32-byte hex string for encrypting sensitive data

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
