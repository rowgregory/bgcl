import { Plus, Ticket } from 'lucide-react'
import { TicketRow } from './TicketRow'
import { sectionHeaderCls } from '@/lib/constants/form.constants'

export function RightPanelTicket({ tickets, setTickets, publishedCount, pending, totalCapacity, totalSold, isRaffle }) {
  const addTicket = () => {
    setTickets((prev) => [
      ...prev,
      {
        _tempId: crypto.randomUUID(),
        _isNew: true,
        _isDirty: true,
        _expanded: true,
        name: '',
        price: 0,
        totalQuantity: 100,
        quantitySold: 0,
        quantityReserved: 0,
        sortOrder: prev.length,
        ticketType: 'GENERAL',
        isRaffleTicket: false,
        isPublished: false,
        guestCount: 1,
        sponsorPerks: []
      }
    ])
  }

  const updateTicketLocal = (idx: number, field: string, value: any) => {
    setTickets((prev) => prev.map((t, i) => (i === idx ? { ...t, [field]: value, _isDirty: true } : t)))
  }

  const removeTicket = (idx: number) => {
    setTickets((prev) => prev.filter((_, i) => i !== idx))
  }

  const toggleExpand = (idx: number) => {
    setTickets((prev) => prev.map((t, i) => (i === idx ? { ...t, _expanded: !t._expanded } : t)))
  }
  return (
    <aside className="w-96 shrink-0 flex flex-col overflow-hidden">
      <div className={`${sectionHeaderCls} border-b`}>
        <Ticket className="w-4 h-4 text-sky-600 dark:text-sky-400" aria-hidden="true" />
        <span className="text-sm font-semibold text-neutral-900 dark:text-white flex-1">
          Tickets
          <span className="ml-2 text-xs font-normal text-neutral-400">
            {publishedCount}/{tickets.length} live
          </span>
        </span>
        <button
          type="button"
          onClick={addTicket}
          className="flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" /> Add
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <Ticket className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mb-2" aria-hidden="true" />
            <p className="text-sm text-neutral-400 dark:text-neutral-500">No tickets yet</p>
            <button
              type="button"
              onClick={addTicket}
              className="mt-2 text-xs text-sky-600 dark:text-sky-400 font-medium hover:underline"
            >
              Add your first ticket
            </button>
          </div>
        ) : (
          tickets.map((ticket, idx) => (
            <TicketRow
              key={ticket.id ?? ticket._tempId}
              ticket={ticket}
              onUpdate={(field, value) => updateTicketLocal(idx, field, value)}
              onDelete={() => removeTicket(idx)}
              onToggleExpand={() => toggleExpand(idx)}
              isSaving={pending}
              isRaffle={isRaffle}
            />
          ))
        )}
      </div>

      {/* Ticket footer summary */}
      {tickets.length > 0 && (
        <div className="border-t border-neutral-100 dark:border-neutral-800 px-4 py-3 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-neutral-400">Total capacity</span>
            <span className="font-semibold text-neutral-900 dark:text-white">{totalCapacity}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-neutral-400">Sold</span>
            <span className="font-semibold text-neutral-900 dark:text-white">{totalSold}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-neutral-400">Remaining</span>
            <span className="font-semibold text-green-600 dark:text-green-400">{totalCapacity - totalSold}</span>
          </div>
        </div>
      )}
    </aside>
  )
}
