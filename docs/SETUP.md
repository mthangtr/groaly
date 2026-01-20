# Environment Setup Guide

This guide walks you through setting up all required environment variables for the DumTasking application.

## Prerequisites

- A [Supabase](https://supabase.com) account and project
- An [OpenRouter](https://openrouter.ai) account for AI features
- Node.js installed (for generating encryption keys)

## Quick Start

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Follow the sections below to fill in each variable in your `.env.local` file.

## Environment Variables

### 1. Supabase Configuration

#### `NEXT_PUBLIC_SUPABASE_URL`
- **Description**: Your Supabase project URL
- **Format**: `https://[project-id].supabase.co`
- **How to get it**:
  1. Go to [Supabase Dashboard](https://app.supabase.com)
  2. Select your project
  3. Go to **Project Settings** → **API**
  4. Copy the **Project URL**

#### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Description**: Supabase anonymous (public) key
- **Security**: Safe to expose in browser - protected by Row Level Security (RLS)
- **How to get it**:
  1. In the same **API** settings page
  2. Copy the **anon public** key under "Project API keys"

#### `SUPABASE_SERVICE_ROLE_KEY`
- **Description**: Supabase service role key
- **Security**: ⚠️ **CRITICAL** - NEVER expose to browser/client code
  - This key bypasses all RLS policies
  - Only use in server-side code (API routes, server components)
  - Never commit to version control
- **How to get it**:
  1. In the same **API** settings page
  2. Copy the **service_role** key under "Project API keys"
  3. Click "Reveal" to see the full key

### 2. AI Configuration

#### `OPENROUTER_API_KEY`
- **Description**: API key for OpenRouter (AI features)
- **Used for**:
  - Task extraction from notes
  - Daily task suggestions
  - AI chat assistant
- **Format**: `sk-or-v1-...`
- **How to get it**:
  1. Go to [OpenRouter](https://openrouter.ai)
  2. Sign up or log in
  3. Go to [API Keys](https://openrouter.ai/keys)
  4. Click "Create Key"
  5. Copy the generated key

### 3. Encryption

#### `ENCRYPTION_KEY`
- **Description**: 32-character hex string for encrypting sensitive data
- **Used for**: Encrypting user-provided API keys (BYOK feature)
- **Format**: 64-character hexadecimal string (32 bytes)
- **How to generate**:

  **Option 1: Using Node.js**
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

  **Option 2: Using OpenSSL**
  ```bash
  openssl rand -hex 32
  ```

  **Option 3: Using PowerShell (Windows)**
  ```powershell
  -join ((48..57) + (97..102) | Get-Random -Count 64 | % {[char]$_})
  ```

- **Security**: 
  - Keep this secret and never commit to version control
  - Use different keys for development and production
  - Store production key in secure environment variable service

## Example `.env.local` File

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# AI
OPENROUTER_API_KEY=sk-or-v1-1234567890abcdef...

# Encryption
ENCRYPTION_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

## Verification

After setting up your environment variables, verify they're loaded correctly:

1. Start the development server:
   ```bash
   bun dev
   ```

2. Check the console for any missing environment variable errors

3. Try accessing the application at `http://localhost:3000`

## Troubleshooting

### "Missing environment variable" error
- Ensure your `.env.local` file is in the project root
- Restart the development server after adding variables
- Check for typos in variable names

### Supabase connection errors
- Verify your project URL and keys are correct
- Check if your Supabase project is active
- Ensure RLS policies are set up correctly

### AI features not working
- Verify your OpenRouter API key is valid
- Check if you have credits in your OpenRouter account
- Review the API key format (should start with `sk-or-v1-`)

### Encryption errors
- Ensure the encryption key is exactly 64 hexadecimal characters
- Regenerate the key if you suspect it's corrupted

## Security Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use different keys for different environments** (dev/staging/prod)
3. **Rotate keys periodically**, especially if compromised
4. **Use environment variable services** for production (Vercel, Railway, etc.)
5. **Limit service role key usage** to server-side code only

## Production Deployment

When deploying to production (e.g., Vercel):

1. Add all environment variables in your hosting platform's dashboard
2. Use production Supabase keys (not development keys)
3. Generate a new, secure `ENCRYPTION_KEY` for production
4. Never expose `SUPABASE_SERVICE_ROLE_KEY` or `ENCRYPTION_KEY` to the client

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
