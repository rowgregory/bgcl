'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { teamMemberSchema, TEAM_MEMBER_NULLABLE_FIELDS } from '@/lib/validations/team-member.validation'
import { emptyToNull } from '@/lib/utils/emptyToNull'

export async function updateTeamMember(id: string, input: unknown) {
  if (!id) {
    return { success: false, error: 'Team member ID is required.' }
  }

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
    const teamMember = await prisma.teamMember.update({
      where: { id },
      data: {
        ...emptyToNull(data, TEAM_MEMBER_NULLABLE_FIELDS),
        year: data.year ?? null
      }
    })

    revalidatePath('/', 'layout')

    await createLog('info', 'Team member updated', {
      teamMemberId: teamMember.id,
      name: teamMember.name
    })

    return { success: true, data: teamMember }
  } catch (error) {
    await createLog('error', 'Failed to update team member', {
      teamMemberId: id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to update team member. Please try again.'
    }
  }
}
