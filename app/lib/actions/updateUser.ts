'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'

export async function updateUser(
  userId: string,
  data: {
    email?: string
    firstName?: string
    lastName?: string
    role?: 'ADMIN' | 'STAFF' | 'SUPPORTER' | 'SUPERUSER' | 'VOLUNTEER' | 'PROGRAM'
    phone?: string
    position?: string
    department?: string
  }
) {
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      throw new Error('User not found')
    }

    // Check if new email is already taken by another user
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: data.email }
      })

      if (emailExists) {
        throw new Error('Email already in use')
      }
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        phone: data.phone,
        position: data.position,
        department: data.department
      }
    })

    revalidateTag('User', 'default')

    return {
      success: true,
      user: updatedUser,
      message: 'User updated successfully'
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update user'
    return {
      success: false,
      error: errorMessage
    }
  }
}
