'use server'

import prisma from '@/prisma/client'
import { ITeamMember } from '@/types/entities/team-member'
import { revalidateTag } from 'next/cache'
import { createLog } from './createLog'

export async function updateTeamMember(id: string, data: Partial<Omit<ITeamMember, 'id' | 'createdAt' | 'updatedAt'>>) {
  try {
    // Omit null values and metadata fields
    const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== null && !['isUpdating'].includes(key)) {
        acc[key] = value
      }
      return acc
    }, {} as any)

    await prisma.teamMember.update({
      where: { id },
      data: cleanData
    })

    revalidateTag('Team-Member', 'default')

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
