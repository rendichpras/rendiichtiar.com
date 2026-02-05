export type GBEvent = {
  type: "guestbook:refresh"
  reason: "new" | "reply" | "like" | "unlike" | "delete" | "admin"
  entryId?: string
  rootId?: string
  ts: number
}

import Pusher from "pusher"

function getPusher(): Pusher | null {
  const appId = process.env.PUSHER_APP_ID
  const key = process.env.PUSHER_KEY
  const secret = process.env.PUSHER_SECRET
  const cluster = process.env.PUSHER_CLUSTER
  if (!appId || !key || !secret || !cluster) return null
  return new Pusher({ appId, key, secret, cluster, useTLS: true })
}

const pusher = getPusher()

export async function emitEvent(e: GBEvent): Promise<void> {
  if (!pusher) return
  await pusher.trigger("guestbook", "refresh", e)
}
