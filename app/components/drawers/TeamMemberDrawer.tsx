'use client'

import { AnimatePresence } from 'framer-motion'
import { setCloseTeamMemberDrawer } from '@/app/lib/store/slices/teamMemberSlice'
import { createFormActions, resetForm, setIsLoading } from '@/app/lib/store/slices/formSlice'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { store, useFormSelector, useTeamMemberSelector } from '@/app/lib/store/store'
import Backdrop from '../common/Backdrop'
import extractErrorMessage from '@/app/lib/utils/extractErrorMessage'
import Drawer from '../common/Drawer'
import { createTeamMember } from '@/app/lib/actions/createTeamMember'
import { ITeamMember } from '@/types/entities/team-member'
import { updateTeamMember } from '@/app/lib/actions/updateTeamMember'
import validateTeamMemberForm from '@/app/lib/validations/team-member'
import { TeamMemberForm } from '../forms/TeamMemberForm'
import { useRouter } from 'next/navigation'

export const TeamMemberDrawer = () => {
  const router = useRouter()
  const { teamMemberDrawer } = useTeamMemberSelector()
  const { forms, isLoading } = useFormSelector()
  const inputs = forms?.teamMemberForm?.inputs
  const errors = forms?.teamMemberForm?.errors
  const { handleInput, setErrors, handleToggle, handleSelect } = createFormActions('teamMemberForm', store.dispatch)

  const onClose = () => {
    store.dispatch(resetForm('teamMemberForm'))
    store.dispatch(setCloseTeamMemberDrawer())
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateTeamMemberForm(inputs, setErrors)) return

    try {
      store.dispatch(setIsLoading(true))
      if (inputs?.isUpdating) {
        await updateTeamMember(inputs?.id, inputs)
      } else {
        await createTeamMember(inputs as ITeamMember)
      }

      router.refresh()

      onClose()

      store.dispatch(
        showToast({
          type: 'success',
          message: `${inputs?.isUpdating ? 'Team member updated!' : 'Team member created!'}`,
          description: inputs?.isUpdating
            ? 'Your teamMember has been successfully updated.'
            : 'Your teamMember has been successfully created!'
        })
      )
    } catch (error) {
      const errorMessage = extractErrorMessage(error)

      store.dispatch(
        showToast({
          type: 'error',
          message: `${inputs?.isUpdating ? 'Update' : 'Create'} TeamM member failed`,
          description: errorMessage
        })
      )
    } finally {
      store.dispatch(setIsLoading(false))
    }
  }

  return (
    <AnimatePresence>
      {teamMemberDrawer && (
        <>
          {/* Backdrop Overlay */}
          <Backdrop onClose={onClose} />

          {/* Drawer */}
          <Drawer>
            {/* Form */}
            <TeamMemberForm
              errors={errors}
              handleInput={handleInput}
              handleSubmit={handleSubmit}
              handleToggle={handleToggle}
              handleSelect={handleSelect}
              inputs={inputs}
              isLoading={isLoading}
              isUpdating={inputs?.isUpdating}
              onClose={onClose}
            />
          </Drawer>
        </>
      )}
    </AnimatePresence>
  )
}
