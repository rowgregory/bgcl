'use client'

import { AnimatePresence } from 'framer-motion'
import Backdrop from '@/components/_shared/Backdrop'
import { useRouter } from 'next/navigation'
import Drawer from '@/components/_shared/Drawer'
import { updateCampaign } from '@/lib/actions/campaign/updateCampaign'
import { createCampaign } from '@/lib/actions/campaign/createCampaign'
import { useCampaignDrawer } from '@/stores/drawers'
import { CampaignFormInput, CampaignFormValues, campaignSchema } from '@/lib/validations/campaign.validation'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'
import { useEffect } from 'react'
import CampaignForm from './CampaignForm'

const EMPTY: Partial<CampaignFormInput> = {
  name: '',
  description: '',
  goalAmount: 0,
  currentAmount: 0,
  organizerName: '',
  startDate: ''
}

export const CampaignDrawer = () => {
  const isOpen = useCampaignDrawer((s) => s.isOpen)
  const campaign = useCampaignDrawer((s) => s.data)
  const close = useCampaignDrawer((s) => s.close)
  const router = useRouter()

  const isUpdating = Boolean(campaign?.id)

  const methods = useForm<CampaignFormInput, unknown, CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: EMPTY,
    mode: 'onTouched'
  })

  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = methods

  useEffect(() => {
    if (!isOpen) return
    if (!campaign) {
      reset(EMPTY)
      return
    }

    reset({
      name: campaign.name,
      description: campaign.description,
      goalAmount: campaign.goalAmount,
      currentAmount: campaign.currentAmount,
      organizerName: campaign.organizerName,
      startDate: campaign.startDate ? new Date(campaign.startDate).toISOString().slice(0, 10) : '',
      endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().slice(0, 10) : '',
      image: campaign.image,
      isActive: campaign.isActive,
      isListed: campaign.isListed,
      externalLink: campaign.externalLink
    })
  }, [isOpen, campaign, reset])

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = isUpdating ? await updateCampaign(campaign.id, values) : await createCampaign(values)
      if (!res.success) {
        setError('root', { message: res.error })
      }

      close()
      router.refresh()
    } catch {
      setError('root', { message: `Failed to ${isUpdating ? 'update' : 'create'} campaign. Please try again` })
    }
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop onClose={close} />

          <Drawer>
            <FormProvider {...methods}>
              <form id="campaignForm" onSubmit={onSubmit} noValidate className="flex h-full flex-col">
                {errors.root && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 p-4 mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" aria-hidden="true" />
                    <p className="text-sm text-red-800 dark:text-red-300">{errors.root.message}</p>
                  </div>
                )}

                <CampaignForm isUpdating={isUpdating} />
              </form>
            </FormProvider>
          </Drawer>
        </>
      )}
    </AnimatePresence>
  )
}
