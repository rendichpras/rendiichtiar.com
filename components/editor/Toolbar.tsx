"use client"

import { type Editor } from "@tiptap/react"
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
  Undo,
  Redo,
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react"
import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type ToolbarProps = {
  editor: Editor | null
}

export function Toolbar({ editor }: ToolbarProps) {
  if (!editor) {
    return null
  }

  const addImage = () => {
    const url = window.prompt("Enter image URL:")
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("Enter URL", previousUrl)

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
    <div className="flex flex-wrap gap-1 border-b bg-muted p-2">
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        aria-label="Toggle bold"
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Toggle italic"
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        aria-label="Toggle strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("code")}
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
        aria-label="Toggle code"
      >
        <Code className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("codeBlock")}
        onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
        aria-label="Toggle code block"
      >
        <Code className="h-4 w-4 border-2 border-current" />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 1 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        aria-label="Toggle H1"
      >
        <Heading1 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 2 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        aria-label="Toggle H2"
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 3 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
        aria-label="Toggle H3"
      >
        <Heading3 className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        aria-label="Toggle bullet list"
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        aria-label="Toggle ordered list"
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("blockquote")}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        aria-label="Toggle quote"
      >
        <Quote className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button variant="ghost" size="sm" onClick={setLink} type="button">
        <LinkIcon className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={addImage} type="button">
        <ImageIcon className="h-4 w-4" />
      </Button>

      <div className="ml-auto flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          type="button"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          type="button"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
