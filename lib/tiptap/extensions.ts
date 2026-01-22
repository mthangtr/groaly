import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { common, createLowlight } from "lowlight"

// Create lowlight instance with common languages
const lowlight = createLowlight(common)

/**
 * Tiptap extensions configuration for the note editor
 * Includes: StarterKit, Placeholder, Link, CodeBlockLowlight
 */
export const extensions = [
    StarterKit.configure({
        heading: {
            levels: [1, 2, 3],
        },
        codeBlock: false, // Disable default code block (we use CodeBlockLowlight)
    }),
    Placeholder.configure({
        placeholder: "Start writing your note...",
        emptyEditorClass: "is-editor-empty",
    }),
    Link.configure({
        openOnClick: false,
        HTMLAttributes: {
            class: "text-primary underline underline-offset-4 hover:text-primary/80",
        },
    }),
    CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
            class: "rounded-md bg-muted p-4 font-mono text-sm",
        },
    }),
]
