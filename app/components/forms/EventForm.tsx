import { Save } from 'lucide-react'
import { ChangeEvent, FC, useState } from 'react'
import { IForm } from '@/types/common'
import {
  DRESS_CODES,
  DURATIONS,
  EVENT_CATEGORIES,
  EVENT_TYPES,
  MATERIAL_TAGS,
  REQUIREMENT_TAGS
} from '@/app/lib/constants/events'
import { EventTemplates } from '../events/EventTemplates'
import { formatDateForInput } from '@/app/lib/utils/date-utils'
import { EventType } from '@prisma/client'
import { motion } from 'framer-motion'
import { formatTimeForInput } from '@/app/lib/utils/time-utils'
import { formatEnumLabel } from '@/app/lib/utils/formatEnumLabel'

const EventForm: FC<IForm> = ({
  errors,
  handleInput,
  handleSubmit,
  handleToggle,
  handleSelect,
  inputs,
  isLoading,
  isUpdating,
  onClose
}) => {
  const [customRequirements, setCustomRequirements] = useState<string[]>([])
  const [customMaterials, setCustomMaterials] = useState<string[]>([])

  const [requirementTags, setRequirementTags] = useState<string[]>(
    inputs?.requirements ? (inputs.requirements as string).split(', ').filter(Boolean) : []
  )
  const [materialTags, setMaterialTags] = useState<string[]>(
    inputs?.materials ? (inputs.materials as string).split(', ').filter(Boolean) : []
  )

  const toggleRequirementTag = (tag: string, isCustom = false) => {
    const newTags = requirementTags.includes(tag) ? requirementTags.filter((t) => t !== tag) : [...requirementTags, tag]

    setRequirementTags(newTags)

    if (isCustom && !customRequirements.includes(tag)) {
      setCustomRequirements([...customRequirements, tag])
    } else if (!newTags.includes(tag)) {
      setCustomRequirements(customRequirements.filter((t) => t !== tag))
    }

    handleInput({
      target: { name: 'requirements', value: newTags.join(', ') }
    } as React.ChangeEvent<HTMLInputElement>)
  }

  const toggleMaterialTag = (tag: string, isCustom = false) => {
    const newTags = materialTags.includes(tag) ? materialTags.filter((t) => t !== tag) : [...materialTags, tag]

    setMaterialTags(newTags)

    if (isCustom && !customMaterials.includes(tag)) {
      setCustomMaterials([...customMaterials, tag])
    } else if (!newTags.includes(tag)) {
      setCustomMaterials(customMaterials.filter((t) => t !== tag))
    }

    handleInput({
      target: { name: 'materials', value: newTags.join(', ') }
    } as ChangeEvent<HTMLInputElement>)
  }

  const handleSelectTemplate = (templateData: { [s: string]: unknown } | ArrayLike<unknown>) => {
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
          {isUpdating ? 'Edit Event' : 'Create Event'}
        </h1>
        <p className="dark:text-neutral-400 text-neutral-600">Configure your event details</p>
      </motion.div>

      {/* Form Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Only show templates when creating new event */}
        {!isUpdating && <EventTemplates onSelectTemplate={handleSelectTemplate} />}

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto p-8">
              {/* Basic Information */}
              <div className="mb-8">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">Basic Information</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={(inputs?.title as string) || ''}
                      onChange={handleInput}
                      placeholder="Enter event title"
                      className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                    />
                    {errors?.title && <p className="mt-2 text-sm text-red-400">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={(inputs?.description as string) || ''}
                      onChange={handleInput}
                      rows={4}
                      placeholder="Describe your event"
                      className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-3 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="mb-8">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">Event Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={(inputs?.category as string) || ''}
                      onChange={handleSelect}
                      className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                    >
                      <option value="" className="bg-neutral-800">
                        Select...
                      </option>
                      {EVENT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="bg-neutral-800">
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors?.category && <p className="mt-2 text-sm text-red-400">{errors.category}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                      Type *
                    </label>
                    <select
                      name="type"
                      value={(inputs?.type as EventType) || ''}
                      onChange={handleSelect}
                      className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                    >
                      <option value="" disabled className="bg-neutral-800">
                        Select...
                      </option>
                      {EVENT_TYPES.map((type) => (
                        <option key={type} value={type} className="bg-neutral-800">
                          {formatEnumLabel(type)}
                        </option>
                      ))}
                    </select>
                    {errors?.type && <p className="mt-2 text-sm text-red-400">{errors.type}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                      Dress Code
                    </label>
                    <select
                      name="dresscode"
                      value={(inputs?.dresscode as string) || ''}
                      onChange={handleSelect}
                      className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                    >
                      <option value="" className="bg-neutral-800">
                        Select...
                      </option>
                      {DRESS_CODES.map((code) => (
                        <option key={code} value={code} className="bg-neutral-800">
                          {code}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="mb-8">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">Date & Time</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formatDateForInput(inputs.date) || ''}
                      onChange={(e) => {
                        const [year, month, day] = e.target.value.split('-').map(Number)
                        const existing = inputs.date ? new Date(inputs.date) : new Date()
                        const updated = new Date(year, month - 1, day, existing.getHours(), existing.getMinutes(), 0, 0)
                        handleInput({
                          target: { name: 'date', value: updated }
                        } as any)
                      }}
                      className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                    />
                    {errors?.date && <p className="mt-2 text-sm text-red-400">{errors.date}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      value={formatTimeForInput(inputs.date) || ''}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(':')
                        const updated = new Date(inputs.date)
                        updated.setHours(parseInt(hours), parseInt(minutes), 0, 0)
                        handleInput({
                          target: { name: 'date', value: updated }
                        } as any)
                      }}
                      className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                    />
                    {errors?.time && <p className="mt-2 text-sm text-red-400">{errors.time}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                      Duration *
                    </label>
                    <select
                      name="duration"
                      value={(inputs?.duration as string) || ''}
                      onChange={handleSelect}
                      className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                    >
                      <option value="" className="bg-neutral-800">
                        Select...
                      </option>
                      {DURATIONS.map((duration) => (
                        <option key={duration} value={duration} className="bg-neutral-800">
                          {duration}
                        </option>
                      ))}
                    </select>
                    {errors?.duration && <p className="mt-2 text-sm text-red-400">{errors.duration}</p>}
                  </div>
                </div>
              </div>

              {/* Location & Capacity */}
              <div className="mb-8">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">Location & Capacity</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={(inputs?.location as string) || ''}
                      onChange={handleInput}
                      placeholder="Event location"
                      className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                    />
                    {errors?.location && <p className="mt-2 text-sm text-red-400">{errors.location}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                      Max Attendees
                    </label>
                    <input
                      type="number"
                      name="maxAttendees"
                      value={(inputs?.maxAttendees as number) || ''}
                      onChange={handleInput}
                      placeholder="100"
                      className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                    />
                    {errors?.maxAttendees && <p className="mt-2 text-sm text-red-400">{errors.maxAttendees}</p>}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">Host</label>
                  <input
                    type="text"
                    name="host"
                    value={(inputs?.host as string) || ''}
                    onChange={handleInput}
                    placeholder="Host name or organization"
                    className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              {/* Requirements - Tag System */}
              <div className="mb-8">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">Requirements</h3>

                <div className="space-y-3">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Click to add requirements</p>
                  <div className="flex flex-wrap gap-2">
                    {REQUIREMENT_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleRequirementTag(tag)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          requirementTags.includes(tag)
                            ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/30'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-700'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                    {requirementTags
                      .filter((tag) => !REQUIREMENT_TAGS.includes(tag))
                      .map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleRequirementTag(tag)}
                          className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                        >
                          {tag}
                        </button>
                      ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Add custom requirement (press Enter)..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        e.preventDefault()
                        toggleRequirementTag(e.currentTarget.value.trim(), true)
                        e.currentTarget.value = ''
                      }
                    }}
                    className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              {/* Materials - Tag System */}
              <div className="mb-8">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">Materials to Bring</h3>

                <div className="space-y-3">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Click to add materials</p>
                  <div className="flex flex-wrap gap-2">
                    {MATERIAL_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleMaterialTag(tag)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          materialTags.includes(tag)
                            ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/30'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-700'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                    {materialTags
                      .filter((tag) => !MATERIAL_TAGS.includes(tag))
                      .map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleMaterialTag(tag)}
                          className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                        >
                          {tag}
                        </button>
                      ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Add custom material (press Enter)..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        e.preventDefault()
                        toggleMaterialTag(e.currentTarget.value.trim(), true)
                        e.currentTarget.value = ''
                      }
                    }}
                    className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              {/* URLs */}
              <div className="mb-8">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">
                  Registration & Meeting
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                      Registration URL
                    </label>
                    <input
                      type="url"
                      name="registrationUrl"
                      value={(inputs?.registrationUrl as string) || ''}
                      onChange={handleInput}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                    />
                    {errors?.registrationUrl && <p className="mt-2 text-sm text-red-400">{errors.registrationUrl}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                      Meeting URL
                    </label>
                    <input
                      type="url"
                      name="meetingUrl"
                      value={(inputs?.meetingUrl as string) || ''}
                      onChange={handleInput}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                    />
                    {errors?.meetingUrl && <p className="mt-2 text-sm text-red-400">{errors.meetingUrl}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                      Registration Deadline *
                    </label>
                    <input
                      type="date"
                      name="registrationDeadline"
                      value={formatDateForInput(inputs?.registrationDeadline)}
                      onChange={handleInput}
                      className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                    />
                    {errors?.registrationDeadline && (
                      <p className="mt-2 text-sm text-red-400">{errors.registrationDeadline}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="mb-8">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">Event Settings</h3>

                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer group p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all">
                    <input
                      type="checkbox"
                      name="isPublic"
                      checked={Boolean(inputs?.isPublic)}
                      onChange={handleToggle}
                      className="w-5 h-5 mt-0.5 bg-white dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 rounded text-sky-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-800"
                    />
                    <div>
                      <span className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                        Public Event
                      </span>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Event will be visible to all users
                      </p>
                    </div>
                  </label>
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
                {isLoading ? 'Saving...' : isUpdating ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventForm
