import uploadFileToFirebase from '@/app/lib/firebase/uploadFileToFirebase'
import { setInputs } from '@/app/lib/store/slices/formSlice'
import { store } from '@/app/lib/store/store'
import { IForm } from '@/types/common'
import { Upload, X } from 'lucide-react'
import { ChangeEvent, FC, useRef, useState } from 'react'

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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string>(inputs?.image || '')
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Show preview while uploading
      const reader = new FileReader()
      reader.onload = (fileEvent) => {
        setPreviewImage(fileEvent.target?.result as string)
      }
      reader.readAsDataURL(file)

      const downloadURL = await uploadFileToFirebase(
        file,
        (progress) => {
          setUploadProgress(progress)
        },
        'image'
      )

      // Update Redux state directly
      store.dispatch(
        setInputs({
          formName: 'programForm',
          data: { image: downloadURL }
        })
      )
    } catch (error) {
      setPreviewImage('')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = () => {
    store.dispatch(
      setInputs({
        formName: 'programForm',
        data: { image: '' }
      })
    )
    setPreviewImage('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-neutral-900">
      {/* Top Bar */}
      <div className="bg-neutral-800 border-b border-neutral-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-sm">{isUpdating ? 'Edit Program' : 'Create New Program'}</h3>
            <p className="text-neutral-400 text-xs mt-0.5">Configure your program details</p>
          </div>
          <X onClick={onClose} />
        </div>
      </div>

      {/* Form Content */}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-neutral-900">
        <div className="max-w-5xl mx-auto p-8">
          {/* Basic Information */}
          <div className="mb-8">
            <h3 className="text-base font-semibold text-white mb-4">Basic Information</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Program Name *</label>
                <input
                  type="text"
                  name="name"
                  value={(inputs?.name as string) || ''}
                  onChange={handleInput}
                  placeholder="Enter program name"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                {errors?.name && <p className="mt-2 text-sm text-red-400">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Description *</label>
                <textarea
                  name="description1"
                  value={(inputs?.description1 as string) || ''}
                  onChange={handleInput}
                  placeholder="Describe what activities kids will do, the program's focus, and what they'll learn. Example: Our summer program offers age-appropriate activities like arts & crafts, outdoor games, STEAM projects, and team-building exercises designed to inspire creativity and growth."
                  rows={4}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                />
                {errors?.description1 && <p className="mt-2 text-sm text-red-400">{errors.description1}</p>}
              </div>

              {/* Additional Descriptions - Only show if they exist */}
              {[2, 3, 4, 5].map((num) => {
                const key = `description${num}` as keyof typeof inputs
                if (inputs?.[key] === undefined || inputs?.[key] === null) return null

                return (
                  <div key={num} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-neutral-300">Description {num}</label>
                      <button
                        type="button"
                        onClick={() => {
                          const newInputs = { ...inputs }
                          newInputs[key] = undefined
                          store.dispatch(setInputs({ formName: 'programForm', data: newInputs }))
                        }}
                        className="text-xs text-red-400 hover:text-red-300"
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
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
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
                  className="text-sm text-sky-400 hover:text-sky-300 font-medium"
                >
                  + Add Description
                </button>
              )}
            </div>
          </div>

          {/* Program Details */}
          <div className="mb-8">
            <h3 className="text-base font-semibold text-white mb-4">Program Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Age Group *</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="18"
                    value={typeof inputs?.ageGroup === 'string' ? inputs.ageGroup.split('-')[0] : '5'}
                    onChange={(e) => {
                      const minAge = parseInt(e.target.value)
                      const maxAge = typeof inputs?.ageGroup === 'string' ? parseInt(inputs.ageGroup.split('-')[1]) : 10
                      if (minAge < maxAge) {
                        handleSelectAgeGroup(`${minAge}-${maxAge}`)
                      }
                    }}
                    className="flex-1 h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <span className="text-white text-sm font-medium min-w-20 text-center">
                    {typeof inputs?.ageGroup === 'string' ? inputs.ageGroup : '5-10'}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="18"
                    value={typeof inputs?.ageGroup === 'string' ? inputs.ageGroup.split('-')[1] : '10'}
                    onChange={(e) => {
                      const maxAge = parseInt(e.target.value)
                      const minAge = typeof inputs?.ageGroup === 'string' ? parseInt(inputs.ageGroup.split('-')[0]) : 5
                      if (minAge < maxAge) {
                        handleSelectAgeGroup(`${minAge}-${maxAge}`)
                      }
                    }}
                    className="flex-1 h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
                {errors?.ageGroup && <p className="mt-2 text-sm text-red-400">{errors.ageGroup}</p>}
              </div>

              <div className="col-start-1">
                <label className="block text-sm font-medium text-neutral-300 mb-2">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={(inputs?.location as string) || ''}
                  onChange={handleInput}
                  placeholder="e.g., Boys & Girls Club of Lynn"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                {errors?.location && <p className="mt-2 text-sm text-red-400">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Frequency *</label>
                <select
                  name="frequency"
                  value={(inputs?.frequency as string) || ''}
                  onChange={handleSelect}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="">Select frequency</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Per Session">Per Session</option>
                </select>
                {errors?.frequency && <p className="mt-2 text-sm text-red-400">{errors.frequency}</p>}
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-neutral-300 mb-2">Image *</label>
            <div className="space-y-3">
              {/* Upload Area */}
              <div
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center px-6 py-8 border-2 border-dashed rounded-lg transition-colors ${
                  isUploading
                    ? 'border-neutral-700 bg-neutral-800/50 cursor-not-allowed'
                    : 'border-neutral-700 bg-neutral-800/30 hover:border-sky-500 hover:bg-sky-950/20 cursor-pointer'
                } ${errors.image ? 'border-red-500' : ''}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isUploading || isLoading}
                  className="hidden"
                />

                {isUploading ? (
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-sky-500/20">
                      <div className="h-6 w-6 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
                    </div>
                    <p className="text-sm text-sky-400 font-medium">Uploading...</p>
                    <div className="w-full bg-neutral-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-sky-500 h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-neutral-400">{Math.round(uploadProgress)}%</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-neutral-500 mx-auto mb-2" />
                    <p className="text-sm text-neutral-300">Click to upload image</p>
                    <p className="text-xs text-neutral-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
              </div>

              {/* Preview */}
              {previewImage && (
                <div className="relative inline-block">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-lg border border-neutral-700"
                  />
                  {!isUploading && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}

              {errors.image && <p className="text-xs text-red-500">{errors.image}</p>}
            </div>
          </div>

          {/* Schedule */}
          <div className="gap-4 mb-8">
            <div className="mb-8 space-y-4">
              <h3 className="text-base font-semibold text-white">Schedule</h3>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-3">Drop-Off Times</label>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-neutral-400 mb-2 block">Start</label>
                    <div className="flex flex-wrap gap-2">
                      {['7:00am', '7:30am', '8:00am', '8:30am', '9:00am', '9:30am', '10:00am'].map((time) => (
                        <button
                          key={`dropoff-start-${time}`}
                          type="button"
                          onClick={() => handleSelect({ name: 'dropOffStart', value: time })}
                          className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
                            inputs?.dropOffStart === time
                              ? 'bg-indigo-600 text-white'
                              : 'bg-neutral-800 text-neutral-300 border border-neutral-700 hover:border-indigo-500 hover:text-indigo-400'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 mb-2 block">End</label>
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
                                : 'bg-neutral-800 text-neutral-300 border border-neutral-700 hover:border-indigo-500 hover:text-indigo-400'
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
                <label className="block text-sm font-medium text-neutral-300 mb-3">Pick-Up Times</label>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-neutral-400 mb-2 block">Start</label>
                    <div className="flex flex-wrap gap-2">
                      {['3:00pm', '4:00pm', '5:00pm', '6:00pm'].map((time) => (
                        <button
                          key={`pickup-start-${time}`}
                          type="button"
                          onClick={() => handleSelect({ name: 'pickUpStart', value: time })}
                          className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
                            inputs?.pickUpStart === time
                              ? 'bg-indigo-600 text-white'
                              : 'bg-neutral-800 text-neutral-300 border border-neutral-700 hover:border-indigo-500 hover:text-indigo-400'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 mb-2 block">End</label>
                    <div className="flex flex-wrap gap-2">
                      {['3:30pm', '4:30pm', '5:30pm', '6:30pm'].map((time) => (
                        <button
                          key={`pickup-end-${time}`}
                          type="button"
                          onClick={() => handleSelect({ name: 'pickUpEnd', value: time })}
                          className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
                            inputs?.pickUpEnd === time
                              ? 'bg-indigo-600 text-white'
                              : 'bg-neutral-800 text-neutral-300 border border-neutral-700 hover:border-indigo-500 hover:text-indigo-400'
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
            <h3 className="text-base font-semibold text-white mb-4">Additional Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Dates Available</label>
                <input
                  type="text"
                  name="datesAvailable"
                  value={(inputs?.datesAvailable as string) || ''}
                  onChange={handleInput}
                  placeholder="e.g., TBA or June 1 - August 31"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">License Information</label>
                <input
                  type="text"
                  name="license"
                  value={(inputs?.license as string) || ''}
                  onChange={handleInput}
                  placeholder="e.g., EEC Licensed Ages 5-10"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Actions */}
      <div className="shrink-0 border-t border-neutral-700 bg-neutral-800 px-8 py-4">
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white transition-colors"
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
