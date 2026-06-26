'use server'

import prisma from '@/prisma/client'
import { CreateTeamMemberInput } from '@/types/entities/team-member'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'

export async function createTeamMember(data: CreateTeamMemberInput) {
  try {
    if (!data.name) {
      throw new Error('Missing required fields: name')
    }

    const lastMember = await prisma.teamMember.findFirst({
      where: { role: data.role },
      orderBy: { order: 'desc' }
    })

    const nextOrder = (lastMember?.order || 0) + 1

    const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && key !== 'name') {
        if (key === 'year' && value) {
          acc[key] = Number(value)
        } else {
          acc[key] = value
        }
      }
      return acc
    }, {} as any)

    const newTeamMember = await prisma.teamMember.create({
      data: {
        name: data.name,
        role: data.role,
        order: nextOrder,
        ...cleanData
      }
    })

    revalidatePath('/', 'layout')

    await createLog('info', 'Team member created successfully', {
      teamMemberId: newTeamMember.id,
      teamMemberName: newTeamMember.name
    })

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to create team member', {
      error: error instanceof Error ? error.message : 'Unknown error',
      name: data.name
    })

    return {
      success: false,
      error: 'Failed to create team member. Please try again.'
    }
  }
}
