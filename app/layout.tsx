import type { Metadata } from 'next'
import { Lexend, Nunito_Sans, Quicksand } from 'next/font/google'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/app/lib/auth'
import { ReactNode } from 'react'
import RootLayoutWrapper from './root-layout'

const nunito = Nunito_Sans({
  subsets: ['latin'],
  weight: ['700', '800', '900', '1000'],
  display: 'swap',
  variable: '--font-nunito' // Define CSS variable
})

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
  variable: '--font-quicksand' // Define CSS variable
})

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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.variable} ${quicksand.variable} ${lexend.variable} antialiased`}>
        <SessionProvider session={session}>
          <RootLayoutWrapper>{children}</RootLayoutWrapper>
        </SessionProvider>
      </body>
    </html>
  )
}
