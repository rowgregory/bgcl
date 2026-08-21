'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { teamMemberSchema, TEAM_MEMBER_NULLABLE_FIELDS } from '@/lib/validations/team-member.validation'
import { emptyToNull } from '@/lib/utils/emptyToNull'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function createTeamMember(input: unknown) {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  const parsed = teamMemberSchema.safeParse(input)

  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      error: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid team member data'
    }
  }

  const data = parsed.data

  try {
    // Place new members at the end of their role group
    const lastMember = await prisma.teamMember.findFirst({
      where: { role: data.role },
      orderBy: { order: 'desc' },
      select: { order: true }
    })

    const teamMember = await prisma.teamMember.create({
      data: {
        ...emptyToNull(data, TEAM_MEMBER_NULLABLE_FIELDS),
        year: data.year ?? null,
        order: (lastMember?.order ?? -1) + 1
      }
    })

    revalidatePath('/', 'layout')

    await createLog('info', 'Team member created', {
      teamMemberId: teamMember.id,
      name: teamMember.name,
      role: teamMember.role
    })

    return { success: true, data: teamMember }
  } catch (error) {
    await createLog('error', 'Failed to create team member', {
      name: data.name,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to create team member. Please try again.'
    }
  }
}
