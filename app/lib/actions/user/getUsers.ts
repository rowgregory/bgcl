import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'

export const getUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            type: true,
            status: true,
            totalAmount: true,
            createdAt: true
          }
        },
        address: true
      }
    })

    return users
  } catch (error) {
    await createLog('error', 'Failed to fetch users', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
