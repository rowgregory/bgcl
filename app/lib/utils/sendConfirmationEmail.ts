import oneTimeDonationTemplate from '../email-templates/one-time-donation'
import recurringDonationTemplate from '../email-templates/recurring-donation'
import ticketPurchaseTemplate from '../email-templates/ticket-purchase'
import { resend } from '@/app/lib/resend'

// Helper function for sending confirmation emails
export default async function sendConfirmationEmail(
  order: any,
  orderType: 'ONE_TIME_DONATION' | 'RECURRING_DONATION' | 'TICKET_PURCHASE',
  amount: number,
  metadata?: any
) {
  try {
    let emailHtml: string
    let subject: string

    if (orderType === 'ONE_TIME_DONATION') {
      emailHtml = oneTimeDonationTemplate(order.customerName, amount, order.id)
      subject = 'Your One Time Donation is Confirmed'
    } else if (orderType === 'RECURRING_DONATION') {
      const frequency = order.recurringFrequency || 'monthly'
      emailHtml = recurringDonationTemplate(order.customerName, amount, frequency, order.id)
      subject = `Your ${frequency.charAt(0).toUpperCase() + frequency.slice(1)} Donation is Confirmed`
    } else {
      emailHtml = ticketPurchaseTemplate(
        order.customerName,
        metadata?.eventName || 'Event',
        JSON.parse(metadata?.ticketDetails || '[]'),
        amount,
        order.id
      )
      subject = 'Your Tickets are Confirmed'
    }

    await resend.emails.send({
      from: `Boys & Girls Club of Lynn <${process.env.RESEND_FROM_EMAIL}>`,
      to: order.customerEmail,
      subject,
      html: emailHtml
    })

    console.log('Confirmation email sent to:', order.customerEmail)
  } catch (emailError) {
    console.error('Error sending confirmation email:', emailError)
  }
}
