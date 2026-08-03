import type { TeamMember } from '@prisma/client'
import type { TeamMemberRole } from '@/lib/validations/team-member.validation'

export type TeamMemberRecord = Omit<TeamMember, 'role'> & {
  role: TeamMemberRole
}
