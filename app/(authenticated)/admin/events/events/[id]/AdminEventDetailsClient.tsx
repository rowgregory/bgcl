'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { LocalTicket, SerializedEvent } from '@/types/event.types'
import { updateEvent } from '@/lib/actions/event/updateEvent'
import { createTicket } from '@/lib/actions/ticket/createTicket'
import { updateTicket } from '@/lib/actions/ticket/updateTicket'
import { deleteTicket } from '@/lib/actions/ticket/deleteTicket'
import { createEvent } from '@/lib/actions/event/createEvent'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { EventFormInput, EventFormValues, eventSchema } from '@/lib/validations/event.validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { RightPanelTicket } from './_components/RightPanelTicket'
import { TopBar } from './_components/TopBar'
import { LeftSidebar } from './_components/LeftSidebar'
import { EventDetails } from './_components/EventDetails'
import { Scheduling } from './_components/Scheduling'
import { Location } from './_components/Location'
import { Capacity } from './_components/Capacity'
import { DressCode } from './_components/DressCode'
import { Raffle } from './_components/Raffle'
import { toFormValues } from './_utils/toFormValues'

interface Props {
  event: SerializedEvent | null
  isNew: boolean
}

export function AdminEventDetailsClient({ event, isNew }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showTemplates, setShowTemplates] = useState(isNew)
  const [mobilePanel, setMobilePanel] = useState<'settings' | 'tickets' | null>(null)

  const methods = useForm<EventFormInput, unknown, EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: toFormValues(event),
    mode: 'onTouched'
  })

  const {
    handleSubmit,
    control,
    reset,
    register,
    formState: { errors }
  } = methods

  // The three JSON arrays are now field arrays rather than separate useState
  const dressCodeArray = useFieldArray({ control, name: 'dressCodeItems' })
  const rafflePrizeArray = useFieldArray({ control, name: 'rafflePrizes' })
  const raffleScheduleArray = useFieldArray({ control, name: 'raffleSchedule' })

  const watchedTitle = methods.watch('title')
  const watchedStatus = methods.watch('status')
  const watchedCapacity = methods.watch('capacity')
  const watchedIsRaffle = methods.watch('isRaffle')

  /** Applies a preset over the current values. */
  const handleSelectTemplate = (templateData: Partial<EventFormInput>) => {
    reset((current) => ({ ...current, ...templateData }))
    setShowTemplates(false)
  }

  // ── Tickets — local state, saved in their own loop after the event ──────────
  const [tickets, setTickets] = useState<LocalTicket[]>(
    (event?.tickets ?? []).map((t) => ({ ...t, _isNew: false, _isDirty: false, _expanded: false }))
  )

  /** Saves tickets after the event exists; returns an error message or null. */
  const saveTickets = async (eventId: string): Promise<string | null> => {
    for (const ticket of tickets) {
      if (!ticket._isDirty) continue

      const ticketPayload = {
        name: ticket.name ?? '',
        description: ticket.description ?? null,
        price: Number(ticket.price ?? 0),
        totalQuantity: Number(ticket.totalQuantity ?? 0),
        sortOrder: Number(ticket.sortOrder ?? 0),
        ticketType: ticket.ticketType ?? 'GENERAL',
        isRaffleTicket: ticket.isRaffleTicket ?? false,
        sponsorImpact: ticket.sponsorImpact ?? null,
        sponsorPerks: ticket.sponsorPerks ?? [],
        guestCount: Number(ticket.guestCount ?? 1),
        isPublished: ticket.isPublished ?? false
      }

      const result = ticket._isNew
        ? await createTicket(eventId, ticketPayload)
        : ticket.id
          ? await updateTicket(ticket.id, ticketPayload)
          : null

      if (result && !result.success) {
        return result.error ?? 'Failed to save a ticket'
      }
    }

    // Remove tickets deleted in the editor
    const currentIds = tickets.filter((t) => !t._isNew).map((t) => t.id)
    const originalIds = (event?.tickets ?? []).map((t) => t.id)
    const deletedIds = originalIds.filter((id) => !currentIds.includes(id))

    for (const id of deletedIds) {
      const result = await deleteTicket(id)
      if (!result.success) return result.error ?? 'Failed to delete a ticket'
    }

    return null
  }

  const onSubmit = handleSubmit((values) => {
    setSaveError(null)

    startTransition(async () => {
      try {
        let eventId = event?.id

        if (isNew) {
          const result = await createEvent(values)
          if (!result.success) throw new Error(result.error ?? 'Failed to create event')
          eventId = result.data?.id
        } else {
          const result = await updateEvent(event!.id, values)
          if (!result.success) throw new Error(result.error ?? 'Failed to update event')
        }

        if (eventId) {
          const ticketError = await saveTickets(eventId)
          if (ticketError) throw new Error(ticketError)
        }

        router.push('/admin/events/events')
        router.refresh()
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : 'Something went wrong')
      }
    })
  })

  const totalSold = tickets.reduce((s, t) => s + (t.quantitySold ?? 0), 0)
  const totalCapacity = tickets.reduce((s, t) => s + (t.totalQuantity ?? 0), 0)
  const publishedCount = tickets.filter((t) => t.isPublished).length

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 w-full">
      {/* ── Top Bar ── */}
      <TopBar
        isNew={isNew}
        pending={pending}
        saveError={saveError}
        setShowTemplates={setShowTemplates}
        watchedStatus={watchedStatus}
        watchedTitle={watchedTitle}
      />

      {/* Mobile panel switcher — hidden on desktop */}
      <div className="lg:hidden sticky top-14.25 z-30 flex border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <button
          type="button"
          onClick={() => setMobilePanel(mobilePanel === 'settings' ? null : 'settings')}
          aria-expanded={mobilePanel === 'settings'}
          className="flex-1 py-2.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400"
        >
          Settings
        </button>
        <button
          type="button"
          onClick={() => setMobilePanel(mobilePanel === 'tickets' ? null : 'tickets')}
          aria-expanded={mobilePanel === 'tickets'}
          className="flex-1 py-2.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 border-l border-neutral-200 dark:border-neutral-800"
        >
          Tickets ({tickets.length})
        </button>
      </div>

      <FormProvider {...methods}>
        {/* ── Main Layout ── */}
        <form
          id="event-form"
          onSubmit={onSubmit}
          noValidate
          className="flex flex-col lg:flex-row h-[calc(100vh-57px)] lg:h-[calc(100vh-57px)]"
        >
          <div
            className={`
              ${mobilePanel === 'settings' ? 'flex' : 'hidden'} lg:flex
              flex-col h-full overflow-y-auto
              border-b lg:border-b-0 lg:border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900
            `}
          >
            {/* ── Left Sidebar ── */}
            <LeftSidebar
              handleSelectTemplate={handleSelectTemplate}
              showTemplates={showTemplates}
              control={control}
              event={event}
              isNew={isNew}
              publishedCount={publishedCount}
              tickets={tickets}
              totalCapacity={totalCapacity}
              totalSold={totalSold}
              watchedCapacity={watchedCapacity}
            />
          </div>

          {/* ── Main: Form ── */}
          <main className="flex-1 lg:overflow-y-auto">
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* ── Event Details ── */}
              <EventDetails errors={errors} register={register} />

              {/* ── Scheduling ── */}
              <Scheduling control={control} errors={errors} register={register} />

              {/* ── Location ── */}
              <Location errors={errors} register={register} />

              {/* ── Capacity ── */}
              <Capacity errors={errors} register={register} />

              {/* ── Dress Code ── */}
              <DressCode dressCodeArray={dressCodeArray} register={register} />

              {/* ── Raffle ── */}
              <Raffle
                errors={errors}
                rafflePrizeArray={rafflePrizeArray}
                raffleScheduleArray={raffleScheduleArray}
                register={register}
                watchedIsRaffle={watchedIsRaffle}
              />
            </div>
          </main>
          <div
            className={`
              ${mobilePanel === 'tickets' ? 'flex' : 'hidden'} lg:flex
              flex-col h-full overflow-y-auto
              border-t lg:border-t-0 lg:border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900
            `}
          >
            {/* ── Right Panel: Tickets ── */}
            <RightPanelTicket
              pending={pending}
              publishedCount={publishedCount}
              setTickets={setTickets}
              tickets={tickets}
              totalCapacity={totalCapacity}
              totalSold={totalSold}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
