'use client'

import { AnimatePresence } from 'framer-motion'
import { createFormActions, resetForm, setIsLoading } from '@/lib/store/slices/formSlice'
import { showToast } from '@/lib/store/slices/toastSlice'
import { store, useFormSelector, useUiSelector } from '@/lib/store/store'
import Backdrop from '../_shared/Backdrop'
import { useRouter } from 'next/navigation'
import Drawer from '../_shared/Drawer'
import { setClosePartnerDrawer } from '@/lib/store/slices/uiSlice'
import extractErrorMessage from '@/lib/utils/extractErrorMessage'
import validatePartnerForm from '@/lib/validations/partner'
import PartnerForm from '../forms/PartnerForm'
import { CreatePartnerInputs, UpdatePartnerInputs } from '@/types/entities/partner'
import { updatePartner } from '@/lib/actions/partner/updatePartner'
import { createPartner } from '@/lib/actions/partner/createPartner'

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
        await updatePartner(inputs as UpdatePartnerInputs)
      } else {
        await createPartner(inputs as CreatePartnerInputs)
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
