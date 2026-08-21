'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'

export async function getNewsAndTeamMembers() {
  try {
    const [news, allTeamMembers] = await Promise.all([
      prisma.news.findMany({
        orderBy: { order: 'asc' }
      }),
      prisma.teamMember.findMany({
        where: {
          role: {
            in: ['honoree', 'helping', 'commitment', 'fame', 'youth']
          }
        },
        orderBy: { order: 'asc' }
      })
    ])

    const teamMembers = {
      honoree: allTeamMembers.filter((member) => member.role === 'honoree'),
      helping: allTeamMembers.filter((member) => member.role === 'helping'),
      commitment: allTeamMembers.filter((member) => member.role === 'commitment'),
      fame: allTeamMembers.filter((member) => member.role === 'fame'),
      youth: allTeamMembers.filter((member) => member.role === 'youth')
    }

    return {
      success: true,
      data: { news, teamMembers },
      error: null
    }
  } catch (error) {
    await createLog('error', 'Failed to fetch news and team members', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Could not load news and team members.' }
  }
}
