function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export function getContactEmailTemplate(
  name: string,
  email: string,
  message: string
) {
  return `
    <div style="font-family: sans-serif; padding: 20px; color: #333333;">
      <h2 style="margin-top: 0; color: #6366f1;">New Message from ${escapeHtml(name)}</h2>
      <p style="color: #666666;"><strong>Email:</strong> ${escapeHtml(email)}</p>
      <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;" />
      <p style="white-space: pre-wrap; color: #333333;">${escapeHtml(message)}</p>
    </div>
  `
}

export function getReplyEmailTemplate(
  recipientName: string,
  replyMessage: string,
  originalMessage: string
) {
  return `
    <div style="font-family: sans-serif; padding: 20px; color: #333333;">
      <p>Hi ${escapeHtml(recipientName)},</p>
      <p style="white-space: pre-wrap; color: #333333;">${escapeHtml(replyMessage)}</p>
      <br />
      <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;" />
      <p style="color: #888888; font-size: 0.9em;">On ${new Date().toLocaleDateString()}, you wrote:</p>
      <blockquote style="border-left: 3px solid #818cf8; padding-left: 12px; color: #666666; margin-left: 0;">
        <p style="white-space: pre-wrap;">${escapeHtml(originalMessage)}</p>
      </blockquote>
    </div>
  `
}
