"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { id as localeID } from "date-fns/locale"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getGuestbookEntries } from "@/app/actions/guestbook"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useEffect, useState, useCallback } from "react"
import { GuestbookSkeleton } from "./GuestbookSkeleton"
import { GuestbookReply, GuestbookReplyList, LikeButton } from "./GuestbookReply"
import { useSession } from "next-auth/react"
import { useI18n } from "@/lib/i18n"
import { LoginDialog } from "@/components/auth/LoginDialog"

// =====================
// Types: RAW (API) vs UI
// =====================
type RawLike = {
  id: string
  user: { name: string | null; email: string | null }
}

type RawReply = {
  id: string
  message: string
  createdAt: string | Date
  user: { name: string | null; image: string | null }
  mentionedUser?: { name: string | null } | null
  likes: RawLike[]
}

type RawEntry = {
  id: string
  message: string
  createdAt: string | Date
  user: { name: string | null; image: string | null; email: string | null }
  provider: string
  likes: RawLike[]
  replies: RawReply[]
}

// Setelah normalisasi untuk konsumsi UI/komponen lain:
type Reply = Omit<RawReply, "createdAt"> & { createdAt: Date }
type GuestbookEntry = Omit<RawEntry, "createdAt" | "replies"> & {
  createdAt: Date
  replies: Reply[]
}

const OWNER_EMAIL = "rendiichtiarprasetyo@gmail.com"
// TODO: Pertimbangkan pindahkan ke env atau konstanta konfigurasi

function ProviderIcon({ provider }: { provider: string }) {
  if (provider === "google") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex items-center" aria-hidden>
              {/* Google icon */}
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </span>
          </TooltipTrigger>
          <TooltipContent>Login dengan Google</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  if (provider === "github") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex items-center" aria-hidden>
              {/* GitHub icon */}
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </span>
          </TooltipTrigger>
          <TooltipContent>Login dengan GitHub</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return null
}

export function GuestbookList() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set())
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyingToName, setReplyingToName] = useState<string>("")
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const { data: session } = useSession()
  const { messages } = useI18n()

  const toggleReplies = (entryId: string) => {
    setExpandedEntries((prev) => {
      const next = new Set(prev)
      next.has(entryId) ? next.delete(entryId) : next.add(entryId)
      return next
    })
  }

  const handleReplyComplete = (entryId: string) => {
    void fetchEntries()
    setReplyingTo(null)
    setReplyingToName("")
    // pastikan thread tetap terbuka
    setExpandedEntries((prev) => new Set([...prev, entryId]))
  }

  const handleReplyClick = (parentId: string, authorName: string) => {
    if (!session) {
      setShowLoginDialog(true)
      return
    }
    setReplyingTo(parentId)
    setReplyingToName(authorName)
    setExpandedEntries((prev) => new Set([...prev, parentId]))
  }

  const fetchEntries = useCallback(async () => {
    try {
      const data = (await getGuestbookEntries()) as RawEntry[]
      // Normalisasi tanggal agar aman dipakai di date-fns dan sesuai typing UI
      const normalized: GuestbookEntry[] = data.map((e) => ({
        ...e,
        createdAt: new Date(e.createdAt),
        replies: e.replies.map((r) => ({
          ...r,
          createdAt: new Date(r.createdAt),
        })),
      }))
      setEntries(normalized)
    } catch (error) {
      console.error("Gagal mengambil data:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchEntries()
    const INTERVAL_MS = 5000
    const id = setInterval(fetchEntries, INTERVAL_MS)
    return () => clearInterval(id)
  }, [fetchEntries])

  if (loading) return <GuestbookSkeleton />

  if (entries.length === 0) {
    return (
      <Card className="transition-colors duration-300 border-border/30 hover:border-border/50">
        <CardContent>
          <div className="flex h-full items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">{messages.guestbook.list.empty}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="h-full border-border/30 transition-colors duration-300 hover:border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">
                {messages.guestbook.list.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {messages.guestbook.list.subtitle}
              </p>
            </div>
          </div>
        </CardHeader>

        <ScrollArea className="h-[calc(100%-5rem)]">
          <CardContent>
            <div className="space-y-6 pr-4">
              {entries.map((entry) => (
                <div key={entry.id} className="group">
                  <div className="flex gap-4">
                    <Avatar className="h-8 w-8 shrink-0 border border-border/30">
                      <AvatarImage src={entry.user.image || ""} alt={entry.user.name || "Avatar"} />
                      <AvatarFallback aria-hidden>
                        {entry.user.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium leading-none text-foreground/90">
                            {entry.user.name}
                          </span>
                          <ProviderIcon provider={entry.provider} />
                          {entry.user.email === OWNER_EMAIL && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="flex items-center" aria-label={messages.guestbook.list.owner}>
                                    <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                                      <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                                    </svg>
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>{messages.guestbook.list.owner}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>

                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(entry.createdAt, {
                            addSuffix: true,
                            locale: localeID,
                          })}
                        </span>
                      </div>

                      <p className="break-words text-sm leading-relaxed text-muted-foreground">
                        {entry.message}
                      </p>

                      {/* Action Buttons */}
                      <div className="mt-2 flex items-center gap-4">
                        <button
                          onClick={() => handleReplyClick(entry.id, entry.user.name || "")}
                          className="flex min-w-[60px] items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary sm:text-sm"
                          aria-label={`${messages.guestbook.list.reply.button} ${entry.user.name || ""}`}
                        >
                          <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
                          </svg>
                          <span>{messages.guestbook.list.reply.button}</span>
                        </button>

                        <LikeButton
                          guestbookId={entry.id}
                          likes={entry.likes}
                          userEmail={session?.user?.email}
                        />

                        {entry.replies.length > 0 && (
                          <button
                            onClick={() => toggleReplies(entry.id)}
                            className="flex min-w-[60px] items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary sm:text-sm"
                            aria-expanded={expandedEntries.has(entry.id)}
                            aria-controls={`replies-${entry.id}`}
                          >
                            {expandedEntries.has(entry.id) ? (
                              <span className="flex items-center gap-1.5">
                                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                <span>{messages.guestbook.list.hide_replies}</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5">
                                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span>
                                  {messages.guestbook.list.show_replies.replace("{count}", String(entry.replies.length))}
                                </span>
                              </span>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Reply Form (inline) */}
                      <GuestbookReply
                        parentId={entry.id}
                        parentAuthor={replyingToName || entry.user.name || ""}
                        onReplyComplete={() => handleReplyComplete(entry.id)}
                        isReplying={replyingTo === entry.id && !entry.replies.some((r) => r.id === replyingTo)}
                      />

                      {/* Reply List */}
                      {entry.replies.length > 0 && expandedEntries.has(entry.id) && (
                        <div id={`replies-${entry.id}`}>
                          <GuestbookReplyList replies={entry.replies} onReplyClick={handleReplyClick} />
                          {entry.replies.some((r) => r.id === replyingTo) && (
                            <GuestbookReply
                              parentId={entry.id}
                              parentAuthor={replyingToName}
                              onReplyComplete={() => handleReplyComplete(entry.id)}
                              isReplying
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator className="mt-6 bg-border/40" />
                </div>
              ))}
            </div>
          </CardContent>
        </ScrollArea>
      </Card>

      <LoginDialog isOpen={showLoginDialog} onClose={() => setShowLoginDialog(false)} />
    </>
  )
}
