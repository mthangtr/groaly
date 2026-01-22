import type { JSONContent } from "@tiptap/react"

/**
 * Extract plain text from Tiptap JSON content
 * Recursively traverses the JSON structure to build a text representation
 */
export function extractTextFromTiptapJSON(json: JSONContent | unknown): string {
    // Handle null/undefined
    if (!json) return ""

    // If it's a string (legacy content), return as-is
    if (typeof json === "string") return json

    // If it's not an object, stringify it
    if (typeof json !== "object") return String(json)

    const content = json as JSONContent

    let text = ""

    // Extract text from text nodes
    if (content.type === "text" && content.text) {
        text += content.text
    }

    // Recursively process child nodes
    if (content.content && Array.isArray(content.content)) {
        for (const node of content.content) {
            text += extractTextFromTiptapJSON(node)
            // Add newline after block elements
            if (
                node.type === "paragraph" ||
                node.type === "heading" ||
                node.type === "codeBlock" ||
                node.type === "blockquote"
            ) {
                text += "\n"
            }
        }
    }

    return text
}

/**
 * Generate a preview from Tiptap JSON content
 * Extracts plain text and truncates to reasonable length
 */
export function getTiptapContentPreview(
    content: unknown,
    maxLength = 150
): string {
    const text = extractTextFromTiptapJSON(content)
    const trimmed = text.trim()

    if (trimmed.length === 0) return ""

    return trimmed.length > maxLength
        ? trimmed.slice(0, maxLength) + "..."
        : trimmed
}
