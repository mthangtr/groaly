import { createOpenRouter } from "@openrouter/ai-sdk-provider"

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

// Default model - Claude Haiku 4.5 for fast, cheap responses
export const DEFAULT_MODEL = "anthropic/claude-haiku-4.5"

// Model aliases for different use cases
export const MODELS = {
  fast: "anthropic/claude-haiku-4.5",
  balanced: "anthropic/claude-sonnet-4",
  powerful: "anthropic/claude-sonnet-4",
} as const
