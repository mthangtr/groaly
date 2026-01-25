# API Keys (BYOK) - Bring Your Own Key

## Overview

The API Keys feature allows users to securely store their own API keys for AI services (OpenAI, Anthropic, OpenRouter) using industry-standard AES-256-GCM encryption.

## Security Architecture

### Encryption

- **Algorithm**: AES-256-GCM (Galois/Counter Mode)
- **Key Size**: 256 bits (32 bytes)
- **IV**: 12 bytes (recommended for GCM), randomly generated per encryption
- **Authentication**: Built-in authentication tag for integrity verification

### Security Features

1. **Encrypted at Rest**: API keys are encrypted before storage in the database
2. **Server-Side Only**: Encryption key (`ENCRYPTION_KEY`) is only accessible server-side
3. **Never Logged**: API keys are masked in UI and never appear in logs
4. **Authenticated Encryption**: GCM mode provides both confidentiality and authenticity
5. **Random IV**: Each encryption uses a unique random IV, ensuring different ciphertexts for the same plaintext

### Storage Format

Keys are stored in the `users.api_keys` JSONB column:

```json
{
  "openai": {
    "iv": "hex_string",
    "authTag": "hex_string", 
    "encrypted": "hex_string"
  },
  "anthropic": {
    "iv": "hex_string",
    "authTag": "hex_string",
    "encrypted": "hex_string"
  }
}
```

## Implementation

### Database Schema

```sql
-- Migration: 005_add_api_keys_to_users.sql
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS api_keys JSONB DEFAULT '{}';

COMMENT ON COLUMN public.users.api_keys IS 'Encrypted API keys for BYOK';
```

### Environment Variables

```bash
# .env.local
ENCRYPTION_KEY=<64-character-hex-string>
```

**Generate a key**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Crypto Utilities

#### Encrypt

```typescript
import { encrypt } from "@/lib/crypto"

const encrypted = encrypt("sk-my-api-key", process.env.ENCRYPTION_KEY!)
// Returns: { iv: "...", authTag: "...", encrypted: "..." }
```

#### Decrypt

```typescript
import { decrypt } from "@/lib/crypto"

const plaintext = decrypt(encryptedData, process.env.ENCRYPTION_KEY!)
```

#### Get User API Key

```typescript
import { getUserApiKey } from "@/lib/crypto"

// In API route or server component
const apiKey = await getUserApiKey(userId, "openai")
if (apiKey) {
  // Use the decrypted key
}
```

## API Endpoints

### GET /api/user/api-keys

Get API key configuration status (does NOT return actual keys).

**Response**:
```json
{
  "configured": {
    "openai": true,
    "anthropic": false,
    "openrouter": true
  }
}
```

### PUT /api/user/api-keys

Add or update an API key.

**Request**:
```json
{
  "provider": "openai",
  "apiKey": "sk-..."
}
```

**Response**:
```json
{
  "success": true,
  "configured": {
    "openai": true,
    "anthropic": false,
    "openrouter": false
  }
}
```

### DELETE /api/user/api-keys?provider=openai

Remove an API key.

**Response**:
```json
{
  "success": true,
  "configured": {
    "openai": false,
    "anthropic": false,
    "openrouter": false
  }
}
```

## UI Components

### ApiKeysSection

Located at `/settings` → "API Keys" tab.

Features:
- Add/update/remove API keys for each provider
- Masked input with show/hide toggle
- Visual indicators for configured keys
- Security notice explaining encryption
- Direct links to provider API key pages

## Usage in AI Features

When implementing AI features, use the `getUserApiKey` utility:

```typescript
import { getUserApiKey } from "@/lib/crypto"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  // Try to get user's API key first
  const userApiKey = await getUserApiKey(user.id, "openai")
  const apiKey = userApiKey || process.env.OPENROUTER_API_KEY
  
  // Make API call with the key
  // ...
}
```

## Testing

### Manual Testing

1. Navigate to `/settings` → "API Keys"
2. Add an OpenAI API key
3. Verify it shows as "Configured"
4. Check database: `SELECT api_keys FROM users WHERE id = '<user-id>';`
5. Verify the stored value is encrypted (not plaintext)
6. Remove the key and verify it's deleted

### Automated Tests

See `.spikes/encryption/test-api-keys.ts` for encryption validation tests.

## Security Considerations

### ✅ DO

- Keep `ENCRYPTION_KEY` in server environment only
- Rotate encryption keys periodically (requires re-encryption migration)
- Use HTTPS for all API communication
- Validate API key format before encryption

### ❌ DON'T

- Never log API keys (encrypted or decrypted)
- Never expose encryption key to client-side
- Never return decrypted keys to the client
- Don't use the same IV for multiple encryptions (handled automatically)

## Troubleshooting

### "Encryption key must be set" error

Ensure `ENCRYPTION_KEY` is set in `.env.local`:

```bash
ENCRYPTION_KEY=<64-character-hex-string>
```

### Decryption fails

- Check that the encryption key hasn't changed
- Verify the encrypted data structure is intact
- Ensure the IV and auth tag are preserved

### "Invalid encrypted data" error

The stored data may be corrupted. User will need to re-add their API key.

## Future Enhancements

- [ ] Key rotation mechanism
- [ ] Support for additional providers (Gemini, Cohere, etc.)
- [ ] Audit log for API key usage
- [ ] Multi-region key storage
- [ ] Hardware security module (HSM) integration for enterprise
