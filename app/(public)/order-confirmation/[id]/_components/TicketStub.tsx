import { Calendar, MapPin } from 'lucide-react'
import { formatTicketDate } from '../_formatters'

interface TicketStubProps {
  item: any
  event: any
  orderId: string
  showRaffleNumbers: boolean
}

export const TicketStub = ({ item, event, orderId, showRaffleNumbers }: TicketStubProps) => {
  const isRaffle = Boolean(item.raffleTicketNumber)

  return (
    <div
      className="rounded-xl overflow-hidden border dark:border-neutral-700 border-neutral-200"
      style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}
    >
      {/* Header band */}
      <div className="px-4 py-3 bg-linear-to-r from-sky-600 to-sky-500 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/70">
            Boys &amp; Girls Club of Lynn
          </p>
          <p className="text-sm font-black text-white truncate leading-tight">{item.ticketName}</p>
        </div>
        {isRaffle && (
          <span className="shrink-0 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-white/20 text-white">
            Raffle
          </span>
        )}
      </div>

      {/* Accent stripe */}
      <div className="h-0.5 bg-linear-to-r from-transparent via-amber-400 to-transparent" aria-hidden="true" />

      {/* Body */}
      <div className="px-4 py-3 dark:bg-neutral-900 bg-white space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs dark:text-neutral-400 text-neutral-500">
            <Calendar className="w-3.5 h-3.5 shrink-0 text-sky-500" aria-hidden="true" />
            {event?.date ? formatTicketDate(event.date) : null}
          </div>
          <p className="text-sm font-black dark:text-white text-neutral-900 tabular-nums">
            ${item.totalPrice.toFixed(2)}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs dark:text-neutral-400 text-neutral-500">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-sky-500" aria-hidden="true" />
          {event?.location}
        </div>
      </div>

      {/* Tear line */}
      <div className="relative flex items-center dark:bg-neutral-900 bg-white" aria-hidden="true">
        <div className="absolute -left-2.5 w-5 h-5 rounded-full dark:bg-neutral-950 bg-neutral-50 border dark:border-neutral-700 border-neutral-200 z-10" />
        <div className="flex-1 border-t-2 border-dashed dark:border-neutral-700 border-neutral-200 mx-4" />
        <span className="text-[10px] dark:text-neutral-600 text-neutral-300 px-1 select-none rotate-90">✂</span>
        <div className="flex-1 border-t-2 border-dashed dark:border-neutral-700 border-neutral-200 mx-4" />
        <div className="absolute -right-2.5 w-5 h-5 rounded-full dark:bg-neutral-950 bg-neutral-50 border dark:border-neutral-700 border-neutral-200 z-10" />
      </div>

      {/* Stub */}
      {showRaffleNumbers && (
        <div className="px-4 py-3 dark:bg-neutral-800/60 bg-neutral-50 flex items-center justify-between gap-3">
          {isRaffle ? (
            <>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest dark:text-neutral-500 text-neutral-400">
                  Ticket No.
                </p>
                <p className="text-2xl font-black tabular-nums dark:text-sky-400 text-sky-600 leading-none mt-0.5">
                  {String(item.raffleTicketNumber).padStart(4, '0')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest dark:text-neutral-500 text-neutral-400">
                  Code
                </p>
                <p className="font-mono text-xs dark:text-neutral-300 text-neutral-600 mt-0.5">
                  {item.raffleTicketCode}
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between w-full">
              <p className="text-xs dark:text-neutral-400 text-neutral-500">
                {item.quantity} × ${item.pricePerUnit.toFixed(2)}
              </p>
              <p className="text-xs font-mono dark:text-neutral-400 text-neutral-500">
                {orderId.slice(-8).toUpperCase()}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
