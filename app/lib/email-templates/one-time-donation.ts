const oneTimeDonationTemplate = (donorName: string, amount: number, orderId: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Donation Confirmation - Boys & Girls Club of Lynn</title>
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
        Thank you, ${donorName}! Your generous one-time donation has been received.
      </p>
    </div>

    <!-- Donation Details -->
    <div style="margin-bottom: 48px; padding: 24px; border: 1px solid #e5e5e5; border-radius: 6px;">
      <div style="margin-bottom: 16px;">
        <p style="margin: 0 0 8px 0; color: #999999; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Donation Amount</p>
        <p style="margin: 0; color: #000000; font-size: 24px; font-weight: 700;">$${(amount / 100).toFixed(2)}</p>
      </div>
      <div style="margin-bottom: 16px;">
        <p style="margin: 0 0 8px 0; color: #999999; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Confirmation ID</p>
        <p style="margin: 0; color: #000000; font-size: 14px; font-family: 'SF Mono', Monaco, monospace;">${orderId}</p>
      </div>
      <div style="margin-bottom: 0;">
        <p style="margin: 0 0 8px 0; color: #999999; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Date</p>
        <p style="margin: 0; color: #000000; font-size: 14px;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
    </div>

    <!-- Impact Message -->
    <div style="margin-bottom: 48px;">
      <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.8;">
        Your donation directly supports youth programs, mentorship, and community initiatives that empower young people in Lynn. Thank you for making a difference!
      </p>
    </div>

    <!-- Tax Info -->
    <div style="margin-bottom: 48px;">
      <p style="margin: 0; color: #666666; font-size: 13px; line-height: 1.6;">
        <strong style="color: #1a1a1a;">Tax Information:</strong> Boys & Girls Club of Lynn is a 501(c)(3) nonprofit organization. Your donation is tax-deductible to the extent allowed by law.
      </p>
    </div>

    <!-- Footer -->
    <div style="padding-top: 24px; border-top: 1px solid #e5e5e5; text-align: center;">
      <p style="margin: 0 0 12px 0; color: #999999; font-size: 13px; line-height: 1.6;">
        Questions about your donation?<br>
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

export default oneTimeDonationTemplate
