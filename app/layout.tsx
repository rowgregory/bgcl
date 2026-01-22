import type { Metadata } from 'next'
import { Lexend } from 'next/font/google'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/app/lib/auth'
import { ReactNode } from 'react'
import RootLayoutWrapper from './root-layout'
import { ThemeProvider } from './lib/providers/theme'
import { getPrograms } from './lib/actions/getPrograms'
import { getPageBySlug } from './lib/actions/getPageBySlug'

const lexend = Lexend({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-lexend' // Define CSS variable
})

export const metadata: Metadata = {
  title: 'Boys and Girls Club of Lynn',
  description:
    'A full stack web application built for the Boys & Girls Club of Lynn to streamline member management, events, and resources, improving communication and engagement between staff, youth, and the community.'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  const session = await auth()
  const programs = await getPrograms()
  const pageContent = await getPageBySlug('home')

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="prefetch" href="/videos/landing.mov" />
      </head>
      <body className={`${lexend.variable} antialiased`}>
        <SessionProvider session={session}>
          <ThemeProvider>
            <RootLayoutWrapper programs={programs} pageContent={pageContent}>
              {children}
            </RootLayoutWrapper>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
