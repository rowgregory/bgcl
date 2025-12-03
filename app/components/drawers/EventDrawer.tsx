'use client'

import { AnimatePresence } from 'framer-motion'
import React from 'react'
import validateEventForm from '@/app/lib/validations/event'
import { addEventToState, setCloseEventDrawer, updateEventInState } from '@/app/redux/features/eventSlice'
import { createFormActions, resetForm } from '@/app/redux/features/formSlice'
import { showToast } from '@/app/redux/features/toastSlice'
import { useCreateEventMutation, useUpdateEventMutation } from '@/app/redux/services/eventApi'
import { useAppDispatch, useEventSelector, useFormSelector } from '@/app/redux/store'

import Backdrop from '../common/Backdrop'
import EventForm from '../forms/event/EventForm'
import SplitViewDrawer from '../common/SplitViewDrawer'

const EventDrawer = () => {
  const dispatch = useAppDispatch()
  const onClose = () => {
    dispatch(resetForm('eventForm'))
    dispatch(setCloseEventDrawer())
  }
  const { eventDrawer } = useEventSelector()
  const { forms } = useFormSelector()
  const inputs = forms.eventForm.inputs
  const errors = forms.eventForm.errors
  const { handleInput, setErrors, handleToggle, handleSelect } = createFormActions('eventForm', dispatch)
  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation()
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation()
  const isLoading = isCreating || isUpdating

  console.log('isLoading: ', isLoading)
  console.log('inputs: ', inputs)

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateEventForm(inputs, setErrors)) return

    try {
      const eventData = {
        ...inputs
      }

      if (inputs?.isUpdating) {
        const updated = await updateEvent({
          eventId: inputs?.id,
          ...eventData
        }).unwrap()
        dispatch(updateEventInState({ id: updated?.id, data: updated?.event }))
      } else {
        const created = await createEvent(eventData).unwrap()
        dispatch(addEventToState(created?.event))
      }

      onClose()

      dispatch(
        showToast({
          type: 'success',
          message: `${inputs?.isUpdating ? 'Event Updated!' : 'Event Created!'}`,
          description: inputs?.isUpdating
            ? 'Your event has been successfully updated.'
            : 'Your event has been successfully created!'
        })
      )
    } catch (error: unknown) {
      const errorMessage =
        error &&
        typeof error === 'object' &&
        'data' in error &&
        error.data &&
        typeof error.data === 'object' &&
        'message' in error.data
          ? String(error.data.message)
          : 'Unable to process request.'

      dispatch(
        showToast({
          type: 'error',
          message: `${inputs?.isUpdating ? 'Update' : 'Create'} Event Failed`,
          description: errorMessage
        })
      )
    }
  }

  return (
    <AnimatePresence>
      {eventDrawer && (
        <>
          {/* Backdrop Overlay */}
          <Backdrop onClose={onClose} />

          {/* Drawer */}
          <SplitViewDrawer>
            {/* Form */}
            <EventForm
              errors={errors}
              handleInput={handleInput}
              handleSubmit={handleSubmit}
              handleToggle={handleToggle}
              handleSelect={handleSelect}
              inputs={inputs}
              isLoading={isLoading}
              isUpdating={Boolean(inputs?.isUpdating)}
              onClose={onClose}
            />
          </SplitViewDrawer>
        </>
      )}
    </AnimatePresence>
  )
}

export default EventDrawer
