import type { Metadata } from 'next'
import { Lexend } from 'next/font/google'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/app/lib/auth'
import { ReactNode } from 'react'
import RootLayoutWrapper from './root-layout'
import { getPrograms } from './lib/actions/getPrograms'
import { getPageBySlug } from './lib/actions/getPageBySlug'
import Script from 'next/script'
import { getDonationOrders } from './lib/actions/getDonationOrders'

const lexend = Lexend({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-lexend' // Define CSS variable
})

export const metadata: Metadata = {
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
    google: 'lf3euFdQqWv05f8h-Ht3ORlK0GghliyZJ4-CWWTrbKE'
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

// Additional JSON-LD structured data for SEO
export const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Boys & Girls Club of Lynn',
  alternateName: 'BGCL',
  url: 'https://bgcl.org',
  logo: 'https://firebasestorage.googleapis.com/v0/b/boys-and-girls-club-of-l-a2ad0.firebasestorage.app/o/images%2Fbgcl-rich-preview.png?alt=media&token=9f84b230-3ad2-4745-9c25-e84b63cab7cb',
  description: 'The Boys & Girls Club of Lynn provides safe, enriching programs for youth in Lynn, Massachusetts.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '25 N Common St',
    addressLocality: 'Lynn',
    addressRegion: 'MA',
    postalCode: '01902',
    addressCountry: 'US'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '42.4668',
    longitude: '-70.9495'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-781-593-1772',
    contactType: 'Customer Service',
    areaServed: 'US',
    availableLanguage: ['English', 'Spanish']
  },
  sameAs: [
    'https://www.facebook.com/LynnBoysAndGirlsClub',
    'https://www.instagram.com/bgclynn/',
    'https://twitter.com/LynnBoysAndGirlsClub',
    'www.youtube.com/@bgclynn6169'
  ],
  areaServed: {
    '@type': 'City',
    name: 'Lynn',
    '@id': 'https://en.wikipedia.org/wiki/Lynn,_Massachusetts'
  },
  memberOf: {
    '@type': 'Organization',
    name: 'Boys & Girls Clubs of America',
    url: 'https://www.bgca.org'
  },
  nonprofitStatus: 'Nonprofit501c3'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  const session = await auth()
  const programs = await getPrograms()
  const donations = await getDonationOrders()
  const pageContent = await getPageBySlug('home')
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {` window.dataLayer = window.dataLayer || [];
             function gtag(){dataLayer.push(arguments);}
             gtag('js', new Date());
             gtag('config', '${GA_ID}');
          `}
        </Script>

        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement(
                  {
                    pageLanguage: 'en',
                    includedLanguages: 'en,es,zh-CN,ht',
                    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false
                  },
                  'google_translate_element'
                );
              }
            `
          }}
        />
        <script
          async
          type="text/javascript"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        />
      </head>
      <body className={`${lexend.variable} antialiased`}>
        <SessionProvider session={session}>
          <RootLayoutWrapper programs={programs} pageContent={pageContent} donations={donations}>
            {children}
          </RootLayoutWrapper>
        </SessionProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  )
}
