'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'
import { CreateUserInputs } from '@/types/entities/user'

export async function createUser(data: CreateUserInputs) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      return {
        success: false,
        error: `User with this email already exists`
      }
    }

    const newUser = await prisma.user.create({
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

    await createLog('info', 'User created', {
      userId: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName
    })

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to create user', {
      error: error instanceof Error ? error.message : 'Unknown error',
      firstName: data.firstName,
      lastName: data.lastName
    })

    return {
      success: false,
      error: 'Failed to create user. Please try again.'
    }
  }
}
