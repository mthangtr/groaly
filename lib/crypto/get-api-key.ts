/**
 * Server-side utility to get decrypted API keys
 * 
 * This module provides a secure way to retrieve and decrypt user API keys
 * for use in AI features. NEVER expose these functions to client-side code.
 * 
 * @module lib/crypto/get-api-key
 */

import { createClient } from "@/lib/supabase/server"
import { decrypt } from "./decrypt"
import type { EncryptedData } from "./encrypt"

/**
 * Supported AI providers for BYOK
 */
export type AIProvider = "openai" | "anthropic" | "openrouter"

/**
 * API key configuration stored in database (encrypted)
 */
type ApiKeyConfig = Record<AIProvider, EncryptedData>

/**
 * Get ENCRYPTION_KEY from environment
 * @throws Error if not set
 */
function getEncryptionKey(): string {
  const key = process.env.ENCRYPTION_KEY
  if (!key || key.length !== 64) {
    throw new Error("ENCRYPTION_KEY environment variable must be set (64-char hex string)")
  }
  return key
}

/**
 * Get decrypted API key for a user and provider
 * 
 * This function is used server-side when making AI API calls.
 * It retrieves the encrypted key from the database and decrypts it.
 * 
 * @param userId - User ID
 * @param provider - AI provider (openai, anthropic, openrouter)
 * @returns Decrypted API key or null if not configured
 * 
 * @example
 * ```typescript
 * // In an API route or server component
 * const apiKey = await getUserApiKey(user.id, "openai")
 * if (apiKey) {
 *   // Use apiKey to make OpenAI API call
 * }
 * ```
 */
export async function getUserApiKey(userId: string, provider: AIProvider): Promise<string | null> {
  try {
    const supabase = await createClient()
    
    const { data: userData, error } = await supabase
      .from("users")
      .select("api_keys")
      .eq("id", userId)
      .single()

    if (error || !userData) {
      return null
    }

    const apiKeys = (userData.api_keys as ApiKeyConfig) || {}
    const encryptedKey = apiKeys[provider]

    if (!encryptedKey) {
      return null
    }

    // Decrypt the key
    const encryptionKey = getEncryptionKey()
    const decrypted = decrypt(encryptedKey, encryptionKey)

    return decrypted
  } catch (error) {
    console.error(`Failed to get API key for ${provider}:`, error)
    return null
  }
}
