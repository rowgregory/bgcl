import { Lexend, Oswald } from 'next/font/google'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/app/lib/auth'
import { ReactNode } from 'react'
import RootLayoutWrapper from './root-layout'
import { getPrograms } from './lib/actions/getPrograms'
import { getPageBySlugClient } from './lib/actions/getPageBySlugClient'
import { getDonationOrders } from './lib/actions/getDonationOrders'
import { GoogleAnalytics } from '@next/third-parties/google'
import Hotjar from './scripts/Hotjar'
import { siteMetadata } from './lib/seo/metadata'
import { jsonLd } from './lib/seo/jsonLd'
import { getUpcomingOrOngoingEvent } from './lib/actions/getUpcomingOrOngoingEvent'

const lexend = Lexend({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-lexend' // Define CSS variable
})

export const metadata = siteMetadata

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  const [session, programs, donations, pageContent, event] = await Promise.all([
    auth(),
    getPrograms(),
    getDonationOrders(),
    getPageBySlugClient('home'),
    getUpcomingOrOngoingEvent()
  ])

  const GA_ID = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GoogleAnalytics gaId={GA_ID!} />
        <Hotjar />
      </head>
      <body className={`${lexend.variable} antialiased`}>
        <SessionProvider session={session}>
          <RootLayoutWrapper programs={programs} pageContent={pageContent} donations={donations} event={event.data}>
            {children}
          </RootLayoutWrapper>
        </SessionProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  )
}
