import uploadFileToFirebase from '@/lib/utils/uploadFileToFirebase'
import { AlertCircle, CheckCircle2, Film, ImageIcon, Play } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface UploadZoneProps {
  type: 'image' | 'video'
  currentUrl: string
  onUploadComplete: (url: string) => void
  label: string
}

export const UploadZone = ({ type, currentUrl, onUploadComplete, label }: UploadZoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const accept =
    type === 'video'
      ? 'video/mp4,video/webm,video/quicktime,.mov,.mp4,.webm'
      : 'image/jpeg,image/png,image/webp,image/gif'
  const maxMb = type === 'video' ? 200 : 10

  const handleFile = useCallback(
    async (file: File) => {
      const mb = file.size / 1024 / 1024
      if (mb > maxMb) {
        setError(`File too large. Max ${maxMb}MB.`)
        return
      }
      setError(null)
      setUploading(true)
      setProgress(0)
      setDone(false)
      try {
        const url = await uploadFileToFirebase(file, (p) => setProgress(p), type)
        setProgress(100)
        setDone(true)
        onUploadComplete(url)
      } catch {
        setError('Upload failed. Please try again.')
      } finally {
        setUploading(false)
      }
    },
    [type, maxMb, onUploadComplete]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider">{label}</p>

      {/* Current media preview */}
      {currentUrl && !uploading && (
        <div className="relative rounded-lg overflow-hidden border dark:border-neutral-700 border-neutral-200 h-40">
          {type === 'video' ? (
            <video src={currentUrl} className="w-full h-full object-cover" muted playsInline />
          ) : (
            <img src={currentUrl} alt="Current hero background" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
            {type === 'video' && <Play className="w-5 h-5 text-white" aria-hidden="true" />}
            <span className="text-white text-xs font-semibold bg-black/50 px-2 py-1 rounded">Current {type}</span>
          </div>
        </div>
      )}

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        aria-label={`Upload ${type}`}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-5 cursor-pointer transition-all duration-200
          flex flex-col items-center justify-center gap-3 min-h-24
          ${
            isDragging
              ? 'border-sky-500 bg-sky-500/5'
              : 'dark:border-neutral-700 border-neutral-300 dark:hover:border-neutral-500 hover:border-neutral-400 dark:bg-neutral-900/50 bg-neutral-50'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {uploading ? (
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between text-xs dark:text-neutral-400 text-neutral-500">
              <span className="font-medium">Uploading...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-1.5 dark:bg-neutral-800 bg-neutral-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-sky-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        ) : done ? (
          <div className="flex items-center gap-2 text-emerald-500">
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            <span className="text-sm font-semibold">Upload complete</span>
          </div>
        ) : (
          <>
            <div className="w-9 h-9 rounded-lg dark:bg-neutral-800 bg-neutral-200 flex items-center justify-center">
              {type === 'video' ? (
                <Film className="w-4 h-4 dark:text-neutral-400 text-neutral-500" aria-hidden="true" />
              ) : (
                <ImageIcon className="w-4 h-4 dark:text-neutral-400 text-neutral-500" aria-hidden="true" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold dark:text-neutral-300 text-neutral-700">
                {isDragging ? `Drop ${type} here` : `Click or drag ${type}`}
              </p>
              <p className="text-xs dark:text-neutral-500 text-neutral-400 mt-0.5">
                {type === 'video' ? 'MP4, WebM, MOV' : 'JPG, PNG, WebP'} · Max {maxMb}MB
              </p>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-500 text-xs">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
