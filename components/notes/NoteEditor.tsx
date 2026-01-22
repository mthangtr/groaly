"use client"

import * as React from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import type { JSONContent } from "@tiptap/react"
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    CodeSquare,
    Undo,
    Redo,
    Link as LinkIcon,
    Maximize2,
    Minimize2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { editorConfig } from "@/lib/tiptap/config"

type NoteEditorProps = {
    content?: JSONContent
    onChange?: (content: JSONContent) => void
    placeholder?: string
    className?: string
    autoSaveDelay?: number
}

export function NoteEditor({
    content,
    onChange,
    placeholder = "Start writing your note...",
    className,
    autoSaveDelay = 2000,
}: NoteEditorProps) {
    const [isFocusMode, setIsFocusMode] = React.useState(false)
    const [wordCount, setWordCount] = React.useState(0)
    const [charCount, setCharCount] = React.useState(0)
    const debounceTimerRef = React.useRef<NodeJS.Timeout | undefined>(undefined)

    const editor = useEditor({
        ...editorConfig,
        content,
        onUpdate: ({ editor }) => {
            // Update counts
            const text = editor.getText()
            setCharCount(text.length)
            setWordCount(
                text
                    .trim()
                    .split(/\s+/)
                    .filter((word) => word.length > 0).length
            )

            // Debounced onChange
            if (onChange) {
                if (debounceTimerRef.current) {
                    clearTimeout(debounceTimerRef.current)
                }
                debounceTimerRef.current = setTimeout(() => {
                    onChange(editor.getJSON())
                }, autoSaveDelay)
            }
        },
    })

    // Cleanup debounce timer
    React.useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current)
            }
        }
    }, [])

    // Update placeholder if prop changes
    React.useEffect(() => {
        if (editor) {
            const placeholderExt = editor.extensionManager.extensions.find(
                (ext) => ext.name === "placeholder"
            )
            if (placeholderExt) {
                placeholderExt.options.placeholder = placeholder
            }
        }
    }, [editor, placeholder])

    if (!editor) {
        return null
    }

    const toggleFocusMode = () => {
        setIsFocusMode(!isFocusMode)
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes("link").href
        const url = window.prompt("URL", previousUrl)

        if (url === null) {
            return
        }

        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    }

    return (
        <div
            className={cn(
                "flex flex-col rounded-lg border bg-background",
                isFocusMode && "fixed inset-4 z-50 shadow-2xl",
                className
            )}
        >
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 border-b p-2">
                {/* Text Formatting */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                    title="Bold (Ctrl+B)"
                >
                    <Bold className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                    title="Italic (Ctrl+I)"
                >
                    <Italic className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive("strike")}
                    title="Strikethrough (Ctrl+Shift+X)"
                >
                    <Strikethrough className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    isActive={editor.isActive("code")}
                    title="Code (Ctrl+E)"
                >
                    <Code className="h-4 w-4" />
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 h-6" />

                {/* Headings */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive("heading", { level: 1 })}
                    title="Heading 1 (Ctrl+Alt+1)"
                >
                    <Heading1 className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive("heading", { level: 2 })}
                    title="Heading 2 (Ctrl+Alt+2)"
                >
                    <Heading2 className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive("heading", { level: 3 })}
                    title="Heading 3 (Ctrl+Alt+3)"
                >
                    <Heading3 className="h-4 w-4" />
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 h-6" />

                {/* Lists */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive("bulletList")}
                    title="Bullet List (Ctrl+Shift+8)"
                >
                    <List className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive("orderedList")}
                    title="Ordered List (Ctrl+Shift+7)"
                >
                    <ListOrdered className="h-4 w-4" />
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 h-6" />

                {/* Blocks */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive("blockquote")}
                    title="Blockquote (Ctrl+Shift+B)"
                >
                    <Quote className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    isActive={editor.isActive("codeBlock")}
                    title="Code Block (Ctrl+Alt+C)"
                >
                    <CodeSquare className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={setLink}
                    isActive={editor.isActive("link")}
                    title="Add Link"
                >
                    <LinkIcon className="h-4 w-4" />
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 h-6" />

                {/* History */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Undo (Ctrl+Z)"
                >
                    <Undo className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Redo (Ctrl+Shift+Z)"
                >
                    <Redo className="h-4 w-4" />
                </ToolbarButton>

                <div className="ml-auto flex items-center gap-2">
                    {/* Word/Character Count */}
                    <div className="text-xs text-muted-foreground">
                        {wordCount} words · {charCount} characters
                    </div>

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    {/* Focus Mode */}
                    <ToolbarButton
                        onClick={toggleFocusMode}
                        isActive={isFocusMode}
                        title="Focus Mode"
                    >
                        {isFocusMode ? (
                            <Minimize2 className="h-4 w-4" />
                        ) : (
                            <Maximize2 className="h-4 w-4" />
                        )}
                    </ToolbarButton>
                </div>
            </div>

            {/* Editor Content */}
            <div
                className={cn(
                    "flex-1 overflow-y-auto",
                    isFocusMode && "max-h-[calc(100vh-8rem)]"
                )}
            >
                <EditorContent editor={editor} />
            </div>

            {/* Focus Mode Overlay */}
            {isFocusMode && (
                <div
                    className="fixed inset-0 -z-10 bg-background/80 backdrop-blur-sm"
                    onClick={toggleFocusMode}
                />
            )}
        </div>
    )
}

type ToolbarButtonProps = {
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    title?: string
    children: React.ReactNode
}

function ToolbarButton({
    onClick,
    isActive = false,
    disabled = false,
    title,
    children,
}: ToolbarButtonProps) {
    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={cn(
                "h-8 w-8 p-0",
                isActive && "bg-muted",
                disabled && "opacity-50"
            )}
        >
            {children}
        </Button>
    )
}
