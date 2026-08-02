'use client'

import { AnimatePresence } from 'framer-motion'
import { createFormActions, resetForm, setIsLoading } from '@/lib/store/slices/formSlice'
import { showToast } from '@/lib/store/slices/toastSlice'
import { useFormSelector, store } from '@/lib/store/store'
import Backdrop from '../_shared/Backdrop'
import extractErrorMessage from '@/lib/utils/extractErrorMessage'
import { useRouter } from 'next/navigation'
import Drawer from '../_shared/Drawer'
import validateCampaignForm from '@/lib/validations/campaign'
import { CampaignForm } from '../forms/CampaignForm'
import { updateCampaign } from '@/lib/actions/campaign/updateCampaign'
import { createCampaign } from '@/lib/actions/campaign/createCampaign'
import { CreateCampaignInput, UpdateCampaignInput } from '@/types/entities/campaign'
import { useCampaignDrawer } from '@/stores/drawers'

export const CampaignDrawer = () => {
  const router = useRouter()
  const { isOpen } = useCampaignDrawer()
  const { forms, isLoading } = useFormSelector()
  const inputs = forms.campaignForm.inputs
  const errors = forms.campaignForm.errors
  const isUpdating = !!inputs?.isUpdating
  const { handleInput, setErrors } = createFormActions('campaignForm', store.dispatch)

  const onClose = () => {
    store.dispatch(resetForm('campaignForm'))
    useCampaignDrawer.getState().close()
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateCampaignForm(inputs, setErrors)) return
    try {
      store.dispatch(setIsLoading(true))

      if (inputs?.isUpdating) {
        await updateCampaign(inputs as UpdateCampaignInput)
      } else {
        await createCampaign(inputs as CreateCampaignInput)
      }

      router.refresh()

      onClose()

      store.dispatch(
        showToast({
          type: 'success',
          message: `${inputs?.isUpdating ? 'Campaign Updated!' : 'Campaign Created!'}`,
          description: inputs?.isUpdating
            ? 'Your campaign has been successfully updated.'
            : 'Your campaign has been successfully created!'
        })
      )
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(error)

      store.dispatch(
        showToast({
          type: 'error',
          message: `${inputs?.isUpdating ? 'Update' : 'Create'} Campaign Failed`,
          description: errorMessage
        })
      )
    } finally {
      store.dispatch(setIsLoading(false))
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <Backdrop onClose={onClose} />

          {/* Drawer */}
          <Drawer>
            {/* Form */}
            <CampaignForm
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
