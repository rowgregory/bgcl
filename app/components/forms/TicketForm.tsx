import { ChangeEvent, FC, useState } from 'react'
import { motion } from 'framer-motion'
import { IForm } from '@/types/common'
import { TicketTemplates } from '../ticket/TicketTemplates'
import { ticketTemplates } from '@/app/lib/constants/ticket.constants'
import { CreatedTicketsList } from '../ticket/CreatedTicketsList'
import { Info, Plus, Save, Trash2, X } from 'lucide-react'
import { store } from '@/app/lib/store/store'
import { setInputs } from '@/app/lib/store/slices/formSlice'
import { deleteTicket } from '@/app/lib/actions/deleteTicket'
import { useRouter } from 'next/navigation'
import { initialTicketFormState } from '@/app/lib/initial-states/ticket'

const InputStyles = `w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors`

const TicketForm: FC<IForm> = ({ errors, handleInput, handleSubmit, inputs, isLoading, onClose, isUpdating }) => {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSelectTemplate = (templateData: (typeof ticketTemplates)[0]['data']) => {
    // Prefill all form fields
    Object.entries(templateData).forEach(([key, value]) => {
      handleInput({
        target: { name: key, value }
      } as ChangeEvent<HTMLInputElement>)
    })
  }

  async function handleDelete() {
    setIsDeleting(true)
    const result = await deleteTicket(inputs.id as string)
    if (result.success) {
      router.refresh()
      onClose()
    }
    setIsDeleting(false)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <motion.div
        className="flex items-start justify-between px-8 py-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black dark:text-white text-neutral-900">
            {isUpdating ? 'Edit Ticket' : 'Create Ticket'}
          </h1>
          <div className="flex items-center gap-3">
            <p className="dark:text-neutral-400 text-neutral-600">Configure your ticket details</p>
            {inputs?.tickets && inputs?.tickets?.length > 0 && (
              <>
                <span className="text-neutral-300 dark:text-neutral-600">·</span>
                <span className="text-sm dark:text-neutral-400 text-neutral-500">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {inputs?.tickets?.filter((t) => t.isAvailable)?.length}
                  </span>{' '}
                  of <span className="font-semibold dark:text-white text-neutral-900">{inputs?.tickets?.length}</span>{' '}
                  tickets live
                </span>
                <span className="text-neutral-300 dark:text-neutral-600">·</span>
                <span className="text-sm dark:text-neutral-400 text-neutral-500">
                  <span className="font-semibold dark:text-white text-neutral-900">
                    {inputs?.tickets
                      ?.reduce((sum, t) => sum + (t.guestCount ?? 1) * (t.totalQuantity ?? 0), 0)
                      .toLocaleString()}
                  </span>{' '}
                  total guests
                </span>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-lg text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all mt-1"
        >
          <X size={20} />
        </button>
      </motion.div>

      {/* Form Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Created Tickets -- Desktop */}
        <div className="hidden lg:block lg:shrink-0">
          {inputs.tickets?.length > 0 && <CreatedTicketsList inputs={inputs} onSelectTicket={handleSelectTemplate} />}
        </div>

        {/* Ticket Templates -- Desktop */}
        <div className="hidden lg:block lg:shrink-0">
          <TicketTemplates onSelectTemplate={handleSelectTemplate} />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full w-full">
          {/* Created Tickets -- Mobile */}
          <div className="block shrink-0 lg:hidden">
            {inputs.tickets?.length > 0 && <CreatedTicketsList inputs={inputs} onSelectTicket={handleSelectTemplate} />}
          </div>
          {/* Ticket Templates -- Mobile */}
          <div className="block shrink-0 lg:hidden">
            <TicketTemplates onSelectTemplate={handleSelectTemplate} />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto p-8">
              {/* Ticket Details Form */}
              <div className="mb-8">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">
                  {isUpdating ? 'Edit Ticket' : 'Add New Ticket'}
                </h3>

                <div className="space-y-4">
                  {/* Ticket Type */}
                  <div>
                    <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                      Ticket Type
                    </label>
                    <select
                      name="ticketType"
                      value={(inputs?.ticketType as string) || 'GENERAL'}
                      onChange={handleInput}
                      className={InputStyles}
                    >
                      <option value="GENERAL">General</option>
                      <option value="RAFFLE">Raffle</option>
                      <option value="TOURNAMENT">Tournament</option>
                      <option value="SPONSORSHIP">Sponsorship</option>
                    </select>
                    <p className="mt-2 text-xs text-neutral-500">
                      {inputs?.ticketType === 'RAFFLE' &&
                        'Buyers are automatically assigned a unique ticket number at purchase'}
                      {inputs?.ticketType === 'TOURNAMENT' &&
                        'Reserves a spot in the tournament — quantity controls the participant cap'}
                      {inputs?.ticketType === 'SPONSORSHIP' &&
                        'Unlocks sponsor impact and perks fields — ideal for tiered event sponsorships'}
                      {inputs?.ticketType === 'GENERAL' &&
                        'Standard admission ticket with no special assignment or perks'}
                    </p>
                    {errors?.ticketType && <p className="mt-2 text-sm text-red-400">{errors.ticketType}</p>}
                  </div>

                  {/* Ticket Name */}
                  <div>
                    <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                      Ticket Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={(inputs?.name as string) || ''}
                      onChange={handleInput}
                      placeholder="e.g., General Admission, VIP, Early Bird"
                      className={InputStyles}
                    />
                    {errors?.name && <p className="mt-2 text-sm text-red-400">{errors.name}</p>}
                  </div>

                  {/* Sponsorship Fields */}
                  {inputs?.ticketType === 'SPONSORSHIP' ? (
                    <div className="space-y-4 border border-amber-200 dark:border-amber-500/20 rounded-lg p-4 bg-amber-50/50 dark:bg-amber-500/5">
                      <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                        Sponsorship Details
                      </p>

                      <div>
                        <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                          Sponsor Impact
                        </label>
                        <textarea
                          name="sponsorImpact"
                          value={(inputs?.sponsorImpact as string) || ''}
                          onChange={handleInput}
                          rows={2}
                          placeholder="e.g. Covers 10 campers for the week to enjoy boating, fishing, swimming..."
                          className={InputStyles}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                          Event Perks
                        </label>
                        <div className="space-y-2">
                          {((inputs?.sponsorPerks as string[]) || []).map((perk, index) => (
                            <div key={index} className="flex gap-2 items-center">
                              <input
                                type="text"
                                value={perk}
                                onChange={(e) => {
                                  const updated = [...((inputs?.sponsorPerks as string[]) || [])]
                                  updated[index] = e.target.value
                                  store.dispatch(setInputs({ formName: 'ticketForm', data: { sponsorPerks: updated } }))
                                }}
                                placeholder="e.g. Company logo on play money"
                                className={InputStyles}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = ((inputs?.sponsorPerks as string[]) || []).filter(
                                    (_, i) => i !== index
                                  )
                                  store.dispatch(setInputs({ formName: 'ticketForm', data: { sponsorPerks: updated } }))
                                }}
                                className="text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors shrink-0"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const current = (inputs?.sponsorPerks as string[]) || []
                              store.dispatch(
                                setInputs({ formName: 'ticketForm', data: { sponsorPerks: [...current, ''] } })
                              )
                            }}
                            className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors pt-1"
                          >
                            <Plus size={14} />
                            Add perk
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={(inputs?.description as string) || ''}
                        onChange={handleInput}
                        rows={3}
                        placeholder="Describe what's included with this ticket"
                        className={InputStyles}
                      />
                      {errors?.description && <p className="mt-2 text-sm text-red-400">{errors.description}</p>}
                    </div>
                  )}

                  {/* Price and Quantity */}
                  <div>
                    <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={(inputs?.price as number) || ''}
                      onChange={handleInput}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className={InputStyles}
                    />
                    {errors?.price && <p className="mt-2 text-sm text-red-400">{errors.price}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                      Guest Count
                    </label>
                    <input
                      type="number"
                      name="guestCount"
                      value={(inputs?.guestCount as number) || ''}
                      onChange={handleInput}
                      min="1"
                      placeholder="1"
                      className={InputStyles}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                      Total Quantity *
                    </label>
                    {isUpdating && (
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">Sold:</span>
                          <span className="text-xs font-semibold text-neutral-900 dark:text-white tabular-nums">
                            {(inputs?.quantitySold as number) || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">Remaining:</span>
                          <span className="text-xs font-semibold text-neutral-900 dark:text-white tabular-nums">
                            {((inputs?.totalQuantity as number) || 0) - ((inputs?.quantitySold as number) || 0)}
                          </span>
                        </div>
                      </div>
                    )}
                    <input
                      type="number"
                      name="totalQuantity"
                      value={(inputs?.totalQuantity as number) || ''}
                      onChange={handleInput}
                      min={isUpdating ? (inputs?.quantitySold as number) || 0 : 1}
                      placeholder="100"
                      className={InputStyles}
                    />
                    {isUpdating && (inputs?.quantitySold as number) > 0 && (
                      <p className="mt-2 text-xs text-neutral-500">
                        {inputs?.quantitySold as number} ticket{(inputs?.quantitySold as number) === 1 ? '' : 's'}{' '}
                        already sold — total quantity cannot go below this
                      </p>
                    )}
                    {errors?.totalQuantity && <p className="mt-2 text-sm text-red-400">{errors.totalQuantity}</p>}
                  </div>

                  {/* Availability Info */}
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700 rounded-lg space-y-2">
                    <div className="flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-sky-500 dark:text-sky-400 shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-semibold dark:text-white text-neutral-900 mb-1">
                          Tickets are always public
                        </p>
                        <p className="text-xs dark:text-neutral-400 text-neutral-500 leading-relaxed">
                          Tickets are visible on the public event page at all times, encouraging attendees to add them
                          to their cart before the purchase window opens. Payment will be gated until the{' '}
                          <span className="font-medium dark:text-neutral-300 text-neutral-700">
                            Ticket Sales Start Date
                          </span>{' '}
                          is reached.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sort Order */}
                  <div>
                    <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      name="sortOrder"
                      value={(inputs?.sortOrder as number) || 0}
                      onChange={handleInput}
                      min="0"
                      placeholder="0"
                      className={InputStyles}
                    />
                    <p className="mt-2 text-xs text-neutral-500">Lower numbers appear first in the ticket list</p>
                    {errors?.sortOrder && <p className="mt-2 text-sm text-red-400">{errors.sortOrder}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Clear Template */}
          {inputs?.name && (
            <div className="shrink-0 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-8 py-4">
              <div className="max-w-2xl mx-auto flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium dark:text-neutral-300 text-neutral-700">
                    {inputs?.name} Template Applied
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Clear to reset all fields back to defaults
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    Object.entries(initialTicketFormState).forEach(([key, value]) => {
                      handleInput({
                        target: { name: key, value }
                      } as ChangeEvent<HTMLInputElement>)
                    })
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 rounded-lg transition-all shrink-0 ml-8"
                >
                  <X size={14} />
                  Clear Template
                </button>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          {isUpdating && (
            <div className="shrink-0 border-t border-red-200 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/5 px-8 py-5">
              <div className="max-w-2xl mx-auto flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-red-600 dark:text-red-400">Delete Ticket</p>
                  <p className="text-xs text-red-400 dark:text-red-500 mt-0.5">
                    This action cannot be undone. All associated order items will be affected.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-red-500 dark:text-red-400 hover:text-white hover:bg-red-500 dark:hover:bg-red-500 border border-red-300 dark:border-red-500/40 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 ml-8"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Ticket
                </button>
              </div>
            </div>
          )}

          {/* Fixed Footer with Submit Button */}
          <div className="shrink-0 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-8 py-5">
            <div className="max-w-2xl mx-auto flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-medium text-neutral-500 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-10 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-sky-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sky-500/50"
              >
                <Save className="w-4 h-4" />
                {isLoading ? 'Saving...' : isUpdating ? 'Update Ticket' : 'Create Ticket'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TicketForm
