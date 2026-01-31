import { Metadata } from 'next'

export const siteMetadata: Metadata = {
  metadataBase: new URL('https://bgcl.org'),
  title: {
    default: 'Boys & Girls Club of Lynn | Youth Programs, After School Care & Summer Camp in Lynn, MA',
    template: '%s | Boys & Girls Club of Lynn'
  },
  description:
    'The Boys & Girls Club of Lynn provides safe, enriching programs for youth in Lynn, Massachusetts. Offering after-school care, summer camps, STEAM education, sports, arts, and leadership development for ages 6-18. Enroll today!',
  keywords: [
    'Boys and Girls Club Lynn MA',
    'Boys & Girls Club of Lynn',
    'youth programs Lynn Massachusetts',
    'after school programs Lynn',
    'summer camp Lynn MA',
    'kids club Lynn',
    'STEAM programs Lynn',
    'youth development Lynn',
    'after school care Lynn MA',
    'teen center Lynn',
    'youth sports Lynn',
    'children activities Lynn Massachusetts',
    'safe place for kids Lynn',
    'mentorship programs Lynn',
    'homework help Lynn',
    'dance classes Lynn kids',
    'fitness programs youth Lynn',
    'leadership development Lynn MA',
    'community center Lynn',
    'nonprofit youth organization Lynn'
  ],
  authors: [{ name: 'Boys & Girls Club of Lynn' }],
  creator: 'Boys & Girls Club of Lynn',
  publisher: 'Boys & Girls Club of Lynn',
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bgcl.org',
    siteName: 'Boys & Girls Club of Lynn',
    title: 'Boys & Girls Club of Lynn | Youth Programs & After School Care in Lynn, MA',
    description:
      'Empowering youth in Lynn, MA through quality programs and services. Join our after-school programs, summer camps, STEAM lab, sports, arts, and more. Enroll now!',
    images: [
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/boys-and-girls-club-of-l-a2ad0.firebasestorage.app/o/images%2Fbgcl-rich-preview.png?alt=media&token=9f84b230-3ad2-4745-9c25-e84b63cab7cb',
        width: 1200,
        height: 630,
        alt: 'Boys & Girls Club of Lynn - Youth Programs'
      }
    ]
  },
  facebook: {
    appId: '1413258010594835'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Boys & Girls Club of Lynn | Youth Programs & After School Care',
    description:
      'Empowering youth in Lynn, MA through quality programs and services. After-school care, summer camps, STEAM, sports, and more.',
    images: [
      'https://firebasestorage.googleapis.com/v0/b/boys-and-girls-club-of-l-a2ad0.firebasestorage.app/o/images%2Fbgcl-rich-preview.png?alt=media&token=9f84b230-3ad2-4745-9c25-e84b63cab7cb'
    ],
    creator: '@bgcl'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  icons: {
    icon: [
      { url: '/images/favicon.ico' },
      { url: '/images/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [{ url: '/apple-touch-icon.png' }]
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: 'https://bgcl.org'
  },
  verification: {
    google: 'gjjpmEq-XM8hniW-c8sPOJ6QNa8Pd84HA6nNrEw6H8M'
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  category: 'Youth Organization',
  classification: 'Nonprofit Organization',
  other: {
    'geo.region': 'US-MA',
    'geo.placename': 'Lynn',
    'geo.position': '42.4668;-70.9495' // Lynn, MA coordinates
  }
}
