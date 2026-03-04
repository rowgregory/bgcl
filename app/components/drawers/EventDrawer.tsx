'use client'

import { AnimatePresence } from 'framer-motion'
import validateEventForm from '@/app/lib/validations/event'
import { setCloseEventDrawer } from '@/app/lib/store/slices/eventSlice'
import { createFormActions, resetForm, setIsLoading } from '@/app/lib/store/slices/formSlice'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { store, useEventSelector, useFormSelector } from '@/app/lib/store/store'
import Backdrop from '../common/Backdrop'
import EventForm from '../forms/EventForm'
import extractErrorMessage from '@/app/lib/utils/extractErrorMessage'
import { useRouter } from 'next/navigation'
import { updateEvent } from '@/app/lib/actions/updateEvent'
import { createEvent } from '@/app/lib/actions/createEvent'
import Drawer from '../common/Drawer'

const EventDrawer = () => {
  const router = useRouter()
  const { eventDrawer } = useEventSelector()
  const { forms, isLoading } = useFormSelector()
  const inputs = forms.eventForm.inputs
  const errors = forms.eventForm.errors
  const isUpdating = !!inputs?.isUpdating
  const { handleInput, setErrors, handleToggle, handleSelect } = createFormActions('eventForm', store.dispatch)

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
        await updateEvent(inputs.id, inputs)
      } else {
        await createEvent(inputs)
      }

      router.refresh()

      onClose()

      store.dispatch(
        showToast({
          type: 'success',
          message: `${inputs?.isUpdating ? 'Event Updated!' : 'Event Created!'}`,
          description: inputs?.isUpdating
            ? 'Your event has been successfully updated.'
            : 'Your event has been successfully created!'
        })
      )
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(error)

      store.dispatch(
        showToast({
          type: 'error',
          message: `${inputs?.isUpdating ? 'Update' : 'Create'} Event Failed`,
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

export default EventDrawer
