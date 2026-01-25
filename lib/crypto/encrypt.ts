/**
 * AES-256-GCM Encryption Utility
 * 
 * Securely encrypts sensitive data like API keys using AES-256-GCM.
 * 
 * @module lib/crypto/encrypt
 */

import crypto from "crypto"

export interface EncryptedData {
  /** Initialization Vector (hex string) */
  iv: string
  /** Authentication tag for GCM mode (hex string) */
  authTag: string
  /** Encrypted data (hex string) */
  encrypted: string
}

/**
 * Encrypt plaintext using AES-256-GCM
 * 
 * @param plaintext - The data to encrypt
 * @param key - 32-byte encryption key (hex string)
 * @returns Encrypted data with IV and auth tag
 * @throws Error if encryption fails
 * 
 * @example
 * ```typescript
 * const encrypted = encrypt("sk-my-api-key", process.env.ENCRYPTION_KEY!)
 * // Store encrypted.iv, encrypted.authTag, encrypted.encrypted in database
 * ```
 */
export function encrypt(plaintext: string, key: string): EncryptedData {
  if (!key || key.length !== 64) {
    throw new Error("Encryption key must be a 64-character hex string (32 bytes)")
  }

  try {
    // Convert hex key to buffer
    const keyBuffer = Buffer.from(key, "hex")
    
    // Generate random IV (12 bytes is recommended for GCM)
    const iv = crypto.randomBytes(12)
    
    // Create cipher
    const cipher = crypto.createCipheriv("aes-256-gcm", keyBuffer, iv)
    
    // Encrypt
    let encrypted = cipher.update(plaintext, "utf8", "hex")
    encrypted += cipher.final("hex")
    
    // Get auth tag for authenticity verification
    const authTag = cipher.getAuthTag()
    
    return {
      iv: iv.toString("hex"),
      authTag: authTag.toString("hex"),
      encrypted,
    }
  } catch (error) {
    throw new Error(`Encryption failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Generate a new random encryption key
 * 
 * @returns 32-byte key as hex string (64 characters)
 * 
 * @example
 * ```typescript
 * const newKey = generateEncryptionKey()
 * // Add to .env.local: ENCRYPTION_KEY=<newKey>
 * ```
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString("hex")
}
