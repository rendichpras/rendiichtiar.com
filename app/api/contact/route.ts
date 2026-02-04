import { NextResponse } from "next/server"
import { db } from "@/db"
import { requireAdmin } from "@/lib/auth/require-admin"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      name?: string
      email?: string
      message?: string
    }

    const name = body?.name?.trim() ?? ""
    const email = body?.email?.trim() ?? ""
    const message = body?.message?.trim() ?? ""

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 }
      )
    }

    await db.contactMessage.create({
      data: { name, email, message, status: "UNREAD" },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to send message" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await requireAdmin()

    const contacts = await db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        message: true,
        createdAt: true,
        status: true,
      },
    })

    return NextResponse.json({
      success: true,
      contacts: contacts.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
      })),
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "forbidden"
    const status = msg === "unauthorized" ? 401 : 403
    return NextResponse.json({ success: false, error: msg }, { status })
  }
}
