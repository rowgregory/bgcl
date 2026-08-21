import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { requireUser } from '@/lib/utils/requireAdmin'

export const getPhoneNumber = async () => {
  const auth = await requireUser()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.user.id },
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
