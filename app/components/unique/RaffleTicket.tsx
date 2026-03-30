'use client'

import { QRCodeSVG } from 'qrcode.react'
import { Printer } from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type RaffleTicketItem = {
  raffleTicketNumber: number
  raffleTicketCode: string
}

type RaffleTicketProps = {
  order: {
    id: string
    customerName: string
    customerEmail: string
    paidAt: Date | string
  }
  event: {
    title: string
    subtitle?: string | null
    org: string
    date: Date | string
    location: string
    address?: string | null
    raffleTotalTickets?: number | null
    raffleTerms?: string | null
  }
  items: RaffleTicketItem[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(value: Date | string): string {
  return new Date(value).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatTime(value: Date | string): string {
  return new Date(value).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

function padTicketNumber(n: number): string {
  return String(n).padStart(4, '0')
}

// ---------------------------------------------------------------------------
// Single ticket
// ---------------------------------------------------------------------------

function Ticket({
  item,
  order,
  event
}: {
  item: RaffleTicketItem
  order: RaffleTicketProps['order']
  event: RaffleTicketProps['event']
}) {
  const terms =
    event.raffleTerms ?? 'Must be present at time of draw to claim prize. Show this ticket at the door. 21+ event.'

  return (
    <div className="flex border-2 border-red-700 rounded-lg overflow-visible bg-white shadow-sm print:shadow-none print:break-inside-avoid">
      {/* ── Main body ──────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-tl-lg
            [print-color-adjust:exact] [-webkit-print-color-adjust:exact]"
          style={{ background: 'linear-gradient(135deg, #991b1b 0%, #dc2626 50%, #991b1b 100%)' }}
        >
          <div className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-white/20">
            <svg viewBox="0 0 36 36" fill="none" width={32} height={32}>
              <text
                x="18"
                y="24"
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill="white"
                fontFamily="sans-serif"
              >
                BGC
              </text>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-medium tracking-[0.12em] uppercase text-white/65 leading-none mb-0.5">
              {event.org}
            </p>
            {event.subtitle && (
              <p className="text-[11px] italic text-amber-300 font-semibold leading-none mb-0.5">{event.subtitle}</p>
            )}
            <p className="text-[15px] font-black text-white leading-tight tracking-wide truncate">{event.title}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[9px] text-white/65 uppercase tracking-widest leading-none">Admit One</p>
            <p className="text-[11px] font-bold text-amber-300 leading-tight">General Admission</p>
          </div>
        </div>

        {/* Gold stripe */}
        <div
          className="h-0.75 [print-color-adjust:exact] [-webkit-print-color-adjust:exact]"
          style={{ background: 'linear-gradient(90deg, #92400e, #d97706, #fbbf24, #d97706, #92400e)' }}
        />

        {/* Body */}
        <div className="flex items-center gap-5 px-4 py-3">
          {/* QR */}
          <div className="shrink-0 border border-amber-200 rounded p-1.5 bg-white leading-none">
            <QRCodeSVG value={item.raffleTicketCode} size={64} bgColor="transparent" fgColor="#991b1b" level="M" />
          </div>

          {/* Fields */}
          <div className="flex-1 min-w-0 grid grid-cols-2 gap-x-5 gap-y-2.5">
            <div className="col-span-2 flex flex-col gap-0.5">
              <span className="text-[9px] font-semibold tracking-widest uppercase text-gray-400">Ticket holder</span>
              <span className="text-[15px] font-bold text-gray-900 leading-tight">{order.customerName}</span>
              <span className="text-[11px] text-gray-400">{order.customerEmail}</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-semibold tracking-widest uppercase text-gray-400">Date</span>
              <span className="text-[12px] font-semibold text-gray-800">{formatDate(event.date)}</span>
              <span className="text-[11px] text-gray-500">{formatTime(event.date)}</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-semibold tracking-widest uppercase text-gray-400">Venue</span>
              <span className="text-[12px] font-semibold text-gray-800">{event.location}</span>
              {event.address && <span className="text-[11px] text-gray-500">{event.address}</span>}
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="mx-4 border-t border-dashed border-red-200 py-2">
          <p className="text-[9px] text-gray-400 leading-relaxed">{terms}</p>
        </div>
      </div>

      {/* ── Tear stub ──────────────────────────────────────────────────── */}
      <div
        className="
          relative w-27 shrink-0 rounded-r-lg
          flex flex-col items-center justify-center gap-2.5 px-2.5 py-4
          border-l-2 border-dashed border-red-600
          [print-color-adjust:exact] [-webkit-print-color-adjust:exact]
          before:content-[''] before:absolute before:-top-2.25 before:-left-2.25
          before:w-4 before:h-4 before:rounded-full
          before:bg-slate-100 before:border-2 before:border-red-600
          after:content-[''] after:absolute after:-bottom-2.25 after:-left-2.25
          after:w-4 after:h-4 after:rounded-full
          after:bg-slate-100 after:border-2 after:border-red-600
        "
        style={{ background: '#fff9f0' }}
      >
        <span className="text-[9px] font-semibold tracking-widest uppercase text-gray-400 text-center">Ticket</span>

        <span
          className="text-[34px] font-black leading-none tabular-nums text-red-700"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {padTicketNumber(item.raffleTicketNumber)}
        </span>

        {event.raffleTotalTickets && (
          <span className="text-[9px] text-gray-400 text-center">of {event.raffleTotalTickets}</span>
        )}

        <div className="w-full border-t border-dashed border-red-200 my-0.5" />

        <span className="text-[8px] font-semibold tracking-[0.08em] uppercase text-red-700 text-center leading-tight">
          {event.title}
        </span>

        <span className="font-mono text-[9px] text-red-400 tracking-[0.03em] text-center">{item.raffleTicketCode}</span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function RaffleTicket({ order, event, items }: RaffleTicketProps) {
  return (
    <div className="max-w-180 mx-auto px-6 py-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-6 print:hidden">
        <span className="text-[13px] text-gray-500">
          {items.length} {items.length === 1 ? 'ticket' : 'tickets'} · Order {order.id}
        </span>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 bg-red-700 hover:bg-red-800
            transition-colors text-white text-[13px] font-medium px-4 py-2 rounded-md cursor-pointer"
        >
          <Printer size={14} />
          Print tickets
        </button>
      </div>

      {/* Ticket stack */}
      <div className="flex flex-col gap-6 print:gap-8">
        {items.map((item) => (
          <Ticket key={item.raffleTicketCode} item={item} order={order} event={event} />
        ))}
      </div>

      {/* Print note */}
      <p className="text-xs text-gray-400 leading-relaxed mt-5 pt-4 border-t border-gray-200 print:hidden">
        Please print and bring your ticket(s) to the event.{' '}
        <strong className="text-gray-500">Show your ticket at the door.</strong> Keep the stub after it is collected.
        Ticket number(s): {items.map((i) => padTicketNumber(i.raffleTicketNumber)).join(', ')}.
      </p>
    </div>
  )
}

// --------------- USAGE
{
  /* <RaffleTicket
  order={{
    id: order.id,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    paidAt: order.paidAt!,
  }}
  event={{
    title: event.title,
    subtitle: event.subtitle,
    org: "Boys & Girls Club of Lynn",
    date: event.date,
    location: event.location,
    address: event.address,
    raffleTotalTickets: event.raffleTotalTickets,
    raffleTerms: event.raffleTerms,
  }}
  items={order.orderItems.map((i) => ({
    raffleTicketNumber: i.raffleTicketNumber!,
    raffleTicketCode: i.raffleTicketCode!,
  }))}
/> */
}
