import oneTimeDonationTemplate from '../email-templates/one-time-donation'
import recurringDonationTemplate from '../email-templates/recurring-donation'
import { resend } from '@/lib/resend/resend'
import { ticketPurchaseTemplate } from '../email-templates/ticket-purchase'
import { createLog } from '../actions/log/createLog'

export default async function sendConfirmationEmail(
  order: any,
  orderType: 'ONE_TIME_DONATION' | 'RECURRING_DONATION' | 'TICKET_PURCHASE',
  amount: number
) {
  try {
    let emailHtml: string
    let subject: string

    if (orderType === 'ONE_TIME_DONATION') {
      emailHtml = oneTimeDonationTemplate(order.customerName, amount, order.id)
      subject = 'Your Donation is Confirmed — Boys & Girls Club of Lynn'
    } else if (orderType === 'RECURRING_DONATION') {
      const frequency = order.recurringFrequency || 'monthly'
      emailHtml = recurringDonationTemplate(order.customerName, amount, frequency, order.id)
      subject = `Your ${frequency.charAt(0).toUpperCase() + frequency.slice(1)} Donation is Confirmed — Boys & Girls Club of Lynn`
    } else {
      const event = order.event

      const eventDate = event?.date
        ? new Date(event.date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })
        : ''

      const eventTime = event?.date
        ? new Date(event.date).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: 'America/New_York'
          })
        : ''

      // const raffleDrawDate = event?.raffleDrawDate
      //   ? `${new Date(event.raffleDrawDate).toLocaleDateString('en-US', {
      //       weekday: 'long',
      //       month: 'long',
      //       day: 'numeric',
      //       year: 'numeric'
      //     })} at ${new Date(event.raffleDrawDate).toLocaleTimeString('en-US', {
      //       hour: 'numeric',
      //       minute: '2-digit',
      //       hour12: true,
      //       timeZone: 'America/New_York'
      //     })} EST`
      //   : null

      const emailTickets = order.orderItems.map((item: any) => ({
        name: item.ticketName,
        quantity: item.quantity,
        price: item.pricePerUnit,
        raffleTicketNumber: item.raffleTicketNumber,
        raffleTicketCode: item.raffleTicketCode
      }))

      emailHtml = ticketPurchaseTemplate(
        order.customerName,
        event?.title || 'Event',
        eventDate,
        eventTime,
        event?.location || '',
        event?.address || null,
        emailTickets,
        amount,
        order.id
      )

      subject = `Your Tickets for ${event?.title || 'the Event'} are Confirmed`
    }

    await resend.emails.send({
      from: `Boys & Girls Club of Lynn <${process.env.RESEND_FROM_EMAIL}>`,
      to: order.customerEmail,
      subject,
      html: emailHtml
    })
  } catch (emailError) {
    await createLog('error', 'Failed to send confirmation email', {
      error: emailError instanceof Error ? emailError.message : 'Unknown error',
      orderId: order.id,
      orderType
    })
  }
}
