import { NextResponse } from "next/server"
import { db } from "@/db"
import { requireAdmin } from "@/lib/auth/require-admin"
import { getClientIp } from "@/lib/security/client-ip"
import { sendEmail } from "@/lib/email"
import { getContactEmailTemplate } from "@/lib/email-templates"
import { contactSchema } from "@/lib/validations/contact"

export async function POST(req: Request) {
  try {
    let json: unknown
    try {
      json = await req.json()
    } catch {
      return NextResponse.json(
        { success: false, error: "invalid_json" },
        { status: 400 }
      )
    }
    const result = contactSchema.safeParse(json)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0].message },
        { status: 400 }
      )
    }

    const { name, email, message } = result.data

    const ip = await getClientIp()
    const emailKey = email.trim().toLowerCase()
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

    const [recentByIp, recentByEmail, recentGlobal] = await Promise.all([
      ip
        ? db.contactMessage.count({
            where: { ipAddress: ip, createdAt: { gte: oneHourAgo } },
          })
        : Promise.resolve(0),
      db.contactMessage.count({
        where: { email: emailKey, createdAt: { gte: oneHourAgo } },
      }),
      db.contactMessage.count({ where: { createdAt: { gte: oneHourAgo } } }),
    ])

    const maxPerIp = Number(process.env.CONTACT_RATE_LIMIT_IP_MAX ?? 3)
    const maxPerEmail = Number(process.env.CONTACT_RATE_LIMIT_EMAIL_MAX ?? 3)
    const maxGlobal = Number(process.env.CONTACT_RATE_LIMIT_GLOBAL_MAX ?? 50)

    if (
      (ip && recentByIp >= maxPerIp) ||
      recentByEmail >= maxPerEmail ||
      recentGlobal >= maxGlobal
    ) {
      return NextResponse.json(
        { success: false, error: "rate_limit_exceeded" },
        { status: 429 }
      )
    }

    await db.contactMessage.create({
      data: { name, email: emailKey, message, ipAddress: ip, status: "UNREAD" },
    })

    try {
      const adminEmail = process.env.ADMIN_EMAIL
      if (adminEmail) {
        await sendEmail({
          to: adminEmail,
          subject: `New Contact Message from ${name}`,
          html: getContactEmailTemplate(name, email, message),
        })
      }
    } catch (error) {
      console.error("Failed to send email notification to admin:", error)
    }

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
