export function citApplicationConfirmationEmail(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Received — Boys & Girls Club of Lynn</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc;">
    <tr>
      <td style="padding: 32px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 24px 28px; border-bottom: 1px solid #e2e8f0;">
              <p style="margin: 0 0 4px 0; color: #64748b; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Boys & Girls Club of Lynn</p>
              <h1 style="margin: 0; color: #0f172a; font-size: 22px; font-weight: 700;">CIT Application Received</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 28px;">
              <p style="margin: 0 0 16px 0; color: #0f172a; font-size: 14px; line-height: 1.6;">Hello,</p>
              <p style="margin: 0 0 16px 0; color: #64748b; font-size: 14px; line-height: 1.6;">Thank you for applying to the Counselor-in-Training (CIT) program at Camp Creighton Pond in Middleton, MA. We're excited that you're interested in growing as a leader with us this summer.</p>
              <p style="margin: 0 0 16px 0; color: #64748b; font-size: 14px; line-height: 1.6;">Our team will carefully review your application and will be reaching out to you with next steps.</p>
              <p style="margin: 0 0 24px 0; color: #64748b; font-size: 14px; line-height: 1.6;">If you have any questions in the meantime, please don't hesitate to reach out to us at <a href="mailto:info@bgcl.org" style="color: #0ea5e9; text-decoration: none; font-weight: 500;">info@bgcl.org</a>.</p>
              <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6;">Sincerely,<br/><span style="color: #0f172a; font-weight: 600;">Boys & Girls Club of Lynn</span></p>
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
