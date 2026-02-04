import { NextResponse } from "next/server"
import { db } from "@/db"
import { requireAdmin } from "@/lib/auth/require-admin"
import { z } from "zod"
import { headers } from "next/headers"
import { containsForbiddenWords } from "@/lib/constants/forbidden-words"

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required").max(1000),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = contactSchema.safeParse(json)

    if (!body.success) {
      return NextResponse.json(
        { success: false, error: body.error.issues[0].message },
        { status: 400 }
      )
    }

    const { name, email, message } = body.data

    if (containsForbiddenWords(message) || containsForbiddenWords(name)) {
      return NextResponse.json(
        { success: false, error: "forbidden_words" },
        { status: 400 }
      )
    }

    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") ?? "127.0.0.1"

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const recentMessages = await db.contactMessage.count({
      where: {
        ipAddress: ip,
        createdAt: {
          gte: oneHourAgo,
        },
      },
    })

    if (recentMessages >= 3) {
      return NextResponse.json(
        { success: false, error: "rate_limit_exceeded" },
        { status: 429 }
      )
    }

    await db.contactMessage.create({
      data: { name, email, message, ipAddress: ip, status: "UNREAD" },
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
