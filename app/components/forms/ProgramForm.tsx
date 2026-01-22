import { FC, useEffect, useState } from 'react'
import { setInputs, setIsLoading } from '@/app/lib/store/slices/formSlice'
import { store } from '@/app/lib/store/store'
import { IForm } from '@/types/common'
import { Plus, Save, Trash2, X } from 'lucide-react'
import ImageUpload from '../common/ImageUpload'
import CustomSwitch from '../common/CustomSwitch'
import { createTheme } from '@/app/lib/actions/createTheme'
import { ICreateTheme } from '@/types/entities/theme'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { useRouter } from 'next/navigation'
import { deleteTheme } from '@/app/lib/actions/deleteTheme'

export const ProgramForm: FC<IForm> = ({
  errors,
  handleInput,
  handleSubmit,
  inputs,
  isLoading,
  isUpdating,
  onClose,
  handleSelectAgeGroup,
  themes
}) => {
  const router = useRouter()
  const [selectedThemeIds, setSelectedThemeIds] = useState<string[]>(
    inputs?.themes?.map((theme: any) => theme.id) || []
  )
  const [newThemes, setNewThemes] = useState<{ id: string; title: string; dates: string; order: number }[]>([])

  const handleSelect = ({ name, value }: { name: string; value: string }) => {
    const currentValue = inputs?.[name]
    store.dispatch(
      setInputs({
        formName: 'programForm',
        data: {
          [name]: currentValue === value ? '' : value
        }
      })
    )
  }

  useEffect(() => {
    if (inputs.additionalDetails) {
      setDetails(inputs.additionalDetails)
    }
    if (inputs?.themes) {
      setSelectedThemeIds(inputs.themes.map((theme: any) => theme.id))
    }
  }, [inputs.additionalDetails, inputs.themes])

  const [details, setDetails] = useState([])

  const addDetail = () => {
    const newDetails = [...details, { title: '', input1: '', input2: '' }]
    setDetails(newDetails)
    store.dispatch(setInputs({ formName: 'programForm', data: { additionalDetails: newDetails } }))
  }

  const removeDetail = (index: number) => {
    const newDetails = details.filter((_, i) => i !== index)
    setDetails(newDetails)
    store.dispatch(setInputs({ formName: 'programForm', data: { additionalDetails: newDetails } }))
  }

  const updateDetail = (index, field, value) => {
    const newDetails = details.map((detail, i) => {
      if (i === index) {
        return { ...detail, [field]: value }
      }
      return detail
    })
    setDetails(newDetails)
    store.dispatch(setInputs({ formName: 'programForm', data: { additionalDetails: newDetails } }))
  }

  const handleCreateTheme = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    try {
      store.dispatch(setIsLoading(true))
      await createTheme({ ...newThemes[0], programId: inputs.id } as ICreateTheme)
      router.refresh()
      setNewThemes([])
      store.dispatch(showToast({ message: 'Successfully created theme!' }))
    } catch (error) {
      store.dispatch(showToast({ message: 'Failed to create theme', type: 'error' }))
    } finally {
      store.dispatch(setIsLoading(false))
    }
  }

  const handleDeleteTheme = async (id: string) => {
    try {
      store.dispatch(setIsLoading(true))
      await deleteTheme(id)
      router.refresh()
      store.dispatch(showToast({ message: 'Successfully deleted theme!' }))
    } catch (error) {
      store.dispatch(showToast({ message: 'Failed to delete theme', type: 'error' }))
    } finally {
      store.dispatch(setIsLoading(false))
    }
  }

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
                  className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-3 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
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
                  className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-3 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
                />
                {errors?.description1 && (
                  <p className="mt-2 text-sm text-red-500 dark:text-red-400">{errors.description1}</p>
                )}
              </div>

              {/* Additional Descriptions - Only show if they exist */}
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
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
                      className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-3 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
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
                      Age Range
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
                          className="w-full h-2 bg-neutral-300 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
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
                          className="w-full h-2 bg-neutral-300 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="col-start-1 mb-8">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={(inputs?.location as string) || ''}
                  onChange={handleInput}
                  placeholder="e.g., Boys & Girls Club of Lynn"
                  className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-3 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
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
          <div className="mb-8 gap-4">
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
                              ? 'bg-sky-600 text-white'
                              : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-400'
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
                                ? 'bg-sky-600 text-white'
                                : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-400'
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
                              ? 'bg-sky-600 text-white'
                              : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-400'
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
                              ? 'bg-sky-600 text-white'
                              : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-400'
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
                  className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-3 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
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
                  className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-3 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Additional Details
              </label>
              <button
                type="button"
                onClick={addDetail}
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg text-sky-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Detail
              </button>
            </div>

            {details.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  No additional details yet. Click "Add Detail" to create one.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {details.map((detail, index) => (
                  <div
                    key={index}
                    className="p-4 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 space-y-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                        Detail #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeDetail(index)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                        aria-label="Remove detail"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={detail.title}
                        onChange={(e) => updateDetail(index, 'title', e.target.value)}
                        placeholder="e.g., Requirements, Schedule, Notes"
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-600 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Field 1
                        </label>
                        <input
                          type="text"
                          value={detail.input1}
                          onChange={(e) => updateDetail(index, 'input1', e.target.value)}
                          placeholder="Enter first detail"
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-600 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Field 2
                        </label>
                        <input
                          type="text"
                          value={detail.input2}
                          onChange={(e) => updateDetail(index, 'input2', e.target.value)}
                          placeholder="Enter second detail"
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-600 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Weekly Themes */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white">Weekly Themes</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Add themed weeks to display on the program page
                </p>
              </div>
              <CustomSwitch
                checked={(inputs?.showThemes as boolean) ?? false}
                onChange={(checked) =>
                  store.dispatch(setInputs({ formName: 'programForm', data: { showThemes: checked } }))
                }
                label="Weekly Themes"
              />
            </div>

            {inputs?.showThemes && (
              <div className="p-4 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg">
                {themes && themes.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                      Select Existing Themes
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {themes.map((theme) => (
                        <label
                          key={theme.id}
                          className="flex items-center justify-between gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-x-4">
                            <input
                              type="checkbox"
                              checked={selectedThemeIds.includes(theme.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedThemeIds([...selectedThemeIds, theme.id])
                                  store.dispatch(
                                    setInputs({ formName: 'programForm', data: { themes: [...inputs.themes, theme] } })
                                  )
                                } else {
                                  setSelectedThemeIds(selectedThemeIds.filter((id) => id !== theme.id))
                                }
                              }}
                              className="w-4 h-4 text-sky-600 rounded border-neutral-300 dark:border-neutral-600 focus:ring-sky-500"
                            />
                            <div className="flex-1">
                              <span className="text-sm font-medium text-neutral-900 dark:text-white">
                                {theme.title}
                              </span>
                              <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-2">{theme.dates}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteTheme(theme.id)}
                            className="p-1 bg-red-500/80 hover:bg-red-500 rounded text-white"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {themes && themes.length > 0 && (
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-white dark:bg-neutral-800 text-neutral-500">or create new</span>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      New Themes
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setNewThemes([
                          ...newThemes,
                          { id: crypto.randomUUID(), title: '', dates: '', order: newThemes.length + 1 }
                        ])
                      }
                      className="text-xs font-medium text-sky-600 hover:text-sky-500 transition-colors"
                    >
                      + Add Theme
                    </button>
                  </div>

                  <div className="space-y-3">
                    {newThemes.map((theme, index) => (
                      <div
                        key={theme.id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-sm font-bold shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Theme title"
                            value={theme.title}
                            onChange={(e) => {
                              const updated = [...newThemes]
                              updated[index].title = e.target.value
                              setNewThemes(updated)
                            }}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                          />
                          <input
                            type="text"
                            placeholder="Dates (e.g. 6/22-6/26)"
                            value={theme.dates}
                            onChange={(e) => {
                              const updated = [...newThemes]
                              updated[index].dates = e.target.value
                              setNewThemes(updated)
                            }}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                          />
                        </div>
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={handleCreateTheme}
                            className="p-2 text-neutral-400 hover:text-lime-500 transition-colors"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewThemes(newThemes.filter((t) => t.id !== theme.id))}
                            className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
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
            className="px-4 py-2 text-sm font-medium bg-sky-600 hover:bg-sky-700 disabled:bg-sky-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {isLoading ? 'Saving...' : isUpdating ? 'Update Program' : 'Create Program'}
          </button>
        </div>
      </div>
    </form>
  )
}
