'use server'

import prisma from '@/prisma/client'
import { ITeamMember } from '@/types/entities/team-member'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'

export async function updateTeamMember(id: string, data: Partial<Omit<ITeamMember, 'id' | 'createdAt' | 'updatedAt'>>) {
  try {
    // Omit null values and metadata fields
    // Add a year coercion before passing to Prisma
    const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== null && !['isUpdating'].includes(key)) {
        acc[key] = key === 'year' && value !== undefined ? parseInt(value as string) : value
      }
      return acc
    }, {} as any)

    await prisma.teamMember.update({
      where: { id },
      data: cleanData
    })

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to update team member', {
      teamMemberId: id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to update team member. Please try again.'
    }
  }
}
