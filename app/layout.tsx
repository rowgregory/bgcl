import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'
import RootLayoutWrapper from './(public)/_components/PublicChrome'
import { GoogleAnalytics } from '@next/third-parties/google'
import { siteMetadata } from '@/lib/seo/metadata'
import { getHomePageData } from '@/lib/actions/_infra/getHomePageData'
import { ThemeScript } from '@/lib/scripts/ThemeScript'
import { lexend, pinyon } from '@/lib/fonts'
import { JsonLd } from '@/lib/scripts/JsonLd'
import { ThemeProvider } from '@/lib/providers/theme.provider'

export const metadata = siteMetadata

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <JsonLd />
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      </head>
      <body className={`${lexend.variable} ${pinyon.variable} antialiased`}>
        <SessionProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
