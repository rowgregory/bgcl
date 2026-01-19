'use server'

import prisma from '@/prisma/client'
import { revalidateTag, unstable_cache } from 'next/cache'

async function deleteTeamMemberFn(id: string) {
  try {
    if (!id) {
      throw new Error('Team member ID is required')
    }

    const teamMember = await prisma.teamMember.findUnique({
      where: { id }
    })

    if (!teamMember) {
      throw new Error('Team member not found')
    }

    await prisma.teamMember.delete({
      where: { id }
    })

    revalidateTag('Team-Member', 'default')

    return {
      success: true,
      message: `${teamMember.name} deleted successfully`
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete team member'
    return {
      success: false,
      error: errorMessage
    }
  }
}

export const deleteTeamMember = unstable_cache(
  async (id: string) => {
    return deleteTeamMemberFn(id)
  },
  ['deleteTeamMember'],
  {
    tags: ['Team-Member'],
    revalidate: 60
  }
)
