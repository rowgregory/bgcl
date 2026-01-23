'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'

export async function createUser(data: {
  email: string
  firstName: string
  lastName: string
  role: 'VOLUNTEER' | 'ADMIN' | 'STAFF' | 'SUPPORTER' | 'SUPERUSER' | 'PROGRAM'
  phone?: string
  position?: string
  department?: string
}) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      throw new Error('User with this email already exists')
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

    revalidateTag('User', 'default')

    return {
      success: true,
      user: newUser,
      message: `${data.role.toLowerCase()} user created successfully`
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create user'
    return {
      success: false,
      error: errorMessage
    }
  }
}
