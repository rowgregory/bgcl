import { FC, memo, useCallback, useMemo } from 'react'
import { IUpcomingEvent } from '@/types/entities/event'
import { motion } from 'framer-motion'
import { useAppDispatch } from '@/app/lib/store/store'
import { setOpenEventDrawer } from '@/app/lib/store/slices/eventSlice'
import { setInputs } from '@/app/lib/store/slices/formSlice'
import { splitUTCToDateTime } from '@/app/lib/utils/date-utils'
import { setOpenTicketDrawer } from '@/app/lib/store/slices/ticketSlice'
import { EditTicketPayload } from '@/types/entities/ticket'
import { CapacityBar } from './upcoming-event/CapacityBar'
import { EventHeader } from './upcoming-event/EventHeader'
import { TicketsSection } from './upcoming-event/TicketsSection'
import { getEventStatusBadge } from '@/app/lib/utils/event-utils'

const UpcomingEvent: FC<IUpcomingEvent> = ({ event, index }) => {
  const dispatch = useAppDispatch()
  const { dateString, timeString } = splitUTCToDateTime(event.date)

  // Memoize computed values
  const progress = useMemo(() => (event.attendeeCount / event.capacity) * 100, [event.attendeeCount, event.capacity])
  const badge = useMemo(() => getEventStatusBadge(event.status), [event.status])
  const hasTickets = useMemo(() => event.tickets && event.tickets.length > 0, [event.tickets])
  const visibleTickets = useMemo(() => event.tickets?.slice(0, 3) || [], [event.tickets])
  const moreTicketsCount = useMemo(() => (event.tickets?.length || 0) - 3, [event.tickets])

  // Memoize callbacks
  const handleEditEvent = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation()
      dispatch(setOpenEventDrawer())
      dispatch(
        setInputs({
          formName: 'eventForm',
          data: { ...event, date: dateString, time: timeString, isUpdating: true }
        })
      )
    },
    [event, dateString, timeString, dispatch]
  )

  const handleCreateTicket = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation()
      dispatch(setOpenTicketDrawer())
      dispatch(
        setInputs({
          formName: 'ticketForm',
          data: { eventId: event.id, title: event.title }
        })
      )
    },
    [event.id, event.title, dispatch]
  )

  const handleEditTicket = useCallback(
    (e: { stopPropagation: () => void }, ticket: EditTicketPayload) => {
      e.stopPropagation()
      dispatch(setOpenTicketDrawer())
      dispatch(
        setInputs({
          formName: 'ticketForm',
          data: { ...ticket, tickets: event.tickets, isUpdating: true }
        })
      )
    },
    [dispatch, event.tickets]
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.1 }}
      className="p-5 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-all border border-zinc-700/50 hover:border-zinc-600"
    >
      {/* Header */}
      <EventHeader
        event={event}
        badge={badge}
        dateString={dateString}
        timeString={timeString}
        onEdit={handleEditEvent}
        onManageTickets={handleCreateTicket}
        hasTickets={hasTickets}
      />

      {/* Capacity Section */}
      <div className="space-y-3 mt-3">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">Capacity</span>
          <span className="font-medium">
            {event.attendeeCount} / {event.maxAttendees} attendees
          </span>
        </div>

        <CapacityBar progress={progress} index={index} />

        {/* Tickets Section */}
        {hasTickets && (
          <TicketsSection
            tickets={visibleTickets}
            moreCount={moreTicketsCount}
            onEditTicket={handleEditTicket}
            index={index}
          />
        )}
      </div>
    </motion.div>
  )
}

export default memo(UpcomingEvent)
