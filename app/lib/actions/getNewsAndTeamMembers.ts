'use server'

import prisma from '@/prisma/client'
import { unstable_cache } from 'next/cache'
import { revalidateTag } from 'next/cache'

export const getNewsAndTeamMembers = unstable_cache(
  async () => {
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
      await prisma.log.create({
        data: {
          level: 'error',
          message: 'Failed to fetch news and team members',
          metadata: JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      })

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch data'
      }
    }
  },
  ['getNewsAndTeamMembers'],
  { tags: ['News', 'TeamMember'] }
)

export async function invalidateNewsAndTeamMembers() {
  revalidateTag('News', 'default')
  revalidateTag('TeamMember', 'default')
}
