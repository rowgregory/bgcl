import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'

// Start as report-only, watch the console for a week, then switch the header
// name to 'Content-Security-Policy' once nothing legitimate is being blocked
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${isProd ? '' : "'unsafe-eval'"} https://js.stripe.com https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://www.google-analytics.com`,
  "style-src 'self' 'unsafe-inline' https://www.gstatic.com https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://firebasestorage.googleapis.com https://cdn.prod.website-files.com https://*.stripe.com https://www.gstatic.com https://fonts.gstatic.com https://www.google-analytics.com",
  "media-src 'self' blob: https://firebasestorage.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://api.stripe.com https://firebasestorage.googleapis.com https://*.pusher.com wss://*.pusher.com https://www.google-analytics.com https://translate.googleapis.com https://translate-pa.googleapis.com",
  "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests'
].join('; ')

const securityHeaders = [
  // Force HTTPS, including subdomains
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // No MIME sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Clickjacking; frame-ancestors covers modern browsers, this covers old ones
  { key: 'X-Frame-Options', value: 'DENY' },
  // Don't leak full URLs to third parties
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Turn off APIs the site never uses
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(self "https://js.stripe.com")'
  },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Content-Security-Policy-Report-Only', value: csp }
]

const nextConfig: NextConfig = {
  // Don't advertise the framework version
  poweredByHeader: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com'
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/**'
      },
      // Dev only: an open placeholder host is a free image proxy in production
      ...(isProd
        ? []
        : [
            {
              protocol: 'https' as const,
              hostname: 'via.placeholder.com'
            }
          ])
    ]
  },

  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5
  },

  async headers() {
    return [
      {
        source: '/videos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        // Everything else
        source: '/:path*',
        headers: securityHeaders
      },
      {
        // Never let authenticated pages sit in a shared cache
        source: '/(admin|supporter|checkout|cart)/:path*',
        headers: [{ key: 'Cache-Control', value: 'private, no-store, max-age=0' }]
      }
    ]
  }
}

export default nextConfig
