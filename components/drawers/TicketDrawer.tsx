'use client'

import { AnimatePresence } from 'framer-motion'
import { createFormActions, resetForm, setIsLoading } from '@/lib/store/slices/formSlice'
import { showToast } from '@/lib/store/slices/toastSlice'
import { useAppDispatch, useFormSelector, useTicketSelector } from '@/lib/store/store'
import Backdrop from '../_shared/Backdrop'
import TicketsForm from '../forms/TicketForm'
import validateTicketForm from '@/lib/validations/ticket'
import extractErrorMessage from '@/lib/utils/extractErrorMessage'
import { updateTicket } from '@/lib/actions/ticket/updateTicket'
import { createTicket } from '@/lib/actions/ticket/createTicket'
import { useRouter } from 'next/navigation'
import { setCloseTicketDrawer } from '@/lib/store/slices/ticketSlice'
import Drawer from '../_shared/Drawer'

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
      sortOrder: inputs.sortOrder,
      ticketType: inputs.ticketType,
      sponsorImpact: inputs.sponsorImpact,
      sponsorPerks: inputs.sponsorPerks,
      guestCount: inputs.guestCount,
      isPublished: inputs.isPublished
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
            ? `${inputs?.name} has been updated successfully.`
            : inputs?.isPublished
              ? `${inputs?.name} is live and ready for purchase.`
              : `${inputs?.name} has been created but is not yet available for purchase.`
        })
      )
    } catch (error) {
      const errorMessage = extractErrorMessage(error)

      dispatch(
        showToast({
          type: 'error',
          message: inputs?.isUpdating ? 'Failed to Update Ticket' : 'Failed to Create Ticket',
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
          <Drawer className="max-w-7xl">
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
