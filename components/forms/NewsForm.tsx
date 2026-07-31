'use client'

import { FC } from 'react'
import { motion } from 'framer-motion'
import { IForm } from '@/types/common'
import ImageUpload from '../_shared/ImageUpload'

export const NewsForm: FC<IForm> = ({ errors, handleInput, handleSubmit, inputs, isLoading, isUpdating, onClose }) => {
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
          {isUpdating ? 'Edit News' : 'Create News'}
        </h1>
        <p className="dark:text-neutral-400 text-neutral-600">Configure your news details</p>
      </motion.div>

      {/* Form */}
      <motion.form
        id="newsForm"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-8 space-y-8 h-[calc(100vh-249px)] overflow-y-auto"
      >
        {/* Content - Scrollable */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={inputs.title ?? ''}
              onChange={handleInput}
              className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
              placeholder=""
            />
            {errors?.title && <p className="mt-2 text-sm text-red-400">{errors.title}</p>}
          </div>

          {/* Image Upload */}
          <ImageUpload inputs={inputs} errors={errors} formName="newsForm" isLoading={isLoading} fieldName="image" />

          {/* Additional Information */}
          <div className="space-y-4 dark:border-neutral-800 border-neutral-200 border-t pt-8">
            <div>
              <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                External Link
              </label>
              <input
                type="text"
                name="externalLink"
                value={inputs.externalLink ?? ''}
                onChange={handleInput}
                className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                placeholder="https://example.com"
              />
              {errors?.externalLink && <p className="mt-2 text-sm text-red-400">{errors.externalLink}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                Paragraph 1
              </label>
              <textarea
                name="paragraph1"
                value={inputs.paragraph1 ?? ''}
                onChange={handleInput}
                className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors resize-none"
                placeholder="Share any relevant experience, skills, or why you want to news..."
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                Paragraph 2
              </label>
              <textarea
                name="paragraph2"
                value={inputs.paragraph2 ?? ''}
                onChange={handleInput}
                className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors resize-none"
                placeholder="Share any relevant experience, skills, or why you want to news..."
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                Paragraph 3
              </label>
              <textarea
                name="paragraph3"
                value={inputs.paragraph3 ?? ''}
                onChange={handleInput}
                className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors resize-none"
                placeholder="Share any relevant experience, skills, or why you want to news..."
                rows={4}
              />
            </div>
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
          {/* Submit Button */}
          <motion.button
            form="newsForm"
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="order-1 md:order-2 w-full md:flex-1 py-3 dark:bg-sky-600 dark:hover:bg-sky-700 dark:disabled:bg-neutral-700 bg-sky-600 hover:bg-sky-700 disabled:bg-neutral-400 text-white font-bold rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : isUpdating ? 'Update News' : 'Create News'}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
