'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { userSchema } from '@/lib/validations/user.validation'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function updateUser(id: string, input: unknown) {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  if (!id) {
    return { success: false, error: 'User ID is required.' }
  }

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
      where: { id },
      select: { id: true, email: true }
    })

    if (!existingUser) {
      return { success: false, error: 'User not found' }
    }

    // Guard the unique email before writing so the user gets a clear message
    if (data.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: data.email },
        select: { id: true }
      })

      if (emailExists) {
        return { success: false, error: 'Email already in use' }
      }
    }

    const user = await prisma.user.update({
      where: { id },
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

    await createLog('info', 'User updated successfully', {
      userId: user.id,
      email: user.email
    })

    return { success: true, data: user }
  } catch (error) {
    // email is @unique — covers the race between the check above and the write
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return { success: false, error: 'Email already in use' }
    }

    await createLog('error', 'Failed to update user', {
      userId: id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to update user. Please try again.'
    }
  }
}
