'use client'

import { AnimatePresence } from 'framer-motion'
import { setCloseProgramDrawer } from '@/app/lib/store/slices/programSlice'
import { createFormActions, resetForm, setIsLoading } from '@/app/lib/store/slices/formSlice'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { useAppDispatch, useFormSelector, useProgramSelector } from '@/app/lib/store/store'
import Backdrop from '../common/Backdrop'
import extractErrorMessage from '@/app/lib/utils/extractErrorMessage'
import validateProgramForm from '@/app/lib/validations/program'
import { ProgramForm } from '../forms/ProgramForm'
import { updateProgram } from '@/app/lib/actions/updateProgram'
import { createProgram } from '@/app/lib/actions/createProgram'
import { ICreateProgram, IUpdateProgram } from '@/types/entities/program'
import Drawer from '../common/Drawer'
import { useRouter } from 'next/navigation'

const ProgramDrawer = () => {
  const dispatch = useAppDispatch()
  const { programDrawer } = useProgramSelector()
  const { forms, isLoading } = useFormSelector()
  const inputs = forms.programForm.inputs
  const errors = forms.programForm.errors
  const { handleInput, setErrors, handleToggle, handleSelect, handleSelectAgeGroup } = createFormActions(
    'programForm',
    dispatch
  )
  const router = useRouter()

  const onClose = () => {
    dispatch(resetForm('programForm'))
    dispatch(setCloseProgramDrawer())
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateProgramForm(inputs, setErrors)) return

    try {
      dispatch(setIsLoading(true))
      if (inputs?.isUpdating) {
        await updateProgram(inputs?.id as string, inputs as IUpdateProgram)
      } else {
        await createProgram(inputs as ICreateProgram)
      }

      router.refresh()

      onClose()

      dispatch(
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

      dispatch(
        showToast({
          type: 'error',
          message: `${inputs?.isUpdating ? 'Update' : 'Create'} Program Failed`,
          description: errorMessage
        })
      )
    } finally {
      dispatch(setIsLoading(false))
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
              handleSelect={handleSelect}
              inputs={inputs}
              isLoading={isLoading}
              isUpdating={Boolean(inputs?.isUpdating)}
              onClose={onClose}
              handleSelectAgeGroup={handleSelectAgeGroup}
            />
          </Drawer>
        </>
      )}
    </AnimatePresence>
  )
}

export default ProgramDrawer
