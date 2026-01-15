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
          <label className="text-sm font-medium text-neutral-400">
            {fieldName.charAt(0).toUpperCase() + fieldName.replace(/([A-Z])/g, ' $1').slice(1)}
          </label>
          <button
            onClick={() => setEditingField(isEditing ? null : fieldId)}
            className="p-1 hover:bg-neutral-800 rounded transition-colors"
          >
            {isEditing ? <Check className="w-4 h-4 text-green-400" /> : <Edit2 className="w-4 h-4 text-neutral-500" />}
          </button>
        </div>

        {type === 'textarea' ? (
          <textarea
            value={value}
            onChange={(e) => handleEdit(section, fieldName, e.target.value)}
            disabled={!isEditing}
            rows={4}
            className={`w-full px-3 py-2 bg-neutral-800 border rounded-lg text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isEditing ? 'border-indigo-500' : 'border-neutral-700'
            } ${!isEditing && 'cursor-not-allowed opacity-75'}`}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => handleEdit(section, fieldName, e.target.value)}
            disabled={!isEditing}
            className={`w-full px-3 py-2 bg-neutral-800 border rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isEditing ? 'border-indigo-500' : 'border-neutral-700'
            } ${!isEditing && 'cursor-not-allowed opacity-75'}`}
          />
        )}

        {isEditing && <p className="text-xs text-neutral-500 mt-1">Click the checkmark to confirm changes</p>}
      </div>
    )
  }

  const renderSection = (sectionId: string, sectionData: Record<string, any>): JSX.Element => {
    const isExpanded = expandedSections.includes(sectionId)

    return (
      <div key={sectionId} className="bg-neutral-900 rounded-lg border border-neutral-800 mb-4">
        <button
          onClick={() => toggleSection(sectionId)}
          className="w-full flex items-center justify-between p-4 hover:bg-neutral-800/50 transition-colors rounded-lg"
        >
          <div className="flex items-center gap-3">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-neutral-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-neutral-400" />
            )}
            <h3 className="text-base font-semibold text-white capitalize">
              {sectionId.replace(/([A-Z])/g, ' $1')} Section
            </h3>
          </div>
          <span className="text-xs text-neutral-500">{Object.keys(sectionData || {}).length} fields</span>
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
                      <div key={field} className="ml-4 pl-4 border-l-2 border-neutral-800">
                        <h4 className="text-sm font-medium text-neutral-400 mb-3 capitalize">{field}</h4>
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
                      <div key={field} className="ml-4 pl-4 border-l-2 border-neutral-800">
                        <h4 className="text-sm font-medium text-neutral-400 mb-3 capitalize">{field}</h4>
                        {value.map((item, index) => (
                          <div key={index} className="mb-4 p-3 bg-neutral-800/50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-neutral-500">Item {index + 1}</span>
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
    <div className="flex h-[calc(100vh-130px)] bg-neutral-950">
      {/* Left Panel - Editor */}
      <div
        className={`${isPreviewVisible ? 'w-1/2' : 'w-full'} border-r border-neutral-800 flex flex-col overflow-hidden transition-all`}
      >
        {/* Header */}
        <div className="bg-neutral-900 border-b border-neutral-800 px-6 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">Page Content Editor</h1>
        </div>

        {/* Content Editor */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {sections.map((section) => renderSection(section, content[section]))}
        </div>

        {/* Footer */}
        <div className="bg-neutral-900 border-t border-neutral-800 px-6 py-4 flex gap-3 justify-end relative">
          <div className="flex gap-2">
            <button
              onClick={() => setIsPreviewVisible(!isPreviewVisible)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-neutral-800 text-neutral-300 hover:text-white rounded-lg border border-neutral-700 transition-colors"
            >
              {isPreviewVisible ? <EyeOff size={16} /> : <Eye size={16} />}
              {isPreviewVisible ? 'Hide' : 'Show'} Preview
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Live Preview */}
      {isPreviewVisible && (
        <div className="w-1/2 bg-neutral-950 overflow-y-auto border-l border-neutral-800">
          <div className="p-12 max-w-2xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Preview</h2>
              <p className="text-sm text-neutral-400">Live preview of all sections</p>
            </div>

            {sections.map((section) =>
              Object.entries(content[section]).map(([key, value]) => {
                if (key === 'heading' && typeof value === 'string') {
                  return (
                    <h2 key={`${section}-${key}`} className="text-2xl font-bold text-white mb-4 mt-8 first:mt-0">
                      {value}
                    </h2>
                  )
                }

                if (key === 'subheading' && typeof value === 'string') {
                  return (
                    <p key={`${section}-${key}`} className="text-lg text-neutral-300 mb-6">
                      {value}
                    </p>
                  )
                }

                if (key === 'bodyText' && typeof value === 'string') {
                  return (
                    <p key={`${section}-${key}`} className="text-neutral-400 leading-relaxed mb-6">
                      {value}
                    </p>
                  )
                }

                if (key === 'stats' && typeof value === 'object') {
                  return (
                    <div key={`${section}-${key}`} className="grid grid-cols-3 gap-4 mb-6">
                      {Object.entries(value).map(([statKey, statValue]) => (
                        <div
                          key={statKey}
                          className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg text-center"
                        >
                          <p className="text-2xl font-bold text-indigo-500 mb-1">{statValue}</p>
                          <p className="text-sm text-neutral-400 capitalize">
                            {statKey.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )
                }

                if (key.startsWith('paragraph') && typeof value === 'string') {
                  return (
                    <p key={`${section}-${key}`} className="text-neutral-400 leading-relaxed mb-6">
                      {value}
                    </p>
                  )
                }

                if (key.startsWith('reason') && key.endsWith('Title') && typeof value === 'string') {
                  const number = key.slice(-1)
                  const description = content[section][`reason${number}Description`]
                  return (
                    <div
                      key={`${section}-${key}`}
                      className="mb-6 p-4 bg-neutral-900 border border-neutral-800 rounded-lg"
                    >
                      <p className="font-semibold text-white mb-2">{value}</p>
                      <p className="text-neutral-400 text-sm">{description}</p>
                    </div>
                  )
                }

                if (key.startsWith('bullet') && typeof value === 'string') {
                  return (
                    <div key={`${section}-${key}`} className="mb-3 flex gap-3">
                      <span className="text-indigo-500 font-bold">•</span>
                      <p className="text-neutral-400">{value}</p>
                    </div>
                  )
                }

                if (key === 'description' && typeof value === 'string') {
                  return (
                    <p key={`${section}-${key}`} className="text-neutral-400 leading-relaxed mb-6">
                      {value}
                    </p>
                  )
                }
                if (key === 'descriptionContinued' && typeof value === 'string') {
                  return (
                    <p key={`${section}-${key}`} className="text-neutral-400 leading-relaxed mb-6">
                      {value}
                    </p>
                  )
                }

                if (key.startsWith('testimonial') && key.endsWith('Author') === false && typeof value === 'string') {
                  const number = key.slice(-1)
                  const author = content[section][`testimonial${number}Author`]
                  return (
                    <div
                      key={`${section}-${key}`}
                      className="mb-4 p-4 bg-neutral-900 border border-neutral-800 rounded-lg"
                    >
                      <p className="text-neutral-300 italic mb-2">"{value}"</p>
                      <p className="text-sm text-neutral-500">— {author}</p>
                    </div>
                  )
                }

                if (key.startsWith('question') && typeof value === 'string') {
                  const number = key.slice(-1)
                  const answer = content[section][`answer${number}`]
                  return (
                    <div
                      key={`${section}-${key}`}
                      className="mb-4 p-4 bg-neutral-900 border border-neutral-800 rounded-lg"
                    >
                      <p className="font-semibold text-white mb-2">{value}</p>
                      <p className="text-neutral-400 text-sm">{answer}</p>
                    </div>
                  )
                }

                if (key === 'placeholderText' && typeof value === 'string') {
                  return (
                    <div key={`${section}-${key}`} className="flex gap-2 mb-6">
                      <input
                        type="email"
                        placeholder={value}
                        className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm"
                      />
                      <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
                        {content[section].buttonText}
                      </button>
                    </div>
                  )
                }

                if (key === 'buttonText' && typeof value === 'string' && section !== 'newsletter') {
                  return (
                    <button
                      key={`${section}-${key}`}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                    >
                      {value}
                    </button>
                  )
                }

                return null
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
