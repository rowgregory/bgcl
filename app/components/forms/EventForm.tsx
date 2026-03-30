import { Plus, Save, Trash2, X } from 'lucide-react'
import { ChangeEvent, useEffect, useState } from 'react'
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
import { formatDateForInput, formatDatetimeLocalForInput } from '@/app/lib/utils/date-utils'
import { EventType } from '@prisma/client'
import { motion } from 'framer-motion'
import { formatEnumLabel } from '@/app/lib/utils/formatEnumLabel'
import CustomSwitch from '../common/CustomSwitch'
import { store } from '@/app/lib/store/store'
import { setInputs } from '@/app/lib/store/slices/formSlice'

export const formatTimeForInput = (date: Date | string | null | undefined): string => {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

export function EventForm({
  errors,
  handleInput,
  handleSubmit,
  handleSelect,
  inputs,
  isLoading,
  isUpdating,
  onClose
}: IForm) {
  const [materialTags, setMaterialTags] = useState<string[]>([])

  const [customMaterials, setCustomMaterials] = useState<string[]>([])

  const [requirementTags, setRequirementTags] = useState<string[]>([])

  console.log('inputs?.requirements: ', inputs?.requirements)
  useEffect(() => {
    const raw = inputs?.requirements as string | undefined
    if (!raw) {
      setRequirementTags([])
      return
    }
    setRequirementTags(
      raw
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    )
  }, [inputs?.requirements])

  useEffect(() => {
    const raw = inputs?.materials as string | undefined
    if (!raw) {
      setMaterialTags([])
      return
    }
    setMaterialTags(
      raw
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    )
  }, [inputs?.materials])

  console.log('requirementTags: ', requirementTags)

  const [customRequirements, setCustomRequirements] = useState<string[]>(() => {
    const raw = inputs?.requirements as string | undefined
    if (!raw) return []
    const tags = raw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    return tags.filter((t) => !REQUIREMENT_TAGS.includes(t))
  })

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
        <div className="hidden lg:block lg:shrink-0">
          {!isUpdating && <EventTemplates onSelectTemplate={handleSelectTemplate} />}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full w-full">
          <div className="block shrink-0 lg:hidden">
            {!isUpdating && <EventTemplates onSelectTemplate={handleSelectTemplate} />}
          </div>
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
                      Registration Deadline *
                    </label>
                    <input
                      type="date"
                      name="registrationDeadline"
                      value={formatDateForInput(inputs?.registrationDeadline)}
                      onChange={(e) => {
                        const [year, month, day] = e.target.value.split('-').map(Number)
                        const existing = inputs.registrationDeadline
                          ? new Date(inputs.registrationDeadline)
                          : new Date()
                        const updated = new Date(year, month - 1, day, existing.getHours(), existing.getMinutes(), 0, 0)
                        handleInput({
                          target: { name: 'registrationDeadline', value: updated }
                        } as any)
                      }}
                      className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                    />
                    {errors?.registrationDeadline && (
                      <p className="mt-2 text-sm text-red-400">{errors.registrationDeadline}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Ticket Sales Window */}
              <div className="mb-8">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-1">Ticket Sales Window</h3>
                <p className="text-xs dark:text-neutral-500 text-neutral-500 mb-4">
                  Set when tickets become available and when sales close
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-1.5">
                      Sales Start Date
                    </label>
                    <input
                      type="datetime-local"
                      value={formatDatetimeLocalForInput(inputs?.ticketSalesStartDate) || ''}
                      onChange={(e) =>
                        store.dispatch(
                          setInputs({
                            formName: 'eventForm',
                            data: { ticketSalesStartDate: e.target.value ? new Date(e.target.value) : null }
                          })
                        )
                      }
                      className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white bg-neutral-50 border-neutral-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-1.5">
                      Sales End Date
                    </label>
                    <input
                      type="datetime-local"
                      value={formatDatetimeLocalForInput(inputs?.ticketSalesEndDate) || ''}
                      onChange={(e) =>
                        store.dispatch(
                          setInputs({
                            formName: 'eventForm',
                            data: { ticketSalesEndDate: e.target.value ? new Date(e.target.value) : null }
                          })
                        )
                      }
                      className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white bg-neutral-50 border-neutral-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Dress Code & Highlights */}
              <div className="mb-8">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-1">
                  Dress Code &amp; Highlights
                </h3>
                <p className="text-xs dark:text-neutral-500 text-neutral-500 mb-4">
                  Optional details shown on the public event page
                </p>

                <div className="space-y-4">
                  {/* Dress code headline */}
                  <div>
                    <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-1.5">
                      Dress Code Headline
                    </label>
                    <input
                      type="text"
                      value={inputs?.dressCodeHeadline || ''}
                      onChange={(e) =>
                        store.dispatch(
                          setInputs({ formName: 'eventForm', data: { dressCodeHeadline: e.target.value } })
                        )
                      }
                      placeholder="Dress to Impress — or Just Have Fun!"
                      className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 bg-neutral-50 border-neutral-200 placeholder-neutral-400 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors text-sm"
                    />
                  </div>

                  {/* Dress code note */}
                  <div>
                    <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-1.5">
                      Dress Code Note
                      <span className="ml-1.5 text-xs font-normal dark:text-neutral-500 text-neutral-400">
                        (venue restrictions etc.)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={inputs?.dressCodeNote || ''}
                      onChange={(e) =>
                        store.dispatch(setInputs({ formName: 'eventForm', data: { dressCodeNote: e.target.value } }))
                      }
                      placeholder="Per Venue: No jeans, t-shirts, or hats allowed."
                      className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 bg-neutral-50 border-neutral-200 placeholder-neutral-400 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors text-sm"
                    />
                  </div>

                  {/* Best dressed prizes */}
                  <div>
                    <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-1.5">
                      Best Dressed Prizes
                    </label>
                    <input
                      type="text"
                      value={inputs?.bestDressedPrizes || ''}
                      onChange={(e) =>
                        store.dispatch(
                          setInputs({ formName: 'eventForm', data: { bestDressedPrizes: e.target.value } })
                        )
                      }
                      placeholder="Best Dressed Prizes will be awarded during the event..."
                      className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 bg-neutral-50 border-neutral-200 placeholder-neutral-400 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors text-sm"
                    />
                  </div>

                  {/* Dress code items — dynamic rows */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700">
                        Dress Code Options
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const current = inputs?.dressCodeItems ?? []
                          store.dispatch(
                            setInputs({
                              formName: 'eventForm',
                              data: { dressCodeItems: [...current, { label: '', description: '' }] }
                            })
                          )
                        }}
                        className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                      >
                        + Add Option
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(inputs?.dressCodeItems ?? []).map((item: any, i: number) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={item.label || ''}
                              onChange={(e) => {
                                const updated = [...(inputs?.dressCodeItems ?? [])]
                                updated[i] = { ...updated[i], label: e.target.value }
                                store.dispatch(setInputs({ formName: 'eventForm', data: { dressCodeItems: updated } }))
                              }}
                              placeholder="High Roller Glam"
                              className="w-full px-3 py-2 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 bg-neutral-50 border-neutral-200 placeholder-neutral-400 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors text-sm"
                            />
                            <input
                              type="text"
                              value={item.description || ''}
                              onChange={(e) => {
                                const updated = [...(inputs?.dressCodeItems ?? [])]
                                updated[i] = { ...updated[i], description: e.target.value }
                                store.dispatch(setInputs({ formName: 'eventForm', data: { dressCodeItems: updated } }))
                              }}
                              placeholder="Sparkle, metallics, or cocktail attire"
                              className="w-full px-3 py-2 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 bg-neutral-50 border-neutral-200 placeholder-neutral-400 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors text-sm"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (inputs?.dressCodeItems ?? []).filter((_: any, j: number) => j !== i)
                              store.dispatch(setInputs({ formName: 'eventForm', data: { dressCodeItems: updated } }))
                            }}
                            aria-label="Remove dress code option"
                            className="p-2 text-red-400 hover:text-red-600 transition-colors shrink-0 mt-0.5"
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      ))}

                      {(!inputs?.dressCodeItems || inputs.dressCodeItems.length === 0) && (
                        <p className="text-xs dark:text-neutral-600 text-neutral-400 italic">
                          No dress code options added yet.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Raffle Settings */}
              <div className="mb-8">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">Raffle Settings</h3>

                <div className="space-y-4">
                  <CustomSwitch
                    checked={(inputs?.isRaffle as boolean) || false}
                    onChange={(val) => store.dispatch(setInputs({ formName: 'eventForm', data: { isRaffle: val } }))}
                    label="Raffle Event"
                    description="Enables raffle ticket assignment and digital ticket generation"
                  />

                  {inputs?.isRaffle && (
                    <div className="space-y-6 pl-1">
                      {/* Identity */}
                      <div>
                        <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-3">
                          Identity
                        </h4>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                                Subtitle
                              </label>
                              <input
                                type="text"
                                name="subtitle"
                                value={(inputs?.subtitle as string) || ''}
                                onChange={handleInput}
                                placeholder='e.g. "Viva Las Vegas"'
                                className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                                Tagline
                              </label>
                              <input
                                type="text"
                                name="tagline"
                                value={(inputs?.tagline as string) || ''}
                                onChange={handleInput}
                                placeholder='e.g. "Join Us For Our Send a Kid to Camp"'
                                className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                                Website
                              </label>
                              <input
                                type="text"
                                name="website"
                                value={(inputs?.website as string) || ''}
                                onChange={handleInput}
                                placeholder="e.g. www.bgcl.org"
                                className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                                Full Address
                              </label>
                              <input
                                type="text"
                                name="address"
                                value={(inputs?.address as string) || ''}
                                onChange={handleInput}
                                placeholder="e.g. 154 Tedesco St, Marblehead, MA 01945"
                                className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                              Mission Statement
                            </label>
                            <textarea
                              name="missionStatement"
                              value={(inputs?.missionStatement as string) || ''}
                              onChange={handleInput}
                              rows={2}
                              placeholder="e.g. To inspire and enable all young people..."
                              className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-3 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Ticket Details */}
                      <div>
                        <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-3">
                          Ticket Details
                        </h4>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                                Draw Date & Time
                              </label>
                              <input
                                type="datetime-local"
                                name="raffleDrawDate"
                                value={formatDatetimeLocalForInput(inputs.raffleDrawDate) || ''}
                                onChange={handleInput}
                                className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                                Ticket Price Label
                              </label>
                              <input
                                type="text"
                                name="raffleTicketPrice"
                                value={(inputs?.raffleTicketPrice as string) || ''}
                                onChange={handleInput}
                                placeholder="e.g. $100 Value"
                                className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                                Grand Prize Label
                              </label>
                              <input
                                type="text"
                                name="raffleGrandPrizeLabel"
                                value={(inputs?.raffleGrandPrizeLabel as string) || ''}
                                onChange={handleInput}
                                placeholder="e.g. $10,000"
                                className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                                Odds Label
                              </label>
                              <input
                                type="text"
                                name="raffleOddsLabel"
                                value={(inputs?.raffleOddsLabel as string) || ''}
                                onChange={handleInput}
                                placeholder="e.g. 1:50 chance"
                                className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                              Raffle Terms
                            </label>
                            <textarea
                              name="raffleTerms"
                              value={(inputs?.raffleTerms as string) || ''}
                              onChange={handleInput}
                              rows={3}
                              placeholder="e.g. Must be present to win. Non-transferable. 21+ event."
                              className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-3 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Prize Ladder */}
                      <div>
                        <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-3">
                          Prize Ladder
                        </h4>
                        <div className="space-y-2">
                          {((inputs?.rafflePrizes as { place: string; amount: string }[]) || []).map((prize, index) => (
                            <div key={index} className="flex gap-3 items-center">
                              <input
                                type="text"
                                value={prize.place}
                                onChange={(e) => {
                                  const updated = [
                                    ...((inputs?.rafflePrizes as { place: string; amount: string }[]) || [])
                                  ]
                                  updated[index] = { ...updated[index], place: e.target.value }
                                  store.dispatch(setInputs({ formName: 'eventForm', data: { rafflePrizes: updated } }))
                                }}
                                placeholder="e.g. Grand Prize"
                                className="flex-1 px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-sm"
                              />
                              <input
                                type="text"
                                value={prize.amount}
                                onChange={(e) => {
                                  const updated = [
                                    ...((inputs?.rafflePrizes as { place: string; amount: string }[]) || [])
                                  ]
                                  updated[index] = { ...updated[index], amount: e.target.value }
                                  store.dispatch(setInputs({ formName: 'eventForm', data: { rafflePrizes: updated } }))
                                }}
                                placeholder="e.g. $10,000"
                                className="w-32 px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-sm"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (
                                    (inputs?.rafflePrizes as { place: string; amount: string }[]) || []
                                  ).filter((_, i) => i !== index)
                                  store.dispatch(setInputs({ formName: 'eventForm', data: { rafflePrizes: updated } }))
                                }}
                                className="text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors shrink-0"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const current = (inputs?.rafflePrizes as { place: string; amount: string }[]) || []
                              store.dispatch(
                                setInputs({
                                  formName: 'eventForm',
                                  data: { rafflePrizes: [...current, { place: '', amount: '' }] }
                                })
                              )
                            }}
                            className="flex items-center gap-2 text-sm text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors pt-1"
                          >
                            <Plus size={14} />
                            Add prize
                          </button>
                        </div>
                      </div>

                      {/* Schedule */}
                      <div>
                        <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-3">
                          Event Schedule
                        </h4>
                        <div className="space-y-2">
                          {((inputs?.raffleSchedule as { time: string; label: string }[]) || []).map((item, index) => (
                            <div key={index} className="flex gap-3 items-center">
                              <input
                                type="text"
                                value={item.time}
                                onChange={(e) => {
                                  const updated = [
                                    ...((inputs?.raffleSchedule as { time: string; label: string }[]) || [])
                                  ]
                                  updated[index] = { ...updated[index], time: e.target.value }
                                  store.dispatch(
                                    setInputs({ formName: 'eventForm', data: { raffleSchedule: updated } })
                                  )
                                }}
                                placeholder="e.g. 6:30 PM – 7:00 PM"
                                className="w-48 px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-sm"
                              />
                              <input
                                type="text"
                                value={item.label}
                                onChange={(e) => {
                                  const updated = [
                                    ...((inputs?.raffleSchedule as { time: string; label: string }[]) || [])
                                  ]
                                  updated[index] = { ...updated[index], label: e.target.value }
                                  store.dispatch(
                                    setInputs({ formName: 'eventForm', data: { raffleSchedule: updated } })
                                  )
                                }}
                                placeholder="e.g. $10K Raffle Drawing"
                                className="flex-1 px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-sm"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (
                                    (inputs?.raffleSchedule as { time: string; label: string }[]) || []
                                  ).filter((_, i) => i !== index)
                                  store.dispatch(
                                    setInputs({ formName: 'eventForm', data: { raffleSchedule: updated } })
                                  )
                                }}
                                className="text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors shrink-0"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const current = (inputs?.raffleSchedule as { time: string; label: string }[]) || []
                              store.dispatch(
                                setInputs({
                                  formName: 'eventForm',
                                  data: { raffleSchedule: [...current, { time: '', label: '' }] }
                                })
                              )
                            }}
                            className="flex items-center gap-2 text-sm text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors pt-1"
                          >
                            <Plus size={14} />
                            Add schedule item
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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
