'use client'

import { AnimatePresence } from 'framer-motion'
import { createFormActions, resetForm, setIsLoading } from '@/app/lib/store/slices/formSlice'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { store, useFormSelector, useUiSelector } from '@/app/lib/store/store'
import Backdrop from '../common/Backdrop'
import { useRouter } from 'next/navigation'
import Drawer from '../common/Drawer'
import { setClosePartnerDrawer } from '@/app/lib/store/slices/uiSlice'
import extractErrorMessage from '@/app/lib/utils/extractErrorMessage'
import validatePartnerForm from '@/app/lib/validations/partner'
import PartnerForm from '../forms/PartnerForm'
import { createPartner } from '@/app/lib/actions/createPartner'
import { PartnerFormData } from '@/types/entities/partner'
import { updatePartner } from '@/app/lib/actions/updatePartner'

export const PartnerDrawer = () => {
  const router = useRouter()
  const { partnerDrawer } = useUiSelector()
  const { forms, isLoading } = useFormSelector()
  const inputs = forms.partnerForm?.inputs
  const errors = forms.partnerForm?.errors
  const isUpdating = !!inputs?.isUpdating
  const { handleInput, setErrors } = createFormActions('partnerForm', store.dispatch)

  const onClose = () => {
    store.dispatch(resetForm('partnerForm'))
    store.dispatch(setClosePartnerDrawer())
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validatePartnerForm(inputs, setErrors)) return

    try {
      store.dispatch(setIsLoading(true))

      if (inputs?.isUpdating) {
        await updatePartner(inputs.id as string, inputs as PartnerFormData)
      } else {
        await createPartner(inputs as PartnerFormData)
      }

      onClose()
      router.refresh()
      store.dispatch(
        showToast({
          message: inputs?.isUpdating ? 'Partner Updated!' : 'Partner Created!',
          description: inputs?.isUpdating
            ? 'Your partner has been successfully updated.'
            : 'Your partner has been successfully created!'
        })
      )
    } catch (error) {
      const errorMessage = extractErrorMessage(error)

      store.dispatch(
        showToast({
          type: 'error',
          message: `${inputs?.isUpdating ? 'Update' : 'Create'} Partner Failed`,
          description: errorMessage
        })
      )
    } finally {
      store.dispatch(setIsLoading(false))
    }
  }

  return (
    <AnimatePresence>
      {partnerDrawer && (
        <>
          {/* Backdrop Overlay */}
          <Backdrop onClose={onClose} />

          {/* Drawer */}
          <Drawer className="max-w-3xl">
            {/* Form */}
            <PartnerForm
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
