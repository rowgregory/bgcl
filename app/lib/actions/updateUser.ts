'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'
import { UpdateUserInputs } from '@/types/entities/user'

export async function updateUser(data: UpdateUserInputs) {
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: data?.id },
      select: { id: true, email: true }
    })

    if (!existingUser) {
      return {
        success: false,
        error: 'User not found'
      }
    }

    // Check if new email is already taken by another user
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: data.email },
        select: { id: true }
      })

      if (emailExists) {
        return {
          success: false,
          error: 'Email already in use'
        }
      }
    }
    // Update the user
    await prisma.user.update({
      where: { id: data?.id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        role: data.role
      }
    })

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to update user', {
      userId: data?.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to update user. Please try again.'
    }
  }
}
