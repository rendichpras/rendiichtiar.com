import { NextResponse } from "next/server"
import { db } from "@/db"
import { requireAdmin } from "@/lib/auth/require-admin"
import { sendEmail } from "@/lib/email"
import { getReplyEmailTemplate } from "@/lib/email-templates"
import { contactReplySchema } from "@/lib/validations/contact"

export async function POST(req: Request) {
  try {
    await requireAdmin()

    let json: unknown
    try {
      json = await req.json()
    } catch {
      return NextResponse.json(
        { success: false, error: "invalid_json" },
        { status: 400 }
      )
    }
    const result = contactReplySchema.safeParse(json)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0].message },
        { status: 400 }
      )
    }

    const { contactId, replyMessage } = result.data

    const contact = await db.contactMessage.findUnique({
      where: { id: contactId },
      select: { id: true, name: true, email: true, message: true },
    })

    if (!contact) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      )
    }

    const subject = `Re: Your message`
    const html = getReplyEmailTemplate(
      contact.name,
      replyMessage,
      contact.message
    )

    await sendEmail({
      to: contact.email,
      subject,
      html,
    })

    await db.contactMessage.update({
      where: { id: contactId },
      data: { status: "REPLIED" },
    })

    await db.contactReply.upsert({
      where: { contactId },
      create: {
        contactId,
        message: replyMessage,
        subject,
      },
      update: {
        message: replyMessage,
        subject,
      },
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error"
    const status =
      msg === "unauthorized" ? 401 : msg === "forbidden" ? 403 : 500
    return NextResponse.json({ success: false, error: msg }, { status })
  }
}
