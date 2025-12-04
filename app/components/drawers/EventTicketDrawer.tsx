'use client'

import { AnimatePresence } from 'framer-motion'
import React from 'react'
import {
  addEventTicketToState,
  setCloseEventTicketDrawer,
  updateEventTicketInState
} from '@/app/redux/features/eventSlice'
import { createFormActions, resetForm } from '@/app/redux/features/formSlice'
import { showToast } from '@/app/redux/features/toastSlice'
import { useAppDispatch, useEventSelector, useFormSelector } from '@/app/redux/store'
import Backdrop from '../common/Backdrop'
import SplitViewDrawer from '../common/SplitViewDrawer'
import EventTicketsForm from '../forms/event/EventTicketForm'
import { useCreateEventTicketMutation, useUpdateEventTicketMutation } from '@/app/redux/services/eventApi'
import validateEventTicketForm from '@/app/lib/validations/eventTicket'

const EventTicketDrawer = () => {
  const dispatch = useAppDispatch()
  const onClose = () => {
    dispatch(resetForm('eventTicketForm'))
    dispatch(setCloseEventTicketDrawer())
  }
  const { eventTicketDrawer } = useEventSelector()

  const { forms } = useFormSelector()
  const inputs = forms.eventTicketForm?.inputs
  const errors = forms.eventTicketForm?.errors
  const { handleInput, setErrors, handleToggle, handleSelect } = createFormActions('eventTicketForm', dispatch)
  const [createEventTicket, { isLoading: isCreating }] = useCreateEventTicketMutation()
  const [updateEventTicket, { isLoading: isUpdating }] = useUpdateEventTicketMutation()
  const isLoading = isCreating || isUpdating

  if (!eventTicketDrawer) return

  // console.log('isLoading: ', isLoading)
  // console.log('inputs: ', inputs)

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateEventTicketForm(inputs, setErrors)) return

    try {
      const eventTicketData = {
        ...inputs
      }

      if (inputs?.isUpdating) {
        const updated = await updateEventTicket({
          eventId: inputs?.id,
          ...eventTicketData
        }).unwrap()
        console.log('updated: ', updated)
        dispatch(updateEventTicketInState(updated?.event))
      } else {
        const created = await createEventTicket(eventTicketData).unwrap()
        dispatch(addEventTicketToState(created?.event))
      }

      onClose()

      dispatch(
        showToast({
          type: 'success',
          message: `${inputs?.isUpdating ? 'Event Ticket Updated!' : 'Event Ticket Created!'}`,
          description: inputs?.isUpdating
            ? 'Your event ticket has been successfully updated.'
            : 'Your event ticket has been successfully created!'
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
          message: `${inputs?.isUpdating ? 'Update' : 'Create'} Event Ticket Failed`,
          description: errorMessage
        })
      )
    }
  }

  console.log('INPUTS: ', inputs)

  return (
    <AnimatePresence>
      {eventTicketDrawer && (
        <>
          {/* Backdrop Overlay */}
          <Backdrop onClose={onClose} />

          {/* Drawer */}
          <SplitViewDrawer>
            {/* Form */}
            <EventTicketsForm
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

export default EventTicketDrawer
