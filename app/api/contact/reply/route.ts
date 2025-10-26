import { NextResponse } from "next/server"
import { z } from "zod"
import nodemailer from "nodemailer"
import messages from "@/messages/id"

import { db } from "@/db"
import { contacts } from "@/db/schema/schema"
import { eq } from "drizzle-orm"

const replySchema = z.object({
  contactId: z.string(),
  replyMessage: z.string().min(10, messages.api.contact.validation.reply),
})

const replyEmailTemplate = (
  userName: string,
  originalMessage: string,
  replyMessage: string,
) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', sans-serif; background-color: #fafafa; color: #1a1a1a;">
    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); padding: 32px;">
        <!-- Header -->
        <div style="margin-bottom: 32px;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #1a1a1a;">${
              messages.api.contact.email.reply.title
            }</h1>
            <p style="margin: 8px 0 0 0; color: #666666; font-size: 16px;">${messages.api.contact.email.reply.greeting.replace(
              "{name}",
              userName,
            )}</p>
        </div>

        <!-- Original Message -->
        <div style="background-color: #f4f4f5; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 500; color: #666666;">${
              messages.api.contact.email.reply.original_message
            }</p>
            <p style="margin: 0; color: #1a1a1a; font-size: 15px; line-height: 1.6;">${originalMessage}</p>
        </div>

        <!-- Reply Message -->
        <div style="background-color: #f0f9ff; border-radius: 8px; padding: 16px; margin-bottom: 32px; border-left: 4px solid #0284c7;">
            <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 500; color: #0284c7;">${
              messages.api.contact.email.reply.reply_message
            }</p>
            <p style="margin: 0; color: #1a1a1a; font-size: 15px; line-height: 1.6;">${replyMessage}</p>
        </div>

        <!-- CTA Button -->
        <div style="text-align: center; margin-bottom: 32px;">
            <a href="https://rendiichtiar.com" style="display: inline-block; background-color: #0284c7; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; font-size: 15px;">${
              messages.api.contact.email.reply.visit_website
            }</a>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding-top: 24px; border-top: 1px solid #e5e5e5;">
            <p style="margin: 0 0 16px 0; color: #666666; font-size: 14px;">${
              messages.api.contact.email.reply.regards
            }<br/><span style="color: #1a1a1a; font-weight: 600;">${
  messages.api.contact.email.reply.signature
}</span></p>
            
            <!-- Social Links -->
            <div style="margin-top: 16px;">
                <a href="https://linkedin.com/in/rendiichtiar" style="display: inline-block; margin: 0 8px; color: #0077b5; text-decoration: none; font-size: 14px;">LinkedIn</a>
                <a href="https://github.com/rendichpras" style="display: inline-block; margin: 0 8px; color: #333333; text-decoration: none; font-size: 14px;">GitHub</a>
                <a href="https://instagram.com/rendiichtiar" style="display: inline-block; margin: 0 8px; color: #e4405f; text-decoration: none; font-size: 14px;">Instagram</a>
            </div>
        </div>
    </div>
</body>
</html>
`

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = replySchema.parse(body)

    const contactRows = await db
      .select({
        id: contacts.id,
        name: contacts.name,
        email: contacts.email,
        message: contacts.message,
        status: contacts.status,
      })
      .from(contacts)
      .where(eq(contacts.id, validatedData.contactId))
      .limit(1)

    const contact = contactRows[0]

    if (!contact) {
      return NextResponse.json(
        {
          success: false,
          message: messages.api.contact.error.not_found,
        },
        { status: 404 },
      )
    }

    await db
      .update(contacts)
      .set({ status: "REPLIED" })
      .where(eq(contacts.id, validatedData.contactId))

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: contact.email,
      subject: messages.api.contact.email.reply.subject,
      html: replyEmailTemplate(
        contact.name,
        contact.message,
        validatedData.replyMessage,
      ),
    })

    return NextResponse.json({
      success: true,
      message: messages.api.contact.success.replied,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: messages.api.contact.error.validation,
          errors: error.issues,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: messages.api.contact.error.general,
      },
      { status: 500 },
    )
  }
}