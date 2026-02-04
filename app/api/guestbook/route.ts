import { NextResponse } from "next/server"
import { getGuestbookEntries, addGuestbookEntry } from "@/lib/actions/guestbook"

export async function GET() {
  const entries = await getGuestbookEntries()
  return NextResponse.json({ success: true, entries })
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { message?: string }
    const message = body?.message ?? ""
    const res = await addGuestbookEntry(message)
    return NextResponse.json(res)
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error"
    const status = msg === "unauthorized" ? 401 : 400
    return NextResponse.json({ success: false, error: msg }, { status })
  }
}
