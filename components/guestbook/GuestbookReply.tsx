"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatDistanceToNow } from "date-fns"
import { id as localeID } from "date-fns/locale"
import { toast } from "sonner"
import { addGuestbookEntry, toggleLike } from "@/app/actions/guestbook"
import { useI18n } from "@/lib/i18n"
import { LoginDialog } from "@/components/auth/LoginDialog"

interface ReplyProps {
  parentId: string
  onReplyComplete: () => void
  parentAuthor: string
  isReplying: boolean
}

export function GuestbookReply({ parentId, onReplyComplete, parentAuthor, isReplying }: ReplyProps) {
  const { data: session } = useSession()
  const [replyMessage, setReplyMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { messages } = useI18n()

  if (!session || !isReplying) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!replyMessage.trim()) {
      toast.error(messages.guestbook.form.empty_error)
      return
    }
    if (!session.user?.email) {
      toast.error(messages.guestbook.form.session_error)
      return
    }
    setIsSubmitting(true)
    try {
      const messageWithMention = `@${parentAuthor} ${replyMessage}`
      await addGuestbookEntry(messageWithMention, session.user.email, parentId, parentAuthor)
      setReplyMessage("")
      onReplyComplete()
      toast.success(messages.guestbook.list.reply.success)
    } catch {
      toast.error(messages.guestbook.list.reply.error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-4 pl-4 sm:pl-8">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-start gap-2 sm:gap-3">
          <Avatar className="mt-1 h-5 w-5 border border-border/30 sm:h-6 sm:w-6">
            <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "Me"} />
            <AvatarFallback aria-hidden>{session.user?.name?.charAt(0) || "?"}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <Textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder={messages.guestbook.list.reply.placeholder.replace("{name}", parentAuthor)}
              className="min-h-[35px] resize-none border-border/30 transition-all duration-300 hover:border-border/50 focus-visible:ring-primary text-xs sm:text-sm"
              maxLength={280}
            />
            <div className="mt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onReplyComplete}
                className="h-7 text-[10px] hover:bg-background/80 sm:h-8 sm:text-xs"
              >
                {messages.guestbook.list.reply.cancel}
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="h-7 bg-primary/10 text-[10px] text-primary hover:bg-primary/20 sm:h-8 sm:text-xs"
              >
                {isSubmitting ? messages.guestbook.list.reply.sending : messages.guestbook.list.reply.send}
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
  const [isAnimating, setIsAnimating] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const { messages } = useI18n()
  const hasLiked = likes.some((l) => l.user.email === userEmail)

  const handleLike = async () => {
    if (!userEmail) {
      setShowLoginDialog(true)
      return
    }
    if (isLoading) return
    setIsLoading(true)
    setIsAnimating(true)
    try {
      await toggleLike(guestbookId, userEmail)
    } catch {
      toast.error(messages.guestbook.list.like.error)
    } finally {
      setIsLoading(false)
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  return (
    <>
      <button
        onClick={handleLike}
        disabled={isLoading}
        aria-pressed={hasLiked}
        className={`flex items-center gap-1 text-[10px] text-muted-foreground transition-colors hover:text-primary sm:text-xs ${
          hasLiked ? "text-primary" : ""
        }`}
      >
        <svg
          className={`h-3 w-3 transition-transform duration-300 sm:h-4 sm:w-4 ${isAnimating ? "scale-125" : ""}`}
          fill={hasLiked ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <span className={`transition-transform duration-300 ${isAnimating ? "scale-110" : ""}`}>
          {likes.length > 0 && likes.length}
        </span>
      </button>

      <LoginDialog isOpen={showLoginDialog} onClose={() => setShowLoginDialog(false)} />
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
    likes: {
      id: string
      user: { name: string | null; email: string | null }
    }[]
  }[]
  onReplyClick: (replyId: string, authorName: string) => void
}

export function GuestbookReplyList({ replies, onReplyClick }: ReplyListProps) {
  const { data: session } = useSession()
  const { messages } = useI18n()
  if (replies.length === 0) return null

  return (
    <div className="mt-4 space-y-4 pl-4 sm:pl-8">
      {replies.map((reply) => (
        <div key={reply.id}>
          <div className="flex items-start gap-2 sm:gap-3">
            <Avatar className="mt-1 h-5 w-5 border border-border/30 sm:h-6 sm:w-6">
              <AvatarImage src={reply.user.image || ""} alt={reply.user.name || "Avatar"} />
              <AvatarFallback aria-hidden>{reply.user.name?.charAt(0) || "?"}</AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-foreground/90 sm:text-sm">{reply.user.name}</span>
                <span className="text-[10px] text-muted-foreground sm:text-xs">
                  {formatDistanceToNow(reply.createdAt, { addSuffix: true, locale: localeID })}
                </span>
              </div>

              <p className="mt-1 break-words text-xs text-muted-foreground sm:text-sm">
                {reply.mentionedUser ? (
                  <>
                    <span className="text-primary">@{reply.mentionedUser.name}</span>{" "}
                    {reply.message.split(`@${reply.mentionedUser.name} `)[1]}
                  </>
                ) : (
                  reply.message
                )}
              </p>

              <div className="mt-2 flex items-center gap-4">
                <button
                  onClick={() => onReplyClick(reply.id, reply.user.name || "")}
                  className="flex items-center gap-1 text-[10px] text-muted-foreground transition-colors hover:text-primary sm:text-xs"
                >
                  <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
                  </svg>
                  {messages.guestbook.list.reply.button}
                </button>

                <LikeButton guestbookId={reply.id} likes={reply.likes} userEmail={session?.user?.email} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
