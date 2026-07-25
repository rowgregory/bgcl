export function ticketPurchaseAdminNotification(
  customerName: string,
  customerEmail: string,
  eventTitle: string,
  totalAmount: number,
  orderId: string
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Ticket Purchase — Boys & Girls Club of Lynn</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc;">
    <tr>
      <td style="padding: 32px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 24px 28px; border-bottom: 1px solid #e2e8f0;">
              <p style="margin: 0 0 4px 0; color: #64748b; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Boys & Girls Club of Lynn</p>
              <h1 style="margin: 0; color: #0f172a; font-size: 22px; font-weight: 700;">New Ticket Purchase</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 28px;">
              <p style="margin: 0 0 20px 0; color: #64748b; font-size: 14px; line-height: 1.6;">Someone just purchased tickets for <strong style="color: #0f172a;">${eventTitle}</strong>.</p>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; width: 40%;">Customer</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: 600;">${customerName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Email</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${customerEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Event</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${eventTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Total</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #1e3a5f; font-weight: 700; font-size: 16px;">$${totalAmount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280;">Order ID</td>
                  <td style="padding: 10px 0; color: #9ca3af; font-size: 12px; font-family: monospace;">${orderId}</td>
                </tr>
              </table>
              
              <a href="${process.env.NEXTAUTH_URL}/admin/events/transactions"
                style="display: inline-block; margin-top: 24px; padding: 10px 20px; background: #1e3a5f; color: #fff; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 6px;"
              >
                View Order in Dashboard →
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 28px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">© ${new Date().getFullYear()} Boys & Girls Club of Lynn</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}
