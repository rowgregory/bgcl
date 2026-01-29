import prisma from '@/prisma/client'
import { createLog } from './createLog'

export const getUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return users
  } catch (error) {
    await createLog('error', 'Failed to fetch users', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
