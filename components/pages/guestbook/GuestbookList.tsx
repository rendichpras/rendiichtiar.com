"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { id as localeID } from "date-fns/locale";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

import {
  Reply as ReplyIcon,
  ChevronDown,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";
import { SiGoogle, SiGithub } from "react-icons/si";

import { GuestbookSkeleton } from "./GuestbookSkeleton";
import {
  GuestbookReply,
  GuestbookReplyList,
  LikeButton,
} from "./GuestbookReply";

import { getGuestbookEntries } from "@/app/guestbook/guestbook";
import { useI18n } from "@/lib/i18n";
import { LoginDialog } from "@/components/auth/LoginDialog";

type RawLike = {
  id: string;
  user: { name: string | null; email: string | null };
};

type RawReply = {
  id: string;
  message: string;
  createdAt: string | Date;
  user: { name: string | null; image: string | null };
  mentionedUser?: { name: string | null } | null;
  likes: RawLike[];
  parentId?: string | null;
  rootId?: string | null;
};

type RawEntry = {
  id: string;
  message: string;
  createdAt: string | Date;
  user: {
    name: string | null;
    image: string | null;
    email: string | null;
  };
  provider: string;
  likes: RawLike[];
  replies: RawReply[];
};

type Reply = Omit<RawReply, "createdAt"> & { createdAt: Date };
type GuestbookEntry = Omit<RawEntry, "createdAt" | "replies"> & {
  createdAt: Date;
  replies: Reply[];
};

const OWNER_EMAIL = "rendiichtiarprasetyo@gmail.com";

function orderReplies(list: Reply[], rootId: string): Reply[] {
  const byParent = new Map<string, Reply[]>();

  for (const r of list) {
    const p = r.parentId ?? rootId;
    const arr = byParent.get(p) ?? [];
    arr.push(r);
    byParent.set(p, arr);
  }

  for (const arr of byParent.values()) {
    arr.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  const out: Reply[] = [];
  const visit = (pid: string) => {
    const children = byParent.get(pid) ?? [];
    for (const c of children) {
      out.push(c);
      visit(c.id);
    }
  };
  visit(rootId);
  return out;
}

export function ProviderIcon({ provider }: { provider: string }) {
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
          <TooltipContent>Login dengan Google</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
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
          <TooltipContent>Login dengan GitHub</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return null;
}

export function GuestbookList({
  showHeader = false,
}: {
  showHeader?: boolean;
}) {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(
    new Set()
  );

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyingToName, setReplyingToName] = useState<string>("");

  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const { data: session } = useSession();
  const { messages } = useI18n();

  const toggleReplies = (entryId: string) => {
    setExpandedEntries((prev) => {
      const next = new Set(prev);
      next.has(entryId) ? next.delete(entryId) : next.add(entryId);
      return next;
    });
  };

  const handleReplyComplete = (entryId: string) => {
    setReplyingTo(null);
    setReplyingToName("");
    setExpandedEntries((prev) => new Set([...prev, entryId]));
  };

  const handleReplyClick = (
    targetId: string,
    authorName: string,
    rootId?: string
  ) => {
    if (!session) {
      setShowLoginDialog(true);
      return;
    }
    setReplyingTo(targetId);
    setReplyingToName(authorName);
    setExpandedEntries((prev) => new Set([...prev, rootId ?? targetId]));
  };

  const fetchEntries = useCallback(async () => {
    try {
      const data = (await getGuestbookEntries()) as RawEntry[];

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
      }));

      setEntries(normalized);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchEntries();

    const es = new EventSource("/api/guestbook/stream");

    es.onmessage = (evt) => {
      try {
        const ev = JSON.parse(evt.data) as
          | { type: "guestbook:new"; entry: RawEntry }
          | {
              type: "guestbook:like";
              id: string;
              userEmail: string;
              action: "like" | "unlike";
            }
          | { type: "guestbook:reply"; parentId: string; reply: RawReply };

        setEntries((prev) => {
          if (ev.type === "guestbook:new") {
            const e = ev.entry;
            const newEntry: GuestbookEntry = {
              ...e,
              createdAt: new Date(e.createdAt),
              replies: orderReplies(
                e.replies.map((r) => ({
                  ...r,
                  createdAt: new Date(r.createdAt),
                })),
                e.id
              ),
            };
            if (prev.some((p) => p.id === newEntry.id)) return prev;
            return [newEntry, ...prev];
          }

          if (ev.type === "guestbook:reply") {
            const r: Reply = {
              ...ev.reply,
              createdAt: new Date(ev.reply.createdAt),
            };

            const targetRootId =
              r.rootId ||
              prev.find((en) => en.id === ev.parentId)?.id ||
              prev.find((en) =>
                en.replies.some((x) => x.id === (r.parentId ?? ev.parentId))
              )?.id;

            if (!targetRootId) return prev;

            return prev.map((en) => {
              if (en.id !== targetRootId) return en;
              if (en.replies.some((x) => x.id === r.id)) return en;
              const next = orderReplies([...en.replies, r], en.id);
              return { ...en, replies: next };
            });
          }

          if (ev.type === "guestbook:like") {
            const { id, userEmail, action } = ev;

            return prev.map((en) => {
              if (en.id === id) {
                const liked = en.likes.some((l) => l.user.email === userEmail);
                let likes = en.likes;
                if (action === "like" && !liked) {
                  likes = [
                    ...likes,
                    {
                      id: crypto.randomUUID(),
                      user: { name: null, email: userEmail },
                    },
                  ];
                }
                if (action === "unlike" && liked) {
                  likes = likes.filter((l) => l.user.email !== userEmail);
                }
                return { ...en, likes };
              }

              const replies = en.replies.map((rr) => {
                if (rr.id !== id) return rr;
                const liked = rr.likes.some((l) => l.user.email === userEmail);
                let likes = rr.likes;
                if (action === "like" && !liked) {
                  likes = [
                    ...likes,
                    {
                      id: crypto.randomUUID(),
                      user: { name: null, email: userEmail },
                    },
                  ];
                }
                if (action === "unlike" && liked) {
                  likes = likes.filter((l) => l.user.email !== userEmail);
                }
                return { ...rr, likes };
              });

              return { ...en, replies };
            });
          }

          return prev;
        });
      } catch {
        // ignore parse error
      }
    };

    es.onerror = () => es.close();
    return () => es.close();
  }, [fetchEntries]);

  if (loading) {
    return (
      <div className="pr-4">
        <GuestbookSkeleton />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex h-full items-center justify-center py-8 text-center">
        <p className="text-sm text-muted-foreground">
          {messages.guestbook.list.empty}
        </p>
      </div>
    );
  }

  return (
    <>
      {showHeader && (
        <div className="mb-4 space-y-1">
          <p className="text-sm font-semibold text-foreground">
            {messages.guestbook.list.title}
          </p>
          <p className="text-xs text-muted-foreground">
            {messages.guestbook.list.subtitle}
          </p>
        </div>
      )}

      <div className="space-y-6 pr-4">
        {entries.map((entry) => (
          <div key={entry.id} className="group">
            <div className="flex gap-4">
              <Avatar className="h-8 w-8 shrink-0 border border-border/30">
                <AvatarImage
                  src={entry.user.image || ""}
                  alt={entry.user.name || "Avatar"}
                />
                <AvatarFallback
                  className="text-[10px] font-medium text-foreground/90"
                  aria-hidden="true"
                >
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
                            <span
                              className="flex items-center text-primary"
                              aria-label={messages.guestbook.list.owner}
                            >
                              <BadgeCheck
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {messages.guestbook.list.owner}
                          </TooltipContent>
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

                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleReplyClick(entry.id, entry.user.name || "")
                    }
                    className="flex min-w-[60px] items-center gap-1.5 p-0 text-xs text-muted-foreground hover:text-primary sm:text-sm"
                    aria-label={`${messages.guestbook.list.reply.button} ${
                      entry.user.name || ""
                    }`}
                  >
                    <ReplyIcon
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      aria-hidden="true"
                    />
                    <span>{messages.guestbook.list.reply.button}</span>
                  </Button>

                  <LikeButton
                    guestbookId={entry.id}
                    likes={entry.likes}
                    userEmail={session?.user?.email}
                  />

                  {entry.replies.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleReplies(entry.id)}
                      className="flex min-w-[60px] items-center gap-1.5 p-0 text-xs text-muted-foreground hover:text-primary sm:text-sm"
                      aria-expanded={expandedEntries.has(entry.id)}
                      aria-controls={`replies-${entry.id}`}
                    >
                      {expandedEntries.has(entry.id) ? (
                        <span className="flex items-center gap-1.5">
                          <ChevronDown
                            className="h-4 w-4 sm:h-5 sm:w-5"
                            aria-hidden="true"
                          />
                          <span>{messages.guestbook.list.hide_replies}</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <ChevronRight
                            className="h-4 w-4 sm:h-5 sm:w-5"
                            aria-hidden="true"
                          />
                          <span>
                            {messages.guestbook.list.show_replies.replace(
                              "{count}",
                              String(entry.replies.length)
                            )}
                          </span>
                        </span>
                      )}
                    </Button>
                  )}
                </div>

                {replyingTo === entry.id && (
                  <GuestbookReply
                    parentId={entry.id}
                    parentAuthor={entry.user.name || ""}
                    onReplyComplete={() => handleReplyComplete(entry.id)}
                    isReplying
                  />
                )}

                {entry.replies.length > 0 && expandedEntries.has(entry.id) && (
                  <div id={`replies-${entry.id}`}>
                    <GuestbookReplyList
                      replies={entry.replies}
                      onReplyClick={handleReplyClick}
                      rootId={entry.id}
                      rootAuthor={entry.user.name || ""}
                      activeReplyId={replyingTo}
                      activeReplyAuthor={replyingToName}
                      onReplyComplete={() => handleReplyComplete(entry.id)}
                    />
                  </div>
                )}
              </div>
            </div>

            <Separator className="mt-6 bg-border/40" />
          </div>
        ))}
      </div>

      <LoginDialog
        isOpen={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
      />
    </>
  );
}
