'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'

export async function deleteTeamMember(id: string) {
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
