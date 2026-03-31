export function ticketPurchaseAdminNotification(
  customerName: string,
  customerEmail: string,
  eventTitle: string,
  totalAmount: number,
  orderId: string
): string {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #1e3a5f; margin-bottom: 4px;">New Ticket Purchase</h2>
      <p style="color: #6b7280; font-size: 14px; margin-top: 0;">Someone just purchased tickets for <strong>${eventTitle}</strong>.</p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px;">
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

      
        href="${process.env.NEXT_PUBLIC_APP_URL}/admin/capsule/transactions"
        style="display: inline-block; margin-top: 24px; padding: 10px 20px; background: #1e3a5f; color: #fff; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 6px;"
      >
        View Order in Mission Control →
      </a>
    </div>
  `
}
