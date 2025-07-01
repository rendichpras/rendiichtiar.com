"use client"

import { useState, useEffect, Suspense } from "react"
import { Trash2, Play, Expand } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
import { Separator } from "@/components/ui/separator"
import { PageTransition } from "@/components/animations/page-transition"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { SiJavascript } from "react-icons/si"
import { motion } from "framer-motion"
import { toast } from "sonner"
import type { OnMount } from "@monaco-editor/react"

// Lazy load Monaco Editor
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

// Daftar kata kunci yang dilarang
const BLOCKED_KEYWORDS = [
  "document",
  "window",
  "location",
  "history",
  "localStorage",
  "sessionStorage",
  "indexedDB",
  "fetch",
  "XMLHttpRequest",
  "WebSocket",
  "eval",
  "Function",
  "setTimeout",
  "setInterval",
  "requestAnimationFrame",
  "alert",
  "confirm",
  "prompt",
]

// Komponen loading untuk editor
const EditorLoading = () => (
  <div className="flex items-center justify-center w-full h-full min-h-[500px] bg-secondary/20 animate-pulse rounded-md">
    <Skeleton className="w-full h-full" />
  </div>
)

function JavaScriptIcon() {
  return (
    <div className="size-8 flex items-center justify-center">
      <SiJavascript className="size-8 text-[#F7DF1E]" />
    </div>
  )
}

export function PlaygroundContent() {
  const [code, setCode] = useState("")
  const [output, setOutput] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [editorReady, setEditorReady] = useState(false)

  // Handler ketika editor siap
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    try {
      setEditorReady(true)
      editor.updateOptions({
        tabSize: 2,
        insertSpaces: true,
        autoClosingBrackets: "always",
        autoClosingQuotes: "always",
        formatOnPaste: true,
        formatOnType: true,
        // Mengaktifkan fitur paste
        quickSuggestions: {
          other: true,
          comments: true,
          strings: true
        },
        snippetSuggestions: "inline",
        // Memperbaiki masalah input
        acceptSuggestionOnEnter: "on",
        autoClosingOvertype: "always",
        autoIndent: "full",
        autoSurround: "languageDefined"
      })

      // Tambahkan snippets
      monaco.languages.registerCompletionItemProvider('javascript', {
        provideCompletionItems: (model, position) => {
          try {
            const word = model.getWordUntilPosition(position)
            const range = {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: word.startColumn,
              endColumn: word.endColumn
            }

            return {
              suggestions: [
                {
                  label: 'cl',
                  kind: monaco.languages.CompletionItemKind.Snippet,
                  insertText: 'console.log($1)',
                  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                  detail: 'Console log',
                  range
                }
              ]
            }
          } catch (error) {
            console.error('Error in completion provider:', error)
            return { suggestions: [] }
          }
        }
      })
    } catch (error) {
      console.error('Error in editor mount:', error)
    }
  }

  // Validasi kode sebelum dijalankan
  const validateCode = (code: string): boolean => {
    try {
      if (code.length > 5000) {
        toast.error("Kode terlalu panjang (maksimal 5000 karakter)")
        return false
      }

      const containsBlockedKeyword = BLOCKED_KEYWORDS.some(keyword => 
        new RegExp(`\\b${keyword}\\b`).test(code)
      )

      if (containsBlockedKeyword) {
        toast.error("Kode mengandung fungsi yang tidak diizinkan untuk keamanan")
        return false
      }

      return true
    } catch (error) {
      console.error('Error in code validation:', error)
      toast.error("Terjadi kesalahan saat validasi kode")
      return false
    }
  }

  const runCode = () => {
    if (!editorReady) {
      toast.error("Editor belum siap. Mohon tunggu sebentar.")
      return
    }
    
    try {
      if (!validateCode(code)) return

      const logs: string[] = []
      const sandbox = {
        console: {
          log: (...args: any[]) => {
            try {
              logs.push(args.map(arg => {
                if (arg instanceof Error) return arg.message
                if (typeof arg === 'object') return JSON.stringify(arg, null, 2)
                return String(arg)
              }).join(" "))
            } catch (error) {
              console.error('Error in console.log:', error)
              logs.push('[Error logging output]')
            }
          }
        }
      }

      const wrappedCode = `
        try {
          with (sandbox) {
            ${code}
          }
        } catch (error) {
          console.log(error)
        }
      `
      
      const result = new Function("sandbox", wrappedCode)(sandbox)
      setOutput([...logs, result !== undefined ? String(result) : ""].filter(Boolean).join("\n"))
    } catch (error) {
      if (error instanceof Error) {
        setOutput(error.message)
        toast.error(error.message)
      } else {
        setOutput(String(error))
        toast.error("Terjadi kesalahan saat menjalankan kode")
      }
    }
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-background relative lg:pl-64 pt-16 lg:pt-0">
        <section className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-8 sm:py-12 md:py-16">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2 max-w-2xl"
          >
            <div className="flex items-center gap-2">
              <JavaScriptIcon />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">JavaScript Playground</h1>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Uji dan jalankan kode JavaScript Anda secara langsung di browser dengan umpan balik instan.
            </p>
          </motion.div>

          <Separator className="my-6 bg-border/60" />

          {/* Playground */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className={cn(
              "grid grid-cols-1 lg:grid-cols-2 gap-4 p-4",
              isFullscreen && "fixed inset-4 z-50 overflow-auto"
            )}>
              {/* Editor Panel */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-sm rounded bg-secondary">JavaScript</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCode("")
                        setOutput("")
                      }}
                      className="size-8"
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">Hapus kode</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="size-8"
                    >
                      <Expand className="size-4" />
                      <span className="sr-only">Toggle fullscreen</span>
                    </Button>
                  </div>
                </div>
                <div className="relative min-h-[500px] border rounded-md overflow-hidden">
                  <Suspense fallback={<EditorLoading />}>
                    <MonacoEditor
                      height="500px"
                      defaultLanguage="javascript"
                      theme="vs-dark"
                      value={code}
                      onChange={value => {
                        if (!editorReady) return
                        if (value && value.length > 5000) {
                          toast.error("Kode terlalu panjang (maksimal 5000 karakter)")
                          return
                        }
                        setCode(value ?? "")
                      }}
                      onMount={handleEditorDidMount}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: "on",
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        readOnly: false,
                        automaticLayout: true,
                        wordWrap: "on",
                        formatOnPaste: true,
                        formatOnType: true,
                        tabSize: 2,
                        insertSpaces: true,
                        detectIndentation: true,
                        folding: true,
                        glyphMargin: false,
                        guides: {
                          bracketPairs: true,
                          indentation: true,
                        },
                        // Mengaktifkan fitur paste dan input
                        mouseWheelZoom: true,
                        dragAndDrop: true,
                        copyWithSyntaxHighlighting: true,
                        // Memperbaiki masalah input
                        acceptSuggestionOnEnter: "on",
                        autoClosingBrackets: "always",
                        autoClosingQuotes: "always",
                        autoIndent: "full",
                        autoSurround: "languageDefined",
                        // Mengaktifkan fitur paste
                        quickSuggestions: {
                          other: true,
                          comments: true,
                          strings: true
                        },
                        snippetSuggestions: "inline",
                        // Memperbaiki masalah cursor
                        cursorBlinking: "smooth",
                        cursorSmoothCaretAnimation: "on",
                        cursorStyle: "line",
                        // Memperbaiki masalah input
                        renderControlCharacters: true,
                        renderWhitespace: "selection"
                      }}
                      loading={<EditorLoading />}
                    />
                  </Suspense>
                </div>
              </div>

              {/* Console Panel */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-sm rounded bg-secondary">Console</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setOutput("")}
                      className="size-8"
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">Hapus output</span>
                    </Button>
                    <Button
                      variant="default"
                      size="icon"
                      onClick={runCode}
                      className="size-8"
                    >
                      <Play className="size-4" />
                      <span className="sr-only">Jalankan kode</span>
                    </Button>
                  </div>
                </div>
                <div className="min-h-[500px] p-4 font-mono text-sm border rounded-md bg-secondary/50 overflow-auto whitespace-pre-wrap">
                  {output}
                </div>
              </div>
            </Card>
          </motion.div>
        </section>
      </main>
    </PageTransition>
  )
}