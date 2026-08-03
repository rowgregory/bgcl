'use client'

import { X } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { TeamMemberFormInput } from '@/lib/validations/team-member.validation'
import { useTeamMemberDrawer } from '@/stores/drawers'
import { TeamMemberBasicInfo } from './TeamMemberBasicInfo'
import { YouthOfTheYear } from './YouthOfTheYear'

export default function TeamMemberForm({ isUpdating }: { isUpdating: boolean }) {
  const {
    watch,
    formState: { isSubmitting }
  } = useFormContext<TeamMemberFormInput>()

  const close = useTeamMemberDrawer((s) => s.close)

  const role = watch('role')
  const isYouth = role === 'youth'

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="dark:bg-neutral-800 dark:border-neutral-700 bg-neutral-100 border-neutral-300 border-b px-6 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold dark:text-neutral-100 text-neutral-900">
            {isUpdating ? 'Edit Team Member' : 'Add Team Member'}
          </h2>
          <button
            type="button"
            onClick={close}
            disabled={isSubmitting}
            className="dark:text-neutral-400 dark:hover:text-neutral-200 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto dark:bg-neutral-900 bg-white">
        <div className="max-w-5xl mx-auto p-8">
          {/* Basic Info Section */}
          <TeamMemberBasicInfo />

          {/* Youth of the Year Section */}
          {isYouth && <YouthOfTheYear />}
        </div>
      </div>

      {/* Fixed Footer with Submit Button */}
      <div className="shrink-0 dark:border-neutral-700 dark:bg-neutral-800 border-neutral-300 bg-neutral-100 border-t px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={close}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:disabled:opacity-50 dark:text-neutral-100 bg-neutral-200 hover:bg-neutral-300 disabled:opacity-50 text-neutral-900 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 dark:bg-sky-600 dark:hover:bg-sky-700 dark:disabled:opacity-50 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
          >
            {isSubmitting ? 'Saving...' : isUpdating ? 'Update Team Member' : 'Create Team Member'}
          </button>
        </div>
      </div>
    </div>
  )
}
