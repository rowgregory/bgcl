'use client'

import { IForm } from '@/types/common'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

const roleOptions = [
  { value: 'ADMIN', label: 'Admin', description: 'Full access to backend' },
  { value: 'STAFF', label: 'Staff', description: 'Limited staff access', isBeta: true }
]

const inputStyles =
  'w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 transition-all text-sm'

export default function UserForm({
  errors,
  handleInput,
  handleSubmit,
  handleSelect,
  inputs,
  isLoading,
  isUpdating,
  onClose
}: IForm) {
  const handleRoleSelect = (value: string) => {
    if (handleSelect) {
      handleSelect({ name: 'role', value })
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-white">Create User</h2>
          <p className="text-zinc-400 text-sm mt-1">Add a new admin team member.</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5 text-zinc-400" />
        </button>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Email *</label>
          <input
            type="email"
            name="email"
            value={inputs?.email || ''}
            onChange={handleInput}
            disabled={isLoading}
            placeholder="user@example.com"
            className={inputStyles}
          />
          {errors?.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
        </div>

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">First Name *</label>
          <input
            type="text"
            name="firstName"
            value={inputs?.firstName || ''}
            onChange={handleInput}
            disabled={isLoading}
            placeholder="John"
            className={inputStyles}
          />
          {errors?.firstName && <p className="mt-2 text-sm text-red-400">{errors.firstName}</p>}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Last Name *</label>
          <input
            type="text"
            name="lastName"
            value={inputs?.lastName || ''}
            onChange={handleInput}
            disabled={isLoading}
            placeholder="Doe"
            className={inputStyles}
          />
          {errors?.lastName && <p className="mt-2 text-sm text-red-400">{errors.lastName}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Phone (Optional)</label>
          <input
            type="tel"
            name="phone"
            value={inputs?.phone || ''}
            onChange={handleInput}
            disabled={isLoading}
            placeholder="(781) 593-1772"
            className={inputStyles}
          />
          {errors?.phone && <p className="mt-2 text-sm text-red-400">{errors.phone}</p>}
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-3">Role *</label>
          <div className="grid grid-cols-3 gap-2">
            {roleOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleRoleSelect(opt.value)}
                disabled={isLoading || opt.isBeta}
                className={`px-3 py-2.5 rounded-lg font-semibold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  inputs?.role === opt.value
                    ? 'bg-indigo-500 text-white border-2 border-indigo-600'
                    : 'bg-zinc-800 text-zinc-300 border-2 border-zinc-700 hover:border-zinc-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-zinc-500 text-xs mt-2">{roleOptions.find((r) => r.value === inputs?.role)?.description}</p>
          {errors?.role && <p className="mt-2 text-sm text-red-400">{errors.role}</p>}
        </div>
      </div>

      {/* Footer - Sticky */}
      <div className="flex gap-3 p-6 border-t border-zinc-800 bg-zinc-900">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          {isLoading ? (isUpdating ? 'Updating...' : 'Creating...') : isUpdating ? 'Update User' : 'Create User'}
        </button>
      </div>
    </motion.form>
  )
}
