import nodemailer from "nodemailer"

type SendEmailArgs = {
  to: string
  subject: string
  html: string
  from?: string
}

let _transporter: ReturnType<typeof nodemailer.createTransport> | null = null

function getTransporter() {
  if (_transporter) return _transporter

  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    throw new Error("smtp_not_configured")
  }

  _transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })

  return _transporter
}

export async function sendEmail({ to, subject, html, from }: SendEmailArgs) {
  const transporter = getTransporter()
  const fromAddress =
    from || process.env.SITE_EMAIL_FROM || process.env.SMTP_USER

  await transporter.sendMail({
    from: fromAddress,
    to,
    subject,
    html,
  })
}
