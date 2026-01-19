import { FC, JSX, useState } from 'react'
import { Eye, EyeOff, Edit2, Check, ChevronDown, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

interface PageContent {
  [key: string]: Record<string, any>
}

interface PageContentEditorProps {
  initialContent: PageContent | null
  onSave: (content: PageContent) => Promise<void>
}

export const PageContentEditor: FC<PageContentEditorProps> = ({ initialContent, onSave }) => {
  const [content, setContent] = useState<PageContent>(initialContent ?? {}) as any
  const [expandedSections, setExpandedSections] = useState<string[] | null>(Object.keys(initialContent ?? {}) || null)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [isPreviewVisible, setIsPreviewVisible] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const sections = Object.keys(content ?? {})

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((s) => s !== sectionId) : [...prev, sectionId]
    )
  }

  const handleEdit = (section: string, fieldPath: string, value: string) => {
    const newContent = structuredClone(content)
    const pathParts = fieldPath.split('.')
    let current = newContent[section]

    for (let i = 0; i < pathParts.length - 1; i++) {
      if (!current[pathParts[i]]) {
        current[pathParts[i]] = {}
      }
      current = current[pathParts[i]]
    }

    current[pathParts[pathParts.length - 1]] = value
    setContent(newContent)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(content)
    } finally {
      setIsSaving(false)
    }
  }

  const renderField = (
    section: string,
    fieldName: string,
    value: string,
    type: 'text' | 'textarea' = 'text'
  ): JSX.Element => {
    const fieldId = `${section}-${fieldName}`
    const isEditing = editingField === fieldId

    return (
      <div key={fieldId} className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium dark:text-neutral-400 text-neutral-600">
            {fieldName.charAt(0).toUpperCase() + fieldName.replace(/([A-Z])/g, ' $1').slice(1)}
          </label>
          <button
            onClick={() => setEditingField(isEditing ? null : fieldId)}
            className="p-1 dark:hover:bg-neutral-800 hover:bg-neutral-200 rounded transition-colors"
          >
            {isEditing ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Edit2 className="w-4 h-4 dark:text-neutral-500 text-neutral-400" />
            )}
          </button>
        </div>

        {type === 'textarea' ? (
          <textarea
            value={value}
            onChange={(e) => handleEdit(section, fieldName, e.target.value)}
            disabled={!isEditing}
            rows={4}
            className={`w-full px-3 py-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-100 border-neutral-300 text-neutral-900 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-500 ${
              isEditing ? 'dark:border-sky-500 border-sky-500' : 'dark:border-neutral-700 border-neutral-300'
            } ${!isEditing && 'cursor-not-allowed opacity-75'}`}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => handleEdit(section, fieldName, e.target.value)}
            disabled={!isEditing}
            className={`w-full px-3 py-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-100 border-neutral-300 text-neutral-900 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${
              isEditing ? 'dark:border-sky-500 border-sky-500' : 'dark:border-neutral-700 border-neutral-300'
            } ${!isEditing && 'cursor-not-allowed opacity-75'}`}
          />
        )}

        {isEditing && (
          <p className="text-xs dark:text-neutral-500 text-neutral-500 mt-1">Click the checkmark to confirm changes</p>
        )}
      </div>
    )
  }

  const renderSection = (sectionId: string, sectionData: Record<string, any>): JSX.Element => {
    const isExpanded = expandedSections.includes(sectionId)

    return (
      <div
        key={sectionId}
        className="dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 border-neutral-200 rounded-lg border mb-4"
      >
        <button
          onClick={() => toggleSection(sectionId)}
          className="w-full flex items-center justify-between p-4 dark:hover:bg-neutral-800/50 hover:bg-neutral-100/50 transition-colors rounded-lg"
        >
          <div className="flex items-center gap-3">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 dark:text-neutral-400 text-neutral-600" />
            ) : (
              <ChevronRight className="w-5 h-5 dark:text-neutral-400 text-neutral-600" />
            )}
            <h3 className="text-base font-semibold dark:text-white text-neutral-900 capitalize">
              {sectionId.replace(/([A-Z])/g, ' $1')} Section
            </h3>
          </div>
          <span className="text-xs dark:text-neutral-500 text-neutral-600">
            {Object.keys(sectionData || {}).length} fields
          </span>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0 space-y-2">
                {Object.entries(sectionData).map(([field, value]) => {
                  if (typeof value === 'string') {
                    return renderField(sectionId, field, value, value.length > 100 ? 'textarea' : 'text')
                  } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    return (
                      <div key={field} className="ml-4 pl-4 dark:border-neutral-800 border-neutral-300 border-l-2">
                        <h4 className="text-sm font-medium dark:text-neutral-400 text-neutral-600 mb-3 capitalize">
                          {field}
                        </h4>
                        {Object.entries(value as Record<string, unknown>).map(([subField, subValue]) => (
                          <div key={subField}>
                            {typeof subValue === 'string' &&
                              renderField(sectionId, `${field}.${subField}`, subValue, 'text')}
                          </div>
                        ))}
                      </div>
                    )
                  } else if (Array.isArray(value)) {
                    return (
                      <div key={field} className="ml-4 pl-4 dark:border-neutral-800 border-neutral-300 border-l-2">
                        <h4 className="text-sm font-medium dark:text-neutral-400 text-neutral-600 mb-3 capitalize">
                          {field}
                        </h4>
                        {value.map((item, index) => (
                          <div key={index} className="mb-4 p-3 dark:bg-neutral-800/50 bg-neutral-100/50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs dark:text-neutral-500 text-neutral-600">Item {index + 1}</span>
                            </div>
                            {typeof item === 'string'
                              ? renderField(sectionId, `${field}[${index}]`, item, 'text')
                              : Object.entries(item as Record<string, unknown>).map(([itemField, itemValue]) => (
                                  <div key={itemField}>
                                    {typeof itemValue === 'string' &&
                                      renderField(sectionId, `${field}[${index}].${itemField}`, itemValue, 'text')}
                                  </div>
                                ))}
                          </div>
                        ))}
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-130px)] dark:bg-neutral-950 bg-white">
      {/* Left Panel - Editor */}
      <div
        className={`${isPreviewVisible ? 'w-1/2' : 'w-full'} dark:border-neutral-800 border-neutral-200 border-r flex flex-col overflow-hidden transition-all`}
      >
        {/* Header */}
        <div className="dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border-b px-6 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold dark:text-white text-neutral-900">Page Content Editor</h1>
        </div>

        {/* Content Editor */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {sections.map((section) => renderSection(section, content[section]))}
        </div>

        {/* Footer */}
        <div className="dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border-t px-6 py-4 flex gap-3 justify-end relative">
          <div className="flex gap-2">
            <button
              onClick={() => setIsPreviewVisible(!isPreviewVisible)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium dark:bg-neutral-800 dark:text-neutral-300 dark:hover:text-white dark:border-neutral-700 bg-neutral-200 text-neutral-700 hover:text-neutral-900 border-neutral-300 rounded-lg border transition-colors"
            >
              {isPreviewVisible ? <EyeOff size={16} /> : <Eye size={16} />}
              {isPreviewVisible ? 'Hide' : 'Show'} Preview
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 text-sm font-medium dark:bg-sky-600 dark:hover:bg-sky-700 dark:disabled:bg-sky-600/50 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Live Preview */}
      {isPreviewVisible && (
        <div className="w-1/2 dark:bg-neutral-950 dark:border-neutral-800 bg-white border-neutral-200 border-l overflow-y-auto">
          <div className="p-12 max-w-2xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold dark:text-white text-neutral-900 mb-2">Preview</h2>
              <p className="text-sm dark:text-neutral-400 text-neutral-600">Live preview of all sections</p>
            </div>

            {Object.entries(content).map(([section, sectionData]) => {
              if (typeof sectionData !== 'object' || sectionData === null) return null

              const data = sectionData as Record<string, any>

              return (
                <div key={section} className="mb-12">
                  {/* Subheading */}
                  {data.subheading && (
                    <p className="text-sm dark:text-neutral-500 text-neutral-600 uppercase tracking-widest mb-2">
                      {data.subheading}
                    </p>
                  )}

                  {/* Heading */}
                  {data.heading && (
                    <h2 className="text-3xl font-bold dark:text-white text-neutral-900 mb-4">{data.heading}</h2>
                  )}

                  <div className="flex items-center gap-x-2">
                    {data.heading1 && (
                      <h2 className="text-3xl font-bold dark:text-white text-neutral-900 mb-4">{data.heading1}</h2>
                    )}
                    {data.heading2 && (
                      <h2 className="text-3xl font-bold dark:text-white text-neutral-900 mb-4">{data.heading2}</h2>
                    )}
                  </div>

                  {/* Body Text */}
                  {data.bodyText && (
                    <p className="dark:text-neutral-300 text-neutral-700 leading-relaxed mb-6">{data.bodyText}</p>
                  )}

                  {/* Paragraphs */}
                  {Object.entries(data)
                    .filter(([key]) => key.startsWith('paragraph'))
                    .map(([key, value]) => (
                      <p
                        key={`${section}-${key}`}
                        className="dark:text-neutral-400 text-neutral-700 leading-relaxed mb-6"
                      >
                        {value}
                      </p>
                    ))}

                  {/* CTA Text */}
                  {data.ctaText && (
                    <p className="dark:text-neutral-300 text-neutral-700 italic mb-6 p-4 dark:bg-neutral-900/50 dark:border-neutral-800 bg-neutral-100/50 border-neutral-300 border rounded-lg">
                      {data.ctaText}
                    </p>
                  )}

                  {/* Stats */}
                  {Object.entries(data).filter(([key]) => key.startsWith('stat')).length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {Object.entries(data)
                        .filter(([key]) => key.startsWith('stat'))
                        .map(([statKey, statItem]: [string, any]) => (
                          <div
                            key={statKey}
                            className="dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 border-neutral-200 p-4 rounded-lg text-center border"
                          >
                            <p className="text-2xl font-bold text-sky-500 mb-1">{statItem.value1}</p>
                            <p className="text-sm dark:text-neutral-300 text-neutral-700 font-semibold mb-1">
                              {statItem.value2}
                            </p>
                            <p className="text-xs dark:text-neutral-500 text-neutral-600">{statItem.value3}</p>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Buttons */}
                  {Object.entries(data)
                    .filter(([key]) => {
                      const isButton = key.includes('button') && key.includes('Text')
                      return isButton && typeof data[key] === 'string'
                    })
                    .map(([key, value]) => (
                      <button
                        key={`${section}-${key}`}
                        className="mr-4 mb-4 px-6 py-3 dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors"
                      >
                        {value}
                      </button>
                    ))}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
