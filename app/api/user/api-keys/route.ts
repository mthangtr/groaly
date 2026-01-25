/**
 * API Keys Management API
 * 
 * Handles BYOK (Bring Your Own Key) API key storage with AES-256-GCM encryption.
 * 
 * @route GET /api/user/api-keys - Get API key configuration status
 * @route PUT /api/user/api-keys - Update API keys
 * @route DELETE /api/user/api-keys - Delete specific API key
 */

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { encrypt } from "@/lib/crypto"
import type { EncryptedData } from "@/lib/crypto"

/**
 * Supported AI providers for BYOK
 */
export type AIProvider = "openai" | "anthropic" | "openrouter"

/**
 * API key configuration stored in database (encrypted)
 */
type ApiKeyConfig = Record<AIProvider, EncryptedData>

/**
 * API key status response (NEVER returns actual keys)
 */
type ApiKeyStatus = Record<AIProvider, boolean>

/**
 * Error response
 */
type ErrorResponse = {
  error: string
}

/**
 * Success response for status check
 */
type StatusResponse = {
  configured: ApiKeyStatus
}

/**
 * Success response for update
 */
type UpdateResponse = {
  success: boolean
  configured: ApiKeyStatus
}

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
 * GET /api/user/api-keys
 * 
 * Returns which API keys are configured (true/false), NEVER the actual keys.
 */
export async function GET(): Promise<NextResponse<StatusResponse | ErrorResponse>> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user's API keys
    const { data: userData, error: dbError } = await supabase
      .from("users")
      .select("api_keys")
      .eq("id", user.id)
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to fetch API keys" }, { status: 500 })
    }

    const apiKeys = (userData?.api_keys as ApiKeyConfig) || {}

    // Return only configuration status, NEVER actual keys
    const configured: ApiKeyStatus = {
      openai: !!apiKeys.openai,
      anthropic: !!apiKeys.anthropic,
      openrouter: !!apiKeys.openrouter,
    }

    return NextResponse.json({ configured })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * PUT /api/user/api-keys
 * 
 * Update API keys. Keys are encrypted before storage.
 * 
 * Request body: { provider: "openai" | "anthropic" | "openrouter", apiKey: string }
 */
export async function PUT(request: NextRequest): Promise<NextResponse<UpdateResponse | ErrorResponse>> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { provider, apiKey } = body as { provider?: AIProvider; apiKey?: string }

    // Validate input
    if (!provider || !["openai", "anthropic", "openrouter"].includes(provider)) {
      return NextResponse.json({ error: "Invalid provider. Must be: openai, anthropic, or openrouter" }, { status: 400 })
    }

    if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length === 0) {
      return NextResponse.json({ error: "API key is required" }, { status: 400 })
    }

    // Get encryption key
    const encryptionKey = getEncryptionKey()

    // Encrypt the API key
    const encrypted = encrypt(apiKey.trim(), encryptionKey)

    // Fetch current API keys
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("api_keys")
      .eq("id", user.id)
      .single()

    if (fetchError) {
      console.error("Database fetch error:", fetchError)
      return NextResponse.json({ error: "Failed to fetch current keys" }, { status: 500 })
    }

    const currentKeys = (userData?.api_keys as ApiKeyConfig) || {}

    // Update the specific provider's key
    const updatedKeys: ApiKeyConfig = {
      ...currentKeys,
      [provider]: encrypted,
    }

    // Save to database
    const { error: updateError } = await supabase
      .from("users")
      .update({ api_keys: updatedKeys })
      .eq("id", user.id)

    if (updateError) {
      console.error("Database update error:", updateError)
      return NextResponse.json({ error: "Failed to save API key" }, { status: 500 })
    }

    // Return configuration status
    const configured: ApiKeyStatus = {
      openai: !!updatedKeys.openai,
      anthropic: !!updatedKeys.anthropic,
      openrouter: !!updatedKeys.openrouter,
    }

    return NextResponse.json({ success: true, configured })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * DELETE /api/user/api-keys
 * 
 * Delete a specific API key.
 * 
 * Query params: ?provider=openai|anthropic|openrouter
 */
export async function DELETE(request: NextRequest): Promise<NextResponse<UpdateResponse | ErrorResponse>> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get provider from query params
    const { searchParams } = new URL(request.url)
    const provider = searchParams.get("provider") as AIProvider | null

    // Validate provider
    if (!provider || !["openai", "anthropic", "openrouter"].includes(provider)) {
      return NextResponse.json({ error: "Invalid provider. Must be: openai, anthropic, or openrouter" }, { status: 400 })
    }

    // Fetch current API keys
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("api_keys")
      .eq("id", user.id)
      .single()

    if (fetchError) {
      console.error("Database fetch error:", fetchError)
      return NextResponse.json({ error: "Failed to fetch current keys" }, { status: 500 })
    }

    const currentKeys = (userData?.api_keys as ApiKeyConfig) || {}

    // Remove the specific provider's key
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [provider]: _, ...updatedKeys } = currentKeys

    // Save to database
    const { error: updateError } = await supabase
      .from("users")
      .update({ api_keys: updatedKeys })
      .eq("id", user.id)

    if (updateError) {
      console.error("Database update error:", updateError)
      return NextResponse.json({ error: "Failed to delete API key" }, { status: 500 })
    }

    // Return configuration status
    const updatedKeysTyped = updatedKeys as Partial<ApiKeyConfig>
    const configured: ApiKeyStatus = {
      openai: !!updatedKeysTyped.openai,
      anthropic: !!updatedKeysTyped.anthropic,
      openrouter: !!updatedKeysTyped.openrouter,
    }

    return NextResponse.json({ success: true, configured })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
