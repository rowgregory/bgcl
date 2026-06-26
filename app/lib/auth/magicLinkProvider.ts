import type { EmailConfig } from 'next-auth/providers/email'
import magicLinkTemplate from '../email-templates/magic-link'
import { createLog } from '../actions/log/createLog'
import { resend } from '../resend'

const magicLinkProvider: EmailConfig = {
  id: 'email',
  name: 'Email',
  type: 'email',
  maxAge: 15 * 60, // 15 mins
  from: process.env.RESEND_FROM_EMAIL!,
  sendVerificationRequest: async ({ identifier: email, url, provider }) => {
    try {
      const result = await resend.emails.send({
        from: `Boys & Girls Club <${provider.from!}>`,
        to: email,
        subject: 'Sign in to Boys & Girls Club of Lynn',
        html: magicLinkTemplate(url)
      })

      await createLog('info', 'Magic link sent successfully', {
        location: ['magicLinkProvider.ts'],
        email,
        messageId: result.data?.id
      })
    } catch (error) {
      await createLog('error', 'Failed to send magic link email', {
        location: ['magicLinkProvider.ts'],
        email,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    }
  }
}

export default magicLinkProvider
