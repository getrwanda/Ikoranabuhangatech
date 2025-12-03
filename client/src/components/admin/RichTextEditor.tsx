import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { Blockquote } from '@tiptap/extension-blockquote'
import { TextAlign } from '@tiptap/extension-text-align'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Code,
    Link as LinkIcon,
    Image as ImageIcon,
    Undo,
    Redo,
    Table as TableIcon,
    Quote,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Eye,
    Edit3,
    Upload,
    Trash2,
    Plus,
    ArrowDown,
    ArrowRight,
    Columns,
    Rows
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
    placeholder?: string
    autosave?: boolean
    onAutosave?: (content: string) => void
}

export function RichTextEditor({
    content,
    onChange,
    placeholder = "Start writing...",
    autosave = false,
    onAutosave
}: RichTextEditorProps) {
    const [showLinkInput, setShowLinkInput] = useState(false)
    const [linkUrl, setLinkUrl] = useState('')
    const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const autosaveTimerRef = useRef<NodeJS.Timeout>()

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                blockquote: false, // We'll use the standalone extension
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline cursor-pointer',
                },
            }),
            Image.configure({
                allowBase64: true,
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg my-4',
                },
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'border-collapse table-auto w-full my-4',
                },
            }),
            TableRow,
            TableCell.configure({
                HTMLAttributes: {
                    class: 'border border-gray-300 px-4 py-2',
                },
            }),
            TableHeader.configure({
                HTMLAttributes: {
                    class: 'border border-gray-300 px-4 py-2 bg-gray-100 font-bold',
                },
            }),
            Blockquote.configure({
                HTMLAttributes: {
                    class: 'border-l-4 border-gray-300 pl-4 italic my-4',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            onChange(html)

            // Autosave functionality
            if (autosave && onAutosave) {
                if (autosaveTimerRef.current) {
                    clearTimeout(autosaveTimerRef.current)
                }
                autosaveTimerRef.current = setTimeout(() => {
                    onAutosave(html)
                }, 2000) // Autosave after 2 seconds of inactivity
            }
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4',
            },
        },
    })

    useEffect(() => {
        return () => {
            if (autosaveTimerRef.current) {
                clearTimeout(autosaveTimerRef.current)
            }
        }
    }, [])

    if (!editor) {
        return null
    }

    const addLink = () => {
        if (linkUrl) {
            editor.chain().focus().setLink({ href: linkUrl }).run()
            setLinkUrl('')
            setShowLinkInput(false)
        }
    }

    const addImage = () => {
        const url = window.prompt('Enter image URL:')
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file && file.type.startsWith('image/')) {
            const formData = new FormData()
            formData.append('file', file)

            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                })

                if (!response.ok) {
                    throw new Error('Upload failed')
                }

                const data = await response.json()
                if (data.success) {
                    editor.chain().focus().setImage({ src: data.url }).run()
                } else {
                    alert('Failed to upload image: ' + data.message)
                }
            } catch (error) {
                console.error('Error uploading image:', error)
                alert('Error uploading image. Please try again.')
            }

            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const insertTable = () => {
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
    }

    // Convert HTML to Markdown (simple conversion)
    const htmlToMarkdown = (html: string): string => {
        return html
            .replace(/<h1>(.*?)<\/h1>/g, '# $1\n')
            .replace(/<h2>(.*?)<\/h2>/g, '## $1\n')
            .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
            .replace(/<em>(.*?)<\/em>/g, '*$1*')
            .replace(/<code>(.*?)<\/code>/g, '`$1`')
            .replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)')
            .replace(/<ul>([\s\S]*?)<\/ul>/g, '$1')
            .replace(/<li>(.*?)<\/li>/g, '- $1\n')
            .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
            .replace(/<br\s*\/?>/g, '\n')
            .replace(/<[^>]+>/g, '')
    }

    return (
        <div className="border rounded-lg">
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'edit' | 'preview')}>
                <div className="flex items-center justify-between border-b bg-muted/50 p-2">
                    <TabsList className="h-8">
                        <TabsTrigger value="edit" className="text-xs">
                            <Edit3 className="h-3 w-3 mr-1" />
                            Edit
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                        </TabsTrigger>
                    </TabsList>

                    {autosave && onAutosave && (
                        <span className="text-xs text-muted-foreground">Autosave enabled</span>
                    )}
                </div>

                <TabsContent value="edit" className="m-0">
                    {/* Main Toolbar */}
                    <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/30">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={editor.isActive('bold') ? 'bg-muted' : ''}
                            title="Bold"
                        >
                            <Bold className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={editor.isActive('italic') ? 'bg-muted' : ''}
                            title="Italic"
                        >
                            <Italic className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            className={editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
                            title="Heading 1"
                        >
                            <Heading1 className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
                            title="Heading 2"
                        >
                            <Heading2 className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className={editor.isActive('bulletList') ? 'bg-muted' : ''}
                            title="Bullet List"
                        >
                            <List className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            className={editor.isActive('orderedList') ? 'bg-muted' : ''}
                            title="Ordered List"
                        >
                            <ListOrdered className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            className={editor.isActive('blockquote') ? 'bg-muted' : ''}
                            title="Blockquote"
                        >
                            <Quote className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                            className={editor.isActive('codeBlock') ? 'bg-muted' : ''}
                            title="Code Block"
                        >
                            <Code className="h-4 w-4" />
                        </Button>
                        <div className="w-px h-6 bg-border mx-1" />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().setTextAlign('left').run()}
                            className={editor.isActive({ textAlign: 'left' }) ? 'bg-muted' : ''}
                            title="Align Left"
                        >
                            <AlignLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().setTextAlign('center').run()}
                            className={editor.isActive({ textAlign: 'center' }) ? 'bg-muted' : ''}
                            title="Align Center"
                        >
                            <AlignCenter className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().setTextAlign('right').run()}
                            className={editor.isActive({ textAlign: 'right' }) ? 'bg-muted' : ''}
                            title="Align Right"
                        >
                            <AlignRight className="h-4 w-4" />
                        </Button>
                        <div className="w-px h-6 bg-border mx-1" />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={insertTable}
                            title="Insert Table"
                        >
                            <TableIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowLinkInput(!showLinkInput)}
                            className={editor.isActive('link') ? 'bg-muted' : ''}
                            title="Add Link"
                        >
                            <LinkIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={addImage}
                            title="Add Image (URL)"
                        >
                            <ImageIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            title="Upload Image"
                        >
                            <Upload className="h-4 w-4" />
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            aria-label="Upload image for editor"
                        />
                        <div className="ml-auto flex gap-1">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => editor.chain().focus().undo().run()}
                                disabled={!editor.can().undo()}
                                title="Undo"
                            >
                                <Undo className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => editor.chain().focus().redo().run()}
                                disabled={!editor.can().redo()}
                                title="Redo"
                            >
                                <Redo className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Table Controls Toolbar */}
                    {editor.isActive('table') && (
                        <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/20 items-center">
                            <span className="text-xs text-muted-foreground mr-2 font-medium">Table:</span>
                            <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => editor.chain().focus().addColumnBefore().run()} title="Add Column Before">
                                <Columns className="h-3 w-3 mr-1" /><Plus className="h-2 w-2" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => editor.chain().focus().addColumnAfter().run()} title="Add Column After">
                                <Columns className="h-3 w-3 mr-1" /><ArrowRight className="h-2 w-2" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-red-500 hover:text-red-600" onClick={() => editor.chain().focus().deleteColumn().run()} title="Delete Column">
                                <Columns className="h-3 w-3 mr-1" /><Trash2 className="h-2 w-2" />
                            </Button>
                            <div className="w-px h-4 bg-border mx-1" />
                            <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => editor.chain().focus().addRowBefore().run()} title="Add Row Before">
                                <Rows className="h-3 w-3 mr-1" /><Plus className="h-2 w-2" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => editor.chain().focus().addRowAfter().run()} title="Add Row After">
                                <Rows className="h-3 w-3 mr-1" /><ArrowDown className="h-2 w-2" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-red-500 hover:text-red-600" onClick={() => editor.chain().focus().deleteRow().run()} title="Delete Row">
                                <Rows className="h-3 w-3 mr-1" /><Trash2 className="h-2 w-2" />
                            </Button>
                            <div className="w-px h-4 bg-border mx-1" />
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-red-500 hover:text-red-600" onClick={() => editor.chain().focus().deleteTable().run()} title="Delete Table">
                                <Trash2 className="h-3 w-3 mr-1" /> Table
                            </Button>
                        </div>
                    )}

                    {/* Link Input */}
                    {showLinkInput && (
                        <div className="flex gap-2 p-2 border-b bg-muted/30">
                            <input
                                type="url"
                                placeholder="Enter URL..."
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addLink()}
                                className="flex-1 px-3 py-1 text-sm border rounded"
                            />
                            <Button type="button" size="sm" onClick={addLink}>
                                Add Link
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setShowLinkInput(false)
                                    setLinkUrl('')
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    )}

                    {/* Editor Content */}
                    <div className="border rounded-b-lg">
                        <EditorContent editor={editor} />
                    </div>
                </TabsContent>

                <TabsContent value="preview" className="m-0">
                    <div className="p-4 min-h-[300px]">
                        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
                    </div>
                    <div className="border-t p-2 bg-muted/30">
                        <details className="text-xs">
                            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                View as Markdown
                            </summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                                {htmlToMarkdown(content)}
                            </pre>
                        </details>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
