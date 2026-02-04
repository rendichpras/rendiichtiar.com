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
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>New Message from ${escapeHtml(name)}</h2>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <hr />
      <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
    </div>
  `
}

export function getReplyEmailTemplate(
  recipientName: string,
  replyMessage: string,
  originalMessage: string
) {
  return `
    <div style="font-family: sans-serif; padding: 20px;">
      <p>Hi ${escapeHtml(recipientName)},</p>
      <p style="white-space: pre-wrap;">${escapeHtml(replyMessage)}</p>
      <br />
      <hr />
      <p style="color: #666; font-size: 0.9em;">On ${new Date().toLocaleDateString()}, you wrote:</p>
      <blockquote style="border-left: 2px solid #ccc; padding-left: 10px; color: #666;">
        <p style="white-space: pre-wrap;">${escapeHtml(originalMessage)}</p>
      </blockquote>
    </div>
  `
}
