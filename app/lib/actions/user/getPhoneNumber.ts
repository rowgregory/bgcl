import prisma from '@/prisma/client'
import { auth } from '../../auth'
import { createLog } from '../log/createLog'

export const getPhoneNumber = async () => {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized', data: null }
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { phone: true }
    })

    return { success: true, data: user.phone, error: null }
  } catch (error) {
    await createLog('error', 'Failed to get phone number', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to get phone number. Please try again.',
      data: null
    }
  }
}
