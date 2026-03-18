'use client'

import { AnimatePresence } from 'framer-motion'
import { createFormActions, resetForm, setIsLoading } from '@/app/lib/store/slices/formSlice'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { useAppDispatch, useFormSelector, useTicketSelector } from '@/app/lib/store/store'
import Backdrop from '../common/Backdrop'
import TicketsForm from '../forms/TicketForm'
import validateTicketForm from '@/app/lib/validations/ticket'
import extractErrorMessage from '@/app/lib/utils/extractErrorMessage'
import { updateTicket } from '@/app/lib/actions/updateTicket'
import { createTicket } from '@/app/lib/actions/createTicket'
import { useRouter } from 'next/navigation'
import { setCloseTicketDrawer } from '@/app/lib/store/slices/ticketSlice'
import Drawer from '../common/Drawer'

export const TicketDrawer = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { ticketDrawer } = useTicketSelector()
  const { forms, isLoading } = useFormSelector()
  const inputs = forms.ticketForm?.inputs
  const errors = forms.ticketForm?.errors
  const isUpdating = !!inputs?.isUpdating
  const { handleInput, setErrors, handleToggle, handleSelect } = createFormActions('ticketForm', dispatch)

  const onClose = () => {
    dispatch(resetForm('ticketForm'))
    dispatch(setCloseTicketDrawer())
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateTicketForm(inputs, setErrors)) return

    const ticket = {
      name: inputs.name,
      description: inputs.description,
      price: inputs.price,
      totalQuantity: inputs.totalQuantity,
      isAvailable: inputs.isAvailable,
      sortOrder: inputs.sortOrder
    }

    try {
      dispatch(setIsLoading(true))

      if (inputs?.isUpdating) {
        await updateTicket(inputs.id as string, ticket)
      } else {
        await createTicket(inputs.eventId as string, ticket)
      }

      router.refresh()

      onClose()

      dispatch(
        showToast({
          message: inputs?.isUpdating ? 'Ticket Updated!' : 'Ticket Created!',
          description: inputs?.isUpdating
            ? 'Your ticket has been successfully updated.'
            : 'Your ticket has been successfully created!'
        })
      )
    } catch (error) {
      const errorMessage = extractErrorMessage(error)

      dispatch(
        showToast({
          type: 'error',
          message: `${inputs?.isUpdating ? 'Update' : 'Create'} Ticket Failed`,
          description: errorMessage
        })
      )
    } finally {
      dispatch(setIsLoading(false))
    }
  }

  return (
    <AnimatePresence>
      {ticketDrawer && (
        <>
          {/* Backdrop Overlay */}
          <Backdrop onClose={onClose} />

          {/* Drawer */}
          <Drawer className="max-w-5xl">
            {/* Form */}
            <TicketsForm
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
