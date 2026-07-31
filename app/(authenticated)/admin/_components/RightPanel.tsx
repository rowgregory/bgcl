import { PageField } from '@/types/common.types'

export function RightPanel({ fields }: { fields: PageField[] }) {
  const sections = Array.from(new Set(fields.map((f) => f.section)))

  return (
    <div className="w-full md:w-1/2 bg-neutral-50 dark:bg-neutral-950 overflow-y-auto">
      <div className="sticky top-0 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-3 z-10">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Live Preview</h2>
      </div>

      <div className="p-6 space-y-8">
        {sections.map((section) => {
          const sectionFields = fields.filter((f) => f.section === section)

          return (
            <section
              key={section}
              className="bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 capitalize border-b border-neutral-200 dark:border-neutral-800 pb-2">
                {section}
              </h3>
              <div className="space-y-4">
                {sectionFields.map((field) => (
                  <div key={field.id}>
                    <label className="text-xs text-neutral-500 dark:text-neutral-500 uppercase tracking-wider block mb-1">
                      {field.label}
                    </label>
                    {Array.isArray(field.value) ? (
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((item, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full text-sm"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-neutral-900 dark:text-white whitespace-pre-line">
                        {field.value || <span className="text-neutral-400 dark:text-neutral-600 italic">Empty</span>}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
