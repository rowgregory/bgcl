const ticketPurchaseTemplate = (
  buyerName: string,
  eventName: string,
  tickets: Array<{ name: string; quantity: number; price: number }>,
  totalAmount: number,
  orderId: string
) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ticket Purchase Confirmation - Boys & Girls Club of Lynn</title>
</head>
<body style="margin: 0; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 500px; margin: 0 auto;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 48px;">
      <h1 style="margin: 0 0 8px 0; color: #000000; font-size: 32px; font-weight: 700; letter-spacing: -0.02em;">Boys & Girls Club</h1>
      <p style="margin: 0; color: #666666; font-size: 15px; font-weight: 500;">of Lynn</p>
    </div>

    <!-- Main Message -->
    <div style="margin-bottom: 40px;">
      <p style="margin: 0 0 24px 0; color: #1a1a1a; font-size: 16px; line-height: 1.6; font-weight: 500;">
        Your tickets are confirmed, ${buyerName}! We're excited to see you at ${eventName}.
      </p>
    </div>

    <!-- Event & Order Details -->
    <div style="margin-bottom: 48px; padding: 24px; border: 1px solid #e5e5e5; border-radius: 6px;">
      <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e5e5e5;">
        <p style="margin: 0 0 8px 0; color: #999999; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Event</p>
        <p style="margin: 0; color: #000000; font-size: 16px; font-weight: 600;">${eventName}</p>
      </div>

      <!-- Tickets List -->
      <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e5e5e5;">
        <p style="margin: 0 0 12px 0; color: #999999; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Your Tickets</p>
        ${tickets
          .map(
            (ticket) => `
          <div style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <p style="margin: 0; color: #000000; font-size: 14px; font-weight: 500;">${ticket.name}</p>
              <p style="margin: 2px 0 0 0; color: #999999; font-size: 12px;">Qty: ${ticket.quantity}</p>
            </div>
            <p style="margin: 0; color: #000000; font-size: 14px; font-weight: 600;">$${(ticket.price / 100).toFixed(2)}</p>
          </div>
        `
          )
          .join('')}
      </div>

      <!-- Total -->
      <div style="margin-bottom: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <p style="margin: 0; color: #999999; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Total</p>
          <p style="margin: 0; color: #000000; font-size: 20px; font-weight: 700;">$${(totalAmount / 100).toFixed(2)}</p>
        </div>
      </div>
    </div>

    <!-- Order Info -->
    <div style="margin-bottom: 48px;">
      <p style="margin: 0 0 8px 0; color: #999999; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Order Number</p>
      <p style="margin: 0; color: #000000; font-size: 14px; font-family: 'SF Mono', Monaco, monospace;">${orderId}</p>
    </div>

    <!-- Instructions -->
    <div style="margin-bottom: 48px;">
      <p style="margin: 0 0 12px 0; color: #1a1a1a; font-size: 14px; font-weight: 600;">
        What's next?
      </p>
      <ol style="margin: 0; padding-left: 20px; color: #666666; font-size: 14px; line-height: 1.8;">
        <li style="margin-bottom: 8px;">Your tickets have been added to your account</li>
        <li style="margin-bottom: 8px;">Check your account for digital tickets or look for them in an upcoming email</li>
        <li style="margin-bottom: 0;">Bring your ticket confirmation to the event for entry</li>
      </ol>
    </div>

    <!-- Footer -->
    <div style="padding-top: 24px; border-top: 1px solid #e5e5e5; text-align: center;">
      <p style="margin: 0 0 12px 0; color: #999999; font-size: 13px; line-height: 1.6;">
        Need help with your tickets?<br>
        <a href="mailto:info@bgcl.org" style="color: #0ea5e9; text-decoration: none; font-weight: 500;">info@bgcl.org</a> • <a href="tel:781-593-1772" style="color: #0ea5e9; text-decoration: none; font-weight: 500;">(781) 593-1772</a>
      </p>
      <p style="margin: 12px 0 0 0; color: #bbbbbb; font-size: 12px; line-height: 1.5;">
        Boys & Girls Club of Lynn<br>
        25 North Common Street, Lynn, MA 01902
      </p>
    </div>
  </div>
</body>
</html>
`

export default ticketPurchaseTemplate
