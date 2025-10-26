import { EventEmitter } from "node:events"

type GBEvent =
  | { type: "guestbook:new"; entry: any }
  | {
      type: "guestbook:like"
      id: string
      userEmail: string
      action: "like" | "unlike"
    }
  | { type: "guestbook:reply"; parentId: string; reply: any }

const globalAny = globalThis as any

const emitter: EventEmitter = globalAny.__gbEmitter ?? new EventEmitter()

if (!globalAny.__gbEmitter) {
  globalAny.__gbEmitter = emitter
}

export function onEvent(cb: (e: GBEvent) => void) {
  emitter.on("gb", cb)
  return () => emitter.off("gb", cb)
}

export function emitEvent(e: GBEvent) {
  emitter.emit("gb", e)
}
