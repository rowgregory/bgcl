import { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' }
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Changed from 5 to 1
  userScalable: false, // Changed from true to false
  viewportFit: 'cover'
}
