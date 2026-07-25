import { ChangeEvent, FC, useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import uploadFileToFirebase from '@/app/lib/utils/uploadFileToFirebase'
import { store } from '@/app/lib/store/store'
import { setInputs } from '@/app/lib/store/slices/formSlice'

interface ImageUploadProps {
  inputs: any
  isLoading: boolean
  errors: {
    image?: string
  }
  formName: string
  fieldName: string
}

const ImageUpload: FC<ImageUploadProps> = ({ inputs, isLoading, errors, formName, fieldName }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string>(inputs[fieldName] || '')

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 10 * 1024 * 1024) {
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
          formName,
          data: { [fieldName]: downloadURL }
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
        formName,
        data: { [fieldName]: '' }
      })
    )
    setPreviewImage('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 capitalize">
        {fieldName}
      </label>
      <div className="space-y-3">
        {/* Upload Area */}
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center px-6 py-8 border-2 border-dashed rounded-lg transition-colors ${
            isUploading
              ? 'border-neutral-300 dark:border-neutral-700 bg-neutral-100/50 dark:bg-neutral-800/50 cursor-not-allowed'
              : 'border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/30 hover:border-sky-500 hover:bg-sky-50 dark:hover:border-sky-500 dark:hover:bg-sky-950/20 cursor-pointer'
          } ${errors[fieldName] ? 'border-red-500' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.gif"
            onChange={handleImageChange}
            disabled={isUploading || isLoading}
            className="hidden"
          />

          {isUploading ? (
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-sky-500/20">
                <div className="h-6 w-6 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
              </div>
              <p className="text-sm text-sky-600 dark:text-sky-400 font-medium">Uploading...</p>
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-sky-500 h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">{Math.round(uploadProgress)}%</p>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="h-8 w-8 text-neutral-400 dark:text-neutral-500 mx-auto mb-2" />
              <p className="text-sm text-neutral-700 dark:text-neutral-300">Click to upload image</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">PNG, JPG, GIF up to 10MB</p>
            </div>
          )}
        </div>

        {/* Preview */}
        {previewImage && (
          <div className="relative inline-block">
            <img
              src={previewImage}
              alt="Preview"
              className="h-32 w-32 object-cover rounded-lg border border-neutral-200 dark:border-neutral-700"
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

        {errors[fieldName] && <p className="text-xs text-red-500">{errors[fieldName]}</p>}
      </div>
    </div>
  )
}

export default ImageUpload
