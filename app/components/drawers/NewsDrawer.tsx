'use client'

import { AnimatePresence } from 'framer-motion'
import { createFormActions, resetForm, setIsLoading } from '@/app/lib/store/slices/formSlice'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { useNewsSelector, useFormSelector, store } from '@/app/lib/store/store'
import Backdrop from '../common/Backdrop'
import extractErrorMessage from '@/app/lib/utils/extractErrorMessage'
import { useRouter } from 'next/navigation'
import Drawer from '../common/Drawer'
import validateNewsForm from '@/app/lib/validations/news'
import { setCloseNewsDrawer } from '@/app/lib/store/slices/newsSlice'
import { NewsForm } from '../forms/NewsForm'
import { updateNews } from '@/app/lib/actions/news/updateNews'
import { createNews } from '@/app/lib/actions/news/createNews'
import { CreateNewsInput, UpdateNewsInput } from '@/types/entities/news'

export const NewsDrawer = () => {
  const router = useRouter()
  const { newsDrawer } = useNewsSelector()
  const { forms, isLoading } = useFormSelector()
  const inputs = forms.newsForm.inputs
  const errors = forms.newsForm.errors
  const isUpdating = !!inputs?.isUpdating
  const { handleInput, setErrors, handleToggle, handleSelect } = createFormActions('newsForm', store.dispatch)

  const onClose = () => {
    store.dispatch(resetForm('newsForm'))
    store.dispatch(setCloseNewsDrawer())
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateNewsForm(inputs, setErrors)) return
    try {
      store.dispatch(setIsLoading(true))

      if (inputs?.isUpdating) {
        await updateNews(inputs as UpdateNewsInput)
      } else {
        await createNews(inputs as CreateNewsInput)
      }

      router.refresh()

      onClose()

      store.dispatch(
        showToast({
          type: 'success',
          message: `${inputs?.isUpdating ? 'News Updated!' : 'News Created!'}`,
          description: inputs?.isUpdating
            ? 'Your news has been successfully updated.'
            : 'Your news has been successfully created!'
        })
      )
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(error)

      store.dispatch(
        showToast({
          type: 'error',
          message: `${inputs?.isUpdating ? 'Update' : 'Create'} News Failed`,
          description: errorMessage
        })
      )
    } finally {
      store.dispatch(setIsLoading(false))
    }
  }

  return (
    <AnimatePresence>
      {newsDrawer && (
        <>
          {/* Backdrop Overlay */}
          <Backdrop onClose={onClose} />

          {/* Drawer */}
          <Drawer>
            {/* Form */}
            <NewsForm
              errors={errors}
              handleInput={handleInput}
              handleSubmit={handleSubmit}
              handleToggle={handleToggle}
              handleSelect={handleSelect}
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
