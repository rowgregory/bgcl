'use client'

import { IForm } from '@/types/common'
import { motion } from 'framer-motion'

const inputStyles =
  'w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors'

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
    <div className="w-full mx-auto pb-40">
      {/* Header */}
      <motion.div
        className="space-y-2 px-8 py-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-4xl font-black dark:text-white text-neutral-900">
          {isUpdating ? 'Edit User' : 'Create User'}
        </h1>
        <p className="dark:text-neutral-400 text-neutral-600">Configure user details</p>
      </motion.div>
      <motion.form
        id="userForm"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-8 space-y-8 h-[calc(100vh-249px)] overflow-y-auto"
      >
        {/* Content - Scrollable */}
        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">Email *</label>
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
            <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
              First Name *
            </label>
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
            <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">Last Name *</label>
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
            <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
              Phone (Optional)
            </label>
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
            <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-4">
              Admin Access
            </label>
            <button
              type="button"
              onClick={() => handleRoleSelect(inputs?.role === 'ADMIN' ? 'SUPPORTER' : 'ADMIN')}
              disabled={isLoading}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                inputs?.role === 'ADMIN' ? 'dark:bg-cyan-600 bg-sky-600' : 'dark:bg-neutral-700 bg-neutral-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  inputs?.role === 'ADMIN' ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <p className="text-xs dark:text-neutral-500 text-neutral-600 mt-2">
              {inputs?.role === 'ADMIN' ? 'Full access to backend' : 'No admin access'}
            </p>
          </div>
        </div>

        {/* Required Fields Note */}
        <p className="text-xs dark:text-neutral-500 text-neutral-600 text-center">Fields marked with * are required</p>
      </motion.form>

      {/* Fixed Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 p-6 md:p-8 z-40">
        <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4">
          <motion.button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="order-2 md:order-1 w-full md:flex-1 py-3 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:disabled:bg-neutral-800 bg-neutral-300 hover:bg-neutral-400 disabled:bg-neutral-200 text-neutral-900 dark:text-neutral-100 font-bold rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            Cancel
          </motion.button>
          <motion.button
            form="userForm"
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="order-1 md:order-2 w-full md:flex-1 py-3 dark:bg-sky-600 dark:hover:bg-sky-700 dark:disabled:bg-neutral-700 bg-sky-600 hover:bg-sky-700 disabled:bg-neutral-400 text-white font-bold rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {isLoading ? (isUpdating ? 'Updating...' : 'Creating...') : isUpdating ? 'Update User' : 'Create User'}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
