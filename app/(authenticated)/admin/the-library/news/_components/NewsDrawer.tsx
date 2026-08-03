'use client'

import { AnimatePresence } from 'framer-motion'
import Backdrop from '@/components/_shared/Backdrop'
import { useRouter } from 'next/navigation'
import Drawer from '@/components/_shared/Drawer'
import { updateNews } from '@/lib/actions/news/updateNews'
import { createNews } from '@/lib/actions/news/createNews'
import { EMPTY_NEWS, NewsFormInput, NewsFormValues, newsSchema } from '@/lib/validations/news.validation'
import { useNewsDrawer } from '@/stores/drawers'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import NewsForm from './NewsForm'

export const NewsDrawer = () => {
  const isOpen = useNewsDrawer((s) => s.isOpen)
  const news = useNewsDrawer((s) => s.data)
  const close = useNewsDrawer((s) => s.close)
  const router = useRouter()

  const isUpdating = Boolean(news?.id)

  const methods = useForm<NewsFormInput, unknown, NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: EMPTY_NEWS,
    mode: 'onTouched'
  })

  const { handleSubmit, reset, setError } = methods

  useEffect(() => {
    if (!isOpen) return

    if (!news) {
      reset(EMPTY_NEWS)
      return
    }

    reset({
      title: news.title,
      image: news.image,
      paragraph1: news.paragraph1,
      paragraph2: news.paragraph2,
      paragraph3: news.paragraph3,
      externalLink: news.externalLink
    })
  }, [isOpen, news, reset])

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = isUpdating ? await updateNews(news.id, values) : await createNews(values)

      if (!res.success) {
        setError('root', { message: res.error })
        document.getElementById('newsForm')?.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      close()
      router.refresh()
    } catch {
      setError('root', { message: `Failed to ${isUpdating ? 'update' : 'create'} news. Please try again` })
    }
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop onClose={close} />
          <Drawer>
            <FormProvider {...methods}>
              <form id="newsForm" onSubmit={onSubmit} noValidate className="flex flex-col h-full min-h-0">
                <NewsForm isUpdating={isUpdating} />
              </form>
            </FormProvider>
          </Drawer>
        </>
      )}
    </AnimatePresence>
  )
}
