'use server'

import prisma from '@/prisma/client'
import { unstable_cache } from 'next/cache'

async function createAdminUserFn(data: {
  email: string
  firstName: string
  lastName: string
  role: 'VOLUNTEER' | 'ADMIN' | 'STAFF' | 'SUPPORTER' | 'SUPERUSER'
  phone?: string
  position?: string
  department?: string
}) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Create the new user
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

// Cached version - invalidate with revalidateTag('User')
export const createAdminUser = unstable_cache(
  async (data: {
    email: string
    firstName: string
    lastName: string
    role: 'VOLUNTEER' | 'ADMIN' | 'STAFF' | 'SUPPORTER' | 'SUPERUSER'
    phone?: string
    position?: string
    department?: string
  }) => {
    return createAdminUserFn(data)
  },
  ['createAdminUser'],
  {
    tags: ['User'],
    revalidate: 60 // Cache for 60 seconds
  }
)
