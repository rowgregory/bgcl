import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { requireUser } from '@/lib/utils/requireAdmin'

export async function getUserPhone() {
  const auth = await requireUser()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.user.id },
      select: { phone: true }
    })

    return { success: true, data: user.phone, error: null }
  } catch (error) {
    await createLog('error', 'Failed to get user phone', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to get user phone. Please try again.',
      data: null
    }
  }
}
