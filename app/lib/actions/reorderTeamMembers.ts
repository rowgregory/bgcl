'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'
import { createLog } from './createLog'

interface TeamMember {
  id: string
  firstName: string
  lastName: string
  position: string
  role: string
  displayOrder: number
}

export async function reorderTeamMembers(role: string, teamMembers: TeamMember[]) {
  try {
    // Validation
    if (!teamMembers || !Array.isArray(teamMembers) || teamMembers.length === 0) {
      throw new Error('Invalid team members data')
    }

    if (!role || typeof role !== 'string') {
      throw new Error('Invalid role')
    }

    const isValidTeamMembers = teamMembers.every((member) => member.id && member.role === role)

    if (!isValidTeamMembers) {
      throw new Error(`Invalid team member data structure - missing id or role doesn't match ${role}`)
    }

    // Recalculate display order for role group starting from 1
    const updatedMembers = teamMembers.map((member, index) => ({
      ...member,
      displayOrder: index + 1
    }))

    // Update database with recalculated orders
    const savedMembers = await updateOrderInDatabase(updatedMembers)

    revalidateTag('Team-Member', 'default')

    return {
      success: true,
      data: {
        role,
        count: updatedMembers.length,
        saved: savedMembers
      }
    }
  } catch (error) {
    await createLog('error', 'Failed to reorder team members', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to reorder team members. Please try again.'
    }
  }
}

async function updateOrderInDatabase(teamMembers: TeamMember[]) {
  const updatePromises = teamMembers.map((member, index) =>
    prisma.teamMember.update({
      where: { id: member.id },
      data: { order: index + 1 }
    })
  )
  return Promise.all(updatePromises)
}
