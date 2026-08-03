'use client'

import { AnimatePresence } from 'framer-motion'
import Backdrop from '@/components/_shared/Backdrop'
import { useRouter } from 'next/navigation'
import Drawer from '@/components/_shared/Drawer'
import { useClosingDrawer } from '@/stores/drawers'
import { FormProvider, useForm } from 'react-hook-form'
import { ClosingFormInput, ClosingFormValues, closingSchema, EMPTY_CLOSING } from '@/lib/validations/closing.validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { updateClosing } from '@/lib/actions/closing/updateClosing'
import { createClosing } from '@/lib/actions/closing/createClosing'
import ClosingForm from './ClosingForm'

export default function ClosingDrawer() {
  const isOpen = useClosingDrawer((s) => s.isOpen)
  const closing = useClosingDrawer((s) => s.data)
  const close = useClosingDrawer((s) => s.close)
  const router = useRouter()

  const isUpdating = Boolean(closing?.id)

  const methods = useForm<ClosingFormInput, unknown, ClosingFormValues>({
    resolver: zodResolver(closingSchema),
    defaultValues: EMPTY_CLOSING,
    mode: 'onTouched'
  })

  const { handleSubmit, reset, setError } = methods

  useEffect(() => {
    if (!isOpen) return

    if (!closing) {
      reset(EMPTY_CLOSING)
      return
    }

    reset({
      title: closing.title,
      date: closing.date
    })
  }, [isOpen, closing, reset])

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = isUpdating ? await updateClosing(closing.id, values) : await createClosing(values)

      if (!res.success) {
        setError('root', { message: res.error })
        document.getElementById('closingForm')?.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      close()
      router.refresh()
    } catch {
      setError('root', { message: `Failed to ${isUpdating ? 'update' : 'create'} closing. Please try again` })
    }
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop onClose={close} />
          <Drawer>
            <FormProvider {...methods}>
              <form id="closingForm" onSubmit={onSubmit} noValidate className="flex flex-col h-full min-h-0">
                <ClosingForm isUpdating={isUpdating} />
              </form>
            </FormProvider>
          </Drawer>
        </>
      )}
    </AnimatePresence>
  )
}
