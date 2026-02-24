"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight"
import { common, createLowlight } from "lowlight"
import { isSafeHref } from "@/lib/security/url"
import { Toolbar } from "./Toolbar"

const lowlight = createLowlight(common)

type TiptapEditorProps = {
  content: string
  onChange: (richText: string) => void
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        validate: (href) => isSafeHref(href),
        HTMLAttributes: {
          class: "text-primary underline underline-offset-4",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: " border",
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "javascript",
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base dark:prose-invert focus:outline-none max-w-none min-h-[300px] p-4",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  return (
    <div className="flex min-h-[400px] w-full flex-col  border bg-card">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
    </div>
  )
}
