"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { id as localeID } from "date-fns/locale";
import { toast } from "sonner";
import { CornerUpRight, Loader2, Heart } from "lucide-react";

import { addGuestbookEntry, toggleLike } from "@/app/guestbook/guestbook";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LoginDialog } from "@/components/auth/LoginDialog";

interface ReplyProps {
  parentId: string;
  onReplyComplete: () => void;
  parentAuthor: string;
  isReplying: boolean;
}

export function GuestbookReply({
  parentId,
  onReplyComplete,
  parentAuthor,
  isReplying,
}: ReplyProps) {
  const { data: session } = useSession();
  const [replyMessage, setReplyMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { messages } = useI18n();

  if (!session || !isReplying) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!replyMessage.trim()) {
      toast.error(messages.pages.guestbook.form.empty_error);
      return;
    }
    if (!session.user?.email) {
      toast.error(messages.pages.guestbook.form.session_error);
      return;
    }

    setIsSubmitting(true);

    try {
      const messageWithMention = `@${parentAuthor} ${replyMessage}`;
      await addGuestbookEntry(
        messageWithMention,
        session.user.email,
        parentId,
        parentAuthor
      );

      setReplyMessage("");
      onReplyComplete();
      toast.success(messages.pages.guestbook.list.reply.success);
    } catch {
      toast.error(messages.pages.guestbook.list.reply.error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <AvatarImage
              src={session.user?.image || ""}
              alt={session.user?.name || "Me"}
            />
            <AvatarFallback
              className="text-[10px] font-medium text-foreground/90"
              aria-hidden="true"
            >
              {session.user?.name?.charAt(0) || "?"}
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
                  "min-h-[44px] resize-none rounded-xl border-border/30 bg-card/50 text-xs backdrop-blur-sm transition-colors duration-300 hover:border-border/50 focus-visible:ring-primary sm:text-sm"
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
  );
}

interface LikeButtonProps {
  guestbookId: string;
  likes: {
    id: string;
    user: { name: string | null; email: string | null };
  }[];
  userEmail?: string | null;
}

export function LikeButton({ guestbookId, likes, userEmail }: LikeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [localLikes, setLocalLikes] = useState(likes);
  const [liked, setLiked] = useState(() =>
    localLikes.some((l) => l.user.email === userEmail)
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { messages } = useI18n();

  const handleLike = async () => {
    if (!userEmail) {
      setShowLoginDialog(true);
      return;
    }
    if (isLoading) return;

    setIsLoading(true);
    setIsAnimating(true);

    const prev = { liked, localLikes };

    try {
      if (liked) {
        setLiked(false);
        setLocalLikes((ls) => ls.filter((l) => l.user.email !== userEmail));
      } else {
        setLiked(true);
        setLocalLikes((ls) => [
          ...ls,
          {
            id: crypto.randomUUID(),
            user: { name: null, email: userEmail },
          },
        ]);
      }

      await toggleLike(guestbookId, userEmail);
    } catch {
      setLiked(prev.liked);
      setLocalLikes(prev.localLikes);
      toast.error(messages.pages.guestbook.list.like.error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsAnimating(false), 200);
    }
  };

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
  );
}

interface ReplyListProps {
  replies: {
    id: string;
    message: string;
    createdAt: Date;
    user: { name: string | null; image: string | null };
    mentionedUser?: { name: string | null } | null;
    likes: {
      id: string;
      user: { name: string | null; email: string | null };
    }[];
    parentId?: string | null;
    rootId?: string | null;
  }[];
  onReplyClick: (targetId: string, authorName: string, rootId: string) => void;
  rootId: string;
  rootAuthor: string;
  activeReplyId: string | null;
  activeReplyAuthor: string;
  onReplyComplete: () => void;
}

export function GuestbookReplyList({
  replies,
  onReplyClick,
  rootId,
  rootAuthor,
  activeReplyId,
  activeReplyAuthor,
  onReplyComplete,
}: ReplyListProps) {
  const { data: session } = useSession();
  const { messages } = useI18n();

  if (replies.length === 0) return null;

  return (
    <div className="mt-4 space-y-4 pl-4 sm:pl-8">
      {replies.map((reply) => {
        const isReplyToReply = !!reply.parentId && reply.parentId !== rootId;
        const isActive = activeReplyId === reply.id;

        return (
          <div
            key={reply.id}
            className={cn(
              "space-y-1",
              isReplyToReply && "border-l border-border/30 pl-6 sm:pl-10"
            )}
          >
            <div className="flex items-start gap-2 sm:gap-3">
              <Avatar className="mt-1 h-5 w-5 border border-border/30 sm:h-6 sm:w-6">
                <AvatarImage
                  src={reply.user.image || ""}
                  alt={reply.user.name || "Avatar"}
                />
                <AvatarFallback
                  className="text-[10px] font-medium text-foreground/90"
                  aria-hidden="true"
                >
                  {reply.user.name?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-foreground/90 sm:text-sm">
                    {reply.user.name}
                  </span>

                  <span className="text-[10px] text-muted-foreground sm:text-xs">
                    {formatDistanceToNow(reply.createdAt, {
                      addSuffix: true,
                      locale: localeID,
                    })}
                  </span>
                </div>

                <p className="mt-1 break-words text-xs text-muted-foreground sm:text-sm">
                  {reply.mentionedUser ? (
                    <>
                      <span className="text-primary">
                        @{reply.mentionedUser.name}
                      </span>{" "}
                      {reply.message.split(`@${reply.mentionedUser.name} `)[1]}
                    </>
                  ) : (
                    reply.message
                  )}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onReplyClick(reply.id, reply.user.name || "", rootId)
                    }
                    className="flex items-center gap-1 p-0 text-[10px] text-muted-foreground hover:text-primary sm:text-xs"
                  >
                    <CornerUpRight
                      className="h-3 w-3 sm:h-4 sm:w-4"
                      aria-hidden="true"
                    />
                    {messages.pages.guestbook.list.reply.button}
                  </Button>

                  <LikeButton
                    guestbookId={reply.id}
                    likes={reply.likes}
                    userEmail={session?.user?.email}
                  />
                </div>

                {isActive && (
                  <GuestbookReply
                    parentId={reply.id}
                    parentAuthor={
                      activeReplyAuthor || reply.user.name || rootAuthor
                    }
                    onReplyComplete={onReplyComplete}
                    isReplying
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
