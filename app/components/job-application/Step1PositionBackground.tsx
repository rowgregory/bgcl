import { POSITION_OPTIONS } from '@/app/lib/constants/job-application.constants'
import { PositionType } from '@prisma/client'

export function Step1PositionBackground({ formData, setFormData, errors }: any) {
  const togglePosition = (position: PositionType) => {
    const positions = formData.positionTypes || []
    if (positions.includes(position)) {
      setFormData({ ...formData, positionTypes: positions.filter((p: PositionType) => p !== position) })
    } else {
      setFormData({ ...formData, positionTypes: [...positions, position] })
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2">
          Position & Background
        </h3>
        <p className="dark:text-neutral-400 text-neutral-600 text-xs sm:text-sm">
          Tell us which position(s) you are applying for and a bit about your background.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Position Types */}
        <div className="md:col-span-2">
          <label className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2">
            Position(s) Applying For{' '}
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {POSITION_OPTIONS.map(({ value, label }) => {
              const selected = (formData.positionTypes || []).includes(value)
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => togglePosition(value as PositionType)}
                  aria-pressed={selected}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg border font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    selected
                      ? 'bg-sky-500 border-sky-500 text-white'
                      : 'dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-100 border-neutral-300 text-neutral-900'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
          {errors.positionTypes && (
            <p role="alert" className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.positionTypes}
            </p>
          )}
        </div>

        {/* Youth Org Employment */}
        <div className="md:col-span-2">
          <label
            htmlFor="youth-org-employment"
            className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2"
          >
            Youth Organization Employment{' '}
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <p className="dark:text-neutral-400 text-neutral-600 text-xs mb-2">
            Have you ever been employed by a youth serving organization? If yes, please provide dates of employment,
            location, and reason for separation.
          </p>
          <textarea
            id="youth-org-employment"
            value={formData.youthOrgEmployment || ''}
            onChange={(e) => setFormData({ ...formData, youthOrgEmployment: e.target.value })}
            aria-required="true"
            aria-invalid={!!errors.youthOrgEmployment}
            aria-describedby={errors.youthOrgEmployment ? 'youth-org-error' : undefined}
            rows={3}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-100 border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors resize-none"
            placeholder="e.g. Camp Sunshine, June 2021 – Aug 2022, Boston MA, End of seasonal contract"
            maxLength={1000}
          />
          <p
            className={`text-xs mt-1 text-right ${(formData.youthOrgEmployment?.length || 0) >= 900 ? 'text-red-500' : 'text-neutral-400 dark:text-neutral-500'}`}
          >
            {1000 - (formData.youthOrgEmployment?.length || 0)} characters remaining
          </p>
          {errors.youthOrgEmployment && (
            <p id="youth-org-error" role="alert" className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.youthOrgEmployment}
            </p>
          )}
        </div>

        {/* Education */}
        <div className="md:col-span-2">
          <label
            htmlFor="education"
            className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2"
          >
            Education{' '}
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <p className="dark:text-neutral-400 text-neutral-600 text-xs mb-2">
            List your education (High School, College, Graduate). Include school name, address, years attended and
            completed.
          </p>
          <textarea
            id="education"
            value={formData.education || ''}
            onChange={(e) => setFormData({ ...formData, education: e.target.value })}
            aria-required="true"
            aria-invalid={!!errors.education}
            aria-describedby={errors.education ? 'education-error' : undefined}
            rows={3}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-100 border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors resize-none"
            placeholder="e.g. Boston Latin School, 123 Ave Boston MA, 2015–2019, Graduated"
            maxLength={1000}
          />
          <p
            className={`text-xs mt-1 text-right ${(formData.education?.length || 0) >= 900 ? 'text-red-500' : 'text-neutral-400 dark:text-neutral-500'}`}
          >
            {1000 - (formData.education?.length || 0)} characters remaining
          </p>
          {errors.education && (
            <p id="education-error" role="alert" className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.education}
            </p>
          )}
        </div>

        {/* Extracurricular Skills */}
        <div className="md:col-span-2">
          <label
            htmlFor="extracurricular-skills"
            className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2"
          >
            Extracurricular Activities & Special Skills
          </label>
          <p className="dark:text-neutral-400 text-neutral-600 text-xs mb-2">
            Do you participate in any extracurricular activities or have any special skills?{' '}
            <span className="italic">Ex. sports, dance, music, art</span>
          </p>
          <textarea
            id="extracurricular-skills"
            value={formData.extracurricularsSkills || ''}
            onChange={(e) => setFormData({ ...formData, extracurricularsSkills: e.target.value })}
            rows={3}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-100 border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors resize-none"
            placeholder="e.g. Soccer coach, piano, watercolor painting"
            maxLength={1000}
          />
          <p
            className={`text-xs mt-1 text-right ${(formData.extracurricularsSkills?.length || 0) >= 900 ? 'text-red-500' : 'text-neutral-400 dark:text-neutral-500'}`}
          >
            {1000 - (formData.extracurricularsSkills?.length || 0)} characters remaining
          </p>
        </div>
      </div>
    </div>
  )
}
