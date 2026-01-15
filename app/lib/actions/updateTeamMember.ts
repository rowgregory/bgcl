'use server'

import prisma from '@/prisma/client'
import { ITeamMember } from '@/types/entities/team-member'
import { revalidateTag, unstable_cache } from 'next/cache'

async function updateTeamMemberFn(id: string, data: Partial<Omit<ITeamMember, 'id' | 'createdAt' | 'updatedAt'>>) {
  try {
    if (!id) {
      throw new Error('Team member ID is required')
    }

    // Omit null values and metadata
    const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== null && !['isUpdating'].includes(key)) {
        acc[key] = value
      }
      return acc
    }, {} as any)

    const updatedTeamMember = await prisma.teamMember.update({
      where: { id },
      data: cleanData
    })

    revalidateTag('Team-Member', 'default')

    return {
      success: true,
      teamMember: updatedTeamMember,
      message: `${updatedTeamMember.name} updated successfully`
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update team member'
    return {
      success: false,
      error: errorMessage
    }
  }
}

export const updateTeamMember = unstable_cache(
  async (id: string, data: Partial<Omit<ITeamMember, 'id' | 'createdAt' | 'updatedAt'>>) => {
    return updateTeamMemberFn(id, data)
  },
  ['updateTeamMember'],
  {
    tags: ['Team-Member'],
    revalidate: 60
  }
)
