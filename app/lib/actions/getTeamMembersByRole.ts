'use server'

import { unstable_cache } from 'next/cache'
import { TeamMember } from '@prisma/client'
import prisma from '@/prisma/client'

const VALID_ROLES = [
  'officer',
  'director',
  'corporator',
  'admin_staff',
  'program_staff',
  'maintenance_staff',
  'honoree',
  'fame',
  'helping',
  'commitment',
  'youth'
]

export const getTeamMembersByRole = unstable_cache(
  async (role: string): Promise<TeamMember[]> => {
    // Validate role
    if (!VALID_ROLES.includes(role)) {
      throw new Error(`Invalid role: ${role}`)
    }

    const teamMembers = await prisma.teamMember.findMany({
      where: {
        role
      },
      orderBy: {
        order: 'asc'
      }
    })

    return teamMembers
  },
  [`getTeamMemberByRole`],
  {
    tags: ['Team-Member'],
    revalidate: 60
  }
)
