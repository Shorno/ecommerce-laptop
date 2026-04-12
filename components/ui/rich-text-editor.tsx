"use client"

import {useEditor, EditorContent, Editor} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Heading2,
    Heading3,
    Undo,
    Redo,
    Minus,
} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {cn} from '@/lib/utils'
import {useEffect} from 'react'

interface RichTextEditorProps {
    value: string
    onChange: (html: string) => void
    placeholder?: string
    className?: string
}

function ToolbarButton({
    onClick,
    isActive = false,
    children,
    title,
}: {
    onClick: () => void
    isActive?: boolean
    children: React.ReactNode
    title: string
}) {
    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
                "h-8 w-8",
                isActive && "bg-muted text-foreground"
            )}
            onClick={(e) => {
                e.preventDefault()
                onClick()
            }}
            title={title}
        >
            {children}
        </Button>
    )
}

function Toolbar({editor}: { editor: Editor }) {
    return (
        <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-2 py-1.5 bg-muted/30">
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="Bold"
            >
                <Bold className="h-4 w-4"/>
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="Italic"
            >
                <Italic className="h-4 w-4"/>
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive('underline')}
                title="Underline"
            >
                <UnderlineIcon className="h-4 w-4"/>
            </ToolbarButton>

            <div className="w-px h-5 bg-border mx-1"/>

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}
                isActive={editor.isActive('heading', {level: 2})}
                title="Heading 2"
            >
                <Heading2 className="h-4 w-4"/>
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({level: 3}).run()}
                isActive={editor.isActive('heading', {level: 3})}
                title="Heading 3"
            >
                <Heading3 className="h-4 w-4"/>
            </ToolbarButton>

            <div className="w-px h-5 bg-border mx-1"/>

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                title="Bullet List"
            >
                <List className="h-4 w-4"/>
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                title="Ordered List"
            >
                <ListOrdered className="h-4 w-4"/>
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="Horizontal Rule"
            >
                <Minus className="h-4 w-4"/>
            </ToolbarButton>

            <div className="w-px h-5 bg-border mx-1"/>

            <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                title="Undo"
            >
                <Undo className="h-4 w-4"/>
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                title="Redo"
            >
                <Redo className="h-4 w-4"/>
            </ToolbarButton>
        </div>
    )
}

export default function RichTextEditor({value, onChange, placeholder, className}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
        ],
        immediatelyRender: false,
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none min-h-[200px] px-4 py-3 focus:outline-none',
            },
        },
        onUpdate: ({editor}) => {
            onChange(editor.getHTML())
        },
    })

    // Sync external value changes
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '')
        }
    }, [value, editor])

    if (!editor) return null

    return (
        <div className={cn("border border-input rounded-md overflow-hidden bg-background", className)}>
            <Toolbar editor={editor}/>
            <EditorContent editor={editor}/>
            {!value && placeholder && (
                <style>{`
                    .ProseMirror p.is-editor-empty:first-child::before {
                        content: '${placeholder}';
                        color: hsl(var(--muted-foreground));
                        float: left;
                        pointer-events: none;
                        height: 0;
                    }
                `}</style>
            )}
        </div>
    )
}
