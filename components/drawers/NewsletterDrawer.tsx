'use client'

import { AnimatePresence } from 'framer-motion'
import { createFormActions, resetForm, setIsLoading } from '@/lib/store/slices/formSlice'
import { showToast } from '@/lib/store/slices/toastSlice'
import { useNewsletterSelector, useFormSelector, store } from '@/lib/store/store'
import Backdrop from '../_shared/Backdrop'
import extractErrorMessage from '@/lib/utils/extractErrorMessage'
import { useRouter } from 'next/navigation'
import Drawer from '../_shared/Drawer'
import validateNewsletterForm from '@/lib/validations/newsletter'
import { setCloseNewsletterDrawer } from '@/lib/store/slices/newsletterSlice'
import { NewsletterForm } from '../forms/NewsletterForm'
import { updateNewsletter } from '@/lib/actions/newsletter/updateNewsletter'
import { createNewsletter } from '@/lib/actions/newsletter/createNewsletter'
import { CreateNewsletterInput, UpdateNewsletterInput } from '@/types/entities/newsletter'

export const NewsletterDrawer = () => {
  const router = useRouter()
  const { newsletterDrawer } = useNewsletterSelector()
  const { forms, isLoading } = useFormSelector()
  const inputs = forms.newsletterForm.inputs
  const errors = forms.newsletterForm.errors
  const isUpdating = !!inputs?.isUpdating
  const { handleInput, setErrors, handleToggle, handleSelect } = createFormActions('newsletterForm', store.dispatch)

  const onClose = () => {
    store.dispatch(resetForm('newsletterForm'))
    store.dispatch(setCloseNewsletterDrawer())
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateNewsletterForm(inputs, setErrors)) return
    try {
      store.dispatch(setIsLoading(true))

      if (inputs?.isUpdating) {
        await updateNewsletter(inputs as UpdateNewsletterInput)
      } else {
        await createNewsletter(inputs as CreateNewsletterInput)
      }

      router.refresh()

      onClose()

      store.dispatch(
        showToast({
          type: 'success',
          message: `${inputs?.isUpdating ? 'Newsletter Updated!' : 'Newsletter Created!'}`,
          description: inputs?.isUpdating
            ? 'Your newsletter has been successfully updated.'
            : 'Your newsletter has been successfully created!'
        })
      )
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(error)

      store.dispatch(
        showToast({
          type: 'error',
          message: `${inputs?.isUpdating ? 'Update' : 'Create'} newsletter Failed`,
          description: errorMessage
        })
      )
    } finally {
      store.dispatch(setIsLoading(false))
    }
  }

  return (
    <AnimatePresence>
      {newsletterDrawer && (
        <>
          {/* Backdrop Overlay */}
          <Backdrop onClose={onClose} />

          {/* Drawer */}
          <Drawer>
            {/* Form */}
            <NewsletterForm
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
