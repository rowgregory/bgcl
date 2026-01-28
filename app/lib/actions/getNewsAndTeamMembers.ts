'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'
import { createLog } from './createLog'

export const getNewsAndTeamMembers = async () => {
  try {
    const [news, allTeamMembers] = await Promise.all([
      prisma.news.findMany({
        orderBy: { order: 'asc' }
      }),
      prisma.teamMember.findMany({
        where: {
          role: {
            in: ['honoree', 'helping', 'commitment', 'fame']
          }
        },
        orderBy: { order: 'asc' }
      })
    ])

    // Organize team members by their type
    const teamMembers = {
      honoree: allTeamMembers.filter((member) => member.role === 'honoree'),
      helping: allTeamMembers.filter((member) => member.role === 'helping'),
      commitment: allTeamMembers.filter((member) => member.role === 'commitment'),
      fame: allTeamMembers.filter((member) => member.role === 'fame')
    }

    return {
      success: true,
      data: {
        news,
        teamMembers
      }
    }
  } catch (error) {
    await createLog('error', 'Failed to fetch news and team members', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}

export async function invalidateNewsAndTeamMembers() {
  revalidateTag('News', 'default')
  revalidateTag('TeamMember', 'default')
}
