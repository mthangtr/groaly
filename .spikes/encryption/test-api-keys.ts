/**
 * Test script for API Keys encryption
 * 
 * Verifies:
 * 1. Encryption/decryption works correctly
 * 2. Encrypted value is not plaintext
 * 3. Different encryptions of same plaintext are unique (due to IV)
 * 4. Invalid key/data throws errors
 */

import { encrypt, decrypt } from "../../lib/crypto"

console.log("=== API Keys Encryption Test ===\n")

// Test 1: Basic encryption/decryption
console.log("Test 1: Basic Encryption/Decryption")
const testKey = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
const apiKey = "sk-openai-1234567890"

const encrypted = encrypt(apiKey, testKey)
console.log("✓ Encrypted successfully")
console.log("  IV:", encrypted.iv)
console.log("  Auth Tag:", encrypted.authTag)
console.log("  Encrypted:", encrypted.encrypted)

const decrypted = decrypt(encrypted, testKey)
console.log("✓ Decrypted successfully")
console.log("  Decrypted:", decrypted)

if (decrypted === apiKey) {
  console.log("✅ Test 1 PASSED: Encryption/Decryption works\n")
} else {
  console.log("❌ Test 1 FAILED: Decrypted value doesn't match\n")
  process.exit(1)
}

// Test 2: Encrypted value is not plaintext
console.log("Test 2: Encrypted Value Security")
if (encrypted.encrypted.includes(apiKey)) {
  console.log("❌ Test 2 FAILED: Encrypted value contains plaintext\n")
  process.exit(1)
} else {
  console.log("✅ Test 2 PASSED: Encrypted value is secure\n")
}

// Test 3: Different encryptions produce different ciphertexts
console.log("Test 3: IV Randomness")
const encrypted2 = encrypt(apiKey, testKey)
if (encrypted.encrypted === encrypted2.encrypted) {
  console.log("❌ Test 3 FAILED: Same ciphertext for same plaintext (weak IV)\n")
  process.exit(1)
} else {
  console.log("✅ Test 3 PASSED: Different ciphertexts (random IV)\n")
}

// Test 4: Wrong key fails
console.log("Test 4: Wrong Key Detection")
const wrongKey = "abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789"
try {
  decrypt(encrypted, wrongKey)
  console.log("❌ Test 4 FAILED: Decryption with wrong key didn't throw\n")
  process.exit(1)
} catch (error) {
  console.log("✅ Test 4 PASSED: Wrong key detected\n")
}

// Test 5: Invalid data fails
console.log("Test 5: Invalid Data Detection")
try {
  decrypt({ iv: "invalid", authTag: "invalid", encrypted: "invalid" }, testKey)
  console.log("❌ Test 5 FAILED: Decryption with invalid data didn't throw\n")
  process.exit(1)
} catch (error) {
  console.log("✅ Test 5 PASSED: Invalid data detected\n")
}

// Test 6: Multiple providers
console.log("Test 6: Multiple Providers")
const providers = {
  openai: encrypt("sk-openai-key", testKey),
  anthropic: encrypt("sk-ant-key", testKey),
  openrouter: encrypt("sk-or-key", testKey),
}

const decryptedOpenAI = decrypt(providers.openai, testKey)
const decryptedAnthropic = decrypt(providers.anthropic, testKey)
const decryptedOpenRouter = decrypt(providers.openrouter, testKey)

if (
  decryptedOpenAI === "sk-openai-key" &&
  decryptedAnthropic === "sk-ant-key" &&
  decryptedOpenRouter === "sk-or-key"
) {
  console.log("✅ Test 6 PASSED: Multiple providers work\n")
} else {
  console.log("❌ Test 6 FAILED: Multiple providers failed\n")
  process.exit(1)
}

console.log("=== All Tests Passed ✅ ===\n")

// Output sample JSONB structure
console.log("Sample JSONB structure for database:")
console.log(JSON.stringify({
  openai: providers.openai,
  anthropic: providers.anthropic,
  openrouter: providers.openrouter,
}, null, 2))
