'use client'

import { FC } from 'react'
import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { IForm } from '@/types/common'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i)

export const NewsletterForm: FC<IForm> = ({
  errors,
  handleInput,
  handleSubmit,
  inputs,
  isLoading,
  isUpdating,
  onClose
}) => {
  return (
    <div className="max-w-2xl w-full mx-auto p-6 md:p-8 pb-40">
      {/* Header */}
      <motion.div
        className="mb-8 space-y-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-4xl font-black dark:text-white text-neutral-900">
          {isUpdating ? 'Edit Newsletter' : 'Create Newsletter'}
        </h1>
        <p className="dark:text-neutral-400 text-neutral-600">Upload a new newsletter PDF</p>
      </motion.div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
        id="newsletterForm"
      >
        {/* Month Selection */}
        <div className="space-y-4">
          <div>
            <label className="flex text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-3 items-center gap-2">
              <Calendar className="w-4 h-4" />
              Month *
            </label>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {MONTHS.map((month) => (
                <button
                  key={month}
                  type="button"
                  onClick={() => {
                    const event = {
                      target: { name: 'month', value: month }
                    } as React.ChangeEvent<HTMLSelectElement>
                    handleInput(event)
                  }}
                  className={`px-3 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    inputs.month === month
                      ? 'bg-sky-600 text-white shadow-lg'
                      : 'bg-white dark:bg-neutral-800 dark:text-neutral-300 text-neutral-700 border border-neutral-200 dark:border-neutral-700 hover:border-sky-500 dark:hover:border-sky-500'
                  }`}
                >
                  {month.slice(0, 3)}
                </button>
              ))}
            </div>
            {errors?.month && <p className="mt-2 text-sm text-red-400">{errors.month}</p>}
          </div>

          {/* Year Selection */}
          <div>
            <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-3">Year *</label>
            <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
              {YEARS.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => {
                    const event = {
                      target: { name: 'year', value: year.toString() }
                    } as React.ChangeEvent<HTMLSelectElement>
                    handleInput(event)
                  }}
                  className={`px-3 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    Number(inputs.year) === year
                      ? 'bg-sky-600 text-white shadow-lg'
                      : 'bg-white dark:bg-neutral-800 dark:text-neutral-300 text-neutral-700 border border-neutral-200 dark:border-neutral-700 hover:border-sky-500 dark:hover:border-sky-500'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
            {errors?.year && <p className="mt-2 text-sm text-red-400">{errors.year}</p>}
          </div>
        </div>

        {/* PDF URL */}
        <div className="space-y-4 dark:border-neutral-800 border-neutral-200 border-t pt-8">
          <div>
            <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">PDF URL *</label>
            <input
              type="url"
              name="pdfUrl"
              value={inputs.pdfUrl ?? ''}
              onChange={handleInput}
              className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
              placeholder="https://drive.google.com/..."
            />
            {errors?.pdfUrl && <p className="mt-2 text-sm text-red-400">{errors.pdfUrl}</p>}
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
            className="w-full md:flex-1 py-3 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:disabled:bg-neutral-800 bg-neutral-300 hover:bg-neutral-400 disabled:bg-neutral-200 text-neutral-900 dark:text-neutral-100 font-bold rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            Cancel
          </motion.button>
          {/* Submit Button */}
          <motion.button
            type="submit"
            form="newsletterForm"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full md:flex-1 py-3 dark:bg-sky-600 dark:hover:bg-sky-700 dark:disabled:bg-neutral-700 bg-sky-600 hover:bg-sky-700 disabled:bg-neutral-400 text-white font-bold rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : isUpdating ? 'Update Newsletter' : 'Create Newsletter'}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
