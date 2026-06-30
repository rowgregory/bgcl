import { Lexend } from 'next/font/google'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'
import RootLayoutWrapper from './root-layout'
import { GoogleAnalytics } from '@next/third-parties/google'
import { siteMetadata } from './lib/seo/metadata'
import { jsonLd } from './lib/seo/jsonLd'
import { getHomePageData } from './lib/actions/_infra/getHomePageData'

const lexend = Lexend({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-lexend'
})

export const metadata = siteMetadata

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  const { programs, donationOrders, homePage, capitalPage, hero } = await getHomePageData()
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GoogleAnalytics gaId={GA_ID!} />
      </head>
      <body className={`${lexend.variable} antialiased`}>
        <SessionProvider>
          <RootLayoutWrapper
            programs={programs}
            pageContent={homePage}
            capitalPage={capitalPage}
            donations={donationOrders}
            hero={hero?.data}
          >
            {children}
          </RootLayoutWrapper>
        </SessionProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  )
}
