"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { toast } from "sonner"
import { addGuestbookEntry, toggleLike } from "@/app/actions/guestbook"
import { useI18n } from "@/lib/i18n"

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
  isReplying
}: ReplyProps) {
  const { data: session } = useSession()
  const [replyMessage, setReplyMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { messages } = useI18n()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyMessage.trim()) {
      toast.error(messages.guestbook.form.empty_error)
      return
    }

    if (!session?.user?.email) {
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
    } catch (error) {
      toast.error(messages.guestbook.list.reply.error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session || !isReplying) return null

  return (
    <div className="pl-4 sm:pl-8 mt-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-start gap-2 sm:gap-3">
          <Avatar className="h-5 w-5 sm:h-6 sm:w-6 mt-1">
            <AvatarImage src={session.user?.image || ""} />
            <AvatarFallback>
              {session.user?.name?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <Textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder={messages.guestbook.list.reply.placeholder.replace("{name}", parentAuthor)}
              className="min-h-[35px] text-xs sm:text-sm resize-none focus-visible:ring-primary"
              maxLength={280}
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onReplyComplete}
                className="text-[10px] sm:text-xs h-7 sm:h-8"
              >
                {messages.guestbook.list.reply.cancel}
              </Button>
              <Button 
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="text-[10px] sm:text-xs h-7 sm:h-8"
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
    user: {
      name: string | null
      email: string | null
    }
  }[]
  userEmail?: string | null
}

export function LikeButton({ guestbookId, likes, userEmail }: LikeButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const hasLiked = likes.some(like => like.user.email === userEmail)
  const { messages } = useI18n()

  const handleLike = async () => {
    if (!userEmail || isLoading) return
    
    setIsLoading(true)
    setIsAnimating(true)
    try {
      await toggleLike(guestbookId, userEmail)
    } catch (error) {
      toast.error(messages.guestbook.list.like.error)
    } finally {
      setIsLoading(false)
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={!userEmail || isLoading}
      className={`text-[10px] sm:text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 ${
        hasLiked ? 'text-primary' : ''
      }`}
    >
      <svg 
        className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 ${
          isAnimating ? 'scale-125' : ''
        }`}
        fill={hasLiked ? "currentColor" : "none"} 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span className={`transition-transform duration-300 ${
        isAnimating ? 'scale-110' : ''
      }`}>
        {likes.length > 0 && likes.length}
      </span>
    </button>
  )
}

interface ReplyListProps {
  replies: {
    id: string
    message: string
    createdAt: Date
    user: {
      name: string | null
      image: string | null
    }
    mentionedUser?: {
      name: string | null
    } | null
    likes: {
      id: string
      user: {
        name: string | null
        email: string | null
      }
    }[]
  }[]
  onReplyClick: (replyId: string, authorName: string) => void
}

export function GuestbookReplyList({ replies, onReplyClick }: ReplyListProps) {
  const { data: session } = useSession()
  const { messages } = useI18n()
  
  if (replies.length === 0) return null

  return (
    <div className="pl-4 sm:pl-8 mt-4 space-y-4">
      {replies.map((reply) => (
        <div key={reply.id}>
          <div className="flex items-start gap-2 sm:gap-3">
            <Avatar className="h-5 w-5 sm:h-6 sm:w-6 mt-1">
              <AvatarImage src={reply.user.image || ""} />
              <AvatarFallback>
                {reply.user.name?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs sm:text-sm font-medium text-primary">
                  {reply.user.name}
                </span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(reply.createdAt), {
                    addSuffix: true,
                    locale: id,
                  })}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">
                {reply.mentionedUser ? (
                  <>
                    <span className="text-primary">@{reply.mentionedUser.name}</span>
                    {" "}
                    {reply.message.split(`@${reply.mentionedUser.name} `)[1]}
                  </>
                ) : (
                  reply.message
                )}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={() => onReplyClick(reply.id, reply.user.name || "")}
                  className="text-[10px] sm:text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
                  </svg>
                  {messages.guestbook.list.reply.button}
                </button>
                <LikeButton 
                  guestbookId={reply.id}
                  likes={reply.likes}
                  userEmail={session?.user?.email}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 