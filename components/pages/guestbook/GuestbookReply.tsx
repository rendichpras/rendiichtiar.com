"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { Loader2, Heart } from "lucide-react"

import { addGuestbookEntry, toggleLike } from "@/app/guestbook/guestbook"
import { useI18n } from "@/lib/i18n"
import { cn, generateId } from "@/lib/utils"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { LoginDialog } from "@/components/auth/LoginDialog"

interface ReplyProps {
  parentId: string
  onReplyComplete: () => void
  parentAuthor: string
  isReplying: boolean
}

export function GuestbookReply({
  parentId,
  onReplyComplete,
  parentAuthor,
  isReplying,
}: ReplyProps) {
  const { isSignedIn, user } = useUser()
  const [replyMessage, setReplyMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { messages } = useI18n()

  if (!isSignedIn || !isReplying) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!replyMessage.trim()) {
      toast.error(messages.pages.guestbook.form.empty_error)
      return
    }

    setIsSubmitting(true)

    try {
      const result = await addGuestbookEntry(
        replyMessage,
        parentId,
        parentAuthor
      )

      if (!result.success && result.error) {
        if (result.error === "rate_limit_exceeded") {
          toast.error("Please wait a moment before replying again.")
        } else if (result.error === "forbidden_words") {
          toast.error(messages.pages.guestbook.form.forbidden_words)
        } else {
          toast.error(messages.pages.guestbook.list.reply.error)
        }
        return
      }

      setReplyMessage("")
      onReplyComplete()
      window.dispatchEvent(new CustomEvent("guestbook:refresh"))

      toast.success(messages.pages.guestbook.list.reply.success)
    } catch {
      toast.error(messages.pages.guestbook.list.reply.error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const name = user?.fullName || user?.username || "Me"
  const image = user?.imageUrl || ""

  return (
    <div className="mt-4 pl-4 sm:pl-8">
      <form
        onSubmit={handleSubmit}
        className="space-y-3"
        noValidate
        aria-busy={isSubmitting}
      >
        <div className="flex items-start gap-2 sm:gap-3">
          <Avatar className="mt-1 h-5 w-5 border border-border/30 sm:h-6 sm:w-6">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback
              className="text-[10px] font-medium text-foreground/90"
              aria-hidden="true"
            >
              {name.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="space-y-2">
              <Label htmlFor={`reply-${parentId}`} className="sr-only">
                {messages.pages.guestbook.list.reply.placeholder}
              </Label>

              <Textarea
                id={`reply-${parentId}`}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder={messages.pages.guestbook.list.reply.placeholder.replace(
                  "{name}",
                  parentAuthor
                )}
                className={cn(
                  "min-h-[44px] resize-none rounded-xl border-border/30 bg-card text-xs transition-colors duration-300 hover:border-border/50 focus-visible:ring-primary sm:text-sm"
                )}
                maxLength={280}
                disabled={isSubmitting}
              />
            </div>

            <div className="mt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onReplyComplete}
                disabled={isSubmitting}
                className="h-7 rounded-xl px-2 text-[10px] text-muted-foreground hover:bg-background/80 hover:text-foreground sm:h-8 sm:px-3 sm:text-xs"
              >
                {messages.pages.guestbook.list.reply.cancel}
              </Button>

              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="h-7 rounded-xl bg-primary/10 px-2 text-[10px] text-primary hover:bg-primary/20 sm:h-8 sm:px-3 sm:text-xs"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2
                      className="h-3 w-3 animate-spin sm:h-4 sm:w-4"
                      aria-hidden="true"
                    />
                    <span>{messages.pages.guestbook.list.reply.sending}</span>
                  </span>
                ) : (
                  messages.pages.guestbook.list.reply.send
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

interface LikeButtonProps {
  guestbookId: string
  likes: {
    id: string
    user: { name: string | null; email: string | null }
  }[]
  userEmail?: string | null
}

export function LikeButton({ guestbookId, likes, userEmail }: LikeButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [localLikes, setLocalLikes] = useState(likes)
  const [liked, setLiked] = useState(() =>
    localLikes.some((l) => l.user.email === userEmail)
  )
  const [isAnimating, setIsAnimating] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const { messages } = useI18n()

  const handleLike = async () => {
    if (!userEmail) {
      setShowLoginDialog(true)
      return
    }
    if (isLoading) return

    setIsLoading(true)
    setIsAnimating(true)

    const prev = { liked, localLikes }

    try {
      if (liked) {
        setLiked(false)
        setLocalLikes((ls) => ls.filter((l) => l.user.email !== userEmail))
      } else {
        setLiked(true)
        setLocalLikes((ls) => [
          ...ls,
          {
            id: generateId(),
            user: { name: null, email: userEmail },
          },
        ])
      }

      const result = await toggleLike(guestbookId)

      if (!result.success) {
        throw new Error(result.error)
      }
    } catch {
      setLiked(prev.liked)
      setLocalLikes(prev.localLikes)
      toast.error(messages.pages.guestbook.list.like.error)
    } finally {
      setIsLoading(false)
      setTimeout(() => setIsAnimating(false), 200)
    }
  }

  useEffect(() => {
    setLocalLikes(likes)
    setLiked(likes.some((l) => l.user.email === userEmail))
  }, [likes, userEmail])

  return (
    <>
      <Button
        onClick={handleLike}
        disabled={isLoading}
        aria-pressed={liked}
        variant="ghost"
        size="sm"
        className={cn(
          "flex items-center gap-1 p-0 text-[10px] text-muted-foreground hover:text-primary sm:text-xs",
          liked && "text-primary"
        )}
      >
        <Heart
          className={cn(
            "h-3 w-3 transition-transform duration-200 sm:h-4 sm:w-4",
            isAnimating && "scale-125"
          )}
          fill={liked ? "currentColor" : "none"}
          aria-hidden="true"
        />
        <span
          className={cn(
            "transition-transform duration-200",
            isAnimating && "scale-110"
          )}
        >
          {localLikes.length || ""}
        </span>
      </Button>

      <LoginDialog
        isOpen={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
      />
    </>
  )
}

interface ReplyListProps {
  replies: {
    id: string
    message: string
    createdAt: Date
    user: { name: string | null; image: string | null }
    mentionedUser?: { name: string | null } | null
    likes: { id: string; user: { name: string | null; email: string | null } }[]
    parentId?: string | null
    rootId?: string | null
  }[]
  userEmail?: string | null
  onReplyClick: (targetId: string, authorName: string, rootId?: string) => void
  replyingTo: string | null
  onReplyComplete: (entryId: string) => void
  rootId: string
}

export function GuestbookReplyList({
  replies,
  userEmail,
  onReplyClick,
  replyingTo,
  onReplyComplete,
  rootId,
}: ReplyListProps) {
  const { messages } = useI18n()

  if (!replies.length) return null

  return (
    <div className="mt-3 space-y-4 border-l border-border/30 pl-4 sm:pl-8">
      {replies.map((reply) => {
        const name = reply.user.name || "Guest"
        const initial = name.charAt(0).toUpperCase()

        return (
          <div key={reply.id} className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2 sm:gap-3">
                <Avatar className="mt-0.5 h-6 w-6 border border-border/30 sm:h-7 sm:w-7">
                  <AvatarImage src={reply.user.image || ""} alt={name} />
                  <AvatarFallback className="text-[10px] font-medium text-foreground/90">
                    {initial}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-foreground/90 sm:text-sm">
                    {name}
                  </p>

                  <p className="whitespace-pre-wrap break-words text-xs text-foreground/80 sm:text-sm">
                    {reply.mentionedUser?.name ? (
                      <span className="font-medium text-primary">
                        @{reply.mentionedUser.name}{" "}
                      </span>
                    ) : null}
                    {reply.message}
                  </p>

                  <div className="mt-1 flex items-center gap-3 text-[10px] text-muted-foreground sm:text-xs">
                    <button
                      type="button"
                      onClick={() => onReplyClick(reply.id, name, rootId)}
                      className="hover:text-foreground"
                    >
                      {messages.pages.guestbook.list.reply.button}
                    </button>

                    <LikeButton
                      guestbookId={reply.id}
                      likes={reply.likes}
                      userEmail={userEmail}
                    />
                  </div>
                </div>
              </div>
            </div>

            <GuestbookReply
              parentId={reply.id}
              parentAuthor={name}
              isReplying={replyingTo === reply.id}
              onReplyComplete={() => onReplyComplete(rootId)}
            />
          </div>
        )
      })}
    </div>
  )
}
