import { ChangeEvent, FC } from 'react'
import { IForm } from '@/types/common'
import EventTicketList from './EventTicketList'
import { Ticket } from '@prisma/client'
import CloseDrawerButton from '../../common/CloseDrawerButton'

const EventTicketForm: FC<IForm> = ({
  errors,
  handleInput,
  handleSubmit,
  handleToggle,
  inputs,
  isLoading,
  onClose,
  isUpdating
}) => {
  const tickets = (inputs?.tickets as Ticket[]) || []

  const handleSelectTicket = (ticket: Ticket) => {
    // Prefill all form fields
    Object.entries(ticket).forEach(([key, value]) => {
      handleInput({
        target: { name: key, value }
      } as ChangeEvent<HTMLInputElement>)
    })
  }

  return (
    <div className="flex flex-col h-full bg-neutral-900">
      {/* Top Bar */}
      <div className="bg-neutral-800 border-b border-neutral-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-sm">Event Ticket Settings</h3>
            <p className="text-neutral-400 text-xs mt-0.5">Manage all ticket options for {inputs.title as string}</p>
          </div>

          {/* Close Button */}
          <CloseDrawerButton onClose={onClose} />
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 flex overflow-hidden">
        <EventTicketList tickets={tickets} onSelectTicket={handleSelectTicket} />

        <form onSubmit={handleSubmit} className="flex flex-col h-full w-full">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto bg-neutral-900">
            <div className="max-w-5xl mx-auto p-8">
              {/* Ticket Details Form */}
              <div className="mb-8">
                <h4 className="text-base font-semibold text-white mb-4">
                  {isUpdating ? 'Edit Ticket' : 'Add New Ticket'}
                </h4>

                <div className="space-y-6">
                  {/* Ticket Name */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Ticket Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={(inputs?.name as string) || ''}
                      onChange={handleInput}
                      placeholder="e.g., General Admission, VIP, Early Bird"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    {errors?.name && <p className="mt-2 text-sm text-red-400">{errors.name}</p>}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={(inputs?.description as string) || ''}
                      onChange={handleInput}
                      rows={3}
                      placeholder="Describe what's included with this ticket"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                    />
                    {errors?.description && <p className="mt-2 text-sm text-red-400">{errors.description}</p>}
                  </div>

                  {/* Price and Quantity */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Price ($) *</label>
                      <input
                        type="number"
                        name="price"
                        value={(inputs?.price as number) || ''}
                        onChange={handleInput}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                      {errors?.price && <p className="mt-2 text-sm text-red-400">{errors.price}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Total Quantity *</label>
                      <input
                        type="number"
                        name="totalQuantity"
                        value={(inputs?.totalQuantity as number) || ''}
                        onChange={handleInput}
                        min="1"
                        placeholder="100"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                      {errors?.totalQuantity && <p className="mt-2 text-sm text-red-400">{errors.totalQuantity}</p>}
                    </div>
                  </div>

                  {/* Min/Max Per Order */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Min Per Order</label>
                      <input
                        type="number"
                        name="minPerOrder"
                        value={(inputs?.minPerOrder as number) || ''}
                        onChange={handleInput}
                        min="1"
                        placeholder="1"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                      {errors?.minPerOrder && <p className="mt-2 text-sm text-red-400">{errors.minPerOrder}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Max Per Order</label>
                      <input
                        type="number"
                        name="maxPerOrder"
                        value={(inputs?.maxPerOrder as number) || ''}
                        onChange={handleInput}
                        min="1"
                        placeholder="Unlimited"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                      {errors?.maxPerOrder && <p className="mt-2 text-sm text-red-400">{errors.maxPerOrder}</p>}
                    </div>
                  </div>

                  {/* Sales Period */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Sales Start Date</label>
                      <input
                        type="datetime-local"
                        name="salesStartDate"
                        value={
                          inputs?.salesStartDate instanceof Date
                            ? inputs.salesStartDate.toISOString().slice(0, 16)
                            : (inputs?.salesStartDate as string) || ''
                        }
                        onChange={handleInput}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                      {errors?.salesStartDate && <p className="mt-2 text-sm text-red-400">{errors.salesStartDate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Sales End Date</label>
                      <input
                        type="datetime-local"
                        name="salesEndDate"
                        value={
                          inputs?.salesEndDate instanceof Date
                            ? inputs.salesEndDate.toISOString().slice(0, 16)
                            : (inputs?.salesEndDate as string) || ''
                        }
                        onChange={handleInput}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                      {errors?.salesEndDate && <p className="mt-2 text-sm text-red-400">{errors.salesEndDate}</p>}
                    </div>
                  </div>

                  {/* Additional Options */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-neutral-800 border border-neutral-700 rounded-lg">
                      <div>
                        <label className="text-sm font-medium text-neutral-300">Ticket Available</label>
                        <p className="text-xs text-neutral-500 mt-1">Allow customers to purchase this ticket</p>
                      </div>
                      <input
                        type="checkbox"
                        name="isAvailable"
                        checked={(inputs?.isAvailable as boolean) ?? true}
                        onChange={handleToggle}
                        className="w-5 h-5 rounded border-neutral-600 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-neutral-800 border border-neutral-700 rounded-lg">
                      <div>
                        <label className="text-sm font-medium text-neutral-300">Requires Approval</label>
                        <p className="text-xs text-neutral-500 mt-1">Admin must approve purchases of this ticket</p>
                      </div>
                      <input
                        type="checkbox"
                        name="requiresApproval"
                        checked={(inputs?.requiresApproval as boolean) ?? false}
                        onChange={handleToggle}
                        className="w-5 h-5 rounded border-neutral-600 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                      />
                    </div>
                  </div>

                  {/* Sort Order */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Display Order</label>
                    <input
                      type="number"
                      name="sortOrder"
                      value={(inputs?.sortOrder as number) || 0}
                      onChange={handleInput}
                      min="0"
                      placeholder="0"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    <p className="mt-2 text-xs text-neutral-500">Lower numbers appear first in the ticket list</p>
                    {errors?.sortOrder && <p className="mt-2 text-sm text-red-400">{errors.sortOrder}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="shrink-0 border-t border-neutral-700 bg-neutral-800 px-8 py-4">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-medium text-neutral-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-neutral-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : isUpdating ? 'Update Ticket' : 'Add Ticket'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventTicketForm
