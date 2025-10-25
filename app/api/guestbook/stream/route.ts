export const runtime = "nodejs"

import { onEvent } from "@/lib/realtime"

export async function GET(req: Request) {
  let closed = false
  let off: (() => void) | null = null
  let ping: ReturnType<typeof setInterval> | null = null

  const stream = new ReadableStream({
    start(controller) {
      const send = (ev: unknown) => {
        if (closed) return
        try {
          controller.enqueue(`data: ${JSON.stringify(ev)}\n\n`)
        } catch {
          // noop
        }
      }

      off = onEvent(send)

      try {
        controller.enqueue(`:ok\n\n`)
      } catch {
        // noop
      }

      ping = setInterval(() => {
        if (closed) return
        try {
          controller.enqueue(`:ping\n\n`)
        } catch {
          // noop
        }
      }, 15_000)

      req.signal.addEventListener("abort", () => {
        if (closed) return
        closed = true
        if (ping) clearInterval(ping)
        if (off) off()
        try {
          controller.close()
        } catch {
          // noop
        }
      })
    },
    cancel() {
      if (closed) return
      closed = true
      if (ping) clearInterval(ping)
      if (off) off()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}
