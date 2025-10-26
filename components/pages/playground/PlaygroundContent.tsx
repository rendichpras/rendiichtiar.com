"use client"

import { Suspense, useCallback, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { Trash2, Play, Expand } from "lucide-react"
import { SiJavascript } from "react-icons/si"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { PageTransition } from "@/components/animations/page-transition"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { OnMount } from "@monaco-editor/react"
import type * as Monaco from "monaco-editor"
import { useI18n } from "@/lib/i18n"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
})

const DEFAULT_CODE = `console.log("Hello");`

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
] as const

const MAX_LEN = 5000

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function EditorLoading() {
  return (
    <div className="flex h-full min-h[500px] w-full items-center justify-center rounded-xl border border-border/30 bg-card/50 backdrop-blur-sm">
      <Skeleton className="h-full w-full rounded-xl" />
    </div>
  )
}

function JavaScriptIcon() {
  return (
    <div className="flex size-8 items-center justify-center">
      <SiJavascript className="size-8 text-[#F7DF1E]" aria-hidden="true" />
    </div>
  )
}

export function PlaygroundContent() {
  const { messages } = useI18n()

  const [code, setCode] = useState<string>(DEFAULT_CODE)
  const [output, setOutput] = useState<string>("")
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [editorReady, setEditorReady] = useState<boolean>(false)

  const blockedPattern = useMemo(
    () =>
      new RegExp(
        String.raw`\b(?:${BLOCKED_KEYWORDS.map((k) => escapeRegex(k)).join(
          "|"
        )})\b`
      ),
    []
  )

  const handleEditorDidMount: OnMount = useCallback((editor, monaco) => {
    try {
      setEditorReady(true)

      editor.updateOptions({
        tabSize: 2,
        insertSpaces: true,
        autoClosingBrackets: "always",
        autoClosingQuotes: "always",
        formatOnPaste: true,
        formatOnType: true,
        quickSuggestions: { other: true, comments: true, strings: true },
        snippetSuggestions: "inline",
        acceptSuggestionOnEnter: "on",
        autoClosingOvertype: "always",
        autoIndent: "full",
        autoSurround: "languageDefined",
      })

      monaco.languages.registerCompletionItemProvider("javascript", {
        provideCompletionItems(
          model: Monaco.editor.ITextModel,
          position: Monaco.Position
        ): Monaco.languages.ProviderResult<Monaco.languages.CompletionList> {
          try {
            const word = model.getWordUntilPosition(position)

            const range: Monaco.IRange = {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: word.startColumn,
              endColumn: word.endColumn,
            }

            return {
              suggestions: [
                {
                  label: "cl",
                  kind: monaco.languages.CompletionItemKind.Snippet,
                  insertText: "console.log($1)",
                  insertTextRules:
                    monaco.languages.CompletionItemInsertTextRule
                      .InsertAsSnippet,
                  detail: "Console log",
                  range,
                },
              ],
            }
          } catch {
            return { suggestions: [] }
          }
        },
      })
    } catch {}
  }, [])

  const validateCode = useCallback(
    (c: string): boolean => {
      try {
        if (c.length > MAX_LEN) {
          toast.error(messages.pages.playground.errors.code_too_long)
          return false
        }
        if (blockedPattern.test(c)) {
          toast.error(messages.pages.playground.errors.blocked_keyword)
          return false
        }
        return true
      } catch {
        toast.error(messages.pages.playground.errors.validation_error)
        return false
      }
    },
    [
      blockedPattern,
      messages.pages.playground.errors.blocked_keyword,
      messages.pages.playground.errors.code_too_long,
      messages.pages.playground.errors.validation_error,
    ]
  )

  const runCode = useCallback(() => {
    if (!editorReady) {
      toast.error(messages.pages.playground.errors.editor_not_ready)
      return
    }

    try {
      if (!validateCode(code)) return

      const logs: string[] = []

      const sandbox = {
        console: {
          log: (...args: any[]) => {
            try {
              const line = args
                .map((arg) => {
                  if (arg instanceof Error) return arg.message
                  if (typeof arg === "object")
                    return JSON.stringify(arg, null, 2)
                  return String(arg)
                })
                .join(" ")
              logs.push(line)
            } catch {
              logs.push("[Error logging output]")
            }
          },
        },
      }

      const fn = new Function(
        "console",
        `
        "use strict";
        try {
          ${code}
        } catch (error) {
          console.log(error);
        }
      `
      ) as (c: Console) => void

      fn(sandbox.console as unknown as Console)
      setOutput(logs.filter(Boolean).join("\n"))
    } catch (error) {
      if (error instanceof Error) {
        setOutput(error.message)
        toast.error(error.message)
      } else {
        setOutput(String(error))
        toast.error(messages.pages.playground.errors.runtime_error)
      }
    }
  }, [
    code,
    editorReady,
    messages.pages.playground.errors.editor_not_ready,
    messages.pages.playground.errors.runtime_error,
    validateCode,
  ])

  return (
    <PageTransition>
      <section className="relative bg-background py-8 text-foreground sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl space-y-2"
          >
            <div className="flex items-center gap-2">
              <JavaScriptIcon />
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {messages.pages.playground.title}
              </h1>
            </div>

            <p className="text-sm text-muted-foreground sm:text-base">
              {messages.pages.playground.subtitle}
            </p>
          </motion.div>

          <Separator className="my-6 bg-border/40" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              className={cn(
                "grid grid-cols-1 gap-4 rounded-xl border border-border/30 bg-card/50 p-4 text-foreground backdrop-blur-sm transition-all duration-300 hover:border-border/50 lg:grid-cols-2",
                isFullscreen &&
                  "fixed inset-4 z-50 overflow-auto lg:grid-cols-2"
              )}
            >
              <CardContent className="space-y-2 p-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-xl border border-border/30 bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {messages.pages.playground.editor.language}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCode("")
                        setOutput("")
                      }}
                      className="size-8 rounded-xl border border-transparent text-muted-foreground hover:bg-background/80"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                      <span className="sr-only">
                        {messages.pages.playground.editor.actions.clear}
                      </span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsFullscreen((s) => !s)}
                      aria-pressed={isFullscreen}
                      className="size-8 rounded-xl border border-transparent text-muted-foreground hover:bg-background/80"
                    >
                      <Expand className="size-4" aria-hidden="true" />
                      <span className="sr-only">
                        {messages.pages.playground.editor.actions.fullscreen}
                      </span>
                    </Button>
                  </div>
                </div>

                <div className="relative min-h-[500px] overflow-hidden rounded-xl border border-border/30 bg-background/40 transition-all duration-300 hover:border-border/50">
                  <Suspense fallback={<EditorLoading />}>
                    <MonacoEditor
                      height="500px"
                      defaultLanguage="javascript"
                      theme="vs-dark"
                      value={code}
                      onChange={(value) => {
                        if (!editorReady) return
                        const next = value ?? ""
                        if (next.length > MAX_LEN) {
                          toast.error(
                            messages.pages.playground.errors.code_too_long
                          )
                          return
                        }
                        setCode(next)
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
                        mouseWheelZoom: true,
                        dragAndDrop: true,
                        copyWithSyntaxHighlighting: true,
                        acceptSuggestionOnEnter: "on",
                        autoClosingBrackets: "always",
                        autoClosingQuotes: "always",
                        autoIndent: "full",
                        autoSurround: "languageDefined",
                        quickSuggestions: {
                          other: true,
                          comments: true,
                          strings: true,
                        },
                        snippetSuggestions: "inline",
                        cursorBlinking: "smooth",
                        cursorSmoothCaretAnimation: "on",
                        cursorStyle: "line",
                        renderControlCharacters: true,
                        renderWhitespace: "selection",
                      }}
                      loading={<EditorLoading />}
                    />
                  </Suspense>
                </div>
              </CardContent>

              <CardContent className="space-y-2 p-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-xl border border-border/30 bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {messages.pages.playground.console.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setOutput("")}
                      className="size-8 rounded-xl border border-transparent text-muted-foreground hover:bg-background/80"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                      <span className="sr-only">
                        {messages.pages.playground.console.clear}
                      </span>
                    </Button>

                    <Button
                      size="icon"
                      onClick={runCode}
                      className="size-8 rounded-xl border border-border/30 bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      <Play className="size-4" aria-hidden="true" />
                      <span className="sr-only">
                        {messages.pages.playground.editor.actions.run}
                      </span>
                    </Button>
                  </div>
                </div>

                <div
                  className="min-h[500px] whitespace-pre-wrap overflow-auto rounded-xl border border-border/30 bg-background/40 p-4 font-mono text-sm text-foreground transition-all duration-300 hover:border-border/50"
                  role="region"
                  aria-live="polite"
                  aria-label={
                    messages.pages.playground.console.output_label ??
                    "Console output"
                  }
                >
                  {output}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
