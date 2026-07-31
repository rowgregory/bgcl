'use server'

import prisma from '@/prisma/client'
import { auth } from '../../auth/auth'

export async function getLogs() {
  try {
    const session = await auth()
    if (session?.user?.role !== 'SUPERUSER') {
      return { success: false, data: null, error: 'Unauthorized' }
    }

    const logs = await prisma.log.findMany({
      take: 200,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        level: true,
        message: true,
        metadata: true,
        userId: true,
        createdAt: true
      }
    })

    return {
      success: true,
      data: logs.map((l) => ({ ...l, createdAt: l.createdAt.toISOString() })),
      error: null
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
