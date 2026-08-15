'use client'

import { AnimatePresence } from 'framer-motion'
import Backdrop from '@/components/_shared/Backdrop'
import { useRouter } from 'next/navigation'
import Drawer from '@/components/_shared/Drawer'
import { usePartnerDrawer } from '@/stores/drawers'
import { FormProvider, useForm } from 'react-hook-form'
import { PartnerFormInput, PartnerFormValues, partnerSchema, EMPTY_PARTNER } from '@/lib/validations/partner.validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { updatePartner } from '@/lib/actions/partner/updatePartner'
import { createPartner } from '@/lib/actions/partner/createPartner'
import PartnerForm from './PartnerForm'

export default function PartnerDrawer() {
  const isOpen = usePartnerDrawer((s) => s.isOpen)
  const payload = usePartnerDrawer((s) => s.data)
  const close = usePartnerDrawer((s) => s.close)
  const router = useRouter()

  const partner = payload?.partner
  const isUpdating = Boolean(partner?.id)

  const methods = useForm<PartnerFormInput, unknown, PartnerFormValues>({
    resolver: zodResolver(partnerSchema),
    defaultValues: EMPTY_PARTNER,
    mode: 'onTouched'
  })

  const { handleSubmit, reset, setError } = methods

  useEffect(() => {
    if (!isOpen) return

    if (!partner) {
      // Adding: seed the tier the list opened from
      reset({ ...EMPTY_PARTNER, tier: payload?.tier ?? EMPTY_PARTNER.tier })
      return
    }

    reset({
      name: partner.name,
      externalLink: partner.externalLink ?? '',
      amount: partner.amount ?? '',
      image: partner.image ?? '',
      description: partner.description ?? '',
      notes: partner.notes ?? '',

      category: partner.category ?? undefined,
      tier: partner.tier ?? undefined,

      isActive: partner.isActive ?? true,
      isFeatured: partner.isFeatured ?? false
    })
  }, [isOpen, partner, payload?.tier, reset])

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = isUpdating ? await updatePartner(partner.id, values) : await createPartner(values)

      if (!res.success) {
        setError('root', { message: res.error })
        document.getElementById('partnerForm')?.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      close()
      router.refresh()
    } catch {
      setError('root', { message: `Failed to ${isUpdating ? 'update' : 'create'} partner. Please try again` })
    }
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop onClose={close} />
          <Drawer>
            <FormProvider {...methods}>
              <form id="partnerForm" onSubmit={onSubmit} noValidate className="flex flex-col h-full min-h-0">
                <PartnerForm isUpdating={isUpdating} />
              </form>
            </FormProvider>
          </Drawer>
        </>
      )}
    </AnimatePresence>
  )
}
