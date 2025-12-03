import { motion } from 'framer-motion'
import { Save, X } from 'lucide-react'
import { ChangeEvent, FC, useState } from 'react'
import { IForm } from '@/types/common'
import {
  DRESS_CODES,
  DURATIONS,
  EVENT_CATEGORIES,
  EVENT_TYPES,
  MATERIAL_TAGS,
  REQUIREMENT_TAGS,
  templates
} from '@/app/lib/constants/events'
import EventTemplates from './EventTemplates'

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

  const handleSelectTemplate = (templateData: (typeof templates)[0]['data']) => {
    // Prefill all form fields
    Object.entries(templateData).forEach(([key, value]) => {
      handleInput({
        target: { name: key, value }
      } as ChangeEvent<HTMLInputElement>)
    })
  }

  return (
    <div className="flex flex-col h-full bg-neutral-900">
      {/* Top Bar */}
      <div className="bg-neutral-800 border-b border-neutral-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-sm">{isUpdating ? 'Edit Event' : 'Create New Event'}</h3>
            <p className="text-neutral-400 text-xs mt-0.5">Configure your event details</p>
          </div>

          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-all"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Only show templates when creating new event */}
        {!isUpdating && <EventTemplates onSelectTemplate={handleSelectTemplate} />}

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto bg-neutral-900">
            <div className="max-w-5xl mx-auto p-8">
              {/* Basic Information */}
              <div className="mb-8">
                <h3 className="text-base font-semibold text-white mb-4">Basic Information</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Event Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={(inputs?.title as string) || ''}
                      onChange={handleInput}
                      placeholder="Enter event title"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    {errors?.title && <p className="mt-2 text-sm text-red-400">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={(inputs?.description as string) || ''}
                      onChange={handleInput}
                      rows={4}
                      placeholder="Describe your event"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="mb-8">
                <h3 className="text-base font-semibold text-white mb-4">Event Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Category *</label>
                    <select
                      name="category"
                      value={(inputs?.category as string) || ''}
                      onChange={handleSelect}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Type *</label>
                    <select
                      name="type"
                      value={(inputs?.type as string) || ''}
                      onChange={handleSelect}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    >
                      <option value="" className="bg-neutral-800">
                        Select...
                      </option>
                      {EVENT_TYPES.map((type) => (
                        <option key={type} value={type} className="bg-neutral-800">
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors?.type && <p className="mt-2 text-sm text-red-400">{errors.type}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Dress Code</label>
                    <select
                      name="dresscode"
                      value={(inputs?.dresscode as string) || ''}
                      onChange={handleSelect}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                <h3 className="text-base font-semibold text-white mb-4">Date & Time</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={
                        inputs?.date instanceof Date
                          ? inputs.date.toISOString().split('T')[0]
                          : (inputs?.date as string) || ''
                      }
                      onChange={handleInput}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    {errors?.date && <p className="mt-2 text-sm text-red-400">{errors.date}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Time *</label>
                    <input
                      type="time"
                      name="time"
                      value={(inputs?.time as string) || ''}
                      onChange={handleInput}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    {errors?.time && <p className="mt-2 text-sm text-red-400">{errors.time}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Duration *</label>
                    <select
                      name="duration"
                      value={(inputs?.duration as string) || ''}
                      onChange={handleSelect}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                <h3 className="text-base font-semibold text-white mb-4">Location & Capacity</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={(inputs?.location as string) || ''}
                      onChange={handleInput}
                      placeholder="Event location"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    {errors?.location && <p className="mt-2 text-sm text-red-400">{errors.location}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Max Attendees</label>
                    <input
                      type="number"
                      name="maxAttendees"
                      value={(inputs?.maxAttendees as string) || ''}
                      onChange={handleInput}
                      placeholder="100"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    {errors?.maxAttendees && <p className="mt-2 text-sm text-red-400">{errors.maxAttendees}</p>}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Host</label>
                  <input
                    type="text"
                    name="host"
                    value={(inputs?.host as string) || ''}
                    onChange={handleInput}
                    placeholder="Host name or organization"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Requirements - Tag System */}
              <div className="mb-8">
                <h3 className="text-base font-semibold text-white mb-4">Requirements</h3>

                <div className="space-y-3">
                  <p className="text-sm text-neutral-400">Click to add requirements</p>
                  <div className="flex flex-wrap gap-2">
                    {REQUIREMENT_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleRequirementTag(tag)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          requirementTags.includes(tag)
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                            : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white border border-neutral-700'
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

                  {/* Custom requirement input */}
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
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Materials - Tag System */}
              <div className="mb-8">
                <h3 className="text-base font-semibold text-white mb-4">Materials to Bring</h3>

                <div className="space-y-3">
                  <p className="text-sm text-neutral-400">Click to add materials</p>
                  <div className="flex flex-wrap gap-2">
                    {MATERIAL_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleMaterialTag(tag)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          materialTags.includes(tag)
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                            : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white border border-neutral-700'
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

                  {/* Custom material input */}
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
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* URLs */}
              <div className="mb-8">
                <h3 className="text-base font-semibold text-white mb-4">Registration & Meeting</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Registration URL</label>
                    <input
                      type="url"
                      name="registrationUrl"
                      value={(inputs?.registrationUrl as string) || ''}
                      onChange={handleInput}
                      placeholder="https://..."
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    {errors?.registrationUrl && <p className="mt-2 text-sm text-red-400">{errors.registrationUrl}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Meeting URL</label>
                    <input
                      type="url"
                      name="meetingUrl"
                      value={(inputs?.meetingUrl as string) || ''}
                      onChange={handleInput}
                      placeholder="https://..."
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    {errors?.meetingUrl && <p className="mt-2 text-sm text-red-400">{errors.meetingUrl}</p>}
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="mb-8">
                <h3 className="text-base font-semibold text-white mb-4">Event Settings</h3>

                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer group p-4 rounded-lg bg-neutral-800/50 border border-neutral-700 hover:border-neutral-600 transition-all">
                    <input
                      type="checkbox"
                      name="isPublic"
                      checked={Boolean(inputs?.isPublic)}
                      onChange={handleToggle}
                      className="w-5 h-5 mt-0.5 bg-neutral-700 border-neutral-600 rounded text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-neutral-800"
                    />
                    <div>
                      <span className="text-sm font-medium text-white group-hover:text-indigo-400 transition-colors">
                        Public Event
                      </span>
                      <p className="text-xs text-neutral-400 mt-1">Event will be visible to all users</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group p-4 rounded-lg bg-neutral-800/50 border border-neutral-700 hover:border-neutral-600 transition-all">
                    <input
                      type="checkbox"
                      name="requiresRSVP"
                      checked={Boolean(inputs?.requiresRSVP)}
                      onChange={handleToggle}
                      className="w-5 h-5 mt-0.5 bg-neutral-700 border-neutral-600 rounded text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-neutral-800"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-white group-hover:text-indigo-400 transition-colors">
                        Requires RSVP
                      </span>
                      <p className="text-xs text-neutral-400 mt-1">Users must RSVP to attend</p>

                      {inputs?.requiresRSVP && (
                        <div className="mt-3">
                          <label className="block text-xs font-medium text-neutral-300 mb-2">RSVP Deadline</label>
                          <input
                            type="datetime-local"
                            name="registrationDeadline"
                            value={
                              inputs?.registrationDeadline instanceof Date
                                ? inputs.registrationDeadline.toISOString().slice(0, 16)
                                : (inputs?.registrationDeadline as string) || ''
                            }
                            onChange={handleInput}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          />
                          {errors?.registrationDeadline && (
                            <p className="mt-2 text-sm text-red-400">{errors.registrationDeadline}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group p-4 rounded-lg bg-neutral-800/50 border border-neutral-700 hover:border-neutral-600 transition-all">
                    <input
                      type="checkbox"
                      name="allowMultipleTickets"
                      checked={Boolean(inputs?.allowMultipleTickets)}
                      onChange={handleToggle}
                      className="w-5 h-5 mt-0.5 bg-neutral-700 border-neutral-600 rounded text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-neutral-800"
                    />
                    <div>
                      <span className="text-sm font-medium text-white group-hover:text-indigo-400 transition-colors">
                        Allow Multiple Tickets
                      </span>
                      <p className="text-xs text-neutral-400 mt-1">Users can purchase multiple ticket types</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer with Submit Button */}
          <div className="bg-neutral-800 border-t border-neutral-700 px-8 py-4">
            <div className="max-w-4xl mx-auto flex items-center justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-indigo-500/50"
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
