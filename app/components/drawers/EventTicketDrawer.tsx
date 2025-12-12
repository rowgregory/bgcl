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
import extractErrorMessage from '@/app/lib/utils/extractErrorMessage'

const EventTicketDrawer = () => {
  const dispatch = useAppDispatch()
  const { eventTicketDrawer } = useEventSelector()
  const { forms } = useFormSelector()
  const inputs = forms.eventTicketForm?.inputs
  const errors = forms.eventTicketForm?.errors
  const { handleInput, setErrors, handleToggle, handleSelect } = createFormActions('eventTicketForm', dispatch)
  const [createEventTicket, { isLoading: isCreating }] = useCreateEventTicketMutation()
  const [updateEventTicket, { isLoading: isUpdating }] = useUpdateEventTicketMutation()
  const isLoading = isCreating || isUpdating
  const onClose = () => {
    dispatch(resetForm('eventTicketForm'))
    dispatch(setCloseEventTicketDrawer())
  }

  if (!eventTicketDrawer) return

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateEventTicketForm(inputs, setErrors)) return

    try {
      if (inputs?.isUpdating) {
        const updated = await updateEventTicket({
          id: inputs.id,
          name: inputs.name,
          description: inputs.description,
          price: inputs.price,
          totalQuantity: inputs.totalQuantity,
          minPerOrder: inputs.minPerOrder,
          maxPerOrder: inputs.maxPerOrder,
          salesStartDate: inputs.salesStartDate,
          salesEndDate: inputs.salesEndDate,
          sortOrder: inputs.sortOrder
        }).unwrap()

        dispatch(updateEventTicketInState(updated?.eventTicket))
      } else {
        const created = await createEventTicket(inputs).unwrap()
        dispatch(addEventTicketToState(created?.eventTicket))
      }

      onClose()

      dispatch(
        showToast({
          type: 'success',
          message: inputs?.isUpdating ? 'Event Ticket Updated!' : 'Event Ticket Created!',
          description: inputs?.isUpdating
            ? 'Your event ticket has been successfully updated.'
            : 'Your event ticket has been successfully created!'
        })
      )
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(error)

      dispatch(
        showToast({
          type: 'error',
          message: `${inputs?.isUpdating ? 'Update' : 'Create'} Event Ticket Failed`,
          description: errorMessage
        })
      )
    }
  }

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
