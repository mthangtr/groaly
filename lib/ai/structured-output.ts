import { generateText } from "ai"
import { z } from "zod"
import { openrouter, DEFAULT_MODEL } from "./openrouter"

/**
 * Strip markdown code blocks and parse JSON response
 * OpenRouter/Claude often wraps JSON in ```json blocks
 */
export function parseJsonResponse<T>(text: string, schema: z.ZodSchema<T>): T {
  let jsonStr = text.trim()
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "")
  }

  const parsed = JSON.parse(jsonStr)
  return schema.parse(parsed)
}

/**
 * Generate structured output from AI with Zod schema validation
 */
export async function generateStructuredOutput<T>({
  schema,
  schemaDescription,
  system,
  prompt,
  model = DEFAULT_MODEL,
}: {
  schema: z.ZodSchema<T>
  schemaDescription: string
  system?: string
  prompt: string
  model?: string
}): Promise<T> {
  const fullSystem = `${system ?? ""}

Respond ONLY with valid JSON matching this schema:
${schemaDescription}

No markdown code blocks, no explanation, just raw JSON.`.trim()

  const { text } = await generateText({
    model: openrouter.chat(model),
    system: fullSystem,
    prompt,
  })

  return parseJsonResponse(text, schema)
}
