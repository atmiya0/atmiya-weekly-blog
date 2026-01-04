"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { EditorToolbar } from "@/components/Editor/editor-toolbar";
import "./editor.css";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = "Start writing...",
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-brand underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full",
        },
      }),
    ],
    content,
    immediatelyRender: false, // Prevents SSR hydration mismatch
    editorProps: {
      attributes: {
        class: "tiptap focus:outline-none h-[350px] overflow-y-auto p-4",
      },
    },
    onUpdate: ({ editor }) => {
      // Convert to HTML for now, we'll convert to markdown on save
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return (
      <div className="border border-border rounded-lg p-4 h-[350px] bg-card animate-pulse" />
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
