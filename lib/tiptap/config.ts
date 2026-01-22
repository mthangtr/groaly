import type { EditorOptions } from "@tiptap/react"
import { extensions } from "./extensions"

/**
 * Default Tiptap editor configuration
 */
export const editorConfig: Partial<EditorOptions> = {
    extensions,
    editorProps: {
        attributes: {
            class:
                "prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[200px] px-4 py-3",
        },
    },
    // Enable markdown shortcuts
    parseOptions: {
        preserveWhitespace: "full",
    },
}

/**
 * Keyboard shortcuts reference
 */
export const keyboardShortcuts = {
    bold: "Mod-b",
    italic: "Mod-i",
    strike: "Mod-Shift-x",
    code: "Mod-e",
    heading1: "Mod-Alt-1",
    heading2: "Mod-Alt-2",
    heading3: "Mod-Alt-3",
    bulletList: "Mod-Shift-8",
    orderedList: "Mod-Shift-7",
    blockquote: "Mod-Shift-b",
    codeBlock: "Mod-Alt-c",
    undo: "Mod-z",
    redo: "Mod-Shift-z",
} as const
