'use server'

import prisma from '@/prisma/client'

export async function logAuthError(data: {
  error: string
  title: string
  message: string
  timestamp: string
  userAgent: string
  url: string
  email?: string
}) {
  try {
    await prisma.log.create({
      data: {
        level: 'error',
        message: `Auth Error: ${data.title}`,
        metadata: {
          error: data.error,
          description: data.message,
          timestamp: data.timestamp,
          userAgent: data.userAgent,
          url: data.url,
          email: data.email
        }
      }
    })

    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
