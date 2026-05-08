// Email Service using Resend API (or fallback logging)
const EMAIL_API_KEY = import.meta.env.VITE_EMAIL_API_KEY
const EMAIL_FROM = import.meta.env.VITE_EMAIL_FROM || 'noreply@hireadstore.ai'

export const DEFAULT_INTERVIEW_TEMPLATE = `Dear {candidateName},

We are pleased to inform you that you have been selected for an interview for the {jobTitle} position.

Interview Details:
- Date & Time: {interviewTime}
- Format: {interviewFormat}
- Duration: {duration}

{additionalNotes}

Please confirm your attendance by replying to this email. If you have any questions, feel free to reach out.

We look forward to speaking with you.

Best regards,
{senderName}
HR Team`

export async function sendInterviewEmail({ to, candidateName, jobTitle, interviewTime, interviewFormat = 'Video Call', duration = '45 minutes', additionalNotes = '', senderName = 'Hiring Team', customTemplate = null }) {
  const template = customTemplate || DEFAULT_INTERVIEW_TEMPLATE
  const body = template
    .replace(/{candidateName}/g, candidateName)
    .replace(/{jobTitle}/g, jobTitle)
    .replace(/{interviewTime}/g, interviewTime)
    .replace(/{interviewFormat}/g, interviewFormat)
    .replace(/{duration}/g, duration)
    .replace(/{additionalNotes}/g, additionalNotes)
    .replace(/{senderName}/g, senderName)

  const subject = `Interview Scheduled: ${jobTitle} Position`

  // Try Resend API
  if (EMAIL_API_KEY && EMAIL_API_KEY !== 'your_resend_api_key') {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${EMAIL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: EMAIL_FROM,
          to: [to],
          subject,
          text: body
        })
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || 'Email send failed')
      }

      return { success: true, message: `Email sent to ${to}` }
    } catch (err) {
      console.error('Email error:', err)
      throw err
    }
  }

  // Dev fallback: log the email
  console.log('📧 [DEV EMAIL - Would send]:')
  console.log('To:', to)
  console.log('Subject:', subject)
  console.log('Body:\n', body)
  return { success: true, message: `[DEV] Email logged to console (configure VITE_EMAIL_API_KEY for real sending)` }
}

export async function sendBulkEmails(emailJobs) {
  const results = []
  for (const job of emailJobs) {
    try {
      const result = await sendInterviewEmail(job)
      results.push({ ...job, success: true, result })
    } catch (err) {
      results.push({ ...job, success: false, error: err.message })
    }
    await new Promise(r => setTimeout(r, 200))
  }
  return results
}
