import { NextResponse } from "next/server"
import { getGuestbookEntries, addGuestbookEntry } from "@/lib/actions/guestbook"
import { readJson } from "@/lib/http/route-helpers"

export async function GET() {
  const entries = await getGuestbookEntries()
  return NextResponse.json({ success: true, entries })
}

export async function POST(req: Request) {
  try {
    const parsed = await readJson(req)
    if (!parsed.ok) return parsed.response

    const { message = "" } = parsed.body as { message?: string }
    const res = await addGuestbookEntry(message)
    return NextResponse.json(res)
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error"
    const status = msg === "unauthorized" ? 401 : 400
    return NextResponse.json({ success: false, error: msg }, { status })
  }
}
