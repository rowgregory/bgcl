'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { auth } from '../../auth'
import { revalidatePath } from 'next/cache'

export async function deleteAddress() {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    await prisma.address.delete({
      where: { userId: session.user.id }
    })

    await createLog('info', 'User deleted address', { userId: session.user.id })

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete address', {
      userId: session.user.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, error: 'Failed to remove address. Please try again.' }
  }
}
