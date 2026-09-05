import { formatCents, formatCurrency } from '../utils/currency.utils'

export const ticketPurchaseTemplate = (
  buyerName: string,
  eventName: string,
  eventDate: string,
  eventTime: string,
  eventLocation: string,
  eventAddress: string | null,
  tickets: Array<{
    name: string
    quantity: number
    price: number
  }>,
  totalAmount: number,
  feesCovered: number,
  orderId: string
) => {
  const subtotal = tickets.reduce((sum, ticket) => sum + ticket.price * ticket.quantity, 0)

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ticket confirmation - Boys &amp; Girls Club of Lynn</title>
</head>
<body style="margin: 0; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #ffffff;">
  <div style="max-width: 520px; margin: 0 auto;">

    <!-- Header -->
    <div style="padding-bottom: 20px; border-bottom: 1px solid #e5e5e5;">
      <p style="margin: 0; color: #171717; font-size: 15px; font-weight: 600;">
        Boys &amp; Girls Club of Lynn
      </p>
      <p style="margin: 2px 0 0 0; color: #737373; font-size: 13px;">
        Ticket confirmation
      </p>
    </div>

    <!-- Greeting -->
    <p style="margin: 24px 0 0 0; color: #171717; font-size: 15px; line-height: 1.6;">
      Your tickets are confirmed, ${buyerName}. We look forward to seeing you.
    </p>

    <!-- Event -->
    <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #e5e5e5;">
      <p style="margin: 0 0 10px 0; color: #737373; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em;">
        Event
      </p>
      <p style="margin: 0 0 4px 0; color: #171717; font-size: 16px; font-weight: 600;">${eventName}</p>
      <p style="margin: 0; color: #737373; font-size: 13px; line-height: 1.6;">
        ${eventDate} &nbsp;·&nbsp; ${eventTime}<br>
        ${eventLocation}${eventAddress ? `<br>${eventAddress}` : ''}
      </p>
    </div>

    <!-- Order -->
    <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #e5e5e5;">
      <p style="margin: 0 0 12px 0; color: #737373; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em;">
        Your order
      </p>

      <table style="width: 100%; border-collapse: collapse;">
        ${tickets
          .map(
            (ticket) => `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5; vertical-align: top;">
            <p style="margin: 0; color: #171717; font-size: 14px;">${ticket.name}</p>
            <p style="margin: 2px 0 0 0; color: #a3a3a3; font-size: 12px;">
              ${ticket.quantity} × ${formatCurrency(ticket.price)}
            </p>
          </td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5; text-align: right; vertical-align: top; white-space: nowrap;">
            <p style="margin: 0; color: #171717; font-size: 14px;">
              ${formatCurrency(ticket.price * ticket.quantity)}
            </p>
          </td>
        </tr>
        `
          )
          .join('')}

        <tr>
          <td style="padding: 12px 0 0 0; color: #737373; font-size: 13px;">
            Subtotal
          </td>
          <td style="padding: 12px 0 0 0; text-align: right; color: #737373; font-size: 13px; white-space: nowrap;">
            ${formatCurrency(subtotal)}
          </td>
        </tr>

        ${
          feesCovered > 0
            ? `
        <tr>
          <td style="padding: 6px 0 0 0; color: #737373; font-size: 13px;">
            Processing fee
          </td>
          <td style="padding: 6px 0 0 0; text-align: right; color: #737373; font-size: 13px; white-space: nowrap;">
            ${formatCurrency(feesCovered)}
          </td>
        </tr>
        `
            : ''
        }

        <tr>
          <td style="padding: 12px 0 0 0; color: #171717; font-size: 14px; font-weight: 600;">
            Total paid
          </td>
          <td style="padding: 12px 0 0 0; text-align: right; color: #171717; font-size: 18px; font-weight: 600; white-space: nowrap;">
            ${formatCents(totalAmount)}
          </td>
        </tr>
      </table>

      <p style="margin: 16px 0 0 0; color: #a3a3a3; font-size: 12px;">
        Order ${orderId}
      </p>
    </div>

    <!-- What's next -->
    <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #e5e5e5;">
      <p style="margin: 0 0 10px 0; color: #737373; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em;">
        What's next
      </p>
      <p style="margin: 0; color: #737373; font-size: 13px; line-height: 1.7;">
        Your purchase history is saved to your account at
        <a href="https://bgcl.org" style="color: #1a72b8; text-decoration: none;">bgcl.org</a>.
        Tickets will be mailed to the address you provided at checkout.
      </p>
    </div>

    <!-- Footer -->
    <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #e5e5e5;">
      <p style="margin: 0 0 6px 0; color: #737373; font-size: 12px; line-height: 1.6;">
        Questions?
        <a href="mailto:info@bgcl.org" style="color: #1a72b8; text-decoration: none;">info@bgcl.org</a>
        &nbsp;·&nbsp;
        <a href="tel:781-593-1772" style="color: #1a72b8; text-decoration: none;">(781) 593-1772</a>
      </p>
      <p style="margin: 0; color: #a3a3a3; font-size: 11px; line-height: 1.5;">
        Boys &amp; Girls Club of Lynn &nbsp;·&nbsp; 25 North Common Street, Lynn, MA 01902
      </p>
    </div>

  </div>
</body>
</html>
`
}
