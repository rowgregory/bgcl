import { useState } from 'react'
import { Check, ChevronDown, ChevronRight, Edit2, Eye, EyeOff, X } from 'lucide-react'
import { PageField } from '@/types/common'
import { RightPanel } from '../admin/star-map/RightPanel'

export function Field({ field, onChange }: { field: PageField | any; onChange: (value: string | string[]) => void }) {
  const [isEditing, setIsEditing] = useState(false)

  if (field.type === 'array' && Array.isArray(field.value)) {
    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{field.label}</label>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded"
          >
            {isEditing ? (
              <Check className="w-4 h-4 text-green-500 dark:text-green-400" />
            ) : (
              <Edit2 className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            )}
          </button>
        </div>
        <div className="space-y-2">
          {field.value.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={item}
                onChange={(e) => {
                  const newArray = [...field.value]
                  newArray[i] = e.target.value
                  onChange(newArray)
                }}
                disabled={!isEditing}
                className={`flex-1 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border rounded-lg text-neutral-900 dark:text-white text-sm ${
                  isEditing ? 'border-sky-500' : 'border-neutral-300 dark:border-neutral-700 opacity-75'
                }`}
              />
              {isEditing && (
                <button
                  onClick={() => onChange(field?.value?.filter((_, idx) => idx !== i))}
                  className="px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {isEditing && (
            <button
              onClick={() => onChange([...field.value, ''])}
              className="w-full px-3 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm"
            >
              + Add Item
            </button>
          )}
        </div>
      </div>
    )
  }

  const InputComponent = field.type === 'textarea' ? 'textarea' : 'input'

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{field.label}</label>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded"
        >
          {isEditing ? (
            <Check className="w-4 h-4 text-green-500 dark:text-green-400" />
          ) : (
            <Edit2 className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
          )}
        </button>
      </div>
      <InputComponent
        type={field.type === 'textarea' ? undefined : field.type}
        value={field.value as string}
        onChange={(e) => onChange(e.target.value)}
        disabled={!isEditing}
        rows={field.type === 'textarea' ? 4 : undefined}
        className={`w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border rounded-lg text-neutral-900 dark:text-white text-sm ${
          field.type === 'textarea' ? 'resize-none' : ''
        } ${isEditing ? 'border-sky-500' : 'border-neutral-300 dark:border-neutral-700 opacity-75'}`}
      />
    </div>
  )
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors"
      >
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
        )}
        <h3 className="text-base font-semibold text-neutral-900 dark:text-white capitalize">{title}</h3>
      </button>
      {isOpen && <div className="p-4 pt-0 space-y-4">{children}</div>}
    </div>
  )
}

export function PageContentEditor({
  fields,
  onSave,
  isLoading
}: {
  fields: PageField[]
  onSave: any
  isLoading: boolean
}) {
  const [content, setContent] = useState(fields)
  const [isPreviewVisible, setIsPreviewVisible] = useState(true)

  if (!fields || !Array.isArray(fields)) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-950">
        <div className="text-center">
          <p className="text-neutral-400 mb-2">Invalid page content format</p>
          <pre className="text-xs text-neutral-600">{JSON.stringify(fields, null, 2)}</pre>
        </div>
      </div>
    )
  }
  const sections = Array.from(new Set(content.map((f) => f.section)))

  const updateField = (id: string, newValue: string | string[]) => {
    setContent((prev) => prev.map((f) => (f.id === id ? { ...f, value: newValue } : f)))
  }

  return (
    <div className="h-[calc(100dvh-62px)] flex flex-col md:flex-row bg-white dark:bg-neutral-950 pt-16.25">
      {/* Editor */}
      <div
        className={`${isPreviewVisible ? 'md:w-1/2' : 'w-full'} flex flex-col border-r dark:border-neutral-800 border-neutral-200`}
      >
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {sections.map((section) => (
            <Section key={section} title={section}>
              {content
                ?.filter((f) => f.section === section)
                ?.map((field) => (
                  <Field key={field.id} field={field} onChange={(v) => updateField(field.id, v)} />
                ))}
            </Section>
          ))}
        </div>

        {/* Footer - Fixed at Bottom */}
        <div className="shrink-0 bg-neutral-100 dark:bg-neutral-900 border-t dark:border-neutral-800 border-neutral-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:justify-end">
            <button
              onClick={() => setIsPreviewVisible(!isPreviewVisible)}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-lg border border-neutral-300 dark:border-neutral-700 transition-colors w-full md:w-fit"
            >
              {isPreviewVisible ? <EyeOff size={16} /> : <Eye size={16} />}
              {isPreviewVisible ? 'Hide' : 'Show'} Preview
            </button>

            <button
              onClick={() => onSave(content)}
              disabled={isLoading}
              className="px-6 py-2 text-sm font-medium bg-sky-600 hover:bg-sky-700 disabled:bg-sky-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors w-full md:w-fit"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Preview */}
      {isPreviewVisible && <RightPanel fields={content} />}
    </div>
  )
}
