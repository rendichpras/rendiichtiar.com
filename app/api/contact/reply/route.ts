import { NextResponse } from "next/server"
import { db } from "@/db"
import { requireAdmin } from "@/lib/auth/require-admin"
import { sendEmail } from "@/lib/email"

export async function POST(req: Request) {
  const escapeHtml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  }

  try {
    await requireAdmin()

    const body = (await req.json()) as {
      contactId?: string
      replyMessage?: string
    }
    const contactId = body?.contactId ?? ""
    const replyMessage = body?.replyMessage?.trim() ?? ""

    if (!contactId || !replyMessage) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 }
      )
    }

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
    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6">
        <p>Hi ${contact.name},</p>
        <p>Thanks for reaching out! Here is my reply:</p>
        <blockquote style="margin:16px 0;padding:12px 16px;border-left:4px solid #ccc;background:#f9f9f9;">
          ${escapeHtml(replyMessage).replace(/\n/g, "<br/>")}
        </blockquote>
        <p>---</p>
        <p><strong>Your original message:</strong></p>
        <blockquote style="margin:16px 0;padding:12px 16px;border-left:4px solid #eee;background:#fafafa;">
          ${escapeHtml(contact.message).replace(/\n/g, "<br/>")}
        </blockquote>
      </div>
    `

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
