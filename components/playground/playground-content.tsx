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

// Lazy load Monaco Editor
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full min-h-[500px] bg-secondary/20 animate-pulse rounded-md">
      <Skeleton className="w-full h-full" />
    </div>
  ),
})

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

function EditorSkeleton() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-8" />
          <Skeleton className="size-8" />
        </div>
      </div>
      <Skeleton className="w-full h-[500px]" />
    </motion.div>
  )
}

function ConsoleSkeleton() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-8" />
          <Skeleton className="size-8" />
        </div>
      </div>
      <Skeleton className="w-full h-[500px]" />
    </motion.div>
  )
}

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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Validasi kode sebelum dijalankan
  const validateCode = (code: string): boolean => {
    const containsBlockedKeyword = BLOCKED_KEYWORDS.some(keyword => 
      new RegExp(`\\b${keyword}\\b`).test(code)
    )

    if (containsBlockedKeyword) {
      toast.error("Kode mengandung fungsi yang tidak diizinkan untuk keamanan")
      return false
    }

    if (code.length > 5000) {
      toast.error("Kode terlalu panjang (maksimal 5000 karakter)")
      return false
    }

    return true
  }

  const runCode = () => {
    try {
      if (!validateCode(code)) {
        return
      }

      // Buat sandbox untuk menjalankan kode
      const sandbox = {
        console: {
          log: (...args: any[]) => {
            logs.push(args.map(arg => {
              if (typeof arg === 'object') {
                return JSON.stringify(arg, null, 2)
              }
              return String(arg)
            }).join(" "))
          }
        }
      }

      // Menangkap console.log
      const logs: string[] = []

      // Menggunakan Function constructor dengan konteks terbatas
      const wrappedCode = `
        with (sandbox) {
          ${code}
        }
      `
      
      const result = new Function("sandbox", wrappedCode)(sandbox)
      
      // Menampilkan output
      setOutput([...logs, result !== undefined ? String(result) : ""].filter(Boolean).join("\n"))
    } catch (error) {
      setOutput(String(error))
    }
  }

  const clearCode = () => {
    setCode("")
    setOutput("")
  }

  const handleEditorChange = (value: string | undefined) => {
    if (value && value.length > 5000) {
      toast.error("Kode terlalu panjang (maksimal 5000 karakter)")
      return
    }
    setCode(value || "")
  }

  if (!mounted) {
    return (
      <PageTransition>
        <main className="min-h-screen bg-background relative lg:pl-64 pt-16 lg:pt-0">
          <section className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-8 sm:py-12 md:py-16">
            {/* Header */}
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <Skeleton className="size-8" />
                <Skeleton className="h-9 w-48" />
              </div>
              <Skeleton className="h-5 w-96" />
            </div>

            <Separator className="my-6 bg-border/60" />

            {/* Playground */}
            <Card className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
              <EditorSkeleton />
              <ConsoleSkeleton />
            </Card>
          </section>
        </main>
      </PageTransition>
    )
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
                      onClick={clearCode}
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
                  <Suspense fallback={<Skeleton className="w-full h-[500px]" />}>
                    <MonacoEditor
                      height="500px"
                      defaultLanguage="javascript"
                      theme="vs-dark"
                      value={code}
                      onChange={handleEditorChange}
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
                      }}
                      loading={<Skeleton className="w-full h-[500px]" />}
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