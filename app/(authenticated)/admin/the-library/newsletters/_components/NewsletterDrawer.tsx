'use client'

import { AnimatePresence } from 'framer-motion'
import Backdrop from '@/components/_shared/Backdrop'
import { useRouter } from 'next/navigation'
import Drawer from '@/components/_shared/Drawer'
import { useNewsletterDrawer } from '@/stores/drawers'
import { FormProvider, useForm } from 'react-hook-form'
import {
  EMPTY_NEWSLETTER,
  NewsletterFormInput,
  NewsletterFormValues,
  newsletterSchema
} from '@/lib/validations/newsletter.validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { updateNewsletter } from '@/lib/actions/newsletter/updateNewsletter'
import { createNewsletter } from '@/lib/actions/newsletter/createNewsletter'
import NewsletterForm from './NewsletterForm'

export default function NewsletterDrawer() {
  const isOpen = useNewsletterDrawer((s) => s.isOpen)
  const newsletter = useNewsletterDrawer((s) => s.data)
  const close = useNewsletterDrawer((s) => s.close)
  const router = useRouter()

  const isUpdating = Boolean(newsletter?.id)

  const methods = useForm<NewsletterFormInput, unknown, NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: EMPTY_NEWSLETTER,
    mode: 'onTouched'
  })

  const { handleSubmit, reset, setError } = methods

  useEffect(() => {
    if (!isOpen) return

    if (!newsletter) {
      reset(EMPTY_NEWSLETTER)
      return
    }

    reset({
      month: newsletter.month as NewsletterFormInput['month'],
      year: newsletter.year,
      pdfUrl: newsletter.pdfUrl
    })
  }, [isOpen, newsletter, reset])

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = isUpdating ? await updateNewsletter(newsletter.id, values) : await createNewsletter(values)

      if (!res.success) {
        setError('root', { message: res.error })
        document.getElementById('newsletterForm')?.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      close()
      router.refresh()
    } catch {
      setError('root', { message: `Failed to ${isUpdating ? 'update' : 'create'} newsletter. Please try again` })
    }
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop onClose={close} />
          <Drawer>
            <FormProvider {...methods}>
              <form id="newsletterForm" onSubmit={onSubmit} noValidate className="flex flex-col h-full min-h-0">
                <NewsletterForm isUpdating={isUpdating} />
              </form>
            </FormProvider>
          </Drawer>
        </>
      )}
    </AnimatePresence>
  )
}
