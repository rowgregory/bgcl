'use server'

import prisma from '@/prisma/client'
import { revalidatePath } from 'next/cache'
import { createLog } from '../log/createLog'
import { userSchema } from '@/lib/validations/user.validation'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function createUser(input: unknown) {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  const parsed = userSchema.safeParse(input)

  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      error: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid user data'
    }
  }

  const data = parsed.data

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true }
    })

    if (existingUser) {
      return { success: false, error: 'User with this email already exists' }
    }

    const user = await prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        phone: data.phone || null,
        position: data.position || null,
        department: data.department || null
      }
    })

    revalidatePath('/', 'layout')

    await createLog('info', 'User created', {
      userId: user.id,
      email: user.email
    })

    return { success: true, data: user }
  } catch (error) {
    // email is @unique — covers the race between the check above and the write
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return { success: false, error: 'User with this email already exists' }
    }

    await createLog('error', 'Failed to create user', {
      email: data.email,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to create user. Please try again.'
    }
  }
}
