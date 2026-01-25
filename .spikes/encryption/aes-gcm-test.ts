/**
 * SPIKE: AES-256-GCM Encryption Test
 * 
 * Testing encryption/decryption for BYOK API Keys
 * This runs in Node.js/Edge Runtime environment
 */

import crypto from "crypto"

// Test encryption key (32 bytes for AES-256)
const ENCRYPTION_KEY = crypto.randomBytes(32).toString("hex")

interface EncryptResult {
  iv: string
  authTag: string
  encrypted: string
}

/**
 * Encrypt data using AES-256-GCM
 */
function encrypt(plaintext: string, key: string): EncryptResult {
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
}

/**
 * Decrypt data using AES-256-GCM
 */
function decrypt(encryptedData: EncryptResult, key: string): string {
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
}

// Test the encryption
console.log("=== AES-256-GCM Encryption Test ===\n")

const apiKey = "sk-test-1234567890abcdef"
console.log("Original API Key:", apiKey)
console.log("Encryption Key (hex):", ENCRYPTION_KEY)
console.log()

// Encrypt
const encrypted = encrypt(apiKey, ENCRYPTION_KEY)
console.log("Encrypted Result:")
console.log("  IV:", encrypted.iv)
console.log("  Auth Tag:", encrypted.authTag)
console.log("  Encrypted:", encrypted.encrypted)
console.log()

// Decrypt
const decrypted = decrypt(encrypted, ENCRYPTION_KEY)
console.log("Decrypted API Key:", decrypted)
console.log()

// Verify
console.log("✓ Encryption/Decryption:", apiKey === decrypted ? "SUCCESS" : "FAILED")
console.log()

// Test storage format (what we'll store in JSONB)
const storageFormat = {
  openai: {
    iv: encrypted.iv,
    authTag: encrypted.authTag,
    encrypted: encrypted.encrypted,
  },
}

console.log("Storage Format (JSONB):")
console.log(JSON.stringify(storageFormat, null, 2))
console.log()

// Generate a proper encryption key for .env.local
const newEncryptionKey = crypto.randomBytes(32).toString("hex")
console.log("=== New Encryption Key for .env.local ===")
console.log(`ENCRYPTION_KEY=${newEncryptionKey}`)
