'use client'

import { FC, useRef, useState, ChangeEvent } from 'react'
import { Upload, X } from 'lucide-react'
import { IForm } from '@/types/common'
import uploadFileToFirebase from '@/app/lib/firebase/uploadFileToFirebase'
import { store } from '@/app/lib/store/store'
import { setInputs } from '@/app/lib/store/slices/formSlice'

export const TeamMemberForm: FC<IForm> = ({
  errors,
  handleInput,
  handleSubmit,
  handleSelect,
  inputs,
  isLoading,
  isUpdating,
  onClose
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string>(inputs?.image || '')

  const isYouth = inputs?.role === 'youth'
  const isStaff = ['admin_staff', 'program_staff'].includes(inputs.role)

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
          formName: 'teamMemberForm',
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
        formName: 'teamMemberForm',
        data: { image: '' }
      })
    )
    setPreviewImage('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-neutral-800 border-b border-neutral-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-100">
            {isUpdating ? 'Edit Team Member' : 'Add Team Member'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-neutral-900">
        <div className="max-w-5xl mx-auto p-8">
          {/* Basic Info Section */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Name *</label>
              <input
                type="text"
                name="name"
                value={inputs?.name || ''}
                onChange={handleInput}
                placeholder="Full name"
                className={`w-full px-3 py-2 bg-neutral-800 border rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none transition-colors ${
                  errors.name ? 'border-red-500 focus:border-red-500' : 'border-neutral-700 focus:border-sky-500'
                }`}
                disabled={isLoading}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Role *</label>
              <select
                name="role"
                value={inputs?.role || ''}
                onChange={handleSelect}
                className={`w-full px-3 py-2 bg-neutral-800 border rounded-lg text-neutral-100 focus:outline-none transition-colors ${
                  errors.role ? 'border-red-500 focus:border-red-500' : 'border-neutral-700 focus:border-sky-500'
                }`}
                disabled={isLoading}
              >
                <option value="">Select a role</option>
                <option value="officer">Officer</option>
                <option value="director">Director</option>
                <option value="corporator">Corporator</option>
                <option value="admin_staff">Admin Staff</option>
                <option value="program_staff">Program Staff</option>
                <option value="maintenance_staff">Maintenance & Facility Staff</option>
                <option value="honoree">Honoree</option>
                <option value="youth">Youth</option>
              </select>
              {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
            </div>

            {/* Title */}
            {inputs.role !== 'director' && inputs.role !== 'corporator' && (
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={inputs?.title || ''}
                  onChange={handleInput}
                  placeholder="Job title or position"
                  className={`w-full px-3 py-2 bg-neutral-800 border rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none transition-colors ${
                    errors.title ? 'border-red-500 focus:border-red-500' : 'border-neutral-700 focus:border-sky-500'
                  }`}
                  disabled={isLoading}
                />
              </div>
            )}

            {isStaff && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={inputs?.phone || ''}
                    onChange={handleInput}
                    placeholder="Full phone"
                    className={`w-full px-3 py-2 bg-neutral-800 border rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none transition-colors ${
                      errors.phone ? 'border-red-500 focus:border-red-500' : 'border-neutral-700 focus:border-sky-500'
                    }`}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Email</label>
                  <input
                    type="text"
                    name="email"
                    value={inputs?.email || ''}
                    onChange={handleInput}
                    placeholder="Full email"
                    className={`w-full px-3 py-2 bg-neutral-800 border rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none transition-colors ${
                      errors.email ? 'border-red-500 focus:border-red-500' : 'border-neutral-700 focus:border-sky-500'
                    }`}
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Position */}
            {inputs.role !== 'corporator' &&
              inputs.role !== 'admin_staff' &&
              inputs.role !== 'program_staff' &&
              inputs.role !== 'maintenance_staff' &&
              inputs.role !== 'honoree' &&
              inputs.role !== 'youth' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={inputs?.company || ''}
                    onChange={handleInput}
                    placeholder="Job company or company"
                    className={`w-full px-3 py-2 bg-neutral-800 border rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none transition-colors ${
                      errors.company ? 'border-red-500 focus:border-red-500' : 'border-neutral-700 focus:border-sky-500'
                    }`}
                    disabled={isLoading}
                  />
                </div>
              )}

            {/* Image Upload */}
            {['admin_staff', 'program_staff', 'youth', 'honoree'].includes(inputs.role) && (
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Image</label>
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
                </div>
              </div>
            )}
          </div>

          {/* Youth of the Year Section */}
          {isYouth && (
            <div className="space-y-4 border-t border-neutral-700 pt-6">
              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Year</label>
                <input
                  type="number"
                  name="year"
                  value={inputs?.year || new Date().getFullYear()}
                  onChange={handleInput}
                  className={`w-full px-3 py-2 bg-neutral-800 border rounded-lg text-neutral-100 focus:outline-none transition-colors ${
                    errors.year ? 'border-red-500 focus:border-red-500' : 'border-neutral-700 focus:border-sky-500'
                  }`}
                  disabled={isLoading}
                />
              </div>

              {/* Paragraph 1 */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Paragraph 1</label>
                <textarea
                  name="paragraph1"
                  value={inputs?.paragraph1 || ''}
                  onChange={handleInput}
                  placeholder="First paragraph of their story"
                  rows={4}
                  className={`w-full px-3 py-2 bg-neutral-800 border rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none transition-colors ${
                    errors.paragraph1
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-neutral-700 focus:border-sky-500'
                  }`}
                  disabled={isLoading}
                />
              </div>

              {/* Paragraph 2 */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Paragraph 2</label>
                <textarea
                  name="paragraph2"
                  value={inputs?.paragraph2 || ''}
                  onChange={handleInput}
                  placeholder="Second paragraph of their story"
                  rows={4}
                  className={`w-full px-3 py-2 bg-neutral-800 border rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none transition-colors ${
                    errors.paragraph2
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-neutral-700 focus:border-sky-500'
                  }`}
                  disabled={isLoading}
                />
              </div>

              {/* Paragraph 3 */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Paragraph 3</label>
                <textarea
                  name="paragraph3"
                  value={inputs?.paragraph3 || ''}
                  onChange={handleInput}
                  placeholder="Third paragraph of their story (optional)"
                  rows={4}
                  className={`w-full px-3 py-2 bg-neutral-800 border rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none transition-colors ${
                    errors.paragraph3
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-neutral-700 focus:border-sky-500'
                  }`}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Footer with Submit Button */}
      <div className="shrink-0 border-t border-neutral-700 bg-neutral-800 px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-100 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {isLoading
              ? 'Saving...'
              : isUploading
                ? 'Uploading...'
                : isUpdating
                  ? `Update ${inputs.role}`
                  : `Create ${inputs.role}`}
          </button>
        </div>
      </div>
    </form>
  )
}
