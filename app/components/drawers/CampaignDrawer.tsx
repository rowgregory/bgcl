'use client'

import { AnimatePresence } from 'framer-motion'
import { createFormActions, resetForm, setIsLoading } from '@/app/lib/store/slices/formSlice'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { useCampaignSelector, useFormSelector, store } from '@/app/lib/store/store'
import Backdrop from '../common/Backdrop'
import extractErrorMessage from '@/app/lib/utils/extractErrorMessage'
import { useRouter } from 'next/navigation'
import Drawer from '../common/Drawer'
import validateCampaignForm from '@/app/lib/validations/campaign'
import { setCloseCampaignDrawer } from '@/app/lib/store/slices/campaignSlice'
import { CampaignForm } from '../forms/CampaignForm'
import { updateCampaign } from '@/app/lib/actions/updateCampaign'
import { createCampaign } from '@/app/lib/actions/campaign/createCampaign'
import { CreateCampaignInput, UpdateCampaignInput } from '@/types/entities/campaign'

export const CampaignDrawer = () => {
  const router = useRouter()
  const { campaignDrawer } = useCampaignSelector()
  const { forms, isLoading } = useFormSelector()
  const inputs = forms.campaignForm.inputs
  const errors = forms.campaignForm.errors
  const isUpdating = !!inputs?.isUpdating
  const { handleInput, setErrors } = createFormActions('campaignForm', store.dispatch)

  const onClose = () => {
    store.dispatch(resetForm('campaignForm'))
    store.dispatch(setCloseCampaignDrawer())
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
      {campaignDrawer && (
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
