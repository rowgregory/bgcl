import { ChangeEvent, FC } from 'react'
import { motion } from 'framer-motion'
import { IForm } from '@/types/common'
import { TicketTemplates } from '../ticket/TicketTemplates'
import { ticketTemplates } from '@/app/lib/constants/ticket'
import { TicketList } from '../ticket/TicketList'
import { Save } from 'lucide-react'

const InputStyles = `w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors`

const TicketForm: FC<IForm> = ({
  errors,
  handleInput,
  handleSubmit,
  handleToggle,
  inputs,
  isLoading,
  onClose,
  isUpdating
}) => {
  const handleSelectTemplate = (templateData: (typeof ticketTemplates)[0]['data']) => {
    // Prefill all form fields
    Object.entries(templateData).forEach(([key, value]) => {
      handleInput({
        target: { name: key, value }
      } as ChangeEvent<HTMLInputElement>)
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <motion.div
        className="space-y-2 px-8 py-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-4xl font-black dark:text-white text-neutral-900">
          {isUpdating ? 'Edit Ticket' : 'Create Ticket'}
        </h1>
        <p className="dark:text-neutral-400 text-neutral-600">Configure your ticket details</p>
      </motion.div>

      {/* Form Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Created Tickets */}
        {inputs.tickets && <TicketList inputs={inputs} onSelectTicket={handleSelectTemplate} />}

        {/* Ticket Templates */}
        <TicketTemplates onSelectTemplate={handleSelectTemplate} />

        <form onSubmit={handleSubmit} className="flex flex-col h-full w-full">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto p-8">
              {/* Ticket Details Form */}
              <div className="mb-8">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">
                  {isUpdating ? 'Edit Ticket' : 'Add New Ticket'}
                </h3>

                <div className="space-y-4">
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

                  {/* Description */}
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

                  {/* Additional Options */}
                  <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                    <div>
                      <label className="text-sm font-medium dark:text-neutral-300 text-neutral-700">
                        Ticket Available
                      </label>
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

          {/* Fixed Footer with Submit Button */}
          <div className="shrink-0 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-8 py-4">
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
                className="flex items-center justify-center gap-2 px-8 py-3 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-sky-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sky-500/50"
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
