'use client'

import { inputCls } from '@/lib/constants/form.constants'
import { UserFormInput } from '@/lib/validations/user.validation'
import { useUserDrawer } from '@/stores/drawers'
import { motion } from 'framer-motion'
import { AlertCircle, UserCog } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

export default function UserForm({ isUpdating }: { isUpdating: boolean }) {
  const {
    register,
    watch,
    formState: { errors, isSubmitting }
  } = useFormContext<UserFormInput>()

  const close = useUserDrawer((s) => s.close)
  const role = watch('role')

  const roleHint =
    role === 'ADMIN' || role === 'SUPERUSER'
      ? 'Full access to backend'
      : role === 'PROGRAM'
        ? 'Access to program management'
        : 'No admin access'

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

      {errors.root && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" aria-hidden="true" />
          <p className="text-sm text-red-800 dark:text-red-300">{errors.root.message}</p>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-8 space-y-8 h-[calc(100vh-249px)] overflow-y-auto"
      >
        <div className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
              Email{' '}
              <span aria-hidden="true" className="text-red-500">
                *
              </span>
              <span className="sr-only">(required)</span>
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              aria-invalid={!!errors.email}
              placeholder="user@example.com"
              className={inputCls}
            />
            {errors.email && (
              <p role="alert" className="mt-2 text-sm text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2"
            >
              First Name{' '}
              <span aria-hidden="true" className="text-red-500">
                *
              </span>
              <span className="sr-only">(required)</span>
            </label>
            <input
              id="firstName"
              type="text"
              {...register('firstName')}
              aria-invalid={!!errors.firstName}
              placeholder="John"
              className={inputCls}
            />
            {errors.firstName && (
              <p role="alert" className="mt-2 text-sm text-red-400">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
              Last Name{' '}
              <span aria-hidden="true" className="text-red-500">
                *
              </span>
              <span className="sr-only">(required)</span>
            </label>
            <input
              id="lastName"
              type="text"
              {...register('lastName')}
              aria-invalid={!!errors.lastName}
              placeholder="Doe"
              className={inputCls}
            />
            {errors.lastName && (
              <p role="alert" className="mt-2 text-sm text-red-400">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
              Phone (Optional)
            </label>
            <input
              id="phone"
              type="tel"
              {...register('phone')}
              aria-invalid={!!errors.phone}
              placeholder="(781) 593-1772"
              className={inputCls}
            />
            {errors.phone && (
              <p role="alert" className="mt-2 text-sm text-red-400">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
              <UserCog className="w-4 h-4 inline mr-2" aria-hidden="true" />
              User Role
            </label>
            <select
              id="role"
              {...register('role')}
              aria-invalid={!!errors.role}
              aria-describedby="role-hint"
              className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="SUPPORTER">Supporter (No Access)</option>
              <option value="PROGRAM">Program Staff (Partial Access)</option>
              <option value="ADMIN">Admin (Full Access)</option>
            </select>
            <p id="role-hint" className="text-xs dark:text-neutral-500 text-neutral-600 mt-2">
              {roleHint}
            </p>
            {errors.role && (
              <p role="alert" className="mt-2 text-sm text-red-400">
                {errors.role.message}
              </p>
            )}
          </div>
        </div>

        {/* Required Fields Note */}
        <p className="text-xs dark:text-neutral-500 text-neutral-600 text-center">Fields marked with * are required</p>
      </motion.div>

      {/* Fixed Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 p-6 md:p-8 z-40">
        <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4">
          <motion.button
            type="button"
            onClick={close}
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="order-2 md:order-1 w-full md:flex-1 py-3 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:disabled:bg-neutral-800 bg-neutral-300 hover:bg-neutral-400 disabled:bg-neutral-200 text-neutral-900 dark:text-neutral-100 font-bold rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            Cancel
          </motion.button>
          <motion.button
            form="userForm"
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="order-1 md:order-2 w-full md:flex-1 py-3 dark:bg-sky-600 dark:hover:bg-sky-700 dark:disabled:bg-neutral-700 bg-sky-600 hover:bg-sky-700 disabled:bg-neutral-400 text-white font-bold rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {isSubmitting ? (isUpdating ? 'Updating...' : 'Creating...') : isUpdating ? 'Update User' : 'Create User'}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
