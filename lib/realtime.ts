type GBEvent =
  | {
      type: "guestbook:new"
      entry: {
        id: string
        message: string
        createdAt: Date
        user: {
          name: string | null
          image: string | null
          email: string | null
        }
        provider: string
        likes: {
          id: string
          user: { name: string | null; email: string | null }
        }[]
        replies: {
          id: string
          message: string
          createdAt: Date
          user: { name: string | null; image: string | null }
        }[]
      }
    }
  | {
      type: "guestbook:like"
      id: string
      userEmail: string
      action: "like" | "unlike"
    }
  | {
      type: "guestbook:reply"
      parentId: string
      reply: {
        id: string
        message: string
        createdAt: Date
        user: { name: string | null; image: string | null }
        mentionedUser: { name: string | null } | null
        likes: {
          id: string
          user: { name: string | null; email: string | null }
        }[]
        parentId: string | null
        rootId: string | null
      }
    }

import Pusher from "pusher"

export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
})

export function emitEvent(e: GBEvent) {
  pusher.trigger("guestbook", "gb", e)
}
