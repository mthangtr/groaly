import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"

/**
 * Core Tiptap extensions - lightweight and always loaded
 */
export const coreExtensions = [
    StarterKit.configure({
        heading: {
            levels: [1, 2, 3],
        },
        // Keep default code block enabled
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
]

/**
 * Enhanced extensions with syntax highlighting
 * Lazy loaded to reduce initial bundle size
 */
export async function getEnhancedExtensions() {
    const [CodeBlockLowlight, { common, createLowlight }] = await Promise.all([
        import("@tiptap/extension-code-block-lowlight").then((mod) => mod.default),
        import("lowlight"),
    ])

    const lowlight = createLowlight(common)

    return [
        ...coreExtensions.filter((ext) => ext.name !== "codeBlock"),
        CodeBlockLowlight.configure({
            lowlight,
            HTMLAttributes: {
                class: "rounded-md bg-muted p-4 font-mono text-sm",
            },
        }),
    ]
}

// Default to core extensions for initial render
export const extensions = coreExtensions
