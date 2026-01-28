export const failedPaymentTemplate = (donorName: string, amount: number, retryUrl: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Issue - Boys & Girls Club of Lynn</title>
</head>
<body style="margin: 0; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 500px; margin: 0 auto;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 48px;">
      <h1 style="margin: 0 0 8px 0; color: #000000; font-size: 32px; font-weight: 700; letter-spacing: -0.02em;">Boys & Girls Club</h1>
      <p style="margin: 0; color: #666666; font-size: 15px; font-weight: 500;">of Lynn</p>
    </div>

    <!-- Alert Badge -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-block; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 8px 16px;">
        <p style="margin: 0; color: #dc2626; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Payment Issue</p>
      </div>
    </div>

    <!-- Main Message -->
    <div style="margin-bottom: 40px;">
      <p style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 16px; line-height: 1.6; font-weight: 500;">
        Hi ${donorName},
      </p>
      <p style="margin: 0 0 24px 0; color: #1a1a1a; font-size: 16px; line-height: 1.6;">
        We encountered an issue processing your donation of <strong style="color: #dc2626;">$${amount.toFixed(2)}</strong>. This can happen for several reasons:
      </p>
      <ul style="margin: 0 0 24px 0; padding-left: 24px; color: #666666; font-size: 15px; line-height: 1.8;">
        <li>Insufficient funds</li>
        <li>Expired or incorrect card information</li>
        <li>Card security verification needed</li>
      </ul>
      <p style="margin: 0; color: #1a1a1a; font-size: 16px; line-height: 1.6;">
        We understand these things happen, and we're here to help make it right.
      </p>
    </div>

    <!-- Retry Button -->
    <div style="margin-bottom: 48px;">
      <a href="${retryUrl}" style="display: block; background: #0ea5e9; color: white; text-decoration: none; padding: 14px 24px; border-radius: 6px; font-weight: 600; font-size: 16px; text-align: center; transition: background 0.2s;">
        Complete Your Donation
      </a>
    </div>

    <!-- Impact Message -->
    <div style="margin-bottom: 48px; padding: 24px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 6px;">
      <p style="margin: 0; color: #0c4a6e; font-size: 14px; line-height: 1.6; font-weight: 500;">
        💙 Your generosity means the world to the youth we serve. Every donation helps us provide safe spaces, mentorship, and opportunities that shape brighter futures.
      </p>
    </div>

    <!-- Alternative Options -->
    <div style="margin-bottom: 48px;">
      <p style="margin: 0 0 12px 0; color: #1a1a1a; font-size: 15px; font-weight: 600;">
        Need another way to donate?
      </p>
      <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
        Feel free to call us at <a href="tel:781-593-1772" style="color: #0ea5e9; text-decoration: none; font-weight: 500;">(781) 593-1772</a> or email <a href="mailto:info@bgcl.org" style="color: #0ea5e9; text-decoration: none; font-weight: 500;">info@bgcl.org</a> and we'll be happy to assist you with your donation.
      </p>
    </div>

    <!-- Footer -->
    <div style="padding-top: 24px; border-top: 1px solid #e5e5e5; text-align: center;">
      <p style="margin: 0 0 12px 0; color: #999999; font-size: 13px; line-height: 1.6;">
        Questions? Contact us:<br>
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
