'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { requireUser } from '@/lib/utils/requireAdmin'

export async function deleteAddress() {
  const auth = await requireUser()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    await prisma.address.delete({
      where: { userId: auth.user.id }
    })

    await createLog('info', 'User deleted address', { userId: auth.user.id })

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete address', {
      userId: auth.user.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Failed to remove address. Please try again.' }
  }
}
