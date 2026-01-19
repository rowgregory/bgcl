import { FC } from 'react'
import { setInputs } from '@/app/lib/store/slices/formSlice'
import { store } from '@/app/lib/store/store'
import { IForm } from '@/types/common'
import { X } from 'lucide-react'
import ImageUpload from '../common/ImageUpload'
import CustomSwitch from '../common/CustomSwitch'

export const ProgramForm: FC<IForm> = ({
  errors,
  handleInput,
  handleSubmit,
  handleSelect,
  inputs,
  isLoading,
  isUpdating,
  onClose,
  handleSelectAgeGroup
}) => {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-neutral-100 dark:bg-neutral-900">
      {/* Top Bar */}
      <div className="bg-neutral-200 dark:bg-neutral-800 border-b border-neutral-300 dark:border-neutral-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-neutral-900 dark:text-white font-semibold text-sm">
              {isUpdating ? 'Edit Program' : 'Create New Program'}
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-0.5">Configure your program details</p>
          </div>
          <X
            onClick={onClose}
            className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer"
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-neutral-100 dark:bg-neutral-900">
        <div className="max-w-5xl mx-auto p-8">
          {/* Basic Information */}
          <div className="mb-8">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">Basic Information</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Program Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={(inputs?.name as string) || ''}
                  onChange={handleInput}
                  placeholder="Enter program name"
                  className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-3 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                {errors?.name && <p className="mt-2 text-sm text-red-500 dark:text-red-400">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description1"
                  value={(inputs?.description1 as string) || ''}
                  onChange={handleInput}
                  placeholder="Describe what activities kids will do, the program's focus, and what they'll learn. Example: Our summer program offers age-appropriate activities like arts & crafts, outdoor games, STEAM projects, and team-building exercises designed to inspire creativity and growth."
                  rows={4}
                  className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-3 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                />
                {errors?.description1 && (
                  <p className="mt-2 text-sm text-red-500 dark:text-red-400">{errors.description1}</p>
                )}
              </div>

              {/* Additional Descriptions - Only show if they exist */}
              {[2, 3, 4, 5].map((num) => {
                const key = `description${num}` as keyof typeof inputs
                if (inputs?.[key] === undefined || inputs?.[key] === null) return null

                return (
                  <div key={num} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Description {num}
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const newInputs = { ...inputs }
                          newInputs[key] = undefined
                          store.dispatch(setInputs({ formName: 'programForm', data: newInputs }))
                        }}
                        className="text-xs text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                    <textarea
                      name={key as string}
                      value={(inputs?.[key] as string) || ''}
                      onChange={handleInput}
                      placeholder={`Description ${num} (optional)`}
                      rows={3}
                      className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-3 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>
                )
              })}

              {/* Add Description Button */}
              {!inputs?.description5 && (
                <button
                  type="button"
                  onClick={() => {
                    for (let i = 2; i <= 5; i++) {
                      const key = `description${i}` as keyof typeof inputs
                      if (inputs?.[key] === undefined) {
                        store.dispatch(setInputs({ formName: 'programForm', data: { [key]: '' } }))
                        break
                      }
                    }
                  }}
                  className="text-sm text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium"
                >
                  + Add Description
                </button>
              )}
            </div>
          </div>

          {/* Program Details */}
          <div className="mb-8">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">Program Details</h3>

            <div className="gap-4">
              {/* Age Group */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-neutral-900 dark:text-white">Age Group</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Display age range on the program page
                    </p>
                  </div>
                  <CustomSwitch
                    checked={(inputs?.showAgeGroup as boolean) ?? false}
                    onChange={(checked) =>
                      store.dispatch(setInputs({ formName: 'programForm', data: { showAgeGroup: checked } }))
                    }
                    label="Age Group"
                  />
                </div>

                {inputs?.showAgeGroup && (
                  <div className="p-4 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                      Age Range *
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 block">Min Age</label>
                        <input
                          type="range"
                          min="0"
                          max="18"
                          value={typeof inputs?.ageGroup === 'string' ? inputs.ageGroup.split('-')[0] : '5'}
                          onChange={(e) => {
                            const minAge = parseInt(e.target.value)
                            const maxAge =
                              typeof inputs?.ageGroup === 'string' ? parseInt(inputs.ageGroup.split('-')[1]) : 10
                            if (minAge < maxAge) {
                              handleSelectAgeGroup(`${minAge}-${maxAge}`)
                            }
                          }}
                          className="w-full h-2 bg-neutral-300 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                      </div>
                      <span className="text-neutral-900 dark:text-white text-sm font-semibold min-w-16 text-center px-3 py-1.5 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
                        {typeof inputs?.ageGroup === 'string' ? inputs.ageGroup : '5-10'}
                      </span>
                      <div className="flex-1">
                        <label className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 block">Max Age</label>
                        <input
                          type="range"
                          min="0"
                          max="18"
                          value={typeof inputs?.ageGroup === 'string' ? inputs.ageGroup.split('-')[1] : '10'}
                          onChange={(e) => {
                            const maxAge = parseInt(e.target.value)
                            const minAge =
                              typeof inputs?.ageGroup === 'string' ? parseInt(inputs.ageGroup.split('-')[0]) : 5
                            if (minAge < maxAge) {
                              handleSelectAgeGroup(`${minAge}-${maxAge}`)
                            }
                          }}
                          className="w-full h-2 bg-neutral-300 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                      </div>
                    </div>
                    {errors?.ageGroup && (
                      <p className="mt-2 text-sm text-red-500 dark:text-red-400">{errors.ageGroup}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="col-start-1">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={(inputs?.location as string) || ''}
                  onChange={handleInput}
                  placeholder="e.g., Boys & Girls Club of Lynn"
                  className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-3 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                {errors?.location && <p className="mt-2 text-sm text-red-500 dark:text-red-400">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Frequency *
                </label>
                <select
                  name="frequency"
                  value={(inputs?.frequency as string) || ''}
                  onChange={handleSelect}
                  className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-3 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="">Select frequency</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Per Session">Per Session</option>
                </select>
                {errors?.frequency && <p className="mt-2 text-sm text-red-500 dark:text-red-400">{errors.frequency}</p>}
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="mb-8">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">Images</h3>

            <div className="grid grid-cols-2 gap-6">
              {/* Program Image */}
              <ImageUpload
                errors={errors}
                formName="programForm"
                inputs={inputs}
                isLoading={isLoading}
                fieldName="image"
              />
              <ImageUpload
                errors={errors}
                formName="programForm"
                inputs={inputs}
                isLoading={isLoading}
                fieldName="heroImage"
              />
            </div>
          </div>

          {/* Schedule */}
          <div className="gap-4 mb-8">
            <div className="mb-8 space-y-4">
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">Schedule</h3>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                  Drop-Off Times
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-neutral-500 dark:text-neutral-400 mb-2 block">Start</label>
                    <div className="flex flex-wrap gap-2">
                      {['7:00am', '7:30am', '8:00am', '8:30am', '9:00am', '9:30am', '10:00am'].map((time) => (
                        <button
                          key={`dropoff-start-${time}`}
                          type="button"
                          onClick={() => handleSelect({ name: 'dropOffStart', value: time })}
                          className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
                            inputs?.dropOffStart === time
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500 dark:text-neutral-400 mb-2 block">End</label>
                    <div className="flex flex-wrap gap-2">
                      {['7:30am', '8:00am', '8:30am', '9:00am', '9:30am', '10:00am', '10:30am', '11:00am'].map(
                        (time) => (
                          <button
                            key={`dropoff-end-${time}`}
                            type="button"
                            onClick={() => handleSelect({ name: 'dropOffEnd', value: time })}
                            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
                              inputs?.dropOffEnd === time
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400'
                            }`}
                          >
                            {time}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                  Pick-Up Times
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-neutral-500 dark:text-neutral-400 mb-2 block">Start</label>
                    <div className="flex flex-wrap gap-2">
                      {['3:00pm', '4:00pm', '5:00pm', '6:00pm'].map((time) => (
                        <button
                          key={`pickup-start-${time}`}
                          type="button"
                          onClick={() => handleSelect({ name: 'pickUpStart', value: time })}
                          className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
                            inputs?.pickUpStart === time
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500 dark:text-neutral-400 mb-2 block">End</label>
                    <div className="flex flex-wrap gap-2">
                      {['3:30pm', '4:30pm', '5:30pm', '6:30pm'].map((time) => (
                        <button
                          key={`pickup-end-${time}`}
                          type="button"
                          onClick={() => handleSelect({ name: 'pickUpEnd', value: time })}
                          className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
                            inputs?.pickUpEnd === time
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mb-8">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">Additional Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Dates Available
                </label>
                <input
                  type="text"
                  name="datesAvailable"
                  value={(inputs?.datesAvailable as string) || ''}
                  onChange={handleInput}
                  placeholder="e.g., TBA or June 1 - August 31"
                  className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-3 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  License Information
                </label>
                <input
                  type="text"
                  name="license"
                  value={(inputs?.license as string) || ''}
                  onChange={handleInput}
                  placeholder="e.g., EEC Licensed Ages 5-10"
                  className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-3 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Actions */}
      <div className="shrink-0 border-t border-neutral-300 dark:border-neutral-700 bg-neutral-200 dark:bg-neutral-800 px-8 py-4">
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {isLoading ? 'Saving...' : isUpdating ? 'Update Program' : 'Create Program'}
          </button>
        </div>
      </div>
    </form>
  )
}
