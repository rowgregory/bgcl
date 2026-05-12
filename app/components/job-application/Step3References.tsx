import { motion } from 'framer-motion'

export function Step3References({ formData, setFormData, errors }: any) {
  const updateReference = (index: number, field: string, value: any) => {
    const updatedReference = [...(formData.references || [])]
    if (!updatedReference[index]) {
      updatedReference[index] = {}
    }
    updatedReference[index][field] = value
    setFormData({ ...formData, references: updatedReference })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2">
          References
        </h3>
        <p className="dark:text-neutral-400 text-neutral-600 text-xs sm:text-sm">
          Please list the names of 3 work related references we may contact. Individuals with no prior work experience
          may list volunteer-related or school references such as teachers, coaches, counselors.
        </p>
      </div>

      {/* References */}
      <ol className="space-y-4 sm:space-y-6 list-none p-0 m-0" aria-label="Reference entries">
        {[0, 1, 2].map((index) => {
          const refNum = index + 1
          const nameId = `ref-${index}-name`
          const positionId = `ref-${index}-position`
          const relationshipId = `ref-${index}-relationship`
          const phoneId = `ref-${index}-phone`
          const emailId = `ref-${index}-email`

          const workRelationshipLength = formData.references?.[index]?.workRelationship?.length || 0

          return (
            <li key={index}>
              <motion.fieldset
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="dark:border-neutral-700 dark:bg-neutral-900/30 border-neutral-300 bg-neutral-100/30 border rounded-lg p-4 sm:p-6 transition-all border-dashed"
              >
                <legend className="text-sm sm:text-base font-bold dark:text-white text-neutral-900 px-1">
                  Reference {refNum}
                </legend>

                <div className="space-y-4 sm:space-y-6 mt-3">
                  {/* Reference Name */}
                  <div>
                    <label
                      htmlFor={nameId}
                      className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2"
                    >
                      Name{' '}
                      <span aria-hidden="true" className="text-red-500">
                        *
                      </span>
                      <span className="sr-only">(required)</span>
                    </label>
                    <input
                      id={nameId}
                      type="text"
                      value={formData.references?.[index]?.name || ''}
                      onChange={(e) => updateReference(index, 'name', e.target.value)}
                      aria-required="true"
                      aria-invalid={!!errors[`name_${index}`]}
                      aria-describedby={errors[`name_${index}`] ? `${nameId}-error` : undefined}
                      autoComplete="off"
                      maxLength={255}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-700 dark:border-neutral-600 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                      placeholder="John Smith"
                    />
                    {errors[`name_${index}`] && (
                      <p id={`${nameId}-error`} role="alert" className="text-red-500 text-xs sm:text-sm mt-1">
                        {errors[`name_${index}`]}
                      </p>
                    )}
                  </div>

                  {/* Position & Company */}
                  <div>
                    <label
                      htmlFor={positionId}
                      className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2"
                    >
                      Position &amp; Company{' '}
                      <span aria-hidden="true" className="text-red-500">
                        *
                      </span>
                      <span className="sr-only">(required)</span>
                    </label>
                    <input
                      id={positionId}
                      type="text"
                      value={formData.references?.[index]?.positionAndCompany || ''}
                      onChange={(e) => updateReference(index, 'positionAndCompany', e.target.value)}
                      aria-required="true"
                      aria-invalid={!!errors[`positionAndCompany_${index}`]}
                      aria-describedby={errors[`positionAndCompany_${index}`] ? `${positionId}-error` : undefined}
                      autoComplete="off"
                      maxLength={500}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-700 dark:border-neutral-600 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                      placeholder="Manager at Tech Company Inc."
                    />
                    {errors[`positionAndCompany_${index}`] && (
                      <p id={`${positionId}-error`} role="alert" className="text-red-500 text-xs sm:text-sm mt-1">
                        {errors[`positionAndCompany_${index}`]}
                      </p>
                    )}
                  </div>

                  {/* Work Relationship */}
                  <div>
                    <label
                      htmlFor={relationshipId}
                      className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2"
                    >
                      Work Relationship{' '}
                      <span aria-hidden="true" className="text-red-500">
                        *
                      </span>
                      <span className="sr-only">(required)</span>
                    </label>
                    <textarea
                      id={relationshipId}
                      value={formData.references?.[index]?.workRelationship || ''}
                      onChange={(e) => updateReference(index, 'workRelationship', e.target.value)}
                      aria-required="true"
                      aria-invalid={!!errors[`workRelationship_${index}`]}
                      aria-describedby={errors[`workRelationship_${index}`] ? `${relationshipId}-error` : undefined}
                      maxLength={1000}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-700 dark:border-neutral-600 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent min-h-24 transition-colors resize-none"
                      placeholder="Senior Software Engineer - Led team of 5, managed product roadmap, improved performance by 40%"
                    />
                    <p
                      className={`text-xs mt-1 text-right ${
                        workRelationshipLength >= 900 ? 'text-red-500' : 'text-neutral-400 dark:text-neutral-500'
                      }`}
                    >
                      {1000 - workRelationshipLength} characters remaining
                    </p>
                    {errors[`workRelationship_${index}`] && (
                      <p id={`${relationshipId}-error`} role="alert" className="text-red-500 text-xs sm:text-sm mt-1">
                        {errors[`workRelationship_${index}`]}
                      </p>
                    )}
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label
                        htmlFor={phoneId}
                        className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2"
                      >
                        Phone Number{' '}
                        <span aria-hidden="true" className="text-red-500">
                          *
                        </span>
                        <span className="sr-only">(required)</span>
                      </label>
                      <input
                        id={phoneId}
                        type="tel"
                        value={formData.references?.[index]?.phone || ''}
                        onChange={(e) => updateReference(index, 'phone', e.target.value)}
                        aria-required="true"
                        aria-invalid={!!errors[`phone_${index}`]}
                        aria-describedby={errors[`phone_${index}`] ? `${phoneId}-error` : undefined}
                        autoComplete="off"
                        maxLength={20}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-700 dark:border-neutral-600 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                        placeholder="(781) 593-1772"
                      />
                      {errors[`phone_${index}`] && (
                        <p id={`${phoneId}-error`} role="alert" className="text-red-500 text-xs sm:text-sm mt-1">
                          {errors[`phone_${index}`]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor={emailId}
                        className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2"
                      >
                        Email{' '}
                        <span aria-hidden="true" className="text-red-500">
                          *
                        </span>
                        <span className="sr-only">(required)</span>
                      </label>
                      <input
                        id={emailId}
                        type="email"
                        value={formData.references?.[index]?.email || ''}
                        onChange={(e) => updateReference(index, 'email', e.target.value)}
                        aria-required="true"
                        aria-invalid={!!errors[`email_${index}`]}
                        aria-describedby={errors[`email_${index}`] ? `${emailId}-error` : undefined}
                        autoComplete="off"
                        maxLength={255}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-700 dark:border-neutral-600 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                        placeholder="reference@example.com"
                      />
                      {errors[`email_${index}`] && (
                        <p id={`${emailId}-error`} role="alert" className="text-red-500 text-xs sm:text-sm mt-1">
                          {errors[`email_${index}`]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.fieldset>
            </li>
          )
        })}
      </ol>

      {/* Info Box */}
      <div
        role="note"
        className="dark:bg-sky-500/10 dark:border-sky-500/30 bg-sky-100 border-sky-300 rounded-lg p-3 sm:p-4 border mt-4"
      >
        <p className="dark:text-sky-300 text-sky-700 text-xs sm:text-sm">
          <span aria-hidden="true">💡 </span>
          <span className="sr-only">Tip: </span>
          If you do not have three work-related references, you may list volunteer or school references such as
          teachers, coaches, or counselors.
        </p>
      </div>
    </div>
  )
}
