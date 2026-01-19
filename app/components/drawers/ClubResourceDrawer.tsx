'use client'

import { AnimatePresence } from 'framer-motion'
import { createFormActions, resetForm, setIsLoading } from '@/app/lib/store/slices/formSlice'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { useFormSelector, store, useClubResourceSelector } from '@/app/lib/store/store'
import Backdrop from '../common/Backdrop'
import extractErrorMessage from '@/app/lib/utils/extractErrorMessage'
import { useRouter } from 'next/navigation'
import Drawer from '../common/Drawer'
import { setCloseClubResourceDrawer } from '@/app/lib/store/slices/clubResourceSlice'
import validateClubResourceForm from '@/app/lib/validations/club-resource'
import { ClubResourceForm } from '../forms/ClubResourceForm'
import { updateClubResource, UpdateClubResourceInput } from '@/app/lib/actions/updateClubResource'
import { createClubResource, CreateClubResourceInput } from '@/app/lib/actions/createClubResource'

const ClubResourceDrawer = () => {
  const router = useRouter()
  const { clubResourceDrawer } = useClubResourceSelector()
  const { forms, isLoading } = useFormSelector()
  const inputs = forms.clubResourceForm.inputs
  const errors = forms.clubResourceForm.errors
  const isUpdating = !!inputs?.isUpdating
  const { handleInput, setErrors, handleToggle, handleSelect } = createFormActions('clubResourceForm', store.dispatch)

  const onClose = () => {
    store.dispatch(resetForm('clubResourceForm'))
    store.dispatch(setCloseClubResourceDrawer())
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateClubResourceForm(inputs, setErrors)) return

    try {
      store.dispatch(setIsLoading(true))

      if (inputs?.isUpdating) {
        await updateClubResource(inputs as UpdateClubResourceInput)
      } else {
        await createClubResource(inputs as CreateClubResourceInput)
      }

      router.refresh()

      onClose()

      store.dispatch(
        showToast({
          type: 'success',
          message: `${inputs?.isUpdating ? 'Club resource Updated!' : 'Club resource Created!'}`,
          description: inputs?.isUpdating
            ? 'Your club resource has been successfully updated.'
            : 'Your club resource has been successfully created!'
        })
      )
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(error)

      store.dispatch(
        showToast({
          type: 'error',
          message: `${inputs?.isUpdating ? 'Update' : 'Create'} club resource failed`,
          description: errorMessage
        })
      )
    } finally {
      store.dispatch(setIsLoading(false))
    }
  }

  return (
    <AnimatePresence>
      {clubResourceDrawer && (
        <>
          {/* Backdrop Overlay */}
          <Backdrop onClose={onClose} />

          {/* Drawer */}
          <Drawer>
            {/* Form */}
            <ClubResourceForm
              errors={errors}
              handleInput={handleInput}
              handleSubmit={handleSubmit}
              handleToggle={handleToggle}
              handleSelect={handleSelect}
              inputs={inputs}
              isLoading={isLoading}
              isUpdating={isUpdating}
              onClose={onClose}
            />
          </Drawer>
        </>
      )}
    </AnimatePresence>
  )
}

export default ClubResourceDrawer
