export function jobApplicationConfirmationEmail(): string {
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
              <h1 style="margin: 0; color: #0f172a; font-size: 22px; font-weight: 700;">Application Received</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 28px;">
              <p style="margin: 0 0 16px 0; color: #0f172a; font-size: 14px; line-height: 1.6;">Dear Applicant,</p>
              <p style="margin: 0 0 16px 0; color: #64748b; font-size: 14px; line-height: 1.6;">Thank you for your interest in joining the Boys & Girls Club of Lynn. We appreciate the time you took to apply for a position with us.</p>
              <p style="margin: 0 0 16px 0; color: #64748b; font-size: 14px; line-height: 1.6;">Our team will carefully review your application. If your qualifications match our current needs, we will be in contact with you within two weeks to discuss next steps.</p>
              <p style="margin: 0 0 16px 0; color: #64748b; font-size: 14px; line-height: 1.6;">Due to the high volume of applications we receive, we are only able to reach out to candidates who best meet the requirements for the role. If you do not hear from us within this timeframe, it means we have decided not to move forward with your application at this time.</p>
              <p style="margin: 0 0 24px 0; color: #64748b; font-size: 14px; line-height: 1.6;">We truly appreciate your interest in supporting our mission and wish you the best in your job search.</p>
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
