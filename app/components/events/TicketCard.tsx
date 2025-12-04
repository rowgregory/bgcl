import getTicketStatus from '@/app/lib/utils/events/getTicketStatus'
import isTicketAvailable from '@/app/lib/utils/events/isTicketAvailable'
import { Ticket } from '@prisma/client'

interface TicketCardProps {
  ticket: Ticket
}

const TicketCard = ({ ticket }: TicketCardProps) => {
  const status = getTicketStatus(ticket)
  const canPurchase = isTicketAvailable(ticket)

  return (
    <div
      className={`
      p-6 rounded-lg border transition-all
      ${
        canPurchase
          ? 'bg-white border-gray-200 hover:border-indigo-500 hover:shadow-lg cursor-pointer'
          : 'bg-gray-50 border-gray-200 opacity-75 cursor-not-allowed'
      }
    `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{ticket.name}</h3>
          {ticket.description && <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>}
          <p className="text-2xl font-bold text-gray-900 mt-3">${ticket.price}</p>

          {/* Availability info */}
          <div className="mt-3 text-sm">
            {!canPurchase ? (
              <div className="flex items-center gap-2">
                {status.message === 'Sold out' && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full font-medium">Sold Out</span>
                )}
                {status.message.includes('Sales start') && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                    Coming Soon: {ticket.salesStartDate?.toLocaleDateString()}
                  </span>
                )}
                {status.message === 'Sales ended' && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">Sales Ended</span>
                )}
                {status.message === 'Not available' && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">Not Available</span>
                )}
              </div>
            ) : (
              <span className="text-green-600 font-medium">✓ Available</span>
            )}

            {/* Show remaining quantity */}
            {canPurchase && (
              <p className="text-gray-500 mt-1">{ticket.totalQuantity - ticket.quantitySold} remaining</p>
            )}
          </div>
        </div>
      </div>

      {/* Purchase button */}
      <button
        disabled={!canPurchase}
        // onClick={() => canPurchase && handlePurchase(ticket.id)}
        className={`
          w-full mt-4 py-3 rounded-lg font-medium transition-all
          ${
            canPurchase
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        {canPurchase ? 'Select Ticket' : status.message}
      </button>
    </div>
  )
}

export default TicketCard
