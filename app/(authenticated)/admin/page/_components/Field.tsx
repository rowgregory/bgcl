import { PageField } from '@/types/common.types'
import { Check, Edit2, X } from 'lucide-react'
import { useState } from 'react'

export function Field({ field, onChange }: { field: PageField | any; onChange: (value: string | string[]) => void }) {
  const [isEditing, setIsEditing] = useState(false)

  // Hide modal_toggleModal field entirely
  if (field.id === 'modal_toggleModal') {
    return null
  }

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
          {field.value.map((item: string | number | readonly string[], i: number) => (
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
                  onClick={() => onChange(field?.value?.filter((_: any, idx: number) => idx !== i))}
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
