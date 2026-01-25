/**
 * AES-256-GCM Decryption Utility
 * 
 * Securely decrypts data encrypted with AES-256-GCM.
 * 
 * @module lib/crypto/decrypt
 */

import crypto from "crypto"
import type { EncryptedData } from "./encrypt"

/**
 * Decrypt data encrypted with AES-256-GCM
 * 
 * @param encryptedData - The encrypted data with IV and auth tag
 * @param key - 32-byte encryption key (hex string)
 * @returns Decrypted plaintext
 * @throws Error if decryption fails or authentication fails
 * 
 * @example
 * ```typescript
 * const decrypted = decrypt(
 *   { iv: "...", authTag: "...", encrypted: "..." },
 *   process.env.ENCRYPTION_KEY!
 * )
 * ```
 */
export function decrypt(encryptedData: EncryptedData, key: string): string {
  if (!key || key.length !== 64) {
    throw new Error("Encryption key must be a 64-character hex string (32 bytes)")
  }

  if (!encryptedData.iv || !encryptedData.authTag || !encryptedData.encrypted) {
    throw new Error("Invalid encrypted data: missing iv, authTag, or encrypted fields")
  }

  try {
    const keyBuffer = Buffer.from(key, "hex")
    const iv = Buffer.from(encryptedData.iv, "hex")
    const authTag = Buffer.from(encryptedData.authTag, "hex")
    
    // Create decipher
    const decipher = crypto.createDecipheriv("aes-256-gcm", keyBuffer, iv)
    decipher.setAuthTag(authTag)
    
    // Decrypt
    let decrypted = decipher.update(encryptedData.encrypted, "hex", "utf8")
    decrypted += decipher.final("utf8")
    
    return decrypted
  } catch (error) {
    // GCM authentication failure or decryption error
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}
