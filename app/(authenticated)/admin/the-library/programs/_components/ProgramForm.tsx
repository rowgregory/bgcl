'use client'

import { useFormContext } from 'react-hook-form'
import { useProgramDrawer } from '@/stores/drawers'
import type { ProgramFormInput } from '@/lib/validations/program.validation'
import type { Theme } from '@prisma/client'
import BasicInformation from './BasicInformation'
import ProgramDetails from './ProgramDetails'
import ImageUpload from '@/components/_shared/ImageUpload'
import Schedule from './Schedule'
import { AdditionalInformation } from './AdditionalInformation'
import { AdditionalDetails } from './AdditionalDetails'
import { WeeklyThemes } from './WeeklyThemes'
import { FormSwitch } from '@/components/_shared/FormSwitch'
import PDFSection from './PDFSection'
import TopBar from './TopBar'
import { AlertCircle } from 'lucide-react'

export default function ProgramForm({ isUpdating, themes }: { isUpdating: boolean; themes: Theme[] }) {
  const {
    formState: { isSubmitting, errors }
  } = useFormContext<ProgramFormInput>()

  const close = useProgramDrawer((s) => s.close)

  return (
    <div className="flex flex-col h-full bg-neutral-100 dark:bg-neutral-900">
      {/* Top Bar */}
      <TopBar isUpdating={isUpdating} />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-neutral-100 dark:bg-neutral-900">
        <div className="max-w-5xl mx-auto p-8">
          {errors.root && (
            <div
              role="alert"
              className="flex items-start gap-3 p-4 mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" aria-hidden="true" />
              <p className="text-sm text-red-800 dark:text-red-300">{errors.root.message}</p>
            </div>
          )}

          {/* Basic Information */}
          <BasicInformation />

          {/* Program Details */}
          <ProgramDetails />

          {/* Images */}
          <div className="mb-8">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">Images</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ImageUpload fieldName="image" label="Primary Image" />
              <ImageUpload fieldName="imageTwo" label="Secondary Image" />
            </div>
          </div>

          {/* Schedule */}
          <Schedule />

          {/* Additional Information */}
          <AdditionalInformation />

          <AdditionalDetails />

          {/* Weekly Themes */}
          <WeeklyThemes themes={themes} />

          <div className="mb-8">
            <FormSwitch
              name="isListed"
              label="Listed Program"
              description="Controls whether this program appears on the public programs page"
            />
          </div>

          {/* PDF Section */}
          <PDFSection />
        </div>
      </div>

      {/* Footer with Actions */}
      <div className="shrink-0 border-t border-neutral-300 dark:border-neutral-700 bg-neutral-200 dark:bg-neutral-800 px-8 py-4">
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={close}
            className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium bg-sky-600 hover:bg-sky-700 disabled:bg-sky-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {isSubmitting ? 'Saving...' : isUpdating ? 'Update Program' : 'Create Program'}
          </button>
        </div>
      </div>
    </div>
  )
}
