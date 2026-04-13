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
  orderId: string
) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ticket Confirmation - Boys & Girls Club of Lynn</title>
</head>
<body style="margin: 0; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb;">
  <div style="max-width: 520px; margin: 0 auto;">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1a72b8 0%, #1e88e5 100%); border-radius: 12px 12px 0 0; padding: 32px 32px 28px; text-align: center;">
      <h1 style="margin: 0 0 4px 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.01em;">
        Boys &amp; Girls Club of Lynn
      </h1>
      <p style="margin: 0; color: rgba(255,255,255,0.75); font-size: 13px; font-weight: 500;">
        Ticket Confirmation
      </p>
    </div>

    <!-- Gold stripe -->
    <div style="height: 4px; background: linear-gradient(90deg, #d97706, #fbbf24, #d97706);"></div>

    <!-- Body -->
    <div style="background: #ffffff; padding: 32px; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">

      <!-- Greeting -->
      <p style="margin: 0 0 28px 0; color: #111827; font-size: 15px; line-height: 1.6; font-weight: 500;">
        Your tickets are confirmed, ${buyerName}! We're looking forward to seeing you.
      </p>

      <!-- Event card -->
      <div style="margin-bottom: 28px; padding: 20px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px;">
        <p style="margin: 0 0 6px 0; color: #1d4ed8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">
          Event
        </p>
        <p style="margin: 0 0 14px 0; color: #111827; font-size: 17px; font-weight: 800;">${eventName}</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 4px 0; vertical-align: top; width: 16px;">
              <div style="width: 14px; height: 14px; background: #1a72b8; border-radius: 3px; margin-top: 1px;"></div>
            </td>
            <td style="padding: 4px 0 4px 8px; color: #374151; font-size: 13px;">
              ${eventDate} &nbsp;·&nbsp; ${eventTime}
            </td>
          </tr>
          <tr>
            <td style="padding: 4px 0; vertical-align: top; width: 16px;">
              <div style="width: 8px; height: 8px; background: #1a72b8; border-radius: 50%; margin: 3px 0 0 3px;"></div>
            </td>
            <td style="padding: 4px 0 4px 8px; color: #374151; font-size: 13px;">
              ${eventLocation}${eventAddress ? `<br><span style="color: #6b7280; font-size: 12px;">${eventAddress}</span>` : ''}
            </td>
          </tr>
        </table>
      </div>

      <!-- Tickets -->
      <div style="margin-bottom: 28px;">
        <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">
          Your Tickets
        </p>
        ${tickets
          .map(
            (ticket) => `
          <div style="margin-bottom: 10px; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden;">
            <div style="background: #1a72b8; padding: 10px 14px;">
              <p style="margin: 0; color: rgba(255,255,255,0.7); font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">
                Boys &amp; Girls Club of Lynn
              </p>
              <p style="margin: 2px 0 0 0; color: #ffffff; font-size: 13px; font-weight: 700;">
                ${ticket.name}
              </p>
            </div>
            <div style="height: 2px; background: linear-gradient(90deg, #d97706, #fbbf24, #d97706);"></div>
            <table style="width: 100%; border-collapse: collapse; background: #ffffff;">
              <tr>
                <td style="padding: 12px 14px; vertical-align: top;">
                  <p style="margin: 0 0 6px 0; color: #374151; font-size: 12px;">
                    ${eventDate} &nbsp;·&nbsp; ${eventTime}
                  </p>
                  <p style="margin: 0 0 10px 0; color: #374151; font-size: 12px;">
                    ${eventLocation}
                  </p>
                  <p style="margin: 0; color: #1a72b8; font-size: 15px; font-weight: 800;">
                    $${(ticket.price * ticket.quantity).toFixed(2)}
                  </p>
                </td>
                <td style="width: 80px; padding: 12px 10px; background: #f9fafb; border-left: 2px dashed #e5e7eb; text-align: center; vertical-align: middle;">
                  <p style="margin: 0 0 4px 0; color: #9ca3af; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">
                    Qty
                  </p>
                  <p style="margin: 0; color: #1a72b8; font-size: 28px; font-weight: 900; line-height: 1;">
                    ${ticket.quantity}
                  </p>
                </td>
              </tr>
            </table>
          </div>
        `
          )
          .join('')}
      </div>

      <!-- Total + Order -->
      <div style="padding: 16px 20px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; margin-bottom: 28px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
              Total Paid
            </td>
            <td style="text-align: right; color: #111827; font-size: 20px; font-weight: 800;">
              $${(totalAmount / 100).toFixed(2)}
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top: 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
                Order
              </p>
              <p style="margin: 2px 0 0 0; color: #374151; font-size: 12px; font-family: monospace;">
                ${orderId}
              </p>
            </td>
          </tr>
        </table>
      </div>

      <!-- What's next -->
      <div style="margin-bottom: 8px;">
        <p style="margin: 0 0 10px 0; color: #111827; font-size: 13px; font-weight: 700;">
          What's next?
        </p>
        <ol style="margin: 0; padding-left: 18px; color: #6b7280; font-size: 13px; line-height: 1.9;">
          <li>Your tickets are saved to your account at bgcl.org</li>
          <li>Download your PDF tickets from your order confirmation page</li>
          <li>Bring your ticket confirmation to the event for entry</li>
        </ol>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f3f4f6; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; padding: 20px 32px; text-align: center;">
      <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; line-height: 1.6;">
        Need help?
        <a href="mailto:info@bgcl.org" style="color: #1a72b8; text-decoration: none; font-weight: 600;">info@bgcl.org</a>
        &nbsp;·&nbsp;
        <a href="tel:781-593-1772" style="color: #1a72b8; text-decoration: none; font-weight: 600;">(781) 593-1772</a>
      </p>
      <p style="margin: 0; color: #9ca3af; font-size: 11px; line-height: 1.5;">
        Boys &amp; Girls Club of Lynn &nbsp;·&nbsp; 25 North Common Street, Lynn, MA 01902
      </p>
    </div>

  </div>
</body>
</html>
`
