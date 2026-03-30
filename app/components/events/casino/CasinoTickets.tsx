import { useUiSelector } from '@/app/lib/store/store'
import { CasinoTicketCard } from './CasinoTicketCard'
import { SectionHeading } from './CasinoUiElements'

export function CasinoTickets({ tickets, data }) {
  const { soundOn } = useUiSelector()

  return (
    <section aria-labelledby="tickets-heading">
      <SectionHeading suit="♠" id="tickets-heading">
        Get Your Tickets
      </SectionHeading>
      <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
        {tickets.map((ticket: any) => (
          <CasinoTicketCard
            key={ticket.id}
            ticket={{
              ...ticket,
              eventId: data.id,
              eventTitle: data.title,
              ticketSalesStartDate: data.ticketSalesStartDate,
              ticketSalesEndDate: data.ticketSalesEndDate,
              registrationDeadline: data.registrationDeadline
            }}
            soundOn={soundOn}
          />
        ))}
      </div>
    </section>
  )
}
