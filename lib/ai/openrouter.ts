import { createOpenRouter } from "@openrouter/ai-sdk-provider"

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

// Default model - Gemini 3 Flash Preview for fast, cheap responses
export const DEFAULT_MODEL = "google/gemini-3-flash-preview"

// Model aliases for different use cases
export const MODELS = {
  fast: "google/gemini-3-flash-preview",
  balanced: "google/gemini-3-flash-preview",
  powerful: "google/gemini-3-flash-preview",
} as const
