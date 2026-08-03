'use client'

import uploadFileToFirebase from '@/lib/utils/uploadFileToFirebase'
import { useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import type { JobApplicationFormInput } from '@/lib/validations/job-application.validation'

const MAX_SIZE = 10 * 1024 * 1024 // 10MB
const VALID_TYPES = ['application/pdf']

export function Step5Resume() {
  const {
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors }
  } = useFormContext<JobApplicationFormInput>()

  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Subscribe to the upload-related form values
  const resumeUrl = watch('resumeUrl')
  const resumeFileName = watch('resumeFileName')
  const resumeFileSize = watch('resumeFileSize')

  const handleUpload = async (file: File) => {
    if (!VALID_TYPES.includes(file.type)) {
      setError('resumeUrl', { message: 'Please upload a PDF' })
      return
    }

    if (file.size > MAX_SIZE) {
      setError('resumeUrl', { message: 'File size must be less than 10MB' })
      return
    }

    try {
      setUploading(true)
      setUploadProgress(0)
      clearErrors('resumeUrl')

      const downloadUrl = await uploadFileToFirebase(file, (progress) => setUploadProgress(progress), 'document')

      // shouldValidate so the step-level trigger sees the new value immediately
      setValue('resumeUrl', downloadUrl, { shouldValidate: true, shouldDirty: true })
      setValue('resumeFileName', file.name, { shouldDirty: true })
      setValue('resumeFileSize', file.size, { shouldDirty: true })
      setValue('resumeUploadedAt', new Date().toISOString(), { shouldDirty: true })

      setUploadProgress(100)
    } catch (error) {
      setError('resumeUrl', {
        message: error instanceof Error ? error.message : 'Failed to upload resume'
      })
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) handleUpload(files[0])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) handleUpload(files[0])
  }

  const removeFile = () => {
    setValue('resumeUrl', '', { shouldValidate: true, shouldDirty: true })
    setValue('resumeFileName', undefined, { shouldDirty: true })
    setValue('resumeFileSize', undefined, { shouldDirty: true })
    setValue('resumeUploadedAt', undefined, { shouldDirty: true })
    clearErrors('resumeUrl')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-6">
      {/* Info Box */}
      <div
        role="note"
        className="dark:bg-sky-500/10 dark:border-sky-500/30 bg-sky-100 border-sky-300 rounded-lg p-4 border"
      >
        <p className="dark:text-sky-300 text-sky-700 text-sm">
          <span aria-hidden="true">💼 </span>
          <span className="sr-only">Note: </span>
          Upload your resume so we can review your complete work history and qualifications.
        </p>
      </div>

      {/* Upload Area */}
      {!resumeUrl ? (
        <motion.div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
            dragActive
              ? 'dark:border-sky-500 dark:bg-sky-500/10 border-sky-500 bg-sky-100'
              : 'dark:border-neutral-700 dark:bg-neutral-900/50 dark:hover:border-neutral-600 border-neutral-300 bg-neutral-100 hover:border-neutral-400'
          }`}
          role="region"
          aria-label="Resume upload area"
        >
          <label htmlFor="resume-upload" className="sr-only">
            Upload resume (PDF, max 10 MB)
          </label>
          <input
            id="resume-upload"
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            disabled={uploading}
            aria-disabled={uploading}
            aria-describedby="resume-format-hint resume-error"
            className="sr-only"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            aria-disabled={uploading}
            aria-controls="resume-upload"
            className="w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded-lg disabled:cursor-not-allowed"
          >
            <div className="space-y-3 pointer-events-none">
              <div className="text-4xl" aria-hidden="true">
                📄
              </div>
              <p className="dark:text-white text-neutral-900 font-semibold">
                {uploading ? 'Uploading…' : 'Drop your resume here or click to browse'}
              </p>
              <p id="resume-format-hint" className="dark:text-neutral-400 text-neutral-600 text-sm">
                Supported format: PDF. Maximum file size: 10 MB.
              </p>
            </div>
          </button>

          {/* Upload Progress */}
          {uploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 space-y-2"
              aria-live="polite"
              aria-atomic="true"
            >
              <div
                role="progressbar"
                aria-valuenow={Math.round(uploadProgress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Upload progress: ${Math.round(uploadProgress)}%`}
                className="h-2 dark:bg-neutral-700 bg-neutral-300 rounded-full overflow-hidden"
              >
                <motion.div
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-linear-to-r from-sky-500 to-sky-600 rounded-full"
                />
              </div>
              <p className="dark:text-sky-400 text-sky-600 text-sm font-medium" aria-hidden="true">
                {Math.round(uploadProgress)}%
              </p>
            </motion.div>
          )}
        </motion.div>
      ) : (
        /* Uploaded File Display */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          role="region"
          aria-label="Uploaded resume"
          aria-live="polite"
          className="dark:bg-emerald-500/10 dark:border-emerald-500/30 bg-emerald-100 border-emerald-300 rounded-lg p-6 space-y-4 border"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div aria-hidden="true" className="text-2xl">
                ✓
              </div>
              <div>
                <p className="dark:text-white text-neutral-900 font-semibold">
                  <span className="sr-only">Status: </span>Resume uploaded successfully
                </p>
                <p className="dark:text-emerald-400 text-emerald-700 text-sm mt-1">
                  <span className="sr-only">File name: </span>
                  {resumeFileName}
                </p>
                {resumeFileSize != null && (
                  <p className="dark:text-neutral-400 text-neutral-600 text-xs mt-1">
                    <span className="sr-only">File size: </span>
                    {(resumeFileSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={removeFile}
              aria-label={`Remove ${resumeFileName}`}
              className="dark:text-red-400 dark:hover:text-red-300 text-red-600 hover:text-red-700 font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 rounded"
            >
              Remove
            </button>
          </div>

          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${resumeFileName} (opens in new tab)`}
            className="inline-flex items-center gap-2 dark:text-sky-400 dark:hover:text-sky-300 text-sky-600 hover:text-sky-700 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded"
          >
            View Resume
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </motion.div>
      )}

      {/* Error Message */}
      {errors.resumeUrl && (
        <motion.div
          id="resume-error"
          role="alert"
          aria-live="assertive"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 dark:bg-red-500/10 dark:border-red-500/30 bg-red-100 border-red-300 rounded-lg dark:text-red-400 text-red-700 text-sm border"
        >
          {errors.resumeUrl.message}
        </motion.div>
      )}

      {/* Required Info Box */}
      <div
        role="note"
        className="dark:bg-neutral-800 dark:border-neutral-700 bg-neutral-200 border-neutral-300 rounded-lg p-4 border"
      >
        <p className="dark:text-neutral-300 text-neutral-700 text-sm">
          <span aria-hidden="true">📌 </span>
          <strong>Required:</strong> Your resume is essential for us to review your qualifications and complete your
          application.
        </p>
      </div>
    </div>
  )
}
