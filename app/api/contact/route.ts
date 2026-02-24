import { NextResponse } from "next/server"
import { db } from "@/db"
import { requireAdmin } from "@/lib/auth/require-admin"
import { getClientIp } from "@/lib/security/client-ip"
import { sendEmail } from "@/lib/email"
import { getContactEmailTemplate } from "@/lib/email-templates"
import { contactSchema } from "@/lib/validations/contact"
import { jsonError, readJson } from "@/lib/http/route-helpers"
import { logger } from "@/lib/observability/logger"

export async function POST(req: Request) {
  try {
    const parsed = await readJson(req)
    if (!parsed.ok) return parsed.response

    const result = contactSchema.safeParse(parsed.body)

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
      logger.error("Failed to send email notification to admin", {
        error: error instanceof Error ? error.message : String(error),
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return jsonError("Failed to send message", 500)
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
