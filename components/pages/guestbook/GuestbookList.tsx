"use client"

import { useCallback, useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { formatDistanceToNow } from "date-fns"
import { id as localeID, enUS as localeEN } from "date-fns/locale"
import { motion } from "framer-motion"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

import {
  Reply as ReplyIcon,
  ChevronDown,
  ChevronRight,
  BadgeCheck,
} from "lucide-react"
import { SiGoogle, SiGithub } from "react-icons/si"

import { MessageSkeleton } from "./GuestbookSkeleton"
import { EmptyState } from "@/components/ui/empty-state"
import {
  GuestbookReply,
  GuestbookReplyList,
  LikeButton,
} from "./GuestbookReply"

import { getGuestbookEntries } from "@/lib/actions/guestbook"
import { useTranslations, useLocale } from "next-intl"
import { LoginDialog } from "@/components/auth/LoginDialog"
import Pusher from "pusher-js"

type RawLike = {
  id: string
  user: { name: string | null; clerkId: string }
}

type RawReply = {
  id: string
  message: string
  createdAt: string | Date
  user: { name: string | null; image: string | null; isOwner: boolean }
  mentionedUser?: { name: string | null } | null
  likes: RawLike[]
  parentId?: string | null
  rootId?: string | null
}

type RawEntry = {
  id: string
  message: string
  createdAt: string | Date
  user: {
    name: string | null
    image: string | null
    isOwner: boolean
  }
  provider: string
  likes: RawLike[]
  replies: RawReply[]
}

type Reply = Omit<RawReply, "createdAt"> & { createdAt: Date }
type GuestbookEntry = Omit<RawEntry, "createdAt" | "replies"> & {
  createdAt: Date
  replies: Reply[]
}

function orderReplies(list: Reply[], rootId: string): Reply[] {
  const byParent = new Map<string, Reply[]>()

  for (const r of list) {
    const p = r.parentId ?? rootId
    const arr = byParent.get(p) ?? []
    arr.push(r)
    byParent.set(p, arr)
  }

  for (const arr of byParent.values()) {
    arr.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  }

  const out: Reply[] = []
  const visit = (pid: string) => {
    const children = byParent.get(pid) ?? []
    for (const c of children) {
      out.push(c)
      visit(c.id)
    }
  }
  visit(rootId)
  return out
}

function ProviderIcon({ provider }: { provider: string }) {
  const t = useTranslations("common")

  if (provider === "google") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className="flex items-center text-muted-foreground"
              aria-hidden="true"
            >
              <SiGoogle className="h-4 w-4" />
            </span>
          </TooltipTrigger>
          <TooltipContent>{t("auth.login.google")}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  if (provider === "github") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className="flex items-center text-muted-foreground"
              aria-hidden="true"
            >
              <SiGithub className="h-4 w-4" />
            </span>
          </TooltipTrigger>
          <TooltipContent>{t("auth.login.github")}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return null
}

export function GuestbookList({
  showHeader = false,
}: {
  showHeader?: boolean
}) {
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [loading, setLoading] = useState(true)

  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set())

  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const [showLoginDialog, setShowLoginDialog] = useState(false)

  const { isSignedIn, user } = useUser()
  const t = useTranslations("pages.guestbook")
  const tCommon = useTranslations("common")
  const locale = useLocale()
  const dateLocale = locale === "id" ? localeID : localeEN

  const userClerkId = user?.id ?? null

  const toggleReplies = (entryId: string) => {
    setExpandedEntries((prev) => {
      const next = new Set(prev)
      if (next.has(entryId)) {
        next.delete(entryId)
      } else {
        next.add(entryId)
      }
      return next
    })
  }

  const handleReplyComplete = (entryId: string) => {
    setReplyingTo(null)
    setExpandedEntries((prev) => new Set([...prev, entryId]))
  }

  const handleReplyClick = (
    targetId: string,
    authorName: string,
    rootId?: string
  ) => {
    if (!isSignedIn) {
      setShowLoginDialog(true)
      return
    }
    setReplyingTo(targetId)
    setExpandedEntries((prev) => new Set([...prev, rootId ?? targetId]))
  }

  const fetchEntries = useCallback(async () => {
    try {
      const data = (await getGuestbookEntries()) as RawEntry[]

      const normalized: GuestbookEntry[] = data.map((e) => ({
        ...e,
        createdAt: new Date(e.createdAt),
        replies: orderReplies(
          e.replies.map((r) => ({
            ...r,
            createdAt: new Date(r.createdAt),
          })),
          e.id
        ),
      }))

      setEntries(normalized)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchEntries()

    const handler = () => {
      void fetchEntries()
    }

    window.addEventListener("guestbook:refresh", handler)

    return () => {
      window.removeEventListener("guestbook:refresh", handler)
    }
  }, [fetchEntries])

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER
    if (!key || !cluster) return

    const pusher = new Pusher(key, { cluster })
    const channel = pusher.subscribe("guestbook")

    channel.bind("refresh", () => {
      void fetchEntries()
    })

    return () => {
      channel.unbind_all()
      pusher.unsubscribe("guestbook")
      pusher.disconnect()
    }
  }, [fetchEntries])

  if (loading) {
    return (
      <div className="space-y-6 pr-4">
        {[...Array(3)].map((_, i) => (
          <MessageSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <EmptyState
        title={t("list.empty")}
        description={t("list.empty_description")}
      />
    )
  }

  return (
    <>
      {showHeader && (
        <div className="mb-4 space-y-1">
          <p className="text-sm font-semibold text-foreground">
            {t("list.title")}
          </p>
          <p className="text-xs text-muted-foreground">{t("list.subtitle")}</p>
        </div>
      )}

      <motion.div
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {entries.map((entry) => (
          <motion.div
            key={entry.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            className="group"
          >
            <Card className="border-border bg-card transition-colors duration-300 hover:border-primary">
              <CardContent>
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10 shrink-0 border border-border">
                    <AvatarImage
                      src={entry.user.image || ""}
                      alt={entry.user.name || tCommon("navigation.avatar")}
                    />
                    <AvatarFallback
                      className="font-medium text-foreground/90"
                      aria-hidden="true"
                    >
                      {entry.user.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {entry.user.name}
                        </span>

                        <ProviderIcon provider={entry.provider} />

                        {entry.user.isOwner && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span
                                  className="flex items-center text-primary"
                                  aria-label={t("list.owner")}
                                >
                                  <BadgeCheck
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                  />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>{t("list.owner")}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>

                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(entry.createdAt, {
                          addSuffix: true,
                          locale: dateLocale,
                        })}
                      </span>
                    </div>

                    <p className="break-all text-sm leading-relaxed text-foreground/90">
                      {entry.message}
                    </p>

                    <Separator className="bg-border/50" />

                    <div className="flex flex-wrap items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleReplyClick(entry.id, entry.user.name || "")
                        }
                        className="flex h-8 items-center gap-1.5 px-2 text-xs text-muted-foreground hover:bg-secondary hover:text-primary sm:text-sm"
                        aria-label={`${t("list.reply.button")} ${entry.user.name || ""}`}
                      >
                        <ReplyIcon className="h-4 w-4" aria-hidden="true" />
                        <span>{t("list.reply.button")}</span>
                      </Button>

                      <LikeButton
                        guestbookId={entry.id}
                        likes={entry.likes}
                        userClerkId={userClerkId}
                      />

                      {entry.replies.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleReplies(entry.id)}
                          className="flex h-8 items-center gap-1.5 px-2 text-xs text-muted-foreground hover:bg-secondary hover:text-primary sm:text-sm"
                          aria-expanded={expandedEntries.has(entry.id)}
                          aria-controls={`replies-${entry.id}`}
                        >
                          {expandedEntries.has(entry.id) ? (
                            <span className="flex items-center gap-1.5">
                              <ChevronDown
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                              <span>{t("list.hide_replies")}</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5">
                              <ChevronRight
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                              <span>
                                {t("list.show_replies", {
                                  count: entry.replies.length,
                                })}
                              </span>
                            </span>
                          )}
                        </Button>
                      )}
                    </div>

                    {replyingTo === entry.id && (
                      <div className="pt-2">
                        <GuestbookReply
                          parentId={entry.id}
                          parentAuthor={entry.user.name || ""}
                          onReplyComplete={() => handleReplyComplete(entry.id)}
                          isReplying
                        />
                      </div>
                    )}

                    {entry.replies.length > 0 &&
                      expandedEntries.has(entry.id) && (
                        <div id={`replies-${entry.id}`} className="pt-2">
                          <GuestbookReplyList
                            replies={entry.replies}
                            onReplyClick={handleReplyClick}
                            rootId={entry.id}
                            replyingTo={replyingTo}
                            onReplyComplete={() =>
                              handleReplyComplete(entry.id)
                            }
                            userClerkId={userClerkId}
                          />
                        </div>
                      )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <LoginDialog
        isOpen={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
      />
    </>
  )
}
