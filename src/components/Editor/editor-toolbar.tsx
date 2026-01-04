"use client";

import { type Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Bold,
    Italic,
    Strikethrough,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Code,
    Link as LinkIcon,
    Image as ImageIcon,
    Undo,
    Redo,
    Minus,
} from "lucide-react";

interface EditorToolbarProps {
    editor: Editor;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
    const addLink = () => {
        const url = window.prompt("Enter URL:");
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const addImage = () => {
        const url = window.prompt("Enter image URL:");
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/30">
            {/* Text formatting */}
            <Button
                type="button"
                variant={editor.isActive("bold") ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className="h-8 w-8 p-0"
                title="Bold"
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("italic") ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className="h-8 w-8 p-0"
                title="Italic"
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("strike") ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className="h-8 w-8 p-0"
                title="Strikethrough"
            >
                <Strikethrough className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Headings */}
            <Button
                type="button"
                variant={editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className="h-8 w-8 p-0"
                title="Heading 1"
            >
                <Heading1 className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className="h-8 w-8 p-0"
                title="Heading 2"
            >
                <Heading2 className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className="h-8 w-8 p-0"
                title="Heading 3"
            >
                <Heading3 className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Lists */}
            <Button
                type="button"
                variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className="h-8 w-8 p-0"
                title="Bullet List"
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className="h-8 w-8 p-0"
                title="Ordered List"
            >
                <ListOrdered className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Block elements */}
            <Button
                type="button"
                variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className="h-8 w-8 p-0"
                title="Blockquote"
            >
                <Quote className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("codeBlock") ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className="h-8 w-8 p-0"
                title="Code Block"
            >
                <Code className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Links and media */}
            <Button
                type="button"
                variant={editor.isActive("link") ? "secondary" : "ghost"}
                size="sm"
                onClick={addLink}
                className="h-8 w-8 p-0"
                title="Insert Link"
            >
                <LinkIcon className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addImage}
                className="h-8 w-8 p-0"
                title="Insert Image"
            >
                <ImageIcon className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Utilities */}
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className="h-8 w-8 p-0"
                title="Horizontal Rule"
            >
                <Minus className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="h-8 w-8 p-0"
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
                className="h-8 w-8 p-0"
                title="Redo"
            >
                <Redo className="h-4 w-4" />
            </Button>
        </div>
    );
}
