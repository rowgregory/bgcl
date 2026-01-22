'use client'

import { AnimatePresence } from 'framer-motion'
import { createFormActions, resetForm, setIsLoading } from '@/app/lib/store/slices/formSlice'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { useFormSelector, store, useClosingSelector } from '@/app/lib/store/store'
import Backdrop from '../common/Backdrop'
import extractErrorMessage from '@/app/lib/utils/extractErrorMessage'
import { useRouter } from 'next/navigation'
import Drawer from '../common/Drawer'
import { setCloseClosingDrawer } from '@/app/lib/store/slices/closingSlice'
import { updateClosing, UpdateClosingInput } from '@/app/lib/actions/updateClosing'
import { createClosing, CreateClosingInput } from '@/app/lib/actions/createClosing'
import validateClosingForm from '@/app/lib/validations/closing'
import { ClosingForm } from '../forms/ClosingForm'

const ClosingDrawer = () => {
  const router = useRouter()
  const { closingDrawer } = useClosingSelector()
  const { forms, isLoading } = useFormSelector()
  const inputs = forms.closingForm.inputs
  const errors = forms.closingForm.errors
  const isUpdating = !!inputs?.isUpdating
  const { handleInput, setErrors } = createFormActions('closingForm', store.dispatch)

  const onClose = () => {
    store.dispatch(resetForm('closingForm'))
    store.dispatch(setCloseClosingDrawer())
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateClosingForm(inputs, setErrors)) return
    try {
      store.dispatch(setIsLoading(true))

      if (inputs?.isUpdating) {
        await updateClosing(inputs as UpdateClosingInput)
      } else {
        await createClosing(inputs as CreateClosingInput)
      }

      router.refresh()

      onClose()

      store.dispatch(
        showToast({
          type: 'success',
          message: `${inputs?.isUpdating ? 'Closing Updated!' : 'Closing Created!'}`,
          description: inputs?.isUpdating
            ? 'Your closing has been successfully updated.'
            : 'Your closing has been successfully created!'
        })
      )
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(error)

      store.dispatch(
        showToast({
          type: 'error',
          message: `${inputs?.isUpdating ? 'Update' : 'Create'} Closing Failed`,
          description: errorMessage
        })
      )
    } finally {
      store.dispatch(setIsLoading(false))
    }
  }

  return (
    <AnimatePresence>
      {closingDrawer && (
        <>
          {/* Backdrop Overlay */}
          <Backdrop onClose={onClose} />

          {/* Drawer */}
          <Drawer>
            {/* Form */}
            <ClosingForm
              errors={errors}
              handleInput={handleInput}
              handleSubmit={handleSubmit}
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

export default ClosingDrawer
