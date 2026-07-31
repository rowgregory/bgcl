import { TeamMember } from '@prisma/client'
import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'

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

export const getTeamMembersByRole = async (role: string): Promise<TeamMember[]> => {
  try {
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
  } catch (error) {
    await createLog('error', 'Failed to fetch team members by role', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
