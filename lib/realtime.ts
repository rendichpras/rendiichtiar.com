import { EventEmitter } from "node:events"

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

const globalForEmitter = globalThis as unknown as { __gbEmitter: EventEmitter }

const emitter: EventEmitter = globalForEmitter.__gbEmitter ?? new EventEmitter()

if (!globalForEmitter.__gbEmitter) {
  globalForEmitter.__gbEmitter = emitter
}

export function onEvent(cb: (e: GBEvent) => void) {
  emitter.on("gb", cb)
  return () => emitter.off("gb", cb)
}

export function emitEvent(e: GBEvent) {
  emitter.emit("gb", e)
}
