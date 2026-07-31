'use client'

import { AnimatePresence } from 'framer-motion'
import validateEventForm from '@/lib/validations/event'
import { setCloseEventDrawer } from '@/lib/store/slices/eventSlice'
import { createFormActions, resetForm, setIsLoading } from '@/lib/store/slices/formSlice'
import { showToast } from '@/lib/store/slices/toastSlice'
import { store, useEventSelector, useFormSelector } from '@/lib/store/store'
import Backdrop from '../_shared/Backdrop'
import { EventForm } from '../forms/EventForm'
import extractErrorMessage from '@/lib/utils/extractErrorMessage'
import { useRouter } from 'next/navigation'
import { updateEvent } from '@/lib/actions/event/updateEvent'
import Drawer from '../_shared/Drawer'
import { CreateEventInput, UpdateEventInput } from '@/types/entities/event'
import { createEvent } from '@/lib/actions/event/createEvent'

export const EventDrawer = () => {
  const router = useRouter()
  const { eventDrawer } = useEventSelector()
  const { forms, isLoading } = useFormSelector()
  const inputs = forms.eventForm.inputs
  const errors = forms.eventForm.errors
  const isUpdating = !!inputs?.isUpdating
  const { handleInput, setErrors, handleSelect } = createFormActions('eventForm', store.dispatch)

  const onClose = () => {
    store.dispatch(resetForm('eventForm'))
    store.dispatch(setCloseEventDrawer())
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateEventForm(inputs, setErrors)) return

    try {
      store.dispatch(setIsLoading(true))

      if (inputs?.isUpdating) {
        await updateEvent(inputs as UpdateEventInput)
      } else {
        await createEvent(inputs as CreateEventInput)
      }

      router.refresh()

      onClose()

      store.dispatch(
        showToast({
          type: 'success',
          message: inputs?.isUpdating ? 'Event Updated!' : 'Event Created!',
          description: inputs?.isUpdating
            ? `${inputs?.title} has been updated successfully.`
            : inputs?.isPublic
              ? `${inputs?.title} is now live and visible to the public.`
              : `${inputs?.title} has been created but is not yet public.`
        })
      )
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(error)

      store.dispatch(
        showToast({
          type: 'error',
          message: inputs?.isUpdating ? 'Failed to Update Event' : 'Failed to Create Event',
          description: errorMessage
        })
      )
    } finally {
      store.dispatch(setIsLoading(false))
    }
  }

  return (
    <AnimatePresence>
      {eventDrawer && (
        <>
          {/* Backdrop Overlay */}
          <Backdrop onClose={onClose} />

          {/* Drawer */}
          <Drawer className="max-w-5xl">
            {/* Form */}
            <EventForm
              errors={errors}
              handleInput={handleInput}
              handleSubmit={handleSubmit}
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
