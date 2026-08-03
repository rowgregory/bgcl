'use client'

import { AnimatePresence } from 'framer-motion'
import Backdrop from '@/components/_shared/Backdrop'
import { useRouter } from 'next/navigation'
import Drawer from '@/components/_shared/Drawer'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import {
  EMPTY_TEAM_MEMBER,
  TeamMemberFormInput,
  TeamMemberFormValues,
  TeamMemberRole,
  teamMemberSchema
} from '@/lib/validations/team-member.validation'
import { updateTeamMember } from '@/lib/actions/team-member/updateTeamMember'
import { createTeamMember } from '@/lib/actions/team-member/createTeamMember'
import TeamMemberForm from './TeamMemberForm'
import { useTeamMemberDrawer } from '@/stores/drawers'

export const TeamMemberDrawer = () => {
  const isOpen = useTeamMemberDrawer((s) => s.isOpen)
  const teamMember = useTeamMemberDrawer((s) => s.data)
  const close = useTeamMemberDrawer((s) => s.close)
  const router = useRouter()

  const isUpdating = Boolean(teamMember?.id)

  const methods = useForm<TeamMemberFormInput, unknown, TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: EMPTY_TEAM_MEMBER,
    mode: 'onTouched'
  })

  const { handleSubmit, reset, setError } = methods

  useEffect(() => {
    if (!isOpen) return

    if (!teamMember) {
      reset(EMPTY_TEAM_MEMBER)
      return
    }

    reset({
      name: teamMember.name,
      title: teamMember.title ?? '',
      company: teamMember.company ?? '',
      image: teamMember.image ?? '',
      bio: teamMember.bio ?? '',
      phone: teamMember.phone ?? '',
      email: teamMember.email ?? '',
      role: teamMember.role as TeamMemberRole,

      year: teamMember.year ?? undefined,
      paragraph1: teamMember.paragraph1 ?? '',
      paragraph2: teamMember.paragraph2 ?? '',
      paragraph3: teamMember.paragraph3 ?? ''
    })
  }, [isOpen, teamMember, reset])

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = isUpdating ? await updateTeamMember(teamMember.id, values) : await createTeamMember(values)

      if (!res.success) {
        setError('root', { message: res.error })
        document.getElementById('teamMemberForm')?.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      close()
      router.refresh()
    } catch {
      setError('root', { message: `Failed to ${isUpdating ? 'update' : 'create'} team member. Please try again` })
    }
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop onClose={close} />
          <Drawer>
            <FormProvider {...methods}>
              <form id="teamMemberForm" onSubmit={onSubmit} noValidate className="flex flex-col h-full min-h-0">
                <TeamMemberForm isUpdating={isUpdating} />
              </form>
            </FormProvider>
          </Drawer>
        </>
      )}
    </AnimatePresence>
  )
}
