const magicLinkTemplate = (url: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign in to Boys & Girls Club of Lynn</title>
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
        Click the link below to sign in to your account. This link expires in 15 minutes.
      </p>
    </div>

    <!-- Sign In Button -->
    <div style="margin-bottom: 48px;">
      <a href="${url}" style="display: block; background: #0ea5e9; color: white; text-decoration: none; padding: 14px 24px; border-radius: 6px; font-weight: 600; font-size: 16px; text-align: center; transition: background 0.2s;">
        Sign in to your account
      </a>
    </div>

    <!-- Copy Link Section -->
    <div style="margin-bottom: 48px; padding: 24px; border: 1px solid #e5e5e5; border-radius: 6px;">
      <p style="margin: 0 0 12px 0; color: #666666; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Or copy this link:</p>
      <p style="margin: 0; word-break: break-all; font-family: 'SF Mono', Monaco, 'Courier New', monospace; font-size: 13px; color: #0ea5e9; line-height: 1.6;">
        ${url}
      </p>
    </div>

    <!-- Security Info -->
    <div style="margin-bottom: 48px;">
      <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
        <strong style="color: #1a1a1a;">Didn't request this?</strong> If you didn't try to sign in, you can safely ignore this email. Your account is secure.
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

export default magicLinkTemplate
