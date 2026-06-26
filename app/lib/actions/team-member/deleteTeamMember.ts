'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'

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

    revalidatePath('/', 'layout')

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
