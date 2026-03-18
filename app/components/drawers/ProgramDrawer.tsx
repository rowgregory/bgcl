'use client'

import { AnimatePresence } from 'framer-motion'
import { setCloseProgramDrawer } from '@/app/lib/store/slices/programSlice'
import { createFormActions, resetForm, setIsLoading } from '@/app/lib/store/slices/formSlice'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { store, useFormSelector, useProgramSelector } from '@/app/lib/store/store'
import Backdrop from '../common/Backdrop'
import extractErrorMessage from '@/app/lib/utils/extractErrorMessage'
import validateProgramForm from '@/app/lib/validations/program'
import { ProgramForm } from '../forms/ProgramForm'
import { updateProgram } from '@/app/lib/actions/updateProgram'
import { createProgram } from '@/app/lib/actions/createProgram'
import { CreateProgramInputs, UpdateProgramInputs } from '@/types/entities/program'
import Drawer from '../common/Drawer'
import { useRouter } from 'next/navigation'

export const ProgramDrawer = ({ themes }) => {
  const { programDrawer } = useProgramSelector()
  const { forms, isLoading } = useFormSelector()
  const inputs = forms.programForm.inputs
  const errors = forms.programForm.errors
  const { handleInput, setErrors, handleToggle, handleSelectAgeGroup } = createFormActions(
    'programForm',
    store.dispatch
  )
  const router = useRouter()

  const onClose = () => {
    store.dispatch(resetForm('programForm'))
    store.dispatch(setCloseProgramDrawer())
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateProgramForm(inputs, setErrors)) return

    try {
      store.dispatch(setIsLoading(true))
      if (inputs?.isUpdating) {
        await updateProgram(inputs as UpdateProgramInputs)
      } else {
        await createProgram(inputs as CreateProgramInputs)
      }

      router.refresh()

      onClose()

      store.dispatch(
        showToast({
          type: 'success',
          message: `${inputs?.isUpdating ? 'Program Updated!' : 'Program Created!'}`,
          description: inputs?.isUpdating
            ? 'Your program has been successfully updated.'
            : 'Your program has been successfully created!'
        })
      )
    } catch (error) {
      const errorMessage = extractErrorMessage(error)

      store.dispatch(
        showToast({
          type: 'error',
          message: `${inputs?.isUpdating ? 'Update' : 'Create'} Program Failed`,
          description: errorMessage
        })
      )
    } finally {
      store.dispatch(setIsLoading(false))
    }
  }

  return (
    <AnimatePresence>
      {programDrawer && (
        <>
          {/* Backdrop Overlay */}
          <Backdrop onClose={onClose} />

          {/* Drawer */}
          <Drawer>
            {/* Form */}
            <ProgramForm
              errors={errors}
              handleInput={handleInput}
              handleSubmit={handleSubmit}
              handleToggle={handleToggle}
              inputs={inputs}
              isLoading={isLoading}
              isUpdating={Boolean(inputs?.isUpdating)}
              onClose={onClose}
              handleSelectAgeGroup={handleSelectAgeGroup}
              themes={themes}
            />
          </Drawer>
        </>
      )}
    </AnimatePresence>
  )
}
