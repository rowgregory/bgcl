'use server'

import prisma from '@/prisma/client'
import { ITeamMember } from '@/types/entities/team-member'
import { revalidateTag, unstable_cache } from 'next/cache'

type TeamMemberInput = Omit<ITeamMember, 'id' | 'createdAt' | 'updatedAt'>

async function createTeamMemberFn(data: TeamMemberInput) {
  try {
    // Validate required fields
    if (!data.name) {
      throw new Error('Missing required fields: name')
    }

    // Get the next displayOrder for this role
    const lastMember = await prisma.teamMember.findFirst({
      where: { role: data.role },
      orderBy: { order: 'desc' }
    })

    const nextOrder = (lastMember?.order || 0) + 1

    const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && key !== 'name') {
        // Convert year to number if it exists
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

    revalidateTag('Team-Member', 'default')

    return {
      success: true,
      teamMember: newTeamMember,
      message: `${data.name} added successfully`
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create team member'
    return {
      success: false,
      error: errorMessage
    }
  }
}

export const createTeamMember = unstable_cache(
  async (data: TeamMemberInput) => {
    return createTeamMemberFn(data)
  },
  ['createTeamMember'],
  {
    tags: ['Team-Member'],
    revalidate: 60
  }
)
