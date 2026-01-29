'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'
import { createLog } from './createLog'

export async function deleteTeamMember(id: string) {
  try {
    const teamMember = await prisma.teamMember.findUnique({
      where: { id },
      select: { id: true, name: true, email: true }
    })

    if (!teamMember) {
      return {
        success: false,
        error: 'Team member not found'
      }
    }

    await prisma.teamMember.delete({
      where: { id }
    })

    await createLog('info', 'Team member deleted', {
      teamMemberId: id,
      name: teamMember.name,
      email: teamMember.email
    })

    revalidateTag('Team-Member', 'default')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete team member', {
      error: error instanceof Error ? error.message : 'Unknown error',
      teamMemberId: id
    })

    return {
      success: false,
      error: 'Failed to delete team member. Please try again.'
    }
  }
}
