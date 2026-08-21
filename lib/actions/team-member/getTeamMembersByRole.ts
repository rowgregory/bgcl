import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { TEAM_MEMBER_ROLES, type TeamMemberRole } from '@/lib/validations/team-member.validation'
import type { TeamMemberRecord } from '@/types/team-member.types'

export async function getTeamMembersByRole(role: TeamMemberRole) {
  try {
    if (!TEAM_MEMBER_ROLES.includes(role)) {
      throw new Error(`Invalid role: ${role}`)
    }

    const teamMembers = await prisma.teamMember.findMany({
      where: { role },
      orderBy: { order: 'asc' }
    })

    return { success: false, data: teamMembers as TeamMemberRecord[] }
  } catch (error) {
    await createLog('error', 'Failed to fetch team members by role', {
      role,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Could not load team members' }
  }
}
