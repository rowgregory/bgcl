'use client'

import { X } from 'lucide-react'
import { store } from '@/lib/store/store'
import { setInputs } from '@/lib/store/slices/formSlice'
import { PARTNER_TIERS } from '@/types/entities/partner'

const inputClass =
  'w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-3 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all'

const labelClass = 'block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2'

export default function PartnerForm({ inputs, errors, isUpdating, onClose, handleInput, handleSubmit, isLoading }) {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-neutral-100 dark:bg-neutral-900">
      {/* Top Bar */}
      <div className="bg-neutral-200 dark:bg-neutral-800 border-b border-neutral-300 dark:border-neutral-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-neutral-900 dark:text-white font-semibold text-sm">
              {isUpdating ? 'Edit Partner' : 'Create New Partner'}
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-0.5">Configure your partner details</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close form"
            className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-neutral-100 dark:bg-neutral-900">
        <div className="max-w-5xl mx-auto p-8 space-y-8">
          {/* Basic Information */}
          <section>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">Basic Information</h3>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="partner-name" className={labelClass}>
                  Partner Name <span aria-hidden="true">*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  id="partner-name"
                  type="text"
                  name="name"
                  value={(inputs.name as string) || ''}
                  onChange={handleInput}
                  placeholder="Enter partner name"
                  required
                  aria-required="true"
                  aria-describedby={errors?.name ? 'name-error' : undefined}
                  className={inputClass}
                />
                {errors?.name && (
                  <p id="name-error" role="alert" className="mt-2 text-sm text-red-500 dark:text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="partner-tier" className={labelClass}>
                  Partner Tier <span aria-hidden="true">*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <select
                  id="partner-tier"
                  name="tier"
                  value={(inputs.tier as string) || ''}
                  onChange={handleInput}
                  required
                  aria-required="true"
                  aria-describedby={errors?.tier ? 'tier-error' : undefined}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select tier
                  </option>
                  {PARTNER_TIERS.map((tier) => (
                    <option key={tier.value} value={tier.value}>
                      {tier.label}
                    </option>
                  ))}
                </select>
                {errors?.tier && (
                  <p id="tier-error" role="alert" className="mt-2 text-sm text-red-500 dark:text-red-400">
                    {errors.tier}
                  </p>
                )}
              </div>
            </div>
          </section>
          <section>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">Visibility</h3>
            <div className="space-y-3">
              {/* isActive */}
              <div className="flex items-center justify-between bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">Active</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Show this partner on the public partners page
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={inputs.isActive as boolean}
                  onClick={() =>
                    store.dispatch(
                      setInputs({ formName: 'partnerForm', data: { ...inputs, isActive: !inputs?.isActive } })
                    )
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-800 ${
                    inputs.isActive ? 'bg-sky-600' : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}
                >
                  <span className="sr-only">Toggle active status</span>
                  <span
                    aria-hidden="true"
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      inputs.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-neutral-200 dark:bg-neutral-800 border-t border-neutral-300 dark:border-neutral-700 px-6 py-4">
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            aria-disabled={isLoading}
            className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-800"
          >
            {isLoading ? 'Saving…' : isUpdating ? 'Save Changes' : 'Create Partner'}
          </button>
        </div>
      </div>
    </form>
  )
}
