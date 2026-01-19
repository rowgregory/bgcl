'use server'

import prisma from '@/prisma/client'
import { revalidateTag, unstable_cache } from 'next/cache'

async function deleteUserFn(id: string) {
  try {
    if (!id) {
      throw new Error('User ID is required')
    }

    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      throw new Error('User not found')
    }

    await prisma.user.delete({
      where: { id }
    })

    revalidateTag('User', 'default')

    return {
      success: true,
      message: `${user.firstName} ${user.lastName} deleted successfully`
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete user'
    return {
      success: false,
      error: errorMessage
    }
  }
}

export const deleteUser = unstable_cache(
  async (id: string) => {
    return deleteUserFn(id)
  },
  ['deleteUser'],
  {
    tags: ['User'],
    revalidate: 60
  }
)
